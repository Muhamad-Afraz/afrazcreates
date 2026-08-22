"use client";

import { motion } from "framer-motion";
import Reveal from "./ui/Reveal";
import Counter from "./ui/Counter";
import SectionHeading from "./ui/SectionHeading";
import SectionReveal from "./ui/SectionReveal";
import { site } from "@/data/site";

function SkillBadge({ skill, index }: { skill: string; index: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="skill-float inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs text-primary/80 transition-colors duration-300 hover:bg-primary/10 hover:text-primary hover:border-primary/40 hover:shadow-[0_0_12px_rgba(163,230,53,0.15)]"
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      {skill}
    </motion.span>
  );
}

function StatCard({ stat, index }: { stat: { value: number; suffix: string; label: string }; index: number }) {
  return (
    <Reveal delay={0.1 + index * 0.08}>
      <div className="card group flex h-full flex-col items-center justify-center rounded-2xl p-5 text-center transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(163,230,53,0.06)]">
        <div className="text-3xl font-extrabold sm:text-4xl">
          <span className="gradient-text">
            <Counter value={stat.value} suffix={stat.suffix} />
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
      </div>
    </Reveal>
  );
}

export default function About() {
  const stats = site.stats;
  const skills = site.skills;

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <SectionReveal variant="terminal">
        <SectionHeading index="02" label="Who I am" title="About" highlight="Me" />

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Bio Column */}
          <Reveal>
            <div className="card h-full rounded-2xl p-6 sm:p-8">
              <div className="space-y-4 leading-relaxed text-slate-300">
                {site.about.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Stats Column */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>

        {/* Tech Stack — Full Width */}
        <Reveal delay={0.15} className="mt-6">
          <div className="card rounded-2xl p-6 sm:p-8">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-secondary">
              Technologies I work with
            </p>
            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill, i) => (
                <SkillBadge key={skill} skill={skill} index={i} />
              ))}
            </div>
          </div>
        </Reveal>
      </SectionReveal>
    </section>
  );
}
