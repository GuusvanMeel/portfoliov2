import type { ReactNode } from "react";
import AboutApp from "@/components/apps/AboutApp/AboutApp";
import ContactApp from "@/components/apps/ContactApp/ContactApp";
import ProjectApp from "@/components/apps/ProjectApp/ProjectApp";
import ThemeSwitcher from "@/components/ThemeSwitcher/ThemeSwitcher";
import { messages } from "@/content/en";
import type { AppType, WindowState } from "@/features/windows/types";

export type AppDefinition = {
  title: string;
  icon: string;
  width: number;
  height: number;
  startPosition: "default" | "right";
  desktopLabel?: string;
  render: (window: WindowState) => ReactNode;
};

const apps = messages.apps;

export const appDefinitions: Record<AppType, AppDefinition> = {
  "theme-switcher": {
    title: apps.themeSwitcher.title,
    width: 150,
    height: 150,
    render: () => <ThemeSwitcher />,
    icon: "◐",
    startPosition: "default",
    desktopLabel: apps.themeSwitcher.desktopLabel,
  },
  projects: {
    title: apps.project.title,
    width: 818, // content width + 8 px padding
    height: 628, // content height + 8 px padding
    render: (window) => <ProjectApp {...window.project!} />,
    icon: "▣",
    startPosition: "default",
  },
  about: {
    title: apps.about.title,
    width: 250,
    height: 250,
    render: () => <AboutApp />,
    icon: "i",
    startPosition: "default",
    desktopLabel: apps.about.desktopLabel,
  },
  contact: {
    title: apps.contact.title,
    width: 360,
    height: 500,
    render: () => <ContactApp />,
    icon: "✉",
    startPosition: "right",
    desktopLabel: apps.contact.desktopLabel,
  },
};
