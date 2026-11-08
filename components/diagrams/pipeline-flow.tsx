"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, CopyX, RotateCw } from "lucide-react";
import { useAnimate, useOffscreenAttr, useRaf } from "@/lib/motion";
import { BrandIcon, BrandSquare } from "../ui";

interface Source {
  name: string;
  meta: string;
  slug: string;
  color: string;
}

const SOURCES: Source[] = [
  { name: "Orders API", meta: "FastAPI producer", slug: "fastapi", color: "#009688" },
  { name: "Payments", meta: "Go producer", slug: "go", color: "#00ADD8" },
  { name: "Webhooks", meta: "at-least-once", slug: "nodedotjs", color: "#5FA04E" },
  { name: "Scheduler", meta: "cron jobs", slug: "celery", color: "#8B7BFF" },
];

type Status = "ok" | "dup" | "retry";

interface Script {
  src: number;
  name: string;
  status: Status;
  ms: number;
}

/** Scripted traffic. A webhook redelivers the payment we just processed → idempotency skips it. */
const SCRIPT: Script[] = [
  { src: 0, name: "order.created", status: "ok", ms: 14 },
  { src: 1, name: "payment.captured", status: "ok", ms: 9 },
  { src: 2, name: "payment.captured", status: "dup", ms: 1 },
  { src: 3, name: "invoice.generate", status: "retry", ms: 212 },
  { src: 0, name: "order.updated", status: "ok", ms: 11 },
  { src: 2, name: "refund.requested", status: "ok", ms: 17 },
  { src: 1, name: "payment.failed", status: "ok", ms: 8 },
  { src: 3, name: "report.daily", status: "ok", ms: 42 },
];

export interface Row {
  key: number;
  id: string;
  src: number;
  name: string;
  status: Status;
  ms: number;
  partition: number;
  offset: number;
}

const CYCLE_MS = 1900;
const DOT_MS = 800;
const MAX_ROWS = 6;

export function makeRow(n: number, prev: Row | undefined): Row {
  const s = SCRIPT[n % SCRIPT.length];
  const id = s.status === "dup" && prev ? prev.id : `evt_${(0x7f3a + n * 37).toString(16)}`;
  return {
    key: n,
    id,
    src: s.src,
    name: s.name,
    status: s.status,
    ms: s.ms,
    partition: (n * 3) % 6,
    offset: 18_420 + n * 7,
  };
}

export function initialRows(): Row[] {
  const rows: Row[] = [];
  for (let n = 0; n < 4; n++) rows.push(makeRow(n, rows.at(-1)));
  return rows;
}

function StatusBadge({ status, ms }: Readonly<{ status: Status; ms: number }>) {
  if (status === "dup")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#fff4d6] px-2 py-[3px] text-[11.5px] font-medium leading-none text-[#6b4a00]">
        <CopyX size={12} /> <span className="max-sm:hidden">duplicate · skipped</span><span className="sm:hidden">dup</span>
      </span>
    );
  if (status === "retry")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#eef0ff] px-2 py-[3px] text-[11.5px] font-medium leading-none text-[#2c3a8c]">
        <RotateCw size={12} /> <span className="max-sm:hidden">retry 2/5 · ok</span><span className="sm:hidden">retry</span>
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#e7f8e3] px-2 py-[3px] text-[11.5px] font-medium leading-none text-[#1d5c12]">
      <Check size={12} strokeWidth={2.6} /> {ms}ms
    </span>
  );
}

