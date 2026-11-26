# Contract: Test environment

## Variables

| Name | Used by | Local source | CI source | Production |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY` | app | `.env.local` (live) for `npm run dev`; `.env.test.local` for `npm run dev:test` | test secrets in cypress + lighthouse jobs | live (Vercel) |
| `TEST_SUPABASE_URL` | reset script, Cypress | `.env.test.local` | secret `TEST_SUPABASE_URL` | – |
| `TEST_SUPABASE_ANON_KEY` | Cypress, app under test | `.env.test.local` | secret `TEST_SUPABASE_ANON_KEY` | – |
| `TEST_SUPABASE_SERVICE_ROLE_KEY` | reset script only (Node) | `.env.test.local` | secret `TEST_SUPABASE_SERVICE_ROLE_KEY` | never |
| `ADMIN_EMAILS` | app (`requireAdmin`) | `.env.test.local` (= test admin) / `.env.local` (= real admin) | secret `TEST_ADMIN_EMAIL` | Vercel env (real admin email) |
| `TEST_ADMIN_EMAIL` / `TEST_ADMIN_PASSWORD` | reset script, Cypress, Lighthouse login | `.env.test.local` | secrets | – |
| `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` | reset script, Cypress | `.env.test.local` | secrets | – |

`cypress.env.json` (TEST_EMAIL/TEST_PASSWORD) and the `ADMIN_EMAIL`/`ADMIN_PASSWORD` CI secrets are removed once replaced.

## Guard (fails fast, never falls back)

Refuse with a clear message when: any `TEST_SUPABASE_*` value is missing, or `TEST_SUPABASE_URL` contains the live project ref, or (in Cypress) `NEXT_PUBLIC_SUPABASE_URL` ≠ `TEST_SUPABASE_URL`.

## Commands

| Command | Does |
|---|---|
| `npm run test:db:reset` | guard → ensure test users → replace `projects` with seed |
| `npm run dev:test` | start the app against the test database (coverage on) |
| `npm run test:e2e` | run Cypress headless against `dev:test`; global `before` runs the reset |

## Cypress tasks

- `resetTestDatabase` → same as `npm run test:db:reset`; returns the seeded project count.
- `cleanupTestProjects` → removed (superseded by the reset).
