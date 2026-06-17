"use client";

import { useTheme } from "@/app/Features/Theme/ThemeProvider";
import { windowThemes } from "../Features/Window/windowThemes";
import styles from "./WindowFrame.module.css";


export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
    const selectedTheme = windowThemes[theme];
  return (
    <div>
      <p>Current theme: {theme}</p>

      <button className={`${styles.genericButton} ${selectedTheme.button}`} onClick={() => setTheme("win98")}>
        Windows 98
      </button>

      <button className={`${styles.genericButton} ${selectedTheme.button}`}  onClick={() => setTheme("classicMac")}>
        Classic Mac
      </button>
    </div>
  );
}