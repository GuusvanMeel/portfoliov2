"use client";

import { useTheme } from "@/features/theme/ThemeProvider";
import { themes } from "@/features/theme/themes";

/** The active theme's name and definition. Components style themselves with `definition`. */
export function useThemeDefinition() {
  const { theme } = useTheme();

  return { name: theme, definition: themes[theme] };
}
