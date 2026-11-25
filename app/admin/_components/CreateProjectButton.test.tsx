import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { cleanup, render } from "vitest-browser-react";

import CreateProjectButton from "@/app/admin/_components/CreateProjectButton";
import type { Project } from "@/features/projects/types";

vi.mock("@/features/projects/actions", () => ({
  createProject: vi.fn(),
  updateProject: vi.fn(),
}));

vi.mock("@/app/admin/_components/ProjectFormDialog", () => ({
  default: ({
    project,
    onSaved,
    onClose,
  }: {
    project: Project | null;
    onSaved: (project: Project) => void;
    onClose: () => void;
  }) => (
    <div data-testid="edit-project-form">
      <p>{project ? "Edit project form" : "Create project form"}</p>

      <button
        type="button"
        onClick={() =>
          onSaved({
            id: 2,
            title: "Created project",
            description: "Created description",
            tags: ["created"],
            duration: "1 week",
            imageSrc: "",
            githubLink: "",
            isVisible: true,
            desktopIconSrc: "",
            updatedAt: "2026-06-17T00:00:00.000Z",
          })
        }
      >
        Mock save
      </button>

      <button type="button" onClick={onClose}>
        Mock close
      </button>
    </div>
  ),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("CreateProjectButton", () => {
  test("opens the create form, reports the created project and closes", async () => {
    const onCreated = vi.fn();

    render(<CreateProjectButton onCreated={onCreated} />);

    await page.getByText("Create New Project").click();
    await expect.element(page.getByText("Create project form")).toBeVisible();

    await page.getByText("Mock save").click();

    expect(onCreated).toHaveBeenCalledOnce();
    expect(onCreated).toHaveBeenCalledWith(expect.objectContaining({ title: "Created project" }));
    await expect.element(page.getByTestId("edit-project-form")).not.toBeInTheDocument();
  });

  test("closes the create form with the close button", async () => {
    render(<CreateProjectButton />);

    await page.getByText("Create New Project").click();
    await page.getByText("Mock close").click();

    await expect.element(page.getByTestId("edit-project-form")).not.toBeInTheDocument();
  });

  test("closes the create form with Escape", async () => {
    render(<CreateProjectButton />);

    await page.getByText("Create New Project").click();
    await expect.element(page.getByTestId("edit-project-form")).toBeVisible();

    globalThis.window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    await expect.element(page.getByTestId("edit-project-form")).not.toBeInTheDocument();
  });
});
