"use client";

import { messages } from "@/content/en";
import { useTheme } from "@/features/theme/ThemeProvider";
import { themeNames } from "@/features/theme/themeNames";
import { useThemeDefinition } from "@/features/theme/useThemeDefinition";
import styles from "./ThemeSwitcher.module.css";

export default function ThemeSwitcher() {
  const { setTheme } = useTheme();
  const { name, definition } = useThemeDefinition();

  return (
    <div>
      <p>
        {messages.apps.themeSwitcher.currentTheme} {name}
      </p>

      {themeNames.map((themeName) => (
        <button
          key={themeName}
          data-cy="theme-option"
          data-theme-option={themeName}
          className={`${styles.genericButton} ${definition.controls.button}`}
          onClick={() => setTheme(themeName)}
        >
          {themeName}
        </button>
      ))}
    </div>
  );
}
