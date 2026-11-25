/** The only list of theme names; the type and validation are derived from it. */
export const themeNames = ["Win98", "WinXP", "classicMac", "debug"] as const;

export type ThemeName = (typeof themeNames)[number];

export function isThemeName(value: string | null): value is ThemeName {
  return themeNames.some((name) => name === value);
}

export const defaultTheme: ThemeName = "WinXP";
