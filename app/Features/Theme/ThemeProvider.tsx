"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ThemeName } from "./type";

type ThemeContextType = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("classicMac");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeName | null; //DIT CHECKT OF ER IETS IN LOCALSTORAGE STAAT EN OVERWRITE DEFAULT VALUE

    if (savedTheme) {
      setThemeState(savedTheme);
    }
  }, []);

  function setTheme(newTheme: ThemeName) { //SET THE THEME, en slaat het ook op in localstorage
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}