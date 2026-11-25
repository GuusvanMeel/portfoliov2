"use client";

import { useTheme } from "@/features/theme/ThemeProvider";
import { windowThemes } from "../../Features/Window/windowThemes";
import styles from "../windows/WindowFrame.module.css";
import { ThemeName } from "@/features/theme/themeNames";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const selectedTheme = windowThemes[theme];
  return (
    <div>
      <p>Current theme: {theme}</p>

      {Object.keys(windowThemes).map((themeName) => (
        <button
          key={themeName}
          data-cy="theme-option"
          data-theme-option={themeName}
          className={`${styles.genericButton} ${selectedTheme.button}`}
          onClick={() => setTheme(themeName as ThemeName)}
        >
          {themeName}
        </button>
      ))}
    </div>
  );
}
