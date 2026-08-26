# nexTapa — Documentación Técnica

**Trabajo Fin de Máster (TFM)**
Plataforma de descubrimiento de bares y tapas con búsqueda por proximidad, disponibilidad dinámica, verificación de establecimientos y sistema de valoraciones.

---

## 1. Resumen del proyecto

nexTapa es una aplicación full-stack orientada al descubrimiento de bares y tapas cercanos al usuario. Combina geolocalización en tiempo real, un sistema de disponibilidad dinámica de tapas (qué hay disponible ahora mismo en cada establecimiento), un flujo de verificación de negocios por parte de administración, y un sistema de valoraciones diferenciado por rol de usuario.

El proyecto se ha desarrollado en equipo: la autenticación (JWT, contexto de sesión, protección de rutas) y las notificaciones en tiempo real de elementos pendientes fueron implementadas por un compañero de equipo; el resto de la arquitectura frontend, la lógica de negocio de disponibilidad/apertura, el sistema de búsqueda, geolocalización, valoraciones y los paneles de administración/hostelero constituyen el grueso del desarrollo propio, partiendo de un concepto original con tres roles de usuario.

### Roles de usuario

- **Cliente**: descubre establecimientos, busca por proximidad, consulta disponibilidad de tapas, deja valoraciones.
- **Hostelero**: gestiona su(s) propio(s) establecimiento(s) y sus tapas a través de un panel dedicado; puede crear nuevos establecimientos (quedan pendientes de verificación); también puede valorar como cliente.
- **Administrador**: control total sobre establecimientos, tapas, usuarios y reseñas; gestiona el flujo de verificación de nuevos negocios y cupones/promociones pendientes; no participa en el sistema de valoraciones (rol no habilitado para puntuar).

---

## 2. Arquitectura general

La aplicación sigue una arquitectura cliente-servidor desacoplada:

- **Frontend público**: SPA en React, orientada al descubrimiento y consumo por parte de clientes y hosteleros, con estilos basados en utilidades (Tailwind CSS).
- **Panel de administración**: módulo independiente dentro del mismo frontend, con sistema de estilos propio (CSS personalizado, sin utilidades), pensado para densidad de información y flujos de gestión (CRUD, tablas, formularios extensos).
- **Backend**: API REST sobre Node.js/Express, con capa de autenticación por JWT, controladores por dominio (establecimientos, tapas, usuarios, reseñas, búsqueda) y lógica de agregación intensiva contra MongoDB.
- **Base de datos**: MongoDB Atlas, con índices geoespaciales (2dsphere) para consultas de proximidad e índices compuestos para garantizar unicidad contextual (por ejemplo, slugs únicos por establecimiento en lugar de globalmente únicos).
- **Almacenamiento de medios**: Cloudinary, con subida mediante streaming (buffer a stream) para evitar escritura en disco del servidor.
- **Mapas y geocodificación**: Mapbox GL JS para renderizado de mapas interactivos y geocodificación de direcciones.
- **Comunicación en tiempo real**: WebSocket para notificar al panel de administración sobre elementos pendientes de revisión (nuevos establecimientos, cupones) sin necesidad de refrescar o hacer polling.

La comunicación entre frontend y backend se realiza mediante una instancia centralizada de cliente HTTP con inyección automática de token y URL base configurable por entorno, evitando así discrepancias entre entornos de desarrollo y producción.

---

## 3. Stack tecnológico

**Frontend**
- React (con Vite como bundler y servidor de desarrollo)
- React Router DOM para enrutamiento y paso de estado entre vistas
- Tailwind CSS para el frontend público
- CSS personalizado con sistema de nomenclatura propio para el panel de administración
- `@dnd-kit` (core + sortable) para interacciones de arrastrar y soltar
- Mapbox GL JS para mapas
- Librería de lightbox para visualización ampliada de imágenes

**Backend**
- Node.js + Express
- Mongoose como ODM sobre MongoDB Atlas
- Autenticación basada en JSON Web Tokens
- Multer para la recepción de archivos multipart
- Cloudinary SDK, con `streamifier` para convertir buffers en streams subibles

