# Obras de Nivel — Documentación Técnica

**Última actualización:** Agosto 2026
**Autor/mantenedor:** Fernando (desarrollador único / founder)

---

## 1. Resumen del producto

Obras de Nivel es una plataforma **SaaS multi-tenant** dirigida a autónomos y pequeñas empresas del sector de la construcción en España (electricistas, fontaneros, pintores, albañiles, y oficios afines), con un perfil de usuario de entre 35 y 55 años y baja alfabetización digital.

La plataforma resuelve tres necesidades del oficio en una sola herramienta:

- **Presencia web profesional**: cada tenant obtiene una web pública propia, editable sin conocimientos técnicos, con varios temas visuales a elegir.
- **Gestión comercial**: creación y envío de presupuestos, gestión de clientes y gestión de proyectos/obras en curso.
- **Distribución del trabajo**: los presupuestos y la web se comparten directamente por WhatsApp, el canal de comunicación dominante en este colectivo.

El producto se distribuye en dos superficies que comparten backend y base de datos:

- **Aplicación web** (`obrasdenivel.es`) — panel de administración completo + web pública del tenant.
- **Aplicación móvil nativa** (Android, Google Play) — versión reducida del panel de administración pensada para gestión en movilidad (obra, furgoneta, cliente en persona).

Existe además una segunda aplicación, **camino-mobile**, desarrollada bajo la misma cuenta de desarrollador pero como producto independiente, actualmente en fase de pruebas cerradas.

---

## 2. Arquitectura general

### 2.1 Filosofía de separación de repositorios

El proyecto se divide deliberadamente en **repositorios independientes** en lugar de un monorepo único que incluya también el móvil:

- **Monorepo web** (Turborepo + pnpm): contiene la aplicación Next.js y los paquetes compartidos (tipos de base de datos generados desde Supabase).
- **Repositorio móvil standalone**: proyecto Expo completamente aislado, fuera del monorepo.

Esta separación no es incidental: se intentó integrar el móvil dentro del monorepo y provocó conflictos de *hoisting* de pnpm entre las versiones de React usadas por Next.js (React 19 vía Next 16) y React Native (que en su momento requería una versión distinta). El resultado eran errores de resolución de dependencias intermitentes y muy costosos de depurar. La decisión de mantener el móvil fuera del monorepo se documentó como aprendizaje permanente del proyecto.

### 2.2 Multi-tenancy

La aplicación es multi-tenant a nivel de base de datos, no de infraestructura: todos los tenants comparten la misma instancia de Supabase (PostgreSQL) y el aislamiento de datos se garantiza mediante **Row Level Security (RLS)** de PostgreSQL. Cada fila relevante de la base de datos está asociada a un `tenant_id`, y las políticas RLS filtran automáticamente el acceso según el usuario autenticado.

Existe un rol especial, `superadmin`, definido a nivel de fila en la tabla de usuarios, que tiene visibilidad y capacidad de gestión sobre todos los tenants desde un panel dedicado, al margen de las políticas RLS estándar de tenant.

### 2.3 Comunicación entre capas

- El **frontend web** (Next.js, App Router) consume una API propia montada como sub-aplicación **Hono** dentro del mismo proyecto Next.js, expuesta bajo un prefijo de rutas versionado.
- El **frontend móvil** (Expo) consume la misma API Hono desplegada en Vercel — no existe una API distinta para móvil, ambas superficies comparten el 100% de la lógica de negocio del backend.
- La subida de archivos (fotos de obras, logotipos, fotos de presupuestos) **no pasa por la API propia**: se realiza directamente desde el cliente (web o móvil) hacia Cloudinary mediante *unsigned upload presets*, y solo la URL resultante se envía al backend para persistirla. Esta decisión evita el límite de tamaño de payload de las funciones serverless de Vercel (4.5 MB) y evita duplicar tráfico de binarios a través del servidor de aplicación.

### 2.4 Diagrama conceptual de flujo de datos

