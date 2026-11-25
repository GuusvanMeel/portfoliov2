# Feature Specification: Foundation Refactor and Backlog

**Feature Branch**: `001-foundation-refactor`

**Created**: 2026-11-25

**Status**: Draft

**Input**: User description: "spec 001, Bekijk het hele project, en refactor alles zodat het op een
best practice manier is opgebouwd, kijk tevens naar de issues in github en maak een backlog document
aan, stel vragen waar nodig maar deze spec gaat echt alleen om alles klaarzetten voor de toekomst,
geen nieuwe features"

## Overview

GuusOS works and feels stable, but it grew organically. This spec prepares the whole project for
future work: it restructures the codebase according to best practices and constitution v1.0.0, and
turns the GitHub issues into one clear, prioritized backlog document. **No new features are added
and visitors notice no change.**

Current state found during the project review (2026-11-25), which this spec addresses:

- **Mixed responsibilities**: the desktop component manages windows, focus order and icon selection
  itself; the admin project component handles viewing, creating and editing at once.
- **Themes repeated and incomplete**: the list of theme names exists in three places; all theme
  styling sits in one large flat file; the taskbar loads theme icons that only exist for two of the
  four themes.
- **Styling mixed up**: some components borrow another component's layout styles.
- **Inconsistent naming**: e.g. `Features` vs `components`, `action.ts` vs `actions.ts`,
  `type.ts` vs `types.ts`, lowercase component files, event props such as `Onsaved` and
  `OnCloseCreate`, and a non-server helper file named `actions`.
- **Language mixed**: Dutch comments and site texts next to English, while the page declares
  English; user-facing texts are spread through components.
- **Configuration scattered**: the site address is hard-coded in three places; the contact form's
  external endpoint is hard-coded in a component.
- **Dead and debug code**: an unused FPS counter, constant debug switches in the project window,
  duplicated keyboard and click-outside handlers, duplicated data queries.
- **Security relies on the database alone**: data-changing server functions do not check that the
  caller is the admin themselves; the login page talks to the auth service from the browser.
  (Recorded for the backlog; not changed in this spec.)
- **Tooling**: no formatter, no line-ending rules, two overlapping build configurations, test
  libraries listed as runtime dependencies, commented-out pipeline steps, Dutch pipeline messages.
- **Tests**: the desktop itself (windows, taskbar, themes) has no automated tests; only the admin
  flows are covered.
