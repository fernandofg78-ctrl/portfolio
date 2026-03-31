// src/components/projects/ProjectCard.jsx
// Card individual de proyecto

import { Link } from "react-router-dom";
import styles from "./ProjectCard.module.css";

export const ProjectCard = ({ project }) => {
  const { id, title, description, tech, image } = project;

  return (
    <Link to={`/project/${id}`} className={styles.card}>
      <div className={styles.image}>
        {image ? (
          <img src={image} alt={title} className={styles.thumbnail} />
        ) : (
          <span className={styles.placeholder}>{title[0]}</span>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <ul className={styles.tech}>
          {tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </Link>
  );
};
