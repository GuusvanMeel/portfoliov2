# Research: Foundation Refactor and Backlog

All Technical Context items were known from the code review; no NEEDS CLARIFICATION remained. The
decisions below resolve the implementation choices the spec deferred to planning.

## R1 — Folder structure

- **Decision**: Routes-only `app/` with route-private `_components`; root-level `components/`
  (PascalCase folders), `features/` (lowercase, logic + data), `hooks/`, `content/`, `config/`;
  keep `lib/supabase/` and root `proxy.ts`.
- **Rationale**: Matches Next.js App Router conventions (private `_folders` are not routable) and the
  constitution's naming rules. `@/*` already maps to the repo root, so imports stay short.
- **Alternatives considered**: `src/` directory (larger move, changes every path and Sonar config,
  no extra benefit); keeping everything under `app/` (mixes routes and shared code, the current
  problem).

## R2 — Window management

- **Decision**: A pure `windowReducer(state, action)` with actions `open`, `close`, `minimize`,
  `focus`, plus a thin `useWindowManager()` hook using `useReducer`. `Desktop` only composes UI.
  Keep the current focus timing (bring to front on mouse down and after drag stop) exactly.
- **Rationale**: A pure reducer is trivially unit-testable (FR-002) and removes the stale
  `highestZIndex` closure risk without changing behaviour. Behaviour parity is guarded by the US1
  suite.
- **Alternatives considered**: Zustand or another store (new dependency, unnecessary for one
  component tree); keeping `useState` calls inside a hook (harder to test transitions in isolation).

## R3 — Theme registry

- **Decision**: `themeNames = ["Win98", "classicMac", "WinXP", "debug"] as const` in
  `features/theme/themeNames.ts`; `ThemeName` and `isThemeName` derived from it. One file per theme
  exporting a `ThemeDefinition` with groups `window`, `project`, `taskbar`, `desktop`, `controls`,
  `assets`. A typed registry `Record<ThemeName, ThemeDefinition>` guarantees completeness at compile
  time. Asset paths (`/icons/{name}/TaskbarLogo.png`, `/icons/{name}/Login.png`) move into each
  theme's `assets` with identical values, so classic Mac and debug keep their current (broken)
  images, as required by FR-024.
- **Rationale**: Adding a theme = one file + one registry line + assets; components never see theme
  names (FR-009, FR-010, SC-003).
- **Alternatives considered**: CSS variables / `data-theme` selectors (would rewrite every theme
  class and risk visual drift; possible future spec); keeping the flat object (fails FR-009).
- **Note**: Class strings are copied verbatim, including the current debug-theme
  `outline-dotted-[#00ffff]` value, to keep pixels identical; cleanup of invalid classes is a
  backlog item.

## R4 — Formatter

- **Decision**: Prettier (default config + `printWidth: 100`) with `eslint-config-prettier` to
  disable conflicting ESLint rules; `npm run format` / `format:check`; the first commit of PR 2 is
  the formatting-only commit, and its hash goes into `.git-blame-ignore-revs`.
- **Rationale**: De facto standard for Next.js/TypeScript; keeps the real refactor diff readable.
- **Alternatives considered**: Biome (would replace ESLint config too, larger change);
  `prettier-plugin-tailwindcss` (reorders class strings — useful, but adds churn; backlog item).

## R5 — Central content

- **Decision**: `content/en.ts` exports a typed, nested `as const` object grouped by feature
  (`site`, `desktop`, `taskbar`, `apps.contact`, `apps.project`, `admin`, `login`), and components
  import it directly. A `Messages` type is exported for a future `nl.ts`.
- **Rationale**: Meets FR-013 without a translation library; a future language switch only needs a
  provider that picks the object.
- **Alternatives considered**: next-intl now (forbidden until a language feature is specified,
  constitution VII); per-component text constants (scattered, fails FR-013).
- **Language**: Dutch strings (sr-only intro, metadata description, OG description, locale
  `nl_NL`) are translated. These strings are only in metadata and screen-reader text, so nothing
  visible changes; locale becomes `en_US`.

## R6 — Site configuration

- **Decision**: `config/site.ts` exports `siteUrl`, `siteName`, `contactFormEndpoint`, `githubUrl`,
  using today's literal values. `layout.tsx` metadataBase, `robots.ts` and `sitemap.ts` read
  `siteUrl`; `ContactApp` reads `contactFormEndpoint`.
- **Rationale**: One place per setting (FR-014, SC-006) with no deployment config change.
- **Alternatives considered**: Environment variables (needs Vercel and CI changes; can be layered on
  later by reading `process.env` inside `config/site.ts`).

## R7 — Desktop end-to-end tests

- **Decision**: New `cypress/e2e/desktop.cy.ts` at a fixed 1440×900 viewport, starting from a clean
  state (`cy.clearLocalStorage()`), using `data-cy` selectors (contract:
  [test-selectors.md](./contracts/test-selectors.md)). Assertions check behaviour (exists, active
  taskbar entry, z-order via computed `z-index` comparison, theme via a `data-theme` attribute on the
  desktop root), never pixel positions. Desktop tests are read-only.
