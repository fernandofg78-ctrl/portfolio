// src/hooks/useApplyTheme.js
// Aplica las variables CSS del tema activo al elemento raíz del DOM

import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export const useApplyTheme = () => {
  const { currentTheme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    const { colors, font, layout } = currentTheme;

    // Colores base
    root.style.setProperty("--color-background", colors.background);
    root.style.setProperty("--color-surface", colors.surface);
    root.style.setProperty("--color-primary", colors.primary);
    root.style.setProperty("--color-secondary", colors.secondary);
    root.style.setProperty("--color-accent", colors.accent);
    root.style.setProperty("--color-accent-gold", colors.accentGold);
    root.style.setProperty("--color-text", colors.text);
    root.style.setProperty("--color-text-muted", colors.textMuted);
    root.style.setProperty("--color-text-outline", colors.textOutline);
    root.style.setProperty("--color-border", colors.border);
    root.style.setProperty("--color-stat-num", colors.statNum);
    root.style.setProperty("--color-nav-bg", colors.navBg);
    root.style.setProperty("--color-featured-badge", colors.featuredBadge);
    root.style.setProperty(
      "--color-featured-badge-text",
      colors.featuredBadgeText,
    );

    // Tipografía
    root.style.setProperty("--font-heading", font.heading);
    root.style.setProperty("--font-body", font.body);
    root.style.setProperty("--font-body-weight", font.bodyWeight);

    // Layout
    root.style.setProperty("--name-stroke", layout.nameStroke);
    root.style.setProperty("--card-radius", layout.cardRadius);
  }, [currentTheme]);
};
