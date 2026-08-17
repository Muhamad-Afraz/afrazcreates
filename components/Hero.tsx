"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { animate, motion, useMotionValue } from "framer-motion";
import type { MouseEvent, ReactNode, RefObject } from "react";
import type { Variants } from "framer-motion";
import type Lenis from "lenis";
import Typewriter from "./ui/Typewriter";
import MagneticButton from "./ui/MagneticButton";
import Laptop from "./Laptop";
import { site } from "@/data/site";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] },
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
  onContact,
}: {
  onExplore?: (e: MouseEvent<HTMLAnchorElement>) => void;
  onContact?: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <>
      <div className="text-left">
        <motion.p
          variants={item}
          className="mb-6 font-mono text-sm uppercase tracking-[0.35em] text-primary sm:text-base"
        >
          Hello, world! I&apos;m
        </motion.p>

        <motion.h1
          variants={item}
          className="text-5xl font-extrabold leading-tight sm:text-6xl lg:text-7xl xl:text-8xl"
        >
          <span className="gradient-text drop-shadow-[0_0_30px_rgba(163,230,53,0.35)]">
            {site.name}
          </span>
        </motion.h1>

        <motion.div
          variants={item}
          className="mt-7 flex h-12 items-center font-mono text-xl text-slate-300 sm:text-3xl"
        >
          <span className="mr-2 text-secondary">&gt;</span>
          <Typewriter words={site.roles} />
        </motion.div>

        <motion.p
          variants={item}
          className="mt-8 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
        >
          {site.tagline}
        </motion.p>

        <motion.div variants={item} className="mt-12 flex flex-wrap items-center gap-5">
          <MagneticButton
            href="#contact"
            onClick={onContact}
            className="btn-neon rounded-xl px-8 py-3.5 font-semibold"
          >
            Get in touch
          </MagneticButton>
          <MagneticButton
            href="#about"
            onClick={onExplore}
            className="btn-neon-2 rounded-xl px-8 py-3.5 font-semibold"
          >
            Explore my work
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
    onNavigate("about");
  };

  const onContact: (e: MouseEvent<HTMLAnchorElement>) => void = (e) => {
    e.preventDefault();
    onNavigate("contact");
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
      style={{ opacity: overlayOpacity }}
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

      <div className="absolute left-1/2 top-[41%] -translate-x-1/2 -translate-y-1/2">
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
        className="relative h-screen overflow-y-auto overscroll-contain scroll-auto no-scrollbar pb-[env(safe-area-inset-bottom)]"
      >
        <div>
          <div className="relative h-[300vh]">
            <section
              id="home"
              className="sticky top-0 flex h-screen items-start sm:items-center overflow-hidden px-6 pt-24 pb-12 sm:py-28"
            >
              <motion.div
                style={{ opacity: heroOpacity }}
                variants={container}
                initial="hidden"
                animate="show"
                className="mx-auto grid w-full max-w-6xl items-center gap-14"
              >
                <HeroGrid onExplore={onExplore} onContact={onContact} />
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
