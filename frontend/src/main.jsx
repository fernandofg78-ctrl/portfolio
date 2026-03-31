// src/main.jsx
// Punto de entrada — monta la app con el proveedor de temas

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
);
