import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { THEME_BOOTSTRAP, THEME_KEY, applyTheme, readTheme, setTheme, useTheme } from "@/lib/theme";
import { ThemeToggle } from "@/components/theme-toggle";
import { isVeryDark } from "@/components/ui";

afterEach(() => {
  vi.restoreAllMocks();
  delete document.documentElement.dataset.theme;
  document.documentElement.style.colorScheme = "";
});

describe("theme store", () => {
  it("defaults to light for everyone, even if the OS prefers dark", () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      () => ({ matches: true, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList,
    );
    expect(readTheme()).toBe("light");
  });

  it("remembers an explicit dark choice", () => {
    setTheme("dark");
    expect(localStorage.getItem(THEME_KEY)).toBe("dark");
    expect(readTheme()).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });

  it("ignores garbage in storage", () => {
    localStorage.setItem(THEME_KEY, "purple");
    expect(readTheme()).toBe("light");
  });

  it("works when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(readTheme()).toBe("light");
    setTheme("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("useTheme re-renders when the theme changes", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe("light");
    act(() => setTheme("dark"));
    expect(result.current).toBe("dark");
  });

  it("applyTheme sets the attribute and native color-scheme", () => {
    applyTheme("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("bootstrap applies only a saved dark choice", () => {
    new Function(THEME_BOOTSTRAP)();
    expect(document.documentElement.dataset.theme).toBeUndefined();
    localStorage.setItem(THEME_KEY, "dark");
    new Function(THEME_BOOTSTRAP)();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});

describe("ThemeToggle", () => {
  it("starts light and switches both ways", () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(document.documentElement.dataset.theme).toBe("dark");
    fireEvent.click(screen.getByRole("button", { name: "Switch to light mode" }));
    expect(document.documentElement.dataset.theme).toBe("light");
  });
});

describe("isVeryDark", () => {
  it("flags near-black brand colours only", () => {
    expect(isVeryDark("000000")).toBe(true);
    expect(isVeryDark("181717")).toBe(true);
    expect(isVeryDark("00ADD8")).toBe(false);
    expect(isVeryDark("FFFFFF")).toBe(false);
  });
});
