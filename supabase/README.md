# supabase/

Database schema and test seed for GuusOS.

- `migrations/` — the schema as SQL, applied **manually** in the Supabase SQL editor, in file-name order.
- `seed/projects.ts` — the projects the **test** database is reset to before every end-to-end run.

The live database is never changed by tests. Tests only use the separate test project (see
`specs/002-reliable-e2e-test-db/quickstart.md`).

## Apply migrations to a new (test) project

1. Open the project in Supabase → SQL editor.
2. Paste and run each file in `migrations/`, oldest first.
3. Run `npm run test:db:reset` to create the test users and load the seed.

## Rebuild the test table

Only in the **test** project, when a migration file changed after it was applied:

```sql
drop table if exists public.projects cascade;
```

Then run every file in `migrations/` again, oldest first, and `npm run test:db:reset`.

## Compare with the live schema

Run this in the **live** project's SQL editor (read-only) and compare the result with the
migrations. Fix differences in a migration file, never in the live database.

```sql
select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public' and table_name = 'projects'
order by ordinal_position;

select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'projects';
```
