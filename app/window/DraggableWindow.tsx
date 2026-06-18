"use client";

import { Rnd } from "react-rnd";
import { useEffect, useState, type ReactNode } from "react";

type DraggableWindowProps = {
    children: ReactNode;
};


export default function DraggableWindow({ children }: DraggableWindowProps) {
    const [isShiftDown, setIsShiftDown] = useState(false);
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Shift") {
                setIsShiftDown(true);
            }
        }

        function handleKeyUp(event: KeyboardEvent) {
            if (event.key === "Shift") {
                setIsShiftDown(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);
    return (
        <Rnd
            default={{
                x: 40,
                y: 40,
                width: 300,
                height: 150,
            }}
            minWidth={280}
            minHeight={150}
            bounds="parent"
            lockAspectRatio={isShiftDown}
            dragHandleClassName="window-title-bar"
        >
            {children}
        </Rnd>
    );
}