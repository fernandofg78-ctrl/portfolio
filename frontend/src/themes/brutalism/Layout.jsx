// src/themes/brutalism/Layout.jsx
// Layout del tema brutalism — tipografía pesada, grid irregular, mockups de móvil

import { Outlet, Link } from "react-router-dom";
//import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import { DefaultModal } from "../../components/modal/DefaultModal";
import { projects } from "../../utils/projects";
import "./brutalism.css";

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

const PhoneMockup = ({ image, title }) => (
  <div className="b-phone-wrap">
    <div className="b-phone">
      <div className="b-phone-notch" />
      <div className="b-phone-screen">
        {image ? (
          <img src={image} alt={title} className="b-phone-img" />
        ) : (
          <div className="b-phone-placeholder">
            {title.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  </div>
);

const ProjectsGrid = () => {
  const { openModal } = useModal();

  return (
    <div className="b-grid">
      {projects.map((project, index) => (
        <div
          key={project.id}
          className={`b-card ${index === 0 ? "b-card--featured" : ""}`}
          onClick={() => openModal(project)}
        >
          <PhoneMockup image={project.image} title={project.title} />
          <div className="b-card-info">
            <div className="b-card-num">
              {String(index + 1).padStart(2, "0")}
              {index === 0 && <span className="b-card-star"> — ESTRELLA</span>}
            </div>
            <h3 className="b-card-title">{project.title}</h3>
            {index <= 1 && <p className="b-card-desc">{project.description}</p>}
            <ul className="b-card-tags">
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

export const Layout = ({ changeTheme, activeTheme }) => {
  return (
    <div className="b-wrapper">
      <header className="b-header">
        <Link to="/" className="b-logo">
          FER.DEV
        </Link>
        <nav className="b-nav">
          <ul className="b-nav-links">
            <li>
              <Link to="/">Proyectos</Link>
            </li>
            <li>
              <a href="#contact">Contacto</a>
            </li>
          </ul>
          <div className="b-theme-switcher">
            <button
              className={`b-dot ${activeTheme === "default" ? "b-dot--active" : ""}`}
              onClick={() => changeTheme("default")}
              title="Default"
            />
            <button
              className={`b-dot b-dot--brutal ${activeTheme === "brutalism" ? "b-dot--active" : ""}`}
              onClick={() => changeTheme("brutalism")}
              title="Brutalism"
            />
          </div>
        </nav>
      </header>

      <section className="b-hero">
        <div className="b-hero-top">
          <p className="b-role">Full Stack Developer — Logroño, ES</p>
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
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i}>
                {item}
                <span className="b-ticker-sep">×</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="b-projects">
        <div className="b-section-header">
          <h2 className="b-section-title">Proyectos seleccionados</h2>
          <div className="b-section-line" />
          <span className="b-section-count">0{projects.length}</span>
        </div>
        <ProjectsGrid />
      </section>

      <section id="contact" className="b-contact">
        <div className="b-contact-inner">
          <h2 className="b-contact-title">
            ¿HABLA
            <br />
            <span className="b-contact-outline">MOS?</span>
          </h2>
          <div className="b-contact-right">
            <a href="mailto:tu@email.com" className="b-contact-link">
              tu@email.com
            </a>
            <p className="b-contact-avail">Disponible ahora</p>
          </div>
        </div>
      </section>

      <footer className="b-footer">
        <p>© 2026 fer.dev</p>
      </footer>

      <DefaultModal />
      <Outlet />
    </div>
  );
};
