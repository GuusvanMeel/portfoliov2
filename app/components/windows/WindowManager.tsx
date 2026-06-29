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
import Taskbar, { TaskbarWindow } from "../taskbar/TaskBar";




type WindowType = "theme-switcher" | "projects" | "about";

type WindowData = {
  id: string;
  type: WindowType;
  minimized: boolean;
  project?: DisplayProject;
  zIndex: number;
};

const windowDefinitions: Record<
  WindowType,
  {
    title: string;
    width: number;
    height: number;
    render: (window: WindowData) => React.ReactNode;
    icon: string
  }
> = {
  "theme-switcher": {
    title: "Switch the theme!",
    width: 150,
    height: 150,
    render: () => <ThemeSwitcher />,
    icon: "◐",
  },
  projects: {
    title: "Projects",
    width: 818, //door padding +8
    height: 628, //door padding +8
    render: (window) => <ProjectWindow {...window.project!} />,
    icon: "▣",
  },
  about: {
    title: "About Me",
    width: 250,
    height: 250,
    render: () => <p>About me content</p>,
    icon: "i",
  },

};

export default function WindowManager({ projects, }: Readonly<{ projects: Project[] }>) {
  const [windows, setWindows] = useState<WindowData[]>([]);
  const { theme } = useTheme(); //dit moet weg als de buttons uit de manager gaan
  const selectedTheme = windowThemes[theme]; //deze ook
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [highestZIndex, setHighestZIndex] = useState(1);

  function openWindow(type: WindowType, project?: Project) {
    if (type === "projects" && !project) {
      throw new Error("Project window requires a project");
    }
const id = `${type}-${Date.now()}-${Math.random()}`;

    setWindows((currentWindows) => [
      ...currentWindows,
      {
        id: id,
        type,
        minimized: false,
        project:
          type === "projects" && project
            ? mapProjectToDisplayproject(project)
            : undefined,
        zIndex: highestZIndex
      },

    ]
    );
    setHighestZIndex((z) => z + 1);
   setActiveWindowId(id);
  }


  function bringToFront(id: string) {
    setActiveWindowId(id);

    setWindows((currentWindows) =>
      currentWindows.map((window) =>
        window.id === id
          ? { ...window, zIndex: highestZIndex + 1, minimized: false }
          : window
      )
    );

    setHighestZIndex((z) => z + 1);
  }

  function closeWindow(instanceId: string) {
    setWindows((currentWindows) =>
      currentWindows.filter((window) => window.id !== instanceId)
    );
  }
  function setWindowMinimized(id: string, minimized: boolean) {
    setWindows((currentWindows) =>
      currentWindows.map((window) =>
        window.id === id ? { ...window, minimized } : window
      )
    );
  }
  function getWindowTitle(window: WindowData) {
    if (window.type === "projects" && window.project) {
      return window.project.title;
    }

    return windowDefinitions[window.type].title;
  }


  function handleTaskbarWindowClick(id: string) {
    const selectedWindow = windows.find((window) => window.id === id);

    if (!selectedWindow) {
      return;
    }

    bringToFront(id);
  }

  const taskbarWindows: TaskbarWindow[] = windows.map((window) => ({
    id: window.id,
    title: getWindowTitle(window),
    minimized: window.minimized,
    active: window.id === activeWindowId,
    icon: windowDefinitions[window.type].icon,
  }));

  return (
    <div>
      <div className="absolute inset-0 ">
        <button className={`${styles.genericButton} ${selectedTheme.button}`} onClick={() => openWindow("theme-switcher")}>
          Open Theme Switcher
        </button>

        {projects.map((project) => (
          <button
            key={project.id}
            className={`${styles.genericButton} ${selectedTheme.button}`}
            onClick={() => openWindow("projects", project)}
          >
            Open {project.title}
          </button>
        ))}
        <button className={`${styles.genericButton} ${selectedTheme.button}`} onClick={() => openWindow("about")}>
          Open About me
        </button>
        <AdminButton />
        <ThemeSwitcher></ThemeSwitcher>




        {windows
          .filter((window) => !window.minimized)
          .map((window) => {
            const definition = windowDefinitions[window.type];

            return (
              <DraggableWindow key={window.id} width={definition.width} height={definition.height} zIndex={window.zIndex} onFocus={() => bringToFront(window.id)} >
                <WindowFrame
                  title={getWindowTitle(window)} 
                  onClose={() => closeWindow(window.id)}
                  onMinimize={() => setWindowMinimized(window.id, true)}
                  onClick={() => bringToFront(window.id)}
                >
                  {definition.render(window)}
                </WindowFrame>

              </DraggableWindow>
            );
          })}
        <Taskbar
          windows={taskbarWindows}
          onWindowClick={handleTaskbarWindowClick}
          onCloseWindow={closeWindow}
        />
      </div>
    </div>
  );
}
