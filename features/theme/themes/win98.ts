import type { ThemeDefinition } from "@/features/theme/types";

export const win98: ThemeDefinition = {
  window: {
    frame:
      "bg-[#c0c0c0] border border-black shadow-[inset_1px_1px_#ffffff,inset_-1px_-1px_#808080]",
    titleBar: "bg-linear-to-r from-[#000080] to-[#1084d0] text-white",
    titleBarInactive: "bg-linear-to-r from-[#7b7b7b] to-[#a0a0a0] text-white",
    content:
      "bg-[#d4d0c8] text-black border border-[#808080] shadow-[inset_1px_1px_#808080,inset_-1px_-1px_#ffffff]",
    dragging: "opacity-60",
  },
  controls: {
    button:
      "bg-[#c0c0c0] text-black border border-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#808080] active:shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#ffffff]",
    windowButton:
      "bg-[#c0c0c0] text-black border border-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#808080] active:shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#ffffff]",
    closeButton:
      "bg-[#c0c0c0] text-black border border-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#808080] active:shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#ffffff]",
  },
  project: {
    image:
      "bg-[#c0c0c0] border border-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#707070]",
    tag: "bg-[#e0e0e0] text-black border border-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#707070]",
    link: "bg-[#c0c0c0] text-black border border-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#808080] active:shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#ffffff]",
    description:
      "bg-white text-black border border-[#808080] shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#ffffff]",
    duration:
      "bg-[#d4d0c8] text-black border border-[#606060] shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#ffffff]",
  },
  taskbar: {
    bar: "bg-[#c0c0c0] border-t border-white shadow-[inset_0_1px_0_#ffffff]",
    startButton:
      "bg-[#c0c0c0] text-black border border-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#808080] active:shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#ffffff]",
    windowButton:
      "bg-[#c0c0c0] text-black border border-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#808080]",
    windowButtonActive:
      "bg-[#d4d0c8] text-black border border-black shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#ffffff]",
    tray: "bg-[#c0c0c0] text-black border border-[#808080] shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#ffffff]",
  },
  desktop: {
    background: "bg-[#008080]",
  },
  assets: {
    taskbarLogo: "/icons/Win98/TaskbarLogo.png",
    loginIcon: "/icons/Win98/Login.png",
  },
};
