import { ArrowUpRight, FileText, Mail, Plus } from "lucide-react";
import { EXPERIENCE, FAQS, PROJECTS, SITE, STACK_ROWS } from "@/lib/content";
import { BrandIcon, ButtonLink, Tag } from "./ui";
import { HubDiagram } from "./diagrams/hub-diagram";
import { LiveClock, OffscreenGate } from "./motion-ui";
import { Logo } from "./site-header";

/* ───────────── Stack marquee ───────────── */

export function StackMarquee() {
  return (
    <OffscreenGate className="mask-x flex flex-col gap-3 overflow-hidden">
      {STACK_ROWS.map((row, r) => (
        <ul
          key={row[0].slug}
          className={`marquee flex w-max gap-3 ${r % 2 ? "marquee-reverse" : ""}`}
          style={{ ["--marquee-duration" as string]: `${54 + r * 9}s` }}
        >
          {[...row, ...row].map((s, i) => (
            <li
              key={`${s.slug}-${i}`}
              aria-hidden={i >= row.length}
              className="flex h-14 items-center gap-2.5 rounded-2xl bg-surface-2 px-5 text-[16px] font-semibold tracking-[-0.01em] whitespace-nowrap text-ink"
            >
              <BrandIcon slug={s.slug} size={22} />
              {s.name}
            </li>
          ))}
        </ul>
      ))}
    </OffscreenGate>
  );
}

/* ───────────── Projects ───────────── */

