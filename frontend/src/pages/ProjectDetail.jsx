// src/pages/ProjectDetail.jsx
// Página de detalle de un proyecto

import { useParams, Link } from "react-router-dom";
import { projects } from "../utils/projects";
import styles from "./ProjectDetail.module.css";

export const ProjectDetail = () => {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  if (!project)
    return <div className={styles.notFound}>Proyecto no encontrado</div>;

  const { title, description, tech, url, repo } = project;

  return (
    <div className={styles.detail}>
      <Link to="/" className={styles.back}>
        ← Volver
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </header>

      {url && (
        <div className={styles.demo}>
          <iframe
            src={url}
            title={title}
            className={styles.iframe}
            allow="fullscreen"
          />
        </div>
      )}

      <footer className={styles.meta}>
        <ul className={styles.tech}>
          {tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className={styles.links}>
          {repo && (
            <a href={repo} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
          {url && (
            <a href={url} target="_blank" rel="noreferrer">
              Ver proyecto
            </a>
          )}
        </div>
      </footer>
    </div>
  );
};