Cliente (web o app móvil) → autenticación vía Supabase Auth → llamadas HTTP a la API Hono con token de sesión → Hono valida el tenant/usuario → lecturas/escrituras en Supabase (PostgreSQL con RLS) → para imágenes, el cliente sube directamente a Cloudinary y solo la URL resultante viaja por la API.

---

## 3. Stack tecnológico

### 3.1 Aplicación web

| Capa | Tecnología | Notas |
|---|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) | SSR + rutas de API integradas |
| Lenguaje | TypeScript (modo estricto) | Tipado generado automáticamente desde el esquema de Supabase |
| API interna | Hono 4.x | Montada como handler de rutas dinámicas de Next.js, no como servicio separado |
| Base de datos | Supabase (PostgreSQL) | RLS como mecanismo de aislamiento multi-tenant |
| Autenticación | Supabase Auth (`@supabase/ssr`) | Email/contraseña + Google OAuth |
| Imágenes | Cloudinary SDK | Subida directa desde cliente, *unsigned preset* dedicado |
| Estilos | Tailwind CSS v4 | Sistema de temas centralizado mediante clases y variables CSS propias |
| Orquestación de repos | Turborepo + pnpm | Monorepo con paquete compartido de tipos de base de datos |
| IA | Anthropic API (modelo Claude Haiku) | Generación de texto, SEO y ordenación inteligente |
| Emails transaccionales | Resend | Dominio verificado; integración pendiente de implementar |
| Pagos | Stripe | Modo live, modelo freemium |
| Monitorización de errores | Sentry | Proyecto dedicado para la app web |
| Despliegue | Vercel | Dominio de producción `obrasdenivel.es` |

### 3.2 Aplicación móvil

| Capa | Tecnología | Notas |
|---|---|---|
| Framework | Expo SDK 55 | Proyecto standalone, fuera del monorepo web |
| Runtime | React Native + React 19 | Alineado con las versiones soportadas por el SDK de Expo |
| Navegación | Expo Router | Enrutado basado en sistema de archivos, con grupos de rutas para auth/onboarding/app principal |
| Lenguaje | TypeScript | Los tipos de Supabase se definen manualmente por pantalla en lugar de importarse desde un paquete compartido, dado el aislamiento del repositorio |
| Autenticación | Cliente JS de Supabase | Email/contraseña; llamadas a la API propia autenticadas con cabecera personalizada |
| Imágenes | Cloudinary | Subida directa desde el dispositivo, mismo preset que la web |
| Selección de imágenes | Selector de fotos del sistema Android | Se evita solicitar permisos de almacenamiento gracias al selector nativo |
| Visualización de fotos | Librería de visor de imágenes a pantalla completa | Zoom por pinch y cierre por deslizamiento |
| Contactos | Integración con la agenda del dispositivo | Selección de cliente/teléfono para el envío de presupuestos por WhatsApp |
| IA | Anthropic API (Claude Haiku) | Casos de uso de generación y ordenación de contenido |
| Build/Distribución | EAS Build | Perfil de producción, `versionCode` autoincremental gestionado en remoto |
| Distribución final | Google Play (Spain), pista de producción | App en vivo tras pasar pruebas cerradas |
| Monitorización de errores | Sentry | Proyecto dedicado para la app móvil |

---

## 4. Modelo de datos y aislamiento multi-tenant

### 4.1 Entidades principales

- **tenants**: entidad central del sistema. Contiene los datos identificativos del negocio (nombre, oficio, contacto, dirección), el plan de suscripción, el tema visual elegido, el color primario configurado, contadores de uso de IA (llamadas del día y fecha de referencia para el rate limiting), y los campos de contenido editable de la web pública (portada, sobre nosotros, contacto).
- **usuarios**: usuarios autenticados, vinculados a un tenant, con un campo de rol que distingue el rol estándar del rol `superadmin`.
- **clientes**: contactos comerciales del tenant, reutilizables entre presupuestos y proyectos.
- **presupuestos** y sus líneas (partidas): documentos comerciales con estado (borrador, enviado, aceptado, rechazado), desglose de partidas, cálculo de IVA configurable, notas internas y fotos adjuntas.
- **proyectos**, junto con tablas asociadas de fotos, partidas de proyecto y finanzas de proyecto: representan obras en ejecución, con seguimiento de tareas tipo checklist, control de ingresos/gastos y galería fotográfica.
- **obras** y **servicios**: contenido de portafolio publicado en la web pública del tenant (proyectos terminados mostrados como muestra de trabajo, y catálogo de servicios ofrecidos).
- Campos de metadatos SEO (título, descripción, palabras clave) presentes en las entidades de contenido público, generables automáticamente vía IA.

