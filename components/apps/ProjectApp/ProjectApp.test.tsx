import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { cleanup, render } from "vitest-browser-react";
import ProjectApp from "@/components/apps/ProjectApp/ProjectApp";
import { ThemeProvider } from "@/features/theme/ThemeProvider";
import type { DisplayProject } from "@/features/projects/types";

vi.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

const project: DisplayProject = {
  id: 1,
  title: "Portfolio",
  description: "A retro desktop portfolio",
  tags: ["Next.js", "TypeScript"],
  duration: "3 months",
  imageSrc: "/wallpapers/WinXP.jpg",
  githubLink: "https://github.com/example/portfolio",
  desktopIconSrc: "icon.png",
};

function renderProject(overrides: Partial<DisplayProject> = {}) {
  return render(
    <ThemeProvider>
      <ProjectApp {...project} {...overrides} />
    </ThemeProvider>,
  );
}

afterEach(() => {
  cleanup();
});

describe("ProjectApp", () => {
  test("shows the project details in the landscape layout", async () => {
    await renderProject();

    await expect.element(page.getByRole("heading", { name: "Portfolio" })).toBeVisible();
    await expect.element(page.getByText("Next.js")).toBeVisible();
    await expect.element(page.getByText("3 months")).toBeVisible();
    await expect.element(page.getByText("A retro desktop portfolio")).toBeVisible();
    await expect
      .element(page.getByRole("link", { name: "◈ View source on GitHub" }))
      .toHaveAttribute("href", "https://github.com/example/portfolio");
    await expect.element(page.getByRole("img", { name: "Portfolio" })).toBeInTheDocument();
  });

  test.each(["Block", "Mobile", "Landscape"])("switches to the %s layout", async (layout) => {
    await renderProject();

    await page.getByRole("button", { name: layout }).click();

    await expect.element(page.getByRole("heading", { name: "Portfolio" })).toBeInTheDocument();
    await expect.element(page.getByText("TypeScript")).toBeInTheDocument();
  });

  test("hides the GitHub link when there is none", async () => {
    await renderProject({ githubLink: "" });

    await expect.element(page.getByRole("link")).not.toBeInTheDocument();
  });
});
