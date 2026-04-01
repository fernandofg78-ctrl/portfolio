// src/pages/Home.jsx
// Página principal del portfolio

import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { projects } from "../utils/projects";
import { ProjectCard } from "../components/projects/ProjectCard";
import styles from "./Home.module.css";

const STATS = [
  { num: "5", label: "Apps en prod." },
  { num: "3", label: "Meses" },
  { num: "8", label: "Años exp." },
];

export const Home = () => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.name === "dark";

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroTop}>
          <p className={styles.role}>Full Stack Developer</p>
          <h1 className={styles.name}>
            Fernando
            <br />
            <span
              className={styles.nameOutline}
              style={{
                WebkitTextStroke: `var(--name-stroke)`,
                color: isDark ? "transparent" : "inherit",
              }}
            >
              Fdez Glez
            </span>
          </h1>
        </div>
        <div className={styles.heroBottom}>
          <p className={styles.tagline}>
            Construyo aplicaciones web
            <br />
            <strong>con criterio y con código.</strong>
          </p>
          <div className={styles.stats}>
            {STATS.map(({ num, label }) => (
              <div key={label} className={styles.stat}>
                <span className={styles.statNum}>{num}</span>
                <span className={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className={styles.projects}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Proyectos</h2>
          <div className={styles.sectionLine} />
          <span className={styles.sectionCount}>0{projects.length}</span>
        </div>
        <div className={styles.grid}>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              featured={index === 0}
            />
          ))}
        </div>
      </section>

      <section id="contact" className={styles.contact}>
        <p className={styles.contactLabel}>Contacto</p>
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
