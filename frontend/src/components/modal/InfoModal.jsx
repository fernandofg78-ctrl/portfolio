// src/components/modal/InfoModal.jsx
// Segundo modal — contenido editorial para user o dev

import { useState } from "react";
import { DocsModal } from "./DocsModal";
import "./InfoModal.css";

export const InfoModal = ({ project, mode, onClose }) => {
  const { title, description, tech, url, repo, docsContent, docsFilename } =
    project;
  const [showDocs, setShowDocs] = useState(false);

  const isUser = mode === "user";

  return (
    <>
      <div className="im-overlay" onClick={onClose}>
        <div className="im-panel" onClick={(e) => e.stopPropagation()}>
          <div className="im-header">
            <span className="im-mode">{isUser ? "for user" : "for dev"}</span>
            <button className="im-close" onClick={onClose}>
              ✕
            </button>
          </div>

          {isUser ? (
            /* ── Vista user ── */
            <div className="im-body">
              <h2 className="im-title">{title}</h2>
              <p className="im-desc">{description}</p>
              <div className="im-links">
                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="im-link im-link--primary"
                  >
                    Ver proyecto →
                  </a>
                )}
                {repo && (
                  <a
                    href={repo}
                    target="_blank"
                    rel="noreferrer"
                    className="im-link"
                  >
                    GitHub →
                  </a>
                )}
              </div>
            </div>
          ) : (
            /* ── Vista dev ── */
            <div className="im-body">
              <h2 className="im-title">{title}</h2>
              <div className="im-section">
                <p className="im-label">Stack técnico</p>
                <ul className="im-tags">
                  {tech?.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="im-section">
                <p className="im-label">Repositorio</p>
                <div className="im-links">
                  {repo && (
                    <a
                      href={repo}
                      target="_blank"
                      rel="noreferrer"
                      className="im-link"
                    >
                      GitHub →
                    </a>
                  )}
                </div>
              </div>

              {docsContent && (
                <div className="im-section">
                  <p className="im-label">Documentación técnica</p>
                  <button
                    className="im-link im-link--docs"
                    onClick={() => setShowDocs(true)}
                  >
                    Ver documentación completa →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showDocs && (
        <DocsModal
          content={docsContent}
          filename={docsFilename}
          onClose={() => setShowDocs(false)}
        />
      )}
    </>
  );
};
