"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

/* ───────────── Global "pause animations" store (localStorage-backed) ───────────── */

const MOTION_KEY = "ss:motion";
const pausedListeners = new Set<() => void>();

function readPaused(): boolean {
  try {
    return localStorage.getItem(MOTION_KEY) === "paused";
  } catch {
    return false;
  }
}

export function setMotionPaused(paused: boolean): void {
  try {
    localStorage.setItem(MOTION_KEY, paused ? "paused" : "playing");
  } catch {
    /* storage blocked — state still applies for this page view */
  }
  if (paused) document.documentElement.dataset.motion = "paused";
  else delete document.documentElement.dataset.motion;
  pausedListeners.forEach((l) => l());
}

function subscribePaused(cb: () => void): () => void {
  pausedListeners.add(cb);
  return () => pausedListeners.delete(cb);
}

export function usePaused(): boolean {
  return useSyncExternalStore(subscribePaused, readPaused, () => false);
}

/* ───────────── Motion-ready gate ─────────────
 * Animations stay idle until the page has loaded and the main thread is free, so they never
 * compete with hydration (keeps Total Blocking Time low). Also flips html[data-motion-ready]
 * which un-pauses CSS keyframe loops.
 */

let motionReady = false;
let readyScheduled = false;
const readyListeners = new Set<() => void>();

function scheduleReady(): void {
  if (readyScheduled) return;
  readyScheduled = true;
  const fire = () => {
    motionReady = true;
    document.documentElement.dataset.motionReady = "";
    readyListeners.forEach((l) => l());
  };
  const afterLoad = () => {
    if ("requestIdleCallback" in window) window.requestIdleCallback(fire, { timeout: 2500 });
    else setTimeout(fire, 600);
  };
  if (document.readyState === "complete") afterLoad();
  else window.addEventListener("load", afterLoad, { once: true });
}

function subscribeReady(cb: () => void): () => void {
  readyListeners.add(cb);
  scheduleReady();
  return () => readyListeners.delete(cb);
}

export function useMotionReady(): boolean {
  return useSyncExternalStore(subscribeReady, () => motionReady, () => false);
}

/* ───────────── prefers-reduced-motion ───────────── */

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(cb: () => void): () => void {
  const mql = window.matchMedia(REDUCED_QUERY);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

/* ───────────── Visibility ───────────── */

export function useInView<T extends Element>(ref: RefObject<T | null>, rootMargin = "0px"): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

/** True when a JS animation loop attached to `ref` should run. */
export function useAnimate<T extends Element>(ref: RefObject<T | null>): boolean {
  const inView = useInView(ref, "80px");
  const paused = usePaused();
  const reduced = useReducedMotion();
  const ready = useMotionReady();
  return ready && inView && !paused && !reduced;
}

/* ───────────── Loops ───────────── */

export function useInterval(cb: () => void, ms: number, active: boolean): void {
  const saved = useRef(cb);
  useEffect(() => {
    saved.current = cb;
  });
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => saved.current(), ms);
    return () => window.clearInterval(id);
  }, [ms, active]);
}

/** requestAnimationFrame loop; callback gets delta-ms since last frame. */
export function useRaf(cb: (dt: number, now: number) => void, active: boolean): void {
  const saved = useRef(cb);
  useEffect(() => {
    saved.current = cb;
  });
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      saved.current(dt, now);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);
}

/** Toggles `data-offscreen` on an element so CSS keyframe loops pause when not visible. */
export function useOffscreenAttr<T extends HTMLElement>(ref: RefObject<T | null>): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) delete el.dataset.offscreen;
        else el.dataset.offscreen = "";
      },
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}
