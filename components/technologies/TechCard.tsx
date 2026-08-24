"use client";

import { motion } from "framer-motion";
import { TbVector } from "react-icons/tb";
import { RiPushpin2Fill } from "react-icons/ri";
import TiltCard from "@/components/ui/TiltCard";
import type { TechItem } from "@/data/site";
import { hexAlpha, techIcons } from "./icons";

type StickerBadge = "live" | "pinned";

type TechCardProps = {
  item: TechItem;
  color: string;
  categoryLabel: string;
  isMain: boolean;
  tiltMax: number;
  badge?: StickerBadge;
  onPromote?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
  wrapperClassName?: string;
  innerClassName?: string;
};

export default function TechCard({
  item,
  color,
  categoryLabel,
  isMain,
  tiltMax,
  badge,
  onPromote,
  onMouseEnter,
  onMouseLeave,
  className = "",
  wrapperClassName = "",
  innerClassName = "",
}: TechCardProps) {
  const Icon = techIcons[item.icon] ?? TbVector;

  return (
    <motion.button
      type="button"
      onClick={onPromote}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      aria-label={
        isMain
          ? `${item.name}, featured ${badge === "pinned" ? "and pinned — click to resume live rotation" : "in live rotation"}`
          : onPromote
            ? `${item.name}, bring to center`
            : item.name
      }
      className={`group pointer-events-auto rounded-2xl bg-transparent p-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 ${
        isMain ? "z-30" : ""
      } ${onPromote ? "cursor-pointer" : ""} ${className}`}
      style={{ outlineColor: hexAlpha(color, 0.7) }}
    >
      <TiltCard max={tiltMax} className={`rounded-2xl ${wrapperClassName}`}>
        <div
          className={`relative flex select-none items-center justify-center overflow-hidden rounded-2xl border ${
            isMain
              ? "h-[min(17rem,26svh)] w-[32.5rem] max-w-[calc(100vw-3rem)] sm:h-[min(18.25rem,28svh)] sm:w-[35rem]"
              : (innerClassName ||
                "h-[min(6rem,9.5svh)] w-[12rem] flex-col gap-1.5 sm:h-[min(6.5rem,10.5svh)] sm:w-[13rem]")
          }`}
          style={{
            background: `linear-gradient(155deg, color-mix(in srgb, ${color} 26%, #070f03) 0%, color-mix(in srgb, ${color} 12%, #070f03) 45%, #060d03 100%)`,
            borderColor: `color-mix(in srgb, ${color} 45%, #070f03)`,
            boxShadow: `0 14px 34px -16px ${hexAlpha(color, 0.45)}, inset 0 1px 0 rgba(255,255,255,0.07)`,
            transition: "border-color 300ms ease",
          }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-8 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${hexAlpha(color, 0.85)}, transparent)`,
            }}
          />
          {isMain && (
            <>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -left-12 -top-20 h-52 w-52 rounded-full blur-3xl"
                style={{ backgroundColor: hexAlpha(color, 0.16) }}
              />
              <span
                aria-hidden="true"
                className="absolute bottom-3 right-3 h-3.5 w-3.5 rounded-br-md border-b-2 border-r-2"
                style={{ borderColor: hexAlpha(color, 0.55) }}
              />
              <div className="relative z-10 flex items-center gap-4 px-6 sm:gap-6 sm:px-8">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border sm:h-20 sm:w-20"
                  style={{
                    borderColor: `color-mix(in srgb, ${color} 50%, #070f03)`,
                    backgroundColor: `color-mix(in srgb, ${color} 16%, #0a1305)`,
                    boxShadow: `inset 0 0 18px ${hexAlpha(color, 0.15)}, 0 0 22px ${hexAlpha(color, 0.2)}`,
                  }}
                >
                  <Icon
                    className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 sm:h-11 sm:w-11"
                    style={{
                      color,
                      filter: `drop-shadow(0 0 10px ${hexAlpha(color, 0.55)})`,
                    }}
                  />
                </div>
                <div className="flex min-w-0 flex-col items-start gap-1 text-left sm:gap-1.5">
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.3em] sm:text-xs"
                    style={{ color: hexAlpha(color, 0.9) }}
                  >
                    {categoryLabel}
                  </span>
                  <span className="truncate text-xl font-bold leading-tight text-white sm:text-3xl">
                    {item.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-1 h-[3px] w-10 rounded-full sm:w-12"
                    style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
                  />
                </div>
              </div>
              <span
                aria-hidden="true"
                className="absolute left-3 top-3 h-3.5 w-3.5 rounded-tl-md border-l-2 border-t-2"
                style={{ borderColor: hexAlpha(color, 0.55) }}
              />
              {badge && (
                <span
                  className={`absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em] ${
                    badge === "live" ? "animate-pulse" : ""
                  }`}
                  style={
                    badge === "live"
                      ? {
                          borderColor: "rgba(163, 230, 53, 0.6)",
                          backgroundColor: "rgba(163, 230, 53, 0.14)",
                          color: "#a3e635",
                        }
                      : {
                          borderColor: `color-mix(in srgb, ${color} 60%, #070f03)`,
                          backgroundColor: `color-mix(in srgb, ${color} 22%, #070f03)`,
                          color,
                        }
                  }
                >
                  {badge === "pinned" && <RiPushpin2Fill size={10} />}
                  {badge === "live" && (
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(163,230,53,0.9)]"
                    />
                  )}
                  {badge}
                </span>
              )}
            </>
          )}
          {!isMain && (
            <>
              <Icon
                size={24}
                className="transition-transform duration-300 group-hover:scale-110"
                style={{
                  color,
                  filter: `drop-shadow(0 0 6px ${hexAlpha(color, 0.55)})`,
                }}
              />
              <span className="px-2 text-center text-[11px] font-semibold leading-tight text-white sm:text-xs">
                {item.name}
              </span>
            </>
          )}
        </div>
      </TiltCard>
    </motion.button>
  );
}
