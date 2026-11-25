# GuusOS Constitution

GuusOS is a personal developer portfolio that imitates a classic desktop operating system.
Visitors switch the look between historic OS styles (Windows 98, Windows XP, classic Mac OS and
more later). Projects appear as `.exe` icons on the desktop and open in windows; small extra apps
(e.g. a notepad) may follow. A separate mobile experience will imitate a mobile OS instead of
shrinking the desktop.

## Core Principles

### I. The OS Metaphor Comes First

- Every user-facing feature MUST be expressed as part of the OS: a desktop icon, an app, a window,
  the taskbar, the start menu or a system setting.
- App content (About, Contact, Project details, future apps) MUST be written once and MUST NOT
  depend on the chrome around it, so the same content renders in a desktop window and in the
  future mobile OS shell.

Rationale: the OS illusion is the product; reusable content keeps desktop and mobile in sync.

### II. Themes Are Data

- Everything that differs between OS themes (colors, borders, shadows, fonts, icons, wallpapers)
  MUST live in theme definitions, never in components.
- Components MUST NOT branch on a theme name. Adding a theme MUST require only a new theme
  definition plus its assets, with no component changes.
- Theme names MUST have a single source of truth; types and validation are derived from it.

Rationale: themes are the core feature and will keep growing; they must be cheap and safe to add.

### III. Fixed Styling Responsibilities

- Theme-specific appearance MUST be expressed as Tailwind classes inside theme definitions.
- Layout and structure (sizes, spacing, flex/grid, positioning) MUST live in a CSS module owned by
  the component. A component MUST import only its own CSS module, never another component's.
- Inline style objects are allowed only for values computed at runtime (e.g. z-index, position).

Rationale: one obvious place for every style decision prevents drift between themes.

### IV. Logic Separate From Views

- State and behaviour (window management, focus/z-order, selection, persistence) MUST live in
  hooks or feature modules under the features folder; components primarily render.
- A component file that handles more than one concern MUST be split.

Rationale: small, testable units make the window manager and future shells maintainable.

### V. Server-First Data and Security

- Supabase MUST be accessed only on the server (server actions / server components) through the
  feature's actions module. Client components MUST NOT create a Supabase client for data access.
- Database rows MUST be converted to app types through mappers; database naming (snake_case) MUST
  NOT leak into components.
- Admin routes and mutations MUST be protected server-side (proxy plus an auth check in every
  mutation), not only hidden in the UI. Secrets MUST stay in environment variables.

Rationale: the admin panel writes to a live database; protection cannot rely on the client.

### VI. Hydration-Safe Rendering

- The server render MUST match the first client render. Browser-only state (localStorage, window
  size) MUST NOT decide server-rendered markup.
- Persistent preferences that affect rendering (theme, view modes) MUST be stored in cookies so
  the server can render them.

Rationale: hydration mismatches cause flashes and React errors that break the illusion.

### VII. English Now, Ready for Other Languages

- All code, identifiers, comments, commit messages, specs and site content MUST be in English.
- User-facing text MUST be kept in a central place (e.g. a content/messages module per feature),
  not scattered as literals through components, so a Dutch version or a dynamic language switch
  can be added later without rewriting components.
- An i18n library MUST NOT be added until a language feature is specified.
- The `html lang` attribute and metadata locale MUST match the content language.

Rationale: an English portfolio reaches the widest audience while keeping a Dutch option open.

### VIII. Accessibility and SEO Are Requirements

- Desktop icons, windows, taskbar and menus MUST be usable with the keyboard and have accessible
  names. Interactive elements MUST be real buttons or links.
- The page MUST keep meaningful server-rendered content (headings, descriptions) for screen
  readers and search engines alongside the interactive desktop.
- Lighthouse accessibility, SEO and best-practices scores MUST NOT regress.

Rationale: a portfolio must be findable and usable by everyone, including recruiters' tooling.

### IX. Automated Testing and the CI Pipeline Are Part of the Product

- The GitHub Actions pipeline (`.github/workflows/main.yml`) is the definition of "done". It runs
  ESLint, TypeScript (`tsc --noEmit`), Vitest component tests in a real browser
  (Playwright/Chromium) with coverage, `next build`, Cypress end-to-end tests with coverage,
  Lighthouse CI and a SonarQube (SonarCloud) quality gate fed by Vitest and Cypress coverage.
