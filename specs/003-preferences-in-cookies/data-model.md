# Data Model: Theme and Admin View Preferences in Cookies

No database changes. Both preferences live only in browser cookies.

## Theme preference

| Field | Value |
|-------|-------|
| Cookie name | `theme` |
| Allowed values | `themeNames` from `features/theme/themeNames.ts` (`Win98`, `WinXP`, `classicMac`, `debug`) |
| Default | `WinXP` (`defaultTheme`) |
| Lifetime | 1 year, refreshed on every change |
| Attributes | `path=/`, `SameSite=Lax`, `Secure` on HTTPS, not `HttpOnly` |

**Validation**: anything not in `themeNames` (missing, empty, unknown, removed theme) → default.

## Admin view preference

| Field | Value |
|-------|-------|
| Cookie name | `admin-view` |
| Allowed values | `list`, `grid` (`viewModes` in `features/admin/viewMode.ts`) |
| Default | `list` |
| Lifetime / attributes | same as the theme cookie |

## Legacy theme value (read once)

| Field | Value |
|-------|-------|
| Location | `localStorage` key `theme` |
| Lifecycle | Read only when no valid theme cookie exists → if valid: written to cookie, then key removed; if invalid: key removed, nothing applied |

## Theme state transitions (first load)

```text
valid cookie            → render cookie theme on the server; localStorage untouched
no/invalid cookie
  ├─ valid legacy value → server renders default, client applies legacy theme once,
  │                       writes cookie, removes localStorage key
  └─ no/invalid legacy  → default theme; invalid legacy key removed
```
