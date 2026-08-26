# TuCamino / caminosantiago.app — Documentación Técnica

> Plataforma full-stack para el Camino de Santiago dirigida a peregrinos, hospitaleros (gestores de albergues) y negocios locales a lo largo de la ruta. Proyecto con doble propósito: pieza de portfolio profesional y producto con ambición comercial real.

---

## 1. Resumen del proyecto

TuCamino conecta tres tipos de usuario en un mismo ecosistema:

- **Peregrinos**: planifican su ruta, consultan etapas, ven ocupación de albergues en tiempo real, chatean con otros peregrinos y con albergues/negocios, y disponen de una credencial digital con sistema de check-in.
- **Hospitaleros**: gestionan la ocupación y datos de su albergue, comunican con peregrinos, y (en el futuro) gestionan check-ins bajo normativa oficial.
- **Negocios locales**: gestionan su ficha, comunican con peregrinos, y acceden a funcionalidades premium.

**Posicionamiento competitivo** frente a Gronze (el referente actual del sector): soporte multiidioma completo (Gronze es solo en español), ocupación de albergues en tiempo real, comunidad de peregrinos integrada, y planificador con IA (fase futura). El multiidioma es prioridad de la Fase 1.5 del roadmap.

La app está **en producción**, publicada en Google Play, distribuida en 46 países, con web live y backend operativo.

---

## 2. Arquitectura general

El proyecto se divide en **dos repositorios independientes**:

### 2.1. Monorepo `camino-app`
Contiene la web y la API:
- `apps/web`: aplicación Next.js (App Router), desplegada en Vercel.
- `apps/api`: API construida con Hono, desplegada en Render.
- Gestión de git centralizada: todos los pushes se hacen desde la raíz del monorepo (nunca desde `apps/web` o `apps/api` individualmente), usando un remoto SSH dedicado.

### 2.2. Repositorio `camino-mobile`
Aplicación móvil independiente:
- Expo (React Native) sobre EAS Build, con distribución vía Google Play (y en preparación para iOS/TestFlight).

### 2.3. Principio de diseño arquitectónico
- Toda persistencia pasa por Supabase (PostgreSQL + PostGIS) como única fuente de verdad.
- El acceso a datos desde los frontends se canaliza siempre a través de la API Hono, evitando llamadas directas al cliente de Supabase desde frontend, para mantener consistencia de lógica de negocio, validaciones y control de acceso.
- Los datos geoespaciales (GeoJSON de etapas) se centralizaron en la API, eliminando una duplicación previa que existía también en la carpeta pública de la web.

---

## 3. Stack tecnológico

| Capa | Tecnología |
|---|---|
| Web frontend | Next.js (App Router), desplegado en Vercel |
| API backend | Hono, desplegado en Render |
| Mobile | Expo SDK (React Native), EAS Build |
| Base de datos | Supabase — PostgreSQL con extensión PostGIS |
| Almacenamiento de imágenes | Cloudinary |
| Mapas | Mapbox (GL JS en web, `@rnmapbox/maps` en mobile) |
| Emails transaccionales | Resend, con dominio verificado propio |
| Pagos | Stripe (solo en web) |
| Monitorización de errores | Sentry (web activo, mobile pendiente de activación en próximo build) |
| Cron / health checks | cron-job.org |
| Internacionalización | Sistema propio de 7 idiomas (es, en, de, fr, it, pt, ko) |
| Traducción de mensajería | Modelo Claude Haiku vía API |

---

## 4. Base de datos

Motor: **PostgreSQL** gestionado por Supabase, con **PostGIS** habilitado para datos geoespaciales.

### 4.1. Modelo de roles: relación N:M
El sistema evolucionó de una relación 1:1 (columna `perfil_id` directa en las tablas de albergue/negocio) a un modelo **muchos a muchos** mediante tablas intermedias (`albergue_gestores`, `negocio_gestores`). Esto permite que un mismo perfil gestione varios establecimientos y que un establecimiento tenga varios gestores, reflejando mejor la realidad operativa del sector.

