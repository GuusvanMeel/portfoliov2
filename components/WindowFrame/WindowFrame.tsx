"use client";

import type { ReactNode } from "react";
import { messages } from "@/content/en";
import { useThemeDefinition } from "@/features/theme/useThemeDefinition";
import styles from "./WindowFrame.module.css";

type WindowFrameProps = {
  title: string;
  children: ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  onClick: () => void;
  windowId?: string;
  windowType?: string;
};

export default function WindowFrame({
  title,
  children,
  onClose,
  onMinimize,
  onClick,
  windowId,
  windowType,
}: Readonly<WindowFrameProps>) {
  const { definition } = useThemeDefinition();

  return (
    <div
      data-cy="window"
      data-window-id={windowId}
      data-window-type={windowType}
      className={`${styles.window} ${definition.window.frame}`}
      onClick={onClick}
    >
      <div className={`${styles.titleBar} ${definition.window.titleBar} window-title-bar`}>
        <span className={styles.title}>{title}</span>

        <div className={styles.buttons}>
          {onMinimize && (
            <button
              aria-label={messages.desktop.minimizeWindow}
              data-cy="window-minimize"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onMinimize();
              }}
              className={`${styles.controlButton} ${definition.controls.windowButton}`}
            >
              _
            </button>
          )}
          {onClose && (
            <button
              aria-label={messages.desktop.closeWindow}
              data-cy="window-close"
              type="button"
              onClick={onClose}
              className={`${styles.controlButton} ${definition.controls.closeButton}`}
            >
              X
            </button>
          )}
        </div>
      </div>

      <div className={`${styles.content} ${definition.window.content}`}>{children}</div>
    </div>
  );
}
