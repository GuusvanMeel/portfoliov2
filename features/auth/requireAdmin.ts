// Server-only: called by server actions and server components, never imported by client code.
import type { User } from "@supabase/supabase-js";
import { createServer } from "@/lib/supabase/server";
import { isAdminEmail, parseAdminEmails } from "@/features/auth/adminEmails";

export class NotAuthorisedError extends Error {
  constructor() {
    super("Not authorised");
    this.name = "NotAuthorisedError";
  }
}

/** The signed-in user verified by Supabase, or null. */
async function getCurrentUser(): Promise<User | null> {
  const supabase = await createServer();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;

  return data.user;
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = await getCurrentUser();

  return isAdminEmail(user?.email, parseAdminEmails(process.env.ADMIN_EMAILS));
}

/** Throws NotAuthorisedError unless a signed-in admin (on ADMIN_EMAILS) makes the request. */
export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();

  if (!user || !isAdminEmail(user.email, parseAdminEmails(process.env.ADMIN_EMAILS))) {
    throw new NotAuthorisedError();
  }

  return user;
}
