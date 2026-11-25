import { describe, expect, test } from "vitest";
import { isThemeName } from "./ThemeProvider";

describe("isThemeName", () => {
  test.each(["Win98", "classicMac", "WinXP", "debug"])("accepts %s", (name) => {
    expect(isThemeName(name)).toBe(true);
  });

  test.each([null, "", "winxp", "Vista"])("rejects %s", (value) => {
    expect(isThemeName(value)).toBe(false);
  });
});
