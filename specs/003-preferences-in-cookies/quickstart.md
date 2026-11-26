# Quickstart: Validating Preferences in Cookies

## Prerequisites

- Test environment set up as in spec 002 (test database, `.env.test`).
- `npm ci`

## Automated checks

```powershell
npm run test:components
```

Expected: tests for `lib/preferenceCookie.ts`, `features/theme/themeMigration.ts` and
`features/admin/viewMode.ts` pass (valid value, unknown value, empty, missing, legacy migration and removal).

```powershell
npm run test:db:reset
```

```powershell
npm run test:e2e
```

Expected: the desktop and admin specs pass, including the new first-render, migration,
invalid-cookie and admin-view tests (contract: [preference-cookies.md](contracts/preference-cookies.md)).

## Manual scenarios

1. Open `/`, pick Win98, reload with DevTools network throttling on: no WinXP frame appears; the
   page source (View Source) contains `data-theme="Win98"`; the console shows no hydration warning.
2. Delete the `theme` cookie, set `localStorage.theme = "classicMac"`, reload: classicMac is shown,
   a `theme` cookie exists, the localStorage key is gone. Reload again: no flash.
3. Set the cookie `theme=bogus`, reload: WinXP, no error.
4. In `/admin`, switch to grid, reload: grid from the first render (View Source shows `data-view="grid"`).
5. Block cookies for localhost, switch theme: it changes for the current view; reload shows WinXP.

## Sabotage (per constitution IX)

For each new or changed E2E test, temporarily break the behaviour (e.g. ignore the cookie in the
layout, skip the localStorage removal, drop the fallback, ignore `admin-view`), confirm the test
fails, restore, and log it in `verification.md`.

## Lighthouse

```powershell
npm run lighthouse:ci
```

Expected: no category score lower than the current baseline.
