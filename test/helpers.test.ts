import { describe, expect, it, vi } from "vitest";
import { advanceParticle, createRng, edgeFade, type Particle } from "@/components/diagrams/hub-diagram";
import { initialRows, makeRow } from "@/components/diagrams/pipeline-flow";
import { stepState } from "@/components/diagrams/agent-trace";
import { wordState } from "@/components/motion-ui";
import { getBrand, allBrandSlugs } from "@/lib/brands";
import { BRAND_META } from "@/lib/brand-meta";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import manifest from "@/app/manifest";

describe("hub diagram helpers", () => {
  it("createRng is deterministic and within [0, 1)", () => {
    const a = createRng(42);
    const b = createRng(42);
    const seq = Array.from({ length: 50 }, () => a());
    expect(seq).toEqual(Array.from({ length: 50 }, () => b()));
    expect(seq.every((n) => n >= 0 && n < 1)).toBe(true);
  });

  it("edgeFade ramps in, holds, and ramps out", () => {
    expect(edgeFade(0)).toBe(0);
    expect(edgeFade(0.05)).toBeCloseTo(0.5);
    expect(edgeFade(0.5)).toBe(1);
    expect(edgeFade(0.95)).toBeCloseTo(0.5);
  });

  function particle(overrides: Partial<Particle> = {}): Particle {
    const el = { setAttribute: vi.fn(), remove: vi.fn() } as unknown as SVGCircleElement;
    return { el, path: 0, t: 0.2, dur: 1000, reverse: false, side: "l", ...overrides };
  }

  const path = {
    getTotalLength: () => 200,
    getPointAtLength: (l: number) => ({ x: l, y: 1 }),
  } as unknown as SVGPathElement;

  it("advanceParticle moves forward along the path", () => {
    const p = particle();
    const next = advanceParticle(p, 100, path);
    expect(next?.t).toBeCloseTo(0.3);
    expect(p.el.setAttribute).toHaveBeenCalledWith("cx", "60.0");
  });

  it("advanceParticle walks reversed particles from the far end", () => {
    const p = particle({ reverse: true });
    advanceParticle(p, 100, path);
    expect(p.el.setAttribute).toHaveBeenCalledWith("cx", "140.0");
  });

  it("advanceParticle removes arrived or orphaned particles", () => {
    const done = particle({ t: 0.99 });
    expect(advanceParticle(done, 100, path)).toBeNull();
    expect(done.el.remove).toHaveBeenCalled();
    const orphan = particle();
    expect(advanceParticle(orphan, 1, null)).toBeNull();
  });
});

describe("pipeline helpers", () => {
  it("initialRows pre-fills four rows", () => {
    expect(initialRows()).toHaveLength(4);
  });

  it("a redelivered webhook reuses the previous event id (idempotency demo)", () => {
    const prev = makeRow(1, undefined);
    const dup = makeRow(2, prev);
    expect(dup.status).toBe("dup");
    expect(dup.id).toBe(prev.id);
    expect(makeRow(2, undefined).id).toMatch(/^evt_/);
  });
});

describe("state helpers", () => {
  it("stepState marks done / running / pending", () => {
    expect(stepState(0, 2, false)).toBe("done");
    expect(stepState(2, 2, false)).toBe("running");
    expect(stepState(2, 2, true)).toBe("pending");
    expect(stepState(4, 2, false)).toBe("pending");
  });

  it("wordState places words relative to the active index", () => {
    expect(wordState(1, 1, 5)).toBe("active");
    expect(wordState(0, 1, 5)).toBe("prev");
    expect(wordState(3, 1, 5)).toBe("next");
  });
});

describe("brands", () => {
  it("every brand has a path and matching meta", () => {
    for (const slug of allBrandSlugs()) {
      expect(getBrand(slug)?.path.length).toBeGreaterThan(10);
      expect(BRAND_META[slug]?.hex).toMatch(/^[0-9A-F]{6}$/i);
    }
    expect(getBrand("not-a-brand")).toBeUndefined();
  });
});

describe("metadata routes", () => {
  it("robots allows everything and links the sitemap", () => {
    const r = robots();
    expect(r.sitemap).toBe("https://sauravsharma.info/sitemap.xml");
  });

  it("sitemap lists the home page first", () => {
    expect(sitemap()[0].url).toBe("https://sauravsharma.info/");
  });

  it("manifest is installable", () => {
    const m = manifest();
    expect(m.start_url).toBe("/");
    expect(m.icons?.length).toBeGreaterThan(0);
  });
});
