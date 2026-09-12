# Guía: implementar un modo demo/sandbox con auth aislada (Next.js + Supabase)

**Contexto:** patrón probado en dos proyectos con arquitecturas distintas —
**ObrasDeNivel** (Hono montado dentro de Next.js, un único deploy en Vercel) y
**CaminoSantiago** (Hono standalone en Render, deploy separado del frontend Next.js en Vercel).
Pensada para reutilizar en cualquier proyecto Next.js + Supabase donde se quiera
mostrar un panel de administración funcional a terceros (reclutadores, clientes
potenciales) sin exponer cuentas ni datos reales.

---

## 1. Principio de diseño: aditivo y aislado, nunca invasivo

Antes de cualquier línea de código, fijar estas reglas y no romperlas:

1. **Cero modificaciones a los flujos de auth real existentes.** Todo lo nuevo se añade como una rama adicional que se comprueba *antes* de la lógica real, y que cae (fail-open) hacia el flujo real si no aplica.
2. **Un usuario real nunca debe poder activar accidentalmente el modo demo**, ni un fallo en el código demo debe poder bloquear a un usuario real.
3. **El acceso demo se basa en un secreto que solo tú conoces** (`DEMO_AUTH_SECRET`), nunca en credenciales reales ni en lógica adivinable por URL.
4. **Los datos que ve el usuario demo deben ser de un proyecto Supabase de sandbox** (o una copia/subset), nunca la base de datos de producción con clientes reales.

---

## 2. Arquitectura del mecanismo de auth demo

### 2.1 — Cookie firmada con HMAC (no JWT de librería, HMAC manual es suficiente)

Un token de la forma `payload_base64url.firma_base64url`, donde:
- `payload` incluye como mínimo: `uid`, `role`, `tenantId` (si aplica), `demo: true`, `exp` (timestamp Unix de expiración).
- `firma` es un HMAC-SHA256 del payload, firmado con `DEMO_AUTH_SECRET`.

```ts
// verifyDemoSignature.ts — lógica compartida de firma/verificación
import crypto from "crypto";

export interface DemoPayload {
  uid: string;
  role: string;
  tenantId?: string;
  demo: true;
  exp: number;
}

export function verifyDemoSignature(token: string, secret: string): DemoPayload | null {
  const [payloadStr, signature] = token.split(".");
  if (!payloadStr || !signature) return null;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payloadStr)
    .digest("base64url");

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (sigBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, "base64url").toString());
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (payload.demo !== true) return null;
    return payload;
  } catch {
    return null;
  }
}
```

**Por qué HMAC manual y no una librería JWT:** el payload es mínimo y controlado por ti mismo (no hay necesidad de claims estándar, rotación de claves, ni interoperabilidad con terceros). Menos dependencias, menos superficie de fallo, y el código cabe en un archivo que puedes auditar de un vistazo.

### 2.2 — Ruta de login demo (Route Handler)

Genera el token y fija la cookie. Debe validar el `role` recibido contra una lista cerrada de usuarios demo predefinidos — nunca aceptar un `uid`/`tenantId` arbitrario desde la query string.

```ts
// demo-login/route.ts
const DEMO_USERS = {
  tenant: { uid: "...", role: "tenant", tenantId: "..." },
  superadmin: { uid: "...", role: "superadmin" },
} as const;

// GET /demo-login?role=tenant|superadmin
// 1. valida `role` contra DEMO_USERS (whitelist cerrada)
// 2. construye el payload + exp (TTL típico: 1h)
// 3. firma con DEMO_AUTH_SECRET
// 4. fija la cookie (httpOnly: false si el frontend necesita leerla, sameSite: "lax")
// 5. redirige al panel correspondiente según el rol
```

**Puntos críticos:**
- `httpOnly: false` es intencional en este patrón porque en algún punto puede convenir leer la cookie desde el cliente (p. ej. para banners "estás en modo demo"). Si no lo necesitas, usa `httpOnly: true` por defecto — más seguro.
- TTL razonable (1h). No hace falta refresco — si expira, el usuario simplemente vuelve a `/demo-login`.

