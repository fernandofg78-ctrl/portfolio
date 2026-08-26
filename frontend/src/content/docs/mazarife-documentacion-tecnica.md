# Documentación Técnica — Mazarife App

**Aplicación de gestión para la Asociación Cultural y Deportiva de Villar de Mazarife (León, España)**
**Dominio de producción:** mazarife.es
**Estado:** En producción, con usuarios reales
**Mantenimiento:** Desarrollador único (full-stack, diseño, despliegue y operación)

---

## 1. Visión general

Mazarife App es una aplicación web de gestión integral para una asociación cultural y deportiva. Centraliza la administración de socios, las finanzas de la asociación, la organización de eventos, la comunicación mediante un blog, una galería multimedia y un canal de sugerencias de los socios. Sustituye procesos que antes se gestionaban de forma manual o dispersa (hojas de cálculo, comunicación informal) por un sistema único con control de acceso, trazabilidad y automatización de tareas recurrentes.

La aplicación está diseñada como PWA instalable, con especial atención a la experiencia en dispositivos móviles, dado el perfil de los usuarios finales (socios de una asociación local, no necesariamente familiarizados con herramientas técnicas).

---

## 2. Arquitectura general

### 2.1 Modelo de despliegue

La aplicación sigue una arquitectura desacoplada de frontend y backend, cada uno desplegado de forma independiente:

- **Frontend:** desplegado en Vercel, servido de forma estática con renderizado en cliente (SPA).
- **Backend:** API REST en Node.js/Express, desplegada en Render.
- **Base de datos y autenticación:** gestionadas por Supabase (PostgreSQL gestionado + servicio de Auth).
- **Almacenamiento de medios:** Cloudinary, para imágenes de galería, blog y comprobantes/facturas.
- **Monitorización de errores:** Sentry, integrado tanto en frontend como en backend.

Esta separación permite escalar, desplegar y depurar cada capa de forma independiente, así como aprovechar los planes gratuitos de cada proveedor, algo relevante dado que se trata de un proyecto de una asociación sin ánimo de lucro con recursos limitados.

### 2.2 Organización del código

El proyecto se estructura como un monorepo con dos subdirectorios principales, uno para el backend y otro para el frontend. Esta convivencia en un mismo repositorio simplifica la coordinación de cambios que afectan a ambas capas (por ejemplo, cambios de contrato de API), a costa de requerir configuración de build específica por subcarpeta en cada plataforma de despliegue.

### 2.3 Comunicación frontend-backend

La comunicación entre cliente y servidor se realiza mediante peticiones HTTP a un dominio de API independiente (subdominio dedicado), no mediante funciones serverless integradas en el propio frontend. Esto simplifica el modelo mental de la aplicación (una única API REST, un único origen de verdad para la lógica de negocio) y evita los límites de tiempo de ejecución característicos de las funciones serverless para operaciones más pesadas (generación de informes, tareas por lotes, etc.).

La autenticación entre cliente y servidor se resuelve mediante cookies HTTP-only, en lugar de tokens gestionados manualmente en el cliente (localStorage/sessionStorage). Esta decisión responde a un criterio de seguridad: las cookies HTTP-only no son accesibles desde JavaScript en el navegador, lo que mitiga el riesgo de robo de sesión mediante ataques de tipo XSS. La contrapartida es la necesidad de configurar correctamente atributos de cookies entre subdominios distintos (frontend y API en dominios/subdominios diferentes) y de indicar explícitamente al backend que confíe en el proxy inverso de la plataforma de despliegue para la correcta interpretación de cabeceras relacionadas con HTTPS y la IP de origen real del cliente.

---

## 3. Módulos funcionales

### 3.1 Gestión de socios

Módulo de administración del censo de socios de la asociación. Permite dar de alta, modificar y dar de baja socios, así como gestionar su estado (activo/inactivo) de forma masiva, lo cual resulta especialmente relevante en los procesos anuales de renovación de cuotas: la asociación puede dar de baja en bloque a la totalidad de socios al inicio de un nuevo periodo y reactivarlos individualmente conforme van formalizando el pago de la cuota correspondiente.

