"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import SectionReveal from "../ui/SectionReveal";
import TechCard from "./TechCard";
import { hexAlpha } from "./icons";
import { site, type TechCategoryId } from "@/data/site";

type Tab = "all" | "live";

type Mode = "live" | "pinned";

type FlatTech = {
  name: string;
  icon: string;
  catId: TechCategoryId;
  color: string;
  categoryLabel: string;
  tiltDir: 1 | -1;
};

const CATEGORIES = site.techStack;
const SWAP_MS = 2400;
const LIVE_COLOR = "#a3e635";
const ALL_COLOR = "#e2e8f0";

const ALL_ITEMS: FlatTech[] = CATEGORIES.flatMap((c, ci) =>
  c.items.map((it, ii) => ({
    ...it,
    catId: c.id,
    color: c.color,
    categoryLabel: c.label,
    tiltDir: (ci + ii) % 2 === 0 ? 1 : -1,
  }))
);

const TABS: { id: Tab; label: string; color: string }[] = [
  { id: "all", label: "All", color: ALL_COLOR },
  { id: "live", label: "Live", color: LIVE_COLOR },
];

const gridVariants: Variants = {
  enter: {},
  idle: { transition: { staggerChildren: 0.035 } },
  exit: { transition: { staggerChildren: 0.012, staggerDirection: -1 } },
};

const cellVariants: Variants = {
  enter: { opacity: 0, scale: 0.7, y: 26 },
  idle: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.16, ease: "easeIn" } },
};

export default function TechnologiesCompact() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { amount: 0.25 });
  const reducedMotion = useReducedMotion();

  const [tab, setTab] = useState<Tab>("live");
  const [centerIdx, setCenterIdx] = useState(0);
  const [mode, setMode] = useState<Mode>("live");

  const [prevInView, setPrevInView] = useState(inView);
  if (inView !== prevInView) {
    setPrevInView(inView);
    if (inView) {
      setCenterIdx(0);
      setMode("live");
    }
  }

  const total = ALL_ITEMS.length;
  const safeCenter = ((centerIdx % total) + total) % total;
  const featured = ALL_ITEMS[safeCenter];

  const handleFeaturedClick = () =>
    setMode((m) => (m === "pinned" ? "live" : "pinned"));

  const changeTab = (next: Tab) => {
    if (next === tab) return;
    setTab(next);
    if (next === "live") setMode("live");
  };

  useEffect(() => {
    let timer: number | null = null;
    const clear = () => {
      if (timer !== null) {
        window.clearTimeout(timer);
        timer = null;
      }
    };
    const schedule = () => {
      clear();
      if (tab !== "live" || mode !== "live" || reducedMotion || !inView || document.hidden)
        return;
      timer = window.setTimeout(() => {
        setCenterIdx((i) => (i + 1) % total);
        schedule();
      }, SWAP_MS);
    };
    schedule();
    const onVisibility = () => (document.hidden ? clear() : schedule());
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clear();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [tab, mode, reducedMotion, inView, total]);

  return (
    <section
      ref={sectionRef}
      id="technologies"
      className="relative mx-auto flex h-svh w-full max-w-6xl flex-col justify-center overflow-hidden px-6 pb-4 pt-4"
    >
      <SectionReveal variant="fade-scale">
        <div className="flex shrink-0 items-end justify-between gap-4">
          <div className="flex select-none flex-col items-start">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-slate-300 sm:text-sm">
              Technologies <span className="text-secondary">&amp;</span>
            </span>
            <span className="gradient-text mt-1 text-3xl font-black leading-none tracking-wide sm:text-4xl">
              Tools
            </span>
          </div>
          <div
            role="group"
            aria-label="Switch technologies view"
            className="flex flex-wrap gap-2"
          >
            {TABS.map((f) => {
              const active = tab === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => changeTab(f.id)}
                  aria-pressed={active}
                  className={`rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-all duration-300 ${
                    active
                      ? ""
                      : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/25 hover:text-white"
                  }`}
                  style={
                    active
                      ? {
                          borderColor: hexAlpha(f.color, 0.65),
                          backgroundColor: hexAlpha(f.color, 0.12),
                          color: f.color,
                          boxShadow: `0 0 18px ${hexAlpha(f.color, 0.18)}`,
                        }
                      : undefined
                  }
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      <div
        className="relative mx-auto mt-4 min-h-0 w-full max-w-5xl flex-1 select-none sm:mt-5"
        style={{ perspective: "1400px" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {tab === "live" ? (
            <motion.div
              key="live-stage"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {featured && (
                  <motion.div
                    key={featured.name}
                    className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
                    initial={{
                      y: 90,
                      rotate: -featured.tiltDir * 24,
                      opacity: 0,
                      scale: 0.9,
                    }}
                    animate={{
                      y: 0,
                      rotate: 0,
                      opacity: 1,
                      scale: 1,
                      transition: { type: "spring", stiffness: 230, damping: 26, mass: 0.85 },
                    }}
                    exit={{
                      y: -90,
                      rotate: featured.tiltDir * 26,
                      opacity: 0,
                      scale: 0.92,
                      transition: { duration: 0.34, ease: "easeIn" },
                    }}
                  >
                    <TechCard
                      item={featured}
                      color={featured.color}
                      categoryLabel={featured.categoryLabel}
                      isMain
                      tiltMax={reducedMotion ? 0 : 18}
                      badge={mode}
                      onPromote={handleFeaturedClick}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="all-stage"
              className="absolute inset-0"
              variants={gridVariants}
              initial="enter"
              animate="idle"
              exit="exit"
            >
              <div className="grid h-full w-full grid-cols-4 content-center gap-2.5 sm:grid-cols-6 sm:gap-3">
                {ALL_ITEMS.map((item) => (
                  <motion.div
                    key={item.name}
                    variants={cellVariants}
                    className="h-16 sm:h-[4.75rem]"
                  >
                    <TechCard
                      item={item}
                      color={item.color}
                      categoryLabel={item.categoryLabel}
                      isMain={false}
                      tiltMax={reducedMotion ? 0 : 4}
                      className="block h-full w-full"
                      wrapperClassName="h-full"
                      innerClassName="h-full w-full flex-col gap-1"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        className="mt-2 flex shrink-0 items-center justify-center gap-2.5 font-mono text-xs tracking-wide text-secondary"
        aria-live="polite"
      >
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor:
              tab === "live" && featured
                ? featured.color
                : LIVE_COLOR,
            boxShadow: `0 0 10px ${hexAlpha(
              tab === "live" && featured ? featured.color : LIVE_COLOR,
              0.8,
            )}`,
          }}
        />
        {tab === "live"
          ? featured
            ? `${featured.name} · ${featured.categoryLabel}`
            : ""
          : `${total} tools · ${CATEGORIES.length} categories`}
      </div>
    </section>
  );
}