**Infraestructura y operaciones**
- Render (plan gratuito) para el despliegue del backend
- Servicio externo de *ping* periódico para evitar la hibernación del backend en el plan gratuito
- MongoDB Compass como herramienta de administración directa de índices y datos

---

## 4. Sistema de búsqueda

El sistema de búsqueda se diseñó para ofrecer resultados en tiempo real conforme el usuario escribe, minimizando la carga sobre el backend y la base de datos.

**Características principales:**
- Búsqueda en tiempo real mediante un endpoint dedicado que ejecuta múltiples consultas de expresión regular en paralelo contra distintos campos/colecciones relevantes (nombre de establecimiento, tapas, etc.), en lugar de consultas secuenciales.
- Endpoint de sugerencias independiente, optimizado para combinar en una sola consulta de agregación: búsqueda geoespacial (`$geoNear`), enriquecimiento de datos relacionados (`$lookup`) y segmentación de resultados en múltiples categorías dentro de una misma respuesta (`$facet`). Esto permite obtener en una sola ida y vuelta al servidor tanto establecimientos cercanos como sugerencias de texto, evitando múltiples llamadas independientes.
- Hook de frontend dedicado a la búsqueda, con *debounce* de 300 ms para evitar disparar peticiones en cada pulsación de tecla, y cancelación de peticiones en curso mediante `AbortController` cuando el usuario sigue escribiendo (evita condiciones de carrera y respuestas obsoletas sobrescribiendo resultados más recientes).
- Componente de resultados desplegables reutilizado tanto en la cabecera de la aplicación como en la página de inicio, evitando duplicación de lógica de presentación.
- Página de resultados de búsqueda con carga diferida (*lazy loading*) mediante `IntersectionObserver`, cargando progresivamente resultados a medida que el usuario se desplaza, en lugar de paginación tradicional o carga completa inicial.

---

## 5. Geolocalización y proximidad

El descubrimiento de establecimientos cercanos es una de las funcionalidades centrales de la aplicación.

**Características principales:**
- Índice geoespacial `2dsphere` sobre la colección de establecimientos, requisito para poder ejecutar agregaciones de proximidad.
- Cálculo de distancia y ordenación por cercanía mediante la etapa de agregación `$geoNear`, que debe situarse obligatoriamente como primera etapa del pipeline de agregación para funcionar correctamente.
- Hook de frontend dedicado a la geolocalización del navegador, con almacenamiento en caché local (localStorage) para evitar solicitar permisos y recalcular la posición en cada carga de página.
- Mecanismo de reserva (*fallback*): si el usuario no concede permisos de geolocalización o esta no está disponible, la aplicación recurre a un listado general de establecimientos sin ordenación por distancia, garantizando que la funcionalidad principal nunca quede bloqueada por falta de permisos.
- Propagación de la distancia ya calculada desde la vista de listado/búsqueda hacia la vista de detalle del establecimiento mediante el estado de navegación de React Router, evitando así recalcular o volver a consultar la distancia al backend al entrar en el detalle. Esta técnica tiene como limitación que el estado de navegación no persiste ante recargas de página o accesos directos por URL, por lo que no se utiliza como fuente de datos para la inicialización de formularios u otra lógica que deba sobrevivir a una recarga.

---

## 6. Estado de apertura/cierre y disponibilidad de tapas

Uno de los diferenciadores funcionales de la aplicación es poder mostrar, en tiempo real, si un establecimiento está abierto y qué tapas están efectivamente disponibles en ese momento.

**Características principales:**
- Lógica de "abierto/cerrado" y de "disponibilidad" implementada mediante funciones auxiliares explícitas aplicadas sobre los documentos recuperados de la base de datos, en sustitución de un enfoque inicial basado en propiedades virtuales de Mongoose.
- Motivo del cambio de enfoque: las propiedades virtuales de Mongoose no se conservan cuando los documentos pasan por operaciones de agregación (como `$lookup`) ni cuando se consultan en modo "lean" (sin hidratar como documentos completos de Mongoose), lo que provocaba que esta información desapareciera de forma inconsistente según el endpoint utilizado. Las funciones auxiliares se aplican de forma explícita y consistente en todos los puntos de la API que devuelven establecimientos o tapas, garantizando que el estado calculado esté siempre presente independientemente del camino de consulta utilizado.
- Esta lógica se aplica de manera uniforme en todos los endpoints relevantes (listado, búsqueda, detalle, sugerencias), evitando divergencias entre lo que ve el usuario en distintas partes de la aplicación.

