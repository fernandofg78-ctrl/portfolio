// src/themes/groovy/Layout.jsx
// Layout tema groovy 70s — paneles de control con modal Arcade

import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { projects } from "../../utils/projects";
import { Navbar } from "../../components/Navbar/Navbar";
import "./groovy.css";

const STATS = [
  { num: `${projects.length}`, label: "Apps en prod." },
  { num: "8+", label: "Años exp." },
  { num: "∞", label: "Cafés" },
];

const TICKER_ITEMS = [
  "React",
  "Express",
  "MongoDB",
  "Next.js",
  "Supabase",
  "Node.js",
  "Mapbox",
  "Cloudinary",
  "Hono",
  "i18n",
  "TypeScript",
  "Stripe",
  "Sentry",
  "React Native",
];

/* ─── Cursor personalizado ──────────────────────────────── */

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    const onEnter = (e) => {
      if (e.target.closest(".g-card, button, a")) setHovering(true);
    };
    const onLeave = (e) => {
      if (e.target.closest(".g-card, button, a")) setHovering(false);
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`g-cursor ${hovering ? "g-cursor--hover" : ""}`}
    />
  );
};

/* ─── Phone Mockup ──────────────────────────────────────── */

const PhoneMockup = ({ image, title }) => (
  <>
    <div className="g-card-deco g-card-deco--1" />
    <div className="g-card-deco g-card-deco--2" />
    <div className="g-phone">
      <div className="g-phone-notch" />
      <div className="g-phone-screen">
        {image ? (
          <img src={image} alt={title} className="g-phone-img" />
        ) : (
          <div className="g-phone-placeholder">
            {title.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  </>
);

/* ─── Modal de panel ────────────────────────────────────── */

const PanelModal = ({ project, onClose }) => (
  <div
    className="gm-overlay"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className="gm-modal">
      <div className="gm-modal-header">
        <div className="gm-modal-header-left">
          <span className="gm-modal-title">{project.title}</span>
          <span className="gm-modal-sep">✦</span>
          <span className="gm-modal-label">Panel de control</span>
        </div>
        <button className="gm-modal-close" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="gm-modal-body">
        {project.arcadeUrl ? (
          <iframe
            src={project.arcadeUrl}
            title={`Panel ${project.title}`}
            className="gm-modal-iframe"
            allow="fullscreen"
          />
        ) : (
          <div className="gm-modal-placeholder">
            <div className="gm-modal-placeholder-inner">
              <span className="gm-placeholder-icon">✦</span>
              <h3 className="gm-placeholder-title">Demo próximamente</h3>
              <p className="gm-placeholder-desc">
                Estamos preparando una demo interactiva del panel de{" "}
                <strong>{project.title}</strong>.<br />
                Vuelve pronto.
              </p>
              <div className="gm-placeholder-links">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="gm-placeholder-link"
                  >
                    Ver la app en vivo ↗
                  </a>
                )}
                {project.playStoreUrl && (
                  <a
                    href={project.playStoreUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="gm-placeholder-link gm-placeholder-link--playstore"
                  >
                    Google Play ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

/* ─── Grid de proyectos ─────────────────────────────────── */

const ProjectsGrid = ({ onOpenPanel }) => (
  <div className="g-grid">
    {projects.map((project, index) => (
      <div
        key={project.id}
        id={project.id}
        className="g-card"
        onClick={() => onOpenPanel(project)}
      >
        <div className="g-card-media">
          <PhoneMockup image={project.image} title={project.title} />
        </div>
        <div className="g-card-info">
          <div className="g-card-num">{String(index + 1).padStart(2, "0")}</div>
          <h3 className="g-card-title">{project.title}</h3>
          {index <= 1 && <p className="g-card-desc">{project.description}</p>}
          <ul className="g-card-tags">
            {project.tech?.slice(0, 3).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    ))}
  </div>
);

/* ─── Layout principal ──────────────────────────────────── */

export const Layout = () => {
  const [activeProject, setActiveProject] = useState(null);
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      setTimeout(() => {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [hash]);

  return (
    <div className="g-wrapper">
      <CustomCursor />
      <Navbar />

      <section className="g-hero">
        <div className="g-blob g-blob--1" />
        <div className="g-blob g-blob--2" />

        <p className="g-hero-label">Full Stack Developer — León, ES</p>

        <h1 className="g-hero-title">
          <span className="t-cream">FER</span>
          <span className="t-outline">NAN</span>
          <span className="t-lime">DO</span>
        </h1>

        <div className="g-hero-bottom">
          <p className="g-hero-desc">
            Construyo apps que <em>funcionan en producción</em>.<br />
            React, Node, MongoDB.
            <br />
            Freelance, disponible para nuevos proyectos.
          </p>
          <div className="g-stats">
            {STATS.map(({ num, label }) => (
              <div key={label} className="g-stat">
                <span className="g-stat-num">{num}</span>
                <span className="g-stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="g-ticker-wrap">
        <div className="g-ticker">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i}>
              {item}
              <span className="g-ticker-sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      <section className="g-projects">
        <div className="g-section-header">
          <span className="g-section-num">— 01</span>
          <h2 className="g-section-title">
            Paneles <span>de control</span>
          </h2>
        </div>
        <ProjectsGrid onOpenPanel={setActiveProject} />
      </section>

      <section className="g-contact">
        <div className="g-contact-blob" />
        <div className="g-contact-inner">
          <h2 className="g-contact-title">
            <span className="t-cream">¿HABLA</span>
            <span className="t-outline">MOS?</span>
          </h2>
          <div className="g-contact-right">
            <a href="mailto:fernandofg78@gmail.com" className="g-contact-link">
              fernandofg78@gmail.com
            </a>
            <a href="tel:+34699968038" className="g-contact-link">
              +34 699 968 038
            </a>
            <a
              href="https://wa.me/34699968038"
              target="_blank"
              rel="noreferrer"
              className="g-contact-link g-contact-link--whatsapp"
            >
              WhatsApp ↗
            </a>
            <p className="g-contact-avail">
              ✦ Disponible para proyectos freelance
            </p>
          </div>
        </div>
      </section>

      <footer className="g-footer">
        <p>© 2026 fer.dev — groovy theme</p>
      </footer>

      {activeProject && (
        <PanelModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </div>
  );
};
