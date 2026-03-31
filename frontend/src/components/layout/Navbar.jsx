// src/components/layout/Navbar.jsx
// Barra de navegación principal

import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

export const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        fer.dev
      </Link>
      <ul className={styles.links}>
        <li>
          <Link to="/">Proyectos</Link>
        </li>
        <li>
          <a href="#contact">Contacto</a>
        </li>
      </ul>
    </nav>
  );
};
