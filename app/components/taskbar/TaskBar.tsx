"use client";

import { useTheme } from "@/app/Features/Theme/ThemeProvider";
import { windowThemes } from "@/app/Features/Window/windowThemes";
import styles from "./TaskBar.module.css";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export type TaskbarWindow = {
  id: string;
  title: string;
  minimized: boolean;
  active: boolean;
  icon: string;
};

type TaskbarProps = {
  windows: TaskbarWindow[];
  onWindowClick: (id: string) => void;
  onCloseWindow: (id: string) => void;
};

export default function Taskbar({
  windows,
  onWindowClick,
  onCloseWindow,
}: Readonly<TaskbarProps>) {
  const { theme } = useTheme();
  const selectedTheme = windowThemes[theme];

  const [startMenuOpen, setStartMenuOpen] = useState(false);

  const startMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      startMenuRef.current &&
      !startMenuRef.current.contains(event.target as Node)
    ) {
      setStartMenuOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
  return (
    <footer className={`${styles.taskbar} ${selectedTheme.taskbar}`}>
     <div className={styles.startArea} ref={startMenuRef}>
  {startMenuOpen && (
    <div className={`${styles.startMenu} ${selectedTheme.taskbarWindowButton}`}>
      <button type="button" className={styles.startMenuItem}>
        About me
      </button>

      <button type="button" className={styles.startMenuItem}>
        Projects
      </button>

      <button type="button" className={styles.startMenuItem}>
        Theme switcher
      </button>
      <Link
  href="/admin"
  className={styles.startMenuItem}
  onClick={() => setStartMenuOpen(false)}
>
  Admin login 
</Link>
    </div>
  
  )}

  <button
    type="button"
    className={`${styles.startButton} ${selectedTheme.taskbarStartButton}`}
    onClick={() => setStartMenuOpen((open) => !open)}
  >
    <span className={styles.startIcon}>◆</span>
    <span>GuusOS</span>
  </button>
</div>

      <div className={styles.windowList}>
  {windows.map((window) => (
    <div
      key={window.id}
      className={`${styles.windowItem} ${
        window.active
          ? selectedTheme.taskbarWindowButtonActive
          : selectedTheme.taskbarWindowButton
      }`}
    >
      <button
        type="button"
        onClick={() => onWindowClick(window.id)}
        className={styles.windowButton}
      >
        <span className={styles.windowIcon}>{window.icon}</span>

        <span className={styles.windowTitle}>
          {window.minimized ? `[${window.title}]` : window.title}
        </span>
      </button>

      <button
        type="button"
        aria-label={`Close ${window.title}`}
        className={styles.windowCloseButton}
        onClick={(event) => {
          event.stopPropagation();
          onCloseWindow(window.id);
        }}
      >
        ×
      </button>
    </div>
  ))}
</div>

      <div className={`${styles.tray} ${selectedTheme.taskbarTray}`}>
        <span>{theme}</span>
      </div>
    </footer>
  );
}