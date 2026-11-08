"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useAnimate, useOffscreenAttr, useRaf } from "@/lib/motion";
import { BrandSquare } from "../ui";

export interface HubNode {
  title: string;
  meta?: string;
  /** simple-icons slug for the coloured square */
  slug?: string;
  /** custom square content (overrides slug) */
  icon?: ReactNode;
  /** square background + particle colour */
  color: string;
  href?: string;
}

interface PathGeo {
  d: string;
  color: string;
  side: "l" | "r";
}

interface Particle {
  el: SVGCircleElement;
  path: number;
  t: number;
  dur: number;
  reverse: boolean;
  side: "l" | "r";
}

const SVG_NS = "http://www.w3.org/2000/svg";
const MAX_PARTICLES = 16;

/**
 * Hub-and-spoke diagram: a dark hub with pulse rings, white node cards on both sides joined by
 * bezier paths, and coloured particles streaming along them.
 * mode "out": hub → every node.  mode "through": left nodes → hub → right nodes.
 */
export function HubDiagram({
  left,
  right,
  hub,
  hubBadge,
  mode = "out",
  className = "",
}: {
  left: HubNode[];
  right: HubNode[];
  hub: ReactNode;
  hubBadge?: ReactNode;
  mode?: "out" | "through";
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLElement | null)[]>([]);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const layerRef = useRef<SVGGElement>(null);
  const particles = useRef<Particle[]>([]);
  const spawnIn = useRef(0);
  const [geo, setGeo] = useState<{ w: number; h: number; paths: PathGeo[] }>({ w: 1000, h: 360, paths: [] });

  const nodes = [...left, ...right];
  const active = useAnimate(wrapRef);
  useOffscreenAttr(wrapRef);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    const hubEl = hubRef.current;
    if (!wrap || !hubEl) return;
    const box = wrap.getBoundingClientRect();
    const hb = hubEl.getBoundingClientRect();
    const hy = hb.top - box.top + hb.height / 2;
    const paths: PathGeo[] = [];
    nodeRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const side: "l" | "r" = i < left.length ? "l" : "r";
      const hx = side === "l" ? hb.left - box.left : hb.right - box.left;
      const nx = side === "l" ? r.right - box.left : r.left - box.left;
      const ny = r.top - box.top + r.height / 2;
      const mx = (hx + nx) / 2;
      paths.push({ d: `M${hx},${hy} C${mx},${hy} ${mx},${ny} ${nx},${ny}`, color: nodes[i].color, side });
    });
    setGeo({ w: box.width, h: box.height, paths });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left.length]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [measure]);

  const spawn = useCallback(
    (side: "l" | "r" | "any", reverse: boolean, colorFrom?: string) => {
      const layer = layerRef.current;
      if (!layer || particles.current.length >= MAX_PARTICLES) return;
      const candidates = geo.paths
        .map((p, i) => ({ p, i }))
        .filter(({ p }) => side === "any" || p.side === side);
      if (!candidates.length) return;
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      const el = document.createElementNS(SVG_NS, "circle");
      el.setAttribute("r", (2.5 + Math.random() * 1.7).toFixed(2));
      el.setAttribute("fill", colorFrom ?? pick.p.color);
      el.setAttribute("opacity", "0");
      layer.appendChild(el);
      particles.current.push({ el, path: pick.i, t: 0, dur: 1150 + Math.random() * 300, reverse, side: pick.p.side });
    },
    [geo.paths],
  );

  useRaf((dt) => {
    spawnIn.current -= dt;
    if (spawnIn.current <= 0) {
      spawnIn.current = 140 + Math.random() * 130;
      if (mode === "out") spawn("any", false);
      else spawn("l", true);
    }
    const alive: Particle[] = [];
    for (const prev of particles.current) {
      const p = { ...prev, t: prev.t + dt / prev.dur };
      const path = pathRefs.current[p.path];
      if (p.t >= 1 || !path) {
        p.el.remove();
        if (mode === "through" && p.side === "l") spawn("r", false);
        continue;
      }
      const len = path.getTotalLength();
      const pt = path.getPointAtLength(len * (p.reverse ? 1 - p.t : p.t));
      p.el.setAttribute("cx", pt.x.toFixed(1));
      p.el.setAttribute("cy", pt.y.toFixed(1));
      const fade = p.t < 0.1 ? p.t / 0.1 : p.t > 0.9 ? (1 - p.t) / 0.1 : 1;
      p.el.setAttribute("opacity", fade.toFixed(2));
      alive.push(p);
    }
    particles.current = alive;
  }, active && geo.paths.length > 0);

  const renderNode = (n: HubNode, i: number) => {
    const inner = (
      <>
        {n.icon ? (
          <span
            className="flex size-[38px] shrink-0 items-center justify-center rounded-[11px] text-white"
            style={{ background: n.color }}
          >
            {n.icon}
          </span>
        ) : (
          <BrandSquare slug={n.slug ?? ""} bg={n.color} />
        )}
        <span className="flex min-w-0 flex-col gap-0.5 max-sm:hidden">
          <span className="truncate text-[14px] font-semibold text-ink">{n.title}</span>
          {n.meta ? (
            <span className="flex items-center gap-[5px] truncate text-[11.5px] text-subtle">
              <span className="size-1.5 shrink-0 rounded-full bg-ok" />
              {n.meta}
            </span>
          ) : null}
        </span>
      </>
    );
    const cls =
      "flex min-w-0 items-center gap-2.5 rounded-2xl bg-white py-2.5 pr-3 pl-2.5 shadow-[0_12px_28px_-18px_rgba(0,0,0,0.3)] max-sm:p-2";
    const setRef = (el: HTMLElement | null) => {
      nodeRefs.current[i] = el;
    };
    return n.href ? (
      <a
        key={n.title}
        ref={setRef}
        href={n.href}
        target={n.href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className={`${cls} transition-transform hover:-translate-y-0.5`}
        aria-label={n.title}
      >
        {inner}
      </a>
    ) : (
      <div key={n.title} ref={setRef} className={cls}>
        {inner}
      </div>
    );
  };

  return (
    <div
      ref={wrapRef}
      className={`relative grid h-[380px] w-full grid-cols-[minmax(0,210px)_minmax(30px,1fr)_auto_minmax(30px,1fr)_minmax(0,210px)] items-center text-left max-sm:h-[320px] max-sm:grid-cols-[auto_minmax(16px,1fr)_auto_minmax(16px,1fr)_auto] ${className}`}
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-visible"
        viewBox={`0 0 ${geo.w} ${geo.h}`}
      >
        {geo.paths.map((p, i) => (
          <path
            key={i}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            d={p.d}
            fill="none"
            stroke="#d9d9d9"
            strokeWidth="1.5"
          />
        ))}
        <g ref={layerRef} />
      </svg>

      <div className="relative z-[2] flex flex-col gap-10">{left.map((n, i) => renderNode(n, i))}</div>
      <div />
      <div className="relative z-[2] flex flex-col items-center gap-3.5">
        <div ref={hubRef} className="relative size-[104px] max-sm:size-[84px]">
          <span
            className="absolute inset-0 rounded-[30px] border-[1.5px] border-live"
            style={{ animation: "ssHubRing 2s linear infinite" }}
          />
          <span
            className="absolute inset-0 rounded-[30px] border-[1.5px] border-live"
            style={{ animation: "ssHubRing 2s linear -1s infinite" }}
          />
          <div className="absolute inset-0 flex items-center justify-center rounded-[30px] bg-ink shadow-[0_24px_40px_-18px_rgba(0,0,0,0.5)]">
            {hub}
          </div>
        </div>
        {hubBadge}
      </div>
      <div />
      <div className="relative z-[2] flex flex-col gap-10">
        {right.map((n, i) => renderNode(n, i + left.length))}
      </div>
    </div>
  );
}
