// src/context/ModalContext.jsx
// Gestiona el proyecto activo en el modal

import { createContext, useContext, useState } from "react";

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [activeProject, setActiveProject] = useState(null);

  const openModal = (project) => setActiveProject(project);
  const closeModal = () => setActiveProject(null);

  return (
    <ModalContext.Provider value={{ activeProject, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};
