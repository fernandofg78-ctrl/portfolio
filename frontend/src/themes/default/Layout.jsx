// src/themes/default/Layout.jsx
// Layout del tema por defecto — minimal, tipografía limpia

import { Outlet } from "react-router-dom";
import { projects } from "../../utils/projects";
import "./default.css";

export const Layout = ({ changeTheme, activeTheme }) => {
  return (
    <div className="default-wrapper">
      <header className="default-header">
        <span className="default-logo">fer.dev</span>
        <nav className="default-nav">
          <button
            className={`theme-btn ${activeTheme === "default" ? "active" : ""}`}
            onClick={() => changeTheme("default")}
            title="Default"
          />
          <button
            className={`theme-btn brutal ${activeTheme === "brutalism" ? "active" : ""}`}
            onClick={() => changeTheme("brutalism")}
            title="Brutalism"
          />
        </nav>
      </header>

      <main className="default-main">
        <section className="default-hero">
          <h1 className="default-title">
            Desarrollo web
            <br />
            full stack
          </h1>
          <p className="default-subtitle">
            6 proyectos. React, Node, MongoDB.
            <br />
            Algunos en producción con usuarios reales.
          </p>
        </section>

        <section className="default-projects">
          {projects.map((project) => (
            <a
              key={project.id}
              href={`/project/${project.id}`}
              className="default-card"
            >
              <div className="default-card-img">
                {project.image ? (
                  <img src={project.image} alt={project.title} />
                ) : (
                  <span>{project.title[0]}</span>
                )}
              </div>
              <div className="default-card-body">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <ul className="default-tags">
                  {project.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </a>
          ))}
        </section>
      </main>

      <footer className="default-footer">
        <p>© 2026 fer.dev</p>
      </footer>

      <Outlet />
    </div>
  );
};
