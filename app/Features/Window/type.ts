import { ReactNode } from "react";

export type WindowFrameProps ={
    title: string;
    children: ReactNode;
    onClose?: () => void;


}
export type WindowThemeName = "win98" | "classicMac";

export type WindowTheme = {
  frame: string;
  titleBar: string;
  titleBarInactive: string;
  content: string;
  controlButton: string;
  button: string;
};