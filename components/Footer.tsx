"use client";

import { useState } from "react";
import type { ComponentType, SVGProps } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpIcon, InstagramIcon, MailIcon } from "./icons";
import { site } from "@/data/site";

type Page = "home" | "work";

type Social = {
  href?: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const socials: Social[] = [
  { label: "Instagram", Icon: InstagramIcon },
  { href: `mailto:${site.socials.email}`, label: "Email", Icon: MailIcon },
];

function LabelTooltip({ label }: { label: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pointer-events-none absolute left-1/2 top-full mt-3 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap font-mono text-xs text-slate-200"
    >
      <span className="h-1 w-1 rounded-full bg-primary shadow-[0_0_6px_#a3e635]" />
      {label.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.18 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

function SocialLink({ href, label, Icon }: Social) {
  const [hovered, setHovered] = useState(false);

  const classes =
    "group relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-white/10 text-slate-400 transition-all duration-300 hover:border-primary/50 hover:text-primary hover:shadow-[0_0_18px_rgba(163,230,53,0.35)]";

  const labelEl = (
    <AnimatePresence>{hovered && <LabelTooltip label={label} />}</AnimatePresence>
  );

  if (!href) {
    return (
      <button
        type="button"
        aria-label={label}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`${classes} cursor-pointer bg-transparent`}
      >
        <Icon className="h-5 w-5" />
        {labelEl}
      </button>
    );
  }

  return (
    <a
      href={href}
      aria-label={label}
      target={href.startsWith("mailto") ? undefined : "_blank"}
      rel={href.startsWith("mailto") ? undefined : "noreferrer"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={classes}
    >
      <Icon className="h-5 w-5" />
      {labelEl}
    </a>
  );
}

function BackToTopButton({
  onNavigate,
}: {
  onNavigate: (target: Page, sectionId?: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="#home"
      aria-label="Back to top"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        e.preventDefault();
        onNavigate("home");
      }}
      className="group relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-white/10 text-slate-400 transition-all duration-300 hover:border-secondary/50 hover:text-secondary hover:shadow-[0_0_18px_rgba(132,204,22,0.35)]"
    >
      <ArrowUpIcon className="h-5 w-5" />
      <AnimatePresence>{hovered && <LabelTooltip label="Back to top" />}</AnimatePresence>
    </a>
  );
}

export default function Footer({
  onNavigate,
}: {
  onNavigate: (target: Page, sectionId?: string) => void;
}) {
  return (
    <footer className="border-t border-white/5 bg-black/20 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
        <p className="font-mono text-sm text-slate-500">
          © {new Date().getFullYear()}{" "}
          <span className="text-slate-300">{site.name}</span>. Built with Next.js &amp;
          Tailwind.
        </p>

        <div className="flex items-center gap-5">
          {socials.map((social) => (
            <SocialLink key={social.label} {...social} />
          ))}
        </div>

        <BackToTopButton onNavigate={onNavigate} />
      </div>
    </footer>
  );
}