### 4.2. Datos geoespaciales de etapas
El trazado del Camino se modela mediante un GeoJSON unificado, servido desde la API, compuesto por 42 features: 33 etapas principales del Camino Francés, 3 variantes del Francés, y 6 correspondientes a los ramales hacia Fisterra (4) y Muxía (2).

Los "sectores" geográficos (Navarra, La Rioja, Burgos, Palencia, León, Lugo, A Coruña, Fisterra) no se derivan de una columna de base de datos, sino que se calculan a partir de rangos numéricos de etapa definidos en un fichero de configuración central, lo que permite reordenar o redefinir sectores sin tocar los datos.

### 4.3. Estado de ocupación de albergues
La ocupación se modela como un enum con cuatro valores reales: libre, casi_lleno, completo, cerrado. (Importante: no son "abierto"/"lleno" como podría asumirse intuitivamente — es una fuente frecuente de error si no se consulta el enum real).

### 4.4. Consultas geoespaciales optimizadas
Existe una función remota (RPC) dedicada para obtener albergues junto con sus coordenadas ya resueltas, evitando cálculos repetidos en cliente.

### 4.5. Regeneración de tipos
Cualquier cambio de esquema en la base de datos requiere regenerar inmediatamente los tipos TypeScript a partir del esquema real de Supabase, antes de escribir cualquier código que dependa de esas tablas. Este paso es tratado como no negociable dentro del flujo de trabajo, para evitar desincronización entre tipos y esquema real.

### 4.6. Duplicación de tipos entre repos (deuda técnica)
Actualmente los tipos generados se copian manualmente entre el monorepo web/API y el repositorio mobile. Está planeada su extracción a un paquete compartido (`packages/types`) para eliminar esta duplicación manual.

---

## 5. Backend API (Hono / Render)

- Hono actúa como capa intermedia entre los frontends y Supabase, centralizando lógica de negocio, autorización y validaciones.
- Sirve los datos geoespaciales (GeoJSON) de forma centralizada.
- Expone un endpoint de salud monitorizado externamente por un servicio de cron para detectar caídas.
- Gestión de variables de entorno específica de Render: el nombre de variable usado en este contexto de ejecución no lleva el prefijo público que sí se usa en Next.js, ya que ese prefijo solo tiene sentido cuando la variable debe exponerse al bundle de cliente.

### 5.1. Particularidad de headers en llamadas servidor-a-servidor
Se identificó que la plataforma de despliegue de la web (Vercel) elimina la cabecera estándar de autorización Bearer en peticiones hechas desde el servidor. La solución adoptada fue sustituir esa cabecera por una cabecera personalizada equivalente, y asegurarse de que la configuración CORS del backend Hono la acepta explícitamente en su lista de cabeceras permitidas.

---

## 6. Frontend Web (Next.js / Vercel)

### 6.1. Panel de administración
Interfaz completa con:
- Editor de etapas con seis pestañas de edición.
- Gestión de usuarios.
- Paneles de gestión de albergues y negocios.
- Interfaz exclusivamente en español (fijada explícitamente, independiente del idioma del visitante), bajo la premisa de que la prioridad real de experiencia multiidioma está en los paneles de cliente (web y mobile) para hospitaleros y negocios, no en el panel interno de administración.

### 6.2. Sistema de invitación de hospitaleros
Flujo completo y funcional de extremo a extremo, diseñado específicamente para sortear un problema de seguridad de correo detectado (ver sección 12, "Soluciones técnicas destacadas").

### 6.3. Paneles de gestión (pendientes de completar)
- Panel "mi albergue": faltan varias propiedades que debe recibir el componente (plan de eventos, coordenadas).
- Panel de administración de detalle de usuario individual: no construido todavía.
- Asignación de rol + establecimiento en una sola operación atómica: actualmente es un proceso manual en dos pasos separados, pendiente de unificación.

