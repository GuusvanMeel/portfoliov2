import { useRef } from "react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, render } from "vitest-browser-react";
import { useClickOutside } from "@/hooks/useClickOutside";

function RefProbe({ onOutside }: Readonly<{ onOutside: () => void }>) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onOutside, "mousedown");

  return (
    <div>
      <div ref={ref}>
        <button type="button">inside</button>
      </div>
      <button type="button">outside</button>
    </div>
  );
}

function SelectorProbe({ onOutside }: Readonly<{ onOutside: () => void }>) {
  useClickOutside("[data-probe-item]", onOutside, "pointerdown");

  return (
    <div>
      <span data-probe-item>
        <button type="button">item</button>
      </span>
      <button type="button">elsewhere</button>
    </div>
  );
}

function press(label: string, type: "mousedown" | "pointerdown") {
  const element = [...document.querySelectorAll("button")].find((b) => b.textContent === label);
  element!.dispatchEvent(new Event(type, { bubbles: true }));
}

afterEach(() => {
  cleanup();
});

describe("useClickOutside with a ref", () => {
  test("calls the callback for a press outside the element", async () => {
    const onOutside = vi.fn();
    await render(<RefProbe onOutside={onOutside} />);

    press("outside", "mousedown");

    expect(onOutside).toHaveBeenCalledOnce();
  });

  test("ignores a press inside the element", async () => {
    const onOutside = vi.fn();
    await render(<RefProbe onOutside={onOutside} />);

    press("inside", "mousedown");

    expect(onOutside).not.toHaveBeenCalled();
  });

  test("only listens to the given event type", async () => {
    const onOutside = vi.fn();
    await render(<RefProbe onOutside={onOutside} />);

    press("outside", "pointerdown");

    expect(onOutside).not.toHaveBeenCalled();
  });
});

describe("useClickOutside with a selector", () => {
  test("calls the callback for a press outside every matching element", async () => {
    const onOutside = vi.fn();
    await render(<SelectorProbe onOutside={onOutside} />);

    press("elsewhere", "pointerdown");

    expect(onOutside).toHaveBeenCalledOnce();
  });

  test("ignores a press inside a matching element", async () => {
    const onOutside = vi.fn();
    await render(<SelectorProbe onOutside={onOutside} />);

    press("item", "pointerdown");

    expect(onOutside).not.toHaveBeenCalled();
  });
});
