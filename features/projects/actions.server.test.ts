import { beforeEach, describe, expect, test, vi } from "vitest";
import type { ProjectInputData } from "@/features/projects/types";

const from = vi.fn();
const requireAdmin = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServer: async () => ({ from }),
}));

vi.mock("@/features/auth/requireAdmin", () => ({
  requireAdmin: () => requireAdmin(),
}));

const actions = await import("@/features/projects/actions");

const input: ProjectInputData = {
  title: "Title",
  description: "Description",
  tags: [],
  isVisible: true,
  duration: "1 week",
  imageSrc: "",
  githubLink: "",
};

const mutations = {
  createProject: () => actions.createProject(input),
  updateProject: () => actions.updateProject(1, input),
  updateProjectVisibility: () => actions.updateProjectVisibility(1, false),
  deleteProject: () => actions.deleteProject(1),
};

describe("project mutations refuse anyone who is not a signed-in admin", () => {
  beforeEach(() => {
    from.mockReset();
    requireAdmin.mockReset();
    requireAdmin.mockRejectedValue(new Error("Not authorised"));
  });

  test.each(Object.entries(mutations))("%s is refused and touches no data", async (_, run) => {
    await expect(run()).rejects.toThrow("Not authorised");
    expect(requireAdmin).toHaveBeenCalledTimes(1);
    expect(from).not.toHaveBeenCalled();
  });

  test("reading projects needs no admin", async () => {
    const query = {
      select: () => query,
      eq: () => query,
      order: async () => ({ data: [], error: null }),
    };
    from.mockReturnValue(query);

    await expect(actions.getVisibleProjects()).resolves.toEqual([]);
    expect(requireAdmin).not.toHaveBeenCalled();
  });
});
