"use client";

import dynamic from "next/dynamic";
import { projectImage } from "@/features/images/imageUrls";
import type { Project } from "@/features/projects/types";
import DesktopIcon from "@/components/DesktopIcon/DesktopIcon";
import Taskbar, { type TaskbarWindow } from "@/components/Taskbar/Taskbar";
import ThemeSwitcher from "@/components/ThemeSwitcher/ThemeSwitcher";
import WindowFrame from "@/components/WindowFrame/WindowFrame";
import { messages } from "@/content/en";
import { useDesktopIconSelection } from "@/features/desktop/useDesktopIconSelection";
import { useThemeDefinition } from "@/features/theme/useThemeDefinition";
import { appDefinitions } from "@/features/windows/appDefinitions";
import type { AppType, WindowState } from "@/features/windows/types";
import { useWindowManager } from "@/features/windows/useWindowManager";

const DraggableWindow = dynamic(() => import("@/components/DraggableWindow/DraggableWindow"), {
  ssr: false,
});

function getWindowTitle(window: WindowState) {
  if (window.type === "projects" && window.project) {
    return window.project.title;
  }

  return appDefinitions[window.type].title;
}

const desktopAppIcons = Object.entries(appDefinitions)
  .filter(([, definition]) => definition.desktopLabel)
  .map(([appType, definition]) => ({
    id: appType,
    appType: appType as AppType,
    label: definition.desktopLabel!,
    icon: definition.icon,
  }));

export default function Desktop({ projects }: Readonly<{ projects: Project[] }>) {
  const { windows, activeWindowId, openWindow, focusWindow, minimizeWindow, closeWindow } =
    useWindowManager();
  const { selectedIconId, select } = useDesktopIconSelection();
  const { name, definition } = useThemeDefinition();

  const taskbarWindows: TaskbarWindow[] = windows.map((window) => ({
    id: window.id,
    title: getWindowTitle(window),
    minimized: window.minimized,
    active: window.id === activeWindowId,
    icon: appDefinitions[window.type].icon,
    iconSrc:
      window.type === "projects" && window.project?.desktopIconSrc
        ? projectImage.desktopIcon(window.project.desktopIconSrc)
        : undefined,
  }));

  return (
    <div
      data-cy="desktop"
      data-theme={name}
      className={`absolute inset-0 ${definition.desktop.background}`}
    >
      <ThemeSwitcher></ThemeSwitcher>

      <div>
        {desktopAppIcons.map((desktopIcon) => (
          <DesktopIcon
            key={desktopIcon.id}
            id={desktopIcon.id}
            label={desktopIcon.label}
            icon={desktopIcon.icon}
            selected={selectedIconId === desktopIcon.id}
            onSelect={select}
            onOpen={() => openWindow(desktopIcon.appType)}
          />
        ))}

        {projects.map((project) => {
          const iconId = `project-${project.id}`;

          return (
            <DesktopIcon
              key={project.id}
              id={iconId}
              iconSrc={projectImage.desktopIcon(project.desktopIconSrc)}
              label={`${project.title}${messages.desktop.projectIconSuffix}`}
              selected={selectedIconId === iconId}
              onSelect={select}
              onOpen={() => openWindow("projects", project)}
            />
          );
        })}
      </div>

      {windows
        .filter((window) => !window.minimized)
        .map((window) => {
          const app = appDefinitions[window.type];

          return (
            <DraggableWindow
              key={window.id}
              width={app.width}
              height={app.height}
              zIndex={window.zIndex}
              onFocus={() => focusWindow(window.id)}
              startPos={app.startPosition}
            >
              <WindowFrame
                windowId={window.id}
                windowType={window.type}
                title={getWindowTitle(window)}
                onClose={() => closeWindow(window.id)}
                onMinimize={() => minimizeWindow(window.id)}
                onClick={() => focusWindow(window.id)}
              >
                {app.render(window)}
              </WindowFrame>
            </DraggableWindow>
          );
        })}
      <Taskbar windows={taskbarWindows} onWindowClick={focusWindow} onCloseWindow={closeWindow} />
    </div>
  );
}
