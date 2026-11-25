import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { cleanup, render } from "vitest-browser-react";
import ContactApp from "@/components/apps/ContactApp/ContactApp";
import { contactFormEndpoint } from "@/config/site";
import { ThemeProvider } from "@/features/theme/ThemeProvider";

async function fillAndSend() {
  await page.getByLabelText("Your name:").fill("Ada");
  await page.getByLabelText("Your email:").fill("ada@example.com");
  await page.getByLabelText("Your message:").fill("Hello");
  await page.getByRole("button", { name: "Send" }).click();
}

function renderContactApp() {
  return render(
    <ThemeProvider>
      <ContactApp />
    </ThemeProvider>,
  );
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("ContactApp", () => {
  test("posts the form to the contact endpoint and confirms", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}", { status: 200 }));
    await renderContactApp();

    await fillAndSend();

    await expect.element(page.getByText("Message sent.")).toBeVisible();
    expect(fetchSpy).toHaveBeenCalledWith(
      contactFormEndpoint,
      expect.objectContaining({ method: "POST", headers: { Accept: "application/json" } }),
    );
    await expect.element(page.getByLabelText("Your name:")).toHaveValue("");
  });

  test("shows an error when the endpoint rejects the message", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 500 }));
    await renderContactApp();

    await fillAndSend();

    await expect.element(page.getByText("Something went wrong. Please try again.")).toBeVisible();
  });

  test("shows an error when the request fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("offline"));
    await renderContactApp();

    await fillAndSend();

    await expect.element(page.getByText("Something went wrong. Please try again.")).toBeVisible();
  });

  test("disables the button while sending", async () => {
    vi.spyOn(globalThis, "fetch").mockReturnValue(new Promise(() => {}));
    await renderContactApp();

    await fillAndSend();

    await expect.element(page.getByRole("button", { name: "Sending..." })).toBeDisabled();
  });
});
