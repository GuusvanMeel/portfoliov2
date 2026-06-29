import { ThemeName } from "../Theme/type";
import type { WindowTheme } from "./type";

export const windowThemes: Record<ThemeName, WindowTheme> = {
    win98: {
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




},
  
};