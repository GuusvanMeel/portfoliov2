import { afterEach, describe, expect, test } from "vitest";
import { page } from "vitest/browser";
import { cleanup, render } from "vitest-browser-react";
import { useDesktopIconSelection } from "@/features/desktop/useDesktopIconSelection";

function SelectionProbe() {
  const { selectedIconId, select } = useDesktopIconSelection();

  return (
    <div>
      <button type="button" data-desktop-icon onClick={() => select("about")}>
        about
      </button>
      <button type="button" data-desktop-icon onClick={() => select("contact")}>
        contact
      </button>
      <p data-testid="background">background</p>
      <output>{selectedIconId ?? "none"}</output>
    </div>
  );
}

afterEach(() => {
  cleanup();
});

describe("useDesktopIconSelection", () => {
  test("starts without a selection", async () => {
    await render(<SelectionProbe />);

    await expect.element(page.getByRole("status")).toHaveTextContent("none");
  });

  test("selects the clicked icon and switches between icons", async () => {
    await render(<SelectionProbe />);

    await page.getByRole("button", { name: "about" }).click();
    await expect.element(page.getByRole("status")).toHaveTextContent("about");

    await page.getByRole("button", { name: "contact" }).click();
    await expect.element(page.getByRole("status")).toHaveTextContent("contact");
  });

  test("clears the selection on a press outside every icon", async () => {
    await render(<SelectionProbe />);

    await page.getByRole("button", { name: "about" }).click();
    await page.getByTestId("background").click();

    await expect.element(page.getByRole("status")).toHaveTextContent("none");
  });
});
