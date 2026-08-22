"use client";

import { useEffect, useRef } from "react";

export default function NoiseOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const w = 256;
    const h = 256;
    canvas.width = w;
    canvas.height = h;

    const draw = () => {
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 18;
      }
      ctx.putImageData(imageData, 0, 0);
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
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
