// src/components/layout/Layout.jsx
// Componente envolvente — estructura base de todas las páginas

import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import styles from "./Layout.module.css";

export const Layout = () => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Navbar />
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p>© 2026 fer.dev</p>
      </footer>
    </div>
  );
};
