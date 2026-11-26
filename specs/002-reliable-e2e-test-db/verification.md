# Verification Notes: Spec 002

## Live database unchanged check

| Moment | `projects` row count | Latest `updated_at` | Source |
|---|---|---|---|
| Before (T002) | _pending — maintainer_ | _pending_ | |
| After (T043) | _pending_ | _pending_ | |

## Schema check (T006)

_Pending: maintainer export of the live schema compared with `supabase/migrations/0001_initial_schema.sql`._

## E2E audit (T025)

| File | Test (before) | Decision | Reason |
|---|---|---|---|
| desktop | opens with the contact window active in the taskbar | keep | visible window + active taskbar entry |
| desktop | opens a window from a desktop icon in front and makes it active | keep | visible window, z-order, active entry |
| desktop | brings a window behind to the front when it is clicked | keep | user-visible focus change |
| desktop | minimizes a window and restores it from the taskbar in front | keep | full minimize/restore round trip |
| desktop | closes a window with its own close button | keep | window and entry disappear |
| desktop | closes a window from the taskbar | keep | window and entry disappear |
| desktop | applies every theme to the desktop and the taskbar | keep | theme visible on desktop and taskbar |
| desktop | opens a project window from a visible project .exe icon | improve | silently skipped when live data had no visible projects; depended on live data. Now uses seed visibleA, checks title/description/tags and that the hidden project has no icon |
| authorization | Gets redirected to login | improve | absolute `http://localhost:3000` URL; now relative and asserts pathname exactly |
| authorization | logs in | improve | only checked the URL; now asserts the admin panel is visible |
| authorization | logs out and protects /admin again | improve | relative URLs, waits on the panel instead of URL substring |
| authorization | fails to log in | improve | typed a real personal email against live auth; now a `test.invalid` address, also asserts it stays on /login |
| admin | Create project | improve | 15 s existence timeout; now also checks persistence after reload and the icon on the desktop |
| admin | Edit existing project | improve | depended on the project created by the previous test; duplicated the visibility toggle. Now edits seed visibleB, checks after reload |
| admin | Delete project | improve | depended on the previous two tests; now deletes seed hidden, checks after reload |
| admin | before/after `cleanupTestProjects` hooks | remove | replaced by the reset to the seed before every spec file |

No fixed `cy.wait(<ms>)` waits were found. The only conditional skip was the project-window test.

