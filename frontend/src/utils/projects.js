// src/utils/projects.js
// Datos estáticos de los proyectos del portfolio

import mazarifeImg from "../assets/images/villar.webp";
import rfgImg from "../assets/images/pera.webp";
import santiagoImg from "../assets/images/camino-2.webp";
import tapaImg from "../assets/images/tapa-2.webp";
import hangmanImg from "../assets/images/hangman.webp";
import ferImg from "../assets/images/fer.webp";

export const projects = [
  {
    id: "camino",
    title: "CaminoSantiago.app",
    description: "Aplicación para planificar el Camino de Santiago.",
    tech: [
      "Next.js",
      "Supabase",
      "Claude",
      "Mapbox",
      "Hono",
      "Multiidioma",
      "Cloudinary",
      "Analytics",
      "...",
    ],
    url: "https://caminosantiago.app/",
    repo: "https://github.com/nano-tucamino/camino-app-web",
    image: santiagoImg,
  },
  {
    id: "nextapa",
    title: "Nextapa",
    description:
      "App para descubrir tapas cercanas. Proyecto colaborativo fin del máster.",
    tech: ["React", "Express", "MongoDB"],
    url: "https://tfm-amarillo-frontend.onrender.com/",
    repo: "https://github.com/FSD1125STR/TFM-amarillo-frontend",
    repoBackend: "https://github.com/FSD1125STR/TFM-amarillo-backend",
    image: tapaImg,
  },

  {
    id: "mazarife",
    title: "Mazarife.es",
    description:
      "App para asociación cultural con acceso por roles y gestión de contenido.",
    tech: ["React", "Node", "Supabase", "Claude", "Sentry"],
    url: "https://mazarife.es/",
    repo: "https://github.com/fernandofg78-ctrl/mazarife-app",
    image: mazarifeImg,
  },
  {
    id: "rfg",
    title: "RFG Construcción",
    description: "Sitio web corporativo para empresa constructora.",
    tech: ["Next.js", "Supabase"],
    url: "https://rfg-khaki.vercel.app/",
    repo: "https://github.com/fernandofg78-ctrl/rfg",
    image: rfgImg,
  },

  {
    id: "ahorcado",
    title: "Ahorcado Bilingüe",
    description:
      "Juego del ahorcado con un diccionario en español e inglés de 15000 palabras. Proyecto de React para practicar storgate, fetch y componentes.",
    tech: ["React"],
    url: "https://hangman-alpha-fawn.vercel.app",
    repo: "https://github.com/fernandofg78-ctrl/hangman",
    image: hangmanImg,
  },
  {
    id: "portfolio",
    title: "Este portfolio",
    description:
      "Portfolio personal con sistema de temas visuales y panel admin.",
    tech: ["React", "Express", "MongoDB"],
    url: null,
    repo: null,
    image: ferImg,
  },
];
