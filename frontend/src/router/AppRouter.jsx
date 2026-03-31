// src/router/AppRouter.jsx
// Define las rutas principales de la aplicación

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { Home } from "../pages/Home";
import { ProjectDetail } from "../pages/ProjectDetail";
import { NotFound } from "../pages/NotFound";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
