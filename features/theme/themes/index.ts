import type { ThemeName } from "@/features/theme/themeNames";
import type { ThemeDefinition } from "@/features/theme/types";
import { classicMac } from "@/features/theme/themes/classicMac";
import { debug } from "@/features/theme/themes/debug";
import { win98 } from "@/features/theme/themes/win98";
import { winXp } from "@/features/theme/themes/winXp";

/** Theme registry: compilation fails when a theme or one of its fields is missing. */
export const themes: Record<ThemeName, ThemeDefinition> = {
  Win98: win98,
  classicMac,
  WinXP: winXp,
  debug,
};
