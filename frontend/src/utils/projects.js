// src/utils/projects.js
// Datos estáticos de los proyectos del portfolio

import mazarifeImg from "../assets/images/mazarife.webp";
import rfgImg from "../assets/images/rfg.webp";
import santiagoImg from "../assets/images/santiago.webp";
import tapaImg from "../assets/images/tapa.webp";

export const projects = [
  {
    id: "ahorcado",
    title: "Ahorcado Bilingüe",
    description:
      "Juego del ahorcado en React con soporte para español e inglés.",
    tech: ["React"],
    url: "https://hangman-alpha-fawn.vercel.app/hangman",
    repo: "https://github.com/fernandofg78-ctrl/hangman",
    image: null,
  },
  {
    id: "mazarife",
    title: "Mazarife.es",
    description:
      "App para asociación cultural con acceso por roles y gestión de contenido.",
    tech: ["React", "Node", "MongoDB"],
    url: "mazarife.es",
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
    id: "nextapa",
    title: "Nextapa",
    description: "App para descubrir tapas cercanas. Proyecto del máster.",
    tech: ["React", "Express", "MongoDB"],
    url: "https://nextapa.netlify.app/",
    repo: "https://github.com/FSD1125STR/TFM-amarillo-frontend",
    repoBackend: "https://github.com/FSD1125STR/TFM-amarillo-backend",
    image: tapaImg,
  },
  {
    id: "camino",
    title: "CaminoSantiago.app",
    description: "Aplicación para planificar el Camino de Santiago.",
    tech: ["Next.js"],
    url: "https://caminosantiago.app/",
    repo: "https://github.com/nano-tucamino/camino-app-web",
    image: santiagoImg,
  },
  {
    id: "portfolio",
    title: "Este portfolio",
    description:
      "Portfolio personal con sistema de temas visuales y panel admin.",
    tech: ["React", "Express", "MongoDB"],
    url: null,
    repo: null,
    image: null,
  },
];
