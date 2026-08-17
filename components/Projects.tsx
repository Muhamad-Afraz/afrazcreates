import { useState } from "react";
import type { Project } from "@/data/site";
import Reveal from "./ui/Reveal";
import TiltCard from "./ui/TiltCard";
import SectionHeading from "./ui/SectionHeading";
import ProjectModal from "./ProjectModal";
import { ArrowUpRightIcon } from "./icons";
import { site } from "@/data/site";

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

export default function Projects() {
  const [open, setOpen] = useState(false);

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <SectionHeading index="03" label="Things I've built" title="Featured" highlight="Projects" />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {site.projects.slice(0, 3).map((project, i) => (
          <Reveal key={project.title} delay={i * 0.1}>
            {project.live ? (
              <a href={project.live} target="_blank" rel="noreferrer" aria-label={`View project: ${project.title}`} className="block h-full">
                <TiltCard className="card glow-border flex h-full flex-col rounded-2xl p-7 transition-colors duration-300 hover:border-primary/40">
                  <h3 className="text-lg font-bold text-white">{project.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                    {project.description}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    <li className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                      {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                    </li>
                    {project.tag && (
                    <li className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                      {project.tag}
                    </li>
                    )}
                  </ul>

                  <div className="mt-6 flex items-center gap-5">
                    {project.status && <StatusBadge project={project} />}
                  </div>
                </TiltCard>
              </a>
            ) : (
              <TiltCard className="card glow-border flex h-full flex-col rounded-2xl p-7 transition-colors duration-300 hover:border-primary/40">
                <h3 className="text-lg font-bold text-white">{project.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                  {project.description}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  <li className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                    {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                  </li>
                  {project.tag && (
                  <li className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                    {project.tag}
                  </li>
                  )}
                </ul>

                <div className="mt-6 flex items-center gap-5">
                  {project.status && <StatusBadge project={project} />}
                </div>
              </TiltCard>
            )}
          </Reveal>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-neon rounded-xl px-8 py-3.5 font-semibold"
        >
          View More
        </button>
      </div>

      <ProjectModal
        isOpen={open}
        onClose={() => setOpen(false)}
        projects={site.projects}
      />
    </section>
  );
}
