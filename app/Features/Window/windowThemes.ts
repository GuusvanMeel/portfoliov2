import type { WindowTheme, WindowThemeName } from "./type";

export const windowThemes: Record<WindowThemeName, WindowTheme> = {
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
       

    },

    classicMac: {
        frame:
            "bg-[#d9d9d9] border border-black shadow-[2px_2px_0_rgba(0,0,0,0.35)]",
        titleBar:
            "bg-[#eeeeee] text-black shadow-[inset_0_-1px_0_#000000]",
        titleBarInactive:
            "bg-[#cfcfcf] text-neutral-600 border-b border-black",
        content:
            "bg-white text-black border border-black",
        controlButton:
            "bg-[#eeeeee] text-black border border-black rounded-full shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#999999] active:shadow-[inset_1px_1px_0_#999999,inset_-1px_-1px_0_#ffffff]",

        button:
            "bg-[#eeeeee] text-black border border-black rounded-sm shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#999999] active:shadow-[inset_1px_1px_0_#999999,inset_-1px_-1px_0_#ffffff]",
        draggingWindow: "opacity-70 outline outline-2 outline-dashed outline-black",
        
    },
};