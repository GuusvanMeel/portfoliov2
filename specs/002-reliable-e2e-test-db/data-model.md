# Data Model: Reliable End-to-End Tests and a Separate Test Database

No change to the live schema. This documents the schema the migration must reproduce, the seed and
the configuration.

## `public.projects` (reproduced by `supabase/migrations/0001_initial_schema.sql`)

| Column | Type | Rules |
|---|---|---|
| `id` | bigint identity, PK | |
| `title` | text, not null | test-created rows start with `TEST_PROJECT_PREFIX` |
| `description` | text | |
| `desktop_icon_src` | text | |
| `tags` | text[] | default `{}` |
| `is_visible` | boolean, not null, default false | visible rows become desktop `.exe` icons |
| `duration` | text | |
| `imagesrc` | text | name kept as-is (rename is F-2, out of scope) |
| `Github_Link` | text | quoted identifier, kept as-is |
| `created_at` | timestamptz, default now() | list ordering (desc) |
| `updated_at` | timestamptz, default now() | set by app on update |

Row-level security (must match the live export, verified in quickstart §1):
- `select`: anon + authenticated may read visible rows; authenticated may read all rows.
- `insert` / `update` / `delete`: authenticated only.

Exact column types, defaults and policies are taken from the live schema export; any difference
found is fixed in the migration, never in the live database.

## Seed (`supabase/seed/projects.ts`)

| Key | Title | Visible | Purpose |
|---|---|---|---|
| `visibleA` | `Seed Visible Project A` | yes | project window test (icon → window shows title, description, tags) |
| `visibleB` | `Seed Visible Project B` | yes | second icon; admin edit/visibility tests |
| `hidden` | `Seed Hidden Project` | no | must not appear on desktop; admin list shows it |

Images use existing public URLs (Cloudinary host already allowed) so no storage upload is needed.

## Test users (Supabase Auth, created/updated by the reset script)

| Role | Email source | Password source | On `ADMIN_EMAILS`? |
|---|---|---|---|
| Admin | `TEST_ADMIN_EMAIL` | `TEST_ADMIN_PASSWORD` | yes |
| Non-admin | `TEST_USER_EMAIL` | `TEST_USER_PASSWORD` | no |

## Configuration

See [contracts/test-environment.md](./contracts/test-environment.md) for the full variable list.

## State: test database lifecycle

`empty project` → (apply migrations) → `schema ready` → (reset) → `seeded` → (E2E run mutates) → `dirty` → (reset at next run start) → `seeded`
