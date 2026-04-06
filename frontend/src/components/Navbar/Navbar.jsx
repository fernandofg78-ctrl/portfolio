// src/components/Navbar/Navbar.jsx
// Navbar compartido — logo y selector de temas con etiquetas visibles

import { Link } from "react-router-dom";
import "./navbar.css";

const THEMES = [
  { id: "default", label: "Default" },
  { id: "brutalism", label: "Brutal" },
  { id: "groovy", label: "Groovy" },
  { id: "archive", label: "Archive" },
];

export const Navbar = ({ changeTheme, activeTheme }) => {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo">
        fer.dev
      </Link>
      <nav className="navbar-themes">
        <span className="navbar-themes-label">theme</span>
        {THEMES.map(({ id, label }) => (
          <button
            key={id}
            className={`navbar-theme-btn ${activeTheme === id ? "is-active" : ""}`}
            onClick={() => changeTheme(id)}
            data-theme={id}
          >
            <span className="navbar-theme-dot" />
            <span className="navbar-theme-name">{label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
};
