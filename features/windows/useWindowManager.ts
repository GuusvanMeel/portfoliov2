"use client";

import { useCallback, useReducer } from "react";
import { mapProjectToDisplayproject } from "@/app/Features/Projects/mapper";
import type { Project } from "@/app/Features/Projects/types";
import type { AppType } from "@/features/windows/types";
import { initialWindowManagerState, windowReducer } from "@/features/windows/windowReducer";

/** Window state of the desktop: which windows are open, their stacking order and focus. */
export function useWindowManager() {
  const [state, dispatch] = useReducer(windowReducer, initialWindowManagerState);

  const openWindow = useCallback((appType: AppType, project?: Project) => {
    if (appType === "projects" && !project) {
      throw new Error("Project window requires a project");
    }

    dispatch({
      type: "open",
      id: `${appType}-${crypto.randomUUID()}`,
      appType,
      project: project ? mapProjectToDisplayproject(project) : undefined,
    });
  }, []);

  const focusWindow = useCallback((id: string) => dispatch({ type: "focus", id }), []);
  const minimizeWindow = useCallback((id: string) => dispatch({ type: "minimize", id }), []);
  const closeWindow = useCallback((id: string) => dispatch({ type: "close", id }), []);

  return {
    windows: state.windows,
    activeWindowId: state.activeWindowId,
    openWindow,
    focusWindow,
    minimizeWindow,
    closeWindow,
  };
}
