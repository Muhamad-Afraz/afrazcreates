"use client";

import { createContext, useContext, useRef } from "react";
import type { CSSProperties, MouseEvent, ReactNode, TouchEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

type TiltValues = {
  px: MotionValue<number>;
  py: MotionValue<number>;
};

const TiltValuesContext = createContext<TiltValues | null>(null);

export function useTiltValues(): TiltValues | null {
  return useContext(TiltValuesContext);
}

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  max?: number;
  spotlight?: string;
  style?: CSSProperties;
};

export default function TiltCard({
  children,
  className = "",
  max = 10,
  spotlight,
  style,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), {
    stiffness: 150,
    damping: 20,
  });

  const glareX = useTransform(px, [0, 1], [0, 100]);
  const glareY = useTransform(py, [0, 1], [0, 100]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.14), transparent 55%)`;

  const glowBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, ${spotlight ?? "transparent"}, transparent 42%)`;

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const onMouseLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !e.touches[0]) return;
    const rect = el.getBoundingClientRect();
    px.set((e.touches[0].clientX - rect.left) / rect.width);
    py.set((e.touches[0].clientY - rect.top) / rect.height);
  };

  const onTouchEnd = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        ...(style ?? {}),
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 900,
      }}
      className={`group relative ${className}`}
    >
      <TiltValuesContext.Provider value={{ px, py }}>
        {children}
        {spotlight && (
          <>
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: glowBackground }}
            />
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: glowBackground,
                padding: "1px",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "exclude",
                WebkitMaskComposite: "xor",
              }}
            />
          </>
        )}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glareBackground }}
        />
      </TiltValuesContext.Provider>
    </motion.div>
  );
}