---

## 7. Aplicación móvil (Expo / React Native / EAS)

### 7.1. Estado de producción
Publicada en Google Play bajo el identificador de paquete de la app, actualmente en su versión con `versionCode` 11, distribuida en 46 países.

### 7.2. Construcción y despliegue (EAS)
- Proyecto gestionado bajo una cuenta EAS dedicada.
- Incremento automático de versión activado, con la fuente de versión gestionada de forma remota (no local).
- El artefacto `.aab` se sube manualmente a Play Console; está pendiente automatizar este paso mediante cuenta de servicio de Google (Service Account JSON) para permitir el envío automático (`eas submit`).

### 7.3. Mejoras recientes incorporadas en build de producción
- Corrección del flujo de cierre de sesión.
- División de la carga de la pantalla de perfil en carga crítica vs. carga diferida, por motivos de rendimiento percibido.
- Corrección del centrado del mapa, enganchado al evento de finalización de carga del propio mapa (en lugar de a temporizadores arbitrarios).
- Corrección de claves de traducción faltantes en el idioma español de la pantalla de aterrizaje (landing).
- Refactor de la galería de imágenes de etapa a una lista virtualizada (FlatList) con un modal de galería a pantalla completa.
- Renumeración de las etapas del ramal de Fisterra.
- Nuevos iconos de aplicación.

### 7.4. Autenticación con Google OAuth en mobile
Solución específica para el entorno móvil de Expo + Supabase:
- Flujo de autenticación implícito.
- Apertura del navegador del sistema para el flujo OAuth (en lugar de un WebView embebido).
- Configuración de la URL de sitio de Supabase apuntando a un esquema de deep-link propio de la app.
- Filtros de intent configurados en la configuración de la app para capturar el retorno del navegador.
- Contexto de autenticación global a nivel de layout raíz de la aplicación.
- Envío del token de autenticación en cabecera Bearer estándar en las llamadas a la API desde el cliente móvil (a diferencia del caso web-a-web descrito en la sección 5.1, aquí sí funciona el estándar porque no atraviesa la capa de funciones serverless de Vercel).
- Todo este flujo está documentado internamente en un fichero de referencia dedicado, dada su complejidad y fragilidad ante cambios de configuración.

### 7.5. Optimización de imágenes (pendiente)
Recomendación del propio Play Console sobre optimización de recursos (R2), no bloqueante, cuya resolución requiere incorporar un plugin de configuración de build nativo de Expo.

---

## 8. Sistema de roles y control de acceso

- Modelo N:M mediante tablas de unión (ver 4.1), reemplazando el modelo 1:1 original.
- Los roles determinan qué paneles y funcionalidades ve cada perfil (peregrino, hospitalero, gestor de negocio, administrador).
- Pendiente: unificación de la asignación de rol y establecimiento en una única operación transaccional/atómica, para evitar estados intermedios inconsistentes.

---

## 9. Internacionalización (i18n)

- 7 idiomas soportados: español, inglés, alemán, francés, italiano, portugués y coreano.
- Regla de negocio estricta: "Camino", nombres de variantes del Camino (p. ej. Camino Francés) y nombres propios de albergues **nunca** se traducen automáticamente. Solo se traducen nombres genéricos de puntos de interés (fuente, farmacia, restaurante, etc.).
- **Flujo de traducción en web**: script dedicado que usa Google Translate, traduciendo únicamente las claves que faltan respecto al idioma base, para minimizar coste y evitar retraducciones innecesarias.
- **Flujo de traducción en mobile**: script separado que usa el modelo Claude Haiku en lugar de Google Translate, ejecutado con variables de entorno cargadas explícitamente.
- **Traducción de mensajería en tiempo real**: a diferencia de las traducciones estáticas de interfaz, los mensajes de chat se traducen dinámicamente también mediante Claude Haiku.
- Pendiente: recalidad de las traducciones al coreano de los datos de interés generados originalmente por Google Translate, por resultar demasiado mecánicas/literales; sustitución planeada por la API de Claude.
- Simplificación futura prevista en los paneles de negocio: eliminar la pestaña de descripción en 7 idiomas y sustituirla por un único campo en español que se traduce automáticamente al guardar, reduciendo fricción de uso para los gestores de negocio.

