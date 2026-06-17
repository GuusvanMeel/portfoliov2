import { ReactNode } from "react";

export type WindowFrameProps ={
    title: string;
    children: ReactNode;
    onClose?: () => void;


}