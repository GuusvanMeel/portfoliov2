# Quickstart: Test database setup and validation

## 1. Maintainer manual steps (once)

1. In Supabase, create a new **free** project named `portfoliov2-test` (any region). Save the database password in your password manager.
2. Export the live schema for comparison: live project → SQL editor → run the schema query from `supabase/README.md` (or `pg_dump --schema-only`), and compare with `supabase/migrations/0001_initial_schema.sql`. Report differences before continuing.
3. In the **test** project → SQL editor, run each file in `supabase/migrations/` in name order.
4. Test project → Authentication → Providers → Email: turn **off** "Confirm email" (test users must sign in immediately).
4a. In **both** the live and the test project → Authentication → Sign In / Providers: turn **off** "Allow new users to sign up". (The reset script creates the test users through the admin API, which still works.)
5. Copy from test project → Settings → API: Project URL, `anon` key, `service_role` key.
6. Create `.env.test.local` in the repo root (git-ignored):
   ```
   NEXT_PUBLIC_SUPABASE_URL=<test URL>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<test anon key>
   TEST_SUPABASE_URL=<test URL>
   TEST_SUPABASE_ANON_KEY=<test anon key>
   TEST_SUPABASE_SERVICE_ROLE_KEY=<test service_role key>
   TEST_ADMIN_EMAIL=admin@test.invalid
   TEST_ADMIN_PASSWORD=<generate>
   TEST_USER_EMAIL=user@test.invalid
   TEST_USER_PASSWORD=<generate>
   ADMIN_EMAILS=admin@test.invalid
   CYPRESS_COVERAGE=true
   ```
7. Add the real admin email to `ADMIN_EMAILS` in `.env.local` and in **Vercel → Project → Settings → Environment Variables** (Production and Preview) **before** the merge, or the live admin panel refuses every change.
8. GitHub → repo → Settings → Secrets and variables → Actions → add: `TEST_SUPABASE_URL`, `TEST_SUPABASE_ANON_KEY`, `TEST_SUPABASE_SERVICE_ROLE_KEY`, `TEST_ADMIN_EMAIL`, `TEST_ADMIN_PASSWORD`, `TEST_USER_EMAIL`, `TEST_USER_PASSWORD`.
9. After the spec is merged and CI is green: delete the old secrets `ADMIN_EMAIL`, `ADMIN_PASSWORD` and the local `cypress.env.json`.

## 2. Validate locally

```powershell
npm run test:db:reset
```
Expected: "Seeded 3 projects, 2 test users" and no error. Running with `TEST_SUPABASE_URL` set to the live URL must stop with "Refusing to use the live database".

```powershell
npm run test:components
```
Expected: admin-guard tests pass.

```powershell
npm run test:e2e
```
Expected: all specs pass with retries off; live project's `projects` table unchanged (compare row count and latest `updated_at` before/after).

## 3. Validate in CI

Open the PR → `End-to-End` and `Lighthouse` jobs pass using the test secrets; a second run started meanwhile waits instead of overlapping.

## 4. Validate the admin guard on production (after deploy)

Sign in with the real admin → create/edit/toggle/delete a throwaway project works. Signed out, the same server action POST is refused.

See [contracts/test-environment.md](./contracts/test-environment.md) and [contracts/admin-guard.md](./contracts/admin-guard.md).