---

## 10. Funcionalidades principales

### 10.1. Etapas del Camino
- Modeladas como features GeoJSON con datos de trazado real (reimportación planeada desde ficheros GPX oficiales del IGN para mayor precisión).
- Sistema de numeración y visualización especial para el ramal de Fisterra: la lógica original de visualización heredada (basada en desplazar el número interno) fue sustituida por una numeración secuencial más clara de cara al usuario.
- Caso pendiente de resolución de modelo de datos: la etapa "O Pedrouzo - Santiago" existe como un único slug pero representa en la práctica dos etapas reales distintas, lo que rompe la función "ver en mapa". Está pendiente decidir entre dividirla en dos etapas reales en base de datos o adaptar el GeoJSON para representarla correctamente sin duplicar el registro.

### 10.2. Ocupación de albergues en tiempo real
Estado de ocupación por albergue (libre / casi lleno / completo / cerrado), gestionado por los propios hospitaleros y consultado en tiempo real por los peregrinos — funcionalidad clave de diferenciación frente a la competencia, que no ofrece este dato en vivo.

### 10.3. Mensajería multilingüe en tiempo real
- Basada en la capa Realtime de Supabase sobre una tabla de mensajes.
- Estructura de canales: canal por etapa, canal por albergue, y mensajes directos entre usuarios.
- Traducción automática de cada mensaje al idioma del receptor mediante Claude Haiku, permitiendo conversación fluida entre peregrinos y hospitaleros de distintos países sin fricción de idioma.

### 10.4. Check-in de peregrinos (credencial digital)
Funcionalidad diseñada conforme al marco normativo español de registro de viajeros (Real Decreto 933/2021):
- El peregrino dispone de un código QR en su perfil.
- El albergue escanea el QR, visualiza los datos necesarios y puede exportarlos en PDF para su propio cumplimiento normativo.
- Diseño de privacidad por defecto: TuCamino almacena únicamente metadatos de la estancia (fechas, albergue), nunca los datos del documento de identidad del peregrino en sí.
- Funcionalidad de nivel premium.
- Integración con el sistema oficial de hospedajes (SES.HOSPEDAJES) planificada en dos fases: Fase A, generación de un informe formateado para envío manual (planteada como MVP vendible a corto plazo), seguida de una integración API completa más adelante.

### 10.5. Modelo freemium y monetización
- Los peregrinos tienen acceso gratuito íntegro a la plataforma, sin restricciones — decisión de producto deliberada para maximizar adopción y generar la red de usuarios que da valor a los otros dos perfiles.
- Los perfiles de albergue y negocio disponen de un número limitado de conversaciones gratuitas, tras el cual se activa un muro de pago.
- Suscripciones gestionadas vía Stripe, con precios diferenciados para albergues y para negocios.
- **Los pagos están implementados únicamente en la web**, nunca en la aplicación móvil — decisión deliberada para evitar la comisión del 30% de las tiendas de aplicaciones y los problemas de revisión asociados a flujos de pago dentro de apps móviles.
- Traspaso de sesión entre mobile y web para el flujo de pago mediante un token JWT pasado como parámetro de URL, permitiendo que el usuario móvil complete el pago en un contexto web autenticado sin fricción de re-login.

### 10.6. Roadmap de monetización futura
Fases V2/V3 previstas: suscripciones de albergue ampliadas y posicionamiento destacado (featured) en listados de etapas y resultados de búsqueda.

### 10.7. Geocaching del Camino (fase futura)
Funcionalidad de gamificación planeada para una fase 3: credencial gamificada con pistas geolocalizadas dejadas por otros peregrinos en puntos específicos de la ruta.

