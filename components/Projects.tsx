"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, RefObject } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import type { Project } from "@/data/site";
import { site } from "@/data/site";
import TiltCard, { useTiltValues } from "./ui/TiltCard";
import SectionHeading from "./ui/SectionHeading";
import { ArrowUpRightIcon } from "./icons";
import { hexAlpha, techIcons } from "./technologies/icons";

const TOTAL_PANELS = 6;
const TRACK_EDGE = "max(1.5rem, calc((100vw - 72rem) / 2 + 1.5rem))";

const STACK_COLORS: Record<string, string> = {};
for (const cat of site.techStack) {
  for (const item of cat.items) STACK_COLORS[item.icon] = cat.color;
}

function StatusBadge({ project }: { project: Project }) {
  const statusConfig = {
    live: { label: "Live", dot: "bg-primary shadow-[0_0_6px_#a3e635]", text: "text-primary" },
    building: { label: "Building", dot: "bg-yellow-400 shadow-[0_0_6px_#facc15]", text: "text-yellow-400" },
    planning: { label: "Planning", dot: "bg-blue-400 shadow-[0_0_6px_#60a5fa]", text: "text-blue-400" },
  };
  const config = statusConfig[project.status!];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium ${config.text} ${project.status === "live" ? "text-sm sm:text-[17px]" : "text-sm opacity-60"}`}
    >
      {project.status !== "live" && <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />}
      {config.label}
      {project.status === "live" && <ArrowUpRightIcon className="h-4 w-4" />}
    </span>
  );
}

function StackChips({ project }: { project: Project }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2 sm:mt-6">
      {project.stack.map((key) => {
        const Icon = techIcons[key];
        if (!Icon) return null;
        const color = STACK_COLORS[key] ?? project.accent;
        const label =
          key === "nextjs" ? "Next.js" : key === "nodejs" ? "Node.js" : key.charAt(0).toUpperCase() + key.slice(1);
        return (
          <li
            key={key}
            className="stack-chip inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs text-slate-300 sm:px-2.5 sm:py-1"
            style={{
              borderColor: hexAlpha(color, 0.28),
              backgroundColor: hexAlpha(color, 0.08),
            }}
          >
            <Icon size={12} style={{ color }} />
            {label}
          </li>
        );
      })}
    </ul>
  );
}

function GhostNumber({ index }: { index: number }) {
  const reduced = useReducedMotion();
  const tilt = useTiltValues();
  const fallbackPx = useMotionValue(0.5);
  const fallbackPy = useMotionValue(0.5);
  const gx = useTransform(tilt?.px ?? fallbackPx, [0, 1], [16, -16]);
  const gy = useTransform(tilt?.py ?? fallbackPy, [0, 1], [10, -10]);

  return (
    <motion.span
      aria-hidden="true"
      style={reduced ? undefined : { x: gx, y: gy }}
      className="pointer-events-none absolute -right-1.5 -top-4 select-none font-mono text-[4.5rem] font-extrabold leading-none text-white/[0.04] sm:-right-3 sm:-top-8 sm:text-[9rem]"
    >
      {String(index + 1).padStart(2, "0")}
    </motion.span>
  );
}

function ProjectPanel({
  project,
  index,
  flagship = false,
  className = "",
  tiltMax = 7,
}: {
  project: Project;
  index: number;
  flagship?: boolean;
  className?: string;
  tiltMax?: number;
}) {
  return (
    <div data-cursor className={`shrink-0 ${className}`}>
      <TiltCard
        max={tiltMax}
        spotlight={hexAlpha(project.accent, 0.28)}
        style={
          {
            "--glow-c1": hexAlpha(project.accent, 0.55),
            "--glow-c2": hexAlpha(project.accent, 0.8),
            "--shimmer-accent": project.accent,
            "--card-edge": hexAlpha(project.accent, 0.45),
            "--card-shadow": hexAlpha(project.accent, 0.3),
          } as CSSProperties
        }
        className="card glow-border accent-card project-card-glow relative flex h-full w-full flex-col overflow-hidden rounded-2xl p-4 sm:p-7 lg:p-9"
      >
        <GhostNumber index={index} />

        <span
          className="font-mono text-xs font-bold tracking-[0.3em] sm:text-sm"
          style={{ color: project.accent }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3
          className={`card-title-shimmer mt-2 font-bold sm:mt-5 ${
            flagship ? "text-xl sm:text-4xl" : "text-xl sm:text-3xl"
          }`}
        >
          {project.title}
        </h3>
        <p className="mt-2 flex-1 text-[13px] leading-snug text-slate-400 sm:mt-4 sm:text-base sm:leading-relaxed">
          {project.description}
        </p>

        <StackChips project={project} />

        <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-3 sm:mt-7 sm:pt-5">
          {project.status ? (
            <StatusBadge project={project} />
          ) : (
            <span />
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ color: project.accent }}
              className="group/link inline-flex items-center text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5"
            >
              <ArrowUpRightIcon className="mr-0 h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover/link:mr-1 group-hover/link:translate-x-0 group-hover/link:opacity-100" />
              Visit site
            </a>
          )}
        </div>
      </TiltCard>
    </div>
  );
}

function ViewAllCard({ className = "" }: { className?: string }) {
  return (
    <a
      href={site.showcaseUrl}
      target="_blank"
      rel="noreferrer"
      data-cursor
      aria-label="View all projects on my showcase site"
      className={`group relative flex shrink-0 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-primary/30 bg-primary/[0.04] p-6 text-center transition-colors duration-300 hover:border-primary/60 hover:bg-primary/[0.08] sm:gap-6 sm:p-8 ${className}`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 text-primary transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_24px_rgba(163,230,53,0.25)] sm:h-16 sm:w-16">
        <ArrowUpRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-7 sm:w-7" />
      </span>
      <span>
        <span className="block text-lg font-bold sm:text-3xl">
          View <span className="gradient-text">all projects</span>
        </span>
        <span className="mt-2 block text-xs text-slate-400 sm:mt-3 sm:text-sm">
          The full archive lives on my showcase site.
        </span>
      </span>
      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-slate-300 transition-colors duration-300 group-hover:border-primary/50 group-hover:text-primary sm:px-5 sm:py-2">
        Explore
        <ArrowUpRightIcon className="h-3.5 w-3.5" />
      </span>
    </a>
  );
}

export default function Projects({
  containerRef,
}: {
  containerRef?: RefObject<HTMLDivElement | null>;
}) {
  const reduced = useReducedMotion();
  const [coarsePointer] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
  );
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const wrap = wrapRef.current;
    const track = trackRef.current;
    const scroller = containerRef?.current ?? null;
    if (!wrap || !track || !scroller) return;

    const HOLD_PX = 140;
    let maxX = 0;
    let shiftX = 0;
    let start = 0;

    const update = () => {
      if (maxX <= 0 || shiftX <= 0) return;
      const scrolled = Math.min(maxX, Math.max(0, scroller.scrollTop - start));
      const shifted = Math.min(shiftX, scrolled);
      track.style.transform = `translate3d(${(-shifted).toFixed(2)}px, 0, 0)`;
      const p = shifted / shiftX;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      if (countRef.current) {
        countRef.current.textContent = String(
          Math.min(TOTAL_PANELS, Math.round(p * (TOTAL_PANELS - 1)) + 1),
        ).padStart(2, "0");
      }
    };

    const measure = () => {
      const prevTransform = track.style.transform;
      track.style.transform = "none";
      const trackRect = track.getBoundingClientRect();
      const last = track.lastElementChild as HTMLElement | null;
      shiftX = 0;
      if (last) {
        const rect = last.getBoundingClientRect();
        shiftX = Math.max(0, Math.round(rect.right - trackRect.left - window.innerWidth));
      }
      track.style.transform = prevTransform;

      maxX = shiftX + HOLD_PX;
      wrap.style.height = `${Math.round(window.innerHeight + maxX)}px`;

      start = 0;
      let node: HTMLElement | null = wrap;
      while (node && node !== scroller) {
        start += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      update();
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    };

    const observer = new ResizeObserver(() => measure());
    observer.observe(track);

    measure();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      observer.disconnect();
      wrap.style.height = "";
      track.style.transform = "";
    };
  }, [containerRef, reduced]);

  if (reduced) {
    return (
      <section id="projects" className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <SectionHeading index="04" label="Things I've built" title="Featured" highlight="Projects" />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {site.projects.slice(0, 5).map((project, i) => (
            <ProjectPanel
              key={project.title}
              project={project}
              index={i}
              tiltMax={coarsePointer ? 0 : 7}
              className="min-h-[340px]"
            />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <ViewAllCard className="w-full max-w-md py-10" />
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="relative">
      <div ref={wrapRef}>
        <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-14 pb-6 sm:pt-44 sm:pb-10">
          <header className="mx-auto w-full max-w-6xl px-6">
            <SectionHeading index="04" label="Things I've built" title="Featured" highlight="Projects" />
          </header>

          <div
            ref={trackRef}
            className="mt-5 flex w-max items-stretch gap-6 sm:mt-8"
            style={{ paddingLeft: TRACK_EDGE, paddingRight: TRACK_EDGE, willChange: "transform" }}
          >
            {site.projects.slice(0, 5).map((project, i) => (
              <ProjectPanel
                key={project.title}
                project={project}
                index={i}
                flagship={i === 0}
                tiltMax={coarsePointer ? 0 : 7}
                className={`h-auto w-[min(72vw,320px)] sm:h-[52svh] sm:min-h-[400px] ${
                  i === 0 ? "lg:w-[550px]" : "lg:w-[465px]"
                }`}
              />
            ))}
            <ViewAllCard className="min-h-[300px] w-[min(72vw,320px)] py-10 sm:h-[52svh] sm:min-h-[400px] sm:py-0 lg:w-[420px]" />
          </div>

          <div className="mx-auto mt-6 flex w-full max-w-6xl items-center gap-5 px-6 sm:mt-12">
            <span className="shrink-0 font-mono text-xs tracking-[0.25em] text-slate-500">
              <span ref={countRef}>01</span> / {String(TOTAL_PANELS).padStart(2, "0")}
            </span>
            <div className="h-px flex-1 overflow-hidden bg-white/10">
              <div
                ref={barRef}
                className="h-full w-full origin-left bg-primary shadow-[0_0_8px_#a3e635]"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
            <span className="shrink-0 font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
              Scroll
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
