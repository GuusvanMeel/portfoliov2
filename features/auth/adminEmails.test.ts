import { describe, expect, test } from "vitest";
import { isAdminEmail, parseAdminEmails } from "@/features/auth/adminEmails";

describe("parseAdminEmails", () => {
  test("an empty or missing allowlist has nobody in it", () => {
    expect(parseAdminEmails(undefined)).toEqual([]);
    expect(parseAdminEmails("")).toEqual([]);
    expect(parseAdminEmails(" , ")).toEqual([]);
  });

  test("trims spaces and ignores case", () => {
    expect(parseAdminEmails(" Admin@Example.com , other@example.com")).toEqual([
      "admin@example.com",
      "other@example.com",
    ]);
  });
});

describe("isAdminEmail", () => {
  const allowlist = parseAdminEmails("admin@example.com");

  test("accepts a listed email in any case", () => {
    expect(isAdminEmail("ADMIN@example.com", allowlist)).toBe(true);
  });

  test("refuses an unlisted or missing email", () => {
    expect(isAdminEmail("user@example.com", allowlist)).toBe(false);
    expect(isAdminEmail(undefined, allowlist)).toBe(false);
    expect(isAdminEmail("admin@example.com", [])).toBe(false);
  });
});