Existe un tratamiento diferenciado para menores de edad: la aplicación contempla un sistema de exenciones anuales de cuota vinculado a la edad del socio, de forma que los niños que superan determinada edad durante el año dejan automáticamente de estar exentos en periodos sucesivos. Este dato de exención se almacena de forma independiente al histórico de pagos, manteniendo separada la información de "quién está exento y por qué" de la información de "qué movimientos económicos se han producido".

### 3.2 Módulo de finanzas

Es el módulo de mayor complejidad y desarrollo activo de la aplicación. Sus responsabilidades incluyen:

**Registro de movimientos económicos.** Ingresos y gastos de la asociación se registran como movimientos individuales, cada uno vinculado a una categoría. Los movimientos de gasto contemplan un flujo de reembolso (por ejemplo, a socios que adelantan dinero en nombre de la asociación), con distintos estados de reembolso que se preservan correctamente durante la edición del movimiento en lugar de reiniciarse por defecto, evitando así la pérdida accidental de información sobre reembolsos ya gestionados.

**Adjuntos de factura/comprobante.** Cada movimiento puede llevar asociado un archivo de factura o comprobante, subido a Cloudinary. La lógica de actualización del movimiento distingue explícitamente entre "no se ha tocado el adjunto" y "se ha subido un adjunto nuevo", de forma que editar un movimiento sin modificar su factura no sobrescribe ni borra el archivo existente.

**Sistema de categorías.** Las categorías financieras son configurables y se diferencian por tipo (ingreso o gasto). El modelo de datos impone que no pueden existir dos categorías con el mismo nombre y el mismo tipo, pero sí puede coexistir una categoría de ingreso y una de gasto con idéntico nombre, tratándose como entidades independientes en base de datos aunque se presenten agrupadas visualmente en los resúmenes por nombre de categoría.

**Resumen y agregación financiera.** La vista de resumen agrupa los movimientos por nombre de categoría (no por identificador interno), permitiendo mostrar en una misma fila el balance de ingresos y gastos de conceptos que comparten nombre pero corresponden a registros distintos en base de datos. Cada entrada del resumen mantiene una referencia a los distintos identificadores subyacentes que agrupa, para poder operar sobre ellos (por ejemplo, al renombrar una categoría) sin perder la asociación con todos los movimientos implicados.

**Comisión bancaria automatizada.** La asociación soporta una comisión bancaria periódica que se registra automáticamente sin intervención manual, mediante un trabajo programado a nivel de base de datos que se ejecuta en los últimos días de cada mes. El diseño de este proceso es idempotente: puede ejecutarse más de una vez sin duplicar el movimiento generado, lo cual es una garantía necesaria en trabajos programados que podrían, en determinadas condiciones, reintentarse o solaparse. Se prioriza este enfoque de automatización a nivel de base de datos frente a alternativas basadas en disparadores desde el propio frontend (que solo se ejecutarían si un usuario abre la aplicación) o servicios externos de cron, dado que garantiza la ejecución con independencia de si la aplicación es utilizada activamente ese mes.

**Exportación e informes.** Generación de documentos PDF con los movimientos financieros, incluyendo tablas formateadas. La generación se realiza en el lado del cliente, evitando así carga adicional en el servidor y evitando también la generación de PDFs mediante conversión de HTML, que resulta menos fiable y más costosa de mantener.

**Funcionalidad prevista — movimientos recurrentes.** Está planificada la incorporación de una opción para registrar automáticamente un movimiento repetido durante los doce meses del año a partir de un único registro (por ejemplo, para gastos fijos mensuales), generando una entrada independiente por cada mes con la fecha correspondiente ajustada, así como una función de duplicado rápido por movimiento individual desde el listado.

### 3.3 Gestión de eventos

Módulo para la publicación y organización del calendario de actividades de la asociación (eventos culturales y deportivos), visible para los socios como forma de comunicación de la actividad asociativa.

