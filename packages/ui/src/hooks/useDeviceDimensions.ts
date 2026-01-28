"use client";

import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";

type Breakpoints = {
  mobile: number;
  tablet: number;
  desktop: number;
};

type UseDeviceWidthOptions = {
  breakpoints?: Partial<Breakpoints>;
  ssrWidth?: number;
  ssrHeight?: number;
  onChange?: (size: { width: number; height: number }) => void;
  debounceMs?: number;
};

const DEFAULT_BREAKPOINTS: Breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
};

export function useDeviceDimensions(options?: UseDeviceWidthOptions) {
  const [width, setWidth] = useState<number | null>(
    () => options?.ssrWidth ?? null,
  );
  const [height, setHeight] = useState<number | null>(
    () => options?.ssrHeight ?? null,
  );

  const breakpoints = useMemo<Breakpoints>(() => {
    return {
      ...DEFAULT_BREAKPOINTS,
      ...(options?.breakpoints ?? {}),
    };
  }, [options?.breakpoints]);

  useEffect(() => {
    const updateSize = () => {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;

      setWidth(nextWidth);
      setHeight(nextHeight);
      options?.onChange?.({ width: nextWidth, height: nextHeight });
    };

    const updateSizeDebounced = debounce(updateSize, options?.debounceMs ?? 120);

    updateSize();
    window.addEventListener("resize", updateSizeDebounced);

    return () => {
      window.removeEventListener("resize", updateSizeDebounced);
      updateSizeDebounced.cancel();
    };
  }, [options?.onChange]);

  const isClient = width !== null;
  const isMobile = isClient && width < breakpoints.tablet;
  const isTablet =
    isClient && width >= breakpoints.tablet && width < breakpoints.desktop;
  const isDesktop = isClient && width >= breakpoints.desktop;

  return {
    width,
    height,
    isClient,
    isMobile,
    isTablet,
    isDesktop,
    breakpoints,
  };
}
