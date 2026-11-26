/** Parses the ADMIN_EMAILS allowlist: comma-separated, trimmed, case-insensitive. */
export function parseAdminEmails(raw: string | undefined): string[] {
  if (!raw) return [];

  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

/** An empty allowlist means nobody is admin. */
export function isAdminEmail(email: string | undefined | null, allowlist: string[]): boolean {
  if (!email) return false;

  return allowlist.includes(email.trim().toLowerCase());
}
