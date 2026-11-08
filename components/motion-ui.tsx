"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import {
  setMotionPaused,
  useAnimate,
  useInterval,
  useOffscreenAttr,
  usePaused,
  useReducedMotion,
} from "@/lib/motion";
import type { RoleWord } from "@/lib/content";
import { BrandIcon } from "./ui";

/** Fade/rise children in the first time they scroll into view. */
export function Reveal({ children, className = "" }: Readonly<{ children: ReactNode; className?: string }>) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.shown = "";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

/** Pauses CSS keyframe loops inside while the block is off-screen. */
export function OffscreenGate({ children, className = "" }: Readonly<{ children: ReactNode; className?: string }>) {
  const ref = useRef<HTMLDivElement>(null);
  useOffscreenAttr(ref);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Global "Pause animations" chip — hidden for reduced-motion users. */
export function MotionToggle({ className = "" }: Readonly<{ className?: string }>) {
  const paused = usePaused();
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <button
      type="button"
      onClick={() => setMotionPaused(!paused)}
      className={`inline-flex h-9 items-center gap-1.5 rounded-full bg-chip px-3.5 text-[13px] font-medium text-ink transition-colors hover:bg-line-soft ${className}`}
    >
      {paused ? <Play size={13} fill="currentColor" /> : <Pause size={13} fill="currentColor" />}
      {paused ? "Play animations" : "Pause animations"}
    </button>
  );
}

type WordState = "active" | "prev" | "next";

const WORD_TRANSFORM: Record<WordState, string> = {
  active: "translateY(0) scale(1)",
  prev: "translateY(-0.6em) scale(.92)",
  next: "translateY(0.6em) scale(.92)",
};

export function wordState(i: number, index: number, count: number): WordState {
  const offset = (i - index + count) % count;
  if (offset === 0) return "active";
  return offset === count - 1 ? "prev" : "next";
}

/** Hero word that rises in from below with a blur-spring, every ~2.2s. */
export function RotatingWord({ items, interval = 2200 }: Readonly<{ items: RoleWord[]; interval?: number }>) {
  const ref = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);
  const active = useAnimate(ref);
  useInterval(() => setIndex((i) => (i + 1) % items.length), interval, active);

  return (
    <span ref={ref} className="relative inline-grid justify-items-center overflow-hidden pb-[0.08em] align-bottom">
      <span className="sr-only">{items.map((w) => w.label).join(", ")}</span>
      {items.map((w, i) => {
        const state = wordState(i, index, items.length);
        const transform = WORD_TRANSFORM[state];
        return (
          <span
            key={w.label}
            aria-hidden="true"
            className="inline-flex items-center gap-[0.18em] whitespace-nowrap [grid-area:1/1]"
            style={{
              // Shrink only when this word would be wider than the headline (narrow phones).
              fontSize: `min(1em, calc(100cqi / ${w.fit}))`,
              opacity: state === "active" ? 1 : 0,
              transform,
              filter: state === "active" ? "blur(0)" : "blur(6px)",
              transition:
                "opacity .5s, transform .6s cubic-bezier(.34,1.3,.64,1), filter .5s",
            }}
          >
            <span
              className="relative top-[-0.04em] inline-flex size-[0.8em] items-center justify-center rounded-[0.22em]"
              style={{ background: w.bg, transform: `rotate(${w.rotate}deg)` }}
            >
              <BrandIcon slug={w.icon} color={w.fg} size={40} className="size-[0.44em]" />
            </span>
            {w.label}
          </span>
        );
      })}
    </span>
  );
}

/** Ticking mono clock "00:42:33" — starts at a fixed offset so SSR and client agree. */
export function LiveClock({ start = 2553, className = "" }: Readonly<{ start?: number; className?: string }>) {
  const ref = useRef<HTMLSpanElement>(null);
  const [secs, setSecs] = useState(start);
  const active = useAnimate(ref);
  useInterval(() => setSecs((s) => s + 1), 1000, active);
  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return (
    <span ref={ref} className={`font-mono tabular-nums ${className}`}>
      {hh}:{mm}:{ss}
    </span>
  );
}
