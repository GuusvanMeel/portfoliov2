"use client";

import { useState } from "react";
import WindowFrame from "./WindowFrame";
import ThemeSwitcher from "./ThemeSwitcher";
import DraggableWindow from "./DraggableWindow";

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
    <div className="absolute inset-0 bg-amber-50">
      <button onClick={() => openWindow("theme-switcher")}>
        Open Theme Switcher
      </button>

      <button onClick={() => openWindow("projects")}>
        Open Projects
      </button>

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