// src/components/modal/DefaultModal.jsx
// Modal de proyecto para el tema default

import { useModal } from "../../context/ModalContext";
import { PhoneMockup } from "./PhoneMockup";
import "./DefaultModal.css";

export const DefaultModal = () => {
  const { activeProject, closeModal } = useModal();

  if (!activeProject) return null;

  const { title, description, tech, url, repo } = activeProject;

  return (
    <div className="dm-overlay" onClick={closeModal}>
      <div className="dm-panel" onClick={(e) => e.stopPropagation()}>
        <button className="dm-close" onClick={closeModal}>
          ✕
        </button>

        <div className="dm-left">
          {url ? (
            <PhoneMockup url={url} title={title} />
          ) : (
            <div className="dm-no-demo">Sin demo disponible</div>
          )}
        </div>

        <div className="dm-right">
          <p className="dm-num">Proyecto</p>
          <h2 className="dm-title">{title}</h2>
          <p className="dm-desc">{description}</p>
          <ul className="dm-tags">
            {tech?.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <div className="dm-links">
            {repo && (
              <a href={repo} target="_blank" rel="noreferrer">
                GitHub →
              </a>
            )}
            {url && (
              <a href={url} target="_blank" rel="noreferrer">
                Ver proyecto →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