### 3.4 Blog

Sistema de publicación de contenido tipo blog para comunicados, crónicas de eventos y noticias de interés para los socios. Las entradas del blog son compartibles en redes sociales con vista previa enriquecida (ver apartado 4.4).

### 3.5 Galería de fotografías

Repositorio visual de imágenes de eventos y actividades de la asociación, con almacenamiento y entrega de medios a través de Cloudinary.

### 3.6 Buzón de sugerencias

Canal mediante el cual los socios pueden enviar sugerencias o comentarios a la junta de la asociación, centralizando esta comunicación dentro de la propia aplicación en lugar de depender de canales informales (correo electrónico personal, mensajería).

---

## 4. Características técnicas transversales

### 4.1 Aplicación web progresiva (PWA)

La aplicación es completamente instalable como PWA. Se ha resuelto de forma diferenciada la instalación según plataforma:

- En Android, se aprovecha el evento nativo del navegador que permite ofrecer un prompt de instalación controlado desde la propia interfaz.
- En iOS, dado que Safari no expone ese mismo mecanismo, se ofrece una guía/modal manual con instrucciones específicas para instalar la aplicación desde el menú de compartir del navegador.
- Se detecta también si la aplicación ya está instalada, para no mostrar la invitación a instalar de forma redundante.

En cuanto a la estrategia de caché de red, las peticiones a la API se configuran explícitamente para no pasar por caché (política de "solo red"), priorizando la consistencia de los datos financieros y de socios frente a la disponibilidad offline de esos datos, que en este contexto se considera menos crítica que evitar mostrar información desactualizada o inconsistente.

### 4.2 Autenticación y seguridad

- Autenticación basada en cookies HTTP-only gestionadas por el backend, evitando la exposición de tokens de sesión a JavaScript en el cliente.
- Configuración explícita de confianza en el proxy inverso en el servidor Express, necesaria para que la plataforma de despliegue del backend gestione correctamente el tráfico HTTPS entrante y las cabeceras derivadas (protocolo, IP origen), condición indispensable para que las cookies seguras funcionen correctamente en producción.
- Uso de una librería de cabeceras de seguridad HTTP a nivel de aplicación Express, junto con limitación de tasa de peticiones (rate limiting) para mitigar abuso de la API.
- Separación de roles a nivel de acceso a base de datos: existe un cliente de Supabase con privilegios de administrador (rol de servicio) reservado para operaciones que requieren saltarse las políticas de seguridad a nivel de fila, y un cliente con privilegios anónimos/estándar para el resto de operaciones, siguiendo el principio de mínimo privilegio.

### 4.3 Modelo de datos y particularidades de Supabase/PostgreSQL

- Uso de restricciones de unicidad compuestas (por ejemplo, nombre + tipo en categorías financieras) para modelar reglas de negocio directamente en el esquema de base de datos, en lugar de depender exclusivamente de validaciones en la capa de aplicación.
- Identificado y documentado un comportamiento no evidente del cliente de Supabase al filtrar por "distinto de" sobre columnas que permiten valores nulos: dicho filtro excluye silenciosamente las filas con valor nulo en esa columna, en lugar de incluirlas (que sería el comportamiento intuitivo esperado, dado que un valor nulo es, por definición, "distinto" de cualquier valor concreto). La solución adoptada consiste en expresar explícitamente la condición como una disyunción entre "la columna es nula" y "la columna es distinta del valor", evitando así la pérdida silenciosa de registros en resultados filtrados.
- Para operaciones de creación idempotente de registros que podrían ejecutarse concurrentemente (evitando condiciones de carrera), se ha adoptado el patrón de intentar la inserción directamente y capturar el error específico de violación de restricción de unicidad, en lugar del patrón tradicional de comprobar primero la existencia del registro y luego insertar, que es susceptible a condiciones de carrera entre la comprobación y la inserción.
- Automatización de procesos periódicos a nivel de base de datos mediante trabajos programados (cron) nativos de PostgreSQL/Supabase, con capacidad de auditoría de ejecuciones (historial de ejecuciones del job) y de desactivación puntual del job cuando sea necesario.
- El plan de base de datos utilizado no incluye recuperación a un punto en el tiempo (Point-in-Time Recovery), lo cual condiciona la estrategia de copias de seguridad y el margen de recuperación ante errores destructivos accidentales.

