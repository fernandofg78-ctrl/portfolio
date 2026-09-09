# Sistema de usuarios demo — CaminoSantiago Sandbox

> Documento interno de referencia. No forma parte del portfolio público.
> Última actualización: sesión del 9 de septiembre de 2026.

## Objetivo

Permitir que visitantes del portfolio (`/panels`, tema Groovy) entren al
sandbox de CaminoSantiago.app ya autenticados como uno de varios roles reales
de la plataforma, sin pasar por un login manual, y sin tocar la
autenticación ni los datos de producción.

## Infraestructura

| Componente | Detalle |
|---|---|
| Sandbox frontend | `https://camino-web-sandbox.vercel.app` (proyecto Vercel separado de producción) |
| Backend | Compartido con producción — Hono en Render (`camino-api.onrender.com`) |
| Supabase sandbox | Proyecto `lmrmmxvkohbzgfljhsiw`, restaurado vía Docker/pg_dump desde producción |
| Endpoint de entrada | `/es/demo-login?role=X` (Route Handler en `apps/web/src/app/demo-login/route.ts`) |
| Repo | Monorepo `camino-app` — `apps/web` (Next.js) + `apps/api` (Hono) |

Presupuesto: $0. No se crearon servicios de pago nuevos; se reutiliza el
backend de Render existente con variables de entorno diferenciadas por
prefijo `SANDBOX_`.

## Usuarios demo (UUIDs fijos)

| Rol | UUID | Usuario / alias | Entidad vinculada |
|---|---|---|---|
| Peregrino | `0762e5ac-b04c-4b85-a29d-0371e1076ca3` | `nandoxido` | — (sin entidad, es el propio perfil) |
| Albergue | `c3398696-0634-4655-9908-01074a2621e8` | `demo-hostelero` | Refugio Gaucelmo (`07cd8c4f-0dbe-4383-ae3a-cb2feee734f7`), vía `albergue_gestores` |
| Negocio | `1c4c474e-0f99-49a6-8163-569e85ae675a` | `demo-negocio` | Super Spar María Jesus (`37f811c6-9cab-4132-97b6-13a4cfb4e043`), vía `negocio_gestores` |
| Admin | `edcaa082-4ef6-4f68-bf99-c209c165eabe` | `demo-admin` | — (`rol: 'admin'` en tabla `perfiles`) |

Nota histórica: el usuario negocio estuvo vinculado inicialmente a
"La Parada de Chozas de Abajo", pero ese negocio tenía gestores reales
asociados — se hizo `DELETE` del vínculo previo e `INSERT` nuevo apuntando
a Super Spar María Jesus para evitar interferir con datos reales.

Rutas de destino tras login por rol (confirmadas por `tree` real en disco;
ojo, `albergue` y `negocio` cuelgan de `admin/` pero `perfil` no — inconsistencia
histórica del proyecto, no bloqueante):

```
peregrino → /es/perfil
albergue  → /es/admin/mi-albergue
negocio   → /es/admin/mi-negocio
admin     → /es/admin/peregrinos
```

## Arquitectura de autenticación demo

Se descartó el enfoque inicial (`admin.generateLink` + `verifyOtp` para crear
una sesión Supabase real) porque la sesión no se propagaba de forma fiable
a Server Components ni a fetches posteriores tras el redirect.

**Arquitectura final — token propio firmado:**

1. `demo-login/route.ts` resuelve el `entityId` del usuario (si aplica,
   consultando `albergue_gestores` / `negocio_gestores` con el cliente
   admin) **una sola vez**, en el momento del login.
2. Genera un token propio con HMAC (`DEMO_AUTH_SECRET`), payload:
   ```ts
   { uid: string, role: string, entityId: string | null, demo: true, exp: number }
   ```
   — **no** es un JWT de Supabase.
3. Lo guarda como cookie `camino_demo_token` (`sameSite: lax`, `secure: true`,
   `maxAge: 2h`) en la respuesta de redirect.
