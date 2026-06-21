export type LegacySurface =
  | "favicon"
  | "avatar"
  | "horizontal-lockup"
  | "stacked-lockup"
  | "hero"
  | "poster"
  | "social";

export type LegacyPaletteId = "cinematic-01" | "cinematic-high-contrast" | "monochrome";
export type LegacyContrastMode = "normal" | "high";
export type LegacyMotionMode = "full" | "reduced" | "off";
export type LegacySeedStrategy = "manual" | "hash" | "hybrid";

export interface LegacyAudioFeatures {
  energy?: number;
  centroid?: number;
  transience?: number;
  bandLow?: number;
  bandMid?: number;
  bandHigh?: number;
  decay?: number;
}

export interface LegacyEmotion {
  valence?: number;
  arousal?: number;
  tension?: number;
}

export interface LegacyOverrides {
  nodeJitter?: number;
  arcTension?: number;
  pulseRadius?: number;
  trailDensity?: number;
  strokeWeight?: number;
  accentIntensity?: number;
}

export interface LegacyIdentityInput {
  engineVersion: string;
  entityId: string;
  seed: string;
  seedStrategy?: LegacySeedStrategy;
  surface: LegacySurface;
  width: number;
  height: number;
  contrastMode: LegacyContrastMode;
  motionMode: LegacyMotionMode;
  paletteId?: LegacyPaletteId;
  descriptor?: string;
  audioFeatures?: LegacyAudioFeatures;
  emotion?: LegacyEmotion;
  overrides?: LegacyOverrides;
}

export interface LegacyResolvedParameters {
  nodeJitter: number;
  arcTension: number;
  pulseRadius: number;
  trailDensity: number;
  strokeWeight: number;
  accentIntensity: number;
  echoCount: number;
  pulseCount: number;
  nodeCount: number;
}

export interface LegacySeeds {
  master: string;
  geometry: string;
  palette: string;
  motion: string;
  texture: string;
}

export interface LegacyAssetNames {
  svg: string;
  reducedSvg: string;
  monochromeSvg: string;
  png: string[];
  manifest: string;
}

export interface LegacyQaResult {
  deterministic: boolean;
  boundsPass: boolean;
  contrastPass: boolean;
  reducedMotionVariant: boolean;
  smallSizeClear: boolean;
  lockupPass: boolean;
  safeAreaRatio: number;
}

export interface LegacyIdentityManifest {
  id: string;
  engineVersion: string;
  surface: LegacySurface;
  paletteId: LegacyPaletteId;
  seeds: LegacySeeds;
  canonicalInvariants: {
    motherform: "legacy-modular-waveform-a";
    primaryName: "Legacy";
    descriptor: string;
    safeAreaRatio: number;
  };
  resolvedParameters: LegacyResolvedParameters;
  assets: LegacyAssetNames;
  qa: LegacyQaResult;
}

export interface LegacyIdentityOutput {
  svg: string;
  manifest: LegacyIdentityManifest;
}
