import { describe, expect, it } from "vitest";
import { legacyThemeKey, migrateLegacyTheme } from "@/features/theme/themeMigration";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    removeItem: (key: string) => void data.delete(key),
  };
}

describe("migrateLegacyTheme", () => {
  it("returns a valid saved theme and removes it", () => {
    const storage = memoryStorage({ [legacyThemeKey]: "classicMac" });
    expect(migrateLegacyTheme(storage)).toBe("classicMac");
    expect(storage.data.has(legacyThemeKey)).toBe(false);
  });

  it("removes an invalid saved value and returns null", () => {
    const storage = memoryStorage({ [legacyThemeKey]: "Vista" });
    expect(migrateLegacyTheme(storage)).toBeNull();
    expect(storage.data.has(legacyThemeKey)).toBe(false);
  });

  it("returns null when nothing is saved", () => {
    expect(migrateLegacyTheme(memoryStorage())).toBeNull();
  });

  it("returns null when storage is unavailable", () => {
    const broken = {
      getItem: () => {
        throw new Error("denied");
      },
      removeItem: () => {},
    };
    expect(migrateLegacyTheme(broken)).toBeNull();
  });
});
