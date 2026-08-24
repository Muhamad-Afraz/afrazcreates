"use client";

import { useRef, useState, type ReactNode, type RefObject } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

export const TECH_REVEAL_RATIO = 0.93;

export const TECH_FLIP_IMAGE = "/images/tech-flip-back.png";

function Bracket({
  className,
  style,
}: {
  className: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-5 w-5 border-primary/50 ${className}`}
      style={style}
    />
  );
}

function TitleContent() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-10 px-6">
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative px-10 py-12 sm:px-16 sm:py-14"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-dashed border-primary/15"
          style={{ width: "min(82vw, 640px)", height: "min(48vh, 340px)" }}
        />
        <Bracket className="-left-0 -top-0 border-l-2 border-t-2" />
        <Bracket className="-right-0 -top-0 border-r-2 border-t-2" />
        <Bracket className="-bottom-0 -left-0 border-b-2 border-l-2" />
        <Bracket className="-bottom-0 -right-0 border-b-2 border-r-2" />
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.35em] text-secondary sm:text-xs">
          03 · what i work with
        </p>
        <h2 className="mt-5 text-center text-4xl font-extrabold leading-tight sm:text-6xl">
          <span className="text-white">Technologies </span>
          <span className="gradient-text">&amp; Tools</span>
        </h2>
      </motion.div>

      <div className="absolute bottom-14 flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
        scroll
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="block h-8 w-px overflow-visible bg-gradient-to-b from-primary to-transparent"
        />
      </div>
    </div>
  );
}

function FaceShade({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-black/70 to-transparent"
      style={{ opacity }}
    />
  );
}

export default function TechIntroGate({
  containerRef,
  children,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}) {
  const gateRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [sheetBlocking, setSheetBlocking] = useState(true);
  const [sheetGone, setSheetGone] = useState(false);
  const [faceFlipped, setFaceFlipped] = useState(false);

  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: gateRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.42, 0.72, 0.92, 1],
    [1, 1, 0.84, 0.84, 1.3, 1.3]
  );
  const rotateY = useTransform(scrollYProgress, [0.42, 0.72], [0, 180]);
  const sheetOpacity = useTransform(
    scrollYProgress,
    [0, 0.72, 0.82, 1],
    [1, 1, 0, 0]
  );
  const backdropOpacity = useTransform(
    scrollYProgress,
    [0, 0.295, 0.315, 0.86, 0.94, 1],
    [0, 0, 1, 1, 0, 0]
  );
  const faceShade = useTransform(scrollYProgress, [0.42, 0.57, 0.72], [0, 0.55, 0]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setSheetBlocking(p < 0.7);
    setSheetGone(p >= 0.82);
    setFaceFlipped(p >= 0.57);
  });

  if (reducedMotion) {
    return (
      <div>
        <div className="flex h-screen flex-col items-center justify-center gap-8 px-6">
          <div className="relative px-10 py-12 sm:px-16">
            <Bracket className="left-0 top-0 border-l-2 border-t-2" />
            <Bracket className="right-0 top-0 border-r-2 border-t-2" />
            <Bracket className="bottom-0 left-0 border-b-2 border-l-2" />
            <Bracket className="bottom-0 right-0 border-b-2 border-r-2" />
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.35em] text-secondary">
              03 · what i work with
            </p>
            <h2 className="mt-4 text-center text-4xl font-extrabold sm:text-6xl">
              <span className="text-white">Technologies </span>
              <span className="gradient-text">&amp; Tools</span>
            </h2>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div ref={gateRef} id="tech-gate" className="relative h-[330vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">{children}</div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-black"
          style={{ opacity: backdropOpacity, visibility: sheetGone ? "hidden" : "visible" }}
        />
        <div
          className="absolute inset-0 z-20"
          style={{
            perspective: "1600px",
            pointerEvents: sheetBlocking ? "auto" : "none",
            visibility: sheetGone ? "hidden" : "visible",
          }}
        >
          <motion.div
            className="relative h-full w-full transform-3d"
            style={{ rotateY, scale, opacity: sheetOpacity }}
          >
            <div
              className="absolute inset-0 overflow-hidden bg-bg [backface-visibility:hidden]"
              style={{ visibility: faceFlipped ? "hidden" : "visible" }}
            >
              <TitleContent />
              <FaceShade opacity={faceShade} />
            </div>

            <div
              className="absolute inset-0 overflow-hidden bg-bg transition-opacity duration-150"
              style={{ opacity: faceFlipped ? 1 : 0 }}
            >
              <Image
                src={TECH_FLIP_IMAGE}
                alt=""
                fill
                sizes="100vw"
                priority
                draggable={false}
                className="select-none object-cover [transform:scaleX(-1)]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 left-1/2 h-64 w-[36rem] max-w-full -translate-x-1/2 rounded-[50%] bg-primary/10 blur-3xl"
              />
              <FaceShade opacity={faceShade} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