### 4.2 Aislamiento de datos

El aislamiento entre tenants se resuelve íntegramente con **RLS de PostgreSQL** a nivel de Supabase: cada política de fila comprueba que el `tenant_id` de la fila coincide con el tenant del usuario autenticado en la sesión. Esto evita tener que replicar la lógica de aislamiento en cada endpoint de la API y reduce el riesgo de fugas de datos entre tenants por error de programación en el backend.

El rol `superadmin` opera con políticas específicas que le permiten leer y escribir a través de todos los tenants desde un panel dedicado, fuera del flujo normal de un tenant.

---

## 5. Autenticación y autorización

- El proveedor de identidad es **Supabase Auth**, con dos métodos habilitados: email/contraseña y OAuth de Google.
- La recuperación de contraseña está implementada mediante el flujo estándar de Supabase Auth con página de callback propia.
- **Particularidad técnica clave**: las llamadas desde la app móvil a la API no usan la cabecera estándar `Authorization: Bearer`, porque la capa CDN/Edge de Vercel la elimina en determinadas condiciones de despliegue. En su lugar se emplea una cabecera personalizada (`X-Auth-Token`) para transportar el token de sesión hacia el backend Hono, que la valida contra Supabase.
- En la aplicación web, las llamadas internas entre el frontend Next.js y la API Hono se autentican mediante **cookies de sesión**, no mediante tokens Bearer, aprovechando que ambas capas conviven en el mismo dominio y despliegue.
- El cliente administrativo de Supabase (con privilegios elevados, usado por ejemplo en el flujo de registro para crear tenant + usuario de forma atómica) se instancia **de nuevo en cada request**, evitando reutilizar una instancia global que podría filtrar estado entre peticiones concurrentes en el entorno serverless.
- La URL de sitio configurada en Supabase Auth usa un esquema de deep link propio de la app (`obras-de-nivel://`) para los flujos de autenticación en móvil, mientras que las plantillas de email de Supabase apuntan de forma fija al dominio de producción de la web para los flujos que se abren desde el correo.

---

## 6. Módulos funcionales

### 6.1 Presupuestos

Es el módulo diferencial del producto y el que ha recibido más iteraciones de UX.

Características:

- Creación de presupuestos con líneas de partida (descripción, cantidad, unidad, precio unitario), soporte de expresiones aritméticas simples al introducir cantidades.
- Control de margen por partida mediante un control deslizante (rango configurable, con indicación visual de si el margen aplicado es negativo o positivo).
- Cálculo de IVA configurable (10% / 21%) con posibilidad de ajustar la base imponible mediante un control deslizante, recalculando el total en tiempo real **en el propio cliente**, sin llamada a la API, para una respuesta instantánea.
- Notas internas no visibles para el cliente.
- Adjuntos fotográficos por presupuesto, con subida a Cloudinary antes de persistir el documento y reutilización de URLs ya existentes sin volver a subir el archivo si no ha cambiado.
- Visor de fotos a pantalla completa con zoom y gestos de cierre, tanto desde el detalle del presupuesto como desde el formulario de edición de partida.
- Listado de presupuestos con indicación visual de estado por color (franja lateral y punto de color en cada tarjeta), filtros rápidos por estado, y eliminación con confirmación.
- Pantalla de vista previa/envío con panel de acciones que permite: enviar directamente por WhatsApp al teléfono del cliente (con selección desde la agenda del propio dispositivo si el cliente aún no está en el sistema), generar un enlace público del presupuesto, y cambiar el estado del documento (aceptado/rechazado). El envío por WhatsApp marca automáticamente el presupuesto como "enviado".
- Endpoint especializado para **importación de partidas** en bloque, registrado antes que las rutas dinámicas por identificador para evitar colisiones de enrutado.
- Feature de generación de contenido asistido por IA para ordenar/clasificar categorías de partidas de forma inteligente.
- Funcionalidad de "voz a partida" (dictar una partida por voz y que la IA la transcriba y estructure automáticamente en descripción/cantidad/unidad/precio) diseñada pero **pospuesta indefinidamente** por prioridad de otras features.

