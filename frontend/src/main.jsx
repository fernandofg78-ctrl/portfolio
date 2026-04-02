// src/main.jsx
// Punto de entrada de la aplicación

import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./context/ThemeContext";
import { ModalProvider } from "./context/ModalContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <ModalProvider>
      <App />
    </ModalProvider>
  </ThemeProvider>,
);
