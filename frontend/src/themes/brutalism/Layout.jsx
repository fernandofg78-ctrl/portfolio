// src/themes/brutalism/Layout.jsx
// Layout del tema brutalism — clips de features por proyecto + modal + ticker con iconos

import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { projects } from "../../utils/projects";
import "./brutalism.css";

// ── Ticker items con clases Devicon ──────────────────────────
const TICKER_ICONS = [
  { name: "JavaScript", cls: "devicon-javascript-plain" },
  { name: "TypeScript", cls: "devicon-typescript-plain" },
  { name: "React", cls: "devicon-react-original" },
  { name: "Next.js", cls: "devicon-nextjs-plain" },
  { name: "Node.js", cls: "devicon-nodejs-plain" },
  { name: "Express", cls: "devicon-express-original" },
  { name: "Hono", cls: "devicon-hono-plain" },
  { name: "MongoDB", cls: "devicon-mongodb-plain" },
  { name: "PostgreSQL", cls: "devicon-postgresql-plain" },
  { name: "Supabase", cls: "devicon-supabase-plain" },
  { name: "HTML5", cls: "devicon-html5-plain" },
  { name: "CSS3", cls: "devicon-css3-plain" },
  { name: "Git", cls: "devicon-git-plain" },
  { name: "GitHub", cls: "devicon-github-original" },
  { name: "Vite", cls: "devicon-vitejs-plain" },
  { name: "Vercel", cls: "devicon-vercel-original" },
  { name: "Cloudinary", cls: "devicon-cloudinary-plain" },
  { name: "Figma", cls: "devicon-figma-plain" },
  { name: "VSCode", cls: "devicon-vscode-plain" },
  { name: "Yarn", cls: "devicon-yarn-plain" },
  { name: "npm", cls: "devicon-npm-original-wordmark" },
  { name: "React Native", cls: "devicon-react-original" },
  { name: "Stripe", cls: "devicon-stripe-plain" },
  { name: "Sentry", cls: "devicon-sentry-plain" },
  { name: "Mapbox", cls: "devicon-mapbox-plain" },
];

const STATS = [
  {
    num: `${projects.filter((p) => p.id !== "portfolio").length}`,
    label: "Apps en prod.",
  },
  { num: "8+", label: "Años exp." },
  { num: "∞", label: "Cafés" },
];

// ── Modal de feature ─────────────────────────────────────────
const FeatureModal = ({ feature, projectTitle, onClose }) => (
  <div
    className="bm-overlay"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className="bm-modal">
      <div className="bm-modal-header">
        <div className="bm-modal-header-left">
          <span className="bm-modal-project">{projectTitle}</span>
          <span className="bm-modal-sep">—</span>
          <span className="bm-modal-feature">{feature.title}</span>
        </div>
        <button className="bm-modal-close" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="bm-modal-body">
        <div className="bm-modal-image">
          {feature.image ? (
            <img src={feature.image} alt={feature.title} />
          ) : (
            <div className="bm-modal-placeholder">
              <span className="bm-modal-placeholder-num">
                {feature.title.slice(0, 2).toUpperCase()}
              </span>
              <span className="bm-modal-placeholder-text">
                imagen próximamente
              </span>
            </div>
          )}
        </div>
        <div className="bm-modal-info">
          <h3 className="bm-modal-title">{feature.title}</h3>
          <p className="bm-modal-desc">{feature.description}</p>
        </div>
      </div>
    </div>
  </div>
);

