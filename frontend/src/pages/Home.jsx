// src/pages/Home.jsx
// Página principal del portfolio

import { projects } from "../utils/projects";
import { ProjectCard } from "../components/projects/ProjectCard";
import styles from "./Home.module.css";

export const Home = () => {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.role}>Full Stack Developer</p>
          <h1 className={styles.name}>
            Fernando
            <br />
            Fdez Glez
          </h1>
          <p className={styles.tagline}>
            Construyo aplicaciones web
            <br />
            con criterio y con código.
          </p>
        </div>
        <div className={styles.scrollHint}>
          <span>Proyectos</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3v10M3 8l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      <section id="projects" className={styles.projects}>
        <h2 className={styles.sectionTitle}>Proyectos</h2>
        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section id="contact" className={styles.contact}>
        <h2 className={styles.contactTitle}>¿Hablamos?</h2>
        <p className={styles.contactText}>
          Disponible para proyectos freelance y posiciones full stack.
        </p>
        <a href="mailto:tu@email.com" className={styles.contactLink}>
          tu@email.com
        </a>
      </section>
    </div>
  );
};
