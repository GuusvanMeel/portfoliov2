"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { messages } from "@/content/en";
import { useThemeDefinition } from "@/features/theme/useThemeDefinition";
import { useClickOutside } from "@/hooks/useClickOutside";
import styles from "./Taskbar.module.css";

export type TaskbarWindow = {
  id: string;
  title: string;
  minimized: boolean;
  active: boolean;
  icon: string;
  iconSrc?: string;
};

type TaskbarProps = {
  windows: TaskbarWindow[];
  onWindowClick: (id: string) => void;
  onCloseWindow: (id: string) => void;
};

const text = messages.taskbar;

export default function Taskbar({ windows, onWindowClick, onCloseWindow }: Readonly<TaskbarProps>) {
  const { name, definition } = useThemeDefinition();
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const startMenuRef = useRef<HTMLDivElement>(null);

  const closeStartMenu = useCallback(() => setStartMenuOpen(false), []);
  useClickOutside(startMenuRef, closeStartMenu, "mousedown");

  return (
    <footer data-cy="taskbar" className={`${styles.taskbar} ${definition.taskbar.bar}`}>
      <div className={styles.startArea} ref={startMenuRef}>
        {startMenuOpen && (
          <div
            data-cy="start-menu"
            className={`${styles.startMenu} ${definition.taskbar.windowButton}`}
          >
            <button type="button" className={styles.startMenuItem}>
              {text.startMenu.about}
            </button>

            <button type="button" className={styles.startMenuItem}>
              {text.startMenu.projects}
            </button>

            <button type="button" className={styles.startMenuItem}>
              {text.startMenu.themeSwitcher}
            </button>
            <Link href="/admin" className={styles.startMenuItem} onClick={closeStartMenu}>
              <Image src={definition.assets.loginIcon} alt="" width={32} height={32}></Image>
              {text.startMenu.adminLogin}
            </Link>
          </div>
        )}

        <button
          type="button"
          data-cy="start-button"
          aria-expanded={startMenuOpen}
          className={`${styles.startButton} ${definition.taskbar.startButton}`}
          onClick={() => setStartMenuOpen((open) => !open)}
        >
          <span className={styles.startIcon}>
            <Image src={definition.assets.taskbarLogo} width={16} height={16} alt={""}></Image>
          </span>
          <span>{text.startButton}</span>
        </button>
      </div>

      <div className={styles.windowList}>
        {windows.map((window) => (
          <div
            key={window.id}
            data-cy="taskbar-entry"
            data-window-id={window.id}
            data-active={window.active ? "true" : "false"}
            className={`${styles.windowItem} ${
              window.active
                ? definition.taskbar.windowButtonActive
                : definition.taskbar.windowButton
            }`}
          >
            <button
              type="button"
              onClick={() => onWindowClick(window.id)}
              className={styles.windowButton}
            >
              <span className={styles.windowIcon}>
                {window.iconSrc ? (
                  <Image
                    src={window.iconSrc}
                    alt=""
                    className={styles.windowIconImage}
                    draggable={false}
                    width={32}
                    height={32}
                  />
                ) : (
                  (window.icon ?? "▣")
                )}
              </span>

              <span className={styles.windowTitle}>
                {window.minimized ? `[${window.title}]` : window.title}
              </span>
            </button>

            <button
              type="button"
              aria-label={`${text.closeWindow} ${window.title}`}
              data-cy="taskbar-entry-close"
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

      <div className={`${styles.tray} ${definition.taskbar.tray}`}>
        <span>{name}</span>
      </div>
    </footer>
  );
}