### 6.2 Clientes

- CRUD completo de clientes (listado, ficha de detalle, alta, edición) disponible tanto en web como en móvil.
- Los clientes son la entidad puente entre presupuestos y proyectos: un mismo cliente puede tener múltiples presupuestos y proyectos asociados.
- **Limitación conocida y pendiente de rediseño**: actualmente, al crear un proyecto solo se puede asignar un cliente ya existente; no es posible dar de alta un cliente nuevo directamente desde el flujo de creación de proyecto. Está identificado como el próximo rediseño de flujo prioritario del backlog.

### 6.3 Proyectos

- Representan obras en ejecución, diferenciadas de los presupuestos (que son documentos comerciales previos a la adjudicación del trabajo).
- Cada proyecto tiene tres dimensiones de seguimiento independientes:
  - **Partidas del proyecto**, con lógica de checklist (tareas realizadas/pendientes).
  - **Finanzas del proyecto**, con resumen de ingresos y gastos asociados a la obra.
  - **Galería fotográfica**, con subida directa a Cloudinary, visor a pantalla completa y opción de eliminar fotos.
- En web, el detalle de proyecto se organiza en pestañas (partidas, finanzas, fotos).
- En móvil, la pantalla de detalle incluye captura desde cámara y desde galería, con el mismo visor a pantalla completa que el resto de la app.

### 6.4 Gestor Web (sitio público del tenant)

Cada tenant dispone de una web pública generada automáticamente a partir del contenido que introduce en el panel de administración, sin necesidad de tocar código ni diseño.

Apartados gestionables, cada uno con su propia pantalla de edición:

- **Portada** (hero): imagen y texto principal de bienvenida.
- **Obras**: portafolio de trabajos realizados, con imágenes y descripción, mostrado como galería pública.
- **Servicios**: catálogo de servicios ofrecidos por el tenant.
- **Sobre nosotros**: sección opcional — si el tenant no rellena contenido, la sección desaparece por completo de la navegación, del menú inferior y de la página de inicio; si se rellena, aparece automáticamente en todos los puntos de la interfaz pública (menú, resumen en portada con foto y enlace, footer).
- **Contacto**: datos de contacto y redes sociales, reflejados también en el pie de página.
- **Configuración**: logotipo, color primario (seleccionable entre una paleta cerrada de colores predefinidos para no romper la coherencia visual del tema) y selección de tema visual.

**Sistema de temas**: la arquitectura de temas está pensada como un cambio completo de layout y componentes visuales, no como un simple cambio de color o tipografía. Cada tema define su propio conjunto de componentes de presentación (cabecera, portada, galería de obras, tarjetas de servicio, pie de página), y el tenant únicamente puede personalizar dentro de los márgenes que el tema permite (color primario dentro de una paleta cerrada). Esta decisión de diseño busca que ningún tenant pueda producir una web de aspecto roto o poco profesional, priorizando resultados consistentes sobre libertad de personalización total.

**Disponibilidad de temas por plan**: el catálogo completo de temas está restringido en el plan gratuito; el selector de temas se oculta o limita según el plan de suscripción del tenant.

### 6.5 Onboarding y registro

- Registro de nuevo tenant en tres pasos: datos de la empresa/oficio, datos de contacto (teléfono y dirección obligatorios), y paso final de configuración inicial (que enlaza directamente a la pantalla de configuración de la web marcada con un parámetro de "modo onboarding").
- El listado de oficios disponibles está centralizado en un único origen de datos, compartido por todas las pantallas que lo consumen (registro, onboarding, formularios de proyecto/presupuesto), evitando duplicación e inconsistencias.
- La selección de tema durante el onboarding se presenta de forma colapsada (acordeón) para no sobrecargar visualmente un flujo pensado para usuarios con baja familiaridad digital.
- El registro crea el tenant y el usuario administrador asociado de forma atómica en el backend, evitando estados intermedios inconsistentes (usuario sin tenant o viceversa).

