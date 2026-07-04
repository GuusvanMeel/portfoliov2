import { ThemeName } from "../Theme/type";
import type { WindowTheme } from "./type";

export const windowThemes: Record<ThemeName, WindowTheme> = {
    Win98: {
        frame:
            "bg-[#c0c0c0] border border-black shadow-[inset_1px_1px_#ffffff,inset_-1px_-1px_#808080]",
        titleBar:
            "bg-linear-to-r from-[#000080] to-[#1084d0] text-white",
        titleBarInactive:
            "bg-linear-to-r from-[#7b7b7b] to-[#a0a0a0] text-white",
        content:
            "bg-[#d4d0c8] text-black border border-[#808080] shadow-[inset_1px_1px_#808080,inset_-1px_-1px_#ffffff]",
        controlButton:
            "bg-[#c0c0c0] text-black border border-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#808080] active:shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#ffffff]",
        button:
            "bg-[#c0c0c0] text-black border border-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#808080] active:shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#ffffff]",
        draggingWindow:
            "opacity-60",
projectImage:
  "bg-[#c0c0c0] border border-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#707070]",

projectTag:
  "bg-[#e0e0e0] text-black border border-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#707070]",

projectDuration:
  "bg-[#d4d0c8] text-black border border-[#606060] shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#ffffff]",

projectLink:
  "bg-[#c0c0c0] text-black border border-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#808080] active:shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#ffffff]",

projectDescription:
  "bg-white text-black border border-[#808080] shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#ffffff]", 
  taskbar:
  "bg-[#c0c0c0] border-t border-white shadow-[inset_0_1px_0_#ffffff]",
taskbarStartButton:
  "bg-[#c0c0c0] text-black border border-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#808080] active:shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#ffffff]",
taskbarWindowButton:
  "bg-[#c0c0c0] text-black border border-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#808080]",
taskbarWindowButtonActive:
  "bg-[#d4d0c8] text-black border border-black shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#ffffff]",
taskbarTray:
  "bg-[#c0c0c0] text-black border border-[#808080] shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#ffffff]", 
    desktopBackground: "bg-[#008080]",
       

    },
    WinXP: {
  frame:
    "bg-[#ece9d8] border border-[#0a246a] rounded-t-[6px] shadow-[2px_3px_8px_rgba(0,0,0,0.45)]",

  titleBar:
    "bg-linear-to-b from-[#4aa3ff] via-[#0a5be8] to-[#003cb3] text-white rounded-t-[5px] shadow-[inset_1px_1px_0_#8cc6ff,inset_-1px_-1px_0_#003080]",

  titleBarInactive:
    "bg-linear-to-b from-[#9ebfe8] via-[#6f93c8] to-[#4f6f9f] text-[#e8eef8] rounded-t-[5px] shadow-[inset_1px_1px_0_#d7e7ff,inset_-1px_-1px_0_#4d6488]",

  content:
    "bg-[#ece9d8] text-black border border-[#7f9db9] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#aca899]",

  controlButton:
    "bg-linear-to-b from-[#7bbcff] via-[#1f6fe5] to-[#0645ad] text-white border border-[#003c74] rounded-[3px] shadow-[inset_1px_1px_0_#b9ddff,inset_-1px_-1px_0_#002f88] active:shadow-[inset_1px_1px_0_#002f88,inset_-1px_-1px_0_#b9ddff]",

  button:
    "bg-linear-to-b from-[#ffffff] via-[#ece9d8] to-[#d6d1bd] text-black border border-[#003c74] rounded-[3px] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#aca899] hover:bg-[#f5f3e8] active:shadow-[inset_1px_1px_0_#aca899,inset_-1px_-1px_0_#ffffff]",

  draggingWindow:
    "opacity-75",

  projectImage:
    "bg-[#ffffff] border border-[#7f9db9] rounded-[3px] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#aca899]",

  projectTag:
    "bg-linear-to-b from-[#ffffff] to-[#dbe9ff] text-black border border-[#7f9db9] rounded-[3px] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#9db9d6]",

  projectDuration:
    "bg-[#f7f3df] text-black border border-[#aca899] rounded-[3px] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#c0baa3]",

  projectLink:
    "bg-linear-to-b from-[#ffffff] via-[#ece9d8] to-[#d6d1bd] text-black border border-[#003c74] rounded-[3px] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#aca899] hover:bg-[#dbe9ff] active:shadow-[inset_1px_1px_0_#aca899,inset_-1px_-1px_0_#ffffff]",

  projectDescription:
    "bg-white text-black border border-[#7f9db9] rounded-[2px] shadow-[inset_1px_1px_0_#aca899,inset_-1px_-1px_0_#ffffff]",

  taskbar:
    "bg-linear-to-b from-[#3d95ff] via-[#0a5be8] to-[#003cb3] border-t border-[#7bbcff] shadow-[inset_0_1px_0_#8cc6ff]",

  taskbarStartButton:
    "bg-linear-to-b from-[#78d85a] via-[#2fa72f] to-[#0c761c] text-white border border-[#0b5f16] rounded-r-[10px] rounded-l-[4px] shadow-[inset_1px_1px_0_#baf2a5,inset_-1px_-1px_0_#075011] active:shadow-[inset_1px_1px_0_#075011,inset_-1px_-1px_0_#baf2a5]",

  taskbarWindowButton:
    "bg-linear-to-b from-[#5aa8ff] via-[#1f6fe5] to-[#0b4fc4] text-white border border-[#0a3f9f] rounded-[3px] shadow-[inset_1px_1px_0_#8cc6ff,inset_-1px_-1px_0_#003080]",

  taskbarWindowButtonActive:
    "bg-linear-to-b from-[#2f6ed8] via-[#1854bd] to-[#083a91] text-white border border-[#052c73] rounded-[3px] shadow-[inset_1px_1px_0_#06347e,inset_-1px_-1px_0_#6daeff]",

  taskbarTray:
    "bg-linear-to-b from-[#1f8fff] via-[#0d70dc] to-[#0057b8] text-white border border-[#0a4fa8] shadow-[inset_1px_1px_0_#7fc4ff,inset_-1px_-1px_0_#00408a]",
      desktopBackground: "bg-[url('/wallpapers/WinXP.jpg')] bg-cover bg-center",
},

    classicMac: {
        frame: "bg-[#d9d9d9] border border-black shadow-[2px_2px_0_rgba(0,0,0,0.35)]",
        titleBar: "bg-[#eeeeee] text-black shadow-[inset_0_-1px_0_#000000]",
        titleBarInactive: "bg-[#cfcfcf] text-neutral-600 border-b border-black",
        content: "bg-white text-black border border-black",
        controlButton: "bg-[#eeeeee] text-black border border-black rounded-full shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#999999] active:shadow-[inset_1px_1px_0_#999999,inset_-1px_-1px_0_#ffffff]",

        button: "bg-[#eeeeee] text-black border border-black rounded-sm shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#999999] active:shadow-[inset_1px_1px_0_#999999,inset_-1px_-1px_0_#ffffff]",
        draggingWindow: "opacity-70 outline outline-2 outline-dashed outline-black",
        
projectImage:
  "bg-white border border-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#777777]",

projectTag:
  "bg-[#f2f2f2] text-black border border-black rounded-sm shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#777777]",

projectDuration:
  "bg-[#dddddd] text-black border border-black rounded-sm shadow-[inset_1px_1px_0_#777777,inset_-1px_-1px_0_#ffffff]",

projectLink:
  "bg-[#eeeeee] text-black border border-black rounded-sm shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#999999] active:shadow-[inset_1px_1px_0_#999999,inset_-1px_-1px_0_#ffffff]",

projectDescription:
  "bg-white text-black border border-black shadow-[inset_1px_1px_0_#999999,inset_-1px_-1px_0_#ffffff]",    
    taskbar:
  "bg-[#d9d9d9] border-t border-black shadow-[0_-1px_0_#ffffff]",
taskbarStartButton:
  "bg-[#eeeeee] text-black border border-black rounded-sm shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#999999]",
taskbarWindowButton:
  "bg-[#eeeeee] text-black border border-black rounded-sm shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#999999]",
taskbarWindowButtonActive:
  "bg-white text-black border border-black rounded-sm shadow-[inset_1px_1px_0_#999999,inset_-1px_-1px_0_#ffffff]",
taskbarTray:
  "bg-[#eeeeee] text-black border border-black rounded-sm shadow-[inset_1px_1px_0_#999999,inset_-1px_-1px_0_#ffffff]",
    desktopBackground: "bg-[#bfbfbf]",
},

    debug: {
  frame:
    "bg-[#2b123c] border-2 border-[#ff00ff] shadow-[4px_4px_0_#000000]",
  titleBar:
    "bg-linear-to-r from-[#ff00ff] to-[#00ffff] text-black",
  titleBarInactive:
    "bg-[#5a3a66] text-[#cccccc]",
  content:
    "bg-[#111111] text-[#00ff66] border border-[#ff00ff]",
  controlButton:
    "bg-[#00ffff] text-black border border-black rounded-none shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#006666] active:shadow-[inset_1px_1px_0_#006666,inset_-1px_-1px_0_#ffffff]",
  button:
    "bg-[#ff00ff] text-black border border-black rounded-none shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#660066] active:shadow-[inset_1px_1px_0_#660066,inset_-1px_-1px_0_#ffffff]",
  draggingWindow:
    "opacity-50 outline outline-2 outline-dotted-[#00ffff]",
projectImage:
  "bg-[#050505] border-2 border-[#00ffff] shadow-[0_0_8px_#ff00ff]",

projectTag:
  "bg-[#111111] text-[#00ffff] border border-[#ff00ff] shadow-[inset_1px_1px_0_#000000,inset_-1px_-1px_0_#ff00ff]",

projectDuration:
  "bg-[#00ffff] text-black border border-[#ff00ff] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#006666]",

projectLink:
  "bg-[#ff00ff] text-black border border-[#00ffff] shadow-[2px_2px_0_#00ffff] hover:bg-[#00ffff]",

projectDescription:
  "bg-[#050505] text-[#00ff66] border border-[#ff00ff] shadow-[inset_1px_1px_0_#000000,inset_-1px_-1px_0_#ff00ff]",
  taskbar:
  "bg-[#111111] border-t-2 border-[#ff00ff] shadow-[0_-2px_0_#00ffff]",
taskbarStartButton:
  "bg-[#ff00ff] text-black border border-[#00ffff] shadow-[2px_2px_0_#00ffff]",
taskbarWindowButton:
  "bg-[#111111] text-[#00ffff] border border-[#ff00ff] shadow-[inset_1px_1px_0_#000000,inset_-1px_-1px_0_#ff00ff]",
taskbarWindowButtonActive:
  "bg-[#00ffff] text-black border border-[#ff00ff] shadow-[2px_2px_0_#ff00ff]",
taskbarTray:
  "bg-[#050505] text-[#00ff66] border border-[#00ffff] shadow-[0_0_4px_#ff00ff]",
    desktopBackground: "bg-linear-to-br from-[#111111] via-[#2b123c] to-[#ff00ff]",




},

  
};