---

## 11. Integraciones de terceros

| Servicio | Uso |
|---|---|
| **Supabase** | Base de datos PostgreSQL + PostGIS, autenticación, Realtime (mensajería), Storage de configuración |
| **Cloudinary** | Almacenamiento y entrega de imágenes, con presets específicos por tipo de contenido (etapas, albergues, negocios, avatares) |
| **Mapbox** | Renderizado de mapas y trazados en web y mobile |
| **Resend** | Envío de emails transaccionales desde un dominio de correo verificado propio (subdominio de mail dedicado) |
| **Stripe** | Suscripciones de pago (solo en web) |
| **Sentry** | Monitorización de errores en producción (activo en web; código ya integrado en mobile, pendiente de activarse en el próximo build) |
| **cron-job.org** | Comprobación periódica de salud (health check) del endpoint de la API, con franja horaria acotada al huso horario de Madrid |

---

## 12. Soluciones técnicas destacadas

Esta sección recoge problemas no triviales resueltos durante el desarrollo, documentados como aprendizajes reutilizables.

### 12.1. Problema de escáneres de seguridad de email quemando tokens de un solo uso
El método estándar de invitación por email de Supabase genera enlaces que, al pasar por escáneres de seguridad de proveedores de correo (Gmail, gateways corporativos), son "visitados" automáticamente por el escáner mediante una petición GET — lo que consume el token de un solo uso antes de que el usuario real haga clic, dejando el enlace inválido.
**Solución adoptada**: generación del enlace de invitación en backend (sin enviarlo directamente por el mecanismo estándar), envío del email mediante Resend con una plantilla propia, y verificación del código en el cliente mediante una llamada que solo se ejecuta con JavaScript real del navegador del usuario — de forma que un escáner automático que no ejecuta JS no puede consumir el token.

### 12.2. Cabecera Authorization eliminada por la plataforma de despliegue
Ver sección 5.1: sustitución de la cabecera Bearer estándar por una cabecera personalizada equivalente en llamadas servidor-a-servidor desde la web, junto con el ajuste correspondiente en la configuración CORS del backend.

### 12.3. Fallos silenciosos por políticas de seguridad a nivel de fila (RLS)
Aprendizaje operativo clave: cuando una consulta a Supabase devuelve un resultado vacío sin ningún error explícito, la causa casi siempre es una política de RLS (Row Level Security) faltante o mal configurada para esa tabla/operación, no un problema de datos o de lógica de consulta. Esto se trata como primer punto de comprobación ante cualquier "desaparición" inexplicada de datos.

### 12.4. Centrado de mapa poco fiable
Sustitución de temporizadores arbitrarios por el enganche al evento nativo de finalización de carga del propio componente de mapa, eliminando condiciones de carrera entre la carga del mapa y el intento de centrado programático.

### 12.5. Renderizado de listas de imágenes pesadas
Refactor de la galería de imágenes de etapa de un renderizado simple a una lista virtualizada, evitando problemas de rendimiento y memoria con galerías largas en dispositivos móviles.

---

## 13. Seguridad

Área identificada explícitamente como pendiente de auditoría formal, cubriendo:
- Revisión de políticas RLS de Supabase.
- Exposición de variables de entorno.
- Autenticación de endpoints de la API Hono.
- Configuración CORS.
- Validación de firma de webhooks de Stripe.
- Expiración de tokens de invitación.
- Rate limiting.

Principios de seguridad ya aplicados de forma consistente:
- Ningún dato de documento de identidad se almacena en el sistema de check-in (solo metadatos de estancia).
- Ningún flujo de verificación de usuario depende de un número de teléfono personal del propietario del proyecto.
- Separación de credenciales/variables por entorno de despliegue (Render vs. Vercel) respetando el prefijo de exposición pública solo cuando es estrictamente necesario.

