"use client";

import Counter from "./ui/Counter";
import SectionHeading from "./ui/SectionHeading";
import { site } from "@/data/site";

function StatCard({ stat, index }: { stat: { value: number; suffix: string; label: string }; index: number }) {
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
    <section id="about" className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <SectionHeading index="02" label="Who I am" title="About" highlight="Me" />

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Bio Column */}
        <div className="card h-full rounded-2xl p-6 sm:p-8">
          <div className="space-y-4 leading-relaxed text-slate-300">
            {site.about.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Stats Column */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