- **Backlog out of date**: several open GitHub issues are partly or fully done in the code (e.g.
  #11 theme system, #15 project windows, #16 contact window, #17 taskbar), there are no priorities
  or milestones, and some issues mix languages.

## Clarifications

### Session 2026-11-25

- Q: Should the GitHub issues be updated to match the backlog, or stay untouched? → A: Update
  them: close issues that are done, tick completed checkboxes, add priority labels, translate Dutch
  text and create issues for new follow-ups; the full list of changes is shown to the maintainer for
  approval before anything is changed on GitHub.
- Q: Should small bug fixes the refactor touches (#20 theme flash after reload, missing taskbar icons
  for two themes) be fixed here? → A: No. Pure refactor with zero visible changes; both go to the
  backlog.
- Q: Should inconsistently named project fields in the database be renamed? → A: No. The database
  stays as it is; the inconsistency stays hidden behind the data conversion layer and the rename is
  a backlog item.
- Q: Which database should automated tests run against, given the admin tests create and delete a
  project in the live database? → A: Keep the live database, but make cleanup guaranteed: test data
  is removed before and after every run, also when a test fails midway. A separate test database is
  a backlog item.
- Q: How should this spec be delivered? → A: One pull request per user story into the development
  branch, in order: tests (US1) → refactor (US2) → backlog and GitHub update (US3) → tooling and
  pipeline (US4).
- Q: Should sign-in move to the server and should data-changing server functions check the admin
  session themselves? → A: No. All authentication and authorization changes go to the backlog; this
  spec does not change how sign-in or data protection works.

## User Scenarios & Testing *(mandatory)*

Actors:

- **Visitor**: someone (often a recruiter) browsing the portfolio desktop.
- **Maintainer**: the portfolio owner, who builds future features and manages projects in admin.
- **Reviewer**: someone reading the repository to judge code quality.

### User Story 1 - Current behaviour is locked in by automated tests (Priority: P1)

Before anything is restructured, the maintainer has automated tests that capture how the desktop
works today: opening windows from desktop icons, bringing a window to the front, minimizing and
restoring from the taskbar, closing, switching themes and opening a project's `.exe` icon. Together
with the existing admin tests, they prove after every refactoring step that nothing changed.

**Why this priority**: a refactor of "everything" is only safe if behaviour is checked
automatically. This is preparation, not a feature: it adds no visitor-facing behaviour.

**Independent Test**: run the new desktop tests and existing admin tests against the unmodified
site; all pass.

**Acceptance Scenarios**:

1. **Given** the home page, **When** a visitor double-clicks a desktop icon, **Then** the matching
   window opens, is in front and is the active taskbar entry.
2. **Given** two open windows, **When** the visitor clicks the one behind, **Then** it moves to the
   front and becomes the active taskbar entry.
3. **Given** an open window, **When** it is minimized and its taskbar entry is clicked, **Then** it
   disappears and reappears in front.
4. **Given** an open window, **When** it is closed via its own button or the taskbar, **Then** it
   disappears from the desktop and the taskbar.
5. **Given** any theme, **When** another theme is chosen, **Then** windows, taskbar and desktop show
   that theme's look.
6. **Given** a visible project, **When** its `.exe` icon is double-clicked, **Then** a window with
   that project's details opens; hidden projects have no icon.

---

### User Story 2 - The maintainer works in a clean, best-practice codebase (Priority: P1)

The maintainer opens the repository and finds one consistent structure: every responsibility in one
obvious place (window behaviour, icon selection, theme definitions, layout styles, user-facing
texts, data access, site configuration), consistent naming, English throughout, one formatting
style and no dead code. Adding a new theme, desktop app or window type later is a small, predictable
change.

**Why this priority**: this is the core of the request: getting everything ready for the future.

**Independent Test**: a reviewer checks the codebase against the constitution and the review list in
the Overview and finds no remaining violations; all User Story 1 tests still pass.

**Acceptance Scenarios**:

1. **Given** the refactored codebase, **When** a reviewer lists files and folders, **Then** every name
   follows the constitution's conventions.
2. **Given** the refactored codebase, **When** a reviewer inspects visual components, **Then** none
   contains window-management state, none checks a theme name, and none uses another component's
   layout styles.
3. **Given** a new theme is added in a scratch branch, **When** only a theme definition, its assets
   and its entry in the single theme list are added, **Then** it appears in the theme switcher and is
   applied everywhere, without editing any component.
4. **Given** the refactored codebase, **When** a reviewer searches comments, identifiers and site
   text, **Then** no Dutch remains, and all user-facing text is found in the central content location.
5. **Given** the site address or contact endpoint changes, **When** the maintainer updates it, **Then**
   exactly one place needs editing.
6. **Given** the refactored site, **When** visitors and the maintainer use it, **Then** everything
   behaves and looks as before.

---

### User Story 3 - The maintainer has one clear backlog (Priority: P2)

The maintainer opens a backlog document in the repository and sees every open piece of future work:
each GitHub issue with its real current status (checked against the code), a short English
description, a priority, its dependencies and the order in which to tackle it as future specs.
Follow-ups discovered during this refactor (visible placeholders, ideas outside scope) are in it too.

**Why this priority**: it directs all future specs, but the codebase work can start without it.

**Independent Test**: compare the backlog document with the GitHub issue list and the code; every
open issue appears exactly once with a status that matches the code.

**Acceptance Scenarios**:

1. **Given** the backlog document, **When** the maintainer reads it, **Then** every open GitHub issue
   is listed with number, link, title, status (not started / partly done / done in code), priority
   and dependencies.
2. **Given** an issue whose work is already (partly) present in the code, **When** it is listed,
   **Then** the document states what is done and what remains.
3. **Given** follow-ups found during the refactor, **When** the maintainer reads the backlog, **Then**
   each is listed with a proposed title and why it was left out of this spec.
4. **Given** the backlog, **When** the maintainer plans the next spec, **Then** a recommended order of
   future specs is available.
5. **Given** the backlog is complete, **When** the proposed GitHub changes are prepared, **Then** the
   maintainer first sees the full list (issues to close, checkboxes to tick, labels, translations,
   new issues) and nothing on GitHub changes until the maintainer approves.
6. **Given** the maintainer approved the changes, **When** they are applied, **Then** the GitHub
   issues match the backlog document: done issues closed, checkboxes ticked, every open issue has a
   priority label and English text, and every follow-up exists as an issue.

---

### User Story 4 - Tooling and pipeline are clean and fully check every change (Priority: P3)

The reviewer finds one formatter configuration, defined line endings, a single build configuration
without test instrumentation in production builds, dependencies in the right category, and a
pipeline with no commented-out steps and English messages. Every pull request into the development
or main branch runs all checks, including the end-to-end tests and the audit.

**Why this priority**: improves trust and safety for future work, but has less direct impact than
stories 1–2.

**Independent Test**: a reviewer reads the tooling and pipeline configuration and finds no
duplicates or dead steps; a pull request with a deliberately failing end-to-end test fails.

**Acceptance Scenarios**:

1. **Given** a pull request into the development branch, **When** it is opened, **Then** all checks
   run, including end-to-end tests and the audit.
2. **Given** a production build, **When** it is created, **Then** it contains no test instrumentation.
3. **Given** the pipeline definition, **When** it is read, **Then** it has no commented-out steps and
   all messages are in English.

### Edge Cases

- A theme without its own taskbar icons (classic Mac, debug) shows broken images today: this stays
  as it is in this spec and is recorded in the backlog.
- The theme briefly shows the default after a reload (#20): unchanged in this spec, stays in the
  backlog.
- Applying GitHub changes fails halfway (e.g. lost connection or missing permission): the backlog
  document records which changes were applied, so the rest can be retried without duplicates.
- A visible placeholder (always-visible theme switcher next to the theme switcher window, start menu
  entries without an action, "About me" placeholder text, layout buttons in the project window) would
  disappear through cleanup: it stays as it is and is listed in the backlog instead.
- A refactoring step breaks a desktop or admin test: the step is not merged until all tests pass.
- Zero visible projects: the desktop still renders the fixed icons.
- An admin test fails after creating its test project: the next run (and the failed run's own
  teardown) removes the leftover test project, so it never stays visible on the live portfolio for
  longer than one test run.
- An issue on GitHub is ambiguous about whether it is done: the backlog marks it "needs decision"
  instead of guessing.

## Requirements *(mandatory)*

### Functional Requirements

**Safety net**

- **FR-001**: Automated end-to-end tests MUST cover all desktop scenarios in User Story 1 and MUST pass
  against the site before restructuring starts.
- **FR-002**: Component-level tests MUST cover window behaviour (open, close, minimize, restore, focus
  order, active window), desktop icon selection, theme name validation and the conversion of stored
  project data to displayed project data.
- **FR-003**: Every refactoring step MUST keep all existing and new tests passing.
- **FR-003a**: Tests that create data in the live database MUST use clearly recognisable test data and
  MUST remove all such test data before and after every run, including after a failed or aborted
  run. Desktop tests MUST NOT write data.

**Structure and responsibilities**

- **FR-004**: Window management and desktop icon selection MUST be separated from the desktop's visual
  composition.
- **FR-005**: The admin project overview MUST separate viewing, creating and editing into
  single-purpose parts; repeated behaviour (closing on Escape, closing on outside click) MUST exist
  once and be reused.
- **FR-006**: Data access MUST be consolidated so queries that only differ by a filter share one
  implementation; helpers that are not server functions MUST NOT be named or placed as such.
- **FR-007**: App content (About, Contact, Project details) MUST stay independent of window chrome, so
  it can be reused by a future mobile shell.

**Themes and styling**

- **FR-008**: Theme names MUST be defined in exactly one place, with validation derived from it.
- **FR-009**: Each theme MUST be defined in its own unit, with its settings grouped by area (window,
  project content, taskbar, desktop) and including its own assets (icons, wallpaper) or an explicit
  fallback.
- **FR-010**: Components MUST NOT check theme names; theme appearance comes from theme definitions and
  layout from the component's own layout styles; no component uses another component's layout styles.

**Conventions, language and configuration**

- **FR-011**: All files, folders, components, functions and event properties MUST follow the
  constitution's naming conventions.
- **FR-012**: All comments, identifiers, site content and page metadata MUST be in English; page
  language and locale MUST be English.
- **FR-013**: All user-facing text MUST be kept in a central content location, so a Dutch or dynamic
  language version can be added later; no translation library is introduced.
- **FR-014**: Site-wide settings (site address, external endpoints such as the contact form service)
  MUST be defined in one place.
- **FR-015**: Dead code (unused components, constant debug switches, unused dependencies) MUST be
  removed; visible placeholders MUST stay and be listed in the backlog.

**Authentication and authorization**

- **FR-016**: Sign-in and data protection MUST keep working exactly as today; restructuring may move
  code but MUST NOT change authentication or authorization logic.
- **FR-017**: The security findings (no admin check inside data-changing server functions, sign-in
  from the browser) MUST be recorded as backlog items.

**Tooling and pipeline**

- **FR-018**: One formatter configuration MUST be applied to the whole codebase, in a change separate
  from other changes.
- **FR-019**: Line endings MUST be defined repository-wide so scripts work on every operating system.
- **FR-020**: There MUST be a single build configuration; test instrumentation only in coverage runs;
  test libraries listed as development dependencies.
- **FR-021**: The full pipeline MUST run for pull requests into the development and main branches; the
  pipeline MUST contain no commented-out steps and only English messages.

**Backlog document**

- **FR-022**: A backlog document MUST be added to the repository listing every open GitHub issue with
  number, link, English title and summary, real status checked against the code, what is done and
  what remains, priority, dependencies and a recommended order of future specs.
- **FR-023**: The backlog MUST include follow-ups discovered during this spec (visible placeholders,
  known bugs such as #20 and the missing taskbar icons, the database field renaming, out-of-scope
  improvements), each with a reason.
- **FR-023a**: The GitHub issues MUST be brought in line with the backlog: issues that are done in
  code closed with a short explanation, completed checkboxes ticked, a priority label on every open
  issue, Dutch issue text translated to English and an issue created for each follow-up.
- **FR-023b**: Before any GitHub change, the complete list of proposed changes MUST be presented to the
  maintainer, and only approved changes are applied.

**Scope boundaries**

- **FR-024**: No new features and no bug fixes MUST be included: everything visitors and the
  maintainer see stays exactly as it is, including known bugs (#20 theme flash after reload, missing
  taskbar icons for two themes). These are recorded in the backlog.
- **FR-025**: The database structure MUST NOT change. Inconsistently named project fields stay as
  they are and are translated in the data conversion layer only; renaming them is a backlog item.
- **FR-026**: Each user story MUST be delivered as its own pull request into the development branch,
  in the order US1 → US2 → US3 → US4; within a pull request, each logical step is a small, separately
  revertible commit. A pull request is merged only when the full pipeline passes.

### Key Entities

- **Theme**: a named OS look (Windows 98, Windows XP, classic Mac, debug) with settings grouped by
  area and its own assets.
- **Window**: an open app instance on the desktop: type, minimized state, stacking order, active flag.
- **Desktop app definition**: what an icon opens: title, icon, default size and position, content.
- **Project**: a portfolio item shown as an `.exe` icon and in a window; edited in admin.
- **Content entry**: a piece of user-facing text, stored centrally by key.
- **Site settings**: site address and external endpoints, defined once.
- **Backlog item**: an open piece of work: source (GitHub issue or refactor follow-up), status,
  priority, dependencies, recommended order.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the desktop scenarios in User Story 1 and all existing admin scenarios pass
  before the refactor and after every step of it.
- **SC-002**: 0 visible changes for visitors and the maintainer, and 0 database changes.
- **SC-003**: Adding a new theme requires edits in 0 existing components.
- **SC-004**: 0 Dutch comments, identifiers or site texts and 0 naming-convention violations remain.
- **SC-005**: 0 components contain window-management state, theme-name checks or another component's
  layout styles.
- **SC-006**: Site address and contact endpoint are each defined in exactly 1 place.
- **SC-007**: Sign-in, sign-out and the admin route protection behave identically before and after
  (all authorization end-to-end scenarios pass unchanged).
- **SC-008**: 100% of open GitHub issues appear in the backlog exactly once, with a status that matches
  the code; after approval, 100% of approved GitHub changes are applied and 0 unapproved changes are
  made.
- **SC-009**: Code coverage is equal to or higher than before; accessibility audit score stays at or
  above 0.90.
- **SC-010**: The full pipeline passes on every pull request of this spec.

## Assumptions

- The live site, admin panel and existing tests work today.
- "No new features" means no new visitor-facing or admin-facing capabilities; tests, structure,
  tooling and documentation are preparation and therefore in scope. Security changes are not.
- The admin area keeps its own dark, non-OS look; it is outside the OS metaphor.
- The default theme stays Windows XP and the debug theme stays available.
- English is the site language (constitution VII); a Dutch version is a future feature.
- End-to-end tests keep running against the live database (with guaranteed cleanup, FR-003a); a
  separate test database is a backlog item.
- The maintainer's GitHub access allows editing issues and labels in this repository.
- Out of scope (backlog items): theme persistence fix (#20), missing taskbar icons for classic Mac and
  debug, database field renaming, a separate test database, admin checks in data-changing server
  functions, server-side sign-in, mobile OS (#30), full resize (#32), taskbar features (#17), more themes
  (#11), boot screen (#19), drag library comparison (#21), admin view preference (#22), ghosting
  (#23), per-component styling (#24), pinball (#12), project window content (#15), About content
  (#16), Dutch translation.
