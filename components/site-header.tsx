"use client";

import { useEffect, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { NAV, SITE } from "@/lib/content";
import { MotionToggle } from "./motion-ui";
import { ThemeToggle } from "./theme-toggle";

/** Brand mark. Inverts with the theme unless `fixed` (e.g. inside an always-dark hub). */
export function Logo({ size = 24, fixed = false }: Readonly<{ size?: number; fixed?: boolean }>) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" className="shrink-0">
      <rect width="64" height="64" rx="16" className={fixed ? "fill-[#111]" : "fill-ink"} />
      <path
        d="M41.5 21.5c-2-3-5.4-4.5-9.6-4.5-5.6 0-9.4 3-9.4 7.4 0 9.6 19.3 5.6 19.3 15.4 0 4.8-4.2 8.2-10.2 8.2-4.6 0-8.4-1.9-10.6-5.4"
        fill="none"
        className={fixed ? "stroke-[#fff]" : "stroke-white"}
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <circle cx="47" cy="47" r="5" fill="#F5C542" />
    </svg>
  );
}

export function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  // Morph the CTA from a grey chip to the dark pill once the hero CTA scrolls away.
  useEffect(() => {
    const target = document.getElementById("hero-cta");
    if (!target) return;
    const io = new IntersectionObserver(([e]) => setSolid(!e.isIntersecting), { rootMargin: "-60px 0px 0px 0px" });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-line-soft bg-white/88 backdrop-blur-[14px] backdrop-saturate-[1.4]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <nav className="mx-auto flex h-15 max-w-[1240px] items-center gap-4 px-6 sm:gap-6" aria-label="Main">
        <a href="#top" className="flex items-center gap-[9px] text-[18px] font-semibold tracking-[-0.4px] whitespace-nowrap text-ink">
          <Logo />
          {SITE.name}
        </a>
        <ul className="hidden items-center gap-[22px] lg:flex">
          {NAV.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-[14px] text-body transition-colors hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden xl:block">
            <MotionToggle />
          </div>
          <ThemeToggle className="max-sm:hidden" />
          <a
            href={SITE.resume}
            download=""
            aria-label="Download résumé"
            className={`inline-flex h-9 items-center justify-center gap-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-colors duration-300 max-sm:w-9 sm:px-4 ${
              solid ? "bg-ink text-white hover:bg-ink-2" : "bg-chip text-ink hover:bg-line-soft"
            }`}
          >
            <Download size={15} className={solid ? "" : "sm:hidden"} />
            <span className="max-sm:hidden">{solid ? "Download résumé" : "Résumé"}</span>
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex size-9 items-center justify-center rounded-full bg-chip text-ink lg:hidden"
          >
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </nav>
      {open ? (
        <div className="absolute inset-x-3 top-[64px] rounded-[20px] bg-white p-2 shadow-[0_0_0_1px_var(--color-line),0_24px_48px_-24px_rgba(0,0,0,.3)] lg:hidden">
          {NAV.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex h-12 items-center rounded-xl px-4 text-[16px] font-medium text-ink hover:bg-surface-2"
            >
              {l.label}
            </a>
          ))}
          <div className="flex items-center gap-2 px-2 pt-2 pb-1">
            <MotionToggle />
            <ThemeToggle />
          </div>
        </div>
      ) : null}
    </header>
  );
}