export function PipelineFlow() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const srcRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const dotRef = useRef<SVGCircleElement>(null);
  const loop = useRef({ timer: CYCLE_MS - 600, dot: null as null | { path: number; t: number }, n: 4 });

  const [geo, setGeo] = useState<{ w: number; h: number; paths: string[] }>({ w: 1000, h: 520, paths: [] });
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [pop, setPop] = useState(-1);
  const [stats, setStats] = useState({ ok: 18_204, dup: 311, retry: 57 });

  const active = useAnimate(wrapRef);
  useOffscreenAttr(wrapRef);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    const panel = panelRef.current;
    if (!wrap || !panel) return;
    const box = wrap.getBoundingClientRect();
    const pb = panel.getBoundingClientRect();
    const px = pb.left - box.left;
    const pmid = pb.top - box.top + pb.height / 2;
    const paths = srcRefs.current.map((el, i) => {
      if (!el) return "";
      const r = el.getBoundingClientRect();
      const sx = r.right - box.left;
      const sy = r.top - box.top + r.height / 2;
      const ty = pmid + (i - (SOURCES.length - 1) / 2) * 24;
      const mx = (sx + px) / 2;
      return `M${sx},${sy} C${mx},${sy} ${mx},${ty} ${px},${ty}`;
    });
    setGeo({ w: box.width, h: box.height, paths });
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [measure]);

  useRaf((dt) => {
    const L = loop.current;
    L.timer += dt;
    if (L.timer >= CYCLE_MS) {
      L.timer = 0;
      const src = SCRIPT[L.n % SCRIPT.length].src;
      L.dot = { path: src, t: 0 };
      setPop(src);
    }
    const dot = dotRef.current;
    if (!L.dot || !dot) return;
    L.dot.t += dt / DOT_MS;
    const path = pathRefs.current[L.dot.path];
    if (L.dot.t >= 1 || !path) {
      dot.setAttribute("opacity", "0");
      L.dot = null;
      const n = L.n++;
      setPop(-1);
      setRows((prev) => [...prev, makeRow(n, prev.at(-1))].slice(-MAX_ROWS));
      const status = SCRIPT[n % SCRIPT.length].status;
      setStats((s) => ({ ...s, [status]: s[status] + 1 }));
      return;
    }
    // ease-in-out (slow-fast-slow)
    const t = L.dot.t;
    const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
    const pt = path.getPointAtLength(path.getTotalLength() * e);
    dot.setAttribute("cx", pt.x.toFixed(1));
    dot.setAttribute("cy", pt.y.toFixed(1));
    dot.setAttribute("fill", SOURCES[L.dot.path].color);
    dot.setAttribute("opacity", t > 0.85 ? ((1 - t) / 0.15).toFixed(2) : "1");
  }, active && geo.paths.length > 0);

  return (
    <div
      ref={wrapRef}
      className="relative grid h-[520px] text-left grid-cols-[minmax(130px,190px)_minmax(40px,1fr)_minmax(0,420px)] items-center rounded-[28px] bg-surface-2 p-[clamp(16px,2vw,28px)] max-sm:h-[480px] max-sm:grid-cols-[52px_20px_1fr]"
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
        viewBox={`0 0 ${geo.w} ${geo.h}`}
      >
        {geo.paths.map((d, i) => (
          <g key={SOURCES[i].name}>
            <path d={d} fill="none" stroke="#dcdcdc" strokeWidth="1.5" />
            <path
              ref={(el) => {
                pathRefs.current[i] = el;
              }}
              d={d}
              fill="none"
              stroke={SOURCES[i].color}
              strokeWidth="1.5"
              strokeDasharray="2 10"
              opacity=".55"
              className="march"
            />
          </g>
        ))}
        <circle ref={dotRef} r="5" opacity="0" />
      </svg>

      {/* sources */}
      <div className="relative z-[2] flex h-full flex-col justify-around">
        {SOURCES.map((s, i) => (
          <div
            key={s.name}
            ref={(el) => {
              srcRefs.current[i] = el;
            }}
            className="flex items-center gap-2.5 rounded-2xl bg-white p-2.5 max-sm:p-2"
            style={{
              transform: pop === i ? "scale(1.04)" : "none",
              boxShadow: pop === i ? `0 10px 24px -10px ${s.color}` : "0 12px 28px -18px rgba(0,0,0,.3)",
              transition: "transform 250ms, box-shadow 250ms",
            }}
          >
            <BrandSquare slug={s.slug} size={36} bg={s.color} />
            <span className="flex min-w-0 flex-col max-sm:hidden">
              <span className="truncate text-[13px] font-semibold text-ink">{s.name}</span>
              <span className="truncate text-[11px] text-subtle">{s.meta}</span>
            </span>
          </div>
        ))}
      </div>
      <div />

      {/* consumer panel */}
      <div
        ref={panelRef}
        className="relative z-[2] flex h-full max-h-[460px] min-w-0 flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_20px_40px_-24px_rgba(0,0,0,.25)]"
      >
        <div className="flex items-center gap-2.5 border-b border-line-soft px-4 py-3">
          <BrandSquare slug="apachekafka" size={30} radius={9} bg="#111" />
          <div className="min-w-0">
            <div className="truncate text-[13.5px] font-semibold text-ink">billing-workers</div>
            <div className="truncate font-mono text-[11px] text-subtle">consumer group · 6 partitions</div>
          </div>
          <span className="ml-auto flex items-center gap-1.5 text-[11.5px] font-medium text-ink">
            <span className="size-1.5 rounded-full bg-ok" style={{ animation: "ssBlink 2.4s infinite" }} />{" "}
            lag 0
          </span>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col justify-end gap-1.5 px-2.5 py-2.5">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[60px] bg-[linear-gradient(#fff,rgba(255,255,255,0))]" />
          {rows.map((r) => (
            <div
              key={r.key}
              className={`row-in flex items-center gap-2.5 rounded-xl px-2 py-1.5 ${r.status === "dup" ? "bg-[#fffaeb]" : ""}`}
            >
              <span
                className="flex size-[28px] shrink-0 items-center justify-center rounded-full"
                style={{ background: `${SOURCES[r.src].color}1f` }}
              >
                <BrandIcon slug={SOURCES[r.src].slug} size={14} color={SOURCES[r.src].color} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-medium text-ink">
                  <span className="font-mono text-subtle">{r.id}</span> {r.name}
                </span>
                <span className="block truncate font-mono text-[10.5px] text-quiet">
                  p{r.partition} · offset {r.offset.toLocaleString("en-US")}
                </span>
              </span>
              <span className="shrink-0">
                <StatusBadge status={r.status} ms={r.ms} />
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 border-t border-line-soft font-mono text-[11px] text-subtle">
          <div className="px-3 py-2.5">
            <div className="text-[13px] font-semibold text-ink tabular-nums">{stats.ok.toLocaleString("en-US")}</div>
            processed
          </div>
          <div className="border-l border-line-soft px-3 py-2.5">
            <div className="text-[13px] font-semibold text-ink tabular-nums">{stats.dup}</div>
            dupes skipped
          </div>
          <div className="border-l border-line-soft px-3 py-2.5">
            <div className="text-[13px] font-semibold text-ink tabular-nums">{stats.retry}</div>
            retried
          </div>
        </div>
      </div>
    </div>
  );
}
