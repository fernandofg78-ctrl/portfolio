// src/pages/Home.jsx
// Página principal del portfolio

import { useTheme } from "../context/ThemeContext";
import { projects } from "../utils/projects";
import { ProjectCard } from "../components/projects/ProjectCard";
import { BrutalGrid } from "../components/projects/BrutalGrid";
import styles from "./Home.module.css";

const STATS = [
  { num: "5", label: "Apps en prod." },
  { num: "3", label: "Meses" },
  { num: "8", label: "Años exp." },
];

const TICKER_ITEMS = [
  "React",
  "Express",
  "MongoDB",
  "Next.js",
  "Supabase",
  "Node.js",
  "Mapbox",
  "JWT",
  "Cloudinary",
  "Hono",
  "i18n",
];

export const Home = () => {
  const { currentTheme } = useTheme();
  const isBrutal = currentTheme.name === "brutal";
  const isDark = currentTheme.name === "dark";

  return (
    <div className={`${styles.home} ${isBrutal ? styles.brutal : ""}`}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroTop}>
          <p className={styles.role}>
            {isBrutal
              ? "Full Stack Developer — Logroño, ES"
              : "Full Stack Developer"}
          </p>
          <h1 className={styles.name}>
            {isBrutal ? (
              <>
                FER
                <br />
                <span className={styles.nameOutline}>NANDO</span>
                <br />
                FDEZ
              </>
            ) : (
              <>
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
              </>
            )}
          </h1>
        </div>

        <div className={styles.heroBottom}>
          <p className={styles.tagline}>
            {isBrutal ? (
              <span className={styles.monoText}>
                // construyo apps
                <br />
                que funcionan en producción
              </span>
            ) : (
              <>
                Construyo aplicaciones web
                <br />
                <strong>con criterio y con código.</strong>
              </>
            )}
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

        {/* Ticker — solo en brutal */}
        {isBrutal && (
          <div className={styles.tickerWrap}>
            <div className={styles.ticker}>
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <span key={i}>
                  {item}
                  <span className={styles.tickerSep}>×</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Proyectos ── */}
      <section id="projects" className={styles.projects}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {isBrutal ? "Proyectos seleccionados" : "Proyectos"}
          </h2>
          <div className={styles.sectionLine} />
          <span className={styles.sectionCount}>0{projects.length}</span>
        </div>

        {isBrutal ? (
          <BrutalGrid projects={projects} />
        ) : (
          <div className={styles.grid}>
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                featured={false}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Contacto ── */}
      <section id="contact" className={styles.contact}>
        {isBrutal ? (
          <div className={styles.contactBrutal}>
            <h2 className={styles.contactTitle}>
              ¿HABLA
              <br />
              <span className={styles.contactOutline}>MOS?</span>
            </h2>
            <div className={styles.contactRight}>
              <a href="mailto:tu@email.com" className={styles.contactLink}>
                tu@email.com
              </a>
              <p className={styles.contactAvail}>Disponible ahora</p>
            </div>
          </div>
        ) : (
          <>
            <p className={styles.contactLabel}>Contacto</p>
            <h2 className={styles.contactTitle}>¿Hablamos?</h2>
            <p className={styles.contactText}>
              Disponible para proyectos freelance y posiciones full stack.
            </p>
            <a href="mailto:tu@email.com" className={styles.contactLink}>
              tu@email.com
            </a>
          </>
        )}
      </section>
    </div>
  );
};
