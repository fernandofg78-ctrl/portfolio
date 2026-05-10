// src/themes/default/Layout.jsx
// Layout del tema default — lista editorial acordeón + Easter egg huevo 🥚

import { useState, useRef } from "react";
import { Outlet, Link } from "react-router-dom";
import { DefaultModal } from "../../components/modal/DefaultModal";
import { Navbar } from "../../components/Navbar/Navbar";
import { projects } from "../../utils/projects";
import { PhoneMockup } from "../../components/modal/PhoneMockup";
import "./default.css";

// ── Easter Egg: Modal Hangman ────────────────────────────────
const EggModal = ({ onClose }) => (
  <div
    className="egg-overlay"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className="egg-modal">
      <div className="egg-modal-header">
        <div className="egg-modal-header-left">
          <span className="egg-modal-emoji">🥚</span>
          <span className="egg-modal-title">
            ¿Te apetece un juego?, ¡adivina la palabra oculta en Inglés y
            Español!
          </span>
        </div>
        <button className="egg-modal-close" onClick={onClose}>
          ×
        </button>
      </div>
      <iframe
        className="egg-modal-iframe"
        src="https://hangman-alpha-fawn.vercel.app"
        title="Ahorcado Bilingüe"
        allow="fullscreen"
        scrolling="yes"
      />
    </div>
  </div>
);

// ── Easter Egg: Huevo flotante ───────────────────────────────
const FloatingEgg = ({ onCrack, cracking, broken }) => (
  <div
    className={`egg-float ${cracking ? "egg-float--cracking" : ""} ${broken ? "egg-float--broken" : ""}`}
    onClick={onCrack}
    title="..."
  >
    <svg
      width="56"
      height="68"
      viewBox="0 0 56 68"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="egg-top">
        <path
          d="M28 0 C14 0 2 14 2 32 C2 40 5 47 10 52 L46 52 C51 47 54 40 54 32 C54 14 42 0 28 0Z"
          fill="#FFF8E7"
          stroke="#E8D5A3"
          strokeWidth="1.5"
        />
      </g>
      <g className="egg-bottom">
        <path
          d="M10 52 L46 52 C44 60 38 66 28 68 C18 68 12 60 10 52Z"
          fill="#FFF0C0"
          stroke="#E8D5A3"
          strokeWidth="1.5"
        />
      </g>
      <path
        className="egg-crack"
        d="M14 52 L18 44 L22 48 L26 40 L30 45 L34 38 L38 43 L42 52"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="1.2"
      />
      <ellipse
        cx="20"
        cy="18"
        rx="4"
        ry="6"
        fill="white"
        opacity="0.4"
        transform="rotate(-15 20 18)"
      />
    </svg>
  </div>
);

// ── Fila de proyecto ─────────────────────────────────────────
const ProjectRow = ({ project, index, isExpanded, onToggle }) => (
  <div
    className={`d-row ${isExpanded ? "d-row--expanded" : ""} ${index === projects.length - 1 ? "d-row--last" : ""}`}
  >
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

    <div className="d-row-panel" onClick={onToggle}>
      <div className="d-row-panel-inner" onClick={(e) => e.stopPropagation()}>
        <div className="d-row-panel-info" onClick={onToggle}>
          <h3 className="d-panel-title">{project.title}</h3>
          <p className="d-panel-desc">{project.description}</p>
          {project.features && (
            <ul className="d-panel-features">
              {project.features.map((f, i) => (
                <li key={i}>{f.title}</li>
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
            {project.id !== "portfolio" && (
              <>
                <Link
                  to={`/features#${project.id}`}
                  className="d-panel-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  Features →
                </Link>
                <Link
                  to={`/panels#${project.id}`}
                  className="d-panel-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  Control Panels →
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="d-row-panel-mockup">
          <PhoneMockup url={project.url} title={project.title} />
        </div>
      </div>
    </div>
  </div>
);

// ── Layout principal ─────────────────────────────────────────
export const Layout = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [openedIds, setOpenedIds] = useState(new Set());
  const [eggVisible, setEggVisible] = useState(false);
  const [eggCracking, setEggCracking] = useState(false);
  const [eggBroken, setEggBroken] = useState(false);
  const [hangmanOpen, setHangmanOpen] = useState(false);
  const eggTriggered = useRef(false);

  const handleToggle = (index) => {
    const project = projects[index];
    const isOpening = expandedIndex !== index;

    setExpandedIndex((prev) => (prev === index ? null : index));

    if (isOpening && !eggTriggered.current) {
      setOpenedIds((prev) => {
        const next = new Set(prev);
        next.add(project.id);
        if (next.size >= 3) {
          setTimeout(() => setEggVisible(true), 400);
          eggTriggered.current = true;
        }
        return next;
      });
    }
  };

  const handleCrack = () => {
    if (eggBroken) return;
    setEggCracking(true);
    setTimeout(() => {
      setEggCracking(false);
      setEggBroken(true);
    }, 400);
    setTimeout(() => {
      setHangmanOpen(true);
    }, 750);
  };

  const handleCloseHangman = () => {
    setHangmanOpen(false);
    setTimeout(() => {
      setEggBroken(false);
      setEggVisible(false);
      eggTriggered.current = false;
      setOpenedIds(new Set());
    }, 300);
  };

  return (
    <div className="default-wrapper">
      <Navbar />

      <main>
        <section className="d-intro">
          <h1 className="d-intro-title">
            Fer<em>nan</em>do
            <br />
            Fdez Glez
          </h1>
          <div className="d-intro-right">
            <p className="d-intro-desc">
              <strong>Proyectos</strong> construidos por hobbie, por aprender,
              por experimentar. Sin clientes, sin presión, sin fechas de
              entrega. Solo código, creatividad e ilusión.
            </p>
          </div>
        </section>

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
        </section>
      </main>

      <footer className="default-footer">
        <span>© 2026 fer.dev</span>
        <span>Full Stack Developer — León, ES</span>
      </footer>

      {eggVisible && (
        <FloatingEgg
          onCrack={handleCrack}
          cracking={eggCracking}
          broken={eggBroken}
        />
      )}
      {hangmanOpen && <EggModal onClose={handleCloseHangman} />}

      <DefaultModal />
      <Outlet />
    </div>
  );
};
