"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import type { Project } from "@/data/site";
import { site } from "@/data/site";
import SectionHeading from "./ui/SectionHeading";
import { ArrowUpRightIcon } from "./icons";
import { hexAlpha, techIcons } from "./technologies/icons";

const TOTAL_PANELS = 5;
const TRACK_EDGE = "max(1.5rem, calc((100vw - 72rem) / 2 + 1.5rem))";
const HOLD_PX = 140;

const STACK_COLORS: Record<string, string> = {};
for (const cat of site.techStack) {
  for (const item of cat.items) STACK_COLORS[item.icon] = cat.color;
}

const STACK_LABELS: Record<string, string> = {
  react: "React",
  nextjs: "Next.js",
  typescript: "TypeScript",
  tailwind: "Tailwind",
  nodejs: "Node.js",
  express: "Express",
  supabase: "Supabase",
  postgresql: "PostgreSQL",
  langgraph: "LangGraph",
  langchain: "LangChain",
  multiagent: "Multi-Agent",
  rag: "RAG",
  vectordb: "VectorDB",
  embeddings: "Embeddings",
  git: "Git",
  vercel: "Vercel",
  docker: "Docker",
  figma: "Figma",
};

type Slide =
  | { kind: "featured"; project: Project; flagship: boolean; flip: boolean }
  | { kind: "secondary"; project: Project }
  | { kind: "archive" };

function buildSlides(): Slide[] {
  const featured = site.projects.filter((p) => p.featured);
  const secondary = site.projects.filter((p) => !p.featured);
  return [
    ...featured.map(
      (project, i): Slide => ({
        kind: "featured",
        project,
        flagship: i === 0,
        flip: i % 2 === 1,
      }),
    ),
    ...secondary.map((project): Slide => ({ kind: "secondary", project })),
    { kind: "archive" },
  ];
}

function slideTitle(slide: Slide): string {
  return slide.kind === "archive" ? "Full archive" : slide.project.title;
}

function slideClass(slide: Slide): string {
  switch (slide.kind) {
    case "featured":
      return slide.flagship
        ? "w-[min(92vw,880px)]"
        : "w-[min(92vw,820px)]";
    case "secondary":
      return "w-[min(88vw,680px)]";
    case "archive":
      return "w-[min(88vw,660px)]";
  }
}

function slideHeight(slide: Slide): string {
  switch (slide.kind) {
    case "featured":
      return "h-[62svh] md:h-[min(58svh,580px)]";
    case "secondary":
      return "h-[60svh] md:h-[min(54svh,500px)]";
    case "archive":
      return "h-[56svh] md:h-[min(50svh,460px)]";
  }
}