---

## 7. Sistema de valoraciones (reviews)

Sistema de puntuación y reseñas de establecimientos, diseñado para evitar duplicidad y ofrecer una lectura rápida de la valoración media.

**Características principales:**
- Modelo de datos con índice único compuesto (usuario + establecimiento, no un índice único global), permitiendo que un mismo usuario valore distintos establecimientos pero impidiendo valoraciones duplicadas sobre el mismo establecimiento.
- Cálculo de la puntuación media mediante agregación en base de datos en lugar de cálculo en memoria en el servidor de aplicación, delegando el trabajo pesado a MongoDB.
- Control de acceso basado en rol: únicamente los roles de cliente y hostelero pueden emitir valoraciones; a los administradores se les presenta una invitación a iniciar sesión con otro tipo de cuenta en lugar de la interfaz de valoración, ya que el rol de administrador queda excluido del sistema de puntuación por diseño.
- Componente de valoración compacto de una sola línea, combinando la puntuación numérica media de gran tamaño con una fila de estrellas interactiva, en sustitución de layouts más verbosos, priorizando la densidad de información y la usabilidad.
- Sección de perfil de usuario ("Mis valoraciones") que lista las valoraciones emitidas por el usuario, con lógica de deduplicación para evitar mostrar entradas repetidas cuando existen relaciones anidadas o consultas solapadas.

---

## 8. Panel de administración

Interfaz de gestión integral para el rol de administrador, separada visual y estructuralmente del frontend público.

**Características principales:**
- CRUD completo sobre las cuatro entidades principales del dominio: establecimientos, tapas, usuarios y reseñas.
- Panel principal (dashboard) con cuadrícula de estadísticas y accesos directos a las acciones más frecuentes.
- Diseño responsive con dos modos de navegación según el tamaño de pantalla: en dispositivos móviles se muestra un botón de menú tipo "hamburguesa" que despliega una barra lateral deslizante superpuesta; en escritorio se muestra una barra lateral fija y siempre visible. La transición entre ambos modos se resuelve íntegramente mediante CSS (sin lógica JavaScript adicional de detección de tamaño), utilizando un punto de corte de diseño (*breakpoint*) fijado en 968 píxeles.
- Pestañas de elementos pendientes de revisión (establecimientos y cupones nuevos) que conservan y reutilizan la lógica de notificación por WebSocket ya existente en el proyecto, evitando reimplementar la capa de tiempo real.
- Sistema de listados con filtrado y búsqueda en el lado del cliente mediante memoización, evitando recomputar filtrados costosos en cada renderizado cuando los datos de entrada no han cambiado.
- Convención de nomenclatura CSS propia con prefijo dedicado para todas las clases del panel de administración, manteniendo el CSS de administración completamente aislado del sistema de utilidades usado en el frontend público, decisión tomada deliberadamente para no migrar el panel de administración a dicho sistema de utilidades dentro del alcance del TFM.

---

## 9. Panel de hostelero

Interfaz de gestión reducida, pensada para que un usuario con rol de hostelero administre su(s) propio(s) negocio(s) sin acceso al resto de funciones administrativas globales.

**Características principales:**
- El mismo componente de detalle de establecimiento se reutiliza en tres modos de funcionamiento distintos (administración, hostelero, creación), controlados mediante una propiedad de configuración (*prop*) en lugar de duplicar el componente para cada contexto, reduciendo la superficie de mantenimiento y garantizando coherencia visual y funcional entre los tres flujos.
- Los establecimientos creados desde este panel nacen con estado "no verificado" por defecto, entrando automáticamente en la cola de revisión de administración, que es notificada en tiempo real mediante el sistema de WebSocket ya mencionado.

