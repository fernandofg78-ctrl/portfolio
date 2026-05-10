// src/components/Navbar/Navbar.jsx
// Navbar compartido — navegación entre secciones

import { NavLink } from "react-router-dom";
import "./navbar.css";

const NAV_ITEMS = [
  { to: "/", label: "Home", dot: "#0a0a0a" },
  { to: "/features", label: "Características", dot: "#ff3300" },
  { to: "/panels", label: "Paneles", dot: "#c8e64c" },
  { to: "/about", label: "Sobre mí", dot: "#8b7355" },
];

export const Navbar = () => {
  return (
    <header className="navbar">
      <NavLink to="/" className="navbar-logo">
        fer.dev
      </NavLink>
      <nav className="navbar-themes">
        {NAV_ITEMS.map(({ to, label, dot }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `navbar-theme-btn ${isActive ? "is-active" : ""}`
            }
          >
            <span className="navbar-theme-dot" style={{ background: dot }} />
            <span className="navbar-theme-name">{label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  );
};