### 6.6 Panel Superadmin

- Accesible únicamente para el usuario con rol `superadmin`, desde una ruta dedicada fuera del panel de administración estándar del tenant.
- Permite listar y gestionar todos los tenants de la plataforma de forma transversal, al margen del aislamiento RLS que aplica al resto de usuarios.
- Disponible **solo en la versión de escritorio de la web**; no existe equivalente en la aplicación móvil, dado que es una herramienta de operación interna del founder, no un producto de cara al cliente final.

---

## 7. Integración de Inteligencia Artificial

La plataforma integra la **API de Anthropic** (modelo Claude Haiku) como funcionalidad de producto, a través de un **endpoint centralizado único** en el backend por el que pasan todos los casos de uso de IA, lo que permite aplicar control de costes y límites de forma consistente.

Casos de uso en producción:

- **Generación de textos** para las distintas secciones del gestor web (portada, sobre nosotros, servicios, obras, contacto), a partir del contexto del negocio (oficio, nombre, zona) introducido por el tenant.
- **Generación automática de metadatos SEO** (título de hasta 60 caracteres, descripción de hasta 160 caracteres y entre 6 y 8 palabras clave con enfoque en búsqueda local en español) para cada página pública editable. El diseño de esta feature sigue una filosofía deliberada de **generación silenciosa**: el contenido SEO se genera automáticamente en segundo plano la primera vez que el tenant guarda una sección sin haber rellenado los campos de SEO manualmente, sin exponer un botón explícito de "generar". El usuario puede editar libremente el resultado después, pero nunca se le pide que dispare la generación de forma consciente, coherente con el perfil de usuario objetivo de baja familiaridad técnica.
- **Ordenación inteligente de categorías/etiquetas** en el módulo de presupuestos, para presentar al usuario las categorías de partidas más relevantes primero según el contexto.

**Control de uso y costes**: cada tenant tiene un límite diario de llamadas a IA, distinto según su plan de suscripción (más generoso en el plan de pago que en el gratuito), controlado mediante un contador de llamadas del día y una fecha de referencia almacenados directamente en el registro del tenant. Al superar el límite diario, las funciones de IA quedan bloqueadas hasta el reinicio del contador al día siguiente.

---

## 8. Gestión de imágenes

- Todo el contenido gráfico de la plataforma (logotipos de tenant, fotos de portada, fotos de obras/servicios, fotos de presupuestos, fotos de proyectos) se gestiona a través de **Cloudinary**.
- El patrón de subida es idéntico en web y móvil: el cliente sube el archivo directamente a Cloudinary usando un *preset* de subida sin firmar (*unsigned*) dedicado al proyecto, y únicamente la URL resultante (y el identificador público del recurso) se envía al backend para su persistencia junto con la entidad correspondiente.
- Este patrón evita por completo el paso de binarios por la API propia, eludiendo el límite de tamaño de las funciones serverless de Vercel y reduciendo la latencia percibida de subida.

---

## 9. Planes y monetización

- Modelo freemium con dos niveles: **free** y **pro** (suscripción mensual de bajo coste, pensada para el perfil de autónomo).
- Los pagos se gestionan mediante **Stripe** en modo live.
- Las diferencias funcionales entre planes incluyen, entre otras: el límite diario de llamadas a las funciones de IA y la disponibilidad del catálogo completo de temas visuales para la web pública.
- Cuando un tenant alcanza un límite de su plan, la interfaz muestra una alerta con enlace directo a la pantalla de gestión de plan, incluyendo un token de acceso en la URL para evitar fricciones de reautenticación en ese punto del flujo.

---

## 10. Comunicaciones

- El proveedor de email transaccional es **Resend**, con el dominio de producción ya verificado.
- **Pendiente de implementación**: email de bienvenida al completar el registro, y notificación por email cuando un presupuesto es enviado a un cliente. Identificado como la prioridad número uno del backlog actual.

