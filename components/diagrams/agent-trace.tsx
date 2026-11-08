"use client";

import { useRef, useState } from "react";
import { Check, FileText, Search, Sparkles, Wrench, Workflow } from "lucide-react";
import { useAnimate, useOffscreenAttr, useRaf } from "@/lib/motion";
import { BrandIcon } from "../ui";

interface Step {
  node: string;
  detail: string;
  ms: number;
  icon: typeof Check;
  tone: string;
}

const STEPS: Step[] = [
  { node: "planner", detail: "plan → fetch visits, check meds", ms: 412, icon: Workflow, tone: "#8B7BFF" },
  { node: "mcp · records.search", detail: "3 visits · 12 documents", ms: 188, icon: Wrench, tone: "#5BEBC0" },
  { node: "retrieve", detail: "BM25 + vector → 24 chunks → rerank top 5", ms: 236, icon: Search, tone: "#F5C542" },
  { node: "mcp · drug_db.interactions", detail: "2 medications checked", ms: 141, icon: Wrench, tone: "#5BEBC0" },
  { node: "respond", detail: "answer + 2 citations", ms: 903, icon: Sparkles, tone: "#FF8FC7" },
];

const QUESTION = "Summarise this patient's last 3 visits and flag any drug interactions.";
const ANSWER =
  "BP has improved across the 12 Aug, 3 Sep and 28 Sep visits on amlodipine. Heads-up: ibuprofen prescribed on 28 Sep can blunt its effect — flagged for the doctor to review.";

const STEP_MS = 850;
const CHARS_PER_MS = 0.05;
const HOLD_MS = 3600;

type StepStateName = "done" | "running" | "pending";

export function stepState(i: number, doneCount: number, answering: boolean): StepStateName {
  if (i < doneCount) return "done";
  if (i === doneCount && !answering) return "running";
  return "pending";
}

function StepStatus({ state, ms }: Readonly<{ state: StepStateName; ms: number }>) {
  if (state === "done")
    return (
      <span className="inline-flex items-center gap-1 text-[#63d94e]">
        <Check size={12} strokeWidth={3} />
        {ms}ms
      </span>
    );
  if (state === "running")
    return (
      <span
        className="ml-auto block size-3.5 rounded-full border-2 border-[#ffffff30] border-t-[#F5C542]"
        style={{ animation: "ssSpin .8s linear infinite" }}
      />
    );
  return <span className="text-[#5a5a60]">—</span>;
}

type Phase = { kind: "steps"; step: number } | { kind: "typing" } | { kind: "hold" };

