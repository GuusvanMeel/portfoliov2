import { ReactNode } from "react";

export type WindowFrameProps ={
    title: string;
    children: ReactNode;
    onClose?: () => void;
    onMinimize?: () =>void;
    onClick: () => void;
}

export type WindowTheme = {
  frame: string;
  titleBar: string;
  titleBarInactive: string;
  content: string;
  controlButton: string;
  button: string;
  draggingWindow: string;
};