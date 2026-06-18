"use client";

import { Rnd } from "react-rnd";
import { useState, type ReactNode } from "react";
import { useTheme } from "../Features/Theme/ThemeProvider";
import { windowThemes } from "../Features/Window/windowThemes";

type DraggableWindowProps = {
  children: ReactNode;
};

export default function DraggableWindow({ children }: DraggableWindowProps) {
    const [isDragging, setIsDragging] = useState(false)
    const { theme } = useTheme();
  const selectedTheme = windowThemes[theme];
    return (
    <Rnd
      default={{
        x: 40,
        y: 40,
        width: 300,
        height: 150,
      }}
      minWidth={280}
      minHeight={150}
      bounds="parent"
      className={isDragging ? selectedTheme.draggingWindow : ""}
      onDragStart={() => setIsDragging(true)}
      onDragStop={() => setIsDragging(false)}
      dragHandleClassName="window-title-bar"
    >
      {children}
    </Rnd>
  );
}