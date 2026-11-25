---

description: "Task list for 001 Foundation Refactor and Backlog"
---

# Tasks: Foundation Refactor and Backlog

**Input**: Design documents from `specs/001-foundation-refactor/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Requested by the spec (US1 is the safety net; FR-001–FR-003a, constitution IX). Test tasks
are included and come before the code they protect.

**Organization**: One phase per user story; each user story is one pull request into `Development`
(FR-026), in the order US1 → US2 → US3 → US4. Within a PR, each task or small group of tasks is one
revertible commit.

**Branch**: All work for this spec happens on the single branch `001-foundation-refactor`. Each pull
request is opened from that branch into `Development` once the user story is complete; after it is
merged, work continues on the same branch (update it from `Development` first). The branch is
deleted when the spec is finished. Because there is one branch, the user stories are done strictly one
after another.

**Global rules for every task**

- Zero visible change for visitors and the maintainer (SC-002); no database, authentication or bug
  changes (FR-016, FR-024, FR-025). Do not change `lib/supabase/*` or `proxy.ts`. `app/login/page.tsx`
  may be refactored like any other page, as long as sign-in works exactly the same.
- Copy Tailwind class strings and visible English texts verbatim when moving them.
- After each task: `npm run lint`, `npm run typecheck`, `npm run test:components`; after each PR
  phase: the full Cypress suite as in [quickstart.md](./quickstart.md).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story the task belongs to (US1–US4)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Baseline so every later step can be compared against today's behaviour

- [X] T001 Record the baseline: run `npm run lint`, `npm run typecheck`, `npm run test:components:coverage` and note the Vitest coverage summary in `specs/001-foundation-refactor/baseline.md`
- [X] T002 Build and start the app (`npm run build`, `npm start`), run `npx cypress run`, and record pass/fail per spec plus the Lighthouse scores from the last CI run on `Development` in `specs/001-foundation-refactor/baseline.md`
- [X] T003 [P] Take reference screenshots of the desktop in each theme (Win98, WinXP, classicMac, debug) with the contact window open, a project window open and the start menu open, and save them in `specs/001-foundation-refactor/baseline/` for visual comparison after US2
- [X] T004 Check the current SonarCloud quality gate for `master` (sonarcloud.io dashboard `GuusvanMeel_portfoliov2`); record its status and any failing conditions in `specs/001-foundation-refactor/baseline.md`. If it fails, fixing only those conditions (without behaviour changes) becomes part of PR 1

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Make sure the pull request for US1 is itself verified end to end

**⚠️ CRITICAL**: US1 work starts only after this phase

- [X] T005 Add a `pull_request` trigger for branches `Development` and `master` to `.github/workflows/main.yml`, and extend the `if:` conditions of the `cypress` and `lighthouse` jobs so they also run for those pull request events; let the `sonarqube` job run for pushes to `Development`/`master` and their pull requests and remove its `continue-on-error: true`, so a failing quality gate fails the run (constitution IX). The rest of the pipeline cleanup is US4

**Checkpoint**: Pull requests into `Development` run lint, typecheck, component tests, build, Cypress, Lighthouse and a blocking SonarCloud quality gate

---

## Phase 3: User Story 1 - Current behaviour is locked in by automated tests (Priority: P1) 🎯 MVP

**Goal**: Desktop behaviour and admin flows are covered by automated tests that pass on today's code, and admin tests never leave test data behind.

**Independent Test**: `npx cypress run --spec cypress/e2e/desktop.cy.ts` passes 10 times in a row on the unmodified UI; aborting the admin suite and re-running removes leftover `CYPRESS TEST` projects; `npm run test:components` passes.

**Delivery**: PR 1 → `Development`

### Test hooks (invisible markup only)

- [X] T006 [P] [US1] Add `data-cy="desktop"` and `data-theme={theme}` to the desktop root `div` in `app/components/Desktop/Desktop.tsx` (per [test-selectors.md](./contracts/test-selectors.md))
- [X] T007 [P] [US1] Add `data-cy="desktop-icon"` and `data-icon-id={id}` to the button in `app/components/ui/DesktopIcon.tsx`
- [X] T008 [P] [US1] Add `data-cy="window"`, `data-window-type` and `data-window-id` to the window root, and `data-cy="window-minimize"` / `data-cy="window-close"` to the control buttons in `app/components/windows/WindowFrame.tsx`; pass the two values in as new optional props from `app/components/Desktop/Desktop.tsx`
- [X] T009 [P] [US1] Add `data-cy="taskbar"` to the footer, `data-cy="taskbar-entry"` with `data-window-id` and `data-active` to each window item, and `data-cy="taskbar-entry-close"` to its close button in `app/components/taskbar/TaskBar.tsx`
- [X] T010 [P] [US1] Add `data-cy="theme-option"` and `data-theme-option={themeName}` to each theme button in `app/components/ui/ThemeSwitcher.tsx`

### Desktop end-to-end tests

- [X] T011 [US1] Create `cypress/e2e/desktop.cy.ts` with a `beforeEach` that sets the viewport to 1440×900, clears local storage and visits `/`; add test "startup contact window is open and active in the taskbar"
- [X] T012 [US1] Add test "double-clicking a desktop icon opens its window in front and makes it the active taskbar entry" for the `about.exe` icon in `cypress/e2e/desktop.cy.ts` (spec US1 scenario 1)
- [X] T013 [US1] Add test "clicking a window behind brings it to the front": open two windows, click the back one's title bar, assert its computed `z-index` is higher and its taskbar entry has `data-active="true"` in `cypress/e2e/desktop.cy.ts` (scenario 2)
- [X] T014 [US1] Add test "minimize hides the window; clicking its taskbar entry restores it in front" in `cypress/e2e/desktop.cy.ts` (scenario 3)
- [X] T015 [US1] Add tests "close via window button" and "close via taskbar entry" asserting the window and its taskbar entry disappear in `cypress/e2e/desktop.cy.ts` (scenario 4)
- [X] T016 [US1] Add test "choosing each theme updates `data-theme` and the taskbar tray text" iterating over all `theme-option` buttons in `cypress/e2e/desktop.cy.ts` (scenario 5)
- [X] T017 [US1] Add test "double-clicking a visible project's `.exe` icon opens a projects window showing its title" in `cypress/e2e/desktop.cy.ts`, skipping with a clear log message when no project icon exists (scenario 6, edge case "zero visible projects")
- [X] T018 [US1] Add `logFlowMetric` calls to each desktop test, matching the existing pattern in `cypress/support/logflowmetric.ts`, and add "Desktop" flows to the Cypress summary step in `.github/workflows/main.yml`

### Guaranteed admin test cleanup (FR-003a)

- [X] T019 [US1] Add `@supabase/supabase-js`-based task `cleanupTestProjects` to `setupNodeEvents` in `cypress.config.ts`: sign in with `TEST_EMAIL`/`TEST_PASSWORD` using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, delete rows from `projects` whose `title` starts with `CYPRESS TEST`, return the number deleted (research R8)
- [X] T020 [US1] Create `cypress/support/testData.ts` exporting `TEST_PROJECT_PREFIX = 'CYPRESS TEST'` and the test project values currently inlined in `cypress/e2e/Admin.cy.ts`; translate the Dutch test description and duration to English
- [X] T021 [US1] In `cypress/e2e/Admin.cy.ts` import from `cypress/support/testData.ts`, call `cy.task('cleanupTestProjects')` in `before()` and `after()`, and rename the suite from `'template spec'` to `'Admin project management'`
- [X] T022 [US1] Add test "logout returns to the home page and `/admin` redirects to `/login` again" to `cypress/e2e/authorization.cy.ts`: log in, click Logout, assert the URL is `/`, visit `/admin`, assert the URL contains `/login` (SC-007)
- [X] T023 [US1] Pass `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the Cypress task environment (Cypress config `env` or `process.env`) in `cypress.config.ts` and confirm the `cypress` job in `.github/workflows/main.yml` already exposes them

### Component tests for existing logic

- [X] T024 [P] [US1] Create `app/Features/Projects/mapper.test.ts` covering `mapProjectRowToProject` (all fields; `tags: null` → `[]`), `mapUpdateProjectInputToRow` (DB names `imagesrc`, `Github_Link`, `is_visible`; `updated_at` is an ISO string) and `mapProjectToDisplayproject` (drops `isVisible` and `updatedAt`)
- [X] T025 [P] [US1] Export the existing `isThemeName` from `app/Features/Theme/ThemeProvider.tsx` (no behaviour change) and create `app/Features/Theme/ThemeProvider.test.tsx` covering: accepts `Win98`, `classicMac`, `WinXP`, `debug`; rejects `null`, `""`, `"winxp"`, `"Vista"`

### Verification

- [X] T026 [US1] Run `desktop.cy.ts` 10 times locally against `npm start` and the admin suite once with a forced failure after project creation followed by a clean re-run; record results in `specs/001-foundation-refactor/baseline.md` (SC-001, FR-003a)
- [X] T027 [US1] Open PR 1 from `001-foundation-refactor` into `Development` (it also carries the spec documents); confirm all pipeline stages ran and passed

**Checkpoint**: Safety net in place; every later change is checked by it

---

## Phase 4: User Story 2 - The maintainer works in a clean, best-practice codebase (Priority: P1)

**Goal**: The codebase follows the constitution: clear responsibilities, theme registry, consistent naming, English, central content and config, no dead code. Nothing visible changes.

**Independent Test**: All US1 tests pass unchanged; coverage ≥ baseline; visual comparison with `baseline/` screenshots shows no difference; the checks in [quickstart.md](./quickstart.md) for PR 2 pass.

**Delivery**: PR 2 → `Development` (starts after PR 1 is merged)

### Formatting first (research R4)

- [X] T028 [US2] Create `.gitattributes` with `* text=auto eol=lf` and `binary` rules for `*.png *.jpg *.jpeg *.gif *.ico *.webp`; run `git add --renormalize .` and commit it on its own, before any formatting (FR-019)
- [X] T029 [US2] Add `prettier` and `eslint-config-prettier` as devDependencies, create `.prettierrc.json` (`{ "printWidth": 100, "endOfLine": "lf" }`) and `.prettierignore` (`.next`, `coverage`, `node_modules`, `public`, `.specify`, `specs`, `lhci-*`, `cypress/results`), add `eslint-config-prettier` last in `eslint.config.mjs`, and add scripts `format` and `format:check` to `package.json`
- [X] T030 [US2] Run `npm run format` over the whole repository as a formatting-only commit, then add that commit hash to a new `.git-blame-ignore-revs`

### Shared hooks, content and config

- [X] T031 [P] [US2] Create `hooks/useEscapeKey.ts` (`useEscapeKey(onEscape: () => void)` registering a `keydown` listener on `window`) and `hooks/useClickOutside.ts` (`useClickOutside(target: RefObject<HTMLElement | null> | string, onOutside, eventType: 'mousedown' | 'pointerdown')`, where a string is a CSS selector: a click counts as outside when the event target is not inside an element matching it), plus `hooks/useEscapeKey.test.tsx` and `hooks/useClickOutside.test.tsx`
- [X] T032 [P] [US2] Create `config/site.ts` with `siteUrl = "https://portfoliov2-brown-theta.vercel.app"`, `siteName = "GuusOS Portfolio"`, `contactFormEndpoint` (the current Formspree URL from `app/components/ContactWindow/ContactWindow.tsx`) and `githubUrl = "https://github.com/GuusvanMeel"` (per [content-and-config.md](./contracts/content-and-config.md))
- [X] T033 [P] [US2] Create `content/en.ts` exporting `messages` (`as const`) and `type Messages`, with groups `site`, `desktop`, `taskbar`, `apps.themeSwitcher`, `apps.about`, `apps.contact`, `apps.project`, `admin`, `login`; copy every visible English string verbatim from the components and translate the Dutch metadata and sr-only strings from `app/layout.tsx` and `app/page.tsx` (research R5)

### Theme registry (research R3, contract theme-definition.md)

- [X] T034 [US2] Create `features/theme/themeNames.ts` with `export const themeNames = ["Win98", "classicMac", "WinXP", "debug"] as const`, `type ThemeName`, `isThemeName(value: string | null): value is ThemeName` derived from the list, and `defaultTheme: ThemeName = "WinXP"`; move the test from T025 to `features/theme/themeNames.test.ts`
- [X] T035 [US2] Create `features/theme/types.ts` with `ThemeDefinition` exactly as in [theme-definition.md](./contracts/theme-definition.md) (groups `window`, `controls`, `project`, `taskbar`, `desktop`, `assets`; every field required)
- [X] T036 [P] [US2] Create `features/theme/themes/win98.ts` mapping the `Win98` entry of `app/Features/Window/windowThemes.ts` to `ThemeDefinition` (field mapping per [data-model.md](./data-model.md)), with `assets.taskbarLogo = "/icons/Win98/TaskbarLogo.png"` and `assets.loginIcon = "/icons/Win98/Login.png"`
- [X] T037 [P] [US2] Create `features/theme/themes/winXp.ts` for the `WinXP` entry, with assets `/icons/WinXP/TaskbarLogo.png` and `/icons/WinXP/Login.png`
- [X] T038 [P] [US2] Create `features/theme/themes/classicMac.ts` for the `classicMac` entry, with assets `/icons/classicMac/TaskbarLogo.png` and `/icons/classicMac/Login.png` (paths kept identical to today even though the files do not exist; FR-024)
- [X] T039 [P] [US2] Create `features/theme/themes/debug.ts` for the `debug` entry, copying class strings verbatim (including `outline-dotted-[#00ffff]`), with assets `/icons/debug/TaskbarLogo.png` and `/icons/debug/Login.png`
- [X] T040 [US2] Create `features/theme/themes/index.ts` exporting `themes: Record<ThemeName, ThemeDefinition>`
- [X] T041 [US2] Move `app/Features/Theme/ThemeProvider.tsx` to `features/theme/ThemeProvider.tsx`, importing `isThemeName` and `defaultTheme` from `themeNames.ts`; keep the localStorage read in `useEffect` exactly as it is (FR-024); translate the Dutch comment
- [X] T042 [US2] Create `features/theme/useThemeDefinition.ts` returning `{ name, definition }` for the active theme via `useTheme()` and `themes`

### Window management and desktop selection (research R2)

- [X] T043 [US2] Create `features/windows/types.ts` with `AppType`, `WindowState`, `WindowManagerState` and the action union per [data-model.md](./data-model.md)
- [X] T044 [US2] Create `features/windows/windowReducer.ts` implementing `open`, `focus`, `minimize`, `close` with exactly the transitions in the data-model table (initial state: one `contact` window with id `Contact-startup`, `zIndex: 0`, active `Contact-startup`, `highestZIndex: 1`; `open` of `projects` without a project throws "Project window requires a project")
- [X] T045 [US2] Create `features/windows/windowReducer.test.ts` covering each transition, active-window clearing on minimize/close, z-order after repeated focus, and the projects-without-project error (FR-002)
- [X] T046 [US2] Create `features/windows/useWindowManager.ts` wrapping the reducer with `useReducer` and exposing `windows`, `activeWindowId`, `openWindow`, `focusWindow`, `minimizeWindow`, `closeWindow`; add `features/windows/useWindowManager.test.tsx`
- [X] T047 [US2] Create `features/desktop/useDesktopIconSelection.ts` (selected id, `select`, clears on `pointerdown` outside `[data-desktop-icon]` by reusing `hooks/useClickOutside.ts` with the selector `[data-desktop-icon]` and event type `'pointerdown'`) and `features/desktop/useDesktopIconSelection.test.tsx`

### Move components to their target locations (plan: Source Code)

- [X] T048 [US2] Move `app/components/windows/WindowFrame.tsx` + `WindowFrame.module.css` to `components/WindowFrame/`; use `useThemeDefinition()` (`definition.window.*`, `definition.controls.windowButton`, `definition.controls.closeButton`); move the `desktopIcons` and `genericButton` rules out of `WindowFrame.module.css` to the components that use them (T050, T052)
- [X] T049 [US2] Move `app/components/windows/DraggableWindow.tsx` to `components/DraggableWindow/DraggableWindow.tsx`, using `definition.window.dragging`; keep all `Rnd` props and focus timing identical
- [X] T050 [US2] Move `app/components/ui/DesktopIcon.tsx` + `.module.css` to `components/DesktopIcon/`; create `components/Desktop/Desktop.module.css` holding the `desktopIcons` layout rule moved from `WindowFrame.module.css`
- [X] T051 [US2] Move `app/components/taskbar/TaskBar.tsx` + `TaskBar.module.css` to `components/Taskbar/Taskbar.tsx` + `Taskbar.module.css`; read classes from `definition.taskbar.*`, icon paths from `definition.assets.taskbarLogo` / `loginIcon`, texts from `content/en.ts`; replace the inline click-outside effect with `useClickOutside(ref, close, 'mousedown')`
- [X] T052 [US2] Move `app/components/ui/ThemeSwitcher.tsx` to `components/ThemeSwitcher/ThemeSwitcher.tsx` with its own `ThemeSwitcher.module.css` containing the `genericButton` rule; list themes from `themeNames`, classes from `definition.controls.button`, label text from `content/en.ts`
- [X] T053 [P] [US2] Move `app/components/ContactWindow/*` to `components/apps/ContactApp/ContactApp.tsx` + `ContactApp.module.css`; endpoint from `config/site.ts`, texts from `content/en.ts`, classes from `definition.project.*` / `definition.controls.button`
- [X] T054 [P] [US2] Move `app/components/ProjectWindow/*` to `components/apps/ProjectApp/ProjectApp.tsx` + `ProjectApp.module.css`; remove the constant `DEBUG_*` switches, the dev-only debug badge and its CSS (research R11), keep the visible Landscape/Block/Mobile buttons unchanged, texts from `content/en.ts`
- [X] T055 [P] [US2] Create `components/apps/AboutApp/AboutApp.tsx` rendering the current placeholder text from `content/en.ts` (unchanged visible output)
- [X] T056 [US2] Move `app/components/Desktop/windowDefinitions.tsx` to `features/windows/appDefinitions.tsx` following [app-definition.md](./contracts/app-definition.md) (`startPos` → `startPosition`, titles and labels from `content/en.ts`, renders the `components/apps/*` and `ThemeSwitcher`); keep widths, heights and glyphs identical
- [X] T057 [US2] Move `app/components/Desktop/Desktop.tsx` to `components/Desktop/Desktop.tsx`, using `useWindowManager`, `useDesktopIconSelection`, `appDefinitions` and `useThemeDefinition`; remove all window state and the Dutch marker comments; fix import order; keep the always-visible `ThemeSwitcher` and all `data-cy` attributes
- [X] T058 [US2] Update `app/page.tsx` and `app/layout.tsx` to the new import paths; `layout.tsx` uses `config/site.ts` and `content/en.ts` for metadata, `lang="en"` and `openGraph.locale = "en_US"`; `page.tsx` sr-only text from `content/en.ts`
- [X] T059 [P] [US2] Update `app/robots.ts` and `app/sitemap.ts` to use `siteUrl` from `config/site.ts`
- [X] T060 [P] [US2] Refactor `app/login/page.tsx` like the other pages: take all user-facing strings ("Admin login", "Email", "Password", "Invalid email or password.", "Logging in...", "Login") from `messages.login.*` in `content/en.ts`, apply naming and import conventions; keep the sign-in behaviour itself identical (same Supabase call, same redirect to `/admin`)

### Data and image helpers

- [X] T061 [US2] Move `app/Features/Projects/types.ts` to `features/projects/types.ts` (translate Dutch comments) and `mapper.ts` to `features/projects/mappers.ts`, renaming `mapProjectToDisplayproject` → `mapProjectToDisplayProject`; move `mapper.test.ts` (T024) along to `features/projects/mappers.test.ts`
- [X] T062 [US2] Move `app/Features/Projects/actions.ts` to `features/projects/actions.ts`; extract a shared `selectProjects(filter?)` used by `getAllProjects` and `getVisibleProjects` (FR-006); keep all queries, ordering, error messages and the absence of auth checks identical (FR-016)
- [X] T063 [P] [US2] Move `app/Features/Images/actions.ts` to `features/images/imageUrls.ts`, translate the Dutch comment, and add `features/images/imageUrls.test.ts` for the Cloudinary transformation and Supabase public-URL helpers

### Admin area

- [X] T064 [US2] Move `app/admin/action.ts` to `app/admin/actions.ts` and `app/admin/admincomponents/` to `app/admin/_components/`; update imports in `app/admin/page.tsx`; admin header texts from `content/en.ts`, GitHub link from `config/site.ts`
- [X] T065 [US2] Rename `editprojectform.tsx` to `app/admin/_components/ProjectFormDialog.tsx` (component `ProjectFormDialog`), props `Onsaved`/`Onclose` → `onSaved`/`onClose`, texts from `content/en.ts`
- [X] T066 [US2] Split `AdminProject.tsx` into `app/admin/_components/ProjectThumb.tsx` and `app/admin/_components/ProjectListItem.tsx` (list/grid view, visibility toggle, delete), moving create-mode handling into `CreateProjectButton.tsx` (renders `ProjectFormDialog` directly); props `OnCloseCreate`/`OnCreated` → `onCloseCreate`/`onCreated`; replace both Escape effects with `hooks/useEscapeKey.ts`; keep every `data-cy` attribute and all markup classes identical
- [X] T067 [US2] Update `app/admin/_components/ProjectList.tsx` to use `ProjectListItem` and take the texts "List", "Grid" and "No projects yet. Create your first one." from `messages.admin.*` in `content/en.ts`, and move/adapt `AdminProject.test.tsx` to `app/admin/_components/ProjectListItem.test.tsx` (mock path `./ProjectFormDialog`, prop names `onSaved`/`onClose`) so all existing assertions still pass

### Cleanup

- [X] T068 [US2] Delete `app/Features/Debug/FpsCounter.tsx`, the emptied `app/Features/`, `app/components/` folders and `app/Features/Window/windowThemes.ts` / `type.ts` once nothing imports them; confirm with a repo-wide search
- [X] T069 [US2] In `package.json`, remove `@testing-library/react` and move `vitest-browser-react` to devDependencies; run `npm install` and commit the updated `package-lock.json`
- [X] T070 [P] [US2] Rename `cypress/support/logflowmetric.ts` to `cypress/support/logFlowMetric.ts` and update imports in `cypress/e2e/*.cy.ts`; rename `cypress/e2e/Admin.cy.ts` to `cypress/e2e/admin.cy.ts`; translate Dutch text in Cypress files
- [X] T071 [US2] Update `sonar-project.properties` `sonar.sources` to `app,components,features,hooks,content,config,lib`
- [X] T072 [US2] Repo-wide checks: no Dutch comments/identifiers/strings (`grep -riE "\b(het|een|deze|niet|wordt|ook|alleen|dit)\b" app components features hooks content config cypress`), no `=== "Win98"`-style theme comparisons, no component importing another component's `.module.css`, no `../../` imports where `@/` applies; fix any findings
- [X] T073 [US2] Verify: full Cypress suite, `npm run test:components:coverage` (coverage ≥ baseline), visual comparison with `specs/001-foundation-refactor/baseline/` screenshots, and the dummy-theme scratch test from [theme-definition.md](./contracts/theme-definition.md) on a throwaway branch (SC-003); then update `001-foundation-refactor` from `Development` and open PR 2 into `Development`

**Checkpoint**: Clean codebase, identical behaviour, all tests green

---

## Phase 5: User Story 3 - The maintainer has one clear backlog (Priority: P2)

**Goal**: `docs/backlog.md` lists all open work with real status and order; GitHub issues match it after maintainer approval.

**Independent Test**: Every open GitHub issue appears once in `docs/backlog.md` with a status that matches the code; after approval, GitHub reflects exactly the approved changes.

**Delivery**: PR 3 → `Development` (after PR 2 is merged)

- [X] T074 [US3] Export all issues with `gh issue list --state all --limit 200 --json number,title,state,labels,body` and compare each open issue's checklist items with the code; record per issue: done, remaining, status (`not started` / `partly done` / `done in code` / `needs decision`)
- [X] T075 [US3] Create `docs/backlog.md` following [backlog-and-github.md](./contracts/backlog-and-github.md): Summary, Recommended spec order, one section per open issue (#11, #12, #15, #16, #17, #19, #20, #21, #22, #23, #24, #30, #32) with type, priority, status, done, remaining, dependencies and suggested spec
- [X] T076 [US3] Add the "Follow-ups from spec 001" section to `docs/backlog.md` with ids `F-1`… for: missing taskbar icons for classicMac/debug, database field renaming (`imagesrc`, `Github_Link`), separate test database, admin check in data-changing server actions, server-side sign-in, `supebase_url` typo in `lib/supabase/server.ts`, invalid debug theme class `outline-dotted-[#00ffff]`, Tailwind class sorting, start menu items without actions, always-visible theme switcher vs theme-switcher window, "About me" placeholder, project window layout buttons, making the SonarQube quality gate blocking again (made non-blocking during PR 2 at the maintainer's request; then also check that the coverage reports reach Sonar) — each with the reason it was left out
- [X] T077 [US3] Add the "Proposed GitHub changes" table to `docs/backlog.md`: issues to close (with comment text), checkboxes to tick, `priority: high|medium|low` labels to create and apply, Dutch text to translate (keeping the original in `<details>`), new issues for every `F-n` item
- [X] T078 [US3] Present the proposed changes table to the maintainer and wait for explicit approval per row (FR-023b); record approvals in the table's "Approved" column
- [X] T079 [US3] Apply only the approved rows with `gh` (`gh label create`, `gh issue edit`, `gh issue comment`, `gh issue close`, `gh issue create`), logging each applied change with a timestamp in the "Applied changes log" of `docs/backlog.md`; on failure, stop and resume from the log without duplicates
- [X] T080 [US3] Update `docs/backlog.md` so `F-n` items reference their new issue numbers; verify with `gh issue list --state open` that every open issue appears exactly once (SC-008); open PR 3 from `001-foundation-refactor` into `Development`

**Checkpoint**: One trustworthy backlog in the repo and on GitHub

---

## Phase 6: User Story 4 - Tooling and pipeline are clean and fully check every change (Priority: P3)

**Goal**: One build configuration without instrumentation in production and a clean English pipeline.

**Independent Test**: A production build contains no `__coverage__`; a PR with a deliberately failing E2E assertion fails; `.github/workflows/main.yml` has no commented-out steps.

**Delivery**: PR 4 → `Development` (after PR 2, because it touches `package.json` and configs)

- [X] T081 [US4] Add `swc-plugin-coverage-instrument` as a devDependency (choose the version compatible with Next.js 16.2's SWC core) and enable it in `next.config.ts` via `experimental.swcPlugins` only when `process.env.CYPRESS_COVERAGE === "true"` (research R9)
- [X] T082 [US4] Delete `.babelrc` and `babel.config.js` and remove `babel-plugin-istanbul` from devDependencies; verify `npm run build` uses SWC and its output contains no `__coverage__`, and that a `CYPRESS_COVERAGE=true` build plus `npx cypress run` still produces `coverage/cypress/lcov.info` with coverage ≥ baseline; if no compatible plugin exists, apply the R9 fallback and document it in `specs/001-foundation-refactor/research.md`
- [X] T083 [US4] In `.github/workflows/main.yml`: remove all commented-out cache steps (or replace with a working `actions/cache` on `.next/cache` if it measurably shortens runs) and translate the SonarQube failure summary to English (the SonarQube job stays non-blocking for the rest of this spec; making it blocking again is backlog item from T076)
- [X] T084 [US4] Make the Cypress summary in `.github/workflows/main.yml` list the actual tested flows (desktop + admin) and keep links to videos/screenshots artifacts (FR-021)
- [X] T085 [P] [US4] Update `README.md`: project description, tech stack, folder structure (from plan.md), scripts, test setup including the admin test account and guaranteed cleanup, the CI pipeline stages, and credit for the Win98 icons that is in the README today
- [X] T086 [US4] Validate the pipeline: push a temporary commit with a failing assertion in `cypress/e2e/desktop.cy.ts` to the PR branch, confirm the run fails at the E2E stage, revert; then open PR 4 from `001-foundation-refactor` into `Development`

**Checkpoint**: Tooling and pipeline match constitution IX

---

## Phase 7: Polish & Cross-Cutting Concerns

- [ ] T087 Run every validation in [quickstart.md](./quickstart.md) on `Development` after all four PRs are merged and record results in `specs/001-foundation-refactor/baseline.md` (before/after table)
- [ ] T088 [P] Compare Lighthouse scores of the last `Development` run with the baseline (accessibility ≥ 0.90; others not lower) (SC-009)
- [ ] T089 [P] Delete `specs/001-foundation-refactor/baseline/` screenshots if they are not needed anymore, or keep them referenced from `baseline.md`
- [ ] T090 Mark the spec status as "Implemented" in `specs/001-foundation-refactor/spec.md`
- [ ] T091 Delete branch `001-foundation-refactor` locally and on GitHub after the last pull request of this spec is merged

---

## Dependencies & Execution Order

### Phase dependencies

- **Setup (Phase 1)** → **Foundational (Phase 2)** → **US1 (Phase 3)**
- **US2 (Phase 4)** depends on US1 being merged (tests must protect the refactor)
- **US3 (Phase 5)** after US2 is merged (single branch, strictly sequential); its status check is then based on the refactored code
- **US4 (Phase 6)** after US3 is merged (shares `package.json`, `next.config.ts`, `sonar-project.properties` with US2)
- **Polish (Phase 7)** after all PRs are merged

### Story completion order

```text
Setup → Foundational → US1 (PR 1) → US2 (PR 2) → US3 (PR 3) → US4 (PR 4) → Polish
```

### Within user stories

- US1: test hooks (T006–T010) before tests (T011–T017); cleanup task (T019) before admin suite changes (T021)
- US2: line endings (`.gitattributes`) and formatting first; hooks/content/config and theme registry before moving components; window reducer + tests (T044–T045) before `Desktop` (T057); cleanup (T068–T072) last
- US3: analysis → document → proposal → approval → apply (strictly sequential)

## Parallel Opportunities

### US1

```text
T006, T007, T008, T009, T010   (different component files)
T024, T025                     (independent test files)
```

### US2

```text
T031, T032, T033               (hooks, config, content)
T036, T037, T038, T039         (one file per theme)
T053, T054, T055               (app content components)
T059, T060, T063, T070        (robots/sitemap, login page, image helpers, Cypress renames)
```

### Across stories

None: the spec uses one branch, so user stories run one after another.

## Implementation Strategy

### MVP first (User Story 1)

1. Phases 1–2: baseline + PR trigger
2. Phase 3: desktop tests, admin cleanup, component tests → PR 1
3. **Stop and validate**: suite green 10×, cleanup proven → merge

### Incremental delivery

1. PR 1 (US1) → safety net
2. PR 2 (US2) → refactor, verified by PR 1 tests
3. PR 3 (US3) → backlog + approved GitHub sync
4. PR 4 (US4) → tooling and pipeline
5. Polish → before/after report

## Notes

- [P] tasks touch different files and have no dependency on unfinished tasks
- Commit after each task or logical group; renormalisation and formatting are separate commits
- Never change behaviour, the database or authentication; if a step would, stop and add it to the backlog instead