### 4.4 Compartición social y SEO del blog (Open Graph)

Dado que la aplicación es una SPA (renderizado en el cliente mediante JavaScript), los robots de redes sociales que generan las vistas previas al compartir un enlace no ejecutan JavaScript y por tanto no pueden "ver" el contenido dinámico de una entrada de blog concreta si este se genera únicamente en el navegador del usuario final. Para resolver esto, se ha implementado una capa de middleware a nivel de la plataforma de despliegue del frontend que:

1. Detecta si la petición entrante proviene de un robot de redes sociales (mediante el identificador de agente de usuario).
2. Si es así, obtiene los datos de la entrada de blog correspondiente consultando la API pública del backend.
3. Devuelve una respuesta con metaetiquetas Open Graph generadas dinámicamente para esa entrada concreta (título, descripción, imagen), en lugar de servir el HTML genérico de la SPA.

Esta solución garantiza que compartir un enlace a una entrada de blog concreta en redes sociales muestre una vista previa correcta y específica de esa entrada, sin necesidad de migrar la aplicación a un modelo de renderizado en servidor de forma generalizada.

### 4.5 Gestión de medios

Cloudinary actúa como almacén y CDN de imágenes (galería, blog, comprobantes de gasto). La subida de archivos sigue un patrón de subida firmada: el backend genera una firma de subida bajo demanda y el frontend realiza la subida directamente a Cloudinary utilizando esa firma, sin que el archivo pase por el servidor backend. Este patrón reduce la carga y el consumo de ancho de banda del backend, además de acelerar la subida al evitar un salto intermedio innecesario.

### 4.6 Generación de documentos

Los informes en PDF (por ejemplo, informes de movimientos financieros) se generan íntegramente en el cliente mediante librerías de generación de PDF y de tablas dentro de PDF, en lugar de generarse en el backend. Esta decisión evita la necesidad de un motor de renderizado en servidor, reduce la carga del backend y simplifica el despliegue, a costa de depender de las capacidades del navegador del usuario.

### 4.7 Monitorización y observabilidad

Sentry se integra tanto en frontend como en backend, proporcionando captura centralizada de errores en producción en ambas capas. Esto se complementa con los logs propios de la plataforma de despliegue del backend como fuente adicional de diagnóstico ante incidencias en producción.

### 4.8 Consideraciones de infraestructura de bajo coste

Al operar sobre planes gratuitos de las distintas plataformas, existen limitaciones operativas específicas que se han tenido en cuenta en el diseño:

- El servicio de backend en su plan gratuito entra en reposo tras periodos de inactividad, lo que introduce latencia en la primera petición tras un periodo sin uso. Para mitigarlo, se mantiene el servicio activo mediante un ping periódico durante la franja horaria de uso habitual de la aplicación, evitando así que los socios experimenten tiempos de arranque en frío durante el horario normal de actividad, sin necesidad de incurrir en el coste de un plan de pago que mantenga el servicio permanentemente activo.
- El plan de base de datos no incluye recuperación a un punto en el tiempo, lo que hace más relevante la disciplina de pruebas antes de operaciones destructivas y de despliegue.

### 4.9 Particularidades de plataforma y compatibilidad

