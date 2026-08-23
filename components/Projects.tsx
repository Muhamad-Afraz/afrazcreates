"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import type { Project } from "@/data/site";
import { site } from "@/data/site";
import TiltCard from "./ui/TiltCard";
import SectionHeading from "./ui/SectionHeading";
import { ArrowUpRightIcon } from "./icons";

const TOTAL_PANELS = 6;
const TRACK_EDGE = "max(1.5rem, calc((100vw - 72rem) / 2 + 1.5rem))";

function StatusBadge({ project }: { project: Project }) {
  const statusConfig = {
    live: { label: "Live", dot: "bg-primary shadow-[0_0_6px_#a3e635]", text: "text-primary" },
    building: { label: "Building", dot: "bg-yellow-400 shadow-[0_0_6px_#facc15]", text: "text-yellow-400" },
    planning: { label: "Planning", dot: "bg-blue-400 shadow-[0_0_6px_#60a5fa]", text: "text-blue-400" },
  };
  const config = statusConfig[project.status!];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium ${config.text} ${project.status === "live" ? "text-[17px]" : "text-sm opacity-60"}`}
    >
      {project.status !== "live" && <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />}
      {config.label}
      {project.status === "live" && <ArrowUpRightIcon className="h-4 w-4" />}
    </span>
  );
}

function TagList({ project }: { project: Project }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      <li className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-slate-300">
        {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
      </li>
      {project.tag && (
        <li className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-slate-300">
          {project.tag}
        </li>
      )}
    </ul>
  );
}

function ProjectPanel({
  project,
  index,
  className = "",
}: {
  project: Project;
  index: number;
  className?: string;
}) {
  return (
    <div data-cursor className={`shrink-0 ${className}`}>
      <TiltCard
        max={7}
        className="card glow-border relative flex h-full w-full flex-col overflow-hidden rounded-2xl p-7 transition-colors duration-300 hover:border-primary/40 sm:p-9"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-3 -top-8 select-none font-mono text-[9rem] font-extrabold leading-none text-white/[0.04]"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="font-mono text-sm font-bold tracking-[0.3em] text-primary">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-5 text-2xl font-bold sm:text-3xl">{project.title}</h3>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-400 sm:text-base">
          {project.description}
        </p>

        <TagList project={project} />

        <div className="mt-7 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
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
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-transform duration-200 hover:-translate-y-0.5"
            >
              Visit site
              <ArrowUpRightIcon className="h-4 w-4" />
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
      className={`group relative flex shrink-0 flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-primary/30 bg-primary/[0.04] p-8 text-center transition-colors duration-300 hover:border-primary/60 hover:bg-primary/[0.08] ${className}`}
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 text-primary transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_24px_rgba(163,230,53,0.25)]">
        <ArrowUpRightIcon className="h-7 w-7 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
      <span>
        <span className="block text-2xl font-bold sm:text-3xl">
          View <span className="gradient-text">all projects</span>
        </span>
        <span className="mt-3 block text-sm text-slate-400">
          The full archive lives on my showcase site.
        </span>
      </span>
      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 font-mono text-xs uppercase tracking-widest text-slate-300 transition-colors duration-300 group-hover:border-primary/50 group-hover:text-primary">
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
            <ProjectPanel key={project.title} project={project} index={i} className="min-h-[340px]" />
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
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-44 pb-10">
          <header className="mx-auto w-full max-w-6xl px-6">
            <SectionHeading index="04" label="Things I've built" title="Featured" highlight="Projects" />
          </header>

          <div
            ref={trackRef}
            className="mt-8 flex w-max items-stretch gap-6 will-change-transform"
            style={{ paddingLeft: TRACK_EDGE, paddingRight: TRACK_EDGE }}
          >
            {site.projects.slice(0, 5).map((project, i) => (
              <ProjectPanel
                key={project.title}
                project={project}
                index={i}
                className="h-[52vh] min-h-[400px] w-[min(85vw,440px)] lg:w-[480px]"
              />
            ))}
            <ViewAllCard className="h-[52vh] min-h-[400px] w-[min(80vw,380px)] lg:w-[420px]" />
          </div>

          <div className="mx-auto mt-12 flex w-full max-w-6xl items-center gap-5 px-6">
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
