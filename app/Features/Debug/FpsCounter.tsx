"use client";

import { useEffect, useRef, useState } from "react";

export default function FpsCounter() {
  const [fps, setFps] = useState(0);
  const [minFps, setMinFps] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    lastTime.current = performance.now();

    function update(currentTime: number) {
      frameCount.current++;

      const elapsed = currentTime - lastTime.current;

      if (elapsed >= 1000) {
        const currentFps = Math.round((frameCount.current * 1000) / elapsed);

        setFps(currentFps);
        setMinFps((currentMin) =>
          currentMin === 0 ? currentFps : Math.min(currentMin, currentFps)
        );

        frameCount.current = 0;
        lastTime.current = currentTime;
      }

      animationFrameId.current = requestAnimationFrame(update);
    }

    animationFrameId.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 8,
        right: 8,
        zIndex: 999999,
        background: "black",
        color: fps < 45 ? "red" : fps < 55 ? "yellow" : "lime",
        border: "1px solid lime",
        padding: "6px 8px",
        fontSize: 12,
        fontFamily: "monospace",
        lineHeight: 1.3,
        pointerEvents: "none",
      }}
    >
      <div>FPS: {fps}</div>
      <div>MIN: {minFps}</div>
    </div>
  );
}