// src/themes/default/Layout.jsx
// Layout del tema default — lista editorial acordeón + iPhone 15 blanco

import { useState } from "react";
import { Outlet } from "react-router-dom";
import { DefaultModal } from "../../components/modal/DefaultModal";
import { Navbar } from "../../components/Navbar/Navbar";
import { projects } from "../../utils/projects";
import "./default.css";

const IPhone15 = ({ url, image, title }) => (
  <div className="d-iphone">
    <div className="d-iphone-body">
      <div className="d-iphone-island" />
      <div className="d-iphone-screen">
        {url ? (
          <iframe
            src={url}
            title={title}
            className="d-iphone-iframe"
            allow="fullscreen"
          />
        ) : (
          <div className="d-iphone-static">
            {image ? <img src={image} alt={title} /> : <span>{title[0]}</span>}
          </div>
        )}
      </div>
      <div className="d-iphone-bar" />
    </div>
  </div>
);

const ProjectRow = ({ project, index, isExpanded, onToggle }) => {
  return (
    <div
      className={`d-row ${isExpanded ? "d-row--expanded" : ""} ${index === projects.length - 1 ? "d-row--last" : ""}`}
    >
      {/* ── Cabecera ── */}
      <div className="d-row-header" onClick={onToggle}>
        <span className="d-row-num">{String(index + 1).padStart(2, "0")}</span>
        <div className="d-row-header-content">
          <h2 className="d-row-title">{project.title}</h2>
          <ul className="d-row-tags">
            {project.tech?.slice(0, 5).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="d-row-toggle">
          <span className="d-row-toggle-icon">{isExpanded ? "−" : "+"}</span>
        </div>
      </div>

      {/* ── Panel expandido ── */}
      <div className="d-row-panel" onClick={onToggle}>
        <div className="d-row-panel-inner" onClick={(e) => e.stopPropagation()}>
          {/* Info izquierda — click cierra */}
          <div className="d-row-panel-info" onClick={onToggle}>
            <h3 className="d-panel-title">{project.title}</h3>
            <p className="d-panel-desc">{project.description}</p>

            {project.features && (
              <ul className="d-panel-features">
                {project.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            )}

            <ul className="d-panel-tags">
              {project.tech?.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>

            <div className="d-panel-links">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="d-panel-link d-panel-link--primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  Ver en vivo ↗
                </a>
              )}
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="d-panel-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  GitHub ↗
                </a>
              )}
            </div>
          </div>

          {/* iPhone 15 — click NO cierra */}
          <div className="d-row-panel-mockup">
            <IPhone15
              url={project.url}
              image={project.image}
              title={project.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Layout = ({ changeTheme, activeTheme }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="default-wrapper">
      <Navbar changeTheme={changeTheme} activeTheme={activeTheme} />

      <main>
        {/* ── Intro ── */}
        <section className="d-intro">
          <h1 className="d-intro-title">
            Fer<em>nan</em>do
            <br />
            Fdez Glez
          </h1>
          <div className="d-intro-right">
            <p className="d-intro-desc">
              <strong>6 proyectos</strong> construidos en 3 meses. React, Node,
              MongoDB, Next.js, Supabase. Algunos en producción con usuarios
              reales.
            </p>
            <div className="d-intro-count">
              <span>Proyectos</span>
              <strong>{projects.length}</strong>
            </div>
          </div>
        </section>

        {/* ── Lista acordeón ── */}
        <section className="d-list">
          {projects.map((project, index) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={index}
              isExpanded={expandedIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}

          {/* SaaS sorpresa */}
          <div className="d-row d-row--saas">
            <div className="d-row-header">
              <span className="d-row-num">07</span>
              <div className="d-row-header-content">
                <h2 className="d-row-title d-row-title--muted">
                  SaaS <em>sorpresa</em>
                </h2>
                <span className="d-row-soon">Próximamente</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="default-footer">
        <span>© 2026 fer.dev</span>
        <span>Full Stack Developer — León, ES</span>
      </footer>

      <DefaultModal />
      <Outlet />
    </div>
  );
};
