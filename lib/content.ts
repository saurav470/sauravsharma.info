/** Single source of truth for everything written on the site. Keep in sync with the résumé. */

export const SITE = {
  name: "Saurav Sharma",
  url: "https://sauravsharma.info",
  role: "Software Engineer (SDE)",
  tagline: "Backend, distributed systems and production GenAI.",
  email: "sauravsharma3001@gmail.com",
  github: "https://github.com/saurav470",
  githubHandle: "saurav470",
  linkedin: "https://www.linkedin.com/in/saurav-kumar-sharma-sks/",
  linkedinHandle: "saurav-kumar-sharma-sks",
  resume: "/Saurav_Sharma_Resume.pdf",
  location: "Delhi NCR, India",
  notice: "15-day notice",
  description:
    "Saurav Sharma — Software Engineer (SDE) building Python, Go and Node.js microservices, Kafka pipelines, real-time systems and production GenAI (RAG, LangGraph agents, MCP). 3 years, 99.9% uptime.",
} as const;

export const NAV = [
  { href: "#work", label: "Work" },
  { href: "#numbers", label: "Impact" },
  { href: "#stack", label: "Stack" },
  { href: "#experience", label: "Experience" },
  { href: "#faq", label: "FAQ" },
] as const;

export interface RoleWord {
  label: string;
  icon: string; // simple-icons slug or lucide key
  bg: string;
  fg: string;
  rotate: number;
  /** Width of tile + label in em (measured in Geist 600). Used to shrink long words on narrow phones. */
  fit: number;
}

// Keep these SHORT (≤ ~6.5em incl. tile) so they fit a 360px phone at full size, like vidyst's hero.
export const ROLE_WORDS: RoleWord[] = [
  { label: "backends", icon: "apachekafka", bg: "#111111", fg: "#fff", rotate: -6, fit: 5.7 },
  { label: "AI agents", icon: "langchain", bg: "#8B7BFF", fg: "#fff", rotate: 5, fit: 5.5 },
  { label: "Go services", icon: "go", bg: "#00ADD8", fg: "#fff", rotate: -4, fit: 6.5 },
  { label: "web apps", icon: "nextdotjs", bg: "#F5C542", fg: "#111", rotate: 6, fit: 5.6 },
  { label: "APIs", icon: "fastapi", bg: "#63d94e", fg: "#111", rotate: -5, fit: 3.4 },
];

export interface Job {
  company: string;
  title: string;
  place: string;
  start: string;
  end: string;
  latest?: boolean;
  summary: string;
  highlights: string[];
}

export const EXPERIENCE: Job[] = [
  {
    company: "Devkraft",
    title: "Software Development Engineer",
    place: "Gurugram, India",
    start: "Jun 2024",
    end: "Present",
    latest: true,
    summary:
      "Building and operating a 20+ service platform: Python, Go and Node.js microservices, Kafka pipelines, real-time infrastructure and production GenAI — on Kubernetes at 99.9% uptime.",
    highlights: [
      "Python microservices (FastAPI, Django REST) and Go services (net/http, Gin) handling 50K+ requests/day across 20+ services.",
      "Fault-tolerant Kafka + Celery/RQ pipelines at 500K+ messages/hour — backpressure, retries with backoff, idempotent handlers safe under redelivery.",
      "Migrated inter-service calls from REST to gRPC with deadline propagation, cutting p99 latency ~40% with zero-downtime rollouts.",
      "Real-time WebSocket infrastructure (Redis Pub/Sub) sustaining 10K+ concurrent connections.",
      "Cut database latency 65% via PostgreSQL/MongoDB indexing, ORM N+1 fixes and schema work.",
      "RAG pipelines (LangChain, pgvector) and LangGraph agents with MCP tool-calling; prompt optimisation + caching cut inference cost 40%.",
      "HLS adaptive-bitrate streaming (FFmpeg, CloudFront) — 60% less buffering.",
      "Next.js / React (TypeScript, SSR/SSG) apps for 50K+ daily users; Docker + Kubernetes with Prometheus, Grafana, OpenTelemetry — 70% faster incident recovery.",
    ],
  },
  {
    company: "Alyssum Global Services",
    title: "Software Engineer Intern",
    place: "Remote",
    start: "Aug 2023",
    end: "Mar 2024",
    summary: "Shipped REST APIs on AWS and the CI/CD that deploys them.",
    highlights: [
      "REST APIs (FastAPI, Node.js/Express, Go/Gin) on AWS Lambda and EC2 with JWT auth — 45% faster responses.",
      "CI/CD with GitHub Actions + Docker cut deployment cycles 40%; Terraform + CloudWatch sped up incident response 35%.",
    ],
  },
  {
    company: "NSUT East Campus, Delhi",
    title: "B.Tech, Electronics & Communication",
    place: "CGPA 8.3 / 10",
    start: "Aug 2019",
    end: "Jul 2023",
    summary: "Microsoft Ideathon '21 — Top 8 in India. HackNSUT — Top 10 of 300+. HackTheLeague (IIT) — Top 50 of 1000+.",
    highlights: [],
  },
];

