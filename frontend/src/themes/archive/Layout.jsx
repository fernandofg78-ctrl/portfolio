// src/themes/archive/Layout.jsx
// Layout tema archive — blanco puro, orden simétrico, tipografía editorial

import { useModal } from "../../context/ModalContext";
import { DefaultModal } from "../../components/modal/DefaultModal";
import { Navbar } from "../../components/Navbar/Navbar";
import { projects } from "../../utils/projects";

import santiagoImg from "../../assets/images/san-tiago.jpg";
import tapaImg from "../../assets/images/tortill.webp";
import mazarifeImg from "../../assets/images/villar-3.webp";
import rfgImg from "../../assets/images/rfg-3.webp";
import hangmanImg from "../../assets/images/hangman.webp";
import ferImg from "../../assets/images/fer.webp";
import "./archive.css";

const THEME_IMAGES = {
  camino: santiagoImg,
  nextapa: tapaImg,
  mazarife: mazarifeImg,
  rfg: rfgImg,
  ahorcado: hangmanImg,
  portfolio: ferImg,
};

const STATS = [
  { num: "5", label: "Apps en prod." },
  { num: "3", label: "Meses" },
  { num: "8", label: "Años exp." },
];

const ProjectsGrid = () => {
  const { openModal } = useModal();

  return (
    <div className="a-grid">
      {projects.map((project, index) => (
        <div
          key={project.id}
          className="a-card"
          onClick={() => openModal(project)}
        >
          <div className="a-card-img">
            {THEME_IMAGES[project.id] ? (
              <img src={THEME_IMAGES[project.id]} alt={project.title} />
            ) : (
              <div className="a-card-placeholder">{project.title[0]}</div>
            )}
          </div>
          <div className="a-card-body">
            <span className="a-card-num">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="a-card-title">{project.title}</h3>
            <p className="a-card-desc">{project.description}</p>
            <ul className="a-card-tags">
              {project.tech?.slice(0, 4).map((t) => (
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
    <div className="a-wrapper">
      <Navbar changeTheme={changeTheme} activeTheme={activeTheme} />

      <section className="a-hero">
        <p className="a-hero-label">Full Stack Developer — León, ES</p>
        <div className="a-hero-divider" />
        <h1 className="a-hero-title">
          Fernando <em>Fdez</em> Glez
        </h1>
        <p className="a-hero-sub">
          React · Node · MongoDB
          <br />
          Aplicaciones web en producción
        </p>
        <div className="a-hero-divider" />
        <div className="a-stats">
          {STATS.map(({ num, label }) => (
            <div key={label} className="a-stat">
              <span className="a-stat-num">{num}</span>
              <span className="a-stat-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="a-projects">
        <div className="a-section-header">
          <span className="a-section-title">Proyectos seleccionados</span>
          <span className="a-section-count">0{projects.length}</span>
        </div>
        <ProjectsGrid />
      </section>

      <section className="a-contact">
        <p className="a-contact-label">Contacto</p>
        <h2 className="a-contact-title">
          ¿Hablamos<em>?</em>
        </h2>
        <a href="mailto:tu@email.com" className="a-contact-link">
          tu@email.com
        </a>
        <p className="a-contact-avail">Disponible ahora</p>
      </section>

      <footer className="a-footer">
        <span>© 2026 fer.dev</span>
        <span>León, ES</span>
      </footer>

      <DefaultModal />
    </div>
  );
};
