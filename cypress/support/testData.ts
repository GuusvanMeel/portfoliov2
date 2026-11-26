import { seedProjects } from "../../supabase/seed/projects";

export { seedProjects };

/** Titles of projects created by tests start with this, so they are easy to recognise. */
export const TEST_PROJECT_PREFIX = "CYPRESS TEST";

export const testProject = {
  title: `${TEST_PROJECT_PREFIX} PROJECT`,
  description: "Project created by the end-to-end tests in the test database.",
  tags: "tag1, tag2, tag 3",
  duration: "2 weeks",
  imageUrl:
    "https://res.cloudinary.com/dnfdgzek3/image/upload/v1776412550/Screenshot_2026-04-17_095441_nalrgu.png",
  githubUrl: "https://github.com/GuusvanMeel/Next-Episode-WPF",
};

export const editedProject = {
  title: `${TEST_PROJECT_PREFIX} PROJECT - edited title`,
  description: "Edited description from the end-to-end tests.",
  tags: "edited-tag, tag2, tag 3",
  duration: "edited duration",
};
