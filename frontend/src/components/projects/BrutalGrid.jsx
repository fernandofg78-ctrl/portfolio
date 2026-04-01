// src/components/projects/BrutalGrid.jsx
// Grid brutalista con posiciones irregulares y mockups de móvil

import { useNavigate } from "react-router-dom";
import styles from "./BrutalGrid.module.css";

const PhoneMockup = ({ image, title }) => (
  <div className={styles.phoneWrap}>
    <div className={styles.phone}>
      <div className={styles.phoneNotch} />
      <div className={styles.phoneScreen}>
        {image ? (
          <img src={image} alt={title} className={styles.phoneImg} />
        ) : (
          <div className={styles.phonePlaceholder}>
            {title.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  </div>
);

export const BrutalGrid = ({ projects }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.grid}>
      {projects.map((project, index) => (
        <div
          key={project.id}
          className={`${styles.card} ${index === 0 ? styles.featured : ""} ${
            index === 1 ? styles.tall : ""
          }`}
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          <PhoneMockup image={project.image} title={project.title} />
          <div className={styles.info}>
            <div className={styles.num}>
              {String(index + 1).padStart(2, "0")}
              {index === 0 && <span className={styles.star}> — ESTRELLA</span>}
            </div>
            <h3 className={styles.title}>{project.title}</h3>
            {(index === 0 || index === 1) && (
              <p className={styles.desc}>{project.description}</p>
            )}
            <ul className={styles.tags}>
              {project.tech?.slice(0, 3).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
