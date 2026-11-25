# Spec Kit prompts

Ready-to-paste input for the first Spec Kit runs. Run them in this order:

1. `/speckit-constitution` with the **Constitution** block below.
2. `/speckit-specify` with the **Spec 001** block below.
3. Optional `/speckit-clarify`, then `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`.

---

## Constitution

```text
Project: GuusOS — a personal developer portfolio built with Next.js (App Router), React,
TypeScript, Tailwind CSS v4, CSS modules and Supabase. The site imitates a classic desktop
operating system. Visitors can switch the look between historic OS styles (Windows 98,
Windows XP, classic Mac OS, more later). Projects appear as ".exe" icons on the desktop and
open in windows; other small "apps" (e.g. a notepad) may be added later. A separate mobile
experience will imitate a mobile OS instead of shrinking the desktop.

Write these principles:

I. The OS metaphor comes first
- Every user-facing feature is expressed as part of the OS: a desktop icon, an app, a window,
  the taskbar, the start menu or a system setting.
- App content (About, Contact, Project details, future apps) is written once and is unaware of
  the chrome around it, so the same content can be shown in a desktop window and in the future
  mobile OS shell.

II. Themes are data
- Everything that differs between OS themes (colors, borders, shadows, fonts, icons, wallpapers)
  lives in theme definitions, never in components.
- Components never branch on a theme name. Adding a theme means adding one theme definition
  plus its assets, with no component changes.
- Theme names have a single source of truth; types and validation are derived from it.

III. Fixed styling responsibilities
- Theme-specific appearance: Tailwind classes inside the theme definitions.
- Layout and structure (sizes, spacing, flex/grid, positioning): a CSS module that belongs to the
  component. A component only imports its own CSS module, never another component's.
- No inline style objects except for values computed at runtime (e.g. z-index, position).

IV. Logic separate from views
- State and behaviour (window management, focus/z-order, selection, persistence) live in hooks or
  feature modules under the features folder; components mainly render.
- Keep components small and single-purpose; split a file once it handles more than one concern.

V. Server-first data and security
- Supabase is accessed only on the server (server actions / server components) through the
  feature's actions module. Client components never create a Supabase client for data access.
- Database rows are converted to app types through mappers; database naming (snake_case) never
  leaks into components.
- Admin routes and mutations are protected server-side (proxy + auth check in every mutation),
  not only hidden in the UI. Secrets stay in environment variables.

VI. Hydration-safe rendering
- The server render must match the first client render. Browser-only storage (localStorage,
  window size) must not decide server-rendered markup.
- Persistent user preferences that affect rendering (theme, view modes) are stored in cookies so
  the server can render them.

VII. English now, ready for other languages
- All code, identifiers, comments, commit messages, specs and site content are in English.
- User-facing text is not scattered as literals through components: it is kept in a central place
  (e.g. a content/messages module per feature) so a Dutch version or a dynamic language switch
  can be added later without rewriting components. Do not add an i18n library until a language
  feature is actually specified.
- The html lang attribute and metadata locale match the content language.

VIII. Accessibility and SEO are requirements
- Desktop icons, windows, taskbar and menus are usable with the keyboard and have accessible
  names. Interactive elements are real buttons/links.
- The page keeps meaningful server-rendered content (headings, descriptions) for screen readers
  and search engines, even though the visual experience is an interactive desktop.
- Lighthouse accessibility, SEO and best-practices scores must not regress.

IX. Automated testing and the CI pipeline are part of the product
- The GitHub Actions pipeline (.github/workflows/main.yml) is the definition of "done". It runs:
  ESLint, TypeScript (tsc --noEmit), Vitest component tests in a real browser (Playwright/Chromium)
  with coverage, next build, Cypress end-to-end tests with coverage, Lighthouse CI and a SonarQube
  (SonarCloud) quality gate fed by the Vitest and Cypress coverage reports.
- Test layers and what they cover:
  - Vitest (browser mode): components, hooks (window manager, selection, theme) and pure logic
    such as mappers. Test files live next to the code as *.test.ts(x).
  - Cypress: user flows end to end — the desktop experience (open, focus, minimize, restore and
    close windows, switch themes, open project .exe icons) and the admin flows (login, create,
    edit, toggle visibility, delete project).
  - Lighthouse CI: accessibility is a hard gate (>= 0.90); performance, best practices and SEO
    must not regress below their configured thresholds.
  - SonarQube: the quality gate must pass; coverage on new code must not drop.
- Every spec states which test layers it adds or changes, and its tasks include writing those
  tests. New or changed logic gets tests; a bug fix gets a test that fails without the fix.
- Feature work must pass the full pipeline (including end-to-end and Lighthouse) before it is
  merged into Development or master, not only after.
- Tests never depend on production data they can damage: end-to-end tests that write data clean up
  after themselves and run against a database/environment intended for testing.
- Pipeline and test configuration are kept as clean as the application code: no dead or
  commented-out steps, no duplicated tool configs, and changes to them are reviewed like code.
- One code formatter configuration is used for the whole repository.

X. Consistent conventions
- Components: PascalCase file and folder names. Hooks: useXxx.ts. Functions and variables:
  camelCase. Non-component folders: lowercase. Plural file names for collections of the same
  kind (actions.ts, types.ts) are used everywhere, not mixed with singular forms.
- Imports use the @/ alias instead of long relative paths.

XI. Keep it simple
- No new dependency without a stated reason in the plan; prefer the platform and existing
  libraries. Experiments (e.g. comparing drag libraries) happen in their own spec.
- Remove dead code, placeholder content and unused files instead of leaving them behind.

Governance: the constitution overrides individual specs. Changes to it are made via
/speckit-constitution with a version bump and a short rationale. The backlog lives in GitHub
Issues of GuusvanMeel/portfoliov2; specs reference the issues they resolve.
```

