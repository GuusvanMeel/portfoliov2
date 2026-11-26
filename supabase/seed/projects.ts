// Seed data for the test database. Runs in plain Node (reset script) and in Cypress, so it uses
// no `@/` imports. Tests refer to these titles instead of guessing what the database contains.

export type SeedProjectRow = {
  title: string;
  description: string;
  desktop_icon_src: string;
  tags: string[];
  is_visible: boolean;
  duration: string;
  imagesrc: string;
  Github_Link: string;
};

const image =
  "https://res.cloudinary.com/dnfdgzek3/image/upload/v1776412550/Screenshot_2026-04-17_095441_nalrgu.png";

export const seedProjects = {
  visibleA: {
    title: "Seed Visible Project A",
    description: "First visible seed project. Opens as a window from its desktop icon.",
    desktop_icon_src: image,
    tags: ["seed-tag-a", "typescript"],
    is_visible: true,
    duration: "2 weeks",
    imagesrc: image,
    Github_Link: "https://github.com/GuusvanMeel/portfoliov2",
  },
  visibleB: {
    title: "Seed Visible Project B",
    description: "Second visible seed project. Used by the admin edit and visibility tests.",
    desktop_icon_src: image,
    tags: ["seed-tag-b", "react"],
    is_visible: true,
    duration: "1 month",
    imagesrc: image,
    Github_Link: "https://github.com/GuusvanMeel/portfoliov2",
  },
  hidden: {
    title: "Seed Hidden Project",
    description: "Hidden seed project. Must never appear on the desktop.",
    desktop_icon_src: image,
    tags: ["seed-tag-hidden"],
    is_visible: false,
    duration: "3 days",
    imagesrc: image,
    Github_Link: "https://github.com/GuusvanMeel/portfoliov2",
  },
} satisfies Record<string, SeedProjectRow>;

export const seedProjectRows: SeedProjectRow[] = Object.values(seedProjects);
