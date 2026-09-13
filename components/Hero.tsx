"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { animate, motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import type { MouseEvent, ReactNode, RefObject } from "react";
import type { Variants } from "framer-motion";
import type Lenis from "lenis";
import Typewriter from "./ui/Typewriter";
import MagneticButton from "./ui/MagneticButton";
import Laptop from "./Laptop";
import { ArrowUpRightIcon } from "./icons";
import { site } from "@/data/site";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

const pill: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

const emptySubscribe = () => () => {};

const FADE_LEAD = 120;

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

function HeroGrid({
  onExplore,
}: {
  onExplore?: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <>
      <div className="text-left">
        <motion.p
          variants={pill}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.28em] text-slate-300 sm:mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_#a3e635]" />
          </span>
          Available for new projects
        </motion.p>

        <motion.h1
          variants={item}
          className="text-6xl font-black leading-none tracking-tight sm:text-7xl xl:text-8xl"
        >
          <span className="gradient-text drop-shadow-[0_0_32px_rgba(163,230,53,0.35)]">
            {site.name.toUpperCase()}
          </span>
        </motion.h1>

        <motion.h2
          variants={item}
          className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight text-slate-100 sm:mt-6 sm:text-4xl lg:text-5xl"
        >
          I design &amp; build web experiences{" "}
          <span className="gradient-text">from scratch.</span>
        </motion.h2>

        <motion.div
          variants={item}
          className="mt-6 flex h-9 items-center font-mono text-lg text-slate-400 sm:mt-7 sm:text-xl"
        >
          <span className="mr-2 text-secondary">&gt;</span>
          <Typewriter words={site.roles} />
        </motion.div>

        <motion.p
          variants={item}
          className="mt-7 max-w-xl text-base leading-relaxed text-slate-400 sm:mt-8 sm:text-lg"
        >
          {site.tagline}
        </motion.p>

        <motion.div variants={item} className="mt-11 flex flex-wrap items-center gap-4 sm:mt-12 sm:gap-5">
          <MagneticButton
            href="#projects"
            onClick={onExplore}
            className="btn-neon rounded-xl px-8 py-3.5 font-semibold"
          >
            View my work
          </MagneticButton>
          <MagneticButton
            href={site.showcaseUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-neon-2 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 font-semibold"
          >
            Project Hub
            <ArrowUpRightIcon className="h-4 w-4" />
          </MagneticButton>
        </motion.div>
      </div>
    </>
  );
}

