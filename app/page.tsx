"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const SECTION_IDS = ["about", "projects", "education", "contact"] as const;

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [activeId, setActiveId] = useState("home");

  const scrollToSection = useCallback((id: string, behavior: ScrollBehavior = "smooth") => {
    const container = containerRef.current;
    const lenis = lenisRef.current;
    if (!container) return;

    if (id === "home") {
      if (lenis) lenis.scrollTo(0, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 3) });
      else container.scrollTo({ top: 0, behavior });
      return;
    }

    const el = container.querySelector<HTMLElement>(`#${id}`);
    if (!el) return;

    const offset =
      el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
    const max = container.scrollHeight - container.clientHeight;
    const target = Math.min(Math.max(0, offset - 80), max);

    if (behavior === "smooth") {
      if (lenis) lenis.scrollTo(target, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 3) });
      else container.scrollTo({ top: target, behavior: "smooth" });
    } else {
      container.scrollTop = target;
    }
  }, []);

  const goTo = useCallback((id: string) => scrollToSection(id, "smooth"), [scrollToSection]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const lenis = new Lenis({
      wrapper: container,
      content: container.firstElementChild as HTMLElement,
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateActive = () => {
      const top = container.scrollTop;
      let current = "home";
      for (const id of SECTION_IDS) {
        const el = container.querySelector<HTMLElement>(`#${id}`);
        if (el && el.offsetTop - 200 <= top) current = id;
      }
      setActiveId(current);
    };

    updateActive();
    container.addEventListener("scroll", updateActive, { passive: true });
    return () => container.removeEventListener("scroll", updateActive);
  }, []);

  return (
    <>
      <Navbar activeId={activeId} onNavigate={goTo} />
      <div className="relative h-screen overflow-hidden">
        <Hero onScrubContainer={(el) => (containerRef.current = el)} onNavigate={goTo} lenisRef={lenisRef}>
          <About />
          <Projects />
          <Education />
          <Contact />
          <Footer onNavigate={goTo} />
        </Hero>
      </div>
    </>
  );
}
