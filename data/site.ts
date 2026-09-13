export type Project = {
  title: string;
  description: string;
  category: "personal" | "business" | "other";
  tag: string;
  status?: "live" | "building" | "planning";
  live?: string;
  code?: string;
  featured?: boolean;
  accent: string;
  stack: string[];
};

export type TechCategoryId = "frontend" | "backend" | "ai" | "data" | "tools";

export type TechItem = {
  name: string;
  icon: string;
};

export type TechCategory = {
  id: TechCategoryId;
  label: string;
  color: string;
  items: TechItem[];
};

export type Highlight = {
  title: string;
  text: string;
};

export type SiteData = {
  name: string;
  firstName: string;
  tagline: string;
  roles: string[];
  about: string[];
  highlights: Highlight[];
  stats: { value: number; suffix: string; label: string }[];
  techStack: TechCategory[];
  projects: Project[];
  showcaseUrl: string;
  socials: { email: string; instagram: string; github: string; linkedin: string };
};

export const site: SiteData = {
  name: "Afraz",
  firstName: "Afraz",
  tagline:
    "A developer who turns ideas into fast, interactive and welcoming web experiences.",
  roles: ["Web Developer", "Creative Designer", "UI/UX Focused"],
  about: [
    "I build websites from scratch — design, code, deploy. The kind that load fast, feel responsive, and are fun to use.",
    "Every project is a chance to explore a new idea, obsess over the details, and ship something polished.",
  ],
  highlights: [
    {
      title: "Build from scratch",
      text: "Design → code → deploy. Responsible for every layer.",
    },
    {
      title: "Design + development",
      text: "Interfaces that look good and work properly — together.",
    },
    {
      title: "Experimentation",
      text: "Projects exist to explore new ideas and technologies.",
    },
  ],
  stats: [
    { value: 3, suffix: "+", label: "Projects Built" },
    { value: 18, suffix: "+", label: "Tools & Technologies" },
    { value: 3, suffix: "+", label: "Certificates" },
    { value: 2, suffix: "+", label: "Months of Experience" },
  ],
  techStack: [
    {
      id: "frontend",
      label: "Frontend",
      color: "#22d3ee",
      items: [
        { name: "React", icon: "react" },
        { name: "Next.js", icon: "nextjs" },
        { name: "TypeScript", icon: "typescript" },
        { name: "Tailwind CSS", icon: "tailwind" },
      ],
    },
    {
      id: "backend",
      label: "Backend",
      color: "#fbbf24",
      items: [
        { name: "Node.js", icon: "nodejs" },
        { name: "Express", icon: "express" },
        { name: "Supabase", icon: "supabase" },
        { name: "PostgreSQL", icon: "postgresql" },
      ],
    },
    {
      id: "ai",
      label: "AI & Agents",
      color: "#a78bfa",
      items: [
        { name: "LangGraph", icon: "langgraph" },
        { name: "LangChain", icon: "langchain" },
        { name: "Multi-Agent AI", icon: "multiagent" },
        { name: "RAG", icon: "rag" },
      ],
    },
    {
      id: "tools",
      label: "Tools",
      color: "#fb7185",
      items: [
        { name: "Git", icon: "git" },
        { name: "Vercel", icon: "vercel" },
        { name: "Docker", icon: "docker" },
        { name: "Figma", icon: "figma" },
      ],
    },
    {
      id: "data",
      label: "Data",
      color: "#34d399",
      items: [
        { name: "VectorDB", icon: "vectordb" },
        { name: "Embeddings", icon: "embeddings" },
      ],
    },
  ],
  projects: [
    {
      title: "Nexus 2027",
      description:
        "A high-end event platform for a fictional technology conference — speakers, schedules, venue exploration and registration in one fluid experience.",
      category: "other",
      tag: "Event Platform",
      status: "live",
      live: "https://nexus2027.vercel.app",
      code: "",
      featured: true,
      accent: "#a78bfa",
      stack: ["nextjs", "typescript", "tailwind", "postgresql"],
    },
    {
      title: "HouseCoffee",
      description:
        "A premium coffee brand site with a warm, editorial feel — menu, story and loyalty woven into one seamless brand experience.",
      category: "business",
      tag: "Brand Site",
      status: "live",
      live: "https://housecoffee.vercel.app/",
      code: "",
      featured: true,
      accent: "#b45309",
      stack: ["react", "typescript", "tailwind", "supabase"],
    },
    {
      title: "Project-Hub",
      description:
        "My central archive of projects — every experiment, tool and release in one searchable hub.",
      category: "personal",
      tag: "Archive",
      status: "live",
      live: "https://afraz-project-hub.vercel.app/",
      code: "",
      accent: "#22d3ee",
      stack: ["nextjs", "typescript", "supabase", "vercel"],
    },
    {
      title: "Pothole Filler",
      description:
        "A civic-tech concept for reporting and tracking potholes — turning complaints into a visible, actionable map.",
      category: "other",
      tag: "Concept",
      status: "building",
      accent: "#fbbf24",
      stack: ["nodejs", "express", "supabase"],
    },
  ],
  // TODO: replace with the URL of your all-projects website
  showcaseUrl: "https://afraz-project-hub.vercel.app/",
  socials: {
    email: "kmafraz12@gmail.com",
    instagram: "https://instagram.com/mr_web_guy",
    // TODO: update linkedin with a real profile URL
    github: "https://github.com/Muhamad-Afraz",
    linkedin: "https://linkedin.com/in/your-username",
  },
};