export default function Hero({
  onNavigate,
  onScrubContainer,
  lenisRef,
  children,
}: {
  onNavigate: (id: string) => void;
  onScrubContainer?: (el: HTMLDivElement | null) => void;
  lenisRef?: RefObject<Lenis | null>;
  children?: ReactNode;
}) {
  const scrubRef = useRef<HTMLDivElement>(null);
  const revealedRef = useRef<"idle" | "arming" | "revealing" | "revealed">("idle");
  const settleTimerRef = useRef<number | null>(null);
  const revealAnimRef = useRef<ReturnType<typeof animate> | null>(null);
  const aboutElRef = useRef<HTMLElement | null>(null);
  const mounted = useIsClient();

  const lidAngle = useMotionValue(90);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const overlayOpacity = useMotionValue(1);
  const bgDarkOpacity = useMotionValue(0);
  const bgWhiteOpacity = useMotionValue(0);
  const heroOpacity = useMotionValue(1);
  const [overlayHidden, setOverlayHidden] = useState(false);

  useMotionValueEvent(overlayOpacity, "change", (v) => {
    setOverlayHidden(v <= 0.001);
  });

  const cancelReveal = useCallback(() => {
    lenisRef?.current?.start();
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
    revealAnimRef.current?.stop();
    revealAnimRef.current = null;
  }, [lenisRef]);

  const startReveal = useCallback(() => {
    settleTimerRef.current = null;
    if (revealedRef.current !== "arming") return;
    revealedRef.current = "revealing";
    lenisRef?.current?.stop();
    revealAnimRef.current = animate(overlayOpacity, 0.37, {
      duration: 0.09,
      ease: "easeOut",
      onComplete: () => {
        revealAnimRef.current = animate(overlayOpacity, 0, {
          duration: 0.04,
          ease: "easeIn",
          onComplete: () => {
            revealAnimRef.current = null;
            revealedRef.current = "revealed";
            lenisRef?.current?.start();
          },
        });
      },
    });
  }, [overlayOpacity, lenisRef]);

  const applyProgress = useCallback(
    (p: number) => {
      const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easeOutBack = (t: number) => {
        const c1 = 1.5;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      };

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = Math.min(300, vw * 0.72);
      const stageH = w;
      const zoom = Math.max(1, (0.4 * vh) / (0.99 * stageH));

      const cornerW = Math.min(100, vw * 0.28);
      const startScale = cornerW / w;
      const halfW = (w * startScale) / 2;
      const halfH = halfW;
      const entryX = vw / 2 - 16 - halfW;
      const entryY = 96 + halfH - vh / 2;

      const glide = clamp01((p - 0.02) / 0.2);
      const gx = easeOutBack(glide);
      const gy = easeInOutCubic(glide);
      let px = entryX * (1 - gx);
      let py = entryY * (1 - gy);
      let s = startScale + (1 - startScale) * easeOutCubic(glide);

      const jerkT = clamp01((p - 0.22) / 0.08);
      const wobble = Math.sin(jerkT * Math.PI * 2) * 14 * Math.exp(-jerkT * 4);
      px -= wobble * 0.5;
      py += wobble;
      s *= 1 - Math.sin(jerkT * Math.PI) * 0.03;

      const lid = clamp01((p - 0.3) / 0.15);
      lidAngle.set(90 - lid * 102);

      const zoomed = easeInOutCubic(clamp01((p - 0.6) / 0.4));
      const bgWhite = zoomed;
      const finalScale = 1 + (zoom - 1) * zoomed;
      s = p < 0.45 ? s : finalScale;

      x.set(px);
      y.set(py);
      scale.set(s);

      const darkLevel = clamp01(p / 0.15);
      if (revealedRef.current === "idle") {
        overlayOpacity.set(1);
        bgDarkOpacity.set(darkLevel * (1 - bgWhite) * 0.5);
        bgWhiteOpacity.set(bgWhite);
      }

      heroOpacity.set(1 - clamp01((p - 0.5) / 0.15));
    },
    [
      bgDarkOpacity,
      bgWhiteOpacity,
      heroOpacity,
      lidAngle,
      overlayOpacity,
      scale,
      x,
      y,
    ],
  );

  const onScrub = useCallback(() => {
    const el = scrubRef.current;
    if (!el) return;
    const vh = window.innerHeight;

    const about =
      aboutElRef.current ??
      el.querySelector<HTMLElement>("#about") ??
      null;
    if (about) aboutElRef.current = about;
    const revealStart = (about ? about.offsetTop : vh * 3) - FADE_LEAD;
    const p = vh > 0 ? Math.min(1, Math.max(0, el.scrollTop / revealStart)) : 0;

    if (revealedRef.current === "revealing") {
      if (Math.abs(el.scrollTop - revealStart) > 0.5) {
        el.scrollTop = revealStart;
      }
      return;
    }

    applyProgress(p);

    if (el.scrollTop < vh * 1.35) {
      if (revealedRef.current !== "idle") {
        cancelReveal();
        revealedRef.current = "idle";
        applyProgress(p);
      }
      return;
    }

    if (el.scrollTop >= revealStart) {
      if (revealedRef.current === "idle" || revealedRef.current === "arming") {
        revealedRef.current = "arming";
        if (settleTimerRef.current !== null) {
          window.clearTimeout(settleTimerRef.current);
        }
        settleTimerRef.current = window.setTimeout(startReveal, 40);
      }
    }
  }, [applyProgress, cancelReveal, startReveal]);

  const onExplore: (e: MouseEvent<HTMLAnchorElement>) => void = (e) => {
    e.preventDefault();
    onNavigate("projects");
  };

  useEffect(() => {
    const el = scrubRef.current;
    if (!el) return;

    let ticking = false;
    const handler = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        onScrub();
      });
    };

    el.addEventListener("scroll", handler, { passive: true });
    return () => {
      el.removeEventListener("scroll", handler);
      cancelReveal();
    };
  }, [onScrub, cancelReveal]);

  useLayoutEffect(() => {
    applyProgress(0);
  }, [applyProgress]);

  const overlay = (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
      style={{ opacity: overlayOpacity, visibility: overlayHidden ? "hidden" : "visible" }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0 bg-bg"
        style={{ opacity: bgDarkOpacity }}
      />
      <motion.div
        className="absolute inset-0 bg-white"
        style={{ opacity: bgWhiteOpacity }}
      />

      <div className="absolute left-1/2 top-[55%] sm:top-[41%] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          style={{ x, y, scale }}
          className="w-[min(300px,72vw)] will-change-transform"
        >
          <div className="relative">
            <div className="laptop-glow" />
            <Laptop lidAngle={lidAngle} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <>
      <div
        ref={(el) => {
          scrubRef.current = el;
          onScrubContainer?.(el);
        }}
        className="relative h-dvh overflow-y-auto overscroll-contain scroll-auto no-scrollbar pb-[env(safe-area-inset-bottom)]"
      >
        <div>
          <div className="relative h-[300vh]">
            <section
              id="home"
              className="sticky top-0 flex h-dvh items-center overflow-hidden px-6 py-16 sm:py-28"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
              >
                <div className="absolute -left-40 top-1/4 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full bg-primary/[0.05] blur-[120px]" />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg/70 to-transparent" />
              </div>
              <motion.div
                style={{ opacity: heroOpacity }}
                variants={container}
                initial="hidden"
                animate="show"
                className="relative mx-auto grid w-full max-w-6xl items-center gap-14"
              >
                <HeroGrid onExplore={onExplore} />
              </motion.div>
            </section>
          </div>

          {children}
        </div>
      </div>

      {mounted ? createPortal(overlay, document.body) : null}
    </>
  );
}
