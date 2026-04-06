// src/components/Navbar/Navbar.jsx
// Navbar compartido — renderiza el logo y el selector de temas

import { Link } from "react-router-dom";
import "./navbar.css";

const THEMES = [
  { id: "default", label: "Default" },
  { id: "brutalism", label: "Brutalism" },
  { id: "groovy", label: "Groovy" },
  { id: "archive", label: "Archive" },
];

export const Navbar = ({ changeTheme, activeTheme }) => {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo">
        fer.dev
      </Link>
      <nav className="navbar-nav">
        <div className="navbar-themes">
          {THEMES.map(({ id, label }) => (
            <button
              key={id}
              className={`navbar-dot navbar-dot--${id} ${activeTheme === id ? "navbar-dot--active" : ""}`}
              onClick={() => changeTheme(id)}
              title={label}
            />
          ))}
        </div>
      </nav>
    </header>
  );
};
