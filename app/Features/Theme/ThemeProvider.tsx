"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ThemeName } from "./type";

type ThemeContextType = {
    theme: ThemeName;
    setTheme: (theme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);
const defaultTheme: ThemeName = "classicMac";

function isThemeName(value: string | null): value is ThemeName {
    return value === "win98" || value === "classicMac" || value === "debug";
}

export function ThemeProvider({ children }:Readonly< { children: React.ReactNode }>) {
    const [currentTheme, setCurrentTheme] = useState<ThemeName>(defaultTheme);

  useEffect(() => {
  const savedTheme = localStorage.getItem("theme");

  if (isThemeName(savedTheme)) {
    // Theme is stored client-side for now.
    // Later this should move to cookies to avoid hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentTheme(savedTheme);
  }
}, []);

    

    function setTheme(newTheme: ThemeName) { //SET THE THEME, en slaat het ook op in localstorage
        setCurrentTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    }
    

    return (
        <ThemeContext.Provider value={{ theme: currentTheme, setTheme }}>
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