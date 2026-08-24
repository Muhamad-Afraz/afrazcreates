"use client";

import { useEffect, useRef } from "react";

type ScrollProgressProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
};

export default function ScrollProgress({ containerRef }: ScrollProgressProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const max = scrollHeight - clientHeight;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${max > 0 ? scrollTop / max : 0})`;
      }
      const next = scrollTop > 20;
      if (next !== visibleRef.current) {
        visibleRef.current = next;
        if (wrapRef.current) wrapRef.current.style.opacity = next ? "1" : "0";
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => container.removeEventListener("scroll", onScroll);
  }, [containerRef]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]"
      style={{ opacity: 0, transition: "opacity 0.3s ease" }}
    >
      <div
        ref={barRef}
        className="scroll-progress-bar h-full w-full"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