---

## 10. Autenticación y autorización

Componente desarrollado por un miembro del equipo, integrado sin modificar su implementación interna.

**Características principales:**
- Autenticación basada en JSON Web Tokens.
- Contexto de autenticación en el frontend que expone el estado de sesión a toda la aplicación.
- Protección de rutas mediante guardas que restringen el acceso según el estado de autenticación y el rol del usuario.
- Middleware de backend reutilizado tal cual por el resto de módulos del sistema (verificación de token y restricción por rol), de forma que las nuevas funcionalidades desarrolladas se adaptan a las funciones ya exportadas por esta capa en lugar de introducir mecanismos paralelos de autenticación o autorización, manteniendo un único punto de verdad para estas responsabilidades.

---

## 11. Notificaciones en tiempo real

Capa de comunicación en tiempo real, también desarrollada por un miembro del equipo, orientada a mantener informado al panel de administración sobre elementos que requieren revisión.

**Características principales:**
- Conexión WebSocket dedicada a notificar la aparición de nuevos elementos pendientes (establecimientos por verificar, cupones por aprobar).
- Reutilizada por las pestañas de pendientes del panel de administración para reflejar cambios sin necesidad de recarga manual ni sondeo periódico (*polling*) al backend.

---

## 12. Gestión de imágenes (Cloudinary)

**Características principales:**
- Subida de imágenes mediante conversión de buffer a stream, evitando la necesidad de escribir archivos temporales en el sistema de ficheros del servidor.
- Optimización automática de formato y calidad de imagen en la propia plataforma de almacenamiento, reduciendo de forma notable el peso de las imágenes servidas (de varios megabytes por imagen a decenas de kilobytes) sin intervención manual sobre cada archivo.
- Punto técnico relevante: los parámetros de formato y calidad deben especificarse en el nivel raíz de la configuración de subida/transformación y no anidados dentro del array de transformaciones, ya que en ese segundo caso la optimización falla de forma silenciosa (sin error visible) y las imágenes se sirven sin optimizar.
- Uso de una librería de *lightbox* en el frontend para la visualización ampliada de imágenes de establecimientos y tapas.

---

## 13. Mapas y geocodificación (Mapbox)

**Características principales:**
- Renderizado de mapas interactivos mediante Mapbox GL JS, tanto para mostrar la ubicación de establecimientos como, previsiblemente, para apoyar flujos de geocodificación de direcciones al dar de alta un negocio.
- Inicialización del mapa mediante un patrón de referencia por *callback* (`useCallback` como ref) en lugar de una referencia estática (`useRef`), garantizando que el nodo del DOM sobre el que se monta el mapa exista realmente antes de que Mapbox intente inicializarse sobre él; evita así condiciones de carrera entre el ciclo de vida de React y la inicialización de una librería externa que manipula el DOM directamente.

---

## 14. Infraestructura y despliegue

**Características principales:**
- Backend desplegado en el plan gratuito de Render, que por defecto hiberna la instancia tras un periodo de inactividad.
- Servicio externo de *ping* programado cada 14 minutos para mantener la instancia del backend activa y evitar los tiempos de arranque en frío asociados a la hibernación del plan gratuito.
- Configuración del servidor de desarrollo de Vite con la opción de exposición en red local, permitiendo probar la aplicación desde dispositivos móviles conectados a la misma red durante el desarrollo.
- Separación de entornos mediante variables de entorno para la URL base de la API, consumida por la instancia centralizada de cliente HTTP del panel de administración; esta configuración evita fallos observados al usar peticiones nativas con rutas relativas, que resultaban incompatibles con la disparidad de puertos entre el servidor de desarrollo del frontend y el del backend en entorno local.

---

## 15. Decisiones técnicas y problemas resueltos

Resumen de los aprendizajes técnicos más relevantes surgidos durante el desarrollo, con valor especialmente didáctico de cara a la defensa del TFM:

1. **Propiedades virtuales de Mongoose y agregaciones**: las propiedades virtuales no sobreviven a operaciones de `$lookup` ni a consultas en modo "lean". Solución adoptada: funciones auxiliares explícitas aplicadas de forma consistente en todos los endpoints, en lugar de depender de comportamiento implícito del ODM.

