# Baseline: 001 Foundation Refactor

Recorded 2026-11-25 on branch `001-foundation-refactor` before any refactoring (tasks T001–T004).

## Fixes needed before a baseline was possible

- **`package-lock.json` out of sync** (commit `87866eb`): `puppeteer@25` needs `proxy-agent >=8.0.1`
  but the lockfile resolved 6.5.0. npm 11 (local) tolerated it, npm 10 (CI, Node 22) rejected it, so
  `npm ci` failed in every CI run since. Fixed in `04ea84a` by regenerating the lockfile with npm 10.
- **`AdminProject.test.tsx` failed to import** with Vitest 4.1.10 on Windows: the relative
  `vi.mock("./editprojectform")` was not applied, so the real form (and `process`-dependent code)
  loaded in the browser. Fixed by mocking via the `@/` alias and mocking all project actions.

## T001 — Static checks and component tests

| Check | Result |
|---|---|
| `npm run lint` | pass, 0 problems |
| `npm run typecheck` | pass |
| Vitest (browser, Chromium) | 1 file, 9 tests, all pass |
| Coverage (files loaded by tests) | Statements 43.41% (56/129) · Branches 42.1% (40/95) · Functions 44.11% (15/34) · Lines 43.44% (53/122) |

## T002 — Build and end-to-end tests (local)

| Check | Result |
|---|---|
| `npm run build` | pass |
| `authorization.cy.ts` — redirect to login | pass |
| `authorization.cy.ts` — fails to log in (wrong password) | pass |
| `authorization.cy.ts` — logs in | **fail locally**: `cypress.env.json` contains placeholder credentials (`test@test.com`) → "Invalid email or password". Runs in CI with the real secrets. |
| `Admin.cy.ts` (create, edit, delete) | **fail locally**, same cause (cannot log in). Runs in CI. |

Admin and login flows are therefore verified through the CI run of PR 1, not locally.

**Data note**: the database currently has **no visible projects** — the desktop shows only the
three fixed icons (Themeswitcher, about, contact). The desktop "open a project `.exe`" scenario will
skip with a log message until a visible project exists.

### Last CI run on `master` (2026-07-08, run 28982811045)

All jobs succeeded: Lint/typecheck/build, End-to-End, Lighthouse, SonarQube. Detailed logs (exact
Lighthouse scores, SonarQube step outcome) have expired and can no longer be retrieved. Thresholds
from `lighthouserc.js`: performance ≥ 0.75 (warn), accessibility ≥ 0.90 (error), best practices ≥
0.90 (warn), SEO ≥ 0.90 (warn). Fresh scores come from the first PR run.

## T003 — Reference screenshots

`baseline/` holds 12 screenshots at 1440×900, per theme (Win98, WinXP, classicMac, debug):

- `<theme>-desktop.png` — startup state (contact window open)
- `<theme>-two-windows.png` — theme switcher window opened next to the contact window
- `<theme>-start-menu.png` — start menu open

## T004 — SonarCloud quality gate

The public SonarCloud API answers "Project doesn't exist" for `GuusvanMeel_portfoliov2` (project is
private or not publicly visible). The SonarQube job on `master` succeeded on 2026-07-08, but because
the scan step used `continue-on-error: true` and its logs expired, the actual gate status cannot be
confirmed. The first PR run with the blocking gate (T005) shows the real status; if it fails, only
the failing conditions are fixed in PR 1.

## T026 — US1 verification (local, 2026-11-25)

| Check | Result |
|---|---|
| `desktop.cy.ts` (8 tests) 10× in a row against `npm start` | **10/10 green**, 0 flaky failures (SC-001) |
| Project window scenario | skipped with a log message: no visible projects in the database |
| Vitest | 3 files, 22 tests pass; covered statements 56 → 63 (percentage 43.41% → 42.56% because `ThemeProvider.tsx` is now loaded by a test) |
| Lint / typecheck | pass |
| Admin suite with forced failure + clean re-run (FR-003a) | **not run locally**: local `cypress.env.json` has placeholder credentials. Verified in the PR 1 CI run instead (cleanup task runs in `before()` and `after()`). |
| Logout test | **not run locally**, same reason; runs in CI |

## T027 — PR 1

PR 1 (GitHub #39) was merged into `Development` with the full pipeline green. The admin cleanup
(forced failure + clean re-run) and the logout test were verified in that CI run, not locally.

## T073 — US2 verification (local, 2026-11-25)

| Check | Result |
|---|---|
| Lint / typecheck / Prettier | pass |
| `next build` | pass |
| Full Cypress suite against `npm start` | **15/15 green** (admin 3, authorization 4, desktop 8) |
| Vitest | 15 files, 61 tests pass |
| Vitest coverage | Statements 72.19% (135/187) · Branches 65.54% (78/119) · Functions 77.77% (49/63) · Lines 70.28% (123/175); baseline 42.56% statements |
| Visual comparison with `baseline/` | **12/12 screenshots pixel-identical** (0 differing pixels) |
| Dummy theme scratch test (SC-003) | pass on a throwaway branch: adding a fifth theme only touched `themeNames.ts`, `themes/dummy.ts` and `themes/index.ts`; it appears in the switcher and styles its buttons |

Notes on the visual comparison:

- The database now has three visible projects (it had none when the baseline was taken). Their
  desktop icons were hidden with injected CSS during the comparison, since they are data, not code.
- Screenshots were taken with Puppeteer at 1440×900. The theme switcher window was opened with a
  bare `dblclick` event (as Cypress `dblclick()` does), matching how the baseline was made; real
  mouse clicks also select the icon, which is existing behaviour.

Deviations from tasks.md:

- `themeNames` is ordered `Win98, WinXP, classicMac, debug` (not `Win98, classicMac, WinXP, debug`)
  because the theme switcher lists themes in that order today.
- `WindowFrame.module.css` never had a `desktopIcons` rule (the class resolved to `undefined`), so
  no `Desktop.module.css` was created; the wrapper `div` simply has no class.
- The create-form test from `AdminProject.test.tsx` moved to `CreateProjectButton.test.tsx`, because
  creating a project is now handled by `CreateProjectButton`. Mock paths use the `@/` alias.
- `vitest-browser-react` stays on 2.2.0 when moved to devDependencies.

## T086 — Pipeline validation (2026-11-25)

A temporary commit changed one assertion in `cypress/e2e/desktop.cy.ts` ("opens with the contact
window active in the taskbar") so that it must fail. PR #59 run 45707957190: Lint/typecheck/build
and Lighthouse passed, **End-to-End failed** on exactly that test (1 of 8 failing), so a failing
E2E assertion fails the pipeline. The commit was reverted right after.

PR 4 was opened from `001-foundation-refactor-us4`: after `Development` was rebased on GitHub, the
original branch could only be updated with a force-push.
