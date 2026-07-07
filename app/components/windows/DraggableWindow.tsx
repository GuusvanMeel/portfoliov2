"use client";

import { Rnd } from "react-rnd";
import { useState, type ReactNode } from "react";
import { useTheme } from "../../Features/Theme/ThemeProvider";
import { windowThemes } from "../../Features/Window/windowThemes";

type DraggableWindowProps = {
  children: ReactNode;
  width: number;
  height: number;
  zIndex: number;
  onFocus: () => void;
  startPos: "default" | "right"
};
 function getStartX(startPos: "default" | "right", width: number) {
  if (typeof window === "undefined") {
    return 80;
  }

  if (startPos === "right") {
    return Math.max(0, window.innerWidth - width - 40);
  }

  return window.innerWidth / 4;
}
export default function DraggableWindow({ children, width, height, zIndex, onFocus, startPos }:Readonly<DraggableWindowProps>) {
    const [isDragging, setIsDragging] = useState(false)
    const { theme } = useTheme();
  const selectedTheme = windowThemes[theme];
    return (
    <Rnd
      default={{
            x: getStartX(startPos, width),
        y: 40,
        width: width,
        height: height,
        
      }}
      style={{zIndex}}
      minWidth={280}
      minHeight={150}
      bounds="parent"
      onMouseDown={onFocus}
      className={isDragging ? selectedTheme.draggingWindow : ""}
      onDragStart={() => setIsDragging(true)}
      onDragStop={() => {setIsDragging(false); onFocus();}}
      onResizeStop={() => onFocus()}
      enableResizing={false}
      dragHandleClassName="window-title-bar"
      cancel="button"
    >
      {children}
    </Rnd>
  );
}