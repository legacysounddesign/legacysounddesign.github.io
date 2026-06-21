import type { LegacySurface } from "./types.js";

export interface LegacySurfacePreset {
  surface: LegacySurface;
  width: number;
  height: number;
  safeAreaRatio: number;
  showDescriptor: boolean;
  showBackground: boolean;
  expressiveScale: number;
  lockup: "mark" | "horizontal" | "stacked" | "field";
}

export const surfacePresets: Record<LegacySurface, LegacySurfacePreset> = {
  favicon: {
    surface: "favicon",
    width: 64,
    height: 64,
    safeAreaRatio: 0.15,
    showDescriptor: false,
    showBackground: false,
    expressiveScale: 0.12,
    lockup: "mark",
  },
  avatar: {
    surface: "avatar",
    width: 512,
    height: 512,
    safeAreaRatio: 0.13,
    showDescriptor: false,
    showBackground: true,
    expressiveScale: 0.28,
    lockup: "mark",
  },
  "horizontal-lockup": {
    surface: "horizontal-lockup",
    width: 1200,
    height: 360,
    safeAreaRatio: 0.1,
    showDescriptor: true,
    showBackground: false,
    expressiveScale: 0.18,
    lockup: "horizontal",
  },
  "stacked-lockup": {
    surface: "stacked-lockup",
    width: 800,
    height: 800,
    safeAreaRatio: 0.11,
    showDescriptor: true,
    showBackground: false,
    expressiveScale: 0.2,
    lockup: "stacked",
  },
  hero: {
    surface: "hero",
    width: 1600,
    height: 900,
    safeAreaRatio: 0.08,
    showDescriptor: true,
    showBackground: true,
    expressiveScale: 0.85,
    lockup: "field",
  },
  poster: {
    surface: "poster",
    width: 1080,
    height: 1350,
    safeAreaRatio: 0.09,
    showDescriptor: true,
    showBackground: true,
    expressiveScale: 0.72,
    lockup: "field",
  },
  social: {
    surface: "social",
    width: 1200,
    height: 630,
    safeAreaRatio: 0.09,
    showDescriptor: true,
    showBackground: true,
    expressiveScale: 0.62,
    lockup: "field",
  },
};

export function resolveSurfacePreset(surface: LegacySurface, width?: number, height?: number): LegacySurfacePreset {
  const base = surfacePresets[surface];
  return {
    ...base,
    width: width ?? base.width,
    height: height ?? base.height,
  };
}
