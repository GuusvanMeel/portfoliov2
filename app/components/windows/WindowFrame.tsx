"use client";
import { WindowFrameProps } from "@/app/Features/Window/type";
import styles from "./WindowFrame.module.css";
import { useTheme } from "@/features/theme/ThemeProvider";
import { windowThemes } from "@/app/Features/Window/windowThemes";

export default function WindowFrame({
  title,
  children,
  onClose,
  onMinimize,
  onClick,
  windowId,
  windowType,
}: Readonly<WindowFrameProps>) {
  const { theme } = useTheme();
  const selectedTheme = windowThemes[theme];

  return (
    <div
      data-cy="window"
      data-window-id={windowId}
      data-window-type={windowType}
      className={`${styles.window} ${selectedTheme.frame}`}
      onClick={onClick}
    >
      <div className={`${styles.titleBar} ${selectedTheme.titleBar} window-title-bar`}>
        <span className={styles.title}>{title}</span>

        <div className={styles.buttons}>
          {onMinimize && (
            <button
              aria-label="Minimize"
              data-cy="window-minimize"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onMinimize();
              }}
              className={`${styles.controlButton} ${selectedTheme.controlButton}`}
            >
              _
            </button>
          )}
          {onClose && (
            <button
              aria-label="Close"
              data-cy="window-close"
              type="button"
              onClick={onClose}
              className={`${styles.controlButton} ${selectedTheme.closeButton}`}
            >
              X
            </button>
          )}
        </div>
      </div>

      <div className={`${styles.content} ${selectedTheme.content}`}>{children}</div>
    </div>
  );
}
