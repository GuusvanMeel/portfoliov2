import { describe, expect, test } from "vitest";
import { defaultTheme, isThemeName, themeNames } from "@/features/theme/themeNames";

describe("isThemeName", () => {
  test.each(["Win98", "classicMac", "WinXP", "debug"])("accepts %s", (name) => {
    expect(isThemeName(name)).toBe(true);
  });

  test.each([null, undefined, "", "winxp", "Vista"])("rejects %s", (value) => {
    expect(isThemeName(value)).toBe(false);
  });
});

describe("themeNames", () => {
  test("contains the default theme", () => {
    expect(themeNames).toContain(defaultTheme);
  });
});
