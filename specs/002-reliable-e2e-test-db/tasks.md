---
description: "Task list for spec 002 – reliable E2E tests and a separate test database"
---

# Tasks: Reliable End-to-End Tests and a Separate Test Database

**Input**: Design documents from `specs/002-reliable-e2e-test-db/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Required (constitution IX, spec FR-009/FR-012/FR-013). Every new or changed Cypress test is sabotaged locally and logged in `specs/002-reliable-e2e-test-db/verification.md` before it counts as done.

**Working rules for implement**: batch commits, verify locally, push as rarely as possible (once per spec if possible). Sabotage edits are never committed. Mechanical changes (renames) are committed separately from behaviour changes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on unfinished tasks)
- **[Story]**: US1 test database · US2 admin guard · US3 E2E audit · US4 coverage gaps · US5 small fixes + docs

---

## Phase 1: Setup

- [X] T001 Create `specs/002-reliable-e2e-test-db/verification.md` with empty sections: "E2E audit", "Sabotage log" (columns: test, sabotage applied, observed failure message, reverted ✓), "Coverage before/after (F-15)", "Live database unchanged check", "CI run".
- [ ] T002 Record the live-database baseline in `verification.md` → "Live database unchanged check": ask the maintainer for the current row count and the latest `updated_at` of `projects` in the live project (do not query live from scripts).
- [X] T003a Split `vitest.config.ts` into two projects (research R0): `browser` (current settings; include `**/*.test.{ts,tsx}`, exclude `**/*.server.test.ts` and `lib/testEnvironment.test.ts`) and `node` (`environment: "node"`, include those two patterns); keep merged coverage at `coverage/vitest/lcov.info`; verify `npm run test:components` and `npm run test:components:coverage` still pass.
- [X] T003 [P] Record the current Cypress coverage summary (F-15 baseline) in `verification.md` by running the existing suite with `CYPRESS_COVERAGE=true` and `npm run coverage:report` (note per-folder line % for `components/`, `features/windows/`, `features/theme/`).

---

## Phase 2: Foundational (blocks all stories)

**⚠️ No story work until this phase is done and the maintainer finished quickstart §1 steps 1–6 and 8.**

- [X] T004 Write `supabase/migrations/0001_initial_schema.sql` creating `public.projects` exactly as in data-model.md: `id bigint generated always as identity primary key`, `title text not null`, `description text`, `desktop_icon_src text`, `tags text[] default '{}'`, `is_visible boolean not null default false`, `duration text`, `imagesrc text`, `"Github_Link" text`, `created_at timestamptz default now()`, `updated_at timestamptz default now()`; enable RLS; policies: anon+authenticated select where `is_visible`, authenticated select all, authenticated insert/update/delete. Add a header comment: "applied manually in the Supabase SQL editor, in file-name order".
- [X] T005 Write `supabase/README.md`: what the folder is, the SQL query to export the live schema for comparison (columns from `information_schema.columns` + policies from `pg_policies` for `public.projects`), how to apply migrations manually, and that the live database is never changed by tests.
- [ ] T006 Maintainer checkpoint: ask the maintainer to run the export query from `supabase/README.md` on the live project and paste the result; fix any difference in `supabase/migrations/0001_initial_schema.sql` (never in live). Record "schema matches" in `verification.md`.
- [X] T007 [P] Create `supabase/seed/projects.ts` exporting `seedProjects` (own local `SeedProjectRow` type with the insertable columns; do not import `ProjectRow` via `@/`) with keys `visibleA` ("Seed Visible Project A", visible), `visibleB` ("Seed Visible Project B", visible), `hidden` ("Seed Hidden Project", not visible); description, 2 tags, duration, Cloudinary `imagesrc`, `desktop_icon_src`, `Github_Link` filled.
- [X] T008 [P] Create `lib/testEnvironment.ts` (Node-only, no app import): `LIVE_SUPABASE_PROJECT_REF = "nstelphunkyedurxjmey"`; `readTestEnvironment()` returns `TEST_SUPABASE_URL`, `TEST_SUPABASE_ANON_KEY`, `TEST_SUPABASE_SERVICE_ROLE_KEY`, `TEST_ADMIN_EMAIL/PASSWORD`, `TEST_USER_EMAIL/PASSWORD` and throws "Refusing to run tests: <reason>" when any is missing or the URL contains the live ref. Add `lib/testEnvironment.test.ts` (Vitest node project) for missing value, live URL, valid config. Files in `scripts/`, `supabase/seed/` and `lib/testEnvironment.ts` use only relative imports with a `.ts` extension and `import type`; no `@/` alias (they run in plain Node).
- [X] T009 Create `scripts/resetTestDatabase.ts` exporting `resetTestDatabase()` per research R2 (relative `.ts` imports only): guard via `readTestEnvironment()`; service-role client; create-or-update the admin and non-admin users (email confirmed, password from env); `delete from projects` (all rows); insert `seedProjects`; return `{ projects, users }`. When run directly, print "Seeded N projects, 2 test users".
- [X] T010 Add npm scripts in `package.json`: `test:db:reset` (run `scripts/resetTestDatabase.ts` with `.env.test.local` loaded, e.g. `node --env-file=.env.test.local --experimental-strip-types`), `dev:test` (Next dev with `.env.test.local` and `CYPRESS_COVERAGE=true`, cross-platform without new deps), `test:e2e` (`cypress run`). Verify `npm run test:db:reset` locally; also verify the guard by running once with `TEST_SUPABASE_URL` pointing at the live URL → must refuse.
- [X] T011 Update `cypress.config.ts`: load `.env.test.local`, call `readTestEnvironment()` in `setupNodeEvents` (fail fast), also fail if `process.env.NEXT_PUBLIC_SUPABASE_URL` is set and ≠ `TEST_SUPABASE_URL`; register task `resetTestDatabase`; remove task `cleanupTestProjects`; pass test credentials into `config.env` (`TEST_ADMIN_EMAIL`, `TEST_ADMIN_PASSWORD`, `TEST_USER_EMAIL`, `TEST_USER_PASSWORD`); set `retries: { runMode: 0, openMode: 0 }`.
- [X] T012 Add a global `before(() => cy.task("resetTestDatabase"))` in `cypress/support/e2e.ts`; update `cypress/support/testData.ts` to re-export `seedProjects` titles; replace `TEST_EMAIL/TEST_PASSWORD` usage in `cypress/e2e/*.cy.ts` with the new env names.
- [X] T013 Make `next.config.ts` image `remotePatterns` derive the Supabase hostname from `NEXT_PUBLIC_SUPABASE_URL` (fallback to the current live hostname) so the test project's images load; production output unchanged.

**Checkpoint**: `npm run test:db:reset` seeds the test project; Cypress refuses to start against live.

---

## Phase 3: User Story 1 – Tests never touch the live database (P1) 🎯 MVP

**Goal**: Whole suite (local + CI, incl. Lighthouse admin login) runs on the test project only.
**Independent test**: Run the full suite; live `projects` row count and latest `updated_at` equal the T002 baseline.

- [X] T014 [US1] Update `.github/workflows/main.yml` `cypress` job: env `NEXT_PUBLIC_SUPABASE_URL`/`_ANON_KEY` ← `secrets.TEST_SUPABASE_URL`/`TEST_SUPABASE_ANON_KEY`; add `TEST_SUPABASE_*`, `TEST_ADMIN_*`, `TEST_USER_*`, `ADMIN_EMAILS` ← `secrets.TEST_ADMIN_EMAIL`; remove `CYPRESS_TEST_EMAIL/PASSWORD`.
- [X] T015 [US1] Update the `lighthouse` job in `.github/workflows/main.yml` and `lighthouse-auth.js` to use the test project and `TEST_ADMIN_EMAIL/PASSWORD`: replace the `next-build` download with its own `npm run build` using `NEXT_PUBLIC_SUPABASE_*` from `TEST_SUPABASE_*` secrets and `ADMIN_EMAILS` (research R10); remove the `Upload production build` step from the `build` job if nothing else uses it.
- [X] T016 [US1] Serialise test-database use in `.github/workflows/main.yml`: job-level `concurrency: { group: test-db, cancel-in-progress: false }` on `cypress` and `lighthouse`; update the top-level comment that mentions the live database. Note in the comment: GitHub keeps one pending run per group and a newer one replaces it — acceptable.
- [X] T017 [US1] Sabotage the guard locally: point `.env.test.local` `TEST_SUPABASE_URL` at the live URL → Cypress and reset refuse with the expected message; revert; log in `verification.md`.

**Checkpoint**: MVP — no test can reach live.

---

## Phase 4: User Story 2 – Admin guard (P1)

**Goal**: The 4 mutations refuse anyone not on `ADMIN_EMAILS`; non-admin on `/admin` → `/`.
**Independent test**: Vitest guard tests + Cypress non-admin test; admin flows still pass.

- [X] T018 [P] [US2] Create `features/auth/adminEmails.ts`: `parseAdminEmails(raw: string | undefined): string[]` (split on comma, trim, lowercase, drop empties) and `isAdminEmail(email, list)`; tests in `features/auth/adminEmails.test.ts` (empty/undefined → nobody, spaces, case-insensitive).
- [X] T019 [US2] Create `features/auth/requireAdmin.ts` (`import "server-only"` if available, else a comment + server-only usage): `NotAuthorisedError`; `requireAdmin()` uses `createServer()` → `auth.getUser()`; throws when no user or email not in `parseAdminEmails(process.env.ADMIN_EMAILS)`; returns the user. Also `isCurrentUserAdmin(): Promise<boolean>`.
- [X] T020 [US2] Add `features/auth/requireAdmin.server.test.ts` (node project) covering each row of contracts/admin-guard.md (mock `@/lib/supabase/server`); the "no user" case also covers an expired session.
- [X] T021 [US2] In `features/projects/actions.ts` call `await requireAdmin()` as the first line of `createProject`, `updateProject`, `updateProjectVisibility`, `deleteProject`; reads unchanged. Add `features/projects/actions.server.test.ts` (node project): for each of the 4 actions, when the guard throws, the action rejects with `NotAuthorisedError` and no `from("projects")` call is made. Sabotage each (remove the call) → test fails; log in `verification.md`.
- [X] T022 [US2] In `app/admin/page.tsx` (or `app/admin/layout.tsx`): if a user is signed in but `!isCurrentUserAdmin()` → `redirect("/")`; signed-out behaviour unchanged.
- [X] T023 [US2] In `cypress/e2e/authorization.cy.ts` add "redirects a signed-in non-admin from /admin to the desktop": sign in with `TEST_USER_*`, visit `/admin`, assert pathname `/` and `[data-cy="desktop"]` visible and no `[data-cy="create-project"]`. Sabotage (remove the redirect) → fails; log.
- [X] T024 [US2] Add `ADMIN_EMAILS` to `.env.local` guidance in README (done in T041) and remind the maintainer of quickstart step 7 (Vercel) in the PR description draft `specs/002-reliable-e2e-test-db/pr-description.md`.

---

## Phase 5: User Story 3 – E2E audit (P2)

**Goal**: Every existing test kept/improved/removed with reason; no fixed waits, conditional skips, cross-test state.
**Independent test**: `verification.md` audit table complete; grep finds no `cy.wait(<number>)`, `$body.find`, `it.skip`.

- [X] T025 [US3] Fill "E2E audit" in `verification.md`: one row per test in `cypress/e2e/desktop.cy.ts` (8), `authorization.cy.ts` (4), `admin.cy.ts` (3) with decision + reason (user-visible outcome? duplicate? flaky pattern? depends on other test/live data?).
- [X] T026 [US3] Apply audit to `cypress/e2e/admin.cy.ts`: each test self-contained (edit/delete operate on seed rows or a project created in that test, not on the previous test's project); remove the `cleanupTestProjects` hooks; replace any long-timeout existence checks with assertions on visible results (title in list, visibility label); after each mutation reload and assert persisted state. Sabotage each changed test; log.
- [X] T027 [US3] Apply audit to `cypress/e2e/authorization.cy.ts` (use `cy.session` only if it does not hide behaviour; replace hard-coded `http://localhost:3000` with relative paths). Sabotage each changed test; log.
- [X] T028 [US3] Apply audit to `cypress/e2e/desktop.cy.ts` for existing tests (keep/improve per table). Sabotage each changed test; log.
- [X] T029 [US3] Add a CI-safe grep check to `verification.md` (manual) confirming no `cy.wait(` with a number, no `it.skip`/`describe.skip`, no `$body.find` branching in `cypress/`.

---

## Phase 6: User Story 4 – Coverage gaps (P2)

**Goal**: FR-013 flows tested. **Independent test**: each new test passes on the seed and has a sabotage entry.

- [X] T030 [P] [US4] `cypress/e2e/desktop.cy.ts`: replace the conditional project test with "opens a project window from a project .exe icon": double-click icon for `seedProjects.visibleA.title`, window shows title, description and tags; assert no icon for `seedProjects.hidden.title`. Sabotage; log.
- [X] T031 [P] [US4] New `cypress/e2e/contact.cy.ts`: intercept `POST` to `contactFormEndpoint` (import from `@/config/site` or duplicate the URL in `testData.ts`) → 200: fill name/email/message, submit, assert `messages.apps.contact` success text and form cleared, intercept called once. → 500: assert error text (`text.error`) and input kept. Register a catch-all intercept on the endpoint host that fails the test on any unexpected request. Sabotage both; log.
- [X] T032 [US4] `cypress/e2e/admin.cy.ts` error paths (research R5): intercept the server-action POST (`method POST`, header `next-action`) with 500 once for (a) save in the edit dialog → error message visible, dialog stays open, list unchanged after reload; (b) delete → `window:alert` with `deleteFailed` text, row still present; (c) visibility toggle → alert `visibilityFailed`, state unchanged after reload. If the save path has no visible error today, add one in `app/admin/_components/ProjectFormDialog.tsx` using a message from the admin messages module (admin-only, not visitor-visible). Sabotage each; log.
- [X] T033 [P] [US4] `cypress/e2e/desktop.cy.ts` start menu: open via the start button, assert menu visible with its items, close it using the close behaviour recorded in the audit (T025) and assert hidden. Add `data-cy` hooks in `components/Taskbar/Taskbar.tsx` only if missing (no visual change). Sabotage; log.
- [X] T034 [P] [US4] `cypress/e2e/desktop.cy.ts` taskbar entries: open two windows → two entries plus the startup one, active entry marked (`aria-pressed` or existing active attribute) for the front window; closing one removes its entry. Sabotage; log.
- [X] T035 [P] [US4] `cypress/e2e/desktop.cy.ts` theme after reload: choose a non-default theme, `cy.reload()`, assert `[data-cy="desktop"]` `data-theme` equals it. Sabotage (skip `localStorage.setItem`); log.
- [X] T036 [US4] For any extra gap from T025: add a test here (with sabotage) or add a backlog entry in `docs/backlog.md` with reason.

---

## Phase 7: User Story 5 – Small fixes and docs (P3)

- [X] T037 [P] [US5] F-6: rename `supebase_url` → `supabaseUrl` and `supabase_anon_key` → `supabaseAnonKey` in `lib/supabase/server.ts` (separate mechanical commit).
- [X] T038 [US5] F-15: add `.nycrc.json` (`include`: `app/**`, `components/**`, `features/**`, `lib/**`; `exclude`: tests, `cypress/**`; `all: true`; `excludeAfterRemap: true`); confirm a `CYPRESS_COVERAGE=true` build has `__coverage__` in client chunks; adjust `next.config.ts` / Cypress coverage setup if desktop files are still missing. Record before/after numbers vs T003 in `verification.md`.
- [X] T039 [US5] Update the CI "Add Cypress summary" step in `.github/workflows/main.yml` to list the new flows (contact, admin error paths, start menu, taskbar, theme reload, non-admin redirect).
- [X] T040 [P] [US5] Remove references to `cypress.env.json` / `TEST_EMAIL` from `README.md` and comments in `cypress.config.ts` (keep the local file until the maintainer removes it per quickstart step 9).
- [X] T041 [US5] Add a "Testing" section to `README.md`: table of layers (Vitest browser: components/hooks/logic/admin guard; Cypress: desktop, contact, admin flows; Lighthouse; SonarCloud), one-time setup pointing to `specs/002-reliable-e2e-test-db/quickstart.md`, and commands `npm run test:db:reset`, `npm run test:components`, `npm run dev:test` + `npm run test:e2e`; note that `ADMIN_EMAILS` must be set in `.env.local` and Vercel.

---

## Phase 8: Polish & close-out

- [X] T042 Run lint, typecheck, `npm run test:components:coverage`, `npm run build`, full `npm run test:e2e` locally; all green with retries 0.
- [ ] T043 Verify the live database is unchanged against the T002 baseline (ask the maintainer); record in `verification.md`.
- [ ] T044 Push once, open the PR to `Development` with `pr-description.md` (manual steps incl. Vercel `ADMIN_EMAILS`, sign-ups off, migration apply step); CI green once; record run link and the first Lighthouse scores on the test database (new baseline; thresholds in `lighthouserc.js` unchanged) in `verification.md`.
- [X] T045 Update `docs/backlog.md`: mark F-3, F-4, F-6, F-15 done (spec 002), add follow-ups found; update roadmap line for "003 Admin security hardening" (F-4, F-3 now done; F-5 remains).
- [ ] T046 Comment on and close issues #43, #44, #46, #53 via `gh` with a short summary and PR link (after maintainer approval of the wording).
- [ ] T047 Mark spec status Implemented in `spec.md` after merge.

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 (needs maintainer quickstart §1) → US1 → US2/US3/US4/US5 → Phase 8.
- US2 independent of US3–US5 except T023 (needs T011–T012).
- US4 T032 depends on US3 T026 (same file `admin.cy.ts`); T030/T033/T034/T035 share `desktop.cy.ts` → do sequentially with T028 despite [P] against other files.
- T038 (coverage) after US4 so numbers include new tests.

## Parallel Example

```text
After Phase 2: T018 (adminEmails) ‖ T031 (contact.cy.ts) ‖ T037 (typo rename)
```

## Implementation Strategy

1. MVP: Phase 1–3 → suite runs only against the test project.
2. Add US2 (security) → US3 audit → US4 gaps → US5 → close-out.
3. Commit per logical group locally; push once at T044.
