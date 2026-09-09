# Portfolio — Documentación Técnica

## Stack

- **Frontend:** Vite + React, React Router
- **Estilos:** CSS por tema, sin librería de utilidades global
- **Despliegue:** Vercel, vía GitHub
- **Sin backend propio** — todo el estado vive en el cliente; los paneles de
  control que se muestran pertenecen a las apps reales documentadas aparte.

## Arquitectura multi-tema

El portfolio es una SPA con 4 rutas, cada una con una identidad visual
completamente distinta pero alimentada por la misma fuente de datos
(`src/utils/projects.js`):

| Ruta | Tema | Enfoque visual |
|---|---|---|
| `/` | Default | Lista editorial en acordeón — filas numeradas que expanden en línea con panel de info + mockup de móvil en vivo |
| `/features` | Brutalism | Pills/clips de features, ticker de tecnologías (Devicons), modales por feature |
| `/panels` | Groovy | Demos de paneles de administración, incluyendo el sistema de sandbox en vivo |
| `/about` | Archive | Tipografía serif, scroll progress, narrativa personal, timeline educativo |

Cada tema tiene su propio `Layout.jsx` y su propia hoja de estilos
(`{tema}.css`), con variables CSS definidas por tema (paleta, tipografía,
espaciados) en el wrapper raíz. Los estilos se aplican por especificidad de
clase descendente del wrapper (p. ej. `.b-wrapper .navbar`), lo que permite
que cada tema reescriba componentes compartidos (navbar, tarjetas) sin
colisionar entre sí.

`projects.js` se mantiene como dato puro: cada proyecto define título,
descripción, stack, features, links y, opcionalmente, contenido de
documentación (importado con `?raw` desde archivos `.md`). Las imágenes por
tema se resuelven en objetos `THEME_IMAGES` dentro de cada `Layout.jsx`, para
que el dato compartido no dependa de qué tema lo está renderizando.

## Documentación embebida

Cada proyecto puede incluir un `.md` técnico (como este mismo documento),
importado en build-time vía Vite (`?raw`) y renderizado con `react-markdown`
dentro de un modal con estética de editor de código: fondo oscuro,
tipografía monoespaciada, barra de pestañas con acento superior y gutter de
números de línea (oculto en móvil). El botón "Documentación →" aparece junto
al resto de enlaces de acción en el panel expandido de cada fila de
proyecto.

## Sistema de demos en vivo (sección Groovy)

Para el proyecto CaminoSantiago.app, la sección `/panels` incluye un
selector de rol que enlaza a un despliegue sandbox aislado de la aplicación
real, donde el visitante entra ya autenticado como uno de varios roles
(peregrino, albergue, administrador) sin pasar por login manual.

Puntos clave de la arquitectura:

- El sandbox es un despliegue independiente de producción, con su propia
  base de datos, para que ninguna interacción de un visitante afecte a
  datos reales.
- La autenticación demo usa un token propio firmado (no una sesión estándar
  de la plataforma), generado en el momento de entrar y verificado en cada
  petición protegida, tanto en el frontend como en el backend compartido.
- El backend reconoce ese token y, cuando está presente, opera contra la
  base de datos de sandbox en lugar de la de producción — aislamiento
  completo por diseño, sin ramas de código que toquen la lógica de
  autenticación real.

Este mismo patrón (sandbox aislado + token de demo verificado en cada capa)
está pensado para reutilizarse en los paneles de control de otros proyectos
del portfolio.

## Easter egg

El tema Default incluye un mini-juego de ahorcado bilingüe (español/inglés),
escondido tras una interacción oculta (abrir dos proyectos del listado).
Es el primer proyecto independiente en React del autor, integrado aquí como
iframe de un despliegue separado.

## Notas de diseño

- Un solo componente de tarjeta/fila de proyecto por tema, pero cada tema
  decide su propia disposición (acordeón, pills, cards de panel, timeline).
- El objetivo explícito de la arquitectura es que añadir un proyecto nuevo
  solo requiera tocar `projects.js` — los 4 temas ya saben renderizarlo.