---

## 11. Monitorización y calidad

- **Sentry** está integrado como sistema de monitorización de errores en ambas superficies (web y móvil), con proyectos separados para cada una.
- Tras el lanzamiento en producción de la app móvil, el seguimiento post-lanzamiento no ha registrado caídas (*crashes*) ni bloqueos de aplicación (*ANRs*) en el volumen de instalaciones inicial.
- Como práctica de desarrollo, los errores nativos de Android se diagnostican primero con las herramientas de depuración del sistema operativo antes de generar una nueva compilación con EAS Build, para evitar consumir ciclos de compilación en correcciones no verificadas.
- Se generan localmente los archivos nativos de la app (proceso de *prebuild* de Expo) para inspeccionar el manifiesto de Android sin coste alguno, antes de decidir si es necesaria una compilación completa.

---

## 12. Particularidades técnicas de la app móvil

- **Selector de imágenes del sistema**: se usa el selector de fotos nativo de Android en lugar de solicitar permisos de acceso a todo el almacenamiento del dispositivo o a la galería completa. Esta decisión se tomó tras retirar los permisos `READ_MEDIA_IMAGES` y `READ_EXTERNAL_STORAGE`, identificados como motivo de rechazo de política en Android 13+ por parte de Google Play si no son estrictamente imprescindibles. El único permiso sensible retenido es el de cámara.
- **Gestión de errores en fabricantes específicos**: se detectó una excepción nativa (`IllegalStateException`, relativa a un *launcher* de resultado de actividad no registrado) reproducible en dispositivos de determinados fabricantes (Oppo, Realme, Xiaomi). Se implementó una gestión de error explícita que, ante esa excepción, ofrece al usuario un mensaje claro con la opción de reiniciar la aplicación mediante el mecanismo de recarga de actualizaciones de Expo, en lugar de dejar la app en un estado inconsistente.
- **Gestión de versiones de compilación**: el número de versión de compilación (`versionCode`) se gestiona de forma remota y autoincremental a través de la configuración de EAS, evitando conflictos manuales de versión entre compilaciones sucesivas.
- **Componentes fuera de la carpeta de rutas**: existe una convención estricta de que todo componente reutilizable vive en una carpeta de componentes dedicada y nunca dentro de la carpeta de rutas de Expo Router, ya que colocarlos en la carpeta de rutas provoca errores de referencia nula en efectos de inserción de React, un patrón de fallo que se repitió varias veces durante el desarrollo hasta consolidarse como regla fija.
- **Listas horizontales**: el uso de listas virtualizadas horizontales anidadas dentro de un contenedor de scroll provoca elementos sobredimensionados en pantallas móviles; la solución adoptada de forma consistente es sustituir la lista virtualizada por un contenedor de scroll horizontal simple con altura explícita.
- **Gestión de estado en efectos**: para evitar el problema clásico de *stale closures* en los efectos de React que dependen de un token de sesión u otro valor mutable, el proyecto usa de forma sistemática referencias mutables (`useRef`) para conservar la última versión de esos valores dentro de los manejadores de eventos, en lugar de depender del array de dependencias del efecto.

---

## 13. Patrones y decisiones de arquitectura del backend web

- **Organización de la API por módulos**: la API Hono se estructura en rutas independientes por dominio funcional (autenticación, clientes, presupuestos, proyectos, precios, IA), todas registradas bajo un mismo punto de entrada versionado, lo que facilita añadir nuevos módulos sin afectar a los existentes.
- **Orden de rutas estático antes que dinámico**: las rutas Hono con segmentos fijos (por ejemplo, un endpoint de importación en bloque) deben declararse siempre antes que las rutas con parámetros dinámicos del mismo prefijo, para evitar que el motor de enrutado interprete el segmento fijo como si fuera un identificador variable.
- **Ubicación de callback de autenticación**: la ruta de callback de autenticación se mantiene deliberadamente fuera de los grupos de rutas del panel de administración, por una limitación conocida del compilador Turbopack con grupos de rutas anidados en ese contexto concreto.
- **Sistema de temas y variables CSS**: la hoja de estilos del panel de administración utiliza un espacio de nombres propio de variables CSS, con un registro centralizado de clases de tema que permite aplicar consistencia visual across todo el panel sin duplicar reglas de estilo.
- **Patrón de guardado contextual**: las pantallas de edición de contenido del gestor web (portada, sobre nosotros, configuración, contacto) comparten un mismo patrón de guardado mediante eventos personalizados del DOM disparados desde una barra de navegación inferior contextual, que se muestra solo cuando el usuario está dentro de una de esas pantallas de edición.

