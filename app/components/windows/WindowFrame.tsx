"use client"
import { WindowFrameProps } from "@/app/Features/Window/type";
import styles from "./WindowFrame.module.css";
import { useTheme } from "@/app/Features/Theme/ThemeProvider";
import { windowThemes } from "@/app/Features/Window/windowThemes";



export default function WindowFrame({ title, children, onClose, onMinimize, onClick }:Readonly <WindowFrameProps>) {

  const { theme } = useTheme();
  const selectedTheme = windowThemes[theme];




  return (
    <div className={`${styles.window} ${selectedTheme.frame}`} onClick={onClick} >
      <div className={`${styles.titleBar} ${selectedTheme.titleBar} window-title-bar` }> 
        <span className={styles.title}>{title}</span>

        <div className={styles.buttons}>
          {onMinimize && (
            <button
              aria-label="Minimize"
              type="button"
              onClick={onMinimize}
              className={`${styles.controlButton} ${selectedTheme.controlButton}`}>
              _
            </button>)}
          {onClose && (
            <button
              aria-label="Close"
              type="button"
              onClick={onClose}
              className={`${styles.controlButton} ${selectedTheme.controlButton}`}
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