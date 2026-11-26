// Test environment guard. Runs in plain Node (reset script, Cypress config), so it has no `@/`
// imports and no app dependencies. Tests must never reach the live database: when anything is
// missing or points at the live project, this throws instead of falling back.

/** Project ref of the live Supabase project (already public in next.config.ts). */
export const LIVE_SUPABASE_PROJECT_REF = "nstelphunkyedurxjmey";

export type TestEnvironment = {
  supabaseUrl: string;
  anonKey: string;
  serviceRoleKey: string;
  adminEmail: string;
  adminPassword: string;
  userEmail: string;
  userPassword: string;
};

const requiredVariables = {
  supabaseUrl: "TEST_SUPABASE_URL",
  anonKey: "TEST_SUPABASE_ANON_KEY",
  serviceRoleKey: "TEST_SUPABASE_SERVICE_ROLE_KEY",
  adminEmail: "TEST_ADMIN_EMAIL",
  adminPassword: "TEST_ADMIN_PASSWORD",
  userEmail: "TEST_USER_EMAIL",
  userPassword: "TEST_USER_PASSWORD",
} as const satisfies Record<keyof TestEnvironment, string>;

export class TestEnvironmentError extends Error {
  constructor(reason: string) {
    super(`Refusing to run tests: ${reason}`);
    this.name = "TestEnvironmentError";
  }
}

/**
 * Loads `.env.test.local` (local runs) without overriding variables that are already set
 * (CI passes them as secrets and has no such file).
 */
export function loadLocalTestEnvFile(path = ".env.test.local"): void {
  try {
    process.loadEnvFile(path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

export function isLiveSupabaseUrl(url: string | undefined): boolean {
  return Boolean(url && url.includes(LIVE_SUPABASE_PROJECT_REF));
}

export function readTestEnvironment(
  env: Record<string, string | undefined> = process.env,
): TestEnvironment {
  const missing = Object.values(requiredVariables).filter((name) => !env[name]?.trim());
  if (missing.length > 0) {
    throw new TestEnvironmentError(
      `missing ${missing.join(", ")} (see specs/002-reliable-e2e-test-db/quickstart.md)`,
    );
  }

  const result = Object.fromEntries(
    Object.entries(requiredVariables).map(([key, name]) => [key, env[name]!.trim()]),
  ) as TestEnvironment;

  if (!/^https:\/\/[^/]+\/?$/.test(result.supabaseUrl)) {
    throw new TestEnvironmentError(
      "TEST_SUPABASE_URL must be the project URL only (https://<ref>.supabase.co), without a path such as /rest/v1",
    );
  }

  if (isLiveSupabaseUrl(result.supabaseUrl)) {
    throw new TestEnvironmentError("TEST_SUPABASE_URL points at the live database");
  }

  // The app under test must talk to the same (test) project.
  const appUrl = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (appUrl && appUrl !== result.supabaseUrl) {
    throw new TestEnvironmentError(
      "NEXT_PUBLIC_SUPABASE_URL differs from TEST_SUPABASE_URL, so the app would use another database",
    );
  }

  return result;
}
