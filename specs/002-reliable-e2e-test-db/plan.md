# Implementation Plan: Reliable End-to-End Tests and a Separate Test Database

**Branch**: `002-reliable-e2e-test-db` | **Date**: 2026-11-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/002-reliable-e2e-test-db/spec.md`

## Summary

Move every test that touches data (Cypress, and the Lighthouse admin login) onto a separate,
free-tier Supabase project that is rebuilt from committed SQL migrations and reset to a committed
seed before every end-to-end run. Add a server-side admin check (signed-in user on an email
allowlist) to the four project mutations. Audit the Cypress suite, remove flaky patterns and
conditional skips, add the missing flows (project window, contact form, admin error paths, start
menu, taskbar, theme after reload), sabotage every new or changed test, fix F-6 and F-15, and add
a testing section to the README. Visitors see no change.

## Technical Context

**Language/Version**: TypeScript 5 (strict), Node.js 22
**Primary Dependencies**: Next.js 16 (App Router), React 19, `@supabase/ssr`, `@supabase/supabase-js`, Cypress 15 + `@cypress/code-coverage`, Vitest 4 browser mode — no new dependencies
**Storage**: Supabase Postgres (`projects` table, Supabase Auth); live project for production, new test project for all tests
**Testing**: Vitest in two groups — `browser` (components, hooks, pure logic, as today) and `node` (server-only logic: env guard, `requireAdmin`, project actions; files `*.server.test.ts`) — Cypress (E2E), Lighthouse CI, SonarCloud (non-blocking)
**Target Platform**: Vercel (production), GitHub Actions ubuntu-latest (CI), Windows (maintainer's local machine)
**Project Type**: Web application (single Next.js project)
**Performance Goals**: No regression in Lighthouse scores; E2E suite stays within the current CI time budget (+ seed reset of a few seconds)
**Constraints**: No visible change for visitors; no schema change on the live database; push as rarely as possible (batch commits); retries disabled in Cypress
**Scale/Scope**: 3 existing spec files / 14 tests; ~10 new tests; 4 server actions; 1 migration; 1 seed

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. OS metaphor first | Pass | No user-facing feature added. |
| II. Themes are data | Pass | Theme test reads the theme via `data-theme`; no component branching. |
| III. Styling responsibilities | Pass | No styling changes. |
| IV. Logic separate from views | Pass | Admin check lives in a server-only module `features/auth/requireAdmin.ts`; actions call it. |
| V. Server-first data and security | Pass — this spec closes a gap | Every mutation gets an auth check (FR-007). Service-role key used only by the Node-side reset script and Cypress task, never in the app bundle. |
| VI. Hydration-safe rendering | Pass (unchanged) | Theme still restored from localStorage after hydration; moving it to a cookie is a visible/behaviour change tracked in #20, out of scope. The E2E test asserts the restored theme, not the first server render. |
| VII. English | Pass | |
| VIII. Accessibility/SEO | Pass | No markup change visible to visitors; Lighthouse gate stays. |
| IX. Testing & CI | Pass — this spec implements "run against an environment intended for testing"; the node Vitest group extends (does not replace) browser-mode tests, only for server-only code that cannot run in a browser | Every new/changed E2E test sabotaged and logged in `verification.md`; admin guard gets Vitest tests that fail without the check. |
| X. Conventions | Pass | Plural collection files, `@/` imports. |
| XI. Keep it simple | Pass | No new dependency (reset script uses existing `@supabase/supabase-js`; no Supabase CLI). |
| Tech constraints: SQL migrations committed + manual apply step documented | Pass | `supabase/migrations/*.sql` + steps in [quickstart.md](./quickstart.md). |

No violations → Complexity Tracking empty.

## Project Structure

### Documentation (this feature)

```text
specs/002-reliable-e2e-test-db/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1: schema, seed, env/secrets
├── quickstart.md        # Phase 1: maintainer setup steps + how to validate
├── contracts/
│   ├── admin-guard.md   # Behaviour contract of the 4 guarded actions
│   └── test-environment.md  # Env vars, guard rules, reset command, Cypress tasks
├── verification.md      # Created during implement: audit table, sabotage log
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
supabase/
├── migrations/
│   └── 0001_initial_schema.sql   # projects table, updated_at, RLS policies, storage bucket refs
└── seed/
    └── projects.ts               # seed rows (visible, hidden); shared with Cypress testData

scripts/
└── resetTestDatabase.ts          # guard + recreate test users + replace projects with seed (run via `npm run test:db:reset`)

lib/
├── testEnvironment.ts            # env guard (plain Node, relative imports only)
└── testEnvironment.test.ts

vitest.config.ts                  # two projects: browser + node

features/auth/
├── adminEmails.ts                # parse ADMIN_EMAILS allowlist (pure, unit-tested)
├── adminEmails.test.ts
├── requireAdmin.ts               # server-only: getUser() + allowlist; throws NotAuthorisedError
└── requireAdmin.server.test.ts

features/projects/actions.ts      # createProject/updateProject/updateProjectVisibility/deleteProject call requireAdmin() first
app/admin/_components/            # existing alert() error paths reused; save path gets an error message if missing
lib/supabase/server.ts            # F-6 rename supebase_url → supabaseUrl
next.config.ts                    # image hostname derived from NEXT_PUBLIC_SUPABASE_URL (test project images load); F-15 coverage fix
cypress.config.ts                 # resetTestDatabase task, live-DB guard, retries 0
cypress/e2e/
├── desktop.cy.ts                 # audited; project window no longer conditional; start menu, taskbar, theme reload
├── contact.cy.ts                 # new: success + failure with cy.intercept
├── admin.cy.ts                   # audited; self-contained tests; error paths via intercepted server action
└── authorization.cy.ts           # audited; non-admin is refused
cypress/support/testData.ts       # imports seed so tests reference seed titles
.github/workflows/main.yml        # TEST_* secrets for cypress + lighthouse jobs; concurrency group shared on the test DB
README.md                         # Testing section
docs/backlog.md                   # F-3, F-4, F-6, F-15 marked done; new follow-ups
```

**Structure Decision**: Single Next.js project; new top-level `supabase/` for schema and seed, new `features/auth/` for the admin guard, reset script in existing `scripts/`.

## Phase overview (for /speckit-tasks)

1. **Foundation (blocks everything)**: migration + seed + reset script + env guard + Cypress task; maintainer manual steps (quickstart §1).
2. **US2 admin guard**: `adminEmails`, `requireAdmin`, wire into 4 actions; Vitest tests; E2E non-admin refusal.
3. **US3 audit**: write audit table in `verification.md`; apply keep/improve/remove; remove conditional skip and any fixed waits; Cypress `retries: 0`.
4. **US4 gaps**: new tests per FR-013; each sabotaged and logged.
5. **US5**: F-6 rename, F-15 coverage, README section.
6. **Close-out**: CI green once, backlog + issues #43 #44 #46 #53 updated.

## Complexity Tracking

None.
