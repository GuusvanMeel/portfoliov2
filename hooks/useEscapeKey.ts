"use client";

import { useEffect, useRef } from "react";

/** Calls `onEscape` whenever the Escape key is pressed anywhere in the window. */
export function useEscapeKey(onEscape: () => void) {
  const onEscapeRef = useRef(onEscape);

  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onEscapeRef.current();
      }
    }

    globalThis.window.addEventListener("keydown", handleKeyDown);

    return () => {
      globalThis.window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
