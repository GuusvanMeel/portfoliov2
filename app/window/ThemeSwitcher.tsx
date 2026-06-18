"use client";

import { useTheme } from "@/app/Features/Theme/ThemeProvider";
import { windowThemes } from "../Features/Window/windowThemes";
import styles from "./WindowFrame.module.css";
import { ThemeName } from "../Features/Theme/type";


export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
    const selectedTheme = windowThemes[theme];
  return (
    <div>
      <p>Current theme: {theme}</p>

      {Object.keys(windowThemes).map((themeName) => (
  <button
    key={themeName}
    className={`${styles.genericButton} ${selectedTheme.button}`}
    onClick={() => setTheme(themeName as ThemeName)}
  >
    {themeName}
  </button>
))}
    </div>
  );
}