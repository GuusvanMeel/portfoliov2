"use client";

import { Rnd } from "react-rnd";
import { useState, type ReactNode } from "react";
import { useTheme } from "../Features/Theme/ThemeProvider";
import { windowThemes } from "../Features/Window/windowThemes";

type DraggableWindowProps = {
  children: ReactNode;
  width: number;
  height: number;
  zIndex: number;
  onFocus: () => void;
};

export default function DraggableWindow({ children, width, height, zIndex, onFocus }:Readonly<DraggableWindowProps>) {
    const [isDragging, setIsDragging] = useState(false)
    const { theme } = useTheme();
  const selectedTheme = windowThemes[theme];
    return (
    <Rnd
      default={{
        x: 40,
        y: 40,
        width: width,
        height: height,
        
      }}
      style={{zIndex}}
      onClick={onclick}
      minWidth={280}
      minHeight={150}
      bounds="parent"
      className={isDragging ? selectedTheme.draggingWindow : ""}
      onDragStart={() => setIsDragging(true)}
      onDragStop={() => {setIsDragging(false); onFocus();}}
      onResizeStop={() => onFocus()}
      dragHandleClassName="window-title-bar"
    >
      {children}
    </Rnd>
  );
}