function projectDomain(project: Project): string {
  if (project.live) {
    const host = project.live
      .replace(/^https?:\/\//, "")
      .replace(/\/+$/, "")
      .split("/")[0];
    if (host) return host;
  }
  return (
    project.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") + ".app"
  );
}

function WindowDots() {
  return (
    <span aria-hidden="true" className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
      <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
      <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
    </span>
  );
}

function ProjectVisual({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  const { accent, title, tag } = project;
  const domain = projectDomain(project);
  const monogram = title
    .replace(/[^a-zA-Z0-9]+/g, "")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 transition-colors duration-500 ${className}`}
      style={{
        background: `linear-gradient(160deg, ${hexAlpha(accent, 0.07)} 0%, rgba(6,10,3,0.5) 55%, #050a02 100%)`,
      }}
    >
      <div className="relative flex items-center gap-3 border-b border-white/[0.07] bg-white/[0.03] px-4 py-2.5">
        <WindowDots />
        <span className="ml-1 flex-1 truncate rounded-md border border-white/[0.08] bg-bg/70 px-3 py-1 font-mono text-[10px] tracking-wide text-slate-400">
          {domain}
        </span>
        <span
          aria-hidden="true"
          className="flex h-5 w-5 items-center justify-center rounded-md border border-white/10 font-mono text-[8px] text-slate-500"
        >
          {tag.slice(0, 3).toUpperCase()}
        </span>
      </div>

      <div className="relative px-5 py-6 sm:px-7 sm:py-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full blur-3xl"
          style={{ backgroundColor: hexAlpha(accent, 0.16) }}
        />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="flex h-6 w-6 items-center justify-center rounded-md font-mono text-[10px] font-black"
              style={{
                color: accent,
                border: `1px solid ${hexAlpha(accent, 0.45)}`,
                backgroundColor: hexAlpha(accent, 0.1),
              }}
            >
              {monogram.slice(0, 1)}
            </span>
            <span className="h-1.5 w-16 rounded-full bg-white/10" />
            <span className="hidden h-1.5 w-10 rounded-full bg-white/[0.06] sm:block" />
          </div>
          <span
            className="font-mono text-[9px] uppercase tracking-[0.3em]"
            style={{ color: hexAlpha(accent, 0.75) }}
          >
            {monogram}
          </span>
        </div>

        <h4 className="mt-6 text-2xl font-black leading-none sm:text-4xl">
          <span
            style={{
              color: accent,
              textShadow: `0 0 28px ${hexAlpha(accent, 0.45)}`,
            }}
          >
            {title}
          </span>
        </h4>
        <div className="mt-3 flex items-center gap-2">
          <span
            className="rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em]"
            style={{
              color: accent,
              borderColor: hexAlpha(accent, 0.4),
              backgroundColor: hexAlpha(accent, 0.08),
            }}
          >
            {tag}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2.5">
          <div className="h-10 rounded-md border border-white/[0.07] bg-white/[0.03]" />
          <div className="h-10 rounded-md border border-white/[0.07] bg-white/[0.03]" />
          <div
            className="h-10 rounded-md border"
            style={{
              borderColor: hexAlpha(accent, 0.32),
              backgroundColor: hexAlpha(accent, 0.08),
            }}
          />
        </div>

        <div className="mt-3 h-2 w-2/3 rounded-full bg-white/[0.07]" />
        <div className="mt-1.5 h-2 w-1/2 rounded-full bg-white/[0.05]" />
      </div>
    </div>
  );
}

function StackChips({ project }: { project: Project }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {project.stack.map((key) => {
        const Icon = techIcons[key];
        const color = STACK_COLORS[key] ?? project.accent;
        const label = STACK_LABELS[key] ?? key;
        return (
          <li
            key={key}
            className="stack-chip inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs text-slate-300"
            style={{
              borderColor: hexAlpha(color, 0.28),
              backgroundColor: hexAlpha(color, 0.08),
            }}
          >
            {Icon && <Icon size={12} style={{ color }} />}
            {label}
          </li>
        );
      })}
    </ul>
  );
}

