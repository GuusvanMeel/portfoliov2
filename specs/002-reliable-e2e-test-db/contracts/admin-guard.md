# Contract: Admin guard on project mutations

Applies to `createProject`, `updateProject`, `updateProjectVisibility`, `deleteProject` in
`features/projects/actions.ts`.

## Rule

Before any database call, the action calls `requireAdmin()` (server-only, `features/auth/requireAdmin.ts`):

| Caller | Result | Data changed |
|---|---|---|
| Not signed in | throws `NotAuthorisedError` ("Not authorised") | no |
| Signed in, email not in `ADMIN_EMAILS` | throws `NotAuthorisedError` | no |
| Signed in, email in `ADMIN_EMAILS` (case-insensitive) | continues as today | as today |
| `ADMIN_EMAILS` missing or empty | everyone refused | no |

- Identity comes from `supabase.auth.getUser()` (verified by Supabase), never from client input.
- Read actions (`getAllProjects`, `getVisibleProjects`) are unchanged.
- The admin UI shows the existing error messages (`text.visibilityFailed`, `text.deleteFailed`, save-failed message) when an action throws.
- `/admin` page uses the same check: a signed-in non-admin is redirected to `/` (main page, no admin UI).

## Tests

- Vitest: `adminEmails` parsing (empty, spaces, case); `requireAdmin` with mocked client for each row above; each of the 4 actions refuses and makes no DB call when the guard throws (sabotage: remove the call → test fails).
- Cypress: non-admin test user signs in → opening `/admin` lands on `/` with no admin UI.
