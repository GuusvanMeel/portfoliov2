import { DisplayProject } from "@/app/Features/Projects/types";
import ContactApp from "@/components/apps/ContactApp/ContactApp";
import ProjectApp from "@/components/apps/ProjectApp/ProjectApp";
import ThemeSwitcher from "@/components/ThemeSwitcher/ThemeSwitcher";

export type WindowType = "theme-switcher" | "projects" | "about" | "contact";

export type WindowData = {
  id: string;
  type: WindowType;
  minimized: boolean;
  project?: DisplayProject;
  zIndex: number;
};

export const windowDefinitions: Record<
  WindowType,
  {
    title: string;
    width: number;
    height: number;
    render: (window: WindowData) => React.ReactNode;
    icon: string;
    startPos: "default" | "right";
    desktopLabel?: string;
  }
> = {
  "theme-switcher": {
    title: "Switch the theme!",
    width: 150,
    height: 150,
    render: () => <ThemeSwitcher />,
    icon: "◐",
    startPos: "default",
    desktopLabel: "Themeswitcher.exe",
  },
  projects: {
    title: "Projects",
    width: 818, //door padding +8
    height: 628, //door padding +8
    render: (window) => <ProjectApp {...window.project!} />,
    icon: "▣",
    startPos: "default",
  },
  about: {
    title: "About Me",
    width: 250,
    height: 250,
    render: () => <p>About me content</p>,
    icon: "i",
    startPos: "default",
    desktopLabel: "about.exe",
  },
  contact: {
    title: "Contact",
    width: 360,
    height: 500,
    render: () => <ContactApp />,
    icon: "✉",
    startPos: "right",
    desktopLabel: "contact.exe",
  },
};
