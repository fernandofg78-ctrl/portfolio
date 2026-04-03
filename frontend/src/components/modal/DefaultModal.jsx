// src/components/modal/DefaultModal.jsx
// Modal de proyecto — mockup protagonista desktop/tablet, iframe directo en móvil

import { useState } from "react";
import { useModal } from "../../context/ModalContext";
import { PhoneMockup } from "./PhoneMockup";
import { InfoModal } from "./InfoModal";
import "./DefaultModal.css";

const getDevice = () => {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
};

export const DefaultModal = () => {
  const { activeProject, closeModal } = useModal();
  const [infoMode, setInfoMode] = useState(null);

  if (!activeProject) return null;

  const { title, url } = activeProject;
  const device = getDevice();

  return (
    <>
      <div className="dm-overlay" onClick={closeModal}>
        <div
          className={`dm-panel dm-panel--${device}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="dm-close" onClick={closeModal}>
            ✕
          </button>

          {/* ── Mockup / iframe según dispositivo ── */}
          <div className="dm-mockup">
            {url ? (
              device === "mobile" ? (
                <iframe
                  src={url}
                  title={title}
                  className="dm-iframe-direct"
                  allow="fullscreen"
                />
              ) : (
                <PhoneMockup url={url} title={title} />
              )
            ) : (
              <div className="dm-no-demo">Sin demo disponible</div>
            )}
          </div>

          {/* ── Footer ── */}
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
