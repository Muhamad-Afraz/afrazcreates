"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/data/site";

const links = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export default function Navbar({
  activeId,
  onNavigate,
}: {
  activeId: string;
  onNavigate: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.4, duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-bg/70 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("home");
          }}
          className="group flex items-center gap-2.5"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary font-mono text-sm font-black text-white shadow-[0_0_14px_rgba(163,230,53,0.45)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            {site.firstName.charAt(0)}
          </span>
          <span className="font-mono text-lg font-bold tracking-tight text-white">
            afraz
          </span>
          <span className="caret hidden h-5 w-[2px] sm:block" />
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("home");
            }}
            className={`nav-link transition-colors hover:text-white ${
              activeId === "home" ? "text-white" : ""
            }`}
          >
            <span className="mr-1 font-mono text-xs text-primary">01.</span>
            Home
          </a>
          {links.map((link, i) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(link.id);
              }}
              className={`nav-link transition-colors hover:text-white ${
                activeId === link.id ? "text-white" : ""
              }`}
            >
              <span className="mr-1 font-mono text-xs text-primary">0{i + 2}.</span>
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-white/10 text-white md:hidden"
        >
          <motion.span
            animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-5 bg-primary"
          />
          <motion.span
            animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-5 bg-secondary"
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/5 md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("home");
                  setOpen(false);
                }}
                className="rounded-lg px-3 py-3 font-mono text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                <span className="mr-2 text-primary">01.</span>
                Home
              </a>
              {links.map((link, i) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(link.id);
                    setOpen(false);
                  }}
                  className="rounded-lg px-3 py-3 font-mono text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <span className="mr-2 text-primary">0{i + 2}.</span>
                  {link.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