4. Se descartó explícitamente pasar el token por query param o `localStorage`:
   las Server Components de Next.js comprueban la sesión antes de que el
   cliente pudiera capturar nada de esa vía.

**Lectura del token (server-side):**

Helper en `apps/web/src/lib/demo/demoTokenServer.ts`:
- `resolverUsuarioDemo()` → devuelve el payload completo (`uid`, `role`,
  `entityId`) para que las páginas lo lean sin volver a decodificar nada.
- `obtenerTokenDemoVerificado()` → devuelve el token crudo verificado, para
  usarlo como `Bearer` / `X-Auth-Token` en llamadas a `apps/api`.

Cada `page.tsx` protegida llama a `resolverUsuarioDemo()` al inicio; si hay
token demo válido, se usa en vez de la sesión Supabase normal, y
opcionalmente se instancia `createAdminClient()` (apunta al proyecto
sandbox en ese deployment).

**Backend (`apps/api`):**

- `middleware/demoAuth.ts` — `parece TokenDemo()` / `verificarTokenDemo()`
  detectan y validan el token demo.
- `middleware/auth.ts` tiene una rama demo: si el token es válido, monta un
  cliente `service_role` de sandbox (`SANDBOX_SUPABASE_URL` /
  `SANDBOX_SUPABASE_SERVICE_ROLE_KEY`) y lo sube al contexto Hono vía
  `c.set('supabase', ...)`.
- Rutas afectadas (`negocios/panel.ts`, `admin/albergues.ts`,
  `peregrino/perfil.ts`) se cambiaron de un `getSupabase()` local
  hardcodeado a producción, a usar `c.get('supabase')`.

Todo esto vive en archivos y ramas de código nuevas, sin tocar la lógica de
auth real de producción — requisito explícito desde el principio.

## Estado final por rol

| Rol | Estado |
|---|---|
| Peregrino | ✅ Funciona completo |
| Albergue | ✅ Funciona completo |
| Admin | ⚠️ Funciona (listado de peregrinos), pero pierde sesión al entrar en el detalle de un albergue concreto. Aceptado tal cual — no prioritario. |
| Negocio | ❌ Descartado. Mismo síntoma que las versiones anteriores: entra logueado pero no "termina de entrar" al panel. `MiNegocioPanel.tsx` ya estaba correcto (recibe token por prop, usa `X-Auth-Token`, sin `useEffect` propio leyendo sesión — que sí era el bug real que tuvo en su día `AlberguePanel.tsx`). Sospecha sin confirmar: o el `mi-negocio/page.tsx` con la rama demo no llegó a desplegarse correctamente, o falla algo puntual en la resolución del `entityId` para negocio específicamente. **Decisión: no se sigue investigando.** El `RoleSelector` del portfolio queda con 3 roles (peregrino / albergue / admin), suficiente para la demo. |

## Riesgo conocido y aceptado (sin mitigar)

La pestaña **"Acceso"** (invitar hospitalero) dentro del panel de albergue
sigue escribiendo en Supabase de **producción real** y mandando **emails
reales** si un admin demo la usa. No se ha bloqueado. Mitigación futura
posible: ocultar esa pestaña específica cuando se detecta `role === 'demo'`.

## Lecciones para reutilizar en otros sistemas de demo

- Un token propio (HMAC, cookie httpOnly-less con `sameSite: lax`) es más
  fiable que intentar simular una sesión real de Supabase vía magic link —
  evita problemas de propagación de cookies en Server Components.
- Resolver relaciones (`entityId`) una sola vez, en el login, y guardarlas
  en el payload del token — evita repetir esa consulta en cada página.
- Componentes que leen su propio estado de sesión (`useEffect` +
  `getSession()`) rompen este patrón; deben recibir el token/rol por prop
  desde el Server Component padre.
- Vale la pena fijar un límite de tiempo/intentos antes de perseguir un bug
  de "última milla" en un sistema secundario (demo) que no bloquea el
  producto principal.
