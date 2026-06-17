import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { cleanup, render } from "vitest-browser-react";

import AdminProject from "./AdminProject";
import { deleteProject, updateProjectVisibility } from "@/app/Features/Projects/actions";
import type { Project } from "@/app/Features/Projects/types";

vi.mock("@/app/Features/Projects/actions", () => ({
  deleteProject: vi.fn(),
  updateProjectVisibility: vi.fn(),
}));

vi.mock("./editprojectform", () => ({
  default: ({
    project,
    Onsaved,
    Onclose,
  }: {
    project: Project | null;
    Onsaved: (project: Project) => void;
    Onclose: () => void;
  }) => (
    <div data-testid="edit-project-form">
      <p>{project ? "Edit project form" : "Create project form"}</p>

      <button
        type="button"
        onClick={() =>
          Onsaved({
            id: project?.id ?? 2,
            title: project?.title ?? "Created project",
            description: project?.description ?? "Created description",
            tags: project?.tags ?? ["created"],
            duration: project?.duration ?? "1 week",
            imageSrc: project?.imageSrc ?? "",
            githubLink: project?.githubLink ?? "",
            isVisible: project?.isVisible ?? true,
          } as Project)
        }
      >
        Mock save
      </button>

      <button type="button" onClick={Onclose}>
        Mock close
      </button>
    </div>
  ),
}));

const mockProject: Project = {
  id: 1,
  title: "Test project",
  description: "This is a test project",
  tags: ["nextjs", "supabase", "testing"],
  duration: "2 weeks",
  imageSrc: "/test-image.png",
  githubLink: "https://github.com/test/project",
  isVisible: true,
  updatedAt: "2026-06-17T00:00:00.000Z",
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe("AdminProject", () => {
  test("renders project information in list view", async () => {
    render(<AdminProject project={mockProject} />);

    await expect.element(page.getByRole("heading", { name: "Test project" })).toBeVisible();
    await expect.element(page.getByText("This is a test project")).toBeVisible();
    await expect.element(page.getByText("nextjs, supabase, testing")).toBeVisible();
    await expect.element(page.getByText("Visible")).toBeVisible();
    await expect.element(page.getByTitle("Open GitHub repo")).toBeVisible();
    await expect.element(page.getByAltText("Project preview")).toBeVisible();
  });

  test("renders project information in grid view", async () => {
    render(<AdminProject project={mockProject} view="grid" />);

    await expect.element(page.getByRole("heading", { name: "Test project" })).toBeVisible();
    await expect.element(page.getByText("This is a test project")).toBeVisible();
    await expect.element(page.getByText("nextjs")).toBeVisible();
    await expect.element(page.getByText("supabase")).toBeVisible();
    await expect.element(page.getByText("testing")).toBeVisible();
  });

  test("does not show GitHub button when githubLink is missing", async () => {
    render(
      <AdminProject
        project={{
          ...mockProject,
          githubLink: "",
        }}
      />
    );

    await expect.element(page.getByRole("heading", {name:"Test project"})).toBeVisible();
    await expect.element(page.getByTitle("Open GitHub repo")).not.toBeInTheDocument();
  });

  test("toggles project visibility", async () => {
    vi.mocked(updateProjectVisibility).mockResolvedValue(undefined);

    render(<AdminProject project={mockProject} />);

    await expect.element(page.getByText("Visible")).toBeVisible();

    await page.getByTitle("Hide").click();

    expect(updateProjectVisibility).toHaveBeenCalledWith(1, false);
    await expect.element(page.getByText("Hidden")).toBeVisible();
    await expect.element(page.getByTitle("Show")).toBeVisible();
  });

  test("does not delete project when confirm is cancelled", async () => {
    vi.spyOn(globalThis, "confirm").mockReturnValue(false);

    render(<AdminProject project={mockProject} />);

    await page.getByTitle("Delete").click();

    expect(deleteProject).not.toHaveBeenCalled();
    await expect.element(page.getByRole("heading",{name:  "Test project"})).toBeVisible();
  });

  test("deletes project when confirm is accepted", async () => {
    vi.spyOn(globalThis, "confirm").mockReturnValue(true);
    vi.mocked(deleteProject).mockResolvedValue(undefined);

    render(<AdminProject project={mockProject} />);

    await page.getByTitle("Delete").click();

    expect(deleteProject).toHaveBeenCalledWith(1);
    await expect.element(page.getByRole("header",{name:"Test project"})).not.toBeInTheDocument();
  });

  test("opens and closes the edit form", async () => {
    render(<AdminProject project={mockProject} />);

    await page.getByTitle("Edit").click();

    await expect.element(page.getByTestId("edit-project-form")).toBeVisible();
    await expect.element(page.getByText("Edit project form")).toBeVisible();

    await page.getByText("Mock close").click();

    await expect.element(page.getByTestId("edit-project-form")).not.toBeInTheDocument();
  });

  test("renders create form when project is null", async () => {
    const onCreated = vi.fn();
    const onCloseCreate = vi.fn();

    render(
      <AdminProject
        project={null}
        OnCreated={onCreated}
        OnCloseCreate={onCloseCreate}
      />
    );

    await expect.element(page.getByText("Create project form")).toBeVisible();

    await page.getByText("Mock save").click();

    expect(onCreated).toHaveBeenCalledOnce();
    expect(onCloseCreate).toHaveBeenCalledOnce();
  });
  test("shows fallback image when imageSrc is empty", async () => {
  render(
    <AdminProject
      project={{
        ...mockProject,
        imageSrc: "",
      }}
    />
  );

  await expect.element(page.getByAltText("Project preview")).not.toBeInTheDocument();
});
});