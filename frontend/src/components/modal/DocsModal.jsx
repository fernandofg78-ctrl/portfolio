// src/components/modal/DocsModal.jsx
// Visor de documentación técnica en Markdown, estética tipo editor de código

import ReactMarkdown from "react-markdown";
import "./DocsModal.css";

export const DocsModal = ({ content, filename, onClose }) => {
  if (!content) return null;

  const lineCount = content.split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="dc-overlay" onClick={onClose}>
      <div className="dc-panel" onClick={(e) => e.stopPropagation()}>
        <div className="dc-tab">
          <div className="dc-tab-label">
            <span className="dc-tab-icon">MD</span>
            <span className="dc-tab-filename">{filename}</span>
          </div>
          <button className="dc-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="dc-body">
          <div className="dc-gutter" aria-hidden="true">
            {lineNumbers.map((n) => (
              <span key={n} className="dc-gutter-line">
                {n}
              </span>
            ))}
          </div>
          <div className="dc-content">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};
