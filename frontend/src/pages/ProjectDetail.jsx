// src/pages/ProjectDetail.jsx
// Página de detalle de un proyecto

import { useParams, Link } from "react-router-dom";
import { projects } from "../utils/projects";

export const ProjectDetail = () => {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  if (!project) return <div>Proyecto no encontrado</div>;

  const { title, description, tech, url, repo } = project;

  return (
    <div>
      <Link to="/">← Volver</Link>

      <header>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      {url && <iframe src={url} title={title} allow="fullscreen" />}

      <footer>
        <ul>
          {tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div>
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
