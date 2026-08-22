"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import type { Variants } from "framer-motion";

type Variant = "terminal" | "cascade" | "slide-up" | "fade-scale";

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  delay?: number;
};

const variants: Record<Variant, Variants> = {
  terminal: {
    hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
    visible: {
      opacity: 1,
      clipPath: "inset(0 0% 0 0)",
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as const, staggerChildren: 0.08 },
    },
  },
  cascade: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  },
  "slide-up": {
    hidden: { opacity: 0, y: 60, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] as const, staggerChildren: 0.1 },
    },
  },
  "fade-scale": {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] as const, staggerChildren: 0.08 },
    },
  },
};

export const cascadeItem: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: -8, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

export default function SectionReveal({
  children,
  className = "",
  variant = "fade-scale",
  delay = 0,
}: SectionRevealProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={variants[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  );
}
