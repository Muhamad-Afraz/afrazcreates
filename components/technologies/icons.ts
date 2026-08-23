import type { IconType } from "react-icons";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiSupabase,
  SiPostgresql,
  SiLanggraph,
  SiLangchain,
  SiGit,
  SiVercel,
  SiDocker,
  SiFigma,
} from "react-icons/si";
import { RiRobot2Fill } from "react-icons/ri";
import { TbVector, TbDatabase, TbDatabaseSearch } from "react-icons/tb";

export const techIcons: Record<string, IconType> = {
  react: SiReact,
  nextjs: SiNextdotjs,
  typescript: SiTypescript,
  tailwind: SiTailwindcss,
  nodejs: SiNodedotjs,
  express: SiExpress,
  supabase: SiSupabase,
  postgresql: SiPostgresql,
  langgraph: SiLanggraph,
  langchain: SiLangchain,
  multiagent: RiRobot2Fill,
  rag: TbDatabaseSearch,
  vectordb: TbDatabase,
  embeddings: TbVector,
  git: SiGit,
  vercel: SiVercel,
  docker: SiDocker,
  figma: SiFigma,
};

export function hexAlpha(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
