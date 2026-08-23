"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechIntroGate, { TECH_REVEAL_RATIO } from "@/components/TechIntroGate";
import Technologies from "@/components/Technologies";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import ParallaxTilt from "@/components/ParallaxTilt";

const SECTION_IDS = ["about", "projects", "contact"] as const;

const getOffsetTopWithin = (container: HTMLElement, el: HTMLElement) => {
  let total = 0;
  let node: HTMLElement | null = el;
  while (node && node !== container) {
    total += node.offsetTop;
    node = node.offsetParent as HTMLElement;
  }
  return total;
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [activeId, setActiveId] = useState("home");
  const [navHidden, setNavHidden] = useState(false);

  const scrollToSection = useCallback((id: string) => {
    const container = containerRef.current;
    const lenis = lenisRef.current;
    if (!container) return;

    if (id === "home") {
      if (lenis) lenis.scrollTo(0, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 3) });
      else container.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (id === "technologies") {
      const gate = container.querySelector<HTMLElement>("#tech-gate");
      if (gate) {
        const target = Math.max(
          0,
          getOffsetTopWithin(container, gate) +
            TECH_REVEAL_RATIO *
              Math.max(0, gate.offsetHeight - container.clientHeight)
        );
        if (lenis) {
          lenis.scrollTo(target, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 3) });
        } else {
          container.scrollTo({ top: target, behavior: "smooth" });
        }
        return;
      }
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

    const getOffsetTopWithin = (el: HTMLElement) => {
      let total = 0;
      let node: HTMLElement | null = el;
      while (node && node !== container) {
        total += node.offsetTop;
        node = node.offsetParent as HTMLElement;
      }
      return total;
    };

    const updateActive = () => {
      const top = container.scrollTop;
      let current = "home";
      for (const id of SECTION_IDS) {
        const el = container.querySelector<HTMLElement>(`#${id}`);
        if (el && el.offsetTop - 200 <= top) current = id;
      }

      const gateEl = container.querySelector<HTMLElement>("#tech-gate");
      if (gateEl) {
        const gateTop = getOffsetTopWithin(gateEl);
        if (top >= gateTop && top < gateTop + gateEl.offsetHeight) {
          current = "technologies";
        }
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
        case "technologies":
          root.style.setProperty("--section-glow-opacity", "0.035");
          root.style.setProperty("--section-glow-hue", "82");
          root.style.setProperty("--section-glow-spread", "52%");
          break;
        case "contact":
          root.style.setProperty("--section-glow-opacity", "0.05");
          root.style.setProperty("--section-glow-hue", "70");
          root.style.setProperty("--section-glow-spread", "65%");
          break;
      }

      setActiveId(current);

      setNavHidden(current === "technologies");
    };

    const SNAP_IDLE_MS = 160;
    const SNAP_DURATION = 0.65;

    let snapTimer = 0;
    let snapping = false;

    const scheduleSnap = () => {
      window.clearTimeout(snapTimer);
      snapTimer = window.setTimeout(() => {
        const lenis = lenisRef.current;
        if (snapping || !lenis || document.hidden) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const viewTop = container.scrollTop;

        const stops: number[] = [];
        const gateEl = container.querySelector<HTMLElement>("#tech-gate");
        if (gateEl) {
          const gateTop = getOffsetTopWithin(gateEl);
          stops.push(
            gateTop,
            gateTop +
              TECH_REVEAL_RATIO *
                Math.max(0, gateEl.offsetHeight - container.clientHeight)
          );
        }

        let bestDelta = Number.POSITIVE_INFINITY;
        for (const stop of stops) {
          const delta = stop - viewTop;
          if (Math.abs(delta) < Math.abs(bestDelta)) bestDelta = delta;
        }

        if (
          !Number.isFinite(bestDelta) ||
          Math.abs(bestDelta) < 8 ||
          Math.abs(bestDelta) > container.clientHeight * 0.45
        )
          return;

        snapping = true;
        lenis.scrollTo(viewTop + bestDelta, {
          duration: SNAP_DURATION,
          easing: (t) => 1 - Math.pow(1 - t, 3),
        });
        window.setTimeout(() => {
          snapping = false;
        }, SNAP_DURATION * 1000 + 80);
      }, SNAP_IDLE_MS);
    };

    const onScroll = () => {
      updateActive();
      if (!snapping) scheduleSnap();
    };

    updateActive();
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(snapTimer);
      container.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <Navbar activeId={activeId} onNavigate={goTo} hide={navHidden} />
      <ScrollProgress containerRef={containerRef} />
      <ParallaxTilt>
        <div className="relative h-screen overflow-hidden" style={{ perspective: 1200 }}>
          <Hero onScrubContainer={(el) => (containerRef.current = el)} onNavigate={goTo} lenisRef={lenisRef}>
            <About />
            <TechIntroGate containerRef={containerRef}>
              <Technologies />
            </TechIntroGate>
            <Projects containerRef={containerRef} />
            <Contact />
            <Footer onNavigate={goTo} />
          </Hero>
        </div>
      </ParallaxTilt>
    </>
  );
}
