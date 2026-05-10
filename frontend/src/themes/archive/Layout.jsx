// src/themes/archive/Layout.jsx
// Layout tema archive — sobre mí. Simplicidad aparente, complejidad oculta.

import { useEffect, useRef } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import "./archive.css";

const STATS = [
  { num: "47", label: "Años" },
  { num: "8", label: "Años en digital" },
  { num: "2000+", label: "Webs publicadas" },
];

const FORMACION = [
  {
    year: "2025",
    title: "Máster Full Stack Developer",
    org: "Nuclio Digital School",
    desc: "React, Node.js, MongoDB, Express, arquitectura de APIs REST, despliegue en producción.",
  },
  {
    year: "2024",
    title: "Máster en Diseño",
    org: "Curso especializado",
    desc: "Fundamentos de diseño UI/UX, composición visual, tipografía y sistemas de diseño.",
  },
  {
    year: "2014",
    title: "Máster en Ciberseguridad",
    org: "INCIBE · Universidad de León",
    desc: "Seguridad en redes, análisis de vulnerabilidades y buenas prácticas en desarrollo seguro.",
  },
  {
    year: "2014",
    title: "Técnico Superior DAM",
    org: "Desarrollo de Aplicaciones Multiplataforma",
    desc: "Fundamentos de programación, bases de datos y desarrollo de aplicaciones.",
  },
];

const SKILLS = [
  {
    label: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Vite", "CSS"],
  },
  { label: "Backend", items: ["Node.js", "Hono", "Express", "REST APIs"] },
  { label: "Datos", items: ["MongoDB", "Supabase", "PostgreSQL", "Mongoose"] },
  { label: "DevOps", items: ["Vercel", "Render", "Cloudinary", "Sentry"] },
  {
    label: "Otros",
    items: ["React Native", "Stripe", "Claude API", "Mapbox", "Git"],
  },
];

const VALUE_CARDS = [
  {
    num: "01",
    title: "Visión de negocio",
    desc: "8 años hablando con clientes reales enseñan lo que ningún bootcamp puede: qué quiere el usuario final y cómo traducirlo en producto.",
  },
  {
    num: "02",
    title: "Proyectos reales",
    desc: "No demos de tutorial. Aplicaciones con usuarios, con errores en producción resueltos, con decisiones de arquitectura tomadas bajo presión real.",
  },
  {
    num: "03",
    title: "Estabilidad",
    desc: "La edad que algunos ven como obstáculo es en realidad garantía. No busco un trampolín. Busco un equipo donde crecer y aportar a largo plazo.",
  },
  {
    num: "04",
    title: "Remoto nativo",
    desc: "No necesito adaptarme al remoto, llevo años trabajándolo. Comunicación clara, autonomía y entrega son parte de mi forma de trabajar.",
  },
];