- **Sensibilidad a mayúsculas/minúsculas en el sistema de archivos de producción:** el entorno de build del frontend en producción distingue mayúsculas de minúsculas en los nombres de archivo, a diferencia de los sistemas operativos de escritorio habituales en desarrollo local, donde estas diferencias pueden pasar desapercibidas. Esto puede provocar que una aplicación que compila correctamente en el entorno local de desarrollo falle al compilar en producción si existe una discrepancia de capitalización entre el nombre de un archivo y la ruta usada para importarlo. Como práctica de mitigación, se ejecuta la compilación de producción de forma local antes de cada despliegue, para detectar este tipo de errores antes de que lleguen a la plataforma de despliegue.
- **Compatibilidad con Safari en iOS:** se han adoptado unidades de altura relativas a la ventana visible real (en lugar de las unidades de viewport estándar) para el correcto dimensionado de ventanas modales, dado que las unidades de viewport estándar se comportan de forma inconsistente en Safari iOS cuando la interfaz del navegador se expande o contrae dinámicamente. Asimismo, se fuerza un tamaño de fuente mínimo en los campos de formulario para evitar que iOS realice un zoom automático no deseado al enfocar un campo de entrada de texto.
- **Vigencia de versión de Node.js:** la versión del entorno de ejecución de Node.js utilizada en el proyecto tiene una fecha de fin de soporte conocida en la plataforma de despliegue del frontend, lo que constituye un elemento de deuda técnica a resolver antes de dicha fecha para evitar la interrupción de los despliegues.

---

## 5. Convenciones y estilo de desarrollo

- Módulos ES (ES Modules) en todo el proyecto, sin uso del sistema de módulos CommonJS.
- Exportaciones nombradas exclusivamente, evitando exportaciones por defecto, para favorecer la consistencia y la facilidad de refactorización de importaciones.
- Ausencia de punto y coma al final de las sentencias, como convención de estilo consistente en todo el código.
- Indentación de dos espacios y uso de comillas simples como convención uniforme.
- Cliente HTTP centralizado en un único punto de acceso a la API, importado de forma nombrada y consistente en todo el frontend, evitando instancias dispersas de configuración de peticiones HTTP.
- Los activos estáticos del frontend se ubican en el directorio de recursos públicos, diferenciado del código fuente, siguiendo la convención estándar de herramientas de build modernas para archivos que deben servirse sin procesar.

---

## 6. Flujos de trabajo operativos propios de la asociación

- **Renovación anual de cuotas:** proceso de baja masiva de socios al inicio de periodo seguido de reactivación individual conforme se formaliza cada pago, en lugar de un proceso de renovación automática, lo que da control explícito a la junta directiva sobre qué socios están al corriente de pago en cada momento.
- **Exenciones por edad:** revisión anual de exenciones de cuota para socios menores que superan el umbral de edad establecido, gestionada como un registro independiente del histórico de movimientos económicos.
- **Comisión bancaria:** registrada de forma completamente automática y desatendida, sin requerir ninguna acción manual ni la apertura de la aplicación por parte de ningún usuario.

---

## 7. Dirección técnica futura

- **Limpieza de código heredado:** eliminación de manejadores y propiedades ya no utilizados tras la simplificación de la interfaz de renombrado de categorías, y decisión pendiente sobre la conservación o retirada del endpoint de backend correspondiente, que ha quedado sin consumidores tras dicha simplificación.
- **Actualización de la versión del entorno de ejecución** antes de la fecha de fin de soporte anunciada por la plataforma de despliegue del frontend.
- **Evolución hacia modelo multi-inquilino (SaaS):** se contempla una posible evolución del proyecto hacia un producto ofrecible a otras asociaciones, mediante una reestructuración que introduzca un identificador de organización en el modelo de datos de todas las entidades relevantes, tratando a la asociación actual como el primer inquilino del sistema. Esta evolución contemplaría, entre otros elementos: configuración por organización (identidad visual, activación/desactivación de módulos funcionales), enrutamiento por subdominio para cada organización, un sistema de planes de suscripción con pasarela de pago, y una sección de portada configurable por organización con imágenes propias.
- **Uso como pieza de portafolio profesional** del desarrollador, junto con un segundo proyecto independiente (aplicación para el Camino de Santiago).

---

*Documento generado a partir del histórico de desarrollo y decisiones técnicas del proyecto. Refleja el estado y las decisiones conocidas hasta la fecha de generación; requiere actualización manual conforme evolucione la aplicación.*
