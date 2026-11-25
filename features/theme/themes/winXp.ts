import type { ThemeDefinition } from "@/features/theme/types";

export const winXp: ThemeDefinition = {
  window: {
    frame:
      "bg-[#ece9d8] border border-[#0a246a] rounded-t-[6px] shadow-[2px_3px_8px_rgba(0,0,0,0.45)]",
    titleBar:
      "bg-linear-to-b from-[#4aa3ff] via-[#0a5be8] to-[#003cb3] text-white rounded-t-[5px] shadow-[inset_1px_1px_0_#8cc6ff,inset_-1px_-1px_0_#003080]",
    titleBarInactive:
      "bg-linear-to-b from-[#9ebfe8] via-[#6f93c8] to-[#4f6f9f] text-[#e8eef8] rounded-t-[5px] shadow-[inset_1px_1px_0_#d7e7ff,inset_-1px_-1px_0_#4d6488]",
    content:
      "bg-[#ece9d8] text-black border border-[#7f9db9] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#aca899]",
    dragging: "opacity-75",
  },
  controls: {
    button:
      "bg-linear-to-b from-[#ffffff] via-[#ece9d8] to-[#d6d1bd] text-black border border-[#003c74] rounded-[3px] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#aca899] hover:bg-[#f5f3e8] active:shadow-[inset_1px_1px_0_#aca899,inset_-1px_-1px_0_#ffffff]",
    windowButton:
      "bg-linear-to-b from-[#7bbcff] via-[#1f6fe5] to-[#0645ad] text-white border border-[#003c74] rounded-[3px] shadow-[inset_1px_1px_0_#b9ddff,inset_-1px_-1px_0_#002f88] active:shadow-[inset_1px_1px_0_#002f88,inset_-1px_-1px_0_#b9ddff]",
    closeButton:
      "bg-linear-to-b from-[#ff8a7a] via-[#e84a35] to-[#b51f12] text-white border border-[#8b1a10] rounded-[3px] shadow-[inset_1px_1px_0_#ffc0b8,inset_-1px_-1px_0_#7a120b] hover:from-[#ff9d8f] hover:via-[#f05a43] hover:to-[#c52a1b] active:shadow-[inset_1px_1px_0_#7a120b,inset_-1px_-1px_0_#ffc0b8]",
  },
  project: {
    image:
      "bg-[#ffffff] border border-[#7f9db9] rounded-[3px] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#aca899]",
    tag: "bg-linear-to-b from-[#ffffff] to-[#dbe9ff] text-black border border-[#7f9db9] rounded-[3px] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#9db9d6]",
    link: "bg-linear-to-b from-[#ffffff] via-[#ece9d8] to-[#d6d1bd] text-black border border-[#003c74] rounded-[3px] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#aca899] hover:bg-[#dbe9ff] active:shadow-[inset_1px_1px_0_#aca899,inset_-1px_-1px_0_#ffffff]",
    description:
      "bg-white text-black border border-[#7f9db9] rounded-[2px] shadow-[inset_1px_1px_0_#aca899,inset_-1px_-1px_0_#ffffff]",
    duration:
      "bg-[#f7f3df] text-black border border-[#aca899] rounded-[3px] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#c0baa3]",
  },
  taskbar: {
    bar: "bg-linear-to-b from-[#3d95ff] via-[#0a5be8] to-[#003cb3] border-t border-[#7bbcff] shadow-[inset_0_1px_0_#8cc6ff]",
    startButton:
      "bg-linear-to-b from-[#78d85a] via-[#2fa72f] to-[#0c761c] text-white border border-[#0b5f16] rounded-r-[10px] rounded-l-[4px] shadow-[inset_1px_1px_0_#baf2a5,inset_-1px_-1px_0_#075011] active:shadow-[inset_1px_1px_0_#075011,inset_-1px_-1px_0_#baf2a5]",
    windowButton:
      "bg-linear-to-b from-[#5aa8ff] via-[#1f6fe5] to-[#0b4fc4] text-white border border-[#0a3f9f] rounded-[3px] shadow-[inset_1px_1px_0_#8cc6ff,inset_-1px_-1px_0_#003080]",
    windowButtonActive:
      "bg-linear-to-b from-[#2f6ed8] via-[#1854bd] to-[#083a91] text-white border border-[#052c73] rounded-[3px] shadow-[inset_1px_1px_0_#06347e,inset_-1px_-1px_0_#6daeff]",
    tray: "bg-linear-to-b from-[#1f8fff] via-[#0d70dc] to-[#0057b8] text-white border border-[#0a4fa8] shadow-[inset_1px_1px_0_#7fc4ff,inset_-1px_-1px_0_#00408a]",
  },
  desktop: {
    background: "bg-[url('/wallpapers/WinXP.jpg')] bg-cover bg-center",
  },
  assets: {
    taskbarLogo: "/icons/WinXP/TaskbarLogo.png",
    loginIcon: "/icons/WinXP/Login.png",
  },
};
