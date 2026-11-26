import { afterEach, describe, expect, it, vi } from "vitest";
import {
  preferenceCookieMaxAge,
  preferenceCookieString,
  readPreference,
  writePreferenceCookie,
} from "@/lib/preferenceCookie";

const colors = ["red", "blue"] as const;
type Color = (typeof colors)[number];
const isColor = (value: string | null | undefined): value is Color =>
  value != null && (colors as readonly string[]).includes(value);

describe("readPreference", () => {
  it("returns a valid value", () => {
    expect(readPreference("blue", isColor, "red")).toBe("blue");
  });

  it.each([["green"], [""], [undefined], ["BLUE"]])("falls back for %j", (raw) => {
    expect(readPreference(raw, isColor, "red")).toBe("red");
  });
});

describe("preferenceCookieString", () => {
  it("builds a one-year, site-wide, lax cookie", () => {
    expect(preferenceCookieString("theme", "Win98", false)).toBe(
      `theme=Win98; Path=/; Max-Age=${preferenceCookieMaxAge}; SameSite=Lax`,
    );
  });

  it("adds Secure on https", () => {
    expect(preferenceCookieString("theme", "Win98", true)).toMatch(/; Secure$/);
  });
});

describe("writePreferenceCookie", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.cookie = "vitest-pref=; Path=/; Max-Age=0";
  });

  it("writes the cookie", () => {
    writePreferenceCookie("vitest-pref", "blue");
    expect(document.cookie).toContain("vitest-pref=blue");
  });

  it("does not throw when cookies are blocked", () => {
    vi.spyOn(document, "cookie", "set").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => writePreferenceCookie("vitest-pref", "blue")).not.toThrow();
  });
});
