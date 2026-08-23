"use client";

import { useEffect, useRef } from "react";

const SIZE = 256;
const FRAME_COUNT = 8;
const FRAME_MS = 90;

export default function NoiseOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    canvas.width = SIZE;
    canvas.height = SIZE;

    const frames: ImageData[] = [];
    for (let f = 0; f < FRAME_COUNT; f++) {
      const img = ctx.createImageData(SIZE, SIZE);
      const data = img.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 18;
      }
      frames.push(img);
    }

    let frame = 0;
    const timer = window.setInterval(() => {
      ctx.putImageData(frames[frame], 0, 0);
      frame = (frame + 1) % FRAME_COUNT;
    }, FRAME_MS);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        width: "100%",
        height: "100%",
        mixBlendMode: "overlay",
        opacity: 0.5,
        imageRendering: "pixelated",
      }}
    />
  );
}
