# GuusOS backlog

## Summary

- Date: 2026-11-25 (after spec 001 PR 2, the foundation refactor)
- Source: [GitHub issues of GuusvanMeel/portfoliov2](https://github.com/GuusvanMeel/portfoliov2/issues),
  checked against the code on `Development`
- Open GitHub issues after the sync: 25 — high 5 · medium 10 · low 10 (12 existing issues plus
  13 new follow-up issues; #17 was closed as done in code)
- Follow-ups from spec 001: 15 (`F-1` … `F-15`); 13 are on GitHub as #41–#53, F-11 is
  informational and F-12 is covered by #16

Spec 002 (reliable end-to-end tests and a separate test database) resolves F-3 (#43), F-4 (#44),
F-6 (#46) and F-15 (#53); see `specs/002-reliable-e2e-test-db/`.

## Recommended spec order

1. **003 Theme and preferences in cookies** — #20, #22. Fixes the hydration risk at the root
   (constitution VI); later specs that add preferences build on it.
2. **Admin security hardening (rest)** — F-5 (#45) server-side sign-in. F-4 and F-3 were done in spec 002.
3. **004 About Me and contact content** — #16, F-12, F-9 (#49). Replaces the visible placeholder and gives
   the start menu items real actions.
4. **005 Mobile OS** — #30. Reuses the chrome-free apps from spec 001.
5. **006 Window chrome** — #11 (active/inactive title bars, maximize), #32, #23. Depends on 002.
6. **007 Drag library experiment** — #21 (its own spec, constitution XI). Before or with 006.
7. **008 More themes** — #11 (Vista, 7, Netscape), F-1 (#41), F-7 (#47). Depends on 006 for button variants.
8. **009 Boot screen** — #19.
9. **010 Project versions** — #15 (v1/v2 windows).
10. **011 Space marine pinball** — #12.
11. **Tech debt, any time** — F-2 (#42), F-8 (#48), F-10 (#50), F-11, F-13 (#51), F-14 (#52), F-16.
12. **Needs a decision first** — #24, F-10 (#50).

## Items

### #20 Move theme storage from localStorage to cookies

- Type: bug · Priority: high · Status: not started
- Done: –
- Remaining: store the theme in a cookie, read it on the server so the first render matches,
  migrate an existing localStorage value once. The file mentioned in the issue moved to
  `features/theme/ThemeProvider.tsx`.
- Depends on: –
- Source: GitHub #20 · Suggested spec: 002

### #16 Migrate About me and contact window

- Type: feature · Priority: high · Status: partly done
- Done: About window shown inside a window frame (placeholder text "About me content"); contact
  window with a working contact form; content styled through the theme
- Remaining: real About Me content, social links (in About and Contact)
- Depends on: –
- Source: GitHub #16 · Suggested spec: 004

### #30 Mobile OS

- Type: feature · Priority: high · Status: not started
- Done: groundwork only — app content lives in chrome-free components under `components/apps/`
  and app definitions in `features/windows/appDefinitions.tsx` (spec 001)
- Remaining: mobile launcher, fullscreen/card panels with back/close, device detection that is
  hydration-safe
- Depends on: –
- Source: GitHub #30 · Suggested spec: 005

### #11 Configurable theme system for Window frames

- Type: feature · Priority: medium · Status: partly done
- Done: Windows 98, Windows XP and Classic Mac themes (plus a debug theme); theme type and theme
  definitions per theme (spec 001 registry); theme switcher; theme saved in localStorage
- Remaining: Windows Vista, Windows 7 and Netscape-style themes; inactive title bar styling
  (`titleBarInactive` is defined in every theme but never used); maximize button
- Depends on: #20 (storage moves to cookies)
- Source: GitHub #11 · Suggested spec: 006 (chrome), 008 (new themes)

### #15 Show project data In windows on the front page

- Type: feature · Priority: medium · Status: partly done
- Done: custom project window with landscape/block/mobile layouts; visible projects on the
  desktop as `.exe` icons; project opens in a window with title, description, tags, image and
  GitHub link; hidden projects are filtered out
- Remaining: multiple version windows (v1/v2 of a project)
- Depends on: –
- Source: GitHub #15 · Suggested spec: 010

### #19 Custom Boot screen

- Type: feature · Priority: medium · Status: not started
- Done: –
- Remaining: boot screen that also hides any loading time (issue text is in Dutch)
- Depends on: –
- Source: GitHub #19 · Suggested spec: 009

### #22 Persist admin project view preference using cookies

- Type: enhancement · Priority: medium · Status: not started
- Done: –
- Remaining: remember list/grid view in a cookie (the `wontfix` label was removed; planned for spec 002).
- Depends on: #20 (same cookie approach)
- Source: GitHub #22 · Suggested spec: 002

### #23 Decent Ghosting effect for every style

- Type: enhancement · Priority: medium · Status: not started
- Done: a per-theme `window.dragging` class exists (opacity/outline)
- Remaining: an outline-only "ghost" while dragging for every theme
- Depends on: #21 (drag library choice)
- Source: GitHub #23 · Suggested spec: 006

### #32 Full resize implementation

- Type: enhancement · Priority: medium · Status: not started
- Done: –
- Remaining: resizing is currently turned off (`enableResizing={false}`); enable it and make the
  window content scale
- Depends on: #21
- Source: GitHub #32 · Suggested spec: 006

### #17 Add Taskbar

- Type: feature · Priority: low · Status: done in code (closed 2026-11-25)
- Done: taskbar with start menu, open windows, active state, close buttons and tray; follows the
  theme; minimized windows stay in the taskbar
- Remaining: – (start menu items without actions are tracked as F-9 (#49))
- Depends on: –
- Source: GitHub #17 · Suggested spec: – (close)

### #21 Test multiple drag packages

- Type: enhancement · Priority: low · Status: not started
- Done: `react-rnd` is in use
- Remaining: compare react-rnd, react-moveable and react-draggable on speed and usability
- Depends on: –
- Source: GitHub #21 · Suggested spec: 007

### #24 Styling mismatch between components

- Type: enhancement · Priority: low · Status: needs decision
- Done: –
- Remaining: decide whether per-component styling choices fit "themes are data"
  (constitution II); if yes, specify how a mixed theme is stored
- Depends on: #20
- Source: GitHub #24 · Suggested spec: – (decision first)

### #12 space marine pinball

- Type: feature · Priority: low · Status: not started
- Done: –
- Remaining: playable in the browser, draggable window, keyboard and mouse controls, global and
  local scoreboard
- Depends on: –
- Source: GitHub #12 · Suggested spec: 011

## Follow-ups from spec 001

Left out of spec 001 because it allowed no visible, database, authentication or behaviour changes.

### F-1 (#41) Missing taskbar and login icons for classicMac and debug

- Type: bug · Priority: medium
- `/icons/classicMac/*` and `/icons/debug/*` do not exist, so those themes show broken images in
  the taskbar and start menu. There is also an empty, misspelled `public/icons/ClassisMac/` folder.
- Left out because: adding icons is a visible change.

### F-2 (#42) Rename database fields `imagesrc` and `Github_Link`

- Type: tech-debt · Priority: low
- Inconsistent column names; mapped in `features/projects/mappers.ts`.
- Left out because: no database changes in spec 001 (needs a migration).

### F-3 (#43) Separate test database for end-to-end tests

- Type: tech-debt · Priority: high · Status: **done in spec 002**
- Admin tests write `CYPRESS TEST` projects to the live database (cleaned up afterwards).
- Left out because: no database changes in spec 001.
- Done: separate Supabase test project, schema in `supabase/migrations/`, seed and reset script,
  guard that refuses the live database; Cypress and Lighthouse use it locally and in CI.

### F-4 (#44) Admin check in every data-changing server action

- Type: bug (security) · Priority: high
- `createProject`, `updateProject`, `updateProjectVisibility` and `deleteProject` in
  `features/projects/actions.ts` do not check the signed-in user; protection relies on the proxy
  and row-level security only (constitution V asks for a check in every mutation).
- Left out because: no authentication changes in spec 001.
- Status: **done in spec 002** — `requireAdmin()` with the `ADMIN_EMAILS` allowlist in all four
  actions; a signed-in non-admin on `/admin` is sent to `/`.

### F-5 (#45) Server-side sign-in

- Type: tech-debt (security) · Priority: medium
- `app/login/page.tsx` signs in with the browser Supabase client.
- Left out because: no authentication changes in spec 001.

### F-6 (#46) Typo `supebase_url` in `lib/supabase/server.ts`

- Type: tech-debt · Priority: low · Status: **done in spec 002**
- Left out because: `lib/supabase/*` was frozen in spec 001.

### F-7 (#47) Invalid debug theme class `outline-dotted-[#00ffff]`

- Type: bug · Priority: low
- Not a valid Tailwind class, so the debug theme's dragging outline has no colour.
- Left out because: fixing it is a visible change.

### F-8 (#48) Tailwind class sorting

- Type: tech-debt · Priority: low
- Add `prettier-plugin-tailwindcss` and sort classes in one formatting commit.
- Left out because: reorders every class string, too noisy next to the refactor.

### F-9 (#49) Start menu items without actions

- Type: bug · Priority: medium
- "About me", "Projects" and "Theme switcher" in the start menu do nothing.
- Left out because: behaviour change.

### F-10 (#50) Always-visible theme switcher vs theme switcher window

- Type: enhancement · Priority: low · Needs decision
- The desktop always shows theme buttons at the top-left, and there is also a theme switcher window.
- Left out because: removing one is a visible change and needs a decision.

### F-11 Redundant focus on window click

- Type: tech-debt · Priority: low
- Removed during PR 2 for a SonarCloud finding: `WindowFrame` focused the window on click while
  `DraggableWindow` already does so on mousedown. Recorded so the change is traceable; no action
  needed unless a regression shows up.
- Left out because: – (already done; informational)

### F-12 "About me" placeholder text

- Type: feature · Priority: high
- The About window shows "About me content". Covered by #16.
- Left out because: content change.

### F-13 (#51) Project window layout buttons

- Type: enhancement · Priority: low · Needs decision
- Visitors see Landscape/Block/Mobile buttons that look like a development tool; decide whether the
  layout should follow the image instead.
- Left out because: visible change.

### F-14 (#52) Make the SonarQube quality gate blocking again

- Type: tech-debt · Priority: medium
- Made non-blocking (`continue-on-error: true`) during PR 2 at the maintainer's request after the
  gate failed on moved code (new-code coverage 71% < 80%, reliability B). When picking this up,
  also check that the Vitest and Cypress coverage reports reach Sonar (PR #39 reported 0.0%).
- Left out because: maintainer decision.

### F-15 (#53) Desktop flows barely show up in Cypress coverage

- Type: tech-debt · Priority: low
- The Cypress coverage report covers few desktop lines although the desktop suite exercises them;
  check the instrumentation together with the SWC switch in spec 001 US4.
- Left out because: tooling is US4.
- Status: **done in spec 002** — desktop flows are in the report (numbers in
  `specs/002-reliable-e2e-test-db/verification.md`); `.nycrc.json` fixes the reported folders.
  Server-rendered code is still not counted: see F-16.

### F-16 Server-side code in Cypress coverage

- Type: tech-debt · Priority: low
- Cypress coverage only collects browser-side counters; server components and server actions are
  never counted, and some client components map back to very few statements (e.g. `AboutApp`).
- Left out because: needs a server coverage endpoint; out of scope for spec 002.

## Proposed GitHub changes

Nothing is applied until each row is approved (FR-023b).

| #   | Issue      | Change                                                                                                                                                                                                                                                                                                       | Reason                                  | Approved                             |
| --- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- | ------------------------------------ |
| 1   | –          | Create labels `priority: high`, `priority: medium`, `priority: low`                                                                                                                                                                                                                                          | needed for rows below                   | ✅                                   |
| 2   | #20        | add `priority: high`                                                                                                                                                                                                                                                                                         | hydration bug                           | ✅                                   |
| 3   | #16        | tick "Create Contact window", "Style content inside WindowFrame"; add `priority: high`                                                                                                                                                                                                                       | done in code                            | ✅                                   |
| 4   | #30        | add `priority: high`                                                                                                                                                                                                                                                                                         | mobile visitors see the desktop         | ✅                                   |
| 5   | #11        | tick "Windows 98", "Windows XP", "Classic Mac", "Add a theme switcher", "Save selected theme in localStorage or database"; add `priority: medium`                                                                                                                                                            | done in code                            | ✅                                   |
| 6   | #15        | tick the first five checkboxes; add `priority: medium`                                                                                                                                                                                                                                                       | done in code; only v1/v2 windows remain | ✅                                   |
| 7   | #19        | translate body to English ("Also hide any loading times."), keep the original in `<details>`; add `priority: medium`                                                                                                                                                                                         | constitution VII                        | ✅                                   |
| 8   | #22        | add `priority: medium`; remove `wontfix` **or** close — maintainer chooses                                                                                                                                                                                                                                   | label contradicts open state            | ✅ priority added; `wontfix` removed |
| 9   | #23        | add `priority: medium`                                                                                                                                                                                                                                                                                       | –                                       | ✅                                   |
| 10  | #32        | add `priority: medium`                                                                                                                                                                                                                                                                                       | –                                       | ✅                                   |
| 11  | #17        | tick all three checkboxes and close with comment: "Done in code: the taskbar (`components/Taskbar/Taskbar.tsx`) has a start menu, open-window entries with active state and close buttons, follows the selected theme and keeps minimized windows. Start menu items without actions are tracked separately." | done in code                            | ✅                                   |
| 12  | #21        | add `priority: low`                                                                                                                                                                                                                                                                                          | –                                       | ✅                                   |
| 13  | #24        | add `priority: low`                                                                                                                                                                                                                                                                                          | needs decision                          | ✅                                   |
| 14  | #12        | add `priority: low`                                                                                                                                                                                                                                                                                          | –                                       | ✅                                   |
| 15  | F-1 → #41  | create issue (label `bug`, `priority: medium`)                                                                                                                                                                                                                                                               | follow-up                               | ✅                                   |
| 16  | F-2 → #42  | create issue (`enhancement`, `priority: low`)                                                                                                                                                                                                                                                                | follow-up                               | ✅                                   |
| 17  | F-3 → #43  | create issue (`enhancement`, `priority: high`)                                                                                                                                                                                                                                                               | follow-up                               | ✅                                   |
| 18  | F-4 → #44  | create issue (`bug`, `priority: high`)                                                                                                                                                                                                                                                                       | follow-up                               | ✅                                   |
| 19  | F-5 → #45  | create issue (`enhancement`, `priority: medium`)                                                                                                                                                                                                                                                             | follow-up                               | ✅                                   |
| 20  | F-6 → #46  | create issue (`enhancement`, `priority: low`)                                                                                                                                                                                                                                                                | follow-up                               | ✅                                   |
| 21  | F-7 → #47  | create issue (`bug`, `priority: low`)                                                                                                                                                                                                                                                                        | follow-up                               | ✅                                   |
| 22  | F-8 → #48  | create issue (`enhancement`, `priority: low`)                                                                                                                                                                                                                                                                | follow-up                               | ✅                                   |
| 23  | F-9 → #49  | create issue (`bug`, `priority: medium`)                                                                                                                                                                                                                                                                     | follow-up                               | ✅                                   |
| 24  | F-10 → #50 | create issue (`enhancement`, `question`, `priority: low`)                                                                                                                                                                                                                                                    | follow-up                               | ✅                                   |
| 25  | F-12       | no new issue: covered by #16                                                                                                                                                                                                                                                                                 | duplicate                               | –                                    |
| 26  | F-11       | no new issue: informational                                                                                                                                                                                                                                                                                  | –                                       | –                                    |
| 27  | F-13 → #51 | create issue (`enhancement`, `question`, `priority: low`)                                                                                                                                                                                                                                                    | follow-up                               | ✅                                   |
| 28  | F-14 → #52 | create issue (`enhancement`, `priority: medium`)                                                                                                                                                                                                                                                             | follow-up                               | ✅                                   |
| 29  | F-15 → #53 | create issue (`enhancement`, `priority: low`)                                                                                                                                                                                                                                                                | follow-up                               | ✅                                   |

New issues get a link back to this file.

## Applied changes log

- 2026-11-25T21:08:26Z — row 1: created label `priority: high`
- 2026-11-25T21:08:27Z — row 1: created label `priority: medium`
- 2026-11-25T21:08:28Z — row 1: created label `priority: low`
- 2026-11-25T21:08:30Z — row 2: #20 added `priority: high`
- 2026-11-25T21:08:32Z — row 4: #30 added `priority: high`
- 2026-11-25T21:08:34Z — row 9: #23 added `priority: medium`
- 2026-11-25T21:08:37Z — row 10: #32 added `priority: medium`
- 2026-11-25T21:08:40Z — row 8: #22 added `priority: medium`
- 2026-11-25T21:08:41Z — row 12: #21 added `priority: low`
- 2026-11-25T21:08:44Z — row 13: #24 added `priority: low`
- 2026-11-25T21:08:47Z — row 14: #12 added `priority: low`
- 2026-11-25T21:09:02Z — row 3: #16 ticked "Create Contact window", "Style content inside WindowFrame"; added `priority: high`
- 2026-11-25T21:09:04Z — row 5: #11 ticked 5 checkboxes (Win98, XP, Classic Mac, theme switcher, saved theme); added `priority: medium`
- 2026-11-25T21:09:07Z — row 6: #15 ticked the first five checkboxes; added `priority: medium`
- 2026-11-25T21:09:17Z — row 7: #19 body translated to English (original kept in `<details>`); added `priority: medium`
- 2026-11-25T21:09:23Z — row 11: #17 ticked all three checkboxes, added `priority: low`, closed with comment
- 2026-11-25T21:10:17Z — row 15: created #41 for F-1
- 2026-11-25T21:10:17Z — row 16: created #42 for F-2
- 2026-11-25T21:10:17Z — row 17: created #43 for F-3
- 2026-11-25T21:10:17Z — row 18: created #44 for F-4
- 2026-11-25T21:10:17Z — row 19: created #45 for F-5
- 2026-11-25T21:10:17Z — row 20: created #46 for F-6
- 2026-11-25T21:10:17Z — row 21: created #47 for F-7
- 2026-11-25T21:10:17Z — row 22: created #48 for F-8
- 2026-11-25T21:10:17Z — row 23: created #49 for F-9
- 2026-11-25T21:10:17Z — row 24: created #50 for F-10
- 2026-11-25T21:10:17Z — row 27: created #51 for F-13
- 2026-11-25T21:10:17Z — row 28: created #52 for F-14
- 2026-11-25T21:10:17Z — row 29: created #53 for F-15
- 2026-11-25T21:13:12Z — row 8: #22 removed label `wontfix` (maintainer decision)
