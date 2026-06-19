"use client";

import { mapProjectToDisplayproject } from "@/app/Features/Projects/mapper";
import { DisplayProject } from "@/app/Features/Projects/types";
import { useTheme } from "@/app/Features/Theme/ThemeProvider";
import { windowThemes } from "@/app/Features/Window/windowThemes";
import { Project } from "@/app/Features/Projects/types";
import { useState } from "react";
import ProjectWindow from "../ProjectWindow/ProjectWindow";
import AdminButton from "../ui/AdminButton";
import ThemeSwitcher from "../ui/ThemeSwitcher";
import DraggableWindow from "./DraggableWindow";
import WindowFrame from "./WindowFrame";
import styles from "./WindowFrame.module.css";




type WindowType = "theme-switcher" | "projects" | "about";

type WindowData = {
  id: string;
  type: WindowType;
  minimized: boolean;
  project?: DisplayProject;
};

const windowDefinitions: Record<
  WindowType,
  {
    title: string;
    width: number;
    height: number;
    render: (window: WindowData) => React.ReactNode;
  }
> = {
  "theme-switcher": {
    title: "Switch the theme!",
    width: 150,
    height: 150,
        render: () => <ThemeSwitcher />,
  },
 projects: {
  title: "Projects",
  width: 818, //door padding +8
  height: 628, //door padding +8
   render: (window) => window.project ? <ProjectWindow {...window.project} /> : null,
},
  about: {
    title: "About Me",
    width: 250,
    height: 250,
    render: () => <p>About me content</p>,
  },

};

export default function WindowManager({  projects,}: Readonly<{ projects: Project[] }>) {
  const [windows, setWindows] = useState<WindowData[]>([]);
  const { theme } = useTheme(); //dit moet weg als de buttons uit de manager gaan
  const selectedTheme = windowThemes[theme]; //deze ook

  function openWindow(type: WindowType) {
  setWindows((currentWindows) => [
    ...currentWindows,
    {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      minimized: false,
    },
  ]);
}
function openProjectWindow(project: Project) {
  setWindows((currentWindows) => [
    ...currentWindows,
    {
      id: `project-${Date.now()}-${Math.random()}`,
      type: "projects",
      minimized: false,
      project: mapProjectToDisplayproject(project),
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

       {projects.map((project) => (
  <button
    key={project.id}
    className={`${styles.genericButton} ${selectedTheme.button}`}
    onClick={() => openProjectWindow(project)}
  >
    Open {project.title}
  </button>
))}
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
                className={`${styles.genericButton} ${selectedTheme.button}`}
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
                  title={window.project?.title ?? definition.title}
                  onClose={() => closeWindow(window.id)}
                  onMinimize={() => minimizeWindow(window.id)}
                  onClick={() => bringToFront(window.id)}
        >
          {definition.render(window)}
        </WindowFrame>
      </DraggableWindow>
    );
  })}
    </div>
  );
}
