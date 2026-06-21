import type { LegacyContrastMode, LegacyPaletteId } from "./types.js";

export interface LegacyPalette {
  id: LegacyPaletteId;
  background: string;
  field: string;
  primary: string;
  secondary: string;
  muted: string;
  accent: string;
  accentSoft: string;
  transparent: string;
}

export function resolvePalette(
  requested: LegacyPaletteId | undefined,
  contrastMode: LegacyContrastMode,
): LegacyPalette {
  if (contrastMode === "high") {
    return {
      id: "cinematic-high-contrast",
      background: "#030406",
      field: "#07182D",
      primary: "#FFFFFF",
      secondary: "#E8EDF4",
      muted: "#A9B4C3",
      accent: "#7894D4",
      accentSoft: "#A9BAE8",
      transparent: "transparent",
    };
  }

  if (requested === "monochrome") {
    return {
      id: "monochrome",
      background: "#050608",
      field: "#101216",
      primary: "#FFFFFF",
      secondary: "#C8CDD4",
      muted: "#7F8793",
      accent: "#FFFFFF",
      accentSoft: "#D9DDE3",
      transparent: "transparent",
    };
  }

  return {
    id: "cinematic-01",
    background: "#07090D",
    field: "#0B1A2C",
    primary: "#F7F8FA",
    secondary: "#C9D0D8",
    muted: "#7A8492",
    accent: "#315EA8",
    accentSoft: "#7894D4",
    transparent: "transparent",
  };
}
