"use client";

import { useEffect, useRef } from "react";

const TRAIL_LENGTH = 12;

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let raf = 0;

    const trail: { x: number; y: number; opacity: number; scale: number }[] = [];
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      trail.push({ x: 0, y: 0, opacity: 0, scale: 1 });
    }
    let trailIndex = 0;
    let lastTrailTime = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx}px, ${my}px)`;
      }
      if (ringRef.current) {
        const target = e.target as HTMLElement;
        const interactive = target.closest("a, button, input, textarea, [data-cursor]");
        ringRef.current.style.scale = interactive ? "1.8" : "1";
        ringRef.current.classList.toggle("cursor-active", Boolean(interactive));
      }

      const now = performance.now();
      if (now - lastTrailTime > 16) {
        const t = trail[trailIndex];
        t.x = mx;
        t.y = my;
        t.opacity = 0.5;
        t.scale = 1;
        trailIndex = (trailIndex + 1) % TRAIL_LENGTH;
        lastTrailTime = now;
      }
    };

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`;
        ringRef.current.style.top = `${ry}px`;
      }

      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const t = trail[i];
        const el = trailRefs.current[i];
        if (!el) continue;

        if (t.opacity > 0.02) {
          t.opacity *= 0.88;
          t.scale *= 0.95;
          el.style.transform = `translate(${t.x}px, ${t.y}px) scale(${t.scale})`;
          el.style.opacity = `${t.opacity}`;
          el.style.display = "block";
        } else {
          el.style.display = "none";
        }
      }

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true">
      <div ref={ringRef} className="cursor-ring" />
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { trailRefs.current[i] = el; }}
          className="cursor-trail"
          style={{ display: "none" }}
        />
      ))}
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
