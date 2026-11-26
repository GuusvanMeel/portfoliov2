# Contract: Preference Cookies and Module Interfaces

## Cookies (browser ↔ server)

```text
theme=<ThemeName>; Path=/; Max-Age=31536000; SameSite=Lax[; Secure]
admin-view=<list|grid>; Path=/; Max-Age=31536000; SameSite=Lax[; Secure]
```

The server treats any other value as absent and renders the default. It never errors on a bad value.

## Server-rendered markup

- The desktop root `[data-cy="desktop"]` carries `data-theme="<theme>"` in the server HTML.
- The admin overview carries the chosen view in the server HTML: the toggle button for the active
  view has `aria-pressed="true"`, and the project container exposes `data-view="<list|grid>"`.

## Module interfaces

```ts
// lib/preferenceCookie.ts (pure)
readPreference<T extends string>(raw: string | undefined, isValid: (v: string | null | undefined) => v is T, fallback: T): T
preferenceCookieString(name: string, value: string, secure: boolean): string
writePreferenceCookie(name: string, value: string): void   // best effort, never throws

// features/theme/themeMigration.ts (pure, takes a Storage-like object)
migrateLegacyTheme(storage: Pick<Storage, "getItem" | "removeItem">): ThemeName | null

// features/admin/viewMode.ts
viewModes = ["list", "grid"] as const; type ViewMode; isViewMode(); defaultViewMode = "list"

// ThemeProvider props
{ initialTheme: ThemeName; hasThemeCookie: boolean; children }

// ProjectList props (added)
{ initialView: ViewMode }
```