---

## 3. Los tres puntos de integración (y por qué hay que cubrir los tres)

Esta es la parte que más tiempo costó en la práctica: **una app Next.js + Supabase tiene múltiples capas independientes que comprueban auth por su cuenta**, y el modo demo tiene que integrarse en cada una. Omitir una capa no rompe el build ni lanza un error claro — simplemente esa capa concreta sigue exigiendo una sesión real, y el síntoma es "funciona a medias" o "falla solo en ciertas páginas/acciones", muy confuso de diagnosticar si no se sabe de antemano que hay que revisar las tres.

### 3.1 — Middleware/Proxy de Next.js (protección de rutas de página)

Archivo `proxy.ts` (Next.js ≥16) o `middleware.ts` (versiones anteriores). Se ejecuta antes de renderizar cualquier página.

```ts
const demoToken = request.cookies.get("demo_token")?.value;
const demoPayload = demoToken && process.env.DEMO_AUTH_SECRET
  ? verifyDemoSignature(demoToken, process.env.DEMO_AUTH_SECRET)
  : null;

if (!user && !isPublicRoute && !isAuthRoute) {
  if (demoPayload) return supabaseResponse; // ← deja pasar
  return NextResponse.redirect(new URL("/login", request.url));
}
```

**Nota Next.js 16:** el archivo se llama `proxy.ts` y corre siempre en runtime Node.js — no se puede (ni hace falta) forzar `runtime: "nodejs"` en su `config`. En versiones anteriores de Next.js, el middleware corría en Edge por defecto y el soporte de Node.js runtime era experimental (`experimental.nodeMiddleware` en `next.config.js`) — comprobar la versión exacta antes de asumir cuál aplica.

### 3.2 — Server Components (páginas `page.tsx`)

Cada página que hace su propia consulta a Supabase directamente (patrón típico: `const supabase = await createClient(); const { user } = await supabase.auth.getUser(); if (!user) redirect('/login')`) necesita saber también del usuario demo — el middleware de 3.1 solo decide si te deja *entrar* a la ruta, pero la página en sí vuelve a comprobar auth por su cuenta para saber qué datos consultar.

**Solución: centralizar en un único helper, no repetir por página.**

```ts
// lib/demo/resolverContextoTenant.ts
export async function resolverContextoTenant() {
  const demoUser = await resolverUsuarioDemo(); // lee cookie vía next/headers + verifica

  if (demoUser) {
    return {
      supabase: createDemoClient(), // cliente service_role
      tenantId: demoUser.tenantId,
      esDemo: true,
    };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: usuario } = await supabase
    .from("usuarios").select("tenant_id").eq("id", user.id).single();
  if (!usuario?.tenant_id) redirect("/login");

  return { supabase, tenantId: usuario.tenant_id, esDemo: false };
}
```

Cada página pasa de ~10 líneas repetidas a:

```ts
const { supabase, tenantId } = await resolverContextoTenant();
```

**Por qué esto importa tanto:** si en vez de un helper compartido se parchea página por página, es prácticamente seguro que alguna se queda fuera — y el fallo resultante (redirect silencioso a login) no da ninguna pista de *cuál* página es la culpable hasta que alguien navega hasta ella.

### 3.3 — Rutas de API (Hono, Express, Route Handlers de Next.js, etc.)

Si el backend tiene su propio middleware de auth (por ejemplo un `authMiddleware` de Hono que inyecta el cliente Supabase en el contexto de cada request), ese middleware necesita su propia rama demo — **independiente** de las dos anteriores, porque corre en un ciclo de vida distinto (una petición `fetch` desde el cliente, no una navegación de página).

