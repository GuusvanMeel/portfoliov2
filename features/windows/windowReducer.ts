import type { WindowAction, WindowManagerState } from "@/features/windows/types";

export const startupWindowId = "Contact-startup";

export const initialWindowManagerState: WindowManagerState = {
  windows: [{ id: startupWindowId, type: "contact", minimized: false, zIndex: 0 }],
  activeWindowId: startupWindowId,
  highestZIndex: 1,
};

function clearActiveIf(activeWindowId: string | null, id: string) {
  return activeWindowId === id ? null : activeWindowId;
}

export function windowReducer(state: WindowManagerState, action: WindowAction): WindowManagerState {
  switch (action.type) {
    case "open": {
      if (action.appType === "projects" && !action.project) {
        throw new Error("Project window requires a project");
      }

      return {
        windows: [
          ...state.windows,
          {
            id: action.id,
            type: action.appType,
            minimized: false,
            project: action.appType === "projects" ? action.project : undefined,
            zIndex: state.highestZIndex,
          },
        ],
        activeWindowId: action.id,
        highestZIndex: state.highestZIndex + 1,
      };
    }

    case "focus":
      return {
        windows: state.windows.map((window) =>
          window.id === action.id
            ? { ...window, zIndex: state.highestZIndex + 1, minimized: false }
            : window,
        ),
        activeWindowId: action.id,
        highestZIndex: state.highestZIndex + 1,
      };

    case "minimize":
      return {
        ...state,
        windows: state.windows.map((window) =>
          window.id === action.id ? { ...window, minimized: true } : window,
        ),
        activeWindowId: clearActiveIf(state.activeWindowId, action.id),
      };

    case "close":
      return {
        ...state,
        windows: state.windows.filter((window) => window.id !== action.id),
        activeWindowId: clearActiveIf(state.activeWindowId, action.id),
      };
  }
}
