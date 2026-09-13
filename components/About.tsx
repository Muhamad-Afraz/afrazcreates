"use client";

import Counter from "./ui/Counter";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import { site } from "@/data/site";

function StatCard({
  stat,
}: {
  stat: { value: number; suffix: string; label: string };
}) {
  return (
    <div className="card group flex h-full flex-col items-center justify-center rounded-2xl p-5 text-center transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(163,230,53,0.06)]">
      <div className="text-3xl font-extrabold sm:text-4xl">
        <span className="gradient-text">
          <Counter value={stat.value} suffix={stat.suffix} />
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
    </div>
  );
}

export default function About() {
  const stats = site.stats;

  return (
    <section
      id="about"
      className="mx-auto max-w-6xl px-6 py-16 sm:py-24"
    >
      <SectionHeading index="02" label="Who I am" title="About" highlight="Me" />

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <Reveal>
            <h3 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
              A developer who believes websites should{" "}
              <span className="gradient-text">feel alive</span> — and build them from
              scratch to make sure they do.
            </h3>
          </Reveal>

          <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-400 sm:text-lg">
            {site.about.map((paragraph, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 space-y-3.5">
            {site.highlights.map((highlight, i) => (
              <Reveal key={highlight.title} delay={0.06 * i}>
                <div className="card flex gap-4 rounded-xl px-5 py-4 transition-colors duration-300 hover:border-primary/30">
                  <span className="shrink-0 font-mono text-xs font-bold text-primary">
                    0{i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-white">
                      {highlight.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">{highlight.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div>
          <div className="grid h-full grid-cols-2 gap-4">
            {stats.map((stat) => (
              <Reveal key={stat.label} className="h-full">
                <StatCard stat={stat} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}