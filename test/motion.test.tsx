import { act, renderHook, waitFor } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  setMotionPaused,
  useAnimate,
  useInterval,
  useMotionReady,
  usePaused,
  useRaf,
  useReducedMotion,
} from "@/lib/motion";

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("pause store", () => {
  it("persists and reflects the paused flag", () => {
    const { result } = renderHook(() => usePaused());
    expect(result.current).toBe(false);
    act(() => setMotionPaused(true));
    expect(result.current).toBe(true);
    expect(document.documentElement.dataset.motion).toBe("paused");
    act(() => setMotionPaused(false));
    expect(result.current).toBe(false);
    expect(document.documentElement.dataset.motion).toBeUndefined();
  });

  it("survives blocked storage", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const { result } = renderHook(() => usePaused());
    expect(result.current).toBe(false);
    act(() => setMotionPaused(true));
    expect(document.documentElement.dataset.motion).toBe("paused");
  });
});

describe("environment hooks", () => {
  it("reports no reduced-motion preference", () => {
    expect(renderHook(() => useReducedMotion()).result.current).toBe(false);
  });

  it("becomes motion-ready after load + idle", async () => {
    const { result } = renderHook(() => useMotionReady());
    await waitFor(() => expect(result.current).toBe(true));
    expect(document.documentElement.dataset.motionReady).toBe("");
  });

  it("useAnimate is true once ready, visible and not paused", async () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(document.createElement("div"));
      return useAnimate(ref);
    });
    await waitFor(() => expect(result.current).toBe(true));
  });
});

describe("loops", () => {
  it("useInterval ticks only while active", () => {
    vi.useFakeTimers();
    const cb = vi.fn();
    const { rerender } = renderHook(({ on }) => useInterval(cb, 100, on), { initialProps: { on: true } });
    vi.advanceTimersByTime(350);
    expect(cb).toHaveBeenCalledTimes(3);
    rerender({ on: false });
    vi.advanceTimersByTime(500);
    expect(cb).toHaveBeenCalledTimes(3);
  });

  it("useRaf passes clamped frame deltas", async () => {
    const cb = vi.fn();
    renderHook(() => useRaf(cb, true));
    await waitFor(() => expect(cb).toHaveBeenCalled());
    expect(cb.mock.calls[0][0]).toBeLessThanOrEqual(64);
  });
});