function ProjectLink({
  project,
  label = "Visit project",
  className = "",
}: {
  project: Project;
  label?: string;
  className?: string;
}) {
  if (!project.live) {
    return (
      <span
        className={`inline-flex items-center gap-2 text-sm font-semibold text-slate-500 ${className}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-50" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
        </span>
        In progress
      </span>
    );
  }

  return (
    <a
      href={project.live}
      target="_blank"
      rel="noreferrer"
      style={{ color: project.accent }}
      className={`group/link inline-flex items-center gap-1.5 text-sm font-semibold ${className}`}
    >
      {label}
      <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
    </a>
  );
}

function FeaturedSlide({ slide }: { slide: Extract<Slide, { kind: "featured" }> }) {
  const { project, flagship, flip } = slide;
  return (
    <div className="h-full w-full">
      <div
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-7 lg:p-9"
        style={
          {
            "--card-edge": hexAlpha(project.accent, 0.4),
            "--card-shadow": hexAlpha(project.accent, 0.25),
          } as React.CSSProperties
        }
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-px w-1/2 bg-gradient-to-r from-transparent to-primary/40"
        />
        <div className="grid h-full min-h-0 flex-1 items-center gap-5 md:grid-cols-2 md:gap-8">
          <div className={flip ? "md:order-2" : ""}>
            <ProjectVisual
              project={project}
              className={`aspect-[16/9] w-full md:aspect-auto md:h-full`}
            />
          </div>

          <div
            className={`flex min-h-0 flex-col justify-center ${
              flip ? "md:order-1" : ""
            }`}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-secondary">
              <span
                className="mr-2 font-bold"
                style={{ color: project.accent }}
              >
                {flip ? "Featured" : flagship ? "Flagship build" : "Featured"}
              </span>
              · {project.tag}
            </p>
            <h3
              className={`mt-3 font-black leading-tight text-white ${
                flagship ? "text-3xl sm:text-4xl lg:text-5xl" : "text-2xl sm:text-4xl"
              }`}
            >
              {project.title}
            </h3>
            <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-400 sm:text-base md:line-clamp-none">
              {project.description}
            </p>

            <div className="mt-5 hidden sm:block">
              <StackChips project={project} />
            </div>

            <div className="mt-6 sm:mt-7">
              <ProjectLink project={project} label="View project" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecondarySlide({ slide }: { slide: Extract<Slide, { kind: "secondary" }> }) {
  const { project } = slide;
  return (
    <div className="h-full w-full">
      <div
        className="card group flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
        style={
          {
            "--card-edge": hexAlpha(project.accent, 0.4),
            "--card-shadow": hexAlpha(project.accent, 0.22),
          } as React.CSSProperties
        }
      >
        <ProjectVisual project={project} className="aspect-[16/9] w-full" />
        <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-xl font-bold text-white">{project.title}</h4>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
              {project.tag}
            </span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400">
            {project.description}
          </p>
          <div className="mt-4 hidden lg:block">
            <StackChips project={project} />
          </div>
          <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
            <ProjectLink project={project} label="View project" />
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: project.accent,
                boxShadow: `0 0 8px ${hexAlpha(project.accent, 0.8)}`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ArchiveSlide() {
  return (
    <div className="h-full w-full">
      <a
        href={site.showcaseUrl}
        target="_blank"
        rel="noreferrer"
        data-cursor
        className="group relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-primary/30 bg-primary/[0.04] px-6 py-10 text-center transition-all duration-300 hover:border-primary/60 hover:bg-primary/[0.07]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <span className="relative font-mono text-[11px] uppercase tracking-[0.3em] text-slate-400">
          Curated here · every build over there
        </span>
        <p className="relative mt-4 max-w-xl text-2xl font-extrabold leading-tight text-white sm:text-4xl">
          Explore the <span className="gradient-text">full project archive</span>
        </p>
        <p className="relative mt-4 max-w-md text-sm text-slate-400">
          Project-Hub is where every experiment, tool and release lives — searchable and
          always growing.
        </p>
        <span className="relative mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 font-mono text-xs uppercase tracking-widest text-slate-200 transition-colors duration-300 group-hover:border-primary/50 group-hover:text-primary">
          Open Project-Hub
          <ArrowUpRightIcon className="h-3.5 w-3.5" />
        </span>
      </a>
    </div>
  );
}

function SlideView({ slide }: { slide: Slide }) {
  return (
    <div className={`relative shrink-0 ${slideHeight(slide)} ${slideClass(slide)}`}>
      {slide.kind === "featured" ? (
        <FeaturedSlide slide={slide} />
      ) : slide.kind === "secondary" ? (
        <SecondarySlide slide={slide} />
      ) : (
        <ArchiveSlide />
      )}
    </div>
  );
}

function Rail({
  slides,
  activeIndex,
  barRef,
  onJump,
}: {
  slides: Slide[];
  activeIndex: number;
  barRef: RefObject<HTMLDivElement | null>;
  onJump: (index: number) => void;
}) {
  return (
    <div className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 select-none flex-col items-center md:flex lg:right-8">
      <div className="relative h-72 w-10">
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10"
        />
        <span
          ref={barRef}
          aria-hidden="true"
          className="absolute left-1/2 top-0 w-px origin-top bg-primary shadow-[0_0_8px_#a3e635]"
          style={{ transform: "scaleY(0)" }}
        />
        <div className="absolute inset-0 flex flex-col justify-between">
          {slides.map((slide, i) => {
            const active = i === activeIndex;
            const accent =
              slide.kind === "archive" ? "#a3e635" : slide.project.accent;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Go to ${slideTitle(slide)}`}
                aria-current={active ? "true" : undefined}
                onClick={() => onJump(i)}
                className="group relative flex h-7 w-10 items-center justify-center"
              >
                <span
                  className="absolute right-11 hidden whitespace-nowrap text-right font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400 transition-colors duration-300 lg:block"
                  style={active ? { color: accent } : undefined}
                >
                  {String(i + 1).padStart(2, "0")} {slideTitle(slide)}
                </span>
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full transition-all duration-300"
                  style={
                    active
                      ? {
                          backgroundColor: accent,
                          boxShadow: `0 0 10px ${hexAlpha(accent, 0.9)}`,
                          transform: "scale(1.35)",
                        }
                      : undefined
                  }
                />
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute left-3 top-1/2 h-px w-5 -translate-y-1/2"
                    style={{ backgroundColor: accent, boxShadow: `0 0 6px ${hexAlpha(accent, 0.7)}` }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600 [writing-mode:vertical-rl]">
        scroll
      </span>
    </div>
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
  const railBarRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const startRef = useRef(0);
  const shiftXRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const [slides] = useState<Slide[]>(buildSlides);

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const wrap = wrapRef.current;
    const track = trackRef.current;
    const scroller = containerRef?.current ?? null;
    if (!wrap || !track || !scroller) return;

    let maxX = 0;
    let shiftX = 0;

    const update = () => {
      if (maxX <= 0 || shiftX <= 0) return;
      const scrolled = Math.min(maxX, Math.max(0, scroller.scrollTop - startRef.current));
      const shifted = Math.min(shiftX, scrolled);
      track.style.transform = `translate3d(${(-shifted).toFixed(2)}px, 0, 0)`;
      const p = shiftX > 0 ? shifted / shiftX : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      if (railBarRef.current)
        railBarRef.current.style.transform = `scaleY(${p.toFixed(4)})`;
      const index = Math.min(TOTAL_PANELS - 1, Math.round(p * (TOTAL_PANELS - 1)));
      if (countRef.current) {
        countRef.current.textContent = String(index + 1).padStart(2, "0");
      }
      setActiveIndex((prev) => (prev === index ? prev : index));
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

      startRef.current = 0;
      let node: HTMLElement | null = wrap;
      while (node && node !== scroller) {
        startRef.current += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      shiftXRef.current = shiftX;
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

  const jumpTo = (index: number) => {
    const scroller = containerRef?.current;
    if (!scroller) return;
    const ratio = index / (TOTAL_PANELS - 1);
    const target = startRef.current + shiftXRef.current * ratio;
    scroller.scrollTo({ top: target, behavior: "smooth" });
  };

  if (reduced) {
    return (
      <section id="projects" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <SectionHeading index="04" label="Selected work" title="Featured" highlight="Projects" />
        <div className="space-y-10">
          {slides.map((slide) => (
            <SlideView key={slideTitle(slide)} slide={slide} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="relative">
      <div ref={wrapRef}>
        <div className="sticky top-0 flex h-svh flex-col overflow-hidden pt-14 sm:pt-20">
          <header className="mx-auto w-full max-w-6xl shrink-0 px-6">
            <SectionHeading index="04" label="Selected work" title="Featured" highlight="Projects" />
          </header>

          <div className="relative flex min-h-0 flex-1 items-center">
            <div
              ref={trackRef}
              className="flex w-max items-center gap-5 sm:gap-8"
              style={{
                paddingLeft: TRACK_EDGE,
                paddingRight: TRACK_EDGE,
                willChange: "transform",
              }}
            >
              {slides.map((slide, i) => (
                <SlideView key={i} slide={slide} />
              ))}
            </div>
          </div>

          <div className="mx-auto mt-4 flex w-full max-w-6xl shrink-0 items-center gap-5 px-6 pb-3 sm:pb-4 md:hidden">
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

          <Rail
            slides={slides}
            activeIndex={activeIndex}
            barRef={railBarRef}
            onJump={jumpTo}
          />
        </div>
      </div>
    </section>
  );
}