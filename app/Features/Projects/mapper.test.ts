import { describe, expect, test } from "vitest";
import {
  mapProjectRowToProject,
  mapProjectToDisplayproject,
  mapUpdateProjectInputToRow,
} from "./mapper";
import type { Project, ProjectInputData, ProjectRow } from "./types";

const row: ProjectRow = {
  id: 7,
  title: "Portfolio",
  description: "A retro desktop portfolio",
  desktop_icon_src: "icons/portfolio.png",
  tags: ["Next.js", "TypeScript"],
  is_visible: true,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-02-01T00:00:00.000Z",
  duration: "3 months",
  imagesrc: "https://res.cloudinary.com/demo/image/upload/v1/portfolio.png",
  Github_Link: "https://github.com/example/portfolio",
};

describe("mapProjectRowToProject", () => {
  test("maps every database column to the app field", () => {
    expect(mapProjectRowToProject(row)).toEqual({
      id: 7,
      title: "Portfolio",
      description: "A retro desktop portfolio",
      imageSrc: "https://res.cloudinary.com/demo/image/upload/v1/portfolio.png",
      githubLink: "https://github.com/example/portfolio",
      duration: "3 months",
      tags: ["Next.js", "TypeScript"],
      isVisible: true,
      updatedAt: "2026-02-01T00:00:00.000Z",
      desktopIconSrc: "icons/portfolio.png",
    });
  });

  test("turns missing tags into an empty list", () => {
    const withoutTags = { ...row, tags: null } as unknown as ProjectRow;
    expect(mapProjectRowToProject(withoutTags).tags).toEqual([]);
  });
});

describe("mapUpdateProjectInputToRow", () => {
  const input: ProjectInputData = {
    title: "Portfolio",
    description: "A retro desktop portfolio",
    tags: ["Next.js"],
    isVisible: false,
    duration: "3 months",
    imageSrc: "https://example.com/image.png",
    githubLink: "https://github.com/example/portfolio",
  };

  test("uses the database column names", () => {
    const result = mapUpdateProjectInputToRow(input);
    expect(result).toMatchObject({
      title: "Portfolio",
      description: "A retro desktop portfolio",
      tags: ["Next.js"],
      duration: "3 months",
      imagesrc: "https://example.com/image.png",
      Github_Link: "https://github.com/example/portfolio",
      is_visible: false,
    });
  });

  test("sets updated_at to an ISO timestamp", () => {
    const { updated_at } = mapUpdateProjectInputToRow(input);
    expect(new Date(updated_at).toISOString()).toBe(updated_at);
  });
});

describe("mapProjectToDisplayproject", () => {
  test("keeps only the public fields", () => {
    const project: Project = mapProjectRowToProject(row);
    const display = mapProjectToDisplayproject(project);

    expect(display).not.toHaveProperty("isVisible");
    expect(display).not.toHaveProperty("updatedAt");
    expect(display).toEqual({
      id: 7,
      title: "Portfolio",
      description: "A retro desktop portfolio",
      tags: ["Next.js", "TypeScript"],
      duration: "3 months",
      imageSrc: "https://res.cloudinary.com/demo/image/upload/v1/portfolio.png",
      githubLink: "https://github.com/example/portfolio",
      desktopIconSrc: "icons/portfolio.png",
    });
  });
});
