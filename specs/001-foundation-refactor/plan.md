# Implementation Plan: Foundation Refactor and Backlog

**Branch**: `001-foundation-refactor` | **Date**: 2026-11-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-foundation-refactor/spec.md`

## Summary

Prepare GuusOS for future work without changing anything visitors or the maintainer see. First lock
in today's behaviour with Cypress desktop tests and component tests (US1). Then restructure the code
along the constitution: routes-only `app/`, shared components and feature modules at the root,
window management and icon selection in hooks, themes as a registry of one file per theme with
grouped settings, central English content and site config, consistent naming, dead code removed,
starting with `.gitattributes` and a Prettier formatting commit (US2). Next, write `docs/backlog.md`
from all GitHub issues checked against the code, and, after the maintainer approves a change list,
bring the GitHub issues in line (US3). Finally, replace the Babel setup with SWC-based coverage
instrumentation and run the full pipeline, including a blocking quality gate, on pull requests
(US4). Each user story is one pull request into `Development`, all from the single spec branch.
Database, authentication and all bugs stay untouched.

## Technical Context

**Language/Version**: TypeScript 5 (strict), React 19.2, Node.js 22 (CI)

**Primary Dependencies**: Next.js 16.2 (App Router, `proxy.ts`), Tailwind CSS v4, CSS modules,
`react-rnd`, `@supabase/ssr` + `@supabase/supabase-js`, `lucide-react` (admin only)

**Storage**: Supabase Postgres `projects` table and `DesktopIcons` storage bucket — **unchanged**
(FR-025); images via Cloudinary URLs

**Testing**: Vitest 4 browser mode (Playwright/Chromium) with v8 coverage; Cypress 15 with
`@cypress/code-coverage` + nyc; Lighthouse CI; SonarCloud quality gate

**Target Platform**: Modern desktop browsers; hosted on Vercel

**Project Type**: Web application (single Next.js app with public desktop, `/login`, `/admin`)

**Performance Goals**: No regression: Lighthouse performance ≥ 0.75 (warn), accessibility ≥ 0.90
(error), best practices and SEO ≥ 0.90 (warn); dragging stays smooth (no extra re-renders of all
windows while dragging one)

**Constraints**: Zero visible change (SC-002); no database or auth changes (FR-016, FR-025); no new
features or bug fixes (FR-024); GitHub changes only after maintainer approval (FR-023b); each user
story is one PR, merged only on a green pipeline (FR-026)

**Scale/Scope**: ~3.8k lines in `app/`, `lib/`, `cypress/`; ~40 source files; 4 themes; 4 window
types; 12 open GitHub issues + follow-ups

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate for this plan | Pre-design | Post-design |
|---|---|---|---|
| I. OS metaphor first | App content (About, Contact, Project) stays independent of window chrome (FR-007) | ✅ | ✅ `components/apps/*` render content only; chrome lives in `WindowFrame` |
| II. Themes are data | One theme-name source, one file per theme, no theme-name checks in components (FR-008–010) | ✅ | ✅ `features/theme/themes/*` + registry; asset paths moved into theme data |
| III. Styling responsibilities | Theme look in theme files, layout in own CSS module (FR-010) | ✅ | ✅ shared `desktopIcons` / `genericButton` styles move to their owners |
| IV. Logic separate from views | Window manager + icon selection in hooks (FR-004, FR-005) | ✅ | ✅ `useWindowManager` (pure reducer) and `useDesktopIconSelection` |
| V. Server-first data and security | Supabase only server-side; mappers; admin protected server-side | ⚠️ existing gaps | ⚠️ unchanged by explicit decision → Complexity Tracking |
| VI. Hydration-safe rendering | Server render matches client | ⚠️ #20 known gap | ⚠️ unchanged by explicit decision (FR-024) → Complexity Tracking |
| VII. English, ready for languages | English code/content, central texts, lang = en, no i18n lib (FR-011–013) | ✅ | ✅ `content/en.ts` + typed accessor |
| VIII. Accessibility and SEO | No regression; keep sr-only content | ✅ | ✅ markup preserved; Lighthouse gate in every PR |
| IX. Testing and CI | Desktop E2E + component tests first; full pipeline on PRs; no dead CI steps (FR-001–003a, FR-020–021) | ✅ | ✅ see research R7–R10 |
| X. Consistent conventions | Naming, `@/` imports (FR-011) | ✅ | ✅ target tree below |
| XI. Keep it simple | New deps justified; dead code removed (FR-015) | ✅ | ✅ only Prettier, eslint-config-prettier, swc coverage plugin (R4, R9) |

**Result**: PASS with two documented, maintainer-approved exceptions (V, VI). No unjustified
violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-foundation-refactor/
├── plan.md              # This file
├── research.md          # Phase 0: decisions R1–R12
├── data-model.md        # Phase 1: entities and types
├── quickstart.md        # Phase 1: validation guide
├── contracts/
│   ├── theme-definition.md
│   ├── app-definition.md
│   ├── content-and-config.md
│   ├── test-selectors.md
│   └── backlog-and-github.md
├── checklists/requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks, not created here)
```

### Source Code (repository root) — target after US2

```text
app/                                 # routes and route-only files
├── layout.tsx                       # metadata from config + content; lang="en"
├── page.tsx
├── globals.css
├── robots.ts / sitemap.ts           # base URL from config/site.ts
├── login/page.tsx                   # unchanged behaviour (auth untouched)
└── admin/
    ├── layout.tsx
    ├── page.tsx
    ├── actions.ts                   # was action.ts (logout)
    └── _components/                 # was admincomponents/
        ├── ProjectList.tsx
        ├── ProjectListItem.tsx      # view part of AdminProject (list/grid)
        ├── ProjectThumb.tsx
        ├── ProjectFormDialog.tsx    # was editprojectform.tsx (create + edit form)
        ├── CreateProjectButton.tsx
        └── *.test.tsx               # colocated tests

components/                          # shared UI, PascalCase folders, own CSS module each
├── Desktop/Desktop.tsx (+ .module.css)
├── DesktopIcon/
├── DraggableWindow/
├── WindowFrame/
├── Taskbar/                         # was taskbar/TaskBar.tsx
├── ThemeSwitcher/
└── apps/                            # window content, chrome-free (future mobile shell reuses)
    ├── AboutApp/
    ├── ContactApp/                  # was ContactWindow
    └── ProjectApp/                  # was ProjectWindow

features/                            # logic and data, lowercase folders
├── windows/
│   ├── appDefinitions.tsx           # was Desktop/windowDefinitions.tsx
│   ├── windowReducer.ts             # pure state transitions (+ .test.ts)
│   ├── useWindowManager.ts
│   └── types.ts
├── desktop/
│   └── useDesktopIconSelection.ts
├── theme/
│   ├── themeNames.ts                # single source of theme names + isThemeName
│   ├── themes/{win98,winXp,classicMac,debug}.ts
│   ├── themes/index.ts              # registry Record<ThemeName, ThemeDefinition>
│   ├── ThemeProvider.tsx            # same localStorage behaviour (FR-024)
│   ├── useThemeDefinition.ts
│   └── types.ts
├── projects/
│   ├── actions.ts                   # server actions; shared select helper
│   ├── mappers.ts                   # was mapper.ts (DB names stay inside)
│   └── types.ts
└── images/
    └── imageUrls.ts                 # was Images/actions.ts (not a server action)

hooks/
├── useEscapeKey.ts
└── useClickOutside.ts

content/en.ts                        # all user-facing text
config/site.ts                       # site URL, contact endpoint, social links
lib/supabase/{client,server,proxy}.ts  # unchanged (auth untouched)
proxy.ts                             # unchanged
cypress/
├── e2e/{desktop,authorization,admin}.cy.ts
└── support/{commands,e2e,logFlowMetric,testData}.ts
docs/backlog.md                      # US3
```

**Structure Decision**: Keep a single Next.js app at the repository root. `app/` only holds routes
and route-private components (`_components`). Reusable UI moves to root `components/` (PascalCase
folders, constitution X), logic and data to lowercase `features/`, generic hooks to `hooks/`, texts
to `content/`, settings to `config/`. The existing `@/*` alias maps to the root, so no tsconfig or
SonarCloud source changes beyond adding the new root folders to `sonar.sources` (R11).

## Delivery (FR-026)

| PR | User story | Contents | Merge condition |
|---|---|---|---|
| 1 | US1 Safety net | `data-cy` selectors (invisible), desktop Cypress suite, logout test, guaranteed admin test cleanup, component tests for mapper + theme names, pipeline runs E2E, Lighthouse and a blocking SonarCloud gate on PRs (so PR 1 itself is verified) | Full pipeline green incl. Sonar gate; suite green 10× locally |
| 2 | US2 Refactor | `.gitattributes` + renormalize, then Prettier format commit, then moves/renames, theme registry, hooks, content/config, login page texts, dead code, dependency fixes | All PR 1 tests green unchanged; coverage ≥ before |
| 3 | US3 Backlog | `docs/backlog.md`, proposed GitHub change list, approval, applied changes log | Maintainer approval of change list |
| 4 | US4 Tooling | SWC coverage instrumentation, Babel removal, pipeline cleanup, README | Full pipeline green |

All four pull requests come from the single branch `001-foundation-refactor` (updated from
`Development` after each merge), so the user stories run strictly in order. The branch is deleted
when the spec is finished.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| V. Data-changing server actions do not check the admin session; login runs in the browser | Maintainer decided (clarification 2026-11-25) that all auth changes go to the backlog | Fixing it here would change a sensitive flow inside a "no behaviour change" spec; recorded as backlog item (FR-017) |
| VI. Theme read from localStorage after hydration (#20) | Maintainer decided no bug fixes in this spec (FR-024) | Fixing it is a visible change; recorded as backlog item; theme code is structured so the cookie fix only touches `ThemeProvider` and `layout.tsx` |
| IX. Admin E2E tests write to the live database | Maintainer decided to keep live DB with guaranteed cleanup (FR-003a) | A separate test DB needs new infrastructure; recorded as backlog item |
