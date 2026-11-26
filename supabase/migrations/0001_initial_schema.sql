-- 0001_initial_schema.sql
-- Reproduces the schema the application uses today (spec 002, data-model.md).
-- Applied manually in the Supabase SQL editor, in file-name order. See supabase/README.md.
-- Never run against the live project: the live schema already exists and is the source of truth.

create table if not exists public.projects (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  desktop_icon_src text,
  tags text[] default '{}',
  is_visible boolean not null default false,
  duration text,
  imagesrc text,
  "Github_Link" text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.projects enable row level security;

-- Visitors (anon) and signed-in users can read visible projects.
create policy "Visible projects are public"
  on public.projects for select
  to anon, authenticated
  using (is_visible);

-- Signed-in users can read every project (admin list).
create policy "Authenticated users read all projects"
  on public.projects for select
  to authenticated
  using (true);

-- Signed-in users can change projects. The app additionally checks the admin allowlist
-- (ADMIN_EMAILS) in every server action before it reaches the database.
create policy "Authenticated users insert projects"
  on public.projects for insert
  to authenticated
  with check (true);

create policy "Authenticated users update projects"
  on public.projects for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users delete projects"
  on public.projects for delete
  to authenticated
  using (true);
