import { renderHook, act, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDeviceDimensions } from "./useDeviceDimensions";

const setWindowSize = (width: number, height: number) => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: height,
  });
};

describe("useDeviceDimensions", () => {
  beforeEach(() => {
    setWindowSize(1024, 768);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("updates to current window size and exposes device flags", async () => {
    setWindowSize(500, 700);

    const { result } = renderHook(() => useDeviceDimensions());

    await waitFor(() => {
      expect(result.current.width).toBe(500);
      expect(result.current.height).toBe(700);
    });

    expect(result.current.isClient).toBe(true);
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });

  it("respects custom breakpoints", async () => {
    setWindowSize(800, 600);

    const { result } = renderHook(() =>
      useDeviceDimensions({
        breakpoints: {
          tablet: 600,
          desktop: 900,
        },
      }),
    );

    await waitFor(() => {
      expect(result.current.width).toBe(800);
    });

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.breakpoints.tablet).toBe(600);
    expect(result.current.breakpoints.desktop).toBe(900);
  });

  it("debounces resize updates and calls onChange", () => {
    vi.useFakeTimers();

    setWindowSize(1200, 800);
    const onChange = vi.fn();

    const { result } = renderHook(() =>
      useDeviceDimensions({ onChange, debounceMs: 200 }),
    );

    expect(result.current.width).toBe(1200);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith({ width: 1200, height: 800 });

    setWindowSize(1000, 500);
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current.width).toBe(1200);

    act(() => {
      vi.advanceTimersByTime(199);
    });

    expect(result.current.width).toBe(1200);
    expect(onChange).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current.width).toBe(1000);
    expect(result.current.height).toBe(500);
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith({ width: 1000, height: 500 });
  });
});
