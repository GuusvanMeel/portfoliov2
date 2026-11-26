import { describe, expect, it } from "vitest";
import { defaultViewMode, isViewMode } from "@/features/admin/viewMode";
import { readPreference } from "@/lib/preferenceCookie";

describe("isViewMode", () => {
  it.each(["list", "grid"])("accepts %s", (value) => {
    expect(isViewMode(value)).toBe(true);
  });

  it.each([["Grid"], [""], [null], [undefined], ["table"]])("rejects %j", (value) => {
    expect(isViewMode(value)).toBe(false);
  });
});

describe("admin view cookie", () => {
  it("falls back to list for an invalid value", () => {
    expect(defaultViewMode).toBe("list");
    expect(readPreference("bogus", isViewMode, defaultViewMode)).toBe("list");
    expect(readPreference("grid", isViewMode, defaultViewMode)).toBe("grid");
  });
});
