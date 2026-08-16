export const skillsBackup: Record<string, { name: string; level: number }[]> = {
  Frontend: [
    { name: "HTML & CSS", level: 85 },
    { name: "JavaScript", level: 70 },
    { name: "Tailwind CSS", level: 75 },
    { name: "React (basics)", level: 60 },
  ],
  "Tools & Others": [
    { name: "Git / GitHub", level: 55 },
    { name: "Figma", level: 60 },
    { name: "Next.js", level: 50 },
  ],
};

/*
  HOW TO RESTORE THE SKILLS & TOOLS SECTION LATER
  -----------------------------------------------
  1. In data/site.ts:
     - Re-add to SiteData:   skills: Record<string, { name: string; level: number }[]>;
     - Re-add to site object: skills: skillsBackup,
  2. Recreate components/Skills.tsx (source below).
  3. In app/page.tsx: import Skills, add <Skills /> between <Projects /> and <Education />,
     and set SECTION_IDS to ["about", "skills", "education", "contact"].
  4. In components/Navbar.tsx: change the "projects" link back to { id: "skills", label: "Skills" }.

  components/Skills.tsx source:
  -----------------------------
  import Reveal from "./ui/Reveal";
  import SkillBar from "./ui/SkillBar";
  import SectionHeading from "./ui/SectionHeading";
  import { site } from "@/data/site";

  export default function Skills() {
    const groups = Object.entries(site.skills);

    return (
      <section id="skills" className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <SectionHeading index="03" label="What I work with" title="Skills &" highlight="Tools" />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {groups.map(([group, skills], gi) => (
            <Reveal key={group} delay={gi * 0.12}>
              <div className="card h-full rounded-2xl p-6 transition-colors duration-300 hover:border-primary/40">
                <h3 className="mb-5 flex items-center gap-3 font-mono text-lg font-semibold text-white">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_10px_rgba(163,230,53,0.8)]" />
                  {group}
                </h3>
                <div className="space-y-5">
                  {skills.map((skill) => (
                    <SkillBar key={skill.name} name={skill.name} level={skill.level} />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    );
  }
*/
