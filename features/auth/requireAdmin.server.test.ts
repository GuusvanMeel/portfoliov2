import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const getUser = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServer: async () => ({ auth: { getUser } }),
}));

const { requireAdmin, isCurrentUserAdmin, NotAuthorisedError } =
  await import("@/features/auth/requireAdmin");

const signedInAs = (email: string | null) =>
  getUser.mockResolvedValue(
    email === null
      ? { data: { user: null }, error: { message: "Auth session missing" } }
      : { data: { user: { id: "1", email } }, error: null },
  );

describe("requireAdmin", () => {
  beforeEach(() => {
    vi.stubEnv("ADMIN_EMAILS", "admin@test.invalid");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    getUser.mockReset();
  });

  // Also covers an expired session: Supabase then returns no user.
  test("refuses when nobody is signed in", async () => {
    signedInAs(null);
    await expect(requireAdmin()).rejects.toBeInstanceOf(NotAuthorisedError);
    expect(await isCurrentUserAdmin()).toBe(false);
  });

  test("refuses a signed-in user who is not on the allowlist", async () => {
    signedInAs("user@test.invalid");
    await expect(requireAdmin()).rejects.toThrow("Not authorised");
    expect(await isCurrentUserAdmin()).toBe(false);
  });

  test("accepts a signed-in admin in any letter case", async () => {
    signedInAs("Admin@Test.invalid");
    await expect(requireAdmin()).resolves.toMatchObject({ email: "Admin@Test.invalid" });
    expect(await isCurrentUserAdmin()).toBe(true);
  });

  test("refuses everyone when the allowlist is empty", async () => {
    vi.stubEnv("ADMIN_EMAILS", "");
    signedInAs("admin@test.invalid");
    await expect(requireAdmin()).rejects.toBeInstanceOf(NotAuthorisedError);
  });
});
