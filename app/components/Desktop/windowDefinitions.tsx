import { DisplayProject } from "@/app/Features/Projects/types";
import ContactWindow from "../ContactWindow/ContactWindow";
import ProjectWindow from "../ProjectWindow/ProjectWindow";
import ThemeSwitcher from "../ui/ThemeSwitcher";

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
    icon: string
    startPos: "default" | "right";
    desktopLabel?: string
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
    render: (window) => <ProjectWindow {...window.project!} />,
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
  render: () => <ContactWindow />,
  icon: "✉",
  startPos: "right",
  desktopLabel: "contact.exe",
},

};