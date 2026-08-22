"use client";

import { useEffect, useRef, useState } from "react";

type ScrollProgressProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
};

export default function ScrollProgress({ containerRef }: ScrollProgressProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const max = scrollHeight - clientHeight;
      const pct = max > 0 ? (scrollTop / max) * 100 : 0;
      if (barRef.current) {
        barRef.current.style.width = `${pct}%`;
      }
      if (!visible && scrollTop > 20) setVisible(true);
      if (visible && scrollTop <= 20) setVisible(false);
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
  }, [containerRef, visible]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}
    >
      <div
        ref={barRef}
        className="scroll-progress-bar h-full"
        style={{ width: "0%" }}
      />
    </div>
  );
}
