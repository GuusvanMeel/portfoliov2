---
description: "Task list for spec 003: theme and admin view preferences in cookies"
---

# Tasks: Theme and Admin View Preferences in Cookies

**Input**: Design documents from `specs/003-preferences-in-cookies/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/preference-cookies.md, quickstart.md

**Tests**: Requested (FR-010, FR-011, FR-012; constitution IX). Every new or changed E2E test is sabotaged locally and logged in `specs/003-preferences-in-cookies/verification.md`.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Create branch `003-preferences-in-cookies` from `Development` and create `specs/003-preferences-in-cookies/verification.md` with sections "Sabotage log", "Lighthouse baseline vs result" and "Hydration warnings check"
- [X] T002 Record the current Lighthouse scores (run `npm run lighthouse:ci` or take the latest CI run) as the baseline in `specs/003-preferences-in-cookies/verification.md` — taken from CI run 45727957009

---

## Phase 2: Foundational (blocks all stories)

- [X] T003 [P] Create `lib/preferenceCookie.ts` with pure `readPreference<T>(raw: string | undefined, isValid, fallback): T` (anything not valid — missing, empty, unknown — returns the fallback) and `preferenceCookieString(name, value, secure)` producing `name=value; Path=/; Max-Age=31536000; SameSite=Lax` plus `; Secure` when `secure` is true, and `writePreferenceCookie(name, value)` that sets `document.cookie` (secure when `location.protocol === "https:"`) inside try/catch and never throws
- [X] T004 [P] Write Vitest tests in `lib/preferenceCookie.test.ts`: valid value, unknown value, empty string, undefined → fallback; cookie string with and without `Secure`; `writePreferenceCookie` sets the cookie and does not throw when `document.cookie` assignment throws
- [X] T005 [P] Change `isThemeName` in `features/theme/themeNames.ts` to accept `string | null | undefined` (needed for cookie values) and extend `features/theme/themeNames.test.ts` with an `undefined` case

**Checkpoint**: helpers tested; story work can start.

---

## Phase 3: User Story 1 — Chosen theme from the first paint (P1) 🎯 MVP

**Goal**: The server renders the theme from the `theme` cookie; theme changes write the cookie.
**Independent test**: Choose Win98, reload; the raw server HTML has `data-theme="Win98"`; no hydration warning.

- [X] T006 [US1] Change `features/theme/ThemeProvider.tsx`: accept props `initialTheme: ThemeName` and `hasThemeCookie: boolean`, use `initialTheme` as the initial state, remove the localStorage read effect, and make `setTheme` update state and call `writePreferenceCookie("theme", newTheme)` (no localStorage write)
- [X] T007 [US1] Change `app/layout.tsx`: make `RootLayout` async, read `(await cookies()).get("theme")?.value` from `next/headers`, compute `initialTheme = readPreference(raw, isThemeName, defaultTheme)` and `hasThemeCookie = isThemeName(raw)`, and pass both to `ThemeProvider`
- [X] T008 [US1] Verify `components/ThemeSwitcher/ThemeSwitcher.tsx` and the always-visible theme buttons still work unchanged via `useTheme().setTheme` (no code change expected; fix only if typing breaks)
- [X] T009 [US1] Update the test "keeps the chosen theme after a page reload" in `cypress/e2e/desktop.cy.ts`: after clicking Win98, assert `cy.getCookie("theme")` has value `Win98`, then `cy.request("/")` and assert the response body contains `data-theme="Win98"` (first render), then `cy.reload()` and assert the end state as before; add `cy.clearCookies()` to the `beforeEach`
- [X] T010 [US1] Add a test "falls back to WinXP for an invalid theme cookie" in `cypress/e2e/desktop.cy.ts`: `cy.setCookie("theme", "bogus")`, `cy.request("/")` body contains `data-theme="WinXP"` with status 200, `cy.visit("/")` shows `data-theme="WinXP"` and no uncaught error
- [X] T011 [US1] Add a check for hydration warnings in the reload test in `cypress/e2e/desktop.cy.ts`: spy on `console.error` in `onBeforeLoad` of a `cy.visit("/")` with the Win98 cookie set, and assert it was not called with any argument matching `/hydrat|#418|#423|#425/i` (covers both development messages and minified production React error codes)
- [X] T012 [US1] Sabotage T009–T011 one by one (T009: ignore the cookie in `app/layout.tsx`; T010: remove the fallback in `readPreference`; T011: make the first render read `document.cookie` in a `useState` initializer in `ThemeProvider` so server and client markup differ), confirm each test fails, restore, and log each run in `specs/003-preferences-in-cookies/verification.md`

**Checkpoint**: US1 works and is tested on its own.

---

## Phase 4: User Story 2 — Existing visitors keep their theme (P2)

**Goal**: A valid legacy `localStorage.theme` is moved to the cookie once and then removed.
**Independent test**: No cookie, `localStorage.theme = "classicMac"` → classicMac shown, cookie set, key gone; next request renders classicMac on the server.

