# Research: Reliable End-to-End Tests and a Separate Test Database

## R0. Vitest for server-only code

- **Decision**: `vitest.config.ts` defines two projects: `browser` (current setup, all `*.test.ts(x)` except below) and `node` (`environment: "node"`, `**/*.server.test.ts` and `lib/testEnvironment.test.ts`). Coverage merged into `coverage/vitest/lcov.info`. No new dependency.
- **Rationale**: browser mode has no `process.env` and cannot load server-only modules.

## R1. How the test database is created and kept in sync

- **Decision**: A separate free-tier Supabase project. Schema lives in `supabase/migrations/0001_initial_schema.sql`, applied by the maintainer in the Supabase SQL editor (in file order). The first migration is written from the live schema: the maintainer exports it once (Dashboard → Database → Schema, or `pg_dump --schema-only` with the live connection string) and the migration is checked against that export.
- **Rationale**: Clarified in the spec (free tier, no branches). The constitution already requires committed SQL migrations plus a documented manual apply step. Avoids adding the Supabase CLI as a dependency (XI).
- **Alternatives**: Supabase branching (paid); local Supabase in Docker (heavy on Windows and in CI, rejected in clarification); Supabase CLI `db push` (new tool; can be adopted later).

## R2. How the test database is reset to the seed

- **Decision**: `scripts/resetTestDatabase.ts` (run with `node --experimental-strip-types` / `npm run test:db:reset`) using `@supabase/supabase-js` with the test project's **service-role key**:
  1. guard (R3);
  2. ensure the admin and non-admin test users exist with the passwords from env (auth admin API: create or update);
  3. delete all rows from `projects`; insert the seed rows from `supabase/seed/projects.ts`.
  The same function is exposed as Cypress task `resetTestDatabase`, called in a global `before` in `cypress/support/e2e.ts`, so every run starts from the seed.
- **Rationale**: No extra dependency, works identically on Windows and Linux, seed is typed and imported by tests (tests reference seed titles instead of guessing).
- **Alternatives**: `seed.sql` run through psql (needs a DB connection string and psql in CI); per-test cleanup only (rejected in clarification).

## R3. Guaranteeing tests never touch the live database

- **Decision**: Tests read only `TEST_SUPABASE_URL`, `TEST_SUPABASE_ANON_KEY`, `TEST_SUPABASE_SERVICE_ROLE_KEY` (local: `.env.test.local`; CI: secrets). The app under test is started with `NEXT_PUBLIC_SUPABASE_*` set from those values. The guard refuses to run when any test URL is missing or contains the live project ref `nstelphunkyedurxjmey` (already public in `next.config.ts`), stored as `LIVE_SUPABASE_PROJECT_REF` in one module. The guard runs in the reset script and in `setupNodeEvents`. The app under test gets the same values from the same source: in CI both come from the same secrets; locally `npm run dev:test` / `npm run test:e2e` load `.env.test.local` for both the app and Cypress. No env-echo endpoint is added to the app.
- **Rationale**: Simple, explicit, fails fast; no visible change.
- **Alternatives**: Marker table in the test DB (schema drift between DBs).

## R4. Admin allowlist

- **Decision**: Env var `ADMIN_EMAILS` (comma-separated, case-insensitive, trimmed). `requireAdmin()` calls `supabase.auth.getUser()` (server-verified, not `getSession`) and throws `NotAuthorisedError("Not authorised")` if no user or email not listed. Missing/empty allowlist → nobody is admin. Production: maintainer sets `ADMIN_EMAILS` in Vercel to the existing admin email. Tests: `ADMIN_EMAILS` = test admin email; non-admin test user not listed.
- **Rationale**: Clarified (option B); no schema change.
- **Alternatives**: role column / custom claims (schema change).
- **Note**: the `/admin` page itself should use the same check so a signed-in non-admin sees no admin UI; the proxy redirect behaviour stays for signed-out users. This is not visible to visitors.

## R5. Forcing admin error paths in E2E

- **Decision**: Admin mutations are Next.js server actions (POST to the page with a `Next-Action` header). Tests use `cy.intercept({ method: "POST", url: "/admin", headers: { "next-action": /.*/ } }, { statusCode: 500 })` for the single targeted action, then assert the shown error (existing `alert` text for visibility/delete, captured with `cy.on("window:alert")`; save error message in the form dialog) and that the list is unchanged after reload.
- **Rationale**: No test-only code paths in the app; deterministic.
- **Alternatives**: a test flag in the app (test code in production); breaking the DB (slow, shared).

## R6. Contact form

- **Decision**: `cy.intercept("POST", contactFormEndpoint)` replies 200 (success) or 500 (failure); the test asserts success/error text from `content/en` and that the intercept was hit exactly once. Intercepts are registered before the visit so no real request can go out; a catch-all `cy.intercept` on the endpoint host fails the test if anything unexpected is sent.
- **Failure behaviour**: current design — status `error`, error message shown, input not reset (form only resets on success). Tested as such.

## R7. Flaky patterns and retries

- **Decision**: Cypress `retries: { runMode: 0, openMode: 0 }`; no `cy.wait(<number>)`; no `$body.find` conditional branches; each test self-contained (admin tests create their own data or use seed rows; global reset before the run). `logFlowMetric` stays (informational).

## R8. Theme after reload

- **Decision**: Test selects a non-default theme, reloads, and asserts `[data-cy=desktop][data-theme=<theme>]` (Cypress retries until the effect applies). Moving the theme into a cookie is #20 and out of scope (behaviour/visible change).

## R9. F-15 Cypress coverage of desktop flows

- **Decision**: Investigate during implementation with a fixed procedure: (1) confirm client chunks contain `__coverage__` counters in a `CYPRESS_COVERAGE=true` build; (2) add an explicit `nyc` config (`.nycrc.json`: `include` app/components/features/lib, `all: true`, `excludeAfterRemap`) so unloaded files count as 0 rather than disappearing, and so source maps remap to `components/**`; (3) compare report before/after and record numbers in `verification.md`. Done when Window/Taskbar/Desktop components show non-trivial coverage.
- **Rationale**: The SWC plugin instruments, but without config nyc reports only what it receives and may drop remapped paths.

## R10. CI wiring

- **Lighthouse build**: the Lighthouse job no longer downloads the `next-build` artifact (built with live `NEXT_PUBLIC_*`, which are inlined at build time). It runs its own `npm run build` with `NEXT_PUBLIC_SUPABASE_*` from the `TEST_SUPABASE_*` secrets and `ADMIN_EMAILS`. Cost: one extra build. The artifact upload in the build job is removed if nothing else uses it.
- **Concurrency limit**: GitHub keeps at most one pending run per concurrency group; a newer run replaces a pending one. Acceptable (only the latest commit matters); two runs never use the test database at the same time.

- **Decision**: `cypress` and `lighthouse` jobs use `TEST_SUPABASE_*`, `ADMIN_EMAILS`, `TEST_ADMIN_EMAIL/PASSWORD`, `TEST_USER_EMAIL/PASSWORD` secrets. The `build` job keeps live values only for its production-shaped build (no data reads in tests). Concurrency: a workflow-level group `test-db` with `cancel-in-progress: false` on the cypress + lighthouse jobs so runs wait for each other (serialised, per clarification). Next image `remotePatterns` hostname derived from `NEXT_PUBLIC_SUPABASE_URL` so test-project images load (production unchanged).
