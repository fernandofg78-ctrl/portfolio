// src/utils/projects.js
// Datos estáticos de los proyectos del portfolio

import mazarifeImg from "../assets/images/villar.webp";
import rfgImg from "../assets/images/pera.webp";
import santiagoImg from "../assets/images/camino-2.webp";
import tapaImg from "../assets/images/tapa-2.webp";
import obrasImg from "../assets/images/obras-d-nivel-1.webp";
import ferImg from "../assets/images/fer.webp";

//features para brutaliam
import superAdminObrasd from "../assets/images/features-brutal/obras-superadmin.webp";

export const projects = [
  {
    id: "obras",
    title: "ObrasDeNivel",
    description:
      "SaaS para profesionales de la construcción. Web automática, presupuestos desde el móvil y control total de obras.",
    tech: [
      "Next.js",
      "TypeScript",
      "Hono",
      "Monorepo",
      "Cloudinary",
      "Sentry",
      "Stripe",
      "React Native",
      "WhatsApp API",
      "IA",
    ],
    url: "https://www.obrasdenivel.es/",
    repo: null,
    image: obrasImg,
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
          "Generación automática de descripciones y contenidos para la web usando inteligencia artificial.",
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
        title: "App móvil",
        description:
          "Aplicación nativa en React Native disponible en Google Play para gestionar todo desde cualquier lugar.",
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
        title: "Partidas por voz",
        description:
          "Crea partidas presupuestarias dictando por voz. La IA transcribe y estructura el contenido automáticamente.",
        image: null,
      },
      {
        id: "obras-f10",
        title: "Gestión de obras",
        description:
          "Control del estado de cada obra con previsión de inicio, fin, seguimiento de fases y documentación adjunta.",
        image: null,
      },
    ],
  },
  {
    id: "camino",
    title: "CaminoSantiago.app",
    description:
      "Aplicación para peregrinos del Camino de Santiago. Etapas, mapas interactivos y chat multilingüe con traducción instantánea.",
    tech: [
      "Next.js",
      "Hono",
      "Supabase",
      "Mapbox",
      "i18n",
      "Claude API",
      "Cloudinary",
      "Analytics",
      "IGN",
    ],
    url: "https://caminosantiago.app/",
    repo: null,
    image: santiagoImg,
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
        title: "Todos los albergues",
        description:
          "Base de datos completa de albergues con fotos, precios, ocupación en tiempo real y valoraciones.",
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
        title: "App React Native",
        description:
          "Versión móvil nativa en desarrollo para iOS y Android con funcionalidad offline.",
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
    id: "nextapa",
    title: "Nextapa",
    description:
      "App para descubrir tapas cercanas con geolocalización 2dsphere, horarios en tiempo real y panel multi-rol. Proyecto fin de máster.",
    tech: ["React", "Express", "MongoDB", "2dsphere"],
    url: "https://tfm-amarillo-frontend.onrender.com/",
    repo: null,
    image: tapaImg,
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
        title: "Filtros avanzados",
        description:
          "Filtra por precio, tipo de tapa, tipo de establecimiento y disponibilidad en tiempo real.",
        image: null,
      },
      {
        id: "nextapa-f3",
        title: "Valoraciones",
        description:
          "Sistema de valoración independiente para tapas y establecimientos, con puntuación y comentarios.",
        image: null,
      },
      {
        id: "nextapa-f4",
        title: "Panel de administrador",
        description:
          "Control total de la plataforma: usuarios, establecimientos, tapas y moderación de contenido.",
        image: null,
      },
      {
        id: "nextapa-f5",
        title: "Panel de hostelero",
        description:
          "Gestión integral del negocio: carta, horarios, fotos, disponibilidad de tapas y estadísticas.",
        image: null,
      },
    ],
  },
  {
    id: "mazarife",
    title: "Mazarife.es",
    description:
      "App para asociación cultural con acceso por roles, gestión de contenido y monitorización en producción.",
    tech: ["React", "Node", "Supabase", "Claude API", "Sentry"],
    url: "https://mazarife.es/",
    repo: null,
    image: mazarifeImg,
    features: [
      {
        id: "mazarife-f1",
        title: "Contenido dinámico público",
        description:
          "La parte pública muestra contenido generado y gestionado desde el panel de administración.",
        image: null,
      },
      {
        id: "mazarife-f2",
        title: "Control de usuarios",
        description:
          "Gestión de altas, bajas y roles de los miembros de la asociación con acceso por niveles.",
        image: null,
      },
      {
        id: "mazarife-f3",
        title: "Control de finanzas",
        description:
          "Registro de ingresos, gastos, facturas y balances para la gestión económica de la asociación.",
        image: null,
      },
      {
        id: "mazarife-f4",
        title: "Blog de actividades",
        description:
          "Creación y publicación de artículos sobre actividades culturales directamente desde el panel.",
        image: null,
      },
    ],
  },
  {
    id: "rfg",
    title: "RFG Construcción",
    description:
      "Sitio web corporativo para empresa constructora. Germen de la idea que derivó en ObrasDeNivel.",
    tech: ["Next.js", "Supabase"],
    url: "https://rfg-khaki.vercel.app/",
    repo: null,
    image: rfgImg,
    features: [
      {
        id: "rfg-f1",
        title: "Posicionamiento local",
        description:
          "Web optimizada para SEO local, orientada a captar clientes en la zona geográfica del negocio.",
        image: null,
      },
      {
        id: "rfg-f2",
        title: "Panel de administración",
        description:
          "Panel supersencillo e intuitivo para que el cliente gestione su contenido sin conocimientos técnicos.",
        image: null,
      },
      {
        id: "rfg-f3",
        title: "Gestión de obras con tags",
        description:
          "Creación y organización de obras mediante etiquetas para clasificar por tipo, estado o zona.",
        image: null,
      },
    ],
  },
  {
    id: "portfolio",
    title: "Este portfolio",
    description:
      "Portfolio personal con sistema de temas visuales intercambiables y mockups interactivos.",
    tech: ["React", "Vite", "CSS"],
    url: null,
    repo: null,
    image: ferImg,
    features: [
      {
        id: "portfolio-f1",
        title: "4 temas visuales",
        description:
          "Sistema de temas intercambiables en tiempo real: Default, Brutalism, Groovy y Archive, cada uno con su identidad.",
        image: null,
      },
      {
        id: "portfolio-f2",
        title: "Mockups interactivos",
        description:
          "Cada proyecto muestra un iPhone con la web real cargada en un iframe, navegable en directo.",
        image: null,
      },
      {
        id: "portfolio-f3",
        title: "Easter egg",
        description: "Abre tres proyectos distintos y descubre qué pasa... 🥚",
        image: null,
      },
    ],
  },
];