---

## Spec 001 — Codebase cleanup

```text
Feature: Codebase cleanup and alignment with the constitution (spec 001).

Why: The portfolio works and feels stable, but it grew organically. Naming, folder structure,
styling approach, language and data naming are inconsistent, and the main Desktop component
mixes several concerns. Before new features (taskbar, mobile OS, more themes, project windows)
are built, the codebase should follow the constitution so future specs build on a clean base.

The visitor must not notice any change except the fixes listed under "Behaviour changes".

Scope — structure and naming
- Make folder and file naming consistent with the constitution (e.g. the "Features" folder,
  lowercase "taskbar" next to PascalCase component folders, singular/plural file names such as
  action.ts vs actions.ts and type.ts vs types.ts, lowercase component file names such as
  editprojectform.tsx, PascalCase function names that are not components).
- Use the @/ import alias consistently and fix import ordering (e.g. a dynamic import used
  before "next/dynamic" is imported).
- Add one formatter configuration and format the whole codebase in a separate commit, so real
  changes stay reviewable.
- Add a .gitattributes so line endings are consistent (shell scripts must keep LF).

Scope — separation of concerns
- Split the Desktop component: window management (open, close, minimize, focus, z-order, active
  window) and desktop icon selection move into dedicated hooks; Desktop only composes the UI.
- Keep app content (About, Contact, Project) independent of window chrome.
- Remove duplicated logic in the projects server actions where queries only differ by a filter.

Scope — themes and styling
- Create a single source of truth for theme names; derive the ThemeName type and validation from
  it instead of repeating the list.
- Split the large theme definition file so each theme lives in its own file, and group the theme
  properties by area (window, project content, taskbar, desktop) instead of one flat list.
- Apply the styling rule: theme appearance in theme definitions, layout in the component's own
  CSS module. Components that borrow another component's CSS module get their own.
- Remove inconsistent indentation and leftover blank lines in the theme files.

Scope — language
- Translate Dutch comments and identifiers to English.
- Make all site content and metadata English and set the html lang and Open Graph locale to
  English.
- Move user-facing text out of components into a central content location so a Dutch or dynamic
  language version can be added later (no i18n library yet).

Scope — data
- Rename the inconsistent Supabase columns to snake_case (e.g. imagesrc -> image_src,
  Github_Link -> github_link) through a SQL migration file committed to the repo, and update the
  row type and mappers. Document the manual step: the migration must be run in Supabase before
  the new code is deployed (or in the same release window).

Scope — dead code and placeholders
- Remove or clearly handle placeholders and dead code: the permanently rendered theme switcher
  versus the theme-switcher window, start menu items that do nothing, the "About me" placeholder
  content, commented-out CI steps, and dependencies that are unused or in the wrong section
  (test libraries listed under dependencies instead of devDependencies).
  Where removing would change visible behaviour, keep it and list it as a follow-up instead.

Scope — automated testing and CI pipeline
- Add Cypress end-to-end coverage for the desktop experience before refactoring it, so the
  cleanup is protected by tests: open a window from a desktop icon, focus/z-order, minimize and
  restore via the taskbar, close, switch themes (and theme persistence after reload), open a
  project .exe window.
- Add Vitest tests for the extracted hooks (window manager, icon selection), the theme
  name/validation logic, the theme cookie logic and the project mappers.
- Run the full pipeline (including Cypress and Lighthouse) for pull requests into Development and
  master, so Spec Kit feature branches are fully tested before merge, not only after.
- Make the SonarQube quality gate actually block (it currently uses continue-on-error), or
  document clearly why it is advisory; decide which branches it runs on.
- Remove the duplicated Babel configuration (.babelrc always enables istanbul, babel.config.js
  enables it only for coverage). Instrumentation must only happen for coverage builds, and normal
  builds should use Next's default compiler.
- Remove the commented-out cache steps or turn them into working Next.js build caching.
- Translate the Dutch text in the pipeline summaries to English.
- Verify which database the Cypress admin tests write to and make sure it is not production data
  that can be damaged (document the test environment in the README).
- Keep test file placement and naming consistent with the constitution.

Behaviour changes (the only allowed visible changes)
- Resolves GitHub issue #20: the selected theme is stored in a cookie and read on the server, so
  a page refresh renders the chosen theme immediately without a flash or hydration mismatch.
  Existing localStorage values are migrated once to the cookie.

Out of scope (separate specs later)
- Mobile OS (#30), full resize (#32), taskbar features (#17), new themes (#11), boot screen (#19),
  ghosting effects (#23), drag library comparison (#21), admin view persistence (#22),
  project window content (#15), About/Contact migration (#16), an actual Dutch translation.

Acceptance
- The full CI pipeline passes on the pull request: lint, typecheck, Vitest, build, Cypress,
  Lighthouse (accessibility >= 0.90, others not below thresholds) and the SonarQube quality gate.
- New desktop end-to-end tests exist and were green before the refactor started.
- Window behaviour (open, close, minimize, focus, drag, taskbar restore), theme switching, the
  admin flow and project display behave exactly as before.
- New hooks (window manager, icon selection) and the theme cookie logic have tests.
- No Dutch comments or identifiers remain; no component imports another component's CSS module;
  no component checks a theme name.
- Each step lands in a small commit so the cleanup can be reviewed and reverted piece by piece.
```
