import Reveal from "./ui/Reveal";
import Counter from "./ui/Counter";
import SectionHeading from "./ui/SectionHeading";
import { site } from "@/data/site";

export function AboutContent() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
      <Reveal>
        <div className="space-y-5 leading-relaxed text-slate-300">
          {site.about.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </Reveal>

      <div className="grid grid-cols-2 gap-4">
        {site.stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.1}>
            <div className="card rounded-2xl p-5 text-center transition-colors duration-300 hover:border-primary/40">
              <div className="text-3xl font-extrabold sm:text-4xl">
                <span className="gradient-text">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <SectionHeading index="02" label="Who I am" title="About" highlight="Me" />
      <AboutContent />
    </section>
  );
}