// ── Card de proyecto con clips ───────────────────────────────
const ProjectCard = ({ project, index, onFeatureClick }) => {
  const accentColors = [
    "#ff3300",
    "#0000ff",
    "#00aa00",
    "#aa00aa",
    "#ff8800",
    "#0088aa",
  ];
  const accent = accentColors[index % accentColors.length];

  return (
    <div id={project.id} className="bc-card" style={{ "--accent": accent }}>
      {/* Mockup teléfono */}
      <div className="bc-phone-wrap">
        <div className="bc-phone">
          <div className="bc-phone-notch" />
          <div className="bc-phone-screen">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="bc-phone-img"
              />
            ) : (
              <div className="bc-phone-placeholder">
                {project.title.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bc-card-header">
        <span className="bc-card-num">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="bc-card-title">{project.title}</h3>
        <span className="bc-card-count">
          {project.features?.length || 0} features
        </span>
      </div>

      <p className="bc-card-desc">{project.description}</p>

      <div className="bc-clips">
        {project.features?.map((feature, fi) => (
          <button
            key={feature.id}
            className={`bc-clip ${fi % 2 === 0 ? "bc-clip--filled" : "bc-clip--outline"}`}
            onClick={() => onFeatureClick(feature, project.title)}
          >
            {feature.title}
          </button>
        ))}
      </div>

      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="bc-card-link"
          onClick={(e) => e.stopPropagation()}
        >
          Ver en vivo ↗
        </a>
      )}
    </div>
  );
};

// ── Layout principal ─────────────────────────────────────────
export const Layout = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [activeProjectTitle, setActiveProjectTitle] = useState("");
  const { hash } = useLocation();

  // Scroll al ancla cuando se navega desde la landing
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

  const handleFeatureClick = (feature, projectTitle) => {
    setActiveFeature(feature);
    setActiveProjectTitle(projectTitle);
  };

  const handleCloseModal = () => {
    setActiveFeature(null);
    setActiveProjectTitle("");
  };

  return (
    <div className="b-wrapper">
      <Navbar />

      {/* ── Hero ── */}
      <section className="b-hero">
        <div className="b-hero-top">
          <p className="b-role">Full Stack Developer — León, ES</p>
          <h1 className="b-name">
            FER
            <br />
            <span className="b-name-outline">NANDO</span>
            <br />
            FDEZ
          </h1>
        </div>
        <div className="b-hero-bottom">
          <p className="b-tagline">
            <span className="b-mono">
              // construyo apps
              <br />
              que funcionan en producción
            </span>
          </p>
          <div className="b-stats">
            {STATS.map(({ num, label }) => (
              <div key={label} className="b-stat">
                <span className="b-stat-num">{num}</span>
                <span className="b-stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="b-ticker-wrap">
          <div className="b-ticker">
            {[...TICKER_ICONS, ...TICKER_ICONS].map((icon, i) => (
              <span key={i} className="b-ticker-item" title={icon.name}>
                <i className={icon.cls} />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Proyectos ── */}
      <section className="b-projects">
        <div className="b-section-header">
          <h2 className="b-section-title">Proyectos seleccionados</h2>
          <div className="b-section-line" />
          <span className="b-section-count">0{projects.length}</span>
        </div>

        <div className="bc-grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onFeatureClick={handleFeatureClick}
            />
          ))}
        </div>
      </section>

      {/* ── Contacto ── */}
      <section className="b-contact">
        <div className="b-contact-inner">
          <h2 className="b-contact-title">
            ¿HABLA
            <br />
            <span className="b-contact-outline">MOS?</span>
          </h2>
          <div className="b-contact-right">
            <a href="mailto:fernandofg78@gmail.com" className="b-contact-link">
              fernandofg78@gmail.com
            </a>
            <a href="tel:+34699968038" className="b-contact-link">
              +34 699 968 038
            </a>
            <a
              href="https://wa.me/34699968038"
              target="_blank"
              rel="noreferrer"
              className="b-contact-link b-contact-link--whatsapp"
            >
              WhatsApp ↗
            </a>
            <p className="b-contact-avail">Disponible ahora</p>
          </div>
        </div>
      </section>

      <footer className="b-footer">
        <p>© 2026 fer.dev</p>
      </footer>

      {activeFeature && (
        <FeatureModal
          feature={activeFeature}
          projectTitle={activeProjectTitle}
          onClose={handleCloseModal}
        />
      )}

      <Outlet />
    </div>
  );
};
