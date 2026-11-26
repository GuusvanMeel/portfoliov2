/** Preference cookies live for one year and are refreshed on every change. */
export const preferenceCookieMaxAge = 60 * 60 * 24 * 365;

/** Returns the cookie value when it is valid, otherwise the fallback. Never throws. */
export function readPreference<T extends string>(
  raw: string | undefined,
  isValid: (value: string | null | undefined) => value is T,
  fallback: T,
): T {
  return isValid(raw) ? raw : fallback;
}

export function preferenceCookieString(name: string, value: string, secure: boolean): string {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${preferenceCookieMaxAge}`,
    "SameSite=Lax",
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

/**
 * Writes a preference cookie from the browser. Best effort: when cookies are blocked the
 * preference only lasts for the current page view, and nothing throws.
 */
export function writePreferenceCookie(name: string, value: string): void {
  try {
    document.cookie = preferenceCookieString(name, value, location.protocol === "https:");
  } catch {
    // Cookies blocked: the in-memory state still applies.
  }
}