---

## 14. Infraestructura y despliegue

- **Web**: desplegada en Vercel, con integración continua desde el repositorio del monorepo. Dominio de producción `obrasdenivel.es`.
- **Móvil**: compilada con EAS Build bajo la cuenta de Expo del proyecto, y distribuida a través de Google Play Console, bajo la misma cuenta de desarrollador que también gestiona la segunda app del ecosistema (camino-mobile).
- **Base de datos**: instancia única de Supabase en producción, compartida por ambas superficies (web y móvil) y por todos los tenants.
- **Dominio de autenticación**: actualmente el flujo de consentimiento OAuth muestra el subdominio genérico del proyecto de Supabase en lugar de un dominio personalizado propio, una limitación conocida y aceptada de forma consciente hasta que el nivel de ingresos justifique el paso al plan de pago de Supabase que habilita dominios de autenticación personalizados.

---

## 15. Estado actual del proyecto

- **Web**: funcionalmente completa y en producción.
- **App móvil**: funcionalmente completa, en producción en Google Play para España, tras superar con éxito la fase de pruebas cerradas (que requirió uso activo y feedback real de testers, no solo instalaciones).
- **Fase actual del negocio**: la plataforma está técnicamente lista y el foco actual es de **visibilidad y captación de usuarios**, no de desarrollo de producto. Existe un plan de marketing por fases (optimización de ficha en Google Play y landing, canales orgánicos de coste cero como grupos de gremios y asociaciones del sector, contenido en formato vídeo corto, y publicidad de pago como última fase una vez validado el mensaje con usuarios reales).

### Backlog pendiente (por prioridad)

1. Emails transaccionales con Resend: bienvenida al registrarse y notificación al enviar un presupuesto.
2. Nueva compilación móvil que incorpore mejoras ya integradas en el repositorio pero no incluidas en la versión actualmente publicada en Google Play.
3. Rediseño del flujo de creación de proyectos, para permitir dar de alta un cliente nuevo directamente desde ese flujo en lugar de exigir un cliente preexistente.
4. Funcionalidad de "voz a partida" en presupuestos — pospuesta indefinidamente.
5. Avance de camino-mobile en pruebas cerradas hasta lograr uso activo real de testers, requisito previo para poder solicitar el paso a producción.
6. Dominio de autenticación personalizado en Supabase — diferido hasta que los ingresos justifiquen el plan de pago correspondiente.

---

## 16. Aprendizajes técnicos consolidados (buenas prácticas del proyecto)

- No dar por válida ninguna solución sin verificación explícita, ni ignorar errores de compilación de TypeScript.
- Diagnosticar completamente un fallo antes de invertir un ciclo de compilación completo en corregirlo, especialmente en móvil, donde cada compilación tiene coste de tiempo real.
- Mantener separados los repositorios cuyos ecosistemas de dependencias son incompatibles entre sí (web con Next.js/React 19 vía SSR, frente a Expo/React Native), en lugar de forzar un monorepo único a toda costa.
- Priorizar patrones de aislamiento de datos a nivel de base de datos (RLS) frente a lógica de aislamiento replicada manualmente en cada endpoint del backend.
- Diseñar las funciones de IA de cara al usuario final pensando en su perfil real (baja familiaridad digital): generación silenciosa y automática en lugar de exponer controles técnicos que generarían fricción o confusión.
- Mantener un catálogo cerrado de opciones de personalización visual (colores, temas) en lugar de personalización libre, para proteger la calidad percibida del producto final entregado a los clientes de los tenants.
