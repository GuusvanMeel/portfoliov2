import { describe, expect, test } from "vitest";
import type { DisplayProject } from "@/app/Features/Projects/types";
import type { WindowManagerState } from "@/features/windows/types";
import {
  initialWindowManagerState,
  startupWindowId,
  windowReducer,
} from "@/features/windows/windowReducer";

const project: DisplayProject = {
  id: 1,
  title: "Portfolio",
  description: "A retro desktop portfolio",
  tags: ["Next.js"],
  duration: "3 months",
  imageSrc: "image.png",
  githubLink: "",
  desktopIconSrc: "icon.png",
};

function open(state: WindowManagerState, id: string) {
  return windowReducer(state, { type: "open", id, appType: "about" });
}

describe("initial state", () => {
  test("has one active contact window", () => {
    expect(initialWindowManagerState).toEqual({
      windows: [{ id: startupWindowId, type: "contact", minimized: false, zIndex: 0 }],
      activeWindowId: "Contact-startup",
      highestZIndex: 1,
    });
  });
});

describe("open", () => {
  test("appends a window at the highest z-index and makes it active", () => {
    const state = open(initialWindowManagerState, "about-1");

    expect(state.windows.at(-1)).toEqual({
      id: "about-1",
      type: "about",
      minimized: false,
      project: undefined,
      zIndex: 1,
    });
    expect(state.activeWindowId).toBe("about-1");
    expect(state.highestZIndex).toBe(2);
  });

  test("keeps the project for a projects window", () => {
    const state = windowReducer(initialWindowManagerState, {
      type: "open",
      id: "projects-1",
      appType: "projects",
      project,
    });

    expect(state.windows.at(-1)?.project).toEqual(project);
  });

  test("drops a project passed to another app type", () => {
    const state = windowReducer(initialWindowManagerState, {
      type: "open",
      id: "about-1",
      appType: "about",
      project,
    });

    expect(state.windows.at(-1)?.project).toBeUndefined();
  });

  test("throws when a projects window has no project", () => {
    expect(() =>
      windowReducer(initialWindowManagerState, { type: "open", id: "p", appType: "projects" }),
    ).toThrow("Project window requires a project");
  });
});

describe("focus", () => {
  test("moves the window above all others, restores it and makes it active", () => {
    let state = open(initialWindowManagerState, "about-1");
    state = windowReducer(state, { type: "minimize", id: startupWindowId });
    state = windowReducer(state, { type: "focus", id: startupWindowId });

    const contact = state.windows.find((window) => window.id === startupWindowId);
    expect(contact).toMatchObject({ minimized: false, zIndex: 3 });
    expect(state.activeWindowId).toBe(startupWindowId);
    expect(state.highestZIndex).toBe(3);
  });

  test("repeated focus keeps raising the z-order", () => {
    let state = open(initialWindowManagerState, "about-1");
    state = windowReducer(state, { type: "focus", id: startupWindowId });
    state = windowReducer(state, { type: "focus", id: "about-1" });

    const [contact, about] = state.windows;
    expect(about.zIndex).toBeGreaterThan(contact.zIndex);
    expect(state.activeWindowId).toBe("about-1");
  });
});

describe("minimize", () => {
  test("hides the window and clears the active window when it was active", () => {
    const state = windowReducer(initialWindowManagerState, {
      type: "minimize",
      id: startupWindowId,
    });

    expect(state.windows[0].minimized).toBe(true);
    expect(state.activeWindowId).toBeNull();
  });

  test("keeps another active window", () => {
    let state = open(initialWindowManagerState, "about-1");
    state = windowReducer(state, { type: "minimize", id: startupWindowId });

    expect(state.activeWindowId).toBe("about-1");
  });
});

describe("close", () => {
  test("removes the window and clears the active window when it was active", () => {
    const state = windowReducer(initialWindowManagerState, { type: "close", id: startupWindowId });

    expect(state.windows).toEqual([]);
    expect(state.activeWindowId).toBeNull();
  });

  test("keeps another active window", () => {
    let state = open(initialWindowManagerState, "about-1");
    state = windowReducer(state, { type: "close", id: startupWindowId });

    expect(state.windows.map((window) => window.id)).toEqual(["about-1"]);
    expect(state.activeWindowId).toBe("about-1");
  });
});
