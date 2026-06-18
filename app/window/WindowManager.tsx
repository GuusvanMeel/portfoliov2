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
  minimized: boolean;
};

const windowDefinitions: Record<
  WindowType,
  {
    title: string;
    content: React.ReactNode;
    width: number;
    height: number;
  }
> = {
  "theme-switcher": {
    title: "Switch the theme!",
    content: <ThemeSwitcher />,
    width: 150,
    height: 150,
  },
  projects: {
    title: "Projects",
    content: <p>Projects content</p>,
    width: 150,
    height: 150,
  },
  about: {
    title: "About Me",
    content: <p>About me content</p>,
    width: 150,
    height: 150,
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
        minimized: false,
      },
    ]);
  }
  function bringToFront(id: string) {
    setWindows((currentWindows) => {
      const selectedWindow = currentWindows.find((window) => window.id === id);

      if (!selectedWindow) {
        return currentWindows;
      }

      return [
        ...currentWindows.filter((window) => window.id !== id),
        selectedWindow,
      ];
    });
  }

  function closeWindow(instanceId: string) {
    setWindows((currentWindows) =>
      currentWindows.filter((window) => window.id !== instanceId)
    );
  }
  function minimizeWindow(id: string) {
    setWindows((currentWindows) =>
      currentWindows.map((window) =>
        window.id === id ? { ...window, minimized: true } : window
      )
    );
  }
  function restoreWindow(id: string) {
    setWindows((currentWindows) =>
      currentWindows.map((window) =>
        window.id === id ? { ...window, minimized: false } : window
      )
    );
  }

  const minimizedWindows = windows.filter((window) => window.minimized);
  return (
    <div className="absolute inset-0 ">
      <button className={`${styles.genericButton} ${selectedTheme.button}`} onClick={() => openWindow("theme-switcher")}>
        Open Theme Switcher
      </button>

        <button className={`${styles.genericButton} ${selectedTheme.button}`} onClick={() => openWindow("projects")}>
          Open Projects
        </button>
        <button className={`${styles.genericButton} ${selectedTheme.button}`} onClick={() => openWindow("about")}>
          Open About me
        </button>
        <AdminButton />
        <div>
          {minimizedWindows.map((window) => {
            const definition = windowDefinitions[window.type];

            return (
              <button
                key={window.id}
                onClick={() => restoreWindow(window.id)}
              >
                {definition.title}
              </button>
            );
          })}
        </div>
        {windows
          .filter((window) => !window.minimized)
          .map((window, index) => {
            const definition = windowDefinitions[window.type];

    return (
              <DraggableWindow key={window.id} width={definition.width} height={definition.height} zIndex={index + 1} onFocus={() => bringToFront(window.id)} >
                <WindowFrame
                  title={definition.title}
                  onClose={() => closeWindow(window.id)}
                  onMinimize={() => minimizeWindow(window.id)}
                  onClick={() => bringToFront(window.id)}
        >
          {definition.content}
        </WindowFrame>
      </DraggableWindow>
    );
  })}
    </div>
  );
}