export function AgentTrace() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const clock = useRef({ t: 0 });
  const [phase, setPhase] = useState<Phase>({ kind: "steps", step: 1 });
  const [typed, setTyped] = useState(0);
  const active = useAnimate(wrapRef);
  useOffscreenAttr(wrapRef);

  useRaf((dt) => {
    clock.current.t += dt;
    const t = clock.current.t;
    if (phase.kind === "steps") {
      if (t >= STEP_MS) {
        clock.current.t = 0;
        if (phase.step < STEPS.length) setPhase({ kind: "steps", step: phase.step + 1 });
        else setPhase({ kind: "typing" });
      }
    } else if (phase.kind === "typing") {
      const n = Math.min(ANSWER.length, Math.floor(t * CHARS_PER_MS));
      if (n !== typed) setTyped(n);
      if (n >= ANSWER.length) {
        clock.current.t = 0;
        setPhase({ kind: "hold" });
      }
    } else if (t >= HOLD_MS) {
      clock.current.t = 0;
      setTyped(0);
      setPhase({ kind: "steps", step: 0 });
    }
  }, active);

  const doneCount = phase.kind === "steps" ? phase.step : STEPS.length;
  const answering = phase.kind !== "steps";

  return (
    <div
      ref={wrapRef}
      className="overflow-hidden rounded-[24px] border border-line bg-white shadow-[0_30px_60px_-30px_rgba(0,0,0,.25)]"
    >
      {/* browser chrome */}
      <div className="flex h-11 items-center gap-3 border-b border-line-soft bg-surface-2 px-4">
        <div className="flex gap-[7px]">
          <span className="size-[11px] rounded-full bg-[#FF5F57]" />
          <span className="size-[11px] rounded-full bg-[#FEBC2E]" />
          <span className="size-[11px] rounded-full bg-[#28C840]" />
        </div>
        <div className="mx-auto flex h-7 w-full max-w-[360px] items-center justify-center rounded-lg bg-chip font-mono text-[12px] text-subtle">
          doctor-portal / patient / chat
        </div>
        <div className="w-[47px]" />
      </div>

      <div className="grid lg:grid-cols-[1.05fr_1fr]">
        {/* chat */}
        <div className="flex min-h-[420px] flex-col gap-4 p-5 sm:p-7">
          <div className="flex items-center gap-2 text-[13px] text-subtle">
            <span className="flex size-6 items-center justify-center rounded-full bg-[#e8cfae] text-[11px] font-semibold text-[#111]">
              Dr
            </span>{" "}
            Dr. Mehra · consultation #4821
          </div>
          <div className="ml-auto max-w-[85%] rounded-[18px] rounded-br-md bg-ink px-4 py-3 text-[14.5px] leading-[1.5] text-white">
            {QUESTION}
          </div>
          <div className="flex gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#8B7BFF]">
              <Sparkles size={15} color="#fff" />
            </span>
            <div className="min-w-0 flex-1 rounded-[18px] rounded-tl-md bg-surface-2 px-4 py-3 text-[14.5px] leading-[1.55] text-ink-2">
              {answering ? (
                <>
                  {ANSWER.slice(0, typed)}
                  {phase.kind === "typing" ? (
                    <span
                      className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] bg-ink"
                      style={{ animation: "ssCaret 1s steps(1) infinite" }}
                    />
                  ) : null}
                  {phase.kind === "hold" ? (
                    <span className="mt-3 flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11.5px] font-medium text-ink-2">
                        <FileText size={12} /> [1] visit_2026-09-28.pdf
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11.5px] font-medium text-ink-2">
                        <FileText size={12} /> [2] drug_db · NSAID ↔ CCB
                      </span>
                    </span>
                  ) : null}
                </>
              ) : (
                <span className="flex flex-col gap-2 py-1">
                  <span className="h-2 w-[86%] rounded-full bg-line" />
                  <span className="h-2 w-[64%] rounded-full bg-line" />
                  <span className="h-2 w-[72%] rounded-full bg-line" />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* trace */}
        <div className="flex flex-col bg-[#141210] p-5 dark:border-l dark:border-line text-[#f4f4f5] sm:p-7">
          <div className="flex items-center gap-2">
            <BrandIcon slug="langgraph" size={16} color="#fff" />
            <span className="text-[13px] font-semibold">LangGraph run</span>
            <span className="ml-auto font-mono text-[11px] text-[#8e8e93]">trace · run_9c1e</span>
          </div>
          <ol className="relative mt-5 flex flex-col gap-1">
            {STEPS.map((s, i) => {
              const state = stepState(i, doneCount, answering);
              const Icon = s.icon;
              return (
                <li
                  key={s.node}
                  className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors duration-300"
                  style={{ background: state === "running" ? "#ffffff0d" : "transparent" }}
                >
                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-lg transition-opacity duration-300"
                    style={{ background: `${s.tone}26`, opacity: state === "pending" ? 0.35 : 1 }}
                  >
                    <Icon size={14} color={s.tone} />
                  </span>
                  <span className="min-w-0 flex-1" style={{ opacity: state === "pending" ? 0.4 : 1 }}>
                    <span className="block truncate font-mono text-[12.5px] text-[#f4f4f5]">{s.node}</span>
                    <span className="block truncate text-[12px] text-[#8e8e93]">{s.detail}</span>
                  </span>
                  <span className="w-[54px] shrink-0 text-right font-mono text-[11px]">
                    <StepStatus state={state} ms={s.ms} />
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 border-t border-[#ffffff12] pt-4 font-mono text-[11px] text-[#8e8e93]">
            <span>
              <span className="text-[#63d94e]">●</span> prompt cache hit
            </span>
            <span>tokens 3.2k</span>
            <span>circuit: closed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