export function ProjectGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {PROJECTS.map((p) => (
        <article key={p.name} className="group relative flex flex-col rounded-[24px] bg-surface-2 p-7">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] font-medium text-subtle">{p.kind}</span>
            {p.href ? (
              <ArrowUpRight
                size={18}
                className="text-faint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
              />
            ) : null}
          </div>
          <h3 className="mt-3 text-[22px] leading-[1.2] font-semibold tracking-[-0.02em] text-ink">
            {p.href ? (
              <a href={p.href} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0">
                {p.name}
              </a>
            ) : (
              p.name
            )}
          </h3>
          <p className="mt-2 text-[15px] leading-[1.5] text-muted">{p.blurb}</p>
          <ul className="mt-5 flex flex-col gap-2 border-t border-line pt-5">
            {p.points.map((pt) => (
              <li key={pt} className="flex gap-2.5 text-[14px] leading-[1.45] text-ink-2">
                <span className="mt-[7px] size-[5px] shrink-0 rounded-full bg-ink" />
                {pt}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
            {p.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

/* ───────────── Experience timeline (changelog style) ───────────── */

export function ExperienceTimeline() {
  return (
    <ol className="relative">
      {EXPERIENCE.map((job, i) => (
        <li key={job.company} className="flex gap-7 pb-20 last:pb-0">
          <div className="relative w-[14px] shrink-0">
            <span
              className={`absolute top-[14px] left-1.5 w-px bg-line ${i === EXPERIENCE.length - 1 ? "h-0" : "-bottom-20"}`}
            />
            {job.latest ? (
              <span className="absolute top-[9px] left-0 size-[13px] rounded-full bg-live shadow-[0_0_0_5px_#fde4e6] dark:shadow-[0_0_0_5px_#f4525f33]" />
            ) : (
              <span className="absolute top-[11px] left-[2px] size-[9px] rounded-full border border-ink bg-white" />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-wrap gap-x-12 gap-y-3">
            <div className="w-[190px] shrink-0 md:sticky md:top-24 md:self-start">
              <div className="flex items-center gap-2 font-mono text-[13px] text-ink">
                {job.start} — {job.end}
                {job.latest ? (
                  <span className="rounded-full bg-ink px-2 py-0.5 text-[10.5px] font-semibold tracking-[.03em] text-white">
                    NOW
                  </span>
                ) : null}
              </div>
              <div className="mt-1 text-[14px] text-subtle">{job.place}</div>
            </div>
            <article className="min-w-[260px] flex-1">
              <h3 className="text-[clamp(24px,3vw,34px)] leading-[1.15] font-semibold tracking-[-0.03em] text-ink">
                {job.company}
              </h3>
              <p className="mt-1 text-[16px] font-medium text-ink-2">{job.title}</p>
              <p className="mt-3 text-[17px] leading-[1.55] text-muted">{job.summary}</p>
              {job.highlights.length ? (
                <details className="group mt-5" open={job.latest}>
                  <summary className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-chip px-3.5 text-[13px] font-medium text-ink hover:bg-line-soft">
                    <Plus size={14} className="transition-transform duration-300 group-open:rotate-45" />
                    <span className="group-open:hidden">Show full notes</span>
                    <span className="hidden group-open:inline">Hide notes</span>
                  </summary>
                  <ul className="mt-5 flex flex-col gap-3">
                    {job.highlights.map((h) => (
                      <li key={h} className="flex gap-3 text-[15.5px] leading-[1.55] text-ink-2">
                        <span className="mt-[9px] size-[5px] shrink-0 rounded-full bg-ink" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </details>
              ) : null}
            </article>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ───────────── FAQ (exclusive <details> accordion) ───────────── */

export function FaqList() {
  return (
    <div className="flex flex-col gap-2">
      {FAQS.map((f, i) => (
        <details
          key={f.q}
          name="faq"
          className="group rounded-[20px] bg-surface-2 transition-[background,box-shadow] duration-300 open:bg-white open:shadow-[0_0_0_1px_var(--color-line),0_18px_40px_-24px_rgba(0,0,0,.25)]"
          open={i === 0}
        >
          <summary className="flex cursor-pointer items-center gap-4 px-5 py-5 sm:px-6">
            <span className="w-6 font-mono text-[13px] text-subtle">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex-1 text-[17px] font-medium text-ink sm:text-[18px]">{f.q}</span>
            <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-white text-ink transition-[transform,background,color] duration-300 [transition-timing-function:cubic-bezier(.34,1.4,.64,1)] group-open:rotate-45 group-open:bg-ink group-open:text-white">
              <Plus size={16} />
            </span>
          </summary>
          <p className="pr-6 pb-6 pl-[64px] text-[16px] leading-[1.6] text-muted sm:pr-[72px] sm:pl-[66px]">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/* ───────────── Closing CTA band ───────────── */

export function CtaBand() {
  return (
    <div className="rounded-[32px] bg-surface-2 px-6 pt-20 pb-[72px] text-center sm:pt-24 sm:pb-[88px]">
      <h2 className="mx-auto max-w-[900px] text-[clamp(34px,5.8vw,80px)] leading-[1.1] font-semibold tracking-[-0.04em] text-balance text-ink">
        Let&apos;s build something
        <br />
        <span className="text-faint">that stays up.</span>
      </h2>
      <div className="mx-auto mt-10 max-w-[1000px]">
        <HubDiagram
          className="h-[300px]! max-sm:h-[260px]!"
          mode="out"
          hub={<Logo size={58} fixed />}
          hubBadge={
            <div className="flex h-8 items-center gap-2 rounded-full bg-ink px-3 text-[12px] whitespace-nowrap text-white">
              <span className="size-[7px] rounded-full bg-ok" />
              <span className="font-semibold tracking-[0.06em]">OPEN TO WORK</span>
              <LiveClock className="text-white/70" />
            </div>
          }
          left={[
            { title: "Email", meta: "replies same day", icon: <Mail size={18} />, color: "#EA4335", href: `mailto:${SITE.email}` },
            { title: "LinkedIn", meta: SITE.linkedinHandle, slug: "linkedin", color: "#0A66C2", href: SITE.linkedin },
          ]}
          right={[
            { title: "GitHub", meta: `@${SITE.githubHandle}`, slug: "github", color: "#181717", href: SITE.github },
            { title: "Résumé", meta: "PDF · updated Nov 2026", icon: <FileText size={18} />, color: "#F5C542", href: SITE.resume },
          ]}
        />
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href={`mailto:${SITE.email}`} icon={<Mail size={17} />}>
          Email me
        </ButtonLink>
        <ButtonLink href={SITE.resume} variant="outline" download icon={<FileText size={17} />}>
          Download résumé
        </ButtonLink>
      </div>
      <p className="mt-4 text-[14px] text-subtle">
        {SITE.location} · {SITE.notice} · open to remote
      </p>
    </div>
  );
}

/* ───────────── Footer ───────────── */

export function SiteFooter() {
  const cols = [
    {
      title: "Site",
      links: [
        { label: "Work", href: "#work" },
        { label: "Impact", href: "#numbers" },
        { label: "Experience", href: "#experience" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Elsewhere",
      links: [
        { label: "GitHub", href: SITE.github },
        { label: "LinkedIn", href: SITE.linkedin },
        { label: "Email", href: `mailto:${SITE.email}` },
      ],
    },
    {
      title: "Résumé",
      links: [{ label: "Download PDF", href: SITE.resume }],
    },
  ];
  return (
    <footer className="pt-[120px] pb-10">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 border-b border-line-soft pb-14 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 text-[20px] font-semibold tracking-[-0.4px] text-ink">
              <Logo size={28} />
              {SITE.name}
            </div>
            <p className="mt-3 max-w-[300px] text-[15px] leading-[1.5] text-muted">
              {SITE.role}. {SITE.tagline}
            </p>
            <p className="mt-5 font-mono text-[12px] text-quiet">
              Next.js static export · self-hosted on Oracle Cloud ARM · nginx + Let&apos;s Encrypt
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="mb-3 text-[13px] font-semibold text-ink">{c.title}</div>
              <ul className="flex flex-col gap-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-[14px] text-body transition-colors hover:text-ink"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 text-[13px] text-quiet">
          <span>© {new Date().getFullYear()} {SITE.name}</span>
          <div className="flex gap-2">
            {[
              { slug: "github", href: SITE.github, label: "GitHub" },
              { slug: "linkedin", href: SITE.linkedin, label: "LinkedIn" },
            ].map((s) => (
              <a
                key={s.slug}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex size-9 items-center justify-center rounded-full bg-chip hover:bg-line-soft"
              >
                <BrandIcon slug={s.slug} size={15} color="#111" />
              </a>
            ))}
          </div>
        </div>
        <div
          aria-hidden="true"
          className="mt-10 bg-[linear-gradient(180deg,var(--color-wordmark),var(--color-page))] bg-clip-text text-center text-[clamp(48px,12.2vw,176px)] leading-[.8] font-bold tracking-[-0.06em] whitespace-nowrap text-transparent select-none"
        >
          saurav sharma
        </div>
      </div>
    </footer>
  );
}
