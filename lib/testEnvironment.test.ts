import { describe, expect, test } from "vitest";
import { readTestEnvironment, TestEnvironmentError } from "./testEnvironment.ts";

const validEnv = {
  TEST_SUPABASE_URL: "https://testproject.supabase.co",
  TEST_SUPABASE_ANON_KEY: "anon",
  TEST_SUPABASE_SERVICE_ROLE_KEY: "service",
  TEST_ADMIN_EMAIL: "admin@test.invalid",
  TEST_ADMIN_PASSWORD: "admin-password",
  TEST_USER_EMAIL: "user@test.invalid",
  TEST_USER_PASSWORD: "user-password",
};

describe("readTestEnvironment", () => {
  test("returns the test settings when everything is set", () => {
    const result = readTestEnvironment({
      ...validEnv,
      NEXT_PUBLIC_SUPABASE_URL: validEnv.TEST_SUPABASE_URL,
    });
    expect(result.supabaseUrl).toBe(validEnv.TEST_SUPABASE_URL);
    expect(result.userEmail).toBe(validEnv.TEST_USER_EMAIL);
  });

  test("refuses when a value is missing and names it", () => {
    expect(() => readTestEnvironment({ ...validEnv, TEST_SUPABASE_SERVICE_ROLE_KEY: " " })).toThrow(
      /missing TEST_SUPABASE_SERVICE_ROLE_KEY/,
    );
  });

  test("refuses a URL with a path such as /rest/v1", () => {
    expect(() =>
      readTestEnvironment({
        ...validEnv,
        TEST_SUPABASE_URL: "https://testproject.supabase.co/rest/v1/",
      }),
    ).toThrow(/project URL only/);
  });

  test("refuses the live database", () => {
    expect(() =>
      readTestEnvironment({
        ...validEnv,
        TEST_SUPABASE_URL: "https://nstelphunkyedurxjmey.supabase.co",
      }),
    ).toThrow(TestEnvironmentError);
  });

  test("refuses when the app would use another database", () => {
    expect(() =>
      readTestEnvironment({
        ...validEnv,
        NEXT_PUBLIC_SUPABASE_URL: "https://nstelphunkyedurxjmey.supabase.co",
      }),
    ).toThrow(/differs from TEST_SUPABASE_URL/);
  });
});
