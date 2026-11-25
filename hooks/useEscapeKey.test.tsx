import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, render } from "vitest-browser-react";
import { useEscapeKey } from "@/hooks/useEscapeKey";

function EscapeProbe({ onEscape }: Readonly<{ onEscape: () => void }>) {
  useEscapeKey(onEscape);
  return <p>probe</p>;
}

afterEach(() => {
  cleanup();
});

describe("useEscapeKey", () => {
  test("calls the callback when Escape is pressed", async () => {
    const onEscape = vi.fn();
    await render(<EscapeProbe onEscape={onEscape} />);

    globalThis.window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(onEscape).toHaveBeenCalledOnce();
  });

  test("ignores other keys", async () => {
    const onEscape = vi.fn();
    await render(<EscapeProbe onEscape={onEscape} />);

    globalThis.window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

    expect(onEscape).not.toHaveBeenCalled();
  });

  test("stops listening after unmount", async () => {
    const onEscape = vi.fn();
    const screen = await render(<EscapeProbe onEscape={onEscape} />);
    screen.unmount();

    globalThis.window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(onEscape).not.toHaveBeenCalled();
  });
});
