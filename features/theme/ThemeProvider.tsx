"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { themeCookie, type ThemeName } from "@/features/theme/themeNames";
import { migrateLegacyTheme } from "@/features/theme/themeMigration";
import { writePreferenceCookie } from "@/lib/preferenceCookie";

type ThemeContextType = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

type ThemeProviderProps = Readonly<{
  /** The theme the server read from the cookie (or the default), so both renders match. */
  initialTheme: ThemeName;
  /** Whether the visitor already has a valid theme cookie; if not, an old localStorage theme is moved. */
  hasThemeCookie: boolean;
  children: React.ReactNode;
}>;

export function ThemeProvider({ initialTheme, hasThemeCookie, children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(initialTheme);

  useEffect(() => {
    if (hasThemeCookie) return;

    // One-time move from the old localStorage mechanism. The server cannot see localStorage,
    // so this visitor sees the default once; every later load is rendered by the server.
    const legacyTheme = migrateLegacyTheme(localStorage);
    if (legacyTheme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentTheme(legacyTheme);
      writePreferenceCookie(themeCookie, legacyTheme);
    }
  }, [hasThemeCookie]);

  function setTheme(newTheme: ThemeName) {
    setCurrentTheme(newTheme);
    writePreferenceCookie(themeCookie, newTheme);
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
