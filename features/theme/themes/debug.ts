import type { ThemeDefinition } from "@/features/theme/types";

export const debug: ThemeDefinition = {
  window: {
    frame: "bg-[#2b123c] border-2 border-[#ff00ff] shadow-[4px_4px_0_#000000]",
    titleBar: "bg-linear-to-r from-[#ff00ff] to-[#00ffff] text-black",
    titleBarInactive: "bg-[#5a3a66] text-[#cccccc]",
    content: "bg-[#111111] text-[#00ff66] border border-[#ff00ff]",
    dragging: "opacity-50 outline outline-2 outline-dotted-[#00ffff]",
  },
  controls: {
    button:
      "bg-[#ff00ff] text-black border border-black rounded-none shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#660066] active:shadow-[inset_1px_1px_0_#660066,inset_-1px_-1px_0_#ffffff]",
    windowButton:
      "bg-[#00ffff] text-black border border-black rounded-none shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#006666] active:shadow-[inset_1px_1px_0_#006666,inset_-1px_-1px_0_#ffffff]",
    closeButton:
      "bg-[#ff0044] text-white border border-[#00ffff] rounded-none shadow-[2px_2px_0_#00ffff] hover:bg-[#ff3366] active:shadow-[inset_1px_1px_0_#660018,inset_-1px_-1px_0_#ff99aa]",
  },
  project: {
    image: "bg-[#050505] border-2 border-[#00ffff] shadow-[0_0_8px_#ff00ff]",
    tag: "bg-[#111111] text-[#00ffff] border border-[#ff00ff] shadow-[inset_1px_1px_0_#000000,inset_-1px_-1px_0_#ff00ff]",
    link: "bg-[#ff00ff] text-black border border-[#00ffff] shadow-[2px_2px_0_#00ffff] hover:bg-[#00ffff]",
    description:
      "bg-[#050505] text-[#00ff66] border border-[#ff00ff] shadow-[inset_1px_1px_0_#000000,inset_-1px_-1px_0_#ff00ff]",
    duration:
      "bg-[#00ffff] text-black border border-[#ff00ff] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#006666]",
  },
  taskbar: {
    bar: "bg-[#111111] border-t-2 border-[#ff00ff] shadow-[0_-2px_0_#00ffff]",
    startButton: "bg-[#ff00ff] text-black border border-[#00ffff] shadow-[2px_2px_0_#00ffff]",
    windowButton:
      "bg-[#111111] text-[#00ffff] border border-[#ff00ff] shadow-[inset_1px_1px_0_#000000,inset_-1px_-1px_0_#ff00ff]",
    windowButtonActive:
      "bg-[#00ffff] text-black border border-[#ff00ff] shadow-[2px_2px_0_#ff00ff]",
    tray: "bg-[#050505] text-[#00ff66] border border-[#00ffff] shadow-[0_0_4px_#ff00ff]",
  },
  desktop: {
    background: "bg-linear-to-br from-[#111111] via-[#2b123c] to-[#ff00ff]",
  },
  assets: {
    taskbarLogo: "/icons/debug/TaskbarLogo.png",
    loginIcon: "/icons/debug/Login.png",
  },
};
