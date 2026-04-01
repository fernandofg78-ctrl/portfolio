// src/themes/themes.js
// Definición de todos los temas visuales del portfolio

export const themes = {
  default: {
    name: "default",
    label: "Claro",
    colors: {
      background: "#ffffff",
      surface: "#f5f5f5",
      primary: "#1a1a1a",
      secondary: "#666666",
      accent: "#1a1a1a",
      accentGold: "transparent",
      text: "#1a1a1a",
      textMuted: "#999999",
      textOutline: "transparent",
      border: "#e5e5e5",
      statNum: "#1a1a1a",
      navBg: "rgba(255,255,255,0.92)",
      featuredBadge: "#f0f0f0",
      featuredBadgeText: "#666666",
    },
    font: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif",
      bodyWeight: "400",
    },
    layout: {
      nameStroke: "none",
      cardRadius: "4px",
      sectionLabelStyle: "normal",
    },
  },

  dark: {
    name: "dark",
    label: "Oscuro",
    colors: {
      background: "#0a0a0a",
      surface: "#111111",
      primary: "#e8e4dc",
      secondary: "rgba(232,228,220,0.45)",
      accent: "#C9A84C",
      accentGold: "#C9A84C",
      text: "#e8e4dc",
      textMuted: "rgba(232,228,220,0.35)",
      textOutline: "rgba(232,228,220,0.2)",
      border: "rgba(255,255,255,0.07)",
      statNum: "#C9A84C",
      navBg: "rgba(10,10,10,0.92)",
      featuredBadge: "rgba(201,168,76,0.1)",
      featuredBadgeText: "#C9A84C",
    },
    font: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif",
      bodyWeight: "300",
    },
    layout: {
      nameStroke: "1px rgba(232,228,220,0.2)",
      cardRadius: "0px",
      sectionLabelStyle: "uppercase",
    },
  },
};

export const defaultTheme = themes.default;
