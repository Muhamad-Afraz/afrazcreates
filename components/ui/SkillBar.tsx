"use client";

import { motion } from "framer-motion";

type SkillBarProps = {
  name: string;
  level: number;
};

export default function SkillBar({ name, level }: SkillBarProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">{name}</span>
        <span className="font-mono text-sm text-primary">{level}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="skill-bar-gradient h-full rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.1, delay: 0.15, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
