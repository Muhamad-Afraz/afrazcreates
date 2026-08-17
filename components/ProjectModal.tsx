"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import TiltCard from "./ui/TiltCard";
import { ArrowUpRightIcon, CloseIcon } from "./icons";
import type { Project } from "@/data/site";

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

function GlowCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el || !e.touches[0]) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${e.touches[0].clientX - rect.left}px`);
    el.style.setProperty("--mouse-y", `${e.touches[0].clientY - rect.top}px`);
  }, []);

  const CardInner = (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      className="project-card-glow card flex h-full flex-col rounded-2xl p-7"
    >
      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-2 flex items-center gap-3">
          <div className="card-number-ring">
            <span className="font-mono text-xs font-bold text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="card-title-shimmer text-lg font-bold">
            {project.title}
          </h3>
        </div>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
          {project.description}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          <li className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-slate-300 transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_10px_rgba(163,230,53,0.1)]">
            {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
          </li>
          {project.tag && (
            <li className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-slate-300 transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_10px_rgba(163,230,53,0.1)]">
              {project.tag}
            </li>
          )}
        </ul>

        <div className="mt-6 flex items-center gap-5">
          {project.status === "live" && project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-80 transition-all duration-300 hover:opacity-100 hover:drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_#a3e635]" />
              Live
              <ArrowUpRightIcon className="h-4 w-4" />
            </a>
          )}
          {project.status === "building" && project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-yellow-400 opacity-80 transition-all duration-300 hover:opacity-100"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 shadow-[0_0_6px_#facc15]" />
              Building
              <ArrowUpRightIcon className="h-4 w-4" />
            </a>
          )}
          {project.status === "building" && !project.live && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-yellow-400 opacity-60">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 shadow-[0_0_6px_#facc15]" />
              Building
            </span>
          )}
          {project.status === "planning" && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 opacity-60">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_#60a5fa]" />
              Planning
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      layout
    >
      <TiltCard className="h-full" max={6}>
        {project.live ? (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            className="block h-full"
          >
            {CardInner}
          </a>
        ) : (
          CardInner
        )}
      </TiltCard>
    </motion.div>
  );
}

export default function ProjectModal({
  isOpen,
  onClose,
  projects,
}: {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const mounted = useIsClient();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  const panelControls = useAnimationControls();
  const closeBtnControls = useAnimationControls();

  const categories = ["personal", "business", "other"];

  const filtered = useMemo(
    () =>
      activeCategory
        ? projects.filter((p) => p.category === activeCategory)
        : projects,
    [projects, activeCategory],
  );

  const handleClose = useCallback(async () => {
    if (closing) return;
    setClosing(true);

    const panel = panelRef.current;
    const closeBtn = closeRef.current;

    if (!panel || !closeBtn) {
      setClosing(false);
      onClose();
      return;
    }

    const panelRect = panel.getBoundingClientRect();
    const closeBtnRect = closeBtn.getBoundingClientRect();

    const dx = closeBtnRect.left + closeBtnRect.width / 2 - (panelRect.left + panelRect.width / 2);
    const dy = closeBtnRect.top + closeBtnRect.height / 2 - (panelRect.top + panelRect.height / 2);

    await panelControls.start({
      x: dx,
      y: dy,
      scale: 0.05,
      opacity: 0,
      transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
    });

    closeBtnControls.start({
      rotate: 75,
      y: -6,
      scale: 1.15,
      transition: { duration: 0.15, ease: "easeOut" },
    }).then(() =>
      closeBtnControls.start({
        y: 0,
        scale: 1,
        opacity: 0,
        transition: { duration: 0.12, ease: "easeIn" },
      }),
    );

    await new Promise((r) => setTimeout(r, 280));

    panelControls.set({ x: 0, y: 0, scale: 1, opacity: 1 });
    closeBtnControls.set({ rotate: 0, y: 0, scale: 1, opacity: 1 });
    setClosing(false);
    onClose();
  }, [closing, onClose, panelControls, closeBtnControls]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    },
    [handleClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  const panelAnimate = closing ? panelControls : { opacity: 1, y: 0, scale: 1 };
  const closeBtnAnimate = closing ? closeBtnControls : {};

  const content = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            className="modal-glow-border relative z-10 mx-4 flex max-h-[92vh] w-full max-w-6xl flex-col rounded-2xl sm:p-10"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={panelAnimate}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl bg-surface/95 backdrop-blur-xl p-8 sm:p-10">
              <div className="relative z-10 flex h-full flex-1 flex-col min-h-0">
                <div className="mb-8 flex items-start justify-between">
                  <div>
                    <h2 className="text-[35px] font-bold text-white">
                      All <span className="gradient-text">Projects</span>
                    </h2>
                    <p className="mt-1 font-mono text-[16px] text-slate-500">
                      {projects.length} project{projects.length !== 1 && "s"} total
                    </p>
                  </div>
                  <motion.button
                    ref={closeRef}
                    type="button"
                    onClick={handleClose}
                    className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-all duration-300 hover:border-primary/40 hover:text-white hover:shadow-[0_0_16px_rgba(163,230,53,0.2)]"
                    animate={closeBtnAnimate}
                    aria-label="Close"
                  >
                    <CloseIcon className="h-5 w-5" />
                  </motion.button>
                </div>

                <div className="mb-8 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveCategory(null)}
                    className={`tag-pill rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-all ${
                      activeCategory === null ? "tag-pill-active" : ""
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                      className={`tag-pill rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-all ${
                        activeCategory === cat ? "tag-pill-active" : ""
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="modal-scroll grid flex-1 min-h-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2 pb-4">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((project, i) => (
                      <GlowCard
                        key={project.title}
                        project={project}
                        index={i}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {filtered.length === 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-16 text-center text-sm text-slate-500"
                  >
                    No projects match that filter.
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}
