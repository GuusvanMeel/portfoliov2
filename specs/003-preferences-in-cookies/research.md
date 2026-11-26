# Research: Theme and Admin View Preferences in Cookies

## R-1 Where the server reads the theme

- **Decision**: The root layout (`app/layout.tsx`) reads the `theme` cookie with `cookies()` from
  `next/headers`, validates it and passes `initialTheme` to `ThemeProvider`, which uses it as the
  initial state.
- **Rationale**: The layout wraps every page, so the first render of the desktop (and its
  `data-theme` attribute) already uses the chosen theme. No inline script or CSS trick is needed.
- **Alternatives considered**: An inline `<script>` that sets the theme before paint (rejected:
  the React tree would still render the default on the server, so hydration would not match);
  reading the cookie in `proxy.ts` and rewriting (rejected: more moving parts for the same result).

## R-2 Rendering mode and Lighthouse

- **Decision**: Accept that reading cookies makes the layout render per request.
- **Rationale**: The home page and admin page already fetch projects from Supabase per request on
  the server, so they are already dynamic; reading one more cookie adds no measurable cost.
  `robots.ts` and `sitemap.ts` are route handlers outside the layout and stay static. Lighthouse
  CI in the pipeline verifies there is no regression (SC-006).
- **Alternatives considered**: Partial prerendering with the theme in a Suspense boundary
  (rejected: the theme affects the whole desktop, so nearly everything would sit inside the
  boundary anyway).

## R-3 How the client writes the cookie

- **Decision**: The client writes the cookie directly with `document.cookie` when the theme or
  view changes: `path=/`, `max-age=31536000` (one year), `SameSite=Lax`, plus `Secure` on HTTPS.
  Not `HttpOnly`, because the browser writes it.
- **Rationale**: Instant, no server round trip, no server action needed for a value that holds no
  personal data. The next request carries it to the server.
- **Alternatives considered**: A server action that sets the cookie (rejected: adds a network
  request to every theme click for no security gain); the Cookie Store API (rejected: not in all
  supported browsers).

## R-4 One-time migration from localStorage

- **Decision**: The server tells `ThemeProvider` whether a valid theme cookie was present. If not,
  a mount effect reads `localStorage.theme`; when it is a valid theme name it applies it, writes
  the cookie and removes the localStorage key (clarification Q1). An invalid legacy value is
  ignored (and removed). If a valid cookie exists, localStorage is not read at all.
- **Rationale**: Only visitors without a cookie pay the one-time cost; for them a single default →
  saved-theme switch happens once (unavoidable, since the server cannot see localStorage), and
  every later load is flash-free.
- **Alternatives considered**: Migrating in `proxy.ts` (impossible: the server cannot read
  localStorage).

## R-5 Shared cookie helpers and validation

- **Decision**: One small pure module, `lib/preferenceCookie.ts`, with `readPreference(value,
  isValid, fallback)` and `preferenceCookieString(name, value, secure)`. Theme validation reuses
  `isThemeName` from `features/theme/themeNames.ts` (single source of truth, principle II). The
  admin view gets `features/admin/viewMode.ts` with `viewModes = ["list", "grid"] as const`,
  `isViewMode` and `defaultViewMode = "list"`, replacing the local `View` type in `ProjectList`.
- **Rationale**: Pure functions are easy to unit test in Vitest (FR-010) and keep logic out of
  components (principle IV).

## R-6 Admin view

- **Decision**: `app/admin/page.tsx` reads the `admin-view` cookie, validates it and passes
  `initialView` to `ProjectList`; `setView` updates state and writes the cookie. Per browser only
  (clarification Q2).
- **Rationale**: Same pattern as the theme; no database change.

## R-7 Blocked cookies

- **Decision**: Writing the cookie is best effort inside a `try`; the state change still applies
  for the current page view. No localStorage fallback (clarification Q3).

## R-8 Testing "no flash" in Cypress

- **Decision**: Assert on the raw server HTML with `cy.request("/")` (sending the cookie) and check
  that the body contains `data-theme="Win98"` — this proves the first render, not the end state.
  The existing "keeps the chosen theme after a page reload" test gets this check added. The same
  approach covers the admin view (`cy.request("/admin")` with the session cookies) and the invalid
  cookie fallback (`data-theme="WinXP"`). The migration test seeds `localStorage.theme` via
  `onBeforeLoad`, then checks the cookie with `cy.getCookie("theme")` and that the key is gone.
- **Rationale**: `cy.reload()` alone only sees the final DOM after hydration, so it cannot detect a
  flash; the raw HTML can.