// ── Indicador de progreso lateral ───────────────────────────
const ScrollProgress = () => {
  const progressRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (progressRef.current) {
        progressRef.current.style.height = `${pct}%`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div className="a-progress" ref={progressRef} />;
};

export const Layout = () => {
  return (
    <div className="a-wrapper">
      <ScrollProgress />
      <Navbar />

      {/* ── Hero ── */}
      <section className="a-hero">
        <div className="a-hero-left">
          <p className="a-hero-label">Full Stack Developer — León, ES</p>
          <h1 className="a-hero-title">
            Fernando
            <br />
            <em>Fdez</em>
            <br />
            Glez
          </h1>
          <div className="a-hero-bottom">
            <p className="a-hero-sub">
              47 años · León · Disponible para trabajo remoto
            </p>
            <div className="a-stats">
              {STATS.map(({ num, label }) => (
                <div key={label} className="a-stat">
                  <span className="a-stat-num">{num}</span>
                  <span className="a-stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="a-hero-right">
          <span className="a-section-label">// Presentación</span>
          <p className="a-hero-intro">
            No soy el perfil <em>habitual</em>. Soy alguien con ocho años de
            experiencia real en el mundo digital que decidió aprender a
            construir las soluciones que antes vendía.
          </p>
          <p
            className="a-hero-intro"
            style={{ fontSize: "0.9em", marginTop: "2rem" }}
          >
            El resultado está en este portfolio.
          </p>
        </div>
      </section>

      {/* ── Sobre mí ── */}
      <section className="a-about">
        <div className="a-about-inner">
          <div className="a-about-left">
            <span className="a-section-label">// 01 — Sobre mí</span>
            <h2 className="a-about-title">
              No soy el perfil
              <em>habitual</em>
            </h2>
          </div>
          <div className="a-about-right">
            <p className="a-about-text">
              Tengo 47 años, vivo en León y no puedo trasladarme. Lo digo sin
              rodeos porque prefiero la honestidad a las sorpresas. Lo que sí
              puedo ofrecer es algo que pocos juniors tienen: perspectiva real
              del mundo digital.
            </p>
            <p className="a-about-text">
              Durante 8 años trabajé como{" "}
              <strong>
                Account Manager en una empresa de servicios digitales
              </strong>
              , donde publiqué más de 2.000 webs para autónomos y pequeños
              negocios. Gestioné dominios, redireccionamientos, campañas de Ads
              y, sobre todo, aprendí a entender qué necesita realmente un
              cliente y qué diferencia una web que funciona de una que solo
              existe.
            </p>
            <p className="a-about-text">
              Esa experiencia me hizo ver las limitaciones del modelo. Así que
              decidí aprender a construir las soluciones yo mismo. El resultado
              es este portfolio:{" "}
              <strong>
                cinco aplicaciones en producción con usuarios reales
              </strong>
              , construidas desde cero en menos de un año, incluyendo un SaaS
              multitenant con app móvil y un sistema de chat multilingüe con
              traducción automática vía IA.
            </p>
            <p className="a-about-text">
              No soy el junior más rápido del mercado, pero soy alguien que no
              va a desaparecer a los seis meses, que entiende el negocio detrás
              del código y que lleva la misma determinación que puso en aprender
              a programar a cada proyecto que aborda.
            </p>
          </div>
        </div>
      </section>

      {/* ── Lo que aporto ── */}
      <section className="a-value">
        <div className="a-value-header">
          <span className="a-section-label">// 02 — Lo que aporto</span>
        </div>
        <div className="a-value-grid">
          {VALUE_CARDS.map(({ num, title, desc }) => (
            <div key={num} className="a-value-card" data-num={num}>
              <span className="a-value-num">{num}</span>
              <h3 className="a-value-title">{title}</h3>
              <p className="a-value-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stack ── */}
      <section className="a-stack">
        <div className="a-stack-header">
          <span className="a-section-label">// 03 — Stack técnico</span>
        </div>
        <div className="a-stack-grid">
          {SKILLS.map(({ label, items }) => (
            <div key={label} className="a-stack-group">
              <span className="a-stack-label">{label}</span>
              <ul className="a-stack-items">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Formación ── */}
      <section className="a-formation">
        <div className="a-formation-header">
          <span className="a-section-label">// 04 — Formación</span>
        </div>
        <div className="a-formation-list">
          {FORMACION.map(({ year, title, org, desc }) => (
            <div key={title} className="a-formation-item">
              <span className="a-formation-year">{year}</span>
              <div className="a-formation-content">
                <h3 className="a-formation-title">{title}</h3>
                <span className="a-formation-org">{org}</span>
                <p className="a-formation-desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contacto ── */}
      <section className="a-contact">
        <p className="a-contact-label">Contacto</p>
        <h2 className="a-contact-title">
          ¿Hablamos<em>?</em>
        </h2>
        <div className="a-contact-links">
          <a href="mailto:fernandofg78@gmail.com" className="a-contact-link">
            fernandofg78@gmail.com
          </a>
          <a href="tel:+34699968038" className="a-contact-link">
            +34 699 968 038
          </a>
          <a
            href="https://wa.me/34699968038"
            target="_blank"
            rel="noreferrer"
            className="a-contact-link a-contact-link--whatsapp"
          >
            WhatsApp ↗
          </a>
        </div>
        <p className="a-contact-avail">Disponible ahora — remoto preferente</p>
      </section>

      <footer className="a-footer">
        <span>© 2026 fer.dev</span>
        <span>León, ES — Full Stack Developer</span>
      </footer>
    </div>
  );
};