- **Rationale**: Matches existing Cypress conventions (`data-cy`, `logFlowMetric`) and FR-001–003.
  `data-*` attributes are invisible (SC-002).
- **Alternatives considered**: Playwright E2E (second E2E tool); text-based selectors (break when
  content moves to `content/en.ts`).

## R8 — Guaranteed admin test cleanup

- **Decision**: All admin test data uses the title prefix `CYPRESS TEST`. A Cypress task
  `cleanupTestProjects` signs in with the admin test account via `@supabase/supabase-js` (anon key +
  password, so normal row-level security applies) and deletes rows whose title starts with the
  prefix. It runs in `before()` and `after()` of the admin suite; the `after()` hook runs even when
  a test fails, and `before()` covers aborted runs.
- **Rationale**: Satisfies FR-003a without a test database or changes to app auth.
- **Alternatives considered**: UI-driven cleanup (fails when the UI is what broke); service-role key
  (bypasses security, new secret).

## R9 — Coverage instrumentation without Babel

- **Decision**: Remove `.babelrc` and `babel.config.js`; when `CYPRESS_COVERAGE=true`,
  `next.config.ts` enables `swc-plugin-coverage-instrument` via `experimental.swcPlugins`. Normal
  builds use SWC with no instrumentation.
- **Rationale**: Any Babel config file makes Next.js drop SWC for every build, including production;
  the plugin keeps coverage working with the default compiler (FR-020).
- **Risk and fallback**: SWC plugins must match the Next.js SWC core version. If no compatible
  plugin version exists for Next 16.2, fall back to a single `babel.config.js` that is created only
  inside the CI coverage job (not committed at the root) and document why. Validated in PR 4 by
  comparing coverage reports before and after.
- **Alternatives considered**: Keeping both Babel files (duplicate config, instrumentation in
  production); dropping Cypress coverage (lowers Sonar coverage, violates SC-009).

## R10 — Pipeline

- **Decision**: Add `pull_request` (branches `Development`, `master`) to the triggers. Cypress and
  Lighthouse run for pushes to `Development`/`master` and for those pull requests. SonarCloud runs
  for the same events, without `continue-on-error`, so a failing gate fails the run (constitution
  IX). Remove commented-out cache steps and translate summaries. PR 1 already adds the PR trigger,
  E2E/Lighthouse on PRs and the blocking SonarCloud gate, so the safety net and every later PR are
  verified before merge; PR 4 only finishes the cleanup. The current gate status on `master` is
  checked first (Phase 1); if it fails, only those conditions are fixed in PR 1.
- **Rationale**: FR-021, SC-010; Spec Kit feature branches are verified before merge.
- **Alternatives considered**: Next.js build cache (`actions/cache` on `.next/cache`) — adds a
  working cache instead of removing; acceptable if measured faster, otherwise removed (FR-021
  allows both).

## R11 — Dependencies and tooling hygiene

- **Decision**: Remove `@testing-library/react` (unused); move `vitest-browser-react` to
  devDependencies; keep `puppeteer` (used by `lighthouse-auth.js`); add new root folders to
  `sonar.sources`; `.gitattributes` with `* text=auto eol=lf` plus binary rules; remove the unused
  `FpsCounter` and constant `DEBUG_*` switches in the project window (the dev-only debug badge goes
  too, as it is never visible in production).
- **Rationale**: FR-015, FR-019, FR-020.

## R12 — Backlog and GitHub sync

- **Decision**: `docs/backlog.md` in a fixed format
  ([backlog-and-github.md](./contracts/backlog-and-github.md)). Statuses are checked against the code.
  Priority labels `priority: high|medium|low`. GitHub changes are first written as a proposal
  section in the backlog document, shown to the maintainer, and only applied with `gh` after
  approval; applied changes are logged in the same document so a partial run can resume without
  duplicates.
- **Rationale**: FR-022, FR-023a, FR-023b; keeps the approval visible and auditable in the repo.
- **Alternatives considered**: GitHub Projects board (the current token has no Projects access);
  milestones per spec (possible later; not requested).

## Naming changes (FR-011)

| Current | Target |
|---|---|
| `app/Features/` | `features/` (lowercase, root) |
| `app/components/taskbar/TaskBar.tsx` | `components/Taskbar/Taskbar.tsx` |
| `app/admin/action.ts` | `app/admin/actions.ts` |
| `app/admin/admincomponents/` | `app/admin/_components/` |
| `editprojectform.tsx` / `EditProjectForm` | `ProjectFormDialog.tsx` |
| props `Onsaved`, `Onclose`, `OnCloseCreate`, `OnCreated` | `onSaved`, `onClose`, `onCloseCreate`, `onCreated` |
| `MinimizeWindow` | `minimizeWindow` (inside reducer/hook) |
| `Features/Window/type.ts`, `Features/Theme/type.ts` | `types.ts` |
| `Features/Projects/mapper.ts` | `features/projects/mappers.ts` |
| `Features/Images/actions.ts` | `features/images/imageUrls.ts` |
| `mapProjectToDisplayproject` | `mapProjectToDisplayProject` |
| `supebase_url` (lib/supabase/server.ts) | left as is: auth files untouched (FR-016) → backlog |
| `cypress/support/logflowmetric.ts` | `logFlowMetric.ts` |
