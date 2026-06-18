"use client";

import { useState } from "react";
import WindowFrame from "./WindowFrame";
import ThemeSwitcher from "./ThemeSwitcher";
import DraggableWindow from "./DraggableWindow";
import AdminButton from "../AdminButton";
import { useTheme } from "../Features/Theme/ThemeProvider";
import { windowThemes } from "../Features/Window/windowThemes";
import styles from "./WindowFrame.module.css";


type WindowType = "theme-switcher" | "projects" | "about";

type WindowData = {
  id: string;
  type: WindowType;
};

const windowDefinitions: Record<
  WindowType,
  {
    title: string;
    content: React.ReactNode;
  }
> = {
  "theme-switcher": {
    title: "Switch the theme!",
    content: <ThemeSwitcher />,
  },
  projects: {
    title: "Projects",
    content: <p>Projects content</p>,
  },
  about: {
    title: "About Me",
    content: <p>About me content</p>,
  },
};

export default function WindowManager() {
  const [windows, setWindows] = useState<WindowData[]>([]);
  const { theme } = useTheme(); //dit moet weg als de buttons uit de manager gaan
      const selectedTheme = windowThemes[theme]; //deze ook

  function openWindow(type: WindowType) {
    setWindows((currentWindows) => [
      ...currentWindows,
      {
        id: crypto.randomUUID(),
        type,
      },
    ]);
  }

  function closeWindow(instanceId: string) {
    setWindows((currentWindows) =>
      currentWindows.filter((window) => window.id !== instanceId)
    );
  }

  return (
    <div className="absolute inset-0 ">
      <button className={`${styles.genericButton} ${selectedTheme.button}`} onClick={() => openWindow("theme-switcher")}>
        Open Theme Switcher
      </button>

      <button className={`${styles.genericButton} ${selectedTheme.button}`} onClick={() => openWindow("projects")}>
        Open Projects
      </button>
      <AdminButton />

      {windows.map((window) => {
        const definition = windowDefinitions[window.type];

        return (
            <DraggableWindow key={window.id}>
          <WindowFrame
            title={definition.title}
            onClose={() => closeWindow(window.id)}
          >
            {definition.content}
          </WindowFrame>
          </DraggableWindow>
        );
      })}
    </div>
  );
}