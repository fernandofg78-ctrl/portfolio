# Debug del panel demo (sandbox) de ObrasDeNivel — sesión completa

**Fecha:** septiembre 2026
**Proyecto:** ObrasDeNivel — sandbox de demo para portfolio (`obras-de-nivel-sandbox.vercel.app`)
**Duración:** múltiples sesiones repartidas en varios días

---

## 1. Síntoma inicial

Al navegar entre pestañas del panel demo (roles `tenant` y `superadmin`), la sesión se perdía y el usuario acababa redirigido a `/login`, sin haber cerrado sesión de forma explícita.

Comportamiento errático a lo largo de la sesión de debug:
- A veces fallaba solo al navegar a una sección concreta.
- A veces fallaba en la primera interacción tras el login.
- A veces funcionaba bien en unas rutas y mal en otras del mismo nivel.
- Una vez "arreglado" un problema, el síntoma cambiaba de forma en vez de desaparecer — señal de que había **varias causas distintas superpuestas**, no un único bug.

---

## 2. Arquitectura relevante (recordatorio)

- Next.js 16 App Router, con Hono montado **dentro** de Next.js (no como servicio separado) vía `/api/v1/[[...route]]`.
- Auth demo basada en cookie HMAC-firmada (`obras_demo_token`), verificada con `DEMO_AUTH_SECRET`, generada en `demo-login/route.ts`.
- Tres puntos distintos donde se puede necesitar reconocer al usuario demo:
  1. **Server Components** (páginas `page.tsx` en `/admin/*`) → vía `resolverUsuarioDemo()` en `demoTokenServer.ts` (usa `next/headers`).
  2. **`proxy.ts`** (middleware de Next.js que protege rutas) → lee la cookie directamente de `NextRequest.cookies`.
  3. **Rutas de API Hono** (`lib/api/routes/*`) → vía `authMiddleware` en `lib/api/middleware/auth.ts`, que inyecta el cliente Supabase en el contexto de Hono (`c.set('supabase', ...)`).

Estos tres puntos son **código distinto, con distinta forma de leer la cookie**, y cada uno tuvo que arreglarse por separado. Ese fue el principal motivo de que el debug se alargara: arreglar uno no arreglaba los otros, y daba la falsa sensación de progreso parcial o de que el bug "cambiaba".

---

## 3. Causas raíz encontradas (en orden de aparición)

### 3.1 — El middleware de Hono (`authMiddleware`) no tenía rama demo

**Archivo:** `apps/web/lib/api/middleware/auth.ts`

El middleware que se ejecuta en cada llamada a la API solo sabía resolver el cliente Supabase a partir de:
- Un header `Authorization: Bearer` / `X-Auth-Token`, o
- Una sesión real de Supabase vía cookies (`createClient()`).

Para el usuario demo no existe ninguna de las dos cosas, así que cualquier `fetch` desde el frontend a la API devolvía `{"error": "No autenticado"}` (401), aunque el primer render de la página (vía Server Component) sí reconociera al usuario demo.

**Síntoma que producía:** el panel cargaba bien al entrar, pero cualquier interacción que hiciera un `fetch` a la API (cambiar de pestaña, cargar presupuestos, etc.) fallaba y acababa tirando a la sesión abajo.

**Fix:** añadir una rama al middleware que:
1. Lee la cookie `obras_demo_token` con `getCookie()` de `hono/cookie` (¡no con `next/headers`, que no funciona en el contexto de un handler de Hono!).
2. Verifica la firma con `verifyDemoSignature()`.
3. Si es válida, inyecta un cliente `service_role` (`createDemoClient()`) en el contexto y guarda los datos del usuario demo (`c.set('demoUser', {...})`).
4. Si no hay cookie demo, cae a la lógica original sin tocarla (fail-open hacia el flujo real, nunca al revés).

---

### 3.2 — Páginas de servidor (`page.tsx`) con su propia comprobación de auth, repetida y sin rama demo

**Archivos afectados:** `admin/proyectos/page.tsx`, `admin/clientes/page.tsx`, `admin/web/page.tsx` (y potencialmente otras subpáginas no revisadas).

Cada una de estas páginas repetía el mismo bloque:

```ts
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect("/login");

const { data: usuario } = await supabase
  .from("usuarios")
  .select("tenant_id")
  .eq("id", user.id)
  .single();
if (!usuario?.tenant_id) redirect("/login");
```

Ninguna contemplaba al usuario demo. El dashboard de superadmin sí lo hacía bien porque se le había añadido esa lógica en un momento anterior del desarrollo — sirvió de referencia para el fix, pero puso de manifiesto que el patrón no se había propagado al resto de páginas.

