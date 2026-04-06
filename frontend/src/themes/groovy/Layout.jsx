// src/themes/groovy/Layout.jsx
// Layout tema groovy 70s — naranja quemado, verde lima, hover explosivo, cursor custom

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import { DefaultModal } from "../../components/modal/DefaultModal";
import { projects } from "../../utils/projects";
import "./groovy.css";

const STATS = [
  { num: "5", label: "Apps en prod." },
  { num: "3", label: "Meses" },
  { num: "8", label: "Años exp." },
];

const TICKER_ITEMS = [
  "React",
  "Express",
  "MongoDB",
  "Next.js",
  "Supabase",
  "Node.js",
  "Mapbox",
  "JWT",
  "Cloudinary",
  "Hono",
  "i18n",
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

/* ─── Grid de proyectos ─────────────────────────────────── */

const ProjectsGrid = () => {
  const { openModal } = useModal();

  return (
    <div className="g-grid">
      {projects.map((project, index) => (
        <div
          key={project.id}
          className="g-card"
          onClick={() => openModal(project)}
        >
          <div className="g-card-media">
            <PhoneMockup image={project.image} title={project.title} />
          </div>
          <div className="g-card-info">
            <div className="g-card-num">
              {String(index + 1).padStart(2, "0")}
            </div>
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
};

/* ─── Layout principal ──────────────────────────────────── */

export const Layout = ({ changeTheme, activeTheme }) => {
  return (
    <div className="g-wrapper">
      <CustomCursor />

      <header className="g-header">
        <Link to="/" className="g-logo">
          fer.dev
          <span className="g-logo-dot" />
        </Link>
        <nav className="g-nav">
          <ul className="g-nav-links">
            <li>
              <Link to="/">Proyectos</Link>
            </li>
            <li>
              <a href="#contact">Contacto</a>
            </li>
          </ul>
          <div className="g-theme-switcher">
            <button
              className={`g-dot ${activeTheme === "default" ? "g-dot--active" : ""}`}
              onClick={() => changeTheme("default")}
              title="Default"
            />
            <button
              className={`g-dot ${activeTheme === "brutalism" ? "g-dot--active" : ""}`}
              onClick={() => changeTheme("brutalism")}
              title="Brutalism"
            />
            <button
              className={`g-dot ${activeTheme === "groovy" ? "g-dot--active" : ""}`}
              onClick={() => changeTheme("groovy")}
              title="Groovy"
            />
          </div>
        </nav>
      </header>

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
            Algunos proyectos con usuarios reales.
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
            Proyectos <span>seleccionados</span>
          </h2>
        </div>
        <ProjectsGrid />
      </section>

      <section id="contact" className="g-contact">
        <div className="g-contact-blob" />
        <div className="g-contact-inner">
          <h2 className="g-contact-title">
            <span className="t-cream">¿HABLA</span>
            <span className="t-outline">MOS?</span>
          </h2>
          <div className="g-contact-right">
            <a href="mailto:tu@email.com" className="g-contact-link">
              tu@email.com
            </a>
            <p className="g-contact-avail">✦ Disponible ahora</p>
          </div>
        </div>
      </section>

      <footer className="g-footer">
        <p>© 2026 fer.dev — groovy theme</p>
      </footer>

      <DefaultModal />
    </div>
  );
};
