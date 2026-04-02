// src/context/ThemeContext.jsx
// Gestiona el tema visual activo de la aplicación

import { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [activeTheme, setActiveTheme] = useState("default");

  const changeTheme = (themeName) => setActiveTheme(themeName);

  return (
    <ThemeContext.Provider value={{ activeTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