**Gaps found beyond FR-013**: admin visibility toggle reflected on the visitor desktop (added to the
admin tests); non-admin access (added). Start menu items "About me", "Projects", "Theme switcher" have
no action (F-9, #49): behaviour change, stays in the backlog; the start-menu test checks only open and close.

## Sabotage log

| Test | Sabotage applied | Observed failure | Reverted |
|---|---|---|---|
| Vitest `actions.server.test.ts` · createProject | removed `await requireAdmin()` from `createProject` | `× createProject is refused and touches no data` — expected "Not authorised", got a DB-call error | ✓ |
| Vitest · updateProject | same for `updateProject` | `× updateProject is refused and touches no data` | ✓ |
| Vitest · updateProjectVisibility | same for `updateProjectVisibility` | `× updateProjectVisibility is refused and touches no data` | ✓ |
| Vitest · deleteProject | same for `deleteProject` | `× deleteProject is refused and touches no data` | ✓ |
| Guard (reset script) | `TEST_SUPABASE_URL` set to the live URL | `Refusing to run tests: TEST_SUPABASE_URL points at the live database`, exit 1 | ✓ |
| Guard (Cypress) | no test settings present | `TestEnvironmentError: Refusing to run tests: missing TEST_SUPABASE_URL, …` from `setupNodeEvents` | ✓ |
| admin · creates a project… | after reload assert the new project does **not** exist | `Expected not to find content: 'CYPRESS TEST PROJECT' … but continuously found it` | ✓ |
| admin · edits a project… | after reload assert the old title still exists | `Expected to find content: 'Seed Visible Project B' … but never did` | ✓ |
| admin · hides a project from the desktop… | code: removed the `is_visible` filter in `getVisibleProjects` | `Expected not to find content: 'Seed Visible Project A' within … desktop-icon … but continuously found it` | ✓ |
| admin · deletes a project… | after reload assert the deleted project exists | `Expected to find content: 'Seed Hidden Project' … but never did` | ✓ |
| admin · error when saving fails | code: removed `setSaveFailed(true)` in `ProjectFormDialog` | `Expected to find element: [data-cy="save-error"], but never found it` | ✓ |
| admin · error when deleting fails | assert the alert was **not** called | `expected alert to not have been called at least once` | ✓ |
| admin · error when visibility fails | after reload expect "Hidden" | `-'Visible' +'Hidden'` | ✓ |
| authorization · signed-out → /login | expect `/admin` | `-'/login' +'/admin'` | ✓ |
| authorization · admin signs in | expect the create button **not** to exist | `Expected <button…> not to exist in the DOM, but it was continuously found` | ✓ |
| authorization · logs out and protects /admin | expect `/admin` at the end | `-'/login' +'/admin'` | ✓ |
| authorization · wrong password | expect the error **not** to show | `Expected not to find content: 'Invalid email or password.' but continuously found it` | ✓ |
| authorization · non-admin → desktop | code: removed `redirect("/")` in `app/admin/page.tsx` | test failed (stayed on `/admin`) | ✓ |
| contact · send succeeds | code: removed `form.reset()` | test failed (name field not cleared) | ✓ |
| contact · send fails | assert the error text is **not** shown | `-'…Something went wrong. Please try again.' +'Something went wrong. Please try again.'` | ✓ |
| desktop · project window, hidden project | code sabotage (removing the `is_visible` filter) did **not** fail: row-level security also hides the row from visitors, so the behaviour held. Then asserted the hidden icon exists | `Expected to find content: 'Seed Hidden Project' within … desktop-icon … but never did` | ✓ |
| desktop · start menu | expect the item "Nonexistent item" | `-'About meProjectsTheme switcherAdmin login' +'Nonexistent item'` | ✓ |
| desktop · taskbar entries | expect 3 entries | `Not enough elements found. Found '2', expected '3'` | ✓ |
| desktop · theme after reload | code: removed `localStorage.setItem("theme", …)` | test failed (theme back to default after reload) | ✓ |

The first code-sabotage run also showed that a failing admin test left data behind for the next test
(the visibility-error test failed only because the hide test stopped halfway). Fixed: every admin
test now resets the test database first.

Bug found while running: typing an image URL in the admin form crashed the page (`next/image`
received "h"). The old test hid this by pasting the URL. Fixed: the preview only renders complete
http(s) URLs.

## Coverage before/after (F-15)

Before: Cypress coverage artifact of CI run 45710360891 (Development). After: local run of the full
suite on a `build:test` coverage build. Lines covered:

| Folder | Before | After |
|---|---|---|
| app/admin/_components | 58% (39/67) | 63% (44/70) |
| components/Desktop | 74% (17/23) | 78% (18/23) |
| components/Taskbar | 58% (7/12) | 67% (8/12) |
| components/apps/ContactApp | 28% (5/18) | 83% (15/18) |
| features/desktop | 67% (4/6) | 83% (5/6) |
| features/windows | 29% (8/28) | 43% (12/28) |
| hooks | 67% (14/21) | 86% (18/21) |
| All files | – | 67% lines (188/282) |

F-15 conclusion: the desktop flows already reached the report after the SWC switch in spec 001; the
remaining low numbers come from the small statement counts the SWC plugin maps back (e.g.
`AboutApp` reports 1 line, 0% although the window opens) and from server-rendered code, which only
the browser coverage collects. `.nycrc.json` now fixes which folders are reported. A deeper fix
(server-side coverage) is recorded as a follow-up in the backlog.

## CI run

_Pending (T044)._
