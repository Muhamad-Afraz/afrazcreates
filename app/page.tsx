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
import ScrollProgress from "@/components/ScrollProgress";
import ParallaxTilt from "@/components/ParallaxTilt";

const SECTION_IDS = ["about", "projects", "education", "contact"] as const;

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [activeId, setActiveId] = useState("home");

  const scrollToSection = useCallback((id: string) => {
    const container = containerRef.current;
    const lenis = lenisRef.current;
    if (!container) return;

    if (id === "home") {
      if (lenis) lenis.scrollTo(0, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 3) });
      else container.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const el = container.querySelector<HTMLElement>(`#${id}`);
    if (!el) return;

    // Walk up from el to container, summing offsetTops for accurate position
    let target = 0;
    let node: HTMLElement | null = el;
    while (node && node !== container) {
      target += node.offsetTop;
      node = node.offsetParent as HTMLElement;
    }
    target = Math.max(0, target - 80);

    if (lenis) {
      lenis.scrollTo(target, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 3) });
    } else {
      container.scrollTo({ top: target, behavior: "smooth" });
    }
  }, []);

  const goTo = useCallback((id: string) => scrollToSection(id), [scrollToSection]);

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

      const root = document.documentElement;
      switch (current) {
        case "home":
          root.style.setProperty("--section-glow-opacity", "0.04");
          root.style.setProperty("--section-glow-hue", "80");
          root.style.setProperty("--section-glow-spread", "55%");
          break;
        case "about":
          root.style.setProperty("--section-glow-opacity", "0.03");
          root.style.setProperty("--section-glow-hue", "85");
          root.style.setProperty("--section-glow-spread", "50%");
          break;
        case "projects":
          root.style.setProperty("--section-glow-opacity", "0.045");
          root.style.setProperty("--section-glow-hue", "75");
          root.style.setProperty("--section-glow-spread", "60%");
          break;
        case "education":
          root.style.setProperty("--section-glow-opacity", "0.025");
          root.style.setProperty("--section-glow-hue", "90");
          root.style.setProperty("--section-glow-spread", "45%");
          break;
        case "contact":
          root.style.setProperty("--section-glow-opacity", "0.05");
          root.style.setProperty("--section-glow-hue", "70");
          root.style.setProperty("--section-glow-spread", "65%");
          break;
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
      <ScrollProgress containerRef={containerRef} />
      <ParallaxTilt>
        <div className="relative h-screen overflow-hidden" style={{ perspective: 1200 }}>
          <Hero onScrubContainer={(el) => (containerRef.current = el)} onNavigate={goTo} lenisRef={lenisRef}>
            <About />
            <Projects />
            <Education />
            <Contact />
            <Footer onNavigate={goTo} />
          </Hero>
        </div>
      </ParallaxTilt>
    </>
  );
}
