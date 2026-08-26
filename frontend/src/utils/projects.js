// src/utils/projects.js
// Datos estáticos de los proyectos del portfolio

import mazarifeImg from "../assets/images/villar.webp";
import santiagoImg from "../assets/images/camino-2.webp";
import tapaImg from "../assets/images/tapa-2.webp";
import obrasImg from "../assets/images/obras-d-nivel-1.webp";

//features para brutaliam
import superAdminObrasd from "../assets/images/features-brutal/obras-superadmin.webp";

import mazarifeDoc from "../content/docs/mazarife-documentacion-tecnica.md?raw";
import nextapaDoc from "../content/docs/nexTapa_documentacion_tecnica.md?raw";
import obrasDoc from "../content/docs/obras-de-nivel-documentacion-tecnica.md?raw";
import caminoDoc from "../content/docs/TuCamino_Documentacion_Tecnica.md?raw";

export const projects = [
  {
    id: "obras",
    title: "ObrasDeNivel",
    description:
      "SaaS terminado para profesionales de la construcción. Web automática, presupuestos desde el móvil y control total de obras. Ya en producción con app en Google Play.",
    tech: [
      "Next.js",
      "TypeScript",
      "Hono",
      "Turborepo",
      "React Native",
      "App en Google Play",
      "Supabase",
      "Cloudinary",
      "Sentry",
      "Stripe",
      "WhatsApp API",
      "IA",
    ],
    url: "https://www.obrasdenivel.es/",
    repo: null,
    playStoreUrl:
      "https://play.google.com/store/apps/details?id=es.obrasdenivel.app",
    image: obrasImg,

    docsContent: obrasDoc,
    docsFilename: "obras-de-nivel-documentacion-tecnica.md",

    features: [
      {
        id: "obras-f1",
        title: "SaaS multitenant",
        description:
          "Arquitectura multitenant que permite gestionar múltiples empresas de forma independiente desde una sola plataforma.",
        image: superAdminObrasd,
      },
      {
        id: "obras-f2",
        title: "Web desde el móvil",
        description:
          "Crea y actualiza tu web profesional directamente desde el móvil, sin necesidad de ordenador ni conocimientos técnicos.",
        image: null,
      },
      {
        id: "obras-f3",
        title: "Obras con posicionamiento",
        description:
          "Cada obra tiene su propia página con SEO local, galería de fotos y ficha completa para atraer clientes.",
        image: null,
      },
      {
        id: "obras-f4",
        title: "Textos generados con IA",
        description:
          "Generación automática de descripciones y contenidos SEO para la web usando inteligencia artificial.",
        image: null,
      },
      {
        id: "obras-f5",
        title: "Planes y características",
        description:
          "Varios planes de suscripción con acceso progresivo a características avanzadas según las necesidades del negocio.",
        image: null,
      },
      {
        id: "obras-f6",
        title: "App móvil en Google Play",
        description:
          "Aplicación nativa en React Native, publicada en Google Play, para gestionar todo desde cualquier lugar.",
        image: null,
      },
      {
        id: "obras-f7",
        title: "Presupuestos al instante",
        description:
          "Genera presupuestos profesionales en minutos directamente desde la app, con partidas, IVA y notas.",
        image: null,
      },
      {
        id: "obras-f8",
        title: "Envío por WhatsApp o mail",
        description:
          "Envía el presupuesto al cliente vía WhatsApp o correo electrónico con un solo toque.",
        image: null,
      },
      {
        id: "obras-f9",
        title: "Gestión de obras",
        description:
          "Control del estado de cada obra con partidas tipo checklist, finanzas y galería de fotos.",
        image: null,
      },
    ],
  },
  {
    id: "camino",
    title: "CaminoSantiago.app",
    description:
      "Plataforma en producción para peregrinos, hospitaleros y negocios del Camino de Santiago. Ocupación de albergues en tiempo real, mapas y chat multilingüe con IA. App en Google Play, distribuida en 46 países.",
    tech: [
      "Next.js",
      "Hono",
      "App en Google Play",
      "i18n",
      "Chat multi idioma",
      "PostGIS",
      "Mapbox",
      "Claude API",
      "Cloudinary",
      "Stripe",
      "Resend",
    ],
    url: "https://caminosantiago.app/",
    repo: null,
    playStoreUrl:
      "https://play.google.com/store/apps/details?id=com.obrasdenivel.caminomobile",
    image: santiagoImg,

    docsContent: caminoDoc,
    docsFilename: "TuCamino_Documentacion_Tecnica.md",

    features: [
      {
        id: "camino-f1",
        title: "Guía completa Camino Francés",
        description:
          "Toda la información necesaria para completar el Camino Francés: distancias, desniveles, servicios y consejos.",
        image: null,
      },
      {
        id: "camino-f2",
        title: "Todas las etapas",
        description:
          "Fichas detalladas de cada etapa con puntos clave, perfil de altitud y puntos de interés destacados.",
        image: null,
      },
      {
        id: "camino-f3",
        title: "Ocupación de albergues en tiempo real",
        description:
          "Estado de ocupación (libre, casi lleno, completo, cerrado) actualizado en directo por los propios hospitaleros.",
        image: null,
      },
      {
        id: "camino-f4",
        title: "Puntos de interés",
        description:
          "Puntos geodésicos oficiales del IGN integrados: fuentes, iglesias, servicios y lugares imprescindibles.",
        image: null,
      },
      {
        id: "camino-f5",
        title: "Mapas interactivos",
        description:
          "Mapas detallados con Mapbox sobre datos oficiales del Instituto Geográfico Nacional.",
        image: null,
      },
      {
        id: "camino-f6",
        title: "Web en 7 idiomas",
        description:
          "Interfaz completamente traducida a español, inglés, alemán, francés, portugués, italiano y coreano.",
        image: null,
      },
      {
        id: "camino-f7",
        title: "Chat multiidioma con IA",
        description:
          "Los peregrinos pueden comunicarse en su idioma. La API de Claude traduce los mensajes en tiempo real.",
        image: null,
      },
      {
        id: "camino-f8",
        title: "App en Google Play",
        description:
          "Aplicación nativa publicada en Google Play, distribuida en 46 países.",
        image: null,
      },
      {
        id: "camino-f9",
        title: "Perfiles de peregrinos",
        description:
          "Perfil personalizado con historial de etapas, notas del camino y conexiones con otros peregrinos.",
        image: null,
      },
      {
        id: "camino-f10",
        title: "Panel de hospitalero",
        description:
          "Control absoluto del albergue: fotos, comentarios, descripciones, ocupación y gestión de reservas.",
        image: null,
      },
    ],
  },
  {
    id: "mazarife",
    title: "Mazarife.es",
    description:
      "App PWA para asociación cultural con acceso por roles, gestión de contenido, finanzas y monitorización en producción.",
    tech: [
      "React",
      "Node",
      "Express",
      "Supabase",
      "Cloudinary",
      "Sentry",
      "PWA",
    ],
    url: "https://mazarife.es/",
    repo: null,
    image: mazarifeImg,
    arcadeUrl: "https://app.arcade.software/share/2lFHk4GKUoZX6kE9nP9D",

    docsContent: mazarifeDoc,
    docsFilename: "mazarife-documentacion-tecnica.md",

    features: [
      {
        id: "mazarife-f1",
        title: "Instalable como PWA",
        description:
          "Instalación nativa en Android y guía manual en iOS, para usarla como una app más del móvil.",
        image: null,
      },
      {
        id: "mazarife-f2",
        title: "Contenido dinámico público",
        description:
          "La parte pública muestra contenido generado y gestionado desde el panel de administración.",
        image: null,
      },
      {
        id: "mazarife-f3",
        title: "Control de usuarios",
        description:
          "Gestión de altas, bajas y roles de los miembros de la asociación con acceso por niveles.",
        image: null,
      },
      {
        id: "mazarife-f4",
        title: "Finanzas completas",
        description:
          "Ingresos y gastos por categoría, reembolsos con estado persistente, adjuntos de factura, comisión bancaria automática y exportación de informes en PDF.",
        image: null,
      },
      {
        id: "mazarife-f5",
        title: "Blog de actividades",
        description:
          "Creación y publicación de artículos sobre actividades culturales directamente desde el panel.",
        image: null,
      },
      {
        id: "mazarife-f6",
        title: "Infraestructura en Vercel y Render",
        description:
          "Frontend desplegado en Vercel y backend en Render, con monitorización de errores en tiempo real vía Sentry.",
        image: null,
      },
      {
        id: "mazarife-f7",
        title: "Tareas automatizadas con cron",
        description:
          "Procesos periódicos como la comisión bancaria mensual se ejecutan solos mediante cron jobs, sin intervención manual.",
        image: null,
      },
      {
        id: "mazarife-f8",
        title: "Coste operativo: 0€",
        description:
          "Toda la infraestructura en producción funciona sobre planes gratuitos (Vercel, Render, Supabase, Cloudinary), sin coste de mantenimiento para la asociación.",
        image: null,
      },
      {
        id: "mazarife-f9",
        title: "Movimientos recurrentes automatizados",
        description:
          "Generación automática de movimientos periódicos (cuotas, comisiones) para evitar la carga manual repetitiva cada mes.",
        image: null,
      },
    ],
  },
  {
    id: "nextapa",
    title: "Nextapa",
    description:
      "App para descubrir tapas cercanas con geolocalización 2dsphere, horarios en tiempo real y panel multi-rol. Proyecto fin de máster.",
    tech: ["React", "Express", "MongoDB", "2dsphere", "Mapbox"],
    url: "https://tfm-amarillo-frontend.onrender.com/",
    repo: null,
    image: tapaImg,

    docsContent: nextapaDoc,
    docsFilename: "nexTapa_documentacion_tecnica.md",

    features: [
      {
        id: "nextapa-f1",
        title: "Búsqueda por proximidad",
        description:
          "Geolocalización con índices 2dsphere de MongoDB para encontrar tapas y locales ordenados por distancia real.",
        image: null,
      },
      {
        id: "nextapa-f2",
        title: "Disponibilidad en tiempo real",
        description:
          "Estado de apertura y disponibilidad de tapas calculado dinámicamente y consistente en toda la app.",
        image: null,
      },
      {
        id: "nextapa-f3",
        title: "Valoraciones",
        description:
          "Sistema de valoración por establecimiento, con puntuación media calculada en base de datos.",
        image: null,
      },
      {
        id: "nextapa-f4",
        title: "Panel de administrador",
        description:
          "Verificación de nuevos negocios, moderación de contenido y gestión de usuarios y reseñas.",
        image: null,
      },
      {
        id: "nextapa-f5",
        title: "Panel de hostelero",
        description:
          "Gestión integral del negocio: carta, horarios, fotos y disponibilidad de tapas.",
        image: null,
      },
      {
        id: "nextapa-f6",
        title: "Búsqueda instantánea optimizada",
        description:
          "Resultados en vivo con debounce de 300ms y cancelación de peticiones anteriores para una experiencia fluida sin sobrecarga del servidor.",
        image: null,
      },
      {
        id: "nextapa-f7",
        title: "Notificaciones en tiempo real",
        description:
          "Avisos instantáneos vía WebSocket para hosteleros y administradores ante nueva actividad en la plataforma.",
        image: null,
      },
      {
        id: "nextapa-f8",
        title: "Panel responsive",
        description:
          "Sidebar fijo en escritorio y menú hamburguesa en móvil, adaptado para gestionar el negocio desde cualquier dispositivo.",
        image: null,
      },
    ],
  },
];
