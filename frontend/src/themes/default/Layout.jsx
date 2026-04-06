// src/themes/default/Layout.jsx
// Layout del tema default — editorial, arquitectónico

import { Outlet } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import { DefaultModal } from "../../components/modal/DefaultModal";
import { Navbar } from "../../components/navbar/Navbar";
import { projects } from "../../utils/projects";
import "./default.css";

export const Layout = ({ changeTheme, activeTheme }) => {
  const { openModal } = useModal();

  return (
    <div className="default-wrapper">
      <Navbar changeTheme={changeTheme} activeTheme={activeTheme} />

      <main className="default-main">
        {/* ── Hero ── */}
        <section className="default-hero">
          <div className="default-hero-left">
            <h1 className="default-title">
              Full
              <br />
              <em>Stack</em>
              <br />
              Dev
            </h1>
          </div>
          <div className="default-hero-right">
            <p className="default-subtitle">
              React, Node, MongoDB.
              <br />
              Algunos proyectos
              <br />
              en producción.
            </p>
            <div className="default-hero-meta">
              <span>Proyectos</span>
              <strong>{projects.length}</strong>
            </div>
          </div>
        </section>

        {/* ── Label ── */}
        <div className="default-projects-header">
          <span className="default-projects-label">Trabajo seleccionado</span>
          <span className="default-projects-label">Fernando Fdez Glez</span>
        </div>

        {/* ── Grid ── */}
        <section className="default-projects">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="default-card"
              onClick={() => openModal(project)}
            >
              {/* Flecha hover */}
              <div className="default-card-arrow">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>

              {/* Imagen */}
              <div className="default-card-img">
                {project.image ? (
                  <img src={project.image} alt={project.title} />
                ) : (
                  <span>{project.title[0]}</span>
                )}
              </div>

              {/* Info */}
              <div className="default-card-info">
                <div className="default-card-top">
                  <h3>{project.title}</h3>
                  <span className="default-card-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p>{project.description}</p>
                <ul className="default-tags">
                  {project.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>
      </main>

      <footer className="default-footer">
        <span>© 2026 fer.dev</span>
        <span>Full Stack Developer</span>
      </footer>

      <DefaultModal />
      <Outlet />
    </div>
  );
};
