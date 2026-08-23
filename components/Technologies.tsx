"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type TargetAndTransition,
  type Variants,
} from "framer-motion";
import SectionReveal from "./ui/SectionReveal";
import TechCard from "./technologies/TechCard";
import { hexAlpha } from "./technologies/icons";
import { site, type TechCategoryId } from "@/data/site";

type Filter = "all" | TechCategoryId;

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
const ALL_COLOR = "#a3e635";
const SWAP_MS = 2400;
const ORBIT_RX = 43;
const ORBIT_RY = 38;
const JITTER = [-3, 4, -2, 5, -4, 3, 2, -5];

const ALL_ITEMS: FlatTech[] = CATEGORIES.flatMap((c, ci) =>
  c.items.map((it, ii) => ({
    ...it,
    catId: c.id,
    color: c.color,
    categoryLabel: c.label,
    tiltDir: (ci + ii) % 2 === 0 ? 1 : -1,
  }))
);

const FILTERS: { id: Filter; label: string; color: string }[] = [
  { id: "all", label: "All", color: ALL_COLOR },
  ...CATEGORIES.map((c) => ({ id: c.id as Filter, label: c.label, color: c.color })),
];

type Slot = { left: number; top: number; scale: number; rotate: number; z: number };

type CardCustom = Slot & { member: boolean; isMain: boolean; tiltDir: 1 | -1 };

function orbitSlot(order: number, count: number): Slot {
  const angleDeg = -90 + (360 / Math.max(count, 1)) * order;
  const angle = (angleDeg * Math.PI) / 180;
  const depth = (Math.sin(angle) + 1) / 2;
  return {
    left: 50 + Math.cos(angle) * ORBIT_RX,
    top: 50 + Math.sin(angle) * ORBIT_RY,
    scale: 0.86 + depth * 0.16,
    rotate: Math.cos(angle) * 9 + JITTER[order % JITTER.length],
    z: 10 + Math.round(depth * 8),
  };
}

function hiddenCustom(item: FlatTech): CardCustom {
  return {
    left: 50,
    top: 50,
    scale: 0.35,
    rotate: 0,
    z: 0,
    member: false,
    isMain: false,
    tiltDir: item.tiltDir,
  };
}

const cardVariants: Variants = {
  enter: (c: CardCustom): TargetAndTransition => ({
    left: `${c.left}%`,
    top: `${c.top}%`,
    opacity: 0,
    scale: c.member ? c.scale * 0.55 : 0.35,
    rotate: c.rotate + c.tiltDir * 22,
  }),
  idle: (c: CardCustom): TargetAndTransition => ({
    left: `${c.left}%`,
    top: `${c.top}%`,
    opacity: c.member ? 1 : 0,
    scale: c.scale,
    rotate: c.rotate,
    transition: { type: "spring", stiffness: 240, damping: 27, mass: 0.85 },
  }),
  exit: (c: CardCustom): TargetAndTransition => ({
    left: `${c.left}%`,
    top: `${c.top}%`,
    opacity: 0,
    scale: c.scale * 0.7,
    rotate: c.rotate - c.tiltDir * 24,
    transition: { duration: 0.3, ease: "easeIn" },
  }),
};

const stageVariants: Variants = {
  enter: {},
  idle: { transition: { staggerChildren: 0.04 } },
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};

function PositionedCard({
  item,
  slot,
  tiltMax,
  onPromote,
}: {
  item: FlatTech;
  slot: CardCustom;
  tiltMax: number;
  onPromote: () => void;
}) {
  return (
    <motion.div
      custom={slot}
      variants={cardVariants}
      className="absolute"
      style={{ zIndex: slot.z, pointerEvents: slot.member ? undefined : "none" }}
      aria-hidden={!slot.member}
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        <TechCard
          item={item}
          color={item.color}
          categoryLabel={item.categoryLabel}
          isMain={slot.isMain}
          tiltMax={tiltMax}
          onPromote={onPromote}
        />
      </div>
    </motion.div>
  );
}

