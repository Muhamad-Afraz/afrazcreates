import Reveal from "./ui/Reveal";
import TiltCard from "./ui/TiltCard";
import SectionHeading from "./ui/SectionHeading";
import { site } from "@/data/site";

export default function Education() {
  return (
    <section id="education" className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <SectionHeading index="04" label="Where I studied" title="Education" highlight="& Learning" />

      <div className="relative mx-auto max-w-4xl">
        <div className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-primary via-accent to-secondary/40 lg:left-1/2 lg:-translate-x-1/2" />

        <div className="space-y-10 lg:space-y-16">
          {site.education.map((entry, i) => {
            const isLeft = i % 2 === 0;
            return (
              <Reveal key={entry.degree} delay={i * 0.08}>
                <div className="relative pl-12 lg:pl-0">
                  <span className="absolute left-4 top-7 h-3 w-3 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_16px_rgba(163,230,53,1)] lg:left-1/2" />

                  <div
                    className={`lg:w-[calc(50%-3rem)] ${isLeft ? "lg:mr-auto" : "lg:ml-auto"}`}
                  >
                    <TiltCard className="card rounded-2xl p-7 sm:p-8">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
                          {entry.period}
                        </span>
                        <span className="font-mono text-xs text-slate-500">{entry.type}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white sm:text-2xl">
                        {entry.school}
                      </h3>
                      <p className="mt-1 font-medium text-secondary">{entry.degree}</p>
                      <p className="mt-4 text-sm leading-relaxed text-slate-400">
                        {entry.description}
                      </p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {entry.skills.map((skill) => (
                          <li
                            key={skill}
                            className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                          >
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </TiltCard>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
