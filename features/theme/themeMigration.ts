import { isThemeName, type ThemeName } from "@/features/theme/themeNames";

/** The key the theme was stored under before it moved to a cookie. */
export const legacyThemeKey = "theme";

/**
 * Reads the theme saved by the old localStorage mechanism and removes it, so it is used once.
 * Returns the theme when it was valid, otherwise null. Never throws.
 */
export function migrateLegacyTheme(
  storage: Pick<Storage, "getItem" | "removeItem">,
): ThemeName | null {
  try {
    const saved = storage.getItem(legacyThemeKey);
    if (saved === null) return null;

    storage.removeItem(legacyThemeKey);
    return isThemeName(saved) ? saved : null;
  } catch {
    return null;
  }
}
