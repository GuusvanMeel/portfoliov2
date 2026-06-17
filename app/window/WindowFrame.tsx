"use client"
import { WindowFrameProps } from "@/app/Features/Window/type";
import styles from "./WindowFrame.module.css";
import { windowThemes } from "../Features/Window/windowThemes";
import { useTheme } from "../Features/Theme/ThemeProvider";


export default function WindowFrame({ title, children, onClose, }: WindowFrameProps) {
  
    const { theme } = useTheme();
    const selectedTheme = windowThemes[theme];

    return (
    <div className={`${styles.window} ${selectedTheme.frame}`}>
      <div className={`${styles.titleBar} ${selectedTheme.titleBar}`}>
        <span className={styles.title}>{title}</span>

        <div className={styles.buttons}>
          {onClose && (
            <button
              aria-label="Close"
              type="button"
              onClick={onClose}
              className={`${styles.closebutton} ${selectedTheme.controlButton}`}
            >
              X
            </button>
          )}
        </div>
      </div>

      <div className={`${styles.content} ${selectedTheme.content}`}>
        {children}
      </div>
    </div>
  );
}