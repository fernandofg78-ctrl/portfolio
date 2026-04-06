// src/App.jsx
// Carga el layout correspondiente al tema activo

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import { ProjectDetail } from "./pages/ProjectDetail";
import { NotFound } from "./pages/NotFound";
import { projects } from "./utils/projects";

import { Layout as DefaultLayout } from "./themes/default/Layout";
import { Layout as BrutalismLayout } from "./themes/brutalism/Layout";
import { Layout as GroovyLayout } from "./themes/groovy/Layout";
import { Layout as ArchiveLayout } from "./themes/archive/Layout";

const layouts = {
  default: DefaultLayout,
  brutalism: BrutalismLayout,
  groovy: GroovyLayout,
  archive: ArchiveLayout,
};

const App = () => {
  const { activeTheme, changeTheme } = useTheme();
  const ActiveLayout = layouts[activeTheme];

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <ActiveLayout
              projects={projects}
              changeTheme={changeTheme}
              activeTheme={activeTheme}
            />
          }
        >
          <Route path="/" element={null} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
