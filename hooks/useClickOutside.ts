"use client";

import { useEffect, useRef, type RefObject } from "react";

type ClickOutsideTarget = RefObject<HTMLElement | null> | string;

function isOutside(target: ClickOutsideTarget, eventTarget: EventTarget | null): boolean {
  if (typeof target === "string") {
    return eventTarget instanceof Element && !eventTarget.closest(target);
  }

  return target.current !== null && !target.current.contains(eventTarget as Node);
}

/**
 * Calls `onOutside` when the user presses outside `target`.
 * `target` is either a ref to an element or a CSS selector; with a selector, a press counts as
 * outside when the event target is not inside any element matching it.
 */
export function useClickOutside(
  target: ClickOutsideTarget,
  onOutside: () => void,
  eventType: "mousedown" | "pointerdown",
) {
  const onOutsideRef = useRef(onOutside);

  useEffect(() => {
    onOutsideRef.current = onOutside;
  }, [onOutside]);

  useEffect(() => {
    function handleEvent(event: Event) {
      if (isOutside(target, event.target)) {
        onOutsideRef.current();
      }
    }

    document.addEventListener(eventType, handleEvent);

    return () => {
      document.removeEventListener(eventType, handleEvent);
    };
  }, [target, eventType]);
}
