"use client";

import { useTheme } from "@/app/Features/Theme/ThemeProvider";
import { windowThemes } from "@/app/Features/Window/windowThemes";
import styles from "./TaskBar.module.css";

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
};

export default function Taskbar({
  windows,
  onWindowClick,
}: Readonly<TaskbarProps>) {
  const { theme } = useTheme();
  const selectedTheme = windowThemes[theme];

  return (
    <footer className={`${styles.taskbar} ${selectedTheme.taskbar}`}>
      <button
        type="button"
        className={`${styles.startButton} ${selectedTheme.taskbarStartButton}`}
      >
        <span className={styles.startIcon}>◆</span>
        <span>GuusOS</span>
      </button>

      <div className={styles.windowList}>
        {windows.map((window) => (
          <button
            key={window.id}
            type="button"
            onClick={() => onWindowClick(window.id)}
            className={`${styles.windowButton} ${
              window.active
                ? selectedTheme.taskbarWindowButtonActive
                : selectedTheme.taskbarWindowButton
            }`}
          >
            <span className={styles.windowIcon}>{window.icon}</span>

            <span className={styles.windowTitle}>
              {window.minimized ? `[${window.title}]` : window.title}
            </span>
          </button>
        ))}
      </div>

      <div className={`${styles.tray} ${selectedTheme.taskbarTray}`}>
        <span>{theme}</span>
      </div>
    </footer>
  );
}