// src/App.jsx
// Rutas independientes por sección — cada tema es una página

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ModalProvider } from "./context/ModalContext";
import { projects } from "./utils/projects";

import { Layout as DefaultLayout } from "./themes/default/Layout";
import { Layout as BrutalismLayout } from "./themes/brutalism/Layout";
import { Layout as GroovyLayout } from "./themes/groovy/Layout";
import { Layout as ArchiveLayout } from "./themes/archive/Layout";
import { NotFound } from "./pages/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <ModalProvider>
        <Routes>
          <Route path="/" element={<DefaultLayout projects={projects} />} />
          <Route
            path="/features"
            element={<BrutalismLayout projects={projects} />}
          />
          <Route
            path="/features/:id"
            element={<BrutalismLayout projects={projects} />}
          />
          <Route
            path="/panels"
            element={<GroovyLayout projects={projects} />}
          />
          <Route
            path="/about"
            element={<ArchiveLayout projects={projects} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ModalProvider>
    </BrowserRouter>
  );
};

export default App;
