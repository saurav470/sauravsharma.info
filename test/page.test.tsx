import { act, fireEvent, render, renderHook, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { useMotionReady } from "@/lib/motion";
import Home from "@/app/page";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/sections";
import { BrandSprite } from "@/components/brand-sprite";
import { FAQS, EXPERIENCE } from "@/lib/content";
import { observerState } from "./setup";

/** Run the animation loops (rAF + timers) for `ms` of simulated time. */
function runFor(ms: number): void {
  for (let t = 0; t < ms; t += 16) {
    act(() => {
      vi.advanceTimersByTime(16);
    });
  }
}

// Let the one-time "page loaded + idle" gate fire on real timers before faking the clock.
beforeAll(async () => {
  const { result } = renderHook(() => useMotionReady());
  await waitFor(() => expect(result.current).toBe(true));
});

describe("home page", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "setInterval", "requestAnimationFrame", "performance", "Date"] });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the hero, sections and recruiter details", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/I build/);
    for (const id of ["work", "numbers", "stack", "experience", "faq"]) {
      expect(document.getElementById(id)).not.toBeNull();
    }
    for (const job of EXPERIENCE) expect(screen.getByText(job.company)).toBeInTheDocument();
    for (const f of FAQS) expect(screen.getByText(f.q)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Download résumé/ })[0]).toHaveAttribute(
      "href",
      "/Saurav_Sharma_Resume.pdf",
    );
  });

  it("animates the pipeline, agent trace and hub diagrams over time", () => {
    const { container } = render(<Home />);
    const firstEventIds = [...container.querySelectorAll(".row-in")].map((r) => r.textContent);

    // Agent trace: 5 steps (~4.3s) then the answer types out (~3.4s) and citations appear.
    runFor(8_500);
    expect(screen.getAllByText(/visit_2026-09-28\.pdf/).length).toBeGreaterThan(0);

    // Pipeline kept consuming events: the visible log rolled forward.
    const laterEventIds = [...container.querySelectorAll(".row-in")].map((r) => r.textContent);
    expect(laterEventIds).not.toEqual(firstEventIds);

    // Hub diagrams spawned particles into their SVG layers.
    expect(container.querySelectorAll("svg g circle").length).toBeGreaterThan(0);

    // After the hold, the agent run restarts from the skeleton state.
    runFor(4_000);
    expect(screen.queryAllByText(/visit_2026-09-28\.pdf/)).toHaveLength(0);
  });

  it("pauses everything from the motion toggle", () => {
    render(<Home />);
    const toggle = screen.getByRole("button", { name: /Pause animations/ });
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: /Play animations/ })).toBeInTheDocument();
    expect(document.documentElement.dataset.motion).toBe("paused");
    fireEvent.click(screen.getByRole("button", { name: /Play animations/ }));
    expect(document.documentElement.dataset.motion).toBeUndefined();
  });
});

describe("chrome", () => {
  it("header opens and closes the mobile menu", () => {
    render(<SiteHeader />);
    const btn = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(btn);
    const close = screen.getByRole("button", { name: "Close menu" });
    expect(close).toHaveAttribute("aria-expanded", "true");
    const menuLinks = screen.getAllByRole("link", { name: "Work" });
    fireEvent.click(menuLinks[menuLinks.length - 1]);
    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
  });

  it("header CTA turns into the dark download pill after the hero scrolls away", () => {
    observerState.intersecting = false;
    render(
      <>
        <div id="hero-cta" />
        <SiteHeader />
      </>,
    );
    const header = screen.getByRole("banner");
    expect(within(header).getAllByText(/Download résumé|Résumé/).length).toBeGreaterThan(0);
  });

  it("footer links out and shows the wordmark", () => {
    render(<SiteFooter />);
    for (const link of screen.getAllByRole("link", { name: "GitHub" })) {
      expect(link).toHaveAttribute("href", "https://github.com/saurav470");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
    expect(screen.getByText("saurav sharma")).toBeInTheDocument();
  });

  it("brand sprite defines a symbol per brand", () => {
    const { container } = render(<BrandSprite />);
    expect(container.querySelectorAll("symbol").length).toBeGreaterThan(30);
  });

  it("off-screen sections get the pause attribute", () => {
    observerState.intersecting = false;
    const { container } = render(<Home />);
    expect(container.querySelectorAll("[data-offscreen]").length).toBeGreaterThan(0);
  });
});
