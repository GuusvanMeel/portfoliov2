import { afterEach, describe, expect, test } from "vitest";
import { cleanup, renderHook } from "vitest-browser-react";
import type { Project } from "@/features/projects/types";
import { useWindowManager } from "@/features/windows/useWindowManager";

const project: Project = {
  id: 3,
  title: "Portfolio",
  description: "A retro desktop portfolio",
  tags: ["Next.js"],
  duration: "3 months",
  imageSrc: "image.png",
  githubLink: "",
  desktopIconSrc: "icon.png",
  isVisible: true,
  updatedAt: "2026-01-01T00:00:00.000Z",
};

afterEach(() => {
  cleanup();
});

describe("useWindowManager", () => {
  test("starts with the contact window open and active", async () => {
    const { result } = await renderHook(() => useWindowManager());

    expect(result.current.windows).toHaveLength(1);
    expect(result.current.activeWindowId).toBe("Contact-startup");
  });

  test("opens a window with a type-prefixed id and makes it active", async () => {
    const { result, act } = await renderHook(() => useWindowManager());

    await act(() => result.current.openWindow("about"));

    const opened = result.current.windows.at(-1)!;
    expect(opened.id).toMatch(/^about-/);
    expect(result.current.activeWindowId).toBe(opened.id);
  });

  test("opens a projects window with the public project fields only", async () => {
    const { result, act } = await renderHook(() => useWindowManager());

    await act(() => result.current.openWindow("projects", project));

    const opened = result.current.windows.at(-1)!;
    expect(opened.project).toMatchObject({ id: 3, title: "Portfolio" });
    expect(opened.project).not.toHaveProperty("isVisible");
  });

  test("throws when a projects window is opened without a project", async () => {
    const { result } = await renderHook(() => useWindowManager());

    expect(() => result.current.openWindow("projects")).toThrow(
      "Project window requires a project",
    );
  });

  test("minimizes, focuses and closes windows", async () => {
    const { result, act } = await renderHook(() => useWindowManager());

    await act(() => result.current.minimizeWindow("Contact-startup"));
    expect(result.current.windows[0].minimized).toBe(true);
    expect(result.current.activeWindowId).toBeNull();

    await act(() => result.current.focusWindow("Contact-startup"));
    expect(result.current.windows[0].minimized).toBe(false);
    expect(result.current.activeWindowId).toBe("Contact-startup");

    await act(() => result.current.closeWindow("Contact-startup"));
    expect(result.current.windows).toEqual([]);
  });
});