export interface StackItem {
  slug: string;
  name: string;
}

export const STACK_ROWS: StackItem[][] = [
  [
    { slug: "python", name: "Python" },
    { slug: "fastapi", name: "FastAPI" },
    { slug: "django", name: "Django" },
    { slug: "go", name: "Go" },
    { slug: "nodedotjs", name: "Node.js" },
    { slug: "nestjs", name: "NestJS" },
    { slug: "typescript", name: "TypeScript" },
    { slug: "react", name: "React" },
    { slug: "nextdotjs", name: "Next.js" },
    { slug: "graphql", name: "GraphQL" },
    { slug: "socketdotio", name: "WebSockets" },
  ],
  [
    { slug: "postgresql", name: "PostgreSQL" },
    { slug: "redis", name: "Redis" },
    { slug: "mongodb", name: "MongoDB" },
    { slug: "apachekafka", name: "Kafka" },
    { slug: "rabbitmq", name: "RabbitMQ" },
    { slug: "celery", name: "Celery" },
    { slug: "docker", name: "Docker" },
    { slug: "kubernetes", name: "Kubernetes" },
    { slug: "helm", name: "Helm" },
    { slug: "githubactions", name: "GitHub Actions" },
    { slug: "terraform", name: "Terraform" },
  ],
  [
    { slug: "langchain", name: "LangChain" },
    { slug: "langgraph", name: "LangGraph" },
    { slug: "claude", name: "Claude" },
    { slug: "googlegemini", name: "Gemini" },
    { slug: "huggingface", name: "Hugging Face" },
    { slug: "prometheus", name: "Prometheus" },
    { slug: "grafana", name: "Grafana" },
    { slug: "opentelemetry", name: "OpenTelemetry" },
    { slug: "nginx", name: "nginx" },
    { slug: "ffmpeg", name: "FFmpeg" },
  ],
];

export interface Project {
  name: string;
  kind: string;
  blurb: string;
  points: string[];
  tags: string[];
  href?: string;
}

export const PROJECTS: Project[] = [
  {
    name: "Medical AI Platform",
    kind: "Devkraft · production",
    blurb: "Real-time diagnostic assistant: video consults with an AI agent working alongside the doctor.",
    points: [
      "Agentic platform behind an API gateway with circuit breakers and health checks",
      "Patient-record RAG with hybrid search (BM25 + vector) and reranking",
      "Go WebRTC signaling — doctor handoff under 200ms",
      "Next.js doctor & patient portals on Django REST + FastAPI",
    ],
    tags: ["LangGraph", "MCP", "RAG", "Go", "Next.js"],
  },
  {
    name: "Transcendify",
    kind: "Personal",
    blurb: "Distributed video-transcoding queue that turns uploads into adaptive HLS streams.",
    points: [
      "Python workers on Celery + Redis handling 1,000+ videos/day",
      "FFmpeg HLS ladders (1080p / 720p / 480p) served via S3 + CloudFront",
      "Sub-500ms enqueue latency",
    ],
    tags: ["Python", "Celery", "Redis", "FFmpeg", "AWS"],
    href: "https://github.com/saurav470",
  },
  {
    name: "This website",
    kind: "Self-hosted",
    blurb: "Next.js static export on my own Oracle Cloud ARM VM — no Vercel.",
    points: [
      "nginx + Let's Encrypt TLS, UFW + fail2ban hardened host",
      "Docker Compose stacks, Authelia SSO, self-hosted Headscale VPN",
      "Encrypted nightly restic backups with push alerts",
    ],
    tags: ["Next.js", "nginx", "Linux", "Docker"],
    href: "https://github.com/saurav470",
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "What roles are you looking for?",
    a: "Software Engineer / SDE-1 or SDE-2 roles in backend, full-stack or GenAI engineering — anywhere distributed systems and production reliability matter.",
  },
  {
    q: "What is your notice period?",
    a: "15 days. I can start quickly.",
  },
  {
    q: "Where are you based?",
    a: "Delhi NCR, India. Happy with on-site in Delhi/Gurugram, hybrid, or fully remote.",
  },
  {
    q: "What's your strongest stack?",
    a: "Python (FastAPI, Django) and Node.js (NestJS) on PostgreSQL, Redis and Kafka, with Go for high-throughput services and React/Next.js on the front. For GenAI: LangChain, LangGraph, MCP and RAG with pgvector.",
  },
  {
    q: "Can I see code?",
    a: "Yes — github.com/saurav470. Production work at Devkraft is private, but I'm happy to walk through architecture, trade-offs and incidents in an interview.",
  },
  {
    q: "How do I reach you fastest?",
    a: "Email sauravsharma3001@gmail.com or message me on LinkedIn. I usually reply the same day.",
  },
];
