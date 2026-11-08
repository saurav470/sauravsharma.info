import { Suspense, type ReactNode } from "react";
import {
  ArrowRight,
  Bot,
  Database,
  FileText,
  GitBranch,
  Layers,
  Network,
  RefreshCw,
  ShieldCheck,
  Timer,
  Workflow,
} from "lucide-react";
import { ROLE_WORDS, SITE } from "@/lib/content";
import { ButtonLink, Chip, Container, Display, Eyebrow, Lead, PulseDot, Section, Stage } from "@/components/ui";
import { LiveClock, MotionToggle, Reveal, RotatingWord } from "@/components/motion-ui";
import { HubDiagram } from "@/components/diagrams/hub-diagram";
import { PipelineFlow } from "@/components/diagrams/pipeline-flow";
import { AgentTrace } from "@/components/diagrams/agent-trace";
import { Bento } from "@/components/bento";
import { CtaBand, ExperienceTimeline, FaqList, ProjectGrid, StackMarquee } from "@/components/sections";

interface Feature {
  icon: ReactNode;
  title: string;
  body: string;
}

function FeatureRow({ items }: Readonly<{ items: Feature[] }>) {
  return (
    <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-8 text-left">
      {items.map((f) => (
        <div key={f.title} className="border-t border-line pt-5">
          <span className="text-ink [&>svg]:size-[22px]">{f.icon}</span>
          <h3 className="mt-3 text-[18px] font-semibold tracking-[-0.01em] text-ink">{f.title}</h3>
          <p className="mt-1.5 text-[15px] leading-[1.5] text-muted">{f.body}</p>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main id="main" className="overflow-x-clip">
      {/* ───────── Hero ───────── */}
      <section id="top" className="pt-[72px] text-center sm:pt-[100px]">
        <Container>
          <a
            href="#faq"
            className="inline-flex h-[34px] items-center gap-2.5 rounded-full border border-[#ececec] bg-white pr-1.5 pl-3.5 text-[13px] text-ink-2"
          >
            <PulseDot color="#63d94e" size={6} />
            Open to SDE roles · {SITE.notice}
            <span className="inline-flex h-6 items-center gap-1 rounded-full bg-surface-2 px-2.5 text-[12px] font-medium text-ink">
              Details <ArrowRight size={12} />
            </span>
          </a>

          <h1 className="mx-auto mt-7 max-w-[1100px] text-[clamp(44px,6.8vw,96px)] leading-[1.06] font-semibold tracking-[-0.045em] text-balance text-ink">
            I build
            <br />
            <RotatingWord items={ROLE_WORDS} />
            <br />
            <span className="bg-[linear-gradient(180deg,#111_0%,#111_25%,#c9c9c9_100%)] bg-clip-text pb-[.08em] text-transparent">
              that hold up in production.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-[600px] text-[19px] leading-[1.5] text-pretty text-muted sm:text-[20px]">
            I&apos;m Saurav — a software engineer with 3 years shipping Python, Go and Node.js microservices, Kafka
            pipelines and production GenAI (RAG, LangGraph agents, MCP) at 99.9% uptime.
          </p>

          <div id="hero-cta" className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink href={SITE.resume} download icon={<FileText size={17} />}>
              Download résumé
            </ButtonLink>
            <ButtonLink href="#work" variant="chip">
              See my work
            </ButtonLink>
          </div>
          <p className="mt-4 text-[14px] text-subtle">
            SDE at Devkraft · {SITE.location} · B.Tech NSUT
          </p>
        </Container>
      </section>

      {/* ───────── System frame ───────── */}
      <section className="pt-[72px]">
        <Container>
          <Reveal>
            <Stage className="px-[clamp(10px,3vw,40px)] pt-8 pb-6">
              <Suspense>
              <HubDiagram
                mode="through"
                hub={<Network size={44} color="#fff" strokeWidth={1.6} />}
                hubBadge={
                  <div className="flex h-8 items-center gap-2 rounded-full bg-ink px-3 text-[12px] whitespace-nowrap text-white">
                    <span className="size-[7px] rounded-full bg-live" />
                    <span className="font-semibold tracking-[0.06em]">GATEWAY</span>
                    <LiveClock className="text-[#bbb]" />
                  </div>
                }
                left={[
                  { title: "Doctor portal", meta: "Next.js · SSR", slug: "nextdotjs", color: "#111111" },
                  { title: "Video consults", meta: "WebRTC · Go signaling", slug: "webrtc", color: "#F0504A" },
                  { title: "Partner webhooks", meta: "REST · gRPC", slug: "fastapi", color: "#009688" },
                ]}
                right={[
                  { title: "AI agents", meta: "LangGraph · MCP", slug: "langgraph", color: "#8B7BFF" },
                  { title: "Event workers", meta: "Kafka · Celery", slug: "apachekafka", color: "#231F20" },
                  { title: "Data", meta: "Postgres · Redis", slug: "postgresql", color: "#4169E1" },
                ]}
              />
              </Suspense>
              <p className="mt-4 text-center font-mono text-[12px] text-quiet">
                simulated traffic · the shape of the platform I build and run at Devkraft
              </p>
            </Stage>
          </Reveal>
        </Container>
      </section>

      {/* ───────── Work: pipelines ───────── */}
      <Section id="work">
        <Container className="text-center">
          <Eyebrow>Event pipelines</Eyebrow>
          <Display className="mt-2.5" first="500K messages an hour." second="None processed twice." />
          <Lead className="mx-auto mt-6 max-w-[640px]">
            Kafka and Celery workers that survive redelivery, partial failure and traffic spikes. Every handler is
            idempotent, every retry backs off, and backpressure keeps consumers from drowning.
          </Lead>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <Chip icon={<ShieldCheck size={16} />}>Idempotency keys</Chip>
            <Chip icon={<RefreshCw size={16} />}>Retries + backoff</Chip>
            <Chip icon={<Timer size={16} />}>Backpressure</Chip>
            <Chip icon={<GitBranch size={16} />}>Dead-letter queues</Chip>
          </div>
          <Reveal className="mt-14">
            <Suspense>
              <PipelineFlow />
            </Suspense>
          </Reveal>
          <FeatureRow
            items={[
              { icon: <Layers />, title: "Partitioned for scale", body: "Keyed partitions keep per-entity order while consumers scale out." },
              { icon: <ShieldCheck />, title: "Safe under redelivery", body: "At-least-once delivery, exactly-once effects via idempotent writes." },
              { icon: <RefreshCw />, title: "Fails gracefully", body: "Exponential backoff, DLQs and alerts instead of silent data loss." },
              { icon: <Database />, title: "Fast reads", body: "Indexing and N+1 fixes cut database latency by 65%." },
            ]}
          />
        </Container>
      </Section>

      {/* ───────── Work: agents ───────── */}
      <Section>
        <Container className="text-center">
          <Eyebrow>Production GenAI</Eyebrow>
          <Display className="mt-2.5" first="Agents that call tools," second="and cite their sources." />
          <Lead className="mx-auto mt-6 max-w-[660px]">
            On a real-time medical platform, LangGraph agents plan, call MCP tool servers and ground every answer in
            patient records through hybrid RAG — behind a gateway with circuit breakers, so a slow model never breaks
            a consultation.
          </Lead>
          <Reveal className="mt-14 text-left">
            <Suspense>
              <AgentTrace />
            </Suspense>
          </Reveal>
          <FeatureRow
            items={[
              { icon: <Workflow />, title: "LangGraph orchestration", body: "Stateful agent graphs with planning, tool use and retries." },
              { icon: <Bot />, title: "MCP tool servers", body: "Typed tools for records, drugs and scheduling — reusable by any agent." },
              { icon: <Database />, title: "Hybrid RAG", body: "BM25 + vector search (pgvector) with reranking to cut hallucinations." },
              { icon: <Timer />, title: "40% cheaper inference", body: "Prompt optimisation and caching, tracked on Grafana cost dashboards." },
            ]}
          />
        </Container>
      </Section>

      {/* ───────── Projects ───────── */}
      <Section>
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>Selected projects</Eyebrow>
              <Display className="mt-2.5" size="split" first="Things I've shipped." second="End to end." />
            </div>
            <ButtonLink href={SITE.github} external variant="chip" size="md" icon={<ArrowRight size={16} />}>
              GitHub
            </ButtonLink>
          </div>
          <Reveal className="mt-12">
            <ProjectGrid />
          </Reveal>
        </Container>
      </Section>

      {/* ───────── Numbers ───────── */}
      <Section id="numbers">
        <Container>
          <div className="text-center">
            <Eyebrow>Impact</Eyebrow>
            <Display className="mt-2.5" first="Measured in production," second="not in slides." />
          </div>
          <Reveal className="mt-14">
            <Suspense>
              <Bento />
            </Suspense>
          </Reveal>
        </Container>
      </Section>

      {/* ───────── Stack ───────── */}
      <Section id="stack">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>Stack</Eyebrow>
              <Display className="mt-2.5" size="split" first="Tools I ship with." second="Picked per problem." />
            </div>
            <MotionToggle />
          </div>
        </Container>
        <div className="mx-auto mt-12 max-w-[1440px]">
          <Suspense>
            <StackMarquee />
          </Suspense>
        </div>
      </Section>

      {/* ───────── Experience ───────── */}
      <Section id="experience">
        <Container size="narrow">
          <Eyebrow>Experience</Eyebrow>
          <Display className="mt-2.5" size="split" first="Where I've worked." second="What I shipped there." />
          <div className="mt-14">
            <ExperienceTimeline />
          </div>
        </Container>
      </Section>

      {/* ───────── FAQ ───────── */}
      <Section id="faq">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-16">
            <div className="lg:sticky lg:top-[110px] lg:self-start">
              <Eyebrow>For recruiters</Eyebrow>
              <Display className="mt-2.5" size="split" first="Questions." />
              <Lead className="mt-5">The things people usually ask before the first call.</Lead>
              <div className="mt-8 rounded-[20px] bg-surface-2 p-5">
                <p className="text-[15px] font-medium text-ink">Prefer to just talk?</p>
                <p className="mt-1 text-[14px] text-muted">{SITE.email}</p>
                <ButtonLink href={`mailto:${SITE.email}`} size="sm" className="mt-4">
                  Email me
                </ButtonLink>
              </div>
            </div>
            <FaqList />
          </div>
        </Container>
      </Section>

      {/* ───────── CTA ───────── */}
      <Section>
        <Container>
          <Reveal>
            <Suspense>
              <CtaBand />
            </Suspense>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
