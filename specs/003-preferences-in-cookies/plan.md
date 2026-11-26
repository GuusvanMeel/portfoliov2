# Implementation Plan: Theme and Admin View Preferences in Cookies

**Branch**: `003-preferences-in-cookies` | **Date**: 2026-11-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/003-preferences-in-cookies/spec.md`

## Summary

Store the theme (issue #20) and the admin list/grid view (issue #22) in cookies. The root layout
and the admin page read and validate the cookies on the server and pass the values as initial
state, so the first server render matches what the visitor sees. A visitor without a theme cookie
but with a valid legacy localStorage theme is migrated once (cookie written, localStorage key
removed). Invalid values fall back to WinXP / list. Theme switcher and theme buttons are unchanged.

## Technical Context

**Language/Version**: TypeScript 5 (strict), Node.js 22
**Primary Dependencies**: Next.js 16 (App Router, `cookies()` from `next/headers`), React 19 — no new dependencies
**Storage**: Browser cookies `theme` and `admin-view`; no database change
**Testing**: Vitest browser project (pure cookie/migration/view-mode helpers), Cypress E2E (raw server HTML via `cy.request`, migration, fallback, admin view), Lighthouse CI
**Target Platform**: Vercel (production), GitHub Actions (CI), Windows (local)
**Project Type**: Web application (single Next.js project)
**Performance Goals**: No Lighthouse regression; no extra network requests on theme change
**Constraints**: No other visible change for visitors; English only; push as rarely as possible
**Scale/Scope**: 2 cookies, ~3 new small modules, 4 changed files, ~5 new/changed E2E tests

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. OS metaphor | Pass | No new UI; switcher and buttons unchanged |
| II. Themes are data | Pass | Validation reuses `themeNames`/`isThemeName`; no component branches on a theme name |
| III. Styling responsibilities | Pass | Admin view classes unchanged; only a `data-view` attribute added |
| IV. Logic separate from views | Pass | Cookie parsing, writing and migration live in pure modules, not components |
| V. Server-first data | Pass | No Supabase change; cookies hold no personal data or secrets |
| VI. Hydration-safe rendering | Pass — this spec implements it | Preferences move to cookies; localStorage no longer decides markup |
| VII. English | Pass | |
| VIII. Accessibility/SEO | Pass | `aria-pressed` kept; Lighthouse checked |
| IX. Testing | Pass | Vitest + Cypress listed; each E2E test sabotaged and logged in `verification.md` |
| X. Conventions | Pass | Kebab/camel naming per existing modules |

**Post-design re-check**: Pass, no violations; Complexity Tracking not needed.

## Project Structure

### Documentation (this feature)

```text
specs/003-preferences-in-cookies/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/preference-cookies.md
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
lib/
├── preferenceCookie.ts            # new: readPreference, preferenceCookieString, writePreferenceCookie
└── preferenceCookie.test.ts       # new
features/theme/
├── ThemeProvider.tsx              # changed: initialTheme + hasThemeCookie props, cookie write, migration
├── themeMigration.ts              # new: migrateLegacyTheme
└── themeMigration.test.ts         # new
features/admin/
├── viewMode.ts                    # new: viewModes, isViewMode, defaultViewMode
└── viewMode.test.ts               # new
app/
├── layout.tsx                     # changed: read theme cookie, pass to ThemeProvider
└── admin/
    ├── page.tsx                   # changed: read admin-view cookie, pass initialView
    └── _components/ProjectList.tsx  # changed: initialView prop, data-view, cookie write
cypress/e2e/
├── desktop.cy.ts                  # changed: first-render check, migration, invalid cookie
└── admin.cy.ts                    # changed: admin view survives reload
docs/backlog.md                    # updated at the end; issues #20 and #22 updated/closed
```

**Structure Decision**: Single Next.js project, following the existing `lib/`, `features/` and
`app/` layout. See [research.md](./research.md) for decisions and
[contracts/preference-cookies.md](./contracts/preference-cookies.md) for interfaces.
