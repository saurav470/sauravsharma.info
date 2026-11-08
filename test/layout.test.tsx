import { isValidElement, type ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans", className: "geist" }),
  Geist_Mono: () => ({ variable: "--font-geist-mono", className: "geist-mono" }),
}));

describe("root layout", () => {
  it("exports SEO metadata and renders html > body", async () => {
    const mod = await import("@/app/layout");
    expect(String(mod.metadata.title)).toContain("Saurav Sharma");
    expect(mod.metadata.openGraph).toBeDefined();
    const el = mod.default({ children: <main /> } as never) as ReactElement<{ lang: string }>;
    expect(isValidElement(el)).toBe(true);
    expect(el.type).toBe("html");
    expect(el.props.lang).toBe("en");
  });
});
