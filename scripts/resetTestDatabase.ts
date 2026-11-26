// Resets the TEST database to the committed seed: test users exist with the configured
// passwords, and the projects table holds exactly the seed rows.
// Usage: npm run test:db:reset   (also called by Cypress before every run)
// Runs in plain Node, so only relative `.ts` imports are used.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { loadLocalTestEnvFile, readTestEnvironment } from "../lib/testEnvironment.ts";
import { seedProjectRows } from "../supabase/seed/projects.ts";

async function ensureUser(admin: SupabaseClient, email: string, password: string) {
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw new Error(`listing test users failed: ${error.message}`);

  const existing = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
  if (existing) {
    const { error: updateError } = await admin.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
    });
    if (updateError) throw new Error(`updating ${email} failed: ${updateError.message}`);
    return;
  }

  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createError) throw new Error(`creating ${email} failed: ${createError.message}`);
}

export async function resetTestDatabase(
  env: Record<string, string | undefined> = process.env,
): Promise<{ projects: number; users: number }> {
  const config = readTestEnvironment(env);
  const admin = createClient(config.supabaseUrl, config.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  await ensureUser(admin, config.adminEmail, config.adminPassword);
  await ensureUser(admin, config.userEmail, config.userPassword);

  const { error: deleteError } = await admin.from("projects").delete().gte("id", 0);
  if (deleteError) throw new Error(`clearing projects failed: ${deleteError.message}`);

  const { data, error: insertError } = await admin
    .from("projects")
    .insert(seedProjectRows)
    .select("id");
  if (insertError) throw new Error(`inserting seed projects failed: ${insertError.message}`);

  return { projects: data?.length ?? 0, users: 2 };
}

const isDirectRun = process.argv[1]?.replace(/\\/g, "/").endsWith("scripts/resetTestDatabase.ts");

if (isDirectRun) {
  loadLocalTestEnvFile();
  resetTestDatabase()
    .then(({ projects, users }) => console.log(`Seeded ${projects} projects, ${users} test users`))
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : error);
      process.exit(1);
    });
}
