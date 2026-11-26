# Feature Specification: Theme and Admin View Preferences in Cookies

**Feature Branch**: `003-preferences-in-cookies`

**Created**: 2026-11-26

**Status**: Draft

**Input**: User description: "Theme and admin view preferences in cookies. The first server render always matches what the visitor sees, so a reload never flashes the default theme and causes no hydration warnings. Theme in a cookie (issue #20) with a one-time move from localStorage; admin list/grid view in a cookie (issue #22); invalid values fall back to the defaults; theme switcher and theme buttons keep working."

## Clarifications

### Session 2026-11-26

- Q: After a visitor's theme has been moved from localStorage to the cookie, should the old localStorage value be deleted? → A: Yes, delete it right after it is written to the cookie.
- Q: Should the admin list/grid choice be remembered per browser, or per admin account across devices? → A: Per browser, stored only in the cookie.
- Q: When cookies are blocked, should a theme the visitor picks stay for just the current page view, or fall back to localStorage? → A: Current page view only; no localStorage fallback.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Chosen theme is shown from the very first paint (Priority: P1)

A visitor picks a theme (via the theme switcher window or the always-visible theme buttons). When they reload or come back later, the page appears in their chosen theme immediately, without first showing the default WinXP theme.

**Why this priority**: This is the visible bug behind issue #20 and the core goal of the spec: the server render must match what the visitor sees (constitution principle VI).

**Independent Test**: Choose a non-default theme, reload, and inspect the HTML delivered by the server: it already carries the chosen theme, and no hydration warning appears.

**Acceptance Scenarios**:

1. **Given** a visitor who selected a non-default theme, **When** they reload the page, **Then** the server-delivered page is already in that theme and the default theme is never shown.
2. **Given** a visitor who never chose a theme, **When** they open the site, **Then** they see the WinXP theme, exactly as today.
3. **Given** a visitor on any page, **When** they change the theme with the theme switcher window or with the theme buttons, **Then** the theme changes immediately, as it does today, and the choice is remembered for later visits.

---

### User Story 2 - Existing visitors keep their theme (Priority: P2)

A returning visitor whose theme choice was saved by the old mechanism (browser local storage) still gets that theme after the change. Their choice is moved to the new storage once; afterwards the new storage is the only source.

**Why this priority**: Without it, every returning visitor would silently lose their theme, which is a visible regression.

On the single migration load the server cannot see local storage, so the default theme is shown briefly once before the saved theme is applied; every load after that is flash-free.

**Independent Test**: Start with only an old-style stored theme and no cookie, open the site, and verify the theme is kept and is now stored in the cookie; the next reload renders it from the server.

**Acceptance Scenarios**:

1. **Given** a visitor with a valid theme in the old storage and no theme cookie, **When** they open the site, **Then** they see that theme, it is saved in the cookie, and the old stored value is removed.
2. **Given** a visitor who has been migrated, **When** they reload, **Then** the server renders their theme on the first render.
3. **Given** a visitor with both a cookie and an old stored value, **When** they open the site, **Then** the cookie wins and the old value does not overwrite it.
4. **Given** a visitor with an invalid value in the old storage, **When** they open the site, **Then** nothing is migrated and the default (or cookie) theme is used without errors.

---

### User Story 3 - Admin overview remembers list or grid view (Priority: P3)

The site owner, signed in to the admin area, switches the project overview between list and grid. After a reload the same view is shown immediately, without flashing the other view first.

**Why this priority**: Admin-only convenience (issue #22); fewer people affected than the theme.

**Independent Test**: As admin, switch to grid, reload, and verify the server-delivered overview is already in grid view.

**Acceptance Scenarios**:

1. **Given** an admin who chose grid view, **When** they reload the project overview, **Then** the overview is rendered in grid view from the first render.
2. **Given** an admin who never chose a view, **When** they open the overview, **Then** list view is shown.

---

### Edge Cases

- A theme cookie or view cookie with an unknown, empty, or malformed value falls back to the default (WinXP theme, list view) without errors or warnings, and the page still renders.
- Cookies disabled or blocked: the site renders the defaults and theme switching still works for the current page view only; there is no local-storage fallback, so the next load shows the default; nothing breaks.
- A theme that is removed from the site in the future but still stored in a visitor's cookie is treated as unknown and falls back to the default.
- Browser local storage unavailable (e.g. private mode restrictions) during migration: no error; the visitor simply gets the cookie or default theme.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The selected theme MUST be stored in a cookie instead of browser local storage.
- **FR-002**: The server MUST read the theme cookie and render the chosen theme on the first render, so the server-delivered HTML matches what the visitor sees and causes no hydration warnings.
- **FR-003**: When no valid theme cookie exists but a valid theme is found in the old local storage, the system MUST move it to the cookie exactly once and apply it; the old local-storage value MUST be deleted immediately after it is written to the cookie.
- **FR-004**: The admin project overview's list/grid choice MUST be stored per browser in a cookie only (no database storage) and rendered by the server on the first render.
- **FR-005**: Unknown, empty or malformed cookie values MUST fall back to the defaults (WinXP theme, list view) without errors.
- **FR-006**: The set of valid theme values MUST come from the single source of truth for theme names (constitution principle II).
- **FR-007**: The theme switcher window and the always-visible theme buttons MUST keep their current behaviour and appearance.
- **FR-008**: The preference cookies MUST hold only the preference value (no personal data) and persist across browser sessions for a long period (assumed one year).
- **FR-009**: There MUST be no other visible changes for visitors, and Lighthouse scores MUST NOT regress.
- **FR-010**: Unit tests MUST cover cookie value reading/validation and the one-time migration from local storage.
- **FR-011**: End-to-end tests MUST cover: the chosen theme present in the server-rendered HTML after a reload; the local-storage migration; an invalid cookie falling back to the default; the admin view surviving a reload. The existing "theme after reload" test MUST be updated to check the first render, not only the end state.
- **FR-012**: Every new or changed end-to-end test MUST be sabotaged locally to prove it fails, and each sabotage MUST be logged in the spec's verification notes.
- **FR-013**: When the spec is done, GitHub issues #20 and #22 and `docs/backlog.md` MUST be updated.

### Key Entities

- **Theme preference**: the visitor's chosen theme; one of the site's defined theme names; default WinXP.
- **Admin view preference**: the overview layout; `list` or `grid`; default list.
- **Legacy theme value**: the theme previously stored in browser local storage; read once for migration only.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 100% of reloads with a saved theme cookie, the first server-delivered page already shows the chosen theme (zero flashes of the default theme).
- **SC-002**: Zero hydration warnings related to theme or admin view on reload.
- **SC-003**: 100% of returning visitors with a valid legacy stored theme keep that theme after the change.
- **SC-004**: The admin overview shows the saved view on the first render after 100% of reloads.
- **SC-005**: Invalid stored values never produce an error page or console error; the default is shown instead.
- **SC-006**: Lighthouse performance, accessibility, SEO and best-practices scores are equal to or better than before.
- **SC-007**: Every new or changed end-to-end test has a logged sabotage run that failed as expected.

## Assumptions

- The cookies are functional preference cookies only; no consent banner is introduced by this spec.
- Cookie lifetime is one year, refreshed when the preference changes.
- Rendering the page per request (reading cookies on the server) is acceptable for Lighthouse, which is verified by FR-009/SC-006.
- Defaults stay as today: WinXP theme, list view.
