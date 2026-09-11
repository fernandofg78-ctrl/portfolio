# Portfolio — Documentación Técnica

## Stack

- **Frontend:** Vite + React 18, React Router (client-side routing, sin SSR)
- **Estilos:** CSS por tema, sin librería de utilidades global — variables CSS por wrapper raíz, cascada por especificidad de clase descendente
- **Despliegue:** Vercel, build estático servido vía GitHub Actions/Vercel Git integration
- **Sin backend propio** — todo el estado vive en el cliente; los paneles de control que se muestran (sandbox) pertenecen a las aplicaciones reales, documentadas cada una por separado

## Arquitectura multi-tema

SPA con 4 rutas, cada una con una identidad visual completamente distinta pero alimentada por la misma fuente de datos (`src/utils/projects.js`):

| Ruta | Tema | Enfoque visual |
|---|---|---|
| `/` | Default | Lista editorial en acordeón — filas numeradas que expanden en línea con panel de info + mockup de móvil en vivo |
| `/features` | Brutalism | Pills/clips de features, ticker de tecnologías (Devicons), modales por feature |
| `/panels` | Groovy | Demos de paneles de administración, incluyendo el sistema de sandbox en vivo |
| `/about` | Archive | Tipografía serif, scroll progress, narrativa personal, timeline educativo |

Cada tema tiene su propio `Layout.jsx` y su propia hoja de estilos (`{tema}.css`), con variables CSS definidas en el wrapper raíz de cada uno (paleta, tipografía, espaciados). Los estilos se aplican por especificidad de clase descendente del wrapper (p. ej. `.b-wrapper .navbar`), lo que permite que cada tema reescriba componentes compartidos (navbar, tarjetas) sin colisionar entre sí ni depender de módulos CSS por componente.

`projects.js` se mantiene como dato puro, sin lógica de presentación: cada proyecto define título, descripción, stack, features, links, y opcionalmente contenido de documentación técnica importado en build-time vía Vite (`import doc from "./archivo.md?raw"`). Las imágenes por tema se resuelven en objetos `THEME_IMAGES` dentro de cada `Layout.jsx`, de forma que el dato compartido no acopla qué tema lo está renderizando — añadir un proyecto nuevo solo requiere tocar `projects.js`, los 4 temas ya saben pintarlo.

## Documentación técnica embebida

Cada proyecto puede incluir un `.md` técnico (como este mismo documento), importado en build-time vía Vite y renderizado con `react-markdown` dentro de un modal con estética de editor de código: fondo oscuro, tipografía monoespaciada, barra de pestañas con acento superior y gutter de números de línea (oculto en móvil). El botón "Documentación →" aparece junto al resto de enlaces de acción en el panel expandido de cada fila de proyecto.

## Sistema de demos en vivo (sección Groovy)

Dos proyectos del portfolio exponen un panel de administración real y funcional a través de un selector de rol en `/panels`: **CaminoSantiago.app** (peregrino, albergue, admin) y **ObrasDeNivel** (tenant, superadmin). El visitante entra ya autenticado en el rol elegido, sin login manual, sobre una copia aislada de cada aplicación.

Arquitectura común a ambos, con matices por proyecto:

- **Aislamiento de datos**: cada demo corre contra un despliegue y una base de datos completamente independientes de producción — un sandbox restaurado desde un backup, no un `staging` compartido. Ninguna interacción del visitante puede afectar a datos reales.
- **Autenticación por token firmado, no sesión estándar**: al entrar por `/demo-login?role=X`, el servidor genera un token HMAC-SHA256 (`payload.firma`, con expiración corta) y lo guarda en cookie. No pasa por el flujo de login de la plataforma (magic link / `verifyOtp`) porque ese flujo no propaga sesión de forma fiable a Server Components — el token demo es un canal deliberadamente aparte, aditivo, sin tocar el código de autenticación real.
- **Verificación en cada capa de protección**: la lógica de firma se comparte entre el endpoint que la genera y cada punto que la verifica (middleware/proxy de rutas, layouts, páginas server-side), para evitar duplicar la implementación HMAC. Un matiz importante detectado en la práctica: cuando una aplicación protege sus rutas en más de un punto (p. ej. un middleware de red *y* un layout con su propia comprobación de sesión), la excepción del token demo tiene que aplicarse en todos los puntos, no en uno solo — de lo contrario cualquier capa sin parchear sigue expulsando al visitante.
- **Bypass de RLS controlado**: como el usuario demo no tiene sesión real de Supabase, las políticas de Row Level Security basadas en `auth.uid()` no lo reconocerían. Las queries en contexto demo usan un cliente con `service_role`, filtrando manualmente por el `tenant_id`/rol resuelto del token — nunca acceso sin filtrar.
- **Despliegue independiente por proyecto**: la topología varía según cómo esté construido cada backend. CaminoSantiago separa frontend (Vercel) y API (Hono standalone en Render), así que el sandbox replica ambos servicios coordinados. ObrasDeNivel monta su API Hono dentro de Next.js, así que el sandbox es un único proyecto Vercel — menos piezas móviles, mismo patrón de auth.

Este patrón (sandbox aislado + token de demo verificado en todas las capas de protección relevantes) es el que se reutiliza al incorporar cada nuevo proyecto con panel de control al portfolio.

## Easter egg

El tema Default incluye un mini-juego de ahorcado bilingüe (español/inglés), escondido tras una interacción oculta (abrir dos proyectos del listado). Es el primer proyecto independiente en React del autor, integrado aquí como iframe de un despliegue separado.

## Notas de diseño

- Un solo componente de tarjeta/fila de proyecto por tema, pero cada tema decide su propia disposición (acordeón, pills, cards de panel, timeline).
- El objetivo explícito de la arquitectura es que añadir un proyecto nuevo solo requiera tocar `projects.js` — los 4 temas ya saben renderizarlo sin cambios adicionales.
