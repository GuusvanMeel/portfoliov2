import { describe, expect, test } from "vitest";
import { projectImage } from "@/features/images/imageUrls";

const cloudinaryUrl = "https://res.cloudinary.com/demo/image/upload/v1/portfolio.png";

describe("Cloudinary transformations", () => {
  test.each([
    ["list", "f_auto,q_auto,w_128,h_128,c_fill"],
    ["grid", "f_auto,q_auto,w_800,h_450,c_fill"],
    ["formPreview", "f_auto,q_auto,w_600,h_300,c_fill"],
    ["window", "f_auto,q_auto,w_1000,c_limit"],
  ] as const)("%s inserts its transformation after /image/upload/", (size, transformation) => {
    expect(projectImage[size](cloudinaryUrl)).toBe(
      `https://res.cloudinary.com/demo/image/upload/${transformation}/v1/portfolio.png`,
    );
  });

  test("leaves non-Cloudinary URLs unchanged", () => {
    expect(projectImage.window("/local/image.png")).toBe("/local/image.png");
  });
});

describe("desktopIcon", () => {
  test("returns an empty string for an empty path", () => {
    expect(projectImage.desktopIcon("")).toBe("");
  });

  test.each(["https://cdn.example.com/icon.png", "http://cdn.example.com/icon.png"])(
    "uses a full URL as it is: %s",
    (url) => {
      expect(projectImage.desktopIcon(url)).toBe(url);
    },
  );

  test("builds a Supabase public storage URL and strips leading slashes", () => {
    expect(projectImage.desktopIcon("//icons/portfolio.png")).toMatch(
      /\/storage\/v1\/object\/public\/DesktopIcons\/icons\/portfolio\.png$/,
    );
  });
});
