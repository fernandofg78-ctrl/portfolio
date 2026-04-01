// src/components/layout/Navbar.jsx
// Barra de navegación principal con selector de temas

import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { themes } from "../../themes/themes";
import styles from "./Navbar.module.css";

export const Navbar = () => {
  const { currentTheme, changeTheme } = useTheme();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        fer.dev
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
              className={`${styles.themeDot} ${currentTheme.name === theme.name ? styles.active : ""}`}
              onClick={() => changeTheme(theme.name)}
              title={theme.label}
              aria-label={`Tema ${theme.label}`}
              style={{
                background: theme.colors.background,
                borderColor:
                  currentTheme.name === theme.name
                    ? theme.name === "dark"
                      ? "#C9A84C"
                      : "#1a1a1a"
                    : theme.colors.border,
              }}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};