**Síntoma que producía:** navegar a "Clientes", "Proyectos" o "Gestor web" con el usuario demo redirigía directamente a `/login`, mientras que "Presupuestos" (que es un Client Component que solo llama a la API) no se veía afectado por este bug concreto.

**Fix:** helper único `resolverContextoTenant()` en `lib/demo/resolverContextoTenant.ts`, que centraliza la lógica: si hay usuario demo válido, devuelve el cliente `service_role` + el `tenant_id` embebido en el token; si no, hace la comprobación real de siempre. Cada página pasó de ~10 líneas de boilerplate a una sola llamada:

```ts
const { supabase, tenantId } = await resolverContextoTenant();
```

**Nota de alcance:** deliberadamente **no** se revisaron todas las subpáginas de `/admin/*` de forma preventiva (por ejemplo `admin/proyectos/[id]`, `admin/web/portada`, etc.). Se decidió arreglar bajo demanda, solo cuando se detecta un fallo real navegando la demo, dado que el objetivo es una demo de portfolio, no una réplica exhaustiva del panel completo.

---

### 3.3 — Rutas de API (`presupuestos.ts`, `lineas.ts`) con el mismo problema, un nivel más abajo

**Archivos afectados:** `lib/api/routes/presupuestador/presupuestos.ts`, `lib/api/routes/presupuestador/lineas.ts`.

Aunque el middleware de Hono (3.1) ya inyectaba un cliente `service_role` para el usuario demo, **cada handler individual volvía a llamar a `supabase.auth.getUser()` por su cuenta** para sacar el `tenant_id`:

```ts
const { data: { user } } = await supabase.auth.getUser();
if (!user) return c.json({ error: "No autorizado" }, 401);
```

Un cliente `service_role` recién creado (`createDemoClient()`) **no tiene sesión real**, así que `auth.getUser()` devuelve `user: null` siempre, aunque el cliente tenga permisos de sobra a nivel de base de datos. El handler devolvía 401 igualmente, ignorando el `demoUser` que el middleware ya había dejado disponible en el contexto de Hono.

**Síntoma que producía:** el listado de presupuestos parecía funcionar a medias (por cómo el frontend maneja el `data` ausente sin lanzar error visible), pero al entrar al detalle de un presupuesto concreto (`GET /:id`), la petición fallaba en silencio y el editor se quedaba vacío, sin ningún aviso.

**Fix:** helper `resolverTenantApi()` en `lib/api/demoContext.ts`, equivalente al de las páginas de servidor pero para el contexto de Hono — usa `getDemoUser(c)` (ya expuesto por el middleware) si existe, y si no, hace la comprobación real de siempre. Se aplicó a **todos** los handlers de `presupuestos.ts` y `lineas.ts` (list, detalle, crear, editar, borrar, cambiar estado, duplicar).

---

### 3.4 — Variables de entorno ausentes en `turbo.json`

**Archivo:** `turbo.json` (raíz del monorepo).

