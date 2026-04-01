// src/components/layout/Navbar.jsx
// Barra de navegación principal con selector de temas

import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { themes } from "../../themes/themes";
import styles from "./Navbar.module.css";

// Colores de los dots representando cada tema
const DOT_COLORS = {
  default: "#ffffff",
  dark: "#0a0a0a",
  brutal: "#F2EFE8",
};

export const Navbar = () => {
  const { currentTheme, changeTheme } = useTheme();
  const isBrutal = currentTheme.name === "brutal";

  return (
    <>
      {/* Google Fonts para Space Grotesk/Mono — solo se carga si brutal está activo */}
      {isBrutal && (
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700;900&family=Space+Mono:wght@400;700&display=swap"
        />
      )}

      <nav className={`${styles.navbar} ${isBrutal ? styles.brutal : ""}`}>
        <Link to="/" className={styles.logo}>
          {isBrutal ? "FER.DEV" : "fer.dev"}
        </Link>
        <div className={styles.right}>
          <ul className={styles.links}>
            <li>
              <Link to="/">Proyectos</Link>
            </li>
            <li>
              <a href="#contact">Contacto</a>
            </li>
          </ul>
          <div className={styles.themeSwitcher}>
            {Object.values(themes).map((theme) => (
              <button
                key={theme.name}
                className={`${styles.themeDot} ${
                  currentTheme.name === theme.name ? styles.active : ""
                }`}
                onClick={() => changeTheme(theme.name)}
                title={theme.label}
                aria-label={`Tema ${theme.label}`}
                style={{ background: DOT_COLORS[theme.name] }}
              />
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};
