import type { ThemeDefinition } from "@/features/theme/types";

export const classicMac: ThemeDefinition = {
  window: {
    frame: "bg-[#d9d9d9] border border-black shadow-[2px_2px_0_rgba(0,0,0,0.35)]",
    titleBar: "bg-[#eeeeee] text-black shadow-[inset_0_-1px_0_#000000]",
    titleBarInactive: "bg-[#cfcfcf] text-neutral-600 border-b border-black",
    content: "bg-white text-black border border-black",
    dragging: "opacity-70 outline outline-2 outline-dashed outline-black",
  },
  controls: {
    button:
      "bg-[#eeeeee] text-black border border-black rounded-sm shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#999999] active:shadow-[inset_1px_1px_0_#999999,inset_-1px_-1px_0_#ffffff]",
    windowButton:
      "bg-[#eeeeee] text-black border border-black rounded-full shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#999999] active:shadow-[inset_1px_1px_0_#999999,inset_-1px_-1px_0_#ffffff]",
    closeButton:
      "bg-[#eeeeee] text-black border border-black rounded-full shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#999999] active:shadow-[inset_1px_1px_0_#999999,inset_-1px_-1px_0_#ffffff]",
  },
  project: {
    image:
      "bg-white border border-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#777777]",
    tag: "bg-[#f2f2f2] text-black border border-black rounded-sm shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#777777]",
    link: "bg-[#eeeeee] text-black border border-black rounded-sm shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#999999] active:shadow-[inset_1px_1px_0_#999999,inset_-1px_-1px_0_#ffffff]",
    description:
      "bg-white text-black border border-black shadow-[inset_1px_1px_0_#999999,inset_-1px_-1px_0_#ffffff]",
    duration:
      "bg-[#dddddd] text-black border border-black rounded-sm shadow-[inset_1px_1px_0_#777777,inset_-1px_-1px_0_#ffffff]",
  },
  taskbar: {
    bar: "bg-[#d9d9d9] border-t border-black shadow-[0_-1px_0_#ffffff]",
    startButton:
      "bg-[#eeeeee] text-black border border-black rounded-sm shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#999999]",
    windowButton:
      "bg-[#eeeeee] text-black border border-black rounded-sm shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#999999]",
    windowButtonActive:
      "bg-white text-black border border-black rounded-sm shadow-[inset_1px_1px_0_#999999,inset_-1px_-1px_0_#ffffff]",
    tray: "bg-[#eeeeee] text-black border border-black rounded-sm shadow-[inset_1px_1px_0_#999999,inset_-1px_-1px_0_#ffffff]",
  },
  desktop: {
    background: "bg-[#bfbfbf]",
  },
  assets: {
    taskbarLogo: "/icons/classicMac/TaskbarLogo.png",
    loginIcon: "/icons/classicMac/Login.png",
  },
};