Turborepo solo garantiza que una variable de entorno esté disponible de forma fiable en build/runtime si está declarada en el array `env` de la tarea `build`. `DEMO_AUTH_SECRET` (y otras: `SUPABASE_ACCESS_TOKEN`, `ANTHROPIC_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `CLOUDINARY_URL`) estaban configuradas en Vercel pero **no** en `turbo.json`, y Vercel avisaba de ello en cada build con un warning fácil de pasar por alto:

```
Warning - the following environment variables are set on your Vercel project,
but missing from "turbo.json". These variables WILL NOT be available to
your application...
```

Esto ya estaba documentado como aprendizaje de una sesión anterior (ver sección 5), pero se había vuelto a colar.

**Fix:** añadir las variables faltantes al array `env` de `turbo.json`.

**Efecto colateral importante:** al corregir `turbo.json`, Turborepo invalidó el caché de build y forzó por primera vez en mucho tiempo un **build completamente fresco** (`cache miss`). Esto reveló que builds anteriores durante la sesión de debug probablemente se habían servido desde caché, lo cual explica parte de la sensación de comportamiento "intermitente" o "que empeora sin razón" — en realidad, en algunos momentos no estábamos ni siquiera probando el código que creíamos estar probando.

---

## 4. Callejones sin salida (para no repetirlos)

Documentamos también las hipótesis descartadas, porque el razonamiento de por qué no aplicaban es tan útil como el fix final.

### 4.1 — "Es el runtime Edge de Next.js"

**Hipótesis:** `proxy.ts` corre en el runtime Edge por defecto, que no soporta bien el módulo `crypto` de Node (`createHmac`, `timingSafeEqual`), y por eso `verifyDemoSignature` fallaba de forma intermitente.

**Por qué parecía plausible:** es un problema real y documentado en Next.js, y coincidía con el patrón de "funciona en el primer render (Node) pero falla en navegaciones posteriores (Edge)".

**Por qué era incorrecta en este caso:** en Next.js 16, el archivo de middleware se renombra a `proxy.ts` precisamente porque es una **nueva convención que corre siempre en Node.js**, nunca en Edge. Al intentar forzar `runtime: "nodejs"` en el `config`, el build falló con un mensaje explícito:

```
Error: Route segment config is not allowed in Proxy file at "./proxy.ts".
Proxy always runs on Node.js runtime.
```

**Lección:** no asumir el comportamiento de versiones anteriores de un framework sin comprobar el changelog de la versión exacta en uso. `next@16.2.0` cambió esto respecto a versiones anteriores.

### 4.2 — "Hay un interceptor de fetch que limpia la sesión en un 401"

**Hipótesis:** algún wrapper centralizado de `fetch` reacciona a un 401 borrando la cookie o forzando redirect, y por eso cualquier interacción (no solo una ruta) tumbaba la sesión entera.

**Cómo se descartó:** búsqueda exhaustiva con `Get-ChildItem | Select-String` (PowerShell) de patrones como `401`, `apiFetch`, `interceptor`, `fetchWithAuth`. No apareció ningún wrapper de ese tipo — cada `fetch` se hace directamente desde los componentes.

**Lección:** antes de sospechar de lógica "invisible" (interceptores, wrappers globales), confirmar con una búsqueda en el código que existen. Ahorra descartar hipótesis de forma rápida y barata antes de instrumentar nada.

### 4.3 — "Cookies antiguas de una sesión real de Supabase interfieren con la cookie demo"

**Hipótesis:** si el navegador tenía cookies de sesión real de Supabase de pruebas anteriores, la lógica `getAll/setAll` de `createServerClient` en `proxy.ts` podría reescribirlas de forma que interfiriera con la cookie demo en la misma respuesta.

**Cómo se descartó:** se probó el flujo completo en una ventana de incógnito (sin cookies previas) y el problema persistía igual.

**Lección:** probar en incógnito es una forma rápida y barata de descartar interferencia de estado previo del navegador antes de sospechar del código.

### 4.4 — "El token demo expira demasiado pronto (`exp` mal calculado)"

**Hipótesis:** el patrón de tiempos en los logs (funciona ~5-10s tras el login, luego falla) sugería un `TOKEN_TTL_SECONDS` mal calculado.

**Cómo se descartó:** al revisar `demo-login/route.ts`, el TTL era de 1 hora, coincidente con el `maxAge` de la cookie — no había ningún problema de expiración real. El patrón de tiempos era casualidad / correlación con otra causa (probablemente builds cacheados distintos en cada prueba).

**Lección:** un patrón temporal que "parece" apuntar a una causa no siempre la confirma — hay que verificar el valor real en el código antes de dar la hipótesis por buena.

### 4.5 — Poner logs en `proxy.ts` (repetido de una sesión anterior)

En un momento se propuso instrumentar `proxy.ts` con `console.log` para depurar vía Vercel Runtime Logs. Ya se había hecho esto en una sesión de trabajo anterior sin llegar a ninguna conclusión útil, así que se descartó repetir el enfoque y en su lugar se usó una vía alternativa: un parámetro de query (`?debugdemo=1`) que, en vez de redirigir, devolvía un JSON con el diagnóstico directamente en la respuesta HTTP — visible en la pestaña Network del navegador, sin depender de logs de servidor.

**Lección:** si un método de debug ya demostró no ser productivo en el pasado para una parte concreta del código, vale la pena cambiar de método en vez de repetirlo esperando un resultado distinto. Exponer el diagnóstico directamente en la respuesta HTTP (protegido por un query param) es una alternativa válida a los logs de servidor cuando estos no son accesibles o no han sido útiles antes.

---

## 5. Aprendizajes reutilizables (generalizables a otros proyectos)

1. **Cuando una funcionalidad transversal (como "modo demo") se implementa parcheando un solo punto de entrada, hay que auditar TODOS los lugares donde se repite la misma comprobación de auth.** En este proyecto había tres capas independientes (Server Components, middleware de Next, middleware de Hono) y dentro de cada una, múltiples archivos con el mismo bloque de código copiado y pegado. Centralizar esa lógica en un helper compartido no es solo más limpio — es la única forma de garantizar que un fix se propague a todos los sitios que lo necesitan.

2. **`turbo.json` y variables de entorno:** cualquier variable nueva usada en tiempo de ejecución (no solo en build) debe añadirse al array `env` de la tarea correspondiente en `turbo.json`, o Turborepo no garantiza que llegue de forma consistente. Vercel avisa de esto en el log de build con un `WARNING` fácil de pasar por alto — conviene revisar esa sección del log activamente tras cualquier cambio de variables de entorno.

3. **Los builds cacheados pueden enmascarar o falsear el diagnóstico de un bug intermitente.** Si el comportamiento de un bug "cambia sin razón aparente" entre pruebas, vale la pena verificar en el log de Vercel si el build fue `cache miss` (fresco) o si reutilizó cache — sobre todo tras cambios en middleware o archivos de configuración que no siempre invalidan el hash de caché de forma obvia.

4. **Un cliente Supabase `service_role` no tiene sesión — `auth.getUser()` sobre él siempre devuelve `null`.** Si se usa un cliente `service_role` para impersonar a un usuario demo, cualquier código que dependa de `auth.getUser()` para identificar al usuario debe reemplazarse por lógica explícita (pasar el ID/tenant por otro canal, como el contexto de Hono o los datos ya verificados del token demo).

5. **Diseño "fail-open hacia el flujo real, nunca al revés":** en todas las ramas demo añadidas, si la cookie/token demo no está presente o no verifica, el código cae al comportamiento original (exigir sesión real), nunca al revés. Esto garantiza que un usuario real nunca se ve afectado por la existencia del código demo, incluso si hay un bug en la lógica demo.

6. **Vercel Middleware/Proxy en Next.js 16:** el archivo `proxy.ts` (nueva convención, sustituye a `middleware.ts`) corre siempre en runtime Node.js. No hace falta (ni se permite) forzar `runtime: "nodejs"` en su `config`. Comprobar el comportamiento exacto de la versión de Next.js en uso antes de aplicar soluciones válidas en versiones anteriores.

---

## 6. Bugs no relacionados, resueltos en la misma sesión

Por completitud, en esta misma sesión de trabajo también se resolvieron dos problemas independientes del panel demo:

### 6.1 — CSS responsive del `DocsModal` (portfolio)

El modal de documentación técnica (estética tipo editor de código) no se adaptaba bien a móvil. Causas: `.dc-body` sin `flex: 1; min-height: 0` (impedía el scroll interno correcto), padding excesivo en pantallas pequeñas, tablas sin scroll horizontal propio, y nombres de archivo largos sin `text-overflow: ellipsis`. Ver `DocsModal.css` para el detalle completo de los fixes.

### 6.2 — 404 real de Vercel al navegar hacia atrás en el portfolio (SPA sin `vercel.json`)

El portfolio (Vite + React Router, 4 temas independientes) no tenía un `vercel.json` con rewrite a `index.html`. Cuando el navegador hacía una recarga completa de página (en vez de una navegación SPA interceptada por React Router) — algo que ocurre al pulsar "atrás" repetidamente — Vercel intentaba resolver la ruta como un archivo físico y devolvía un 404 real de la plataforma (`NOT_FOUND`), no el componente `NotFound` de React.

**Fix:** crear `vercel.json` en la raíz del proyecto del portfolio:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Lección:** cualquier SPA (Vite, CRA, etc.) desplegada en Vercel sin un framework preset que lo gestione automáticamente (a diferencia de Next.js) necesita este rewrite explícito. Su ausencia no da error en desarrollo local ni en navegación normal dentro de la app — solo se manifiesta en recargas completas o accesos directos a rutas internas, lo cual puede pasar desapercibido durante mucho tiempo.

---

## 7. Archivos finales modificados/creados en esta sesión

| Archivo | Tipo de cambio |
|---|---|
| `apps/web/lib/api/middleware/auth.ts` | Modificado — rama demo añadida |
| `apps/web/lib/demo/resolverContextoTenant.ts` | Nuevo — helper para Server Components |
| `apps/web/lib/api/demoContext.ts` | Nuevo — helper para rutas Hono |
| `apps/web/app/(dashboard)/admin/proyectos/page.tsx` | Modificado — usa el helper |
| `apps/web/app/(dashboard)/admin/clientes/page.tsx` | Modificado — usa el helper |
| `apps/web/app/(dashboard)/admin/web/page.tsx` | Modificado — usa el helper |
| `apps/web/lib/api/routes/presupuestador/presupuestos.ts` | Modificado — usa el helper en todos los handlers |
| `apps/web/lib/api/routes/presupuestador/lineas.ts` | Modificado — usa el helper en todos los handlers |
| `turbo.json` | Modificado — variables de entorno añadidas al array `env` |
| `apps/web/proxy.ts` | Sin cambios netos (se probó y revirtió `runtime: "nodejs"`) |
| `frontend/vercel.json` (portfolio) | Nuevo — rewrite SPA |
| `frontend/src/components/modal/DocsModal.css` (portfolio) | Modificado — fixes responsive |

**Pendiente / fuera de alcance de esta sesión:** subpáginas de `/admin/*` no auditadas de forma preventiva (se arreglarán bajo demanda si se detecta un fallo real navegando la demo).
