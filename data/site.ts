export type EducationEntry = {
  school: string;
  degree: string;
  type: string;
  period: string;
  description: string;
  skills: string[];
};

export type Project = {
  title: string;
  description: string;
  tags: string[];
  live?: string;
  code?: string;
};

export type SiteData = {
  name: string;
  firstName: string;
  tagline: string;
  roles: string[];
  about: string[];
  stats: { value: number; suffix: string; label: string }[];
  projects: Project[];
  education: EducationEntry[];
  socials: { email: string; instagram: string; github: string; linkedin: string };
};

export const site: SiteData = {
  name: "Afraz",
  firstName: "Afraz",
  tagline:
    "A developer who loves turning ideas into fast, accessible and delightfully interactive web experiences.",
  roles: ["Web Developer", "Creative Designs", "UI/UX Designer"],
  about: [
    "Hi, I'm Afraz — a developer who believes websites should feel alive. I spend my days building web apps that don't just work, but delight: smooth animations, snappy interactions, and clean, readable code under the hood.",
    "I care about the whole journey — from the first wireframe sketch to the final deployment. I love collaborating, shipping fast, and obsessing over the details most people never notice (and that's exactly the point).",
    "When I'm not coding, you'll find me exploring new tech, contributing to open source, or experimenting with generative art.",
  ],
  stats: [
    { value: 3, suffix: "+", label: "Projects Built" },
    { value: 12, suffix: "+", label: "Tools & Technologies" },
    { value: 3, suffix: "+", label: "Certificates" },
    { value: 1, suffix: "+", label: "Month of Experience" },
  ],
  projects: [
    {
      title: "Portfolio Website",
      description:
        "A personal portfolio with a scroll-driven laptop reveal, custom cursor, particles and smooth section transitions.",
      tags: ["Next.js", "Tailwind CSS", "Framer Motion"],
      live: "",
      code: "",
    },
    {
      title: "Project One",
      description: "Short description of what this project does and why it was built.",
      tags: ["Next.js", "Tailwind CSS"],
      live: "",
      code: "",
    },
    {
      title: "Project Two",
      description: "Short description of what this project does and why it was built.",
      tags: ["JavaScript", "CSS"],
      live: "",
      code: "",
    },
  ],
  education: [],
  socials: {
    email: "kmafraz12@gmail.com",
    instagram: "https://instagram.com/mr_web_guy",
    github: "https://github.com/your-username",
    linkedin: "https://linkedin.com/in/your-username",
  },
};
