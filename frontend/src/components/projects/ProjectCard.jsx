// src/components/projects/ProjectCard.jsx
// Card de proyecto — soporta variante featured (ocupa 2 columnas)

import { useNavigate } from "react-router-dom";
import styles from "./ProjectCard.module.css";

export const ProjectCard = ({ project, featured = false, index = 0 }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`${styles.card} ${featured ? styles.featured : ""}`}
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <div className={styles.image}>
        {project.image ? (
          <img src={project.image} alt={project.title} className={styles.img} />
        ) : (
          <span className={styles.placeholder}>
            {project.title.slice(0, 2).toUpperCase()}
          </span>
        )}
        <div className={styles.imageOverlay} />
      </div>

      <div className={styles.content}>
        <div className={styles.contentTop}>
          {featured && (
            <span className={styles.featuredBadge}>Proyecto estrella</span>
          )}
          <div className={styles.num}>{String(index + 1).padStart(2, "0")}</div>
          <h3 className={styles.title}>{project.title}</h3>
          <p className={styles.description}>{project.description}</p>
        </div>
        <ul className={styles.tech}>
          {project.tech?.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
