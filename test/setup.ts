import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

/** Tests flip this to simulate an element scrolling out of view. */
export const observerState = { intersecting: true };

class MockIntersectionObserver {
  constructor(private readonly cb: IntersectionObserverCallback) {}
  observe(target: Element): void {
    const entry = { isIntersecting: observerState.intersecting, target } as IntersectionObserverEntry;
    this.cb([entry], this as unknown as IntersectionObserver);
  }
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

class MockResizeObserver {
  constructor(private readonly cb: ResizeObserverCallback) {}
  observe(target: Element): void {
    this.cb([{ target } as ResizeObserverEntry], this as unknown as ResizeObserver);
  }
  unobserve(): void {}
  disconnect(): void {}
}

Object.assign(globalThis, {
  IntersectionObserver: MockIntersectionObserver,
  ResizeObserver: MockResizeObserver,
});

window.matchMedia = (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList;

window.requestIdleCallback = (cb: IdleRequestCallback) =>
  window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 50 }), 0);

// jsdom has no SVG geometry.
Object.assign(SVGElement.prototype, {
  getTotalLength: () => 100,
  getPointAtLength: (len: number) => ({ x: len, y: len / 2 }),
});

afterEach(() => {
  cleanup();
  observerState.intersecting = true;
  localStorage.clear();
  delete document.documentElement.dataset.motion;
});