export default function Technologies() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { amount: 0.25 });
  const reducedMotion = useReducedMotion();

  const [filter, setFilter] = useState<Filter>("all");
  const [centerIdx, setCenterIdx] = useState(0);
  const [mode, setMode] = useState<Mode>("live");
  const [genKey, setGenKey] = useState(0);
  const [, setRescheduleNonce] = useState(0);
  const prevFilterRef = useRef<Filter>("all");
  const pausedRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? ALL_ITEMS : ALL_ITEMS.filter((it) => it.catId === filter)),
    [filter]
  );

  const lenRef = useRef(visible.length);

  useEffect(() => {
    lenRef.current = visible.length;
  }, [visible.length]);

  const safeCenter = ((centerIdx % visible.length) + visible.length) % visible.length;

  const slotsByName = useMemo(() => {
    const map = new Map<string, CardCustom>();
    const orbitCount = Math.max(visible.length - 1, 0);
    let orbitOrder = 0;
    visible.forEach((item, i) => {
      if (i === safeCenter) return;
      map.set(item.name, {
        ...orbitSlot(orbitOrder++, orbitCount),
        member: true,
        isMain: false,
        tiltDir: item.tiltDir,
      });
    });
    return map;
  }, [visible, safeCenter]);

  const pauseSwap = () => {
    pausedRef.current = true;
    if (timerRef.current) window.clearTimeout(timerRef.current);
  };

  const resumeSwap = () => {
    pausedRef.current = false;
    setRescheduleNonce((n) => n + 1);
  };

  const handleOrbitClick = (name: string) => {
    const idx = visible.findIndex((v) => v.name === name);
    if (idx === -1 || idx === safeCenter) return;
    setCenterIdx(idx);
    setMode("pinned");
    setRescheduleNonce((n) => n + 1);
  };

  const handleFeaturedClick = () => {
    setMode((m) => (m === "pinned" ? "live" : "pinned"));
    setRescheduleNonce((n) => n + 1);
  };

  const changeFilter = (next: Filter) => {
    if (next === filter) return;
    const prev = prevFilterRef.current;
    if (prev !== "all" && next !== "all") setGenKey((k) => k + 1);
    prevFilterRef.current = next;
    setFilter(next);
    setCenterIdx(0);
  };

  useEffect(() => {
    const clear = () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    const schedule = () => {
      clear();
      if (mode !== "live" || reducedMotion || !inView || pausedRef.current || document.hidden)
        return;
      timerRef.current = window.setTimeout(() => {
        setCenterIdx((i) => (i + 1) % lenRef.current);
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
  }, [filter, inView, reducedMotion, mode, setRescheduleNonce]);

  const featured = visible[safeCenter];

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
            aria-label="Filter technologies by category"
            className="flex flex-wrap gap-2"
          >
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => changeFilter(f.id)}
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-dashed border-white/[0.06]"
        style={{ width: `${ORBIT_RX * 2}%`, height: `${ORBIT_RY * 2}%` }}
      />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={genKey}
            className="absolute inset-0"
            initial="enter"
            animate="idle"
            exit="exit"
            variants={stageVariants}
          >
            {ALL_ITEMS.map((item) => {
              if (featured && item.name === featured.name) return null;
              const slot = slotsByName.get(item.name) ?? hiddenCustom(item);
              return (
                <PositionedCard
                  key={item.name}
                  item={item}
                  slot={slot}
                  tiltMax={reducedMotion ? 0 : 4}
                  onPromote={() => handleOrbitClick(item.name)}
                />
              );
            })}
            <AnimatePresence mode="wait" initial={false}>
              {featured && (
                <motion.div
                  key={`${filter}:${featured.name}`}
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
                    onMouseEnter={pauseSwap}
                    onMouseLeave={resumeSwap}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
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
            backgroundColor: featured?.color,
            boxShadow: `0 0 10px ${hexAlpha(featured?.color ?? "#ffffff", 0.8)}`,
          }}
        />
        {featured ? `${featured.name} · ${featured.categoryLabel}` : ""}
      </div>
    </section>
  );
}