Otras tareas de seguridad/configuración pendientes:
- Verificación de dominio OAuth de Google en Search Console para `caminosantiago.app`, con el fin de eliminar el aviso de "app no verificada" mostrado a los usuarios. *(Actualización: el dominio ya fue verificado en Search Console mediante registro TXT sin afectar al registro MX de correo existente; queda pendiente confirmarlo como dominio autorizado dentro de la pantalla de consentimiento OAuth en Google Cloud Console).*
- Eliminación de un log de depuración de eventos de autenticación que quedó activo en el código, pendiente de retirar antes del siguiente build de producción.

---

## 14. Despliegue y flujo de trabajo (DevOps)

- **Web**: despliegue continuo en Vercel a partir del monorepo.
- **API**: despliegue en Render, con comprobación de salud externa vía cron-job.org (reactivación pendiente).
- **Mobile**: builds gestionados vía EAS Build, con subida manual del artefacto `.aab` a Google Play Console (automatización pendiente).
- **Disciplina de tipado**: verificación de tipos TypeScript obligatoria antes de cada push, corrigiendo errores de inmediato en lugar de acumularlos.
- **Git**: flujo centralizado desde la raíz del monorepo con remoto dedicado; nunca se hacen pushes parciales desde subcarpetas.
- **Entorno de desarrollo**: Windows/PowerShell, lo que impone restricciones concretas en la sintaxis de comandos (sin encadenado con `&&`, sin `grep`, variables de entorno declaradas con sintaxis propia de PowerShell, rutas con caracteres especiales requiriendo tratamiento literal explícito).
- **iOS (planificado)**: build en la nube vía EAS (sin necesidad de hardware Mac), distribución beta vía TestFlight a un grupo de hospitaleros de contacto (todos usuarios de iPhone), pendiente de alta de cuenta de desarrollador de Apple.

---

## 15. Deuda técnica y funcionalidades pendientes (resumen)

**Bugs pendientes:**
- Corrección de la lógica de traducción de comentarios (uso incorrecto de la comparación de idioma en lugar del campo de idioma de origen), pendiente de aplicar tanto en el panel de experiencias de mobile como en la sección de comentarios de web; incluye reseteo manual y retraducción de un comentario concreto ya afectado.
- Caso de etapa dual "O Pedrouzo - Santiago" (ver 10.1).
- Props faltantes en el panel "mi albergue".

**Funcionalidades incompletas:**
- Panel de administración de detalle de usuario individual.
- Asignación atómica de rol + establecimiento.
- Simplificación de la pestaña de descripción multiidioma en negocio a un único campo con auto-traducción.
- Lanzamiento en iOS.
- Fase A del check-in oficial (informe manual) como MVP vendible previo a integración API completa.

**Deuda técnica diferida:**
- Extracción de tipos compartidos a un paquete común entre repos.
- Reimportación de trazados de etapa desde GPX oficiales del IGN.
- Sistema de subida de fotos (fotos de etapa desde admin + contribuciones de peregrinos vía Cloudinary).
- Rutas alternativas en el mapa web.
- Funcionalidad de "etapas completadas" en mobile.
- Mejora de diseño de emails transaccionales y de la página de confirmación de email.
- Flujo de auto-registro de hospitaleros basado en verificación cruzada por email.

---

## 16. Principios de trabajo y patrones de decisión del equipo

- Cambios de alcance amplio se consultan antes de generarse íntegramente, prefiriendo diffs o fragmentos dirigidos frente a la regeneración de ficheros completos, salvo que el cambio sea extenso y se confirme explícitamente.
- Toda operación masiva sobre base de datos se valida primero sobre una muestra reducida de registros antes de ejecutarse sobre el conjunto completo.
- El acceso a datos desde frontend se canaliza siempre a través de la API, nunca mediante llamadas directas al cliente de Supabase desde los componentes de interfaz.

---

*Documento generado a partir del estado y contexto de desarrollo conocido del proyecto TuCamino / caminosantiago.app.*
