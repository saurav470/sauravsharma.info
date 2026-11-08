import type { CSSProperties, ReactNode } from "react";
import { Activity } from "lucide-react";
import { BrandIcon, BrandSquare, PulseDot } from "./ui";
import { OffscreenGate } from "./motion-ui";

function Cell({
  className = "",
  dark = false,
  children,
}: Readonly<{
  className?: string;
  dark?: boolean;
  children: ReactNode;
}>) {
  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-[28px] p-8 ${dark ? "bg-ink text-white" : "bg-surface-2"} ${className}`}
    >
      {children}
    </article>
  );
}

function Big({ children, dark }: Readonly<{ children: ReactNode; dark?: boolean }>) {
  return (
    <div
      className={`text-[clamp(56px,7vw,96px)] leading-[.95] font-semibold tracking-[-0.05em] tabular-nums ${dark ? "text-white" : "text-ink"}`}
    >
      {children}
    </div>
  );
}

function Title({ children, dark }: Readonly<{ children: ReactNode; dark?: boolean }>) {
  return (
    <h3 className={`text-[22px] leading-[1.2] font-semibold tracking-[-0.02em] ${dark ? "text-white" : "text-ink"}`}>
      {children}
    </h3>
  );
}

function Body({ children, dark }: Readonly<{ children: ReactNode; dark?: boolean }>) {
  return <p className={`mt-2 text-[15px] leading-[1.5] ${dark ? "text-[#a8a8a8]" : "text-muted"}`}>{children}</p>;
}

const FLOAT_TILES = [
  { slug: "python", bg: "#3776AB" },
  { slug: "go", bg: "#00ADD8" },
  { slug: "nodedotjs", bg: "#5FA04E" },
  { slug: "typescript", bg: "#3178C6" },
  { slug: "nextdotjs", bg: "#111111" },
  { slug: "postgresql", bg: "#4169E1" },
  { slug: "apachekafka", bg: "#231F20" },
  { slug: "kubernetes", bg: "#326CE5" },
  { slug: "redis", bg: "#FF4438" },
  { slug: "langchain", bg: "#1C3C3C" },
  { slug: "docker", bg: "#2496ED" },
];

const AVATARS = ["#e6aeb2", "#e8cfae", "#b8d9b1", "#cfc6ff", "#ffd8a8"];
const EQ = [55, 80, 45, 100, 70, 38, 62, 90, 50, 74, 42, 66];

export function Bento() {
  return (
    <OffscreenGate className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1 — years + floating stack */}
      <Cell className="min-h-[520px] sm:col-span-2 lg:row-span-2">
        <Big>3 yrs</Big>
        <Title>shipping production backends.</Title>
        <Body>
          Microservices, event pipelines, real-time infra and GenAI — designed, deployed, on-call and improved.
        </Body>
        <div className="mt-auto grid grid-cols-4 gap-3 pt-10 sm:grid-cols-6">
          {FLOAT_TILES.map((t, i) => (
            <span
              key={t.slug}
              className="flex aspect-square items-center justify-center rounded-[18px] shadow-[0_10px_24px_-12px_rgba(0,0,0,.35)]"
              style={{ background: t.bg, animation: `ssFloat 4.2s ease-in-out ${-i * 0.6}s infinite` }}
            >
              <BrandIcon slug={t.slug} color="#fff" size={26} />
            </span>
          ))}
          <span
            className="flex aspect-square items-center justify-center rounded-[18px] bg-white font-mono text-[22px] text-ink shadow-[0_10px_24px_-12px_rgba(0,0,0,.2)]"
            style={{ animation: "ssFloat 4.2s ease-in-out -6.6s infinite" }}
          >
            <span style={{ animation: "ssBlink 2.4s infinite" }}>_</span>
          </span>
        </div>
      </Cell>

      {/* 2 — uptime / status lights */}
      <Cell className="min-h-[250px] sm:col-span-2">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <Big>99.9%</Big>
            <Title>uptime on Kubernetes.</Title>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-[14px] font-medium text-white">
              <PulseDot color="#f4525f" /> Live
            </span>
            <span className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[14px] font-medium text-ink">
              <span className="size-[7px] rounded-full bg-[#f79c34]" style={{ animation: "ssBlink 1.1s infinite" }} />{" "}
              Rolling update
            </span>
            <span className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[14px] font-medium text-ink">
              <span className="size-[7px] rounded-full bg-ok" /> Healthy
            </span>
          </div>
        </div>
        <Body>Rolling updates, HPA autoscaling and alerts that page before users notice — 70% faster recovery.</Body>
      </Cell>

      {/* 3 — websockets */}
      <Cell className="min-h-[250px]">
        <div className="flex items-center gap-3">
          <Big>10K+</Big>
          <PulseDot color="#63d94e" size={9} />
        </div>
        <Title>concurrent WebSockets.</Title>
        <div className="mt-auto flex pt-6">
          {AVATARS.map((c, i) => (
            <span
              key={c}
              className="-ml-2.5 size-9 rounded-full shadow-[0_0_0_2px_#f4f4f4] first:ml-0"
              style={{ background: c, animation: `ssJoin 5s ease-in-out ${i}s infinite` }}
            />
          ))}
          <span className="relative -ml-2.5 flex size-9 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-ink shadow-[0_0_0_2px_#f4f4f4]">
            +9K
          </span>
        </div>
      </Cell>

      {/* 4 — db latency */}
      <Cell className="min-h-[250px]">
        <Big>−65%</Big>
        <Title>database latency.</Title>
        <div className="mt-auto flex flex-col gap-2.5 pt-6 font-mono text-[11px] text-subtle">
          <div>
            before · 120ms
            <div className="mt-1 h-[6px] rounded-full bg-[#dedede]" />
          </div>
          <div>
            after · 42ms
            <div className="mt-1 h-[6px] w-[35%] overflow-hidden rounded-full bg-[#e4e4e4]">
              <div
                className="h-full origin-left rounded-full bg-ink"
                style={{ animation: "ssFill 3.6s ease-in-out infinite" }}
              />
            </div>
          </div>
        </div>
      </Cell>

      {/* 5 — gRPC (dark) */}
      <Cell dark className="min-h-[250px]">
        <span className="inline-flex h-7 w-fit items-center gap-2 rounded-full bg-white/10 px-3 font-mono text-[11px] tracking-[.06em] text-white">
          <span className="size-1.5 rounded-full bg-live" style={{ animation: "ssBlink 1.6s infinite" }} />{" "}
          REST → gRPC
        </span>
        <div className="mt-4">
          <Big dark>−40%</Big>
        </div>
        <Title dark>p99 latency.</Title>
        <Body dark>Deadline propagation, zero-downtime rollout.</Body>
      </Cell>

      {/* 6 — inference cost */}
      <Cell className="min-h-[250px]">
        <Big>−40%</Big>
        <Title>LLM inference cost.</Title>
        <div className="mt-auto flex h-10 items-center gap-[5px] pt-6">
          {EQ.map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-[3px] bg-ink"
              style={
                {
                  height: `${h}%`,
                  animation: `ssEq ${1 + (i % 4) * 0.18}s ease-in-out ${-i * 0.15}s infinite`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      </Cell>

      {/* 7 — kafka throughput */}
      <Cell className="min-h-[250px] sm:col-span-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Big>500K+</Big>
            <Title>messages an hour — none processed twice.</Title>
          </div>
          <BrandSquare slug="apachekafka" size={56} radius={16} bg="#111" />
        </div>
        <div className="mt-auto grid grid-cols-6 gap-1.5 pt-6">
          {Array.from({ length: 6 }, (_, p) => (
            <div key={p} className="font-mono text-[10.5px] text-subtle">
              p{p}
              <div className="mt-1 h-[5px] overflow-hidden rounded-full bg-[#e4e4e4]">
                <div
                  className="h-full origin-left rounded-full bg-ink"
                  style={{ animation: `ssFill ${2.4 + (p % 3) * 0.5}s ease-in-out ${-p * 0.4}s infinite` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Cell>

      {/* 8 — observability row */}
      <Cell className="flex-row! flex-wrap items-center gap-6 sm:col-span-2 lg:col-span-4">
        <span
          className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white"
          style={{ animation: "ssFloat 5s ease-in-out infinite" }}
        >
          <Activity size={24} className="text-ink" />
        </span>
        <div className="min-w-[240px] flex-1">
          <Title>Observable by default.</Title>
          <Body>Every service I ship has metrics, traces and dashboards before it has users.</Body>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { slug: "prometheus", name: "Prometheus" },
            { slug: "grafana", name: "Grafana" },
            { slug: "opentelemetry", name: "OpenTelemetry" },
          ].map((b) => (
            <span
              key={b.slug}
              className="inline-flex h-10 items-center gap-2 rounded-[14px] bg-white px-3.5 text-[14px] font-medium text-ink"
            >
              <BrandIcon slug={b.slug} size={18} />
              {b.name}
            </span>
          ))}
        </div>
      </Cell>
    </OffscreenGate>
  );
}
