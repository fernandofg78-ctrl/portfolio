// src/components/modal/DefaultModal.jsx
// Modal de proyecto — mockup protagonista + botones for user / for dev

import { useState } from "react";
import { useModal } from "../../context/ModalContext";
import { PhoneMockup } from "./PhoneMockup";
import { InfoModal } from "./InfoModal";
import "./DefaultModal.css";

export const DefaultModal = () => {
  const { activeProject, closeModal } = useModal();
  const [infoMode, setInfoMode] = useState(null); // 'user' | 'dev' | null

  if (!activeProject) return null;

  const { title, url } = activeProject;

  return (
    <>
      <div className="dm-overlay" onClick={closeModal}>
        <div className="dm-panel" onClick={(e) => e.stopPropagation()}>
          <button className="dm-close" onClick={closeModal}>
            ✕
          </button>

          {/* ── Mockup protagonista ── */}
          <div className="dm-mockup">
            {url ? (
              <PhoneMockup url={url} title={title} />
            ) : (
              <div className="dm-no-demo">Sin demo disponible</div>
            )}
          </div>

          {/* ── Info mínima ── */}
          <div className="dm-footer">
            <span className="dm-footer-title">{title}</span>
            <div className="dm-footer-actions">
              <button className="dm-btn" onClick={() => setInfoMode("user")}>
                for user
              </button>
              <button
                className="dm-btn dm-btn--dev"
                onClick={() => setInfoMode("dev")}
              >
                for dev
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Segundo modal ── */}
      {infoMode && (
        <InfoModal
          project={activeProject}
          mode={infoMode}
          onClose={() => setInfoMode(null)}
        />
      )}
    </>
  );
};
