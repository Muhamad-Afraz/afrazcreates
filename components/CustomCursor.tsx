"use client";

import { useEffect, useRef } from "react";

const TRAIL_LENGTH = 12;
const JUMP_LIMIT = 500;
const CONFIRM_WINDOW_MS = 140;

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
    let rs = 1;
    let raf = 0;
    let running = false;
    let hasMoved = false;
    let lastInteractive: boolean | null = null;
    let lastTrailTime = 0;
    let trailIndex = 0;
    let targetEl: EventTarget | null = null;
    let lx = 0;
    let ly = 0;
    let pendingJump: { x: number; y: number; t: number } | null = null;

    const trail: { x: number; y: number; opacity: number; scale: number }[] = [];
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      trail.push({ x: 0, y: 0, opacity: 0, scale: 1 });
    }

    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const now = performance.now();

      if (!hasMoved) {
        lx = x;
        ly = y;
        mx = x;
        my = y;
        rx = x;
        ry = y;
        hasMoved = true;
      } else {
        const jump = Math.hypot(x - lx, y - ly);
        if (jump > JUMP_LIMIT) {
          const corroborated =
            pendingJump !== null &&
            now - pendingJump.t <= CONFIRM_WINDOW_MS &&
            Math.hypot(x - pendingJump.x, y - pendingJump.y) <= JUMP_LIMIT;
          if (!corroborated) {
            pendingJump = { x, y, t: now };
            return;
          }
        }
        pendingJump = null;
        lx = x;
        ly = y;
        mx = x;
        my = y;
      }
      targetEl = e.target;

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
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }

      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;

      const interactive =
        targetEl instanceof Element &&
        Boolean(targetEl.closest("a, button, input, textarea, [data-cursor]"));
      if (interactive !== lastInteractive) {
        lastInteractive = interactive;
        ringRef.current?.classList.toggle("cursor-active", interactive);
      }
      rs += ((interactive ? 1.8 : 1) - rs) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${rs})`;
      }

      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const t = trail[i];
        const el = trailRefs.current[i];
        if (!el) continue;

        if (t.opacity > 0.02) {
          t.opacity *= 0.88;
          t.scale *= 0.95;
          el.style.transform = `translate3d(${t.x}px, ${t.y}px, 0) scale(${t.scale})`;
          el.style.opacity = `${t.opacity}`;
          el.style.display = "block";
        } else {
          el.style.display = "none";
        }
      }

      if (running) raf = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const onVisibility = () => {
      if (document.hidden) stopLoop();
      else startLoop();
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("visibilitychange", onVisibility);
    startLoop();

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      stopLoop();
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
