/** The only list of theme names; the type and validation are derived from it. */
export const themeNames = ["Win98", "WinXP", "classicMac", "debug"] as const;

export type ThemeName = (typeof themeNames)[number];

export function isThemeName(value: string | null | undefined): value is ThemeName {
  return value != null && (themeNames as readonly string[]).includes(value);
}

export const defaultTheme: ThemeName = "WinXP";

/** The cookie that holds the chosen theme. */
export const themeCookie = "theme";
