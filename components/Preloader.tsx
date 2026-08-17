"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const GLYPHS = "@#$%&*!?/<>[]{}()01";

const DECODE_AT = 900;
const SUBTITLE_AT = 1750;
const FLASH_AT = 2250;
const GONE_AT = 1050;

const DROPS = Array.from({ length: 42 }, (_, i) => ({
  left: ((i * 73) % 97) + 1,
  duration: 2.6 + ((i * 53) % 100) / 60,
  delay: -((i * 37) % 260) / 100,
  opacity: 0.25 + ((i * 31) % 45) / 100,
  size: 12 + ((i * 17) % 16),
  char: GLYPHS[(i * 7) % GLYPHS.length],
}));

function useDecodedChar(
  target: string,
  startDelay: number,
  enabled = true,
  flipMs = 45,
  flips = 6,
) {
  const [char, setChar] = useState(() =>
    GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
  );

  useEffect(() => {
    if (!enabled) return;
    let interval: number | null = null;
    const timeout = window.setTimeout(() => {
      let flipped = 0;
      interval = window.setInterval(() => {
        flipped += 1;
        if (flipped >= flips) {
          setChar(target);
          if (interval !== null) window.clearInterval(interval);
        } else {
          setChar(GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
        }
      }, flipMs);
    }, startDelay);

    return () => {
      window.clearTimeout(timeout);
      if (interval !== null) window.clearInterval(interval);
    };
  }, [target, startDelay, flipMs, flips, enabled]);

  return enabled ? char : target;
}

function Rain({ active }: { active: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {DROPS.map((d, i) => (
        <motion.span
          key={i}
          className="absolute top-0 font-mono text-primary/40"
          style={{
            left: `${d.left}%`,
            fontSize: d.size,
            textShadow: "0 0 10px rgba(163, 230, 53, 0.55)",
          }}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: "105vh", opacity: d.opacity }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {d.char}
        </motion.span>
      ))}
    </motion.div>
  );
}

function IntroStage({ leaving }: { leaving: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.25 }}
      className="relative flex flex-col items-center gap-6"
    >
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.35em] text-slate-500">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary shadow-[0_0_8px_rgba(163,230,53,0.9)]" />
        signal acquired
      </div>
      <div className="font-mono text-xl text-slate-600 sm:text-2xl">
        <span className="text-secondary">0x</span>
        <span className="text-slate-400">A????</span>
      </div>
    </motion.div>
  );
}

function DecodingLetter({
  target,
  index,
  enabled,
}: {
  target: string;
  index: number;
  enabled: boolean;
}) {
  const char = useDecodedChar(target, DECODE_AT + index * 70, enabled);
  const done = char === target;

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      data-char={target}
      className={`font-mono text-6xl font-extrabold text-white sm:text-7xl ${
        done ? "" : "glitch-char glitching"
      }`}
      style={done ? { textShadow: "0 0 24px rgba(163, 230, 53, 0.55)" } : undefined}
    >
      {char}
    </motion.span>
  );
}

function DecodeStage({ enabled }: { enabled: boolean }) {
  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="glitch-text relative flex"
      >
        {"AFRAZ".split("").map((letter, i) => (
          <DecodingLetter key={i} target={letter} index={i} enabled={enabled} />
        ))}
        <motion.div
          className="scanline absolute inset-x-0 h-12"
          initial={{ top: "-30%" }}
          animate={{ top: "120%" }}
          transition={{ duration: 0.7, ease: "easeInOut", delay: 0.05 }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.3 }}
        className="mt-6 font-mono text-xs uppercase tracking-[0.35em] text-slate-400"
      >
        &gt; web developer
      </motion.div>
    </div>
  );
}

export default function Preloader() {
  const [stage, setStage] = useState(0);
  const [gone, setGone] = useState(false);
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";

    if (reduced) {
      const t = window.setTimeout(() => {
        setGone(true);
        document.body.style.overflow = "";
      }, 1100);
      return () => {
        window.clearTimeout(t);
        document.body.style.overflow = "";
      };
    }

    const t1 = window.setTimeout(() => setStage(1), DECODE_AT);
    const t2 = window.setTimeout(() => setStage(2), SUBTITLE_AT);
    const t3 = window.setTimeout(() => setStage(3), FLASH_AT);
    const t4 = window.setTimeout(() => {
      setGone(true);
      document.body.style.overflow = "";
    }, GONE_AT);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
      document.body.style.overflow = "";
    };
  }, [reduced]);

  const decoding = stage >= 1;
  const flashing = stage >= 3;
  const enabled = !gone && !reduced;

  if (gone) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden bg-bg"
    >
      <Rain active={enabled && stage < 3} />

      <div className="preloader-scanline" />

      {decoding ? (
        <DecodeStage enabled={enabled} />
      ) : (
        <IntroStage leaving={false} />
      )}

      <motion.div
        className="pointer-events-none fixed inset-0 z-[310] bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: flashing ? 1 : 0 }}
        transition={{ duration: flashing ? 0.3 : 0, ease: "easeIn" }}
      />
    </motion.div>
  );
}
