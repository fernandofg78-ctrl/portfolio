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
      mono: "'Inter', sans-serif",
      bodyWeight: "400",
    },
    layout: {
      nameStroke: "none",
      cardRadius: "4px",
      borderWidth: "1px",
      heroTitleCase: "none",
      heroWeight: "700",
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
      mono: "'Inter', sans-serif",
      bodyWeight: "300",
    },
    layout: {
      nameStroke: "1px rgba(232,228,220,0.2)",
      cardRadius: "0px",
      borderWidth: "1px",
      heroTitleCase: "none",
      heroWeight: "700",
    },
  },

  brutal: {
    name: "brutal",
    label: "Brutal",
    colors: {
      background: "#F2EFE8",
      surface: "#ECEAE3",
      primary: "#0D0D0D",
      secondary: "rgba(13,13,13,0.5)",
      accent: "#0D0D0D",
      accentGold: "transparent",
      text: "#0D0D0D",
      textMuted: "rgba(13,13,13,0.4)",
      textOutline: "transparent",
      border: "#0D0D0D",
      statNum: "#0D0D0D",
      navBg: "#F2EFE8",
      featuredBadge: "#0D0D0D",
      featuredBadgeText: "#F2EFE8",
    },
    font: {
      heading: "'Space Grotesk', sans-serif",
      body: "'Space Grotesk', sans-serif",
      mono: "'Space Mono', monospace",
      bodyWeight: "400",
    },
    layout: {
      nameStroke: "2px #0D0D0D",
      cardRadius: "0px",
      borderWidth: "2px",
      heroTitleCase: "uppercase",
      heroWeight: "900",
    },
  },
};

export const defaultTheme = themes.default;