- [X] T013 [P] [US2] Create `features/theme/themeMigration.ts` with `migrateLegacyTheme(storage: Pick<Storage, "getItem" | "removeItem">): ThemeName | null`: read key `theme`; if a valid theme name, remove the key and return it; if present but invalid, remove the key and return null; if absent return null; wrap storage access in try/catch and return null on error
- [X] T014 [P] [US2] Write Vitest tests in `features/theme/themeMigration.test.ts`: valid value returned and removed; invalid value removed and null; missing key null; throwing storage returns null without throwing
- [X] T015 [US2] In `features/theme/ThemeProvider.tsx` add a mount effect that runs only when `hasThemeCookie` is false: call `migrateLegacyTheme(localStorage)`; if it returns a theme, set state and `writePreferenceCookie("theme", theme)`. When `hasThemeCookie` is true, localStorage is never read (cookie wins)
- [X] T016 [US2] Add a test "moves a theme from localStorage to the cookie once" in `cypress/e2e/desktop.cy.ts`: `cy.clearCookies()`, `cy.visit("/", { onBeforeLoad: win => win.localStorage.setItem("theme", "classicMac") })`, assert desktop `data-theme="classicMac"`, `cy.getCookie("theme")` value `classicMac`, `localStorage.getItem("theme")` is null, then `cy.request("/")` body contains `data-theme="classicMac"`
- [X] T017 [US2] Add a test "keeps the cookie theme when localStorage has another value" in `cypress/e2e/desktop.cy.ts`: set cookie `theme=Win98` and localStorage `classicMac`, visit, assert `data-theme="Win98"` and the cookie is still `Win98`
- [X] T018 [US2] Sabotage T016–T017 (e.g. skip the removal in `migrateLegacyTheme`; skip the cookie write; run the migration even when a cookie exists), confirm failures, restore, and log in `specs/003-preferences-in-cookies/verification.md`

**Checkpoint**: US1 + US2 work.

---

## Phase 5: User Story 3 — Admin view survives a reload (P3)

**Goal**: The admin overview renders the `admin-view` cookie (`list` | `grid`, default `list`) on the server.
**Independent test**: As admin, choose grid, reload; the raw `/admin` HTML has `data-view="grid"`.

- [X] T019 [P] [US3] Create `features/admin/viewMode.ts` with `viewModes = ["list", "grid"] as const`, `type ViewMode`, `isViewMode(value: string | null | undefined)` and `defaultViewMode: ViewMode = "list"`
- [X] T020 [P] [US3] Write Vitest tests in `features/admin/viewMode.test.ts`: `list` and `grid` valid; `Grid`, empty, undefined invalid; `readPreference` with `isViewMode` falls back to `list`
- [X] T021 [US3] Change `app/admin/_components/ProjectList.tsx`: replace the local `View` type with `ViewMode`, add prop `initialView: ViewMode` used as initial state, add `data-view={view}` and `data-cy="admin-projects"` on the projects container wrapper, and make the toggle buttons call a `chooseView` that sets state and `writePreferenceCookie("admin-view", view)`; keep `aria-pressed` and all classes unchanged
- [X] T022 [US3] Change `app/admin/page.tsx`: read `(await cookies()).get("admin-view")?.value`, compute `readPreference(raw, isViewMode, defaultViewMode)` and pass it as `initialView` to `ProjectList`
- [X] T023 [US3] Update any existing render of `ProjectList` in Vitest tests (search `app/admin/_components/*.test.tsx`) to pass `initialView` — no existing test renders `ProjectList`; the two tests that render `ThemeProvider` got the new props instead
- [X] T024 [US3] Add a test "remembers the grid view after a reload" in `cypress/e2e/admin.cy.ts`: click the grid toggle, assert `cy.getCookie("admin-view")` is `grid`, `cy.request("/admin")` body contains `data-view="grid"`, `cy.reload()` shows the grid toggle with `aria-pressed="true"`; also assert an `admin-view=bogus` cookie renders `data-view="list"`
- [X] T025 [US3] Sabotage T024 (ignore the cookie in `app/admin/page.tsx`; skip the cookie write in `ProjectList`), confirm failure, restore, and log in `specs/003-preferences-in-cookies/verification.md`

**Checkpoint**: all stories work independently.

---

## Phase 6: Polish & Cross-Cutting

- [X] T026 Search the repo for remaining `localStorage` theme usage and the old "Later this should move to cookies" comment and remove them (`grep -rn "localStorage" features components app`)
- [X] T027 Run `npm run typecheck`, `npm run lint`, `npm run format:check` and `npm run test:components`; fix any failures
- [X] T028 Run `npm run test:db:reset` and `npm run test:e2e` locally; all specs pass
- [X] T029 Run `npm run lighthouse:ci` and record the results against the T002 baseline in `specs/003-preferences-in-cookies/verification.md` (no category lower)
- [X] T030 Walk through the manual scenarios in `specs/003-preferences-in-cookies/quickstart.md` (including blocked cookies) and note the results in `specs/003-preferences-in-cookies/verification.md`
- [X] T031 Update `docs/backlog.md`: mark the theme-cookie (#20) and admin-view (#22) items done with a reference to spec 003
- [ ] T032 Update GitHub issues #20 and #22 with a short summary and a link to the spec/PR, and close them when the PR is merged (`gh issue comment` / `gh issue close`)
- [ ] T033 Commit in batches and push once when everything passes locally; open the PR to `master` and confirm the full pipeline (E2E and Lighthouse) is green

---

## Dependencies & Execution Order

- Setup (T001–T002) → Foundational (T003–T005) → stories.
- US1 (T006–T012) has no story dependency. US2 (T013–T018) builds on the `ThemeProvider` props from T006/T007. US3 (T019–T025) depends only on Foundational and can run alongside US1/US2.
- Within a story: helpers and unit tests → wiring → E2E tests → sabotage.
- Polish after all stories.

## Parallel Opportunities

- Foundational: T003/T004 and T005 in parallel.
- US2: T013 and T014 in parallel, while US1 E2E work continues.
- US3: T019/T020 in parallel with any US1/US2 task; T021/T022 touch only admin files.

## Implementation Strategy

1. MVP: Setup + Foundational + US1 → validate the no-flash reload (fixes the core of issue #20).
2. Add US2 so returning visitors keep their theme before anything ships.
3. Add US3 (issue #22).
4. Polish, verify locally, push once (per the project's push-once-per-spec practice).