2. **Configuración de Cloudinary**: los parámetros de formato y calidad de imagen deben declararse en el nivel raíz de la petición de subida, no dentro del array de transformaciones; su omisión en el lugar correcto provoca un fallo silencioso sin mensaje de error.

3. **Orden de etapas en agregaciones geoespaciales**: `$geoNear` debe ser obligatoriamente la primera etapa de cualquier pipeline de agregación que la utilice; se combina con `$lookup` y `$facet` para resolver en una sola consulta lo que de otro modo requeriría múltiples idas y vueltas al servidor.

4. **Índices únicos compuestos frente a índices únicos globales**: para el sistema de slugs (identificadores legibles en URL) se optó por un índice único compuesto sobre slug y establecimiento, evitando colisiones entre establecimientos distintos que pudieran generar el mismo slug. Este cambio de modelo requirió eliminar manualmente el índice único global preexistente directamente en la base de datos, ya que Mongoose no elimina automáticamente índices obsoletos al modificar el esquema.

5. **Estado de navegación de React Router como optimización, no como fuente de verdad**: es válido y eficiente para evitar peticiones redundantes al pasar de un listado a un detalle, pero al no sobrevivir a recargas de página ni a accesos directos por URL, no debe utilizarse para inicializar formularios ni cualquier lógica que deba funcionar de forma independiente al camino de navegación seguido por el usuario. Este matiz fue origen de un error intermitente al guardar elementos, resuelto al identificar la dependencia oculta de dicho estado.

6. **Inicialización de librerías externas que manipulan el DOM**: el uso de una referencia por callback en lugar de una referencia estática garantiza que el nodo destino exista en el momento de inicializar Mapbox, evitando fallos de inicialización dependientes del orden de renderizado.

7. **Consistencia en el acceso a la API desde el panel de administración**: el uso de una instancia de cliente HTTP centralizada con URL base configurable e inyección automática de credenciales evita discrepancias de comportamiento entre entornos de desarrollo y producción, problema que sí se manifestaba al emplear peticiones nativas con rutas relativas.

8. **Integración con código de terceros dentro del mismo equipo**: como principio de trabajo colaborativo, el desarrollo propio se adapta a las funciones ya exportadas por los módulos de autenticación y notificaciones en tiempo real desarrollados por el compañero de equipo, en lugar de introducir implementaciones paralelas, minimizando conflictos de integración y preservando un único punto de responsabilidad por dominio funcional.

---

## 16. Consideraciones de diseño de interfaz

- Preferencia general por patrones de interfaz compactos y funcionales frente a alternativas más vistosas pero menos eficientes en espacio: por ejemplo, alternancia (toggle) en línea frente a botones separados de edición y borrado, o el ya mencionado componente de valoración de una sola línea.
- Descomposición de componentes grandes en subcomponentes con responsabilidades acotadas e interfaces de propiedades (*props*) claras, favoreciendo la reutilización mediante variantes controladas por props (como el componente de detalle de establecimiento con sus tres modos) en lugar de la duplicación de código entre contextos similares.
- Separación intencional y mantenida de los dos sistemas de estilos del proyecto (utilidades para el frontend público, CSS propio con prefijo dedicado para el panel de administración), sin previsión de unificarlos dentro del alcance de este trabajo.

---

## 17. Conclusión

nexTapa integra, dentro de un mismo proyecto de alcance TFM, un conjunto de problemas técnicos representativos de aplicaciones reales de descubrimiento geolocalizado: consultas geoespaciales eficientes, estados calculados dinámicamente y consistentes entre endpoints, gestión optimizada de medios, control de acceso diferenciado por rol, comunicación en tiempo real y coexistencia ordenada de dos sistemas de interfaz (público y administrativo) dentro de una misma base de código. Las decisiones documentadas en la sección 15 constituyen el núcleo de aprendizaje técnico del proyecto y son especialmente relevantes para justificar, durante la defensa, tanto los problemas encontrados como el razonamiento detrás de cada solución adoptada.
