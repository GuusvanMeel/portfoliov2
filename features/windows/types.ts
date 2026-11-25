import type { DisplayProject } from "@/app/Features/Projects/types";

export type AppType = "theme-switcher" | "projects" | "about" | "contact";

export type WindowState = {
  id: string;
  type: AppType;
  minimized: boolean;
  zIndex: number;
  project?: DisplayProject;
};

export type WindowManagerState = {
  windows: WindowState[];
  activeWindowId: string | null;
  highestZIndex: number;
};

export type WindowAction =
  | { type: "open"; id: string; appType: AppType; project?: DisplayProject }
  | { type: "focus"; id: string }
  | { type: "minimize"; id: string }
  | { type: "close"; id: string };
