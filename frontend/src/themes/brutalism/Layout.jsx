// src/themes/brutalism/Layout.jsx
// Layout del tema brutalism — en construcción

import { Outlet } from "react-router-dom";
import "./brutalism.css";

export const Layout = ({ changeTheme, activeTheme }) => {
  return (
    <div className="brutal-wrapper">
      <header className="brutal-header">
        <span>fer.dev</span>
        <button onClick={() => changeTheme("default")}>← default</button>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
