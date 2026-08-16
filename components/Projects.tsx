import Reveal from "./ui/Reveal";
import TiltCard from "./ui/TiltCard";
import SectionHeading from "./ui/SectionHeading";
import { ArrowUpRightIcon } from "./icons";
import { site } from "@/data/site";

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <SectionHeading index="03" label="Things I've built" title="Featured" highlight="Projects" />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {site.projects.map((project, i) => (
          <Reveal key={project.title} delay={i * 0.1}>
            <TiltCard className="card flex h-full flex-col rounded-2xl p-7 transition-colors duration-300 hover:border-primary/40">
              <h3 className="text-lg font-bold text-white">{project.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                {project.description}
              </p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center gap-5">
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-80 transition-opacity duration-300 hover:opacity-100"
                  >
                    Live
                    <ArrowUpRightIcon className="h-4 w-4" />
                  </a>
                )}
                {project.code && (
                  <a
                    href={project.code}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary opacity-80 transition-opacity duration-300 hover:opacity-100"
                  >
                    Code
                    <ArrowUpRightIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
