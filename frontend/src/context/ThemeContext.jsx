// src/context/ThemeContext.jsx
import { createContext, useContext, useState } from "react";
import { themes, defaultTheme } from "../themes/themes";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themes[themeName]);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
