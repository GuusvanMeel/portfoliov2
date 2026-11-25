import { ReactNode } from "react";

export type WindowFrameProps = {
  title: string;
  children: ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  onClick: () => void;
  windowId?: string;
  windowType?: string;
};

export type WindowTheme = {
  frame: string;
  titleBar: string;
  titleBarInactive: string;
  content: string;
  controlButton: string;
  closeButton: string;
  button: string;
  draggingWindow: string;
  projectImage: string;
  projectTag: string;
  projectLink: string;
  projectDescription: string;
  projectDuration: string;

  taskbar: string;
  taskbarStartButton: string;
  taskbarWindowButton: string;
  taskbarWindowButtonActive: string;
  taskbarTray: string;

  desktopBackground: string;
};