```ts
// middleware de Hono
export const authMiddleware = async (c, next) => {
  const demoToken = getCookie(c, "demo_token"); // ¡usar el cookie helper del framework
                                                  // del backend, NO next/headers!
  const demoPayload = demoToken && process.env.DEMO_AUTH_SECRET
    ? verifyDemoSignature(demoToken, process.env.DEMO_AUTH_SECRET)
    : null;

  if (demoPayload) {
    c.set("supabase", createDemoClient());
    c.set("demoUser", { id: demoPayload.uid, rol: demoPayload.role, tenant_id: demoPayload.tenantId });
    await next();
    return;
  }

  // ... lógica real sin cambios
};
```

**Error común a evitar:** dar por hecho que, una vez el middleware inyecta el cliente `service_role`, los handlers individuales ya "saben" que es un usuario demo. **No es así si cada handler vuelve a llamar a `supabase.auth.getUser()` por su cuenta** para sacar el `tenant_id` — un cliente `service_role` recién creado no tiene sesión, así que `auth.getUser()` devuelve `null` siempre, y el handler devolverá 401 aunque el middleware haya hecho bien su parte.

**Solución, igual que en 3.2: un helper compartido para los handlers**, que primero mira si el middleware ya dejó un `demoUser` en el contexto:

```ts
// lib/api/demoContext.ts
export async function resolverTenantApi(c: Context) {
  const supabase = getSupabaseClient(c);
  const demoUser = getDemoUser(c); // lo que el middleware ya dejó en el contexto

  if (demoUser) {
    if (!demoUser.tenant_id) return null;
    return { supabase, tenantId: demoUser.tenant_id };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: usuario } = await supabase
    .from("usuarios").select("tenant_id").eq("id", user.id).single();
  if (!usuario?.tenant_id) return null;

  return { supabase, tenantId: usuario.tenant_id };
}
```

Cada handler:

```ts
.get("/:id", async (c) => {
  const ctx = await resolverTenantApi(c);
  if (!ctx) return c.json({ error: "No autorizado" }, 401);
  const { supabase, tenantId } = ctx;
  // ... resto del handler usando tenantId en vez de usuario.tenant_id
})
```

---

## 4. Checklist de verificación antes de dar por cerrada la implementación

- [ ] `DEMO_AUTH_SECRET` está declarado en Vercel (entorno Production como mínimo) **y** en el array `env` de `turbo.json` (si usas Turborepo) — si falta de ahí, el build puede no fallar pero la variable no estará disponible de forma fiable en runtime.
- [ ] El middleware/proxy de Next.js (3.1) tiene la rama demo.
- [ ] **Cada** Server Component bajo las rutas protegidas usa el helper compartido (3.2), no una comprobación de auth propia. Buscar con grep/`Select-String` el patrón `redirect("/login")` o `auth.getUser()` para localizar comprobaciones sueltas.
- [ ] Si hay un backend de API separado (Hono, Express...), su middleware de auth tiene la rama demo (3.3) **y** cada handler individual usa el helper compartido en vez de volver a llamar a `auth.getUser()` por su cuenta.
- [ ] Probado el flujo completo navegando entre **todas** las secciones del panel con cada rol demo, no solo la pantalla de entrada.
- [ ] Probado en ventana de incógnito (descarta interferencia de cookies de sesión real previas).
- [ ] Confirmado que un usuario real (login real, sin cookie demo) sigue funcionando exactamente igual que antes de estos cambios.
- [ ] Revisado qué acciones destructivas o de escritura sensible (enviar emails reales, cobrar con Stripe, etc.) podrían dispararse desde el modo demo, y decidido explícitamente si se bloquean, se ocultan en la UI, o se acepta el riesgo de forma consciente (ver sección 5).

---

## 5. Consideraciones de seguridad

1. **Base de datos de sandbox, no de producción.** El cliente `service_role` que usa el modo demo debe apuntar a un proyecto Supabase separado (restaurado desde producción si hace falta tener datos realistas, pero desconectado de clientes reales).
2. **`service_role` implica bypass de RLS.** El cliente demo ve y puede escribir en cualquier fila si no filtras explícitamente por `tenant_id` en cada consulta — la responsabilidad de aislar los datos del tenant demo recae enteramente en el código de la aplicación (los `.eq("tenant_id", tenantId)` de cada query), no en políticas de base de datos como en el flujo real con RLS.
3. **Acciones con efectos reales fuera del sandbox son el mayor riesgo.** Ejemplos reales encontrados: un botón de "invitar usuario" que sigue escribiendo en la base de producción real y enviando emails reales incluso en modo demo, o un dashboard de superadmin que muestra datos reales de Stripe (MRR, suscripciones) en vez de datos simulados. Cada caso así debe evaluarse: ocultar el control en modo demo, mockear la respuesta, o aceptar el riesgo conscientemente si el impacto es bajo (por ejemplo, mostrar cifras reales de solo lectura puede ser aceptable; permitir escribir registros reales no lo es).
4. **El secreto (`DEMO_AUTH_SECRET`) es la única barrera de entrada.** Trátalo como cualquier otro secreto de producción — no lo publiques en el frontend, no lo repitas en logs, rótalo si sospechas que se ha filtrado.
5. **Fail-open siempre hacia el flujo real, nunca hacia el acceso.** Si la verificación de la firma falla, el token expiró, o falta cualquier variable de entorno necesaria, el comportamiento por defecto debe ser "tratar como usuario no autenticado / exigir login real" — nunca "conceder acceso por si acaso".

---

## 6. Diferencias entre arquitecturas: ObrasDeNivel vs. CaminoSantiago

| Aspecto | ObrasDeNivel | CaminoSantiago |
|---|---|---|
| Backend API | Hono montado dentro de Next.js (`/api/v1/[[...route]]`), un único deploy en Vercel | Hono standalone en Render, deploy independiente del frontend |
| Punto 3.3 (middleware API) | Mismo proceso/runtime que el resto de Next.js — variables de entorno compartidas automáticamente | Proceso separado — hay que declarar `DEMO_AUTH_SECRET` (y cualquier otra variable necesaria) también en las variables de entorno de Render, no solo en Vercel |
| Verificación de la cookie en el backend | `getCookie()` de `hono/cookie`, cookie viaja en la misma petición porque es el mismo dominio/origen | Igual en esencia, pero verificar configuración de CORS si el dominio del frontend y el de la API de Render difieren — la cookie debe poder viajar entre ambos (`credentials: 'include'` en el fetch del frontend, y CORS configurado para permitir el origen exacto, no solo `*`) |
| Runtime del middleware de Next.js | `proxy.ts`, Node.js siempre (Next.js 16) | Igual si usa la misma versión de Next.js — comprobar `next --version` en ese proyecto si es distinta |

**Lección clave al portar el patrón entre proyectos con arquitecturas distintas:** no asumir que un fix que funcionó en un proyecto (por ejemplo, forzar un runtime, o una forma concreta de leer cookies) aplica igual en el otro sin verificar primero las diferencias de infraestructura (deploy monolítico vs. separado, mismo dominio vs. dominios distintos, versión de framework).

---

## 7. Plantilla de archivos a crear/tocar en un proyecto nuevo

```
lib/demo/
  verifyDemoSignature.ts     # firma/verificación HMAC — compartido
  demoClient.ts              # createDemoClient() — cliente service_role
  demoTokenServer.ts         # resolverUsuarioDemo() — para Server Components (next/headers)
  resolverContextoTenant.ts  # helper para páginas — usa demoTokenServer

app/demo-login/route.ts      # genera y firma el token, fija la cookie

proxy.ts (o middleware.ts)   # rama demo añadida a la lógica de protección de rutas existente

lib/api/
  middleware/auth.ts         # rama demo añadida al middleware existente (usa hono/cookie o equivalente)
  demoContext.ts             # helper para handlers de API — usa getDemoUser(c) del contexto
```

Y en cada `page.tsx` / handler de API existente bajo rutas protegidas: sustituir la comprobación de auth propia por una llamada al helper correspondiente (`resolverContextoTenant()` o `resolverTenantApi(c)`).
