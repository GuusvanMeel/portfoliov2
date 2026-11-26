# Verification: Theme and Admin View Preferences in Cookies

## Local results (2026-11-26)

- Typecheck, lint, Prettier: pass.
- Vitest: 19 files / 110 tests pass (new: `lib/preferenceCookie.test.ts`,
  `features/theme/themeMigration.test.ts`, `features/admin/viewMode.test.ts`; extended
  `features/theme/themeNames.test.ts`).
- `npm run build:test`: pass. `/` and `/admin` were already dynamic; `/login` and `/_not-found`
  are now rendered per request too, because the root layout reads the theme cookie.
- Cypress against `build:test` + `start:test`: 31/31 pass (admin 9, authorization 5, contact 2,
  desktop 15).
- The first E2E attempt failed in every spec's `resetTestDatabase` hook: the test project had no
  `projects` table after the uuid migration fix (1beab09). The maintainer re-ran
  `supabase/migrations/0001_initial_schema.sql` in the test project; no code change was needed.

## Sabotage log

Each sabotage was a temporary code change, followed by a fresh `build:test` and a Cypress run of the
affected specs. The code was restored afterwards and the full suite passed again (31/31).

| Run | Sabotage | Tests that failed (as intended) |
|-----|----------|---------------------------------|
| A | `app/layout.tsx` ignores the cookie and always renders `defaultTheme` | keeps the chosen theme after a page reload, from the first server render; renders a saved theme without hydration errors; moves a theme from localStorage to the cookie once (server HTML check); keeps the cookie theme when localStorage holds another one |
| B | `readPreference` returns the raw cookie value without the fallback | falls back to WinXP for an invalid theme cookie; falls back to the list view for an invalid view cookie |
| C | Server renders the default; `ThemeProvider` reads `document.cookie` in its `useState` initializer, so server and client markup differ | renders a saved theme without hydration errors (React threw minified error #177 during hydration), plus the other theme tests that check the server HTML |
| D | `migrateLegacyTheme` keeps the localStorage key; `ThemeProvider` runs the move even with a cookie; `app/admin/page.tsx` ignores the `admin-view` cookie | moves a theme from localStorage to the cookie once (`expected 'classicMac' to be null`); remembers the grid view after a reload, from the first server render |
| D (finding) | — | "keeps the cookie theme when localStorage holds another one" **did not fail**: its checks passed on the server HTML before the browser effect switched the theme. The test now opens the About window first (which proves the page is interactive and effects have run) and also checks that localStorage is left untouched. |
| E | `ThemeProvider` runs the move even with a cookie (re-run after the test fix) | keeps the cookie theme when localStorage holds another one |

## Lighthouse baseline vs result

Baseline: CI run 45727957009 (commit 1beab09, same app code as `Development` before this spec).

| URL | Performance | Accessibility | Best practices | SEO |
|-----|---:|---:|---:|---:|
| home | 98 | 100 | 100 | 100 |
| /login | 100 | 100 | 100 | 66 |
| /admin | 100 | 96 | 100 | 69 |

Result: _pending the CI run on the PR_ (local Lighthouse scores are not comparable to CI).

## Hydration warnings check

Covered by "renders a saved theme without hydration errors" in `cypress/e2e/desktop.cy.ts`. It
passes on the real code and failed under sabotage C.

## Manual quickstart scenarios

Run by hand by the maintainer on `npm run dev` (2026-11-26):

- Scenarios 1, 2, 3 and 5: pass.
- Scenario 4 (admin view): pass, after adding `ADMIN_EMAILS` to `.env.local`. First attempt
  failed — `/admin` sent the maintainer back to the desktop. Cause:
  `.env.local` (used by `npm run dev`) has no `ADMIN_EMAILS`, so since spec 002 nobody counts as
  admin and a signed-in user on `/admin` is redirected to `/` (an earlier login session skips the
  login page). Not caused by spec 003; step 7 of `specs/002-reliable-e2e-test-db/quickstart.md`.
  Scenario 4 is covered by the admin E2E tests (which use the test environment's `ADMIN_EMAILS`).