- Test layers:
  - Vitest (browser mode): components, hooks (window manager, selection, theme) and pure logic
    such as mappers. Test files live next to the code as `*.test.ts(x)`.
  - Cypress: end-to-end user flows — the desktop experience (open, focus, minimize, restore and
    close windows, switch themes, open project `.exe` icons) and the admin flows (login, create,
    edit, toggle visibility, delete project).
  - Lighthouse CI: accessibility is a hard gate (>= 0.90); performance, best practices and SEO
    MUST NOT fall below their configured thresholds.
  - SonarQube: the quality gate MUST pass; coverage on new code MUST NOT drop.
- Every spec MUST state which test layers it adds or changes, and its tasks MUST include writing
  those tests. New or changed logic MUST get tests; a bug fix MUST get a test that fails without
  the fix.
- Feature work MUST pass the full pipeline (including end-to-end and Lighthouse) before it is
  merged into `Development` or `master`.
- Tests MUST NOT depend on production data they can damage: end-to-end tests that write data
  clean up after themselves and run against an environment intended for testing.
- Pipeline and test configuration MUST be kept as clean as application code: no dead or
  commented-out steps, no duplicated tool configs; changes are reviewed like code.
- One code formatter configuration MUST be used for the whole repository.

Rationale: automated testing is a showcase skill of this portfolio and the safety net for every
refactor.

### X. Consistent Conventions

- Components: PascalCase file and folder names. Hooks: `useXxx.ts`. Functions and variables:
  camelCase. Non-component folders: lowercase.
- Collection files use plural names everywhere (`actions.ts`, `types.ts`); singular and plural
  forms MUST NOT be mixed.
- Imports MUST use the `@/` alias instead of long relative paths.

Rationale: predictable names make the codebase easy to navigate for the author and reviewers.

### XI. Keep It Simple

- A new dependency MUST have a stated reason in the plan; prefer the platform and existing
  libraries. Experiments (e.g. comparing drag libraries) happen in their own spec.
- Dead code, placeholder content and unused files MUST be removed rather than left behind.

Rationale: a small, clean codebase is easier to evolve and reflects well on the author.

## Technology Stack & Constraints

- Framework: Next.js (App Router) with React and TypeScript in strict mode.
- Styling: Tailwind CSS v4 (theme definitions) and CSS modules (layout), per Principle III.
- Data and auth: Supabase via `@supabase/ssr`, server-side only, per Principle V.
- Windowing: `react-rnd` for drag behaviour until a spec decides otherwise.
- Testing: Vitest browser mode with Playwright, Cypress with code coverage, Lighthouse CI,
  SonarCloud.
- Hosting: Vercel. Node.js 22 in CI.
- Database schema changes MUST be committed as SQL migration files, and the manual step to apply
  them in Supabase MUST be documented in the spec and the pull request.

## Development Workflow & Quality Gates

- Work is planned with Spec Kit: `/speckit-specify` → (`/speckit-clarify`) → `/speckit-plan` →
  `/speckit-tasks` → `/speckit-implement`. Each spec gets its own numbered feature branch.
- The backlog lives in GitHub Issues of `GuusvanMeel/portfoliov2`; specs MUST reference the issues
  they resolve, and tasks MAY be published as issues.
- Feature branches merge into `Development` via pull request; `Development` merges into `master`
  for release. A pull request is mergeable only when the full CI pipeline passes.
- Every plan MUST pass the Constitution Check; any deviation MUST be listed with a justification
  in the plan's complexity tracking.
- Commits are small and focused; mechanical changes (formatting, renames) are committed separately
  from behavioural changes.

## Governance

- This constitution supersedes individual specs, plans and habits. Where they conflict, the
  constitution wins until it is amended.
- Amendments are made with `/speckit-constitution`, include a short rationale and bump the
  version: MAJOR for removing or redefining a principle, MINOR for adding a principle or
  materially expanding guidance, PATCH for clarifications and wording.
- Every pull request and code review MUST check compliance with these principles.

**Version**: 1.0.0 | **Ratified**: 2026-11-25 | **Last Amended**: 2026-11-25
