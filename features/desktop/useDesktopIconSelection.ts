"use client";

import { useCallback, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

const desktopIconSelector = "[data-desktop-icon]";

/** Which desktop icon is selected; a press outside every icon clears the selection. */
export function useDesktopIconSelection() {
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);

  const select = useCallback((id: string) => setSelectedIconId(id), []);
  const clear = useCallback(() => setSelectedIconId(null), []);

  useClickOutside(desktopIconSelector, clear, "pointerdown");

  return { selectedIconId, select, clear };
}
