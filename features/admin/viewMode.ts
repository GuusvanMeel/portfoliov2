/** The only list of admin overview layouts; the type and validation are derived from it. */
export const viewModes = ["list", "grid"] as const;

export type ViewMode = (typeof viewModes)[number];

export function isViewMode(value: string | null | undefined): value is ViewMode {
  return value != null && (viewModes as readonly string[]).includes(value);
}

export const defaultViewMode: ViewMode = "list";

export const viewModeCookie = "admin-view";
