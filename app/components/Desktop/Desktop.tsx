"use client";

import { mapProjectToDisplayproject } from "@/app/Features/Projects/mapper";
import { useTheme } from "@/app/Features/Theme/ThemeProvider";
import { windowThemes } from "@/app/Features/Window/windowThemes";
import { Project } from "@/app/Features/Projects/types";
import { useEffect, useState } from "react";
import Taskbar, { TaskbarWindow } from "../taskbar/TaskBar";
import DesktopIcon from "../ui/DesktopIcon";
import ThemeSwitcher from "../ui/ThemeSwitcher";

const DraggableWindow = dynamic(() => import("../windows/DraggableWindow"), {
  ssr: false,
});
import WindowFrame from "../windows/WindowFrame";
import styles from "../windows/WindowFrame.module.css"
import dynamic from "next/dynamic";
import { windowDefinitions, type WindowData, type WindowType } from "./windowDefinitions";






export default function Desktop({ projects, }: Readonly<{ projects: Project[] }>) {
  const [windows, setWindows] = useState<WindowData[]>([
    {
      id: "Contact-startup",
      type: "contact",
      minimized: false,
      zIndex: 0
    }
  ]);

  const [activeWindowId, setActiveWindowId] = useState<string | null>("Contact-startup");
  const [highestZIndex, setHighestZIndex] = useState(1);
  const { theme } = useTheme();
  const selectedTheme = windowThemes[theme];
  
  //DIT IS ALLEMAAL DESKTOPICON DINGEN
  const [selectedDesktopIconId, setSelectedDesktopIconId] = useState<string | null>(null);
  useEffect(() => {
  function clearDesktopSelection(event: PointerEvent) {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    if (!target.closest("[data-desktop-icon]")) {
      setSelectedDesktopIconId(null);
    }
    }

    document.addEventListener("pointerdown", clearDesktopSelection);

    return () => {
      document.removeEventListener("pointerdown", clearDesktopSelection);
    };
  }, []);
//TOT HIER

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
        zIndex: highestZIndex,      },

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
      setActiveWindowId((currentActiveId) =>
    currentActiveId === instanceId ? null : currentActiveId
  );
  }
  function MinimizeWindow(id: string) {
    setWindows((currentWindows) =>
      currentWindows.map((window) =>
        window.id === id ? { ...window, minimized: true } : window
      )
    );
    
    setActiveWindowId((currentActiveId) =>
      currentActiveId === id ? null : currentActiveId
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
  
  const desktopWindowIcons = Object.entries(windowDefinitions)
  .filter(([, definition]) => definition.desktopLabel)
  .map(([windowType, definition]) => ({
    id: windowType,
    windowType: windowType as WindowType,
    label: definition.desktopLabel!,
    icon: definition.icon,
  }));

  return (
    
      <div className={`absolute inset-0 ${selectedTheme.desktopBackground}`}>
                <ThemeSwitcher></ThemeSwitcher>

        <div className={styles.desktopIcons}>
  {desktopWindowIcons.map((desktopIcon) => (
    <DesktopIcon
      key={desktopIcon.id}
      id={desktopIcon.id}
      label={desktopIcon.label}
      icon={desktopIcon.icon}
      selected={selectedDesktopIconId === desktopIcon.id}
      onSelect={setSelectedDesktopIconId}
      onOpen={() => openWindow(desktopIcon.windowType)}
    />
  ))}

  {projects.map((project) => {
    const iconId = `project-${project.id}`;

    return (
      <DesktopIcon
        key={project.id}
        id={iconId}
        label={`${project.title}.exe`}
        icon="▣"
        selected={selectedDesktopIconId === iconId}
        onSelect={setSelectedDesktopIconId}
        onOpen={() => openWindow("projects", project)}
      />
    );
  })}
</div>



        {windows
          .filter((window) => !window.minimized)
          .map((window) => {
            const definition = windowDefinitions[window.type];

            return (
              <DraggableWindow key={window.id} width={definition.width} height={definition.height} zIndex={window.zIndex} onFocus={() => bringToFront(window.id)} startPos={definition.startPos} >
                <WindowFrame
                  title={getWindowTitle(window)} 
                  onClose={() => closeWindow(window.id)}
                  onMinimize={() => MinimizeWindow(window.id)}
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
    
  );
}
