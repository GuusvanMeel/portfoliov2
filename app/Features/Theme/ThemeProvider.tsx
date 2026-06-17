"use client";

import { createContext, useContext, useState } from "react";
import type { ThemeName } from "./type";

type ThemeContextType = {
    theme: ThemeName;
    setTheme: (theme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);
const defaultTheme: ThemeName = "classicMac";

function isThemeName(value: string | null): value is ThemeName {
    return value === "win98" || value === "classicMac";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemeName>(() => {
        if (globalThis.window === undefined) {
            return defaultTheme;
        }
        const savedTheme = localStorage.getItem("theme");
        if (isThemeName(savedTheme)) {
            return savedTheme;
        }
        return defaultTheme;
    });
    

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