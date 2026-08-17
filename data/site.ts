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
  category: "personal" | "business" | "other";
  tag: string;
  status?: "live" | "building" | "planning";
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
    "Hi, I'm Afraz — a developer who believes websites should feel alive. I build web apps that don't just work, but feel great to use: smooth animations, snappy interactions, and clean, thoughtful code under the hood.",
    "I care about the entire journey — from the first wireframe sketch to the final deployment. I love collaborating, shipping fast, and obsessing over the little details most people never notice (and that's exactly the point).",
    "When I'm not coding, you'll find me exploring new tech, experimenting with generative art, or building something just because I can.",
  ],
  stats: [
    { value: 3, suffix: "+", label: "Projects Built" },
    { value: 12, suffix: "+", label: "Tools & Technologies" },
    { value: 3, suffix: "+", label: "Certificates" },
    { value: 1, suffix: "+", label: "Month of Experience" },
  ],
  projects: [
    {
      title: "My Portfolio",
      description:
        "My personal portfolio about me, my creations and my skills — designed to showcase what I do and how I think as a developer.",
      category: "personal",
      tag: "Portfolio",
      status: "live",
      live: "https://afrazcreates.vercel.app",
      code: "",
    },
    {
      title: "Coffee Shop",
      description: "A modern coffee shop website designed with a clean interface, smooth interactions, and a warm, inviting experience.",
      category: "other",
      tag: "Web App",
      status: "building",
      live: "",
      code: "",
    },
    {
      title: "Project Two",
      description: "Short description of what this project does and why it was built.",
      category: "other",
      tag: "Creative",
      status: "planning",
      live: "",
      code: "",
    },
    {
      title: "Project 4",
      description: "Short description of what this project does and why it was built.",
      category: "other",
      tag: "Web App",
      live: "",
      code: "",
    },
    {
      title: "Project 5",
      description: "Short description of what this project does and why it was built.",
      category: "other",
      tag: "Creative",
      live: "",
      code: "",
    },
    {
      title: "Project 6",
      description: "Short description of what this project does and why it was built.",
      category: "other",
      tag: "Creative",
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
