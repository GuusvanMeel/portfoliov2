# Spec 002: reliable end-to-end tests and a separate test database

Resolves #43, #44, #46, #53.

## What changes
- All tests (Cypress, Lighthouse admin login) use a separate Supabase **test** project, reset to a committed seed before every run. A guard refuses to run against the live database.
- Schema committed as `supabase/migrations/0001_initial_schema.sql` (applied manually, see below).
- `createProject`, `updateProject`, `updateProjectVisibility`, `deleteProject` refuse anyone who is not a signed-in admin on `ADMIN_EMAILS`. A signed-in non-admin opening `/admin` is sent to `/`.
- E2E audit, new tests (project window, contact form, admin error paths, start menu, taskbar, theme after reload, non-admin), no retries.
- Vitest node group for server-only code; `supebase_url` typo fixed; README testing section.

## Manual steps for the maintainer (before merging)
1. **Vercel → Environment Variables (Production + Preview): add `ADMIN_EMAILS` = your admin email.** Without it the live admin panel refuses every change.
2. Live project → Authentication: turn off "Allow new users to sign up".
3. Test project setup and GitHub secrets: `specs/002-reliable-e2e-test-db/quickstart.md` §1.
4. After merge and a green CI run: delete the old secrets `ADMIN_EMAIL`, `ADMIN_PASSWORD` and the local `cypress.env.json`.

## Migration
`supabase/migrations/0001_initial_schema.sql` is applied **only to the test project**, in the SQL editor. The live schema is unchanged.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
