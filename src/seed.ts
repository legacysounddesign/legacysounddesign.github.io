import { createHash } from "node:crypto";
import type { LegacyIdentityInput, LegacySeeds } from "./types.js";

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function composeSeeds(input: LegacyIdentityInput, paletteId: string): LegacySeeds {
  const seedKey = [
    input.engineVersion,
    "resonance",
    input.entityId,
    input.seed,
    input.surface,
    paletteId,
  ].join("|");
  const master = sha256(seedKey);
  const expanded = sha256(`${master}|legacy-signal-constellation-a`);

  return {
    master,
    geometry: expanded.slice(0, 16),
    palette: expanded.slice(16, 32),
    motion: expanded.slice(32, 48),
    texture: expanded.slice(48, 64),
  };
}

export function makeRng(seedHex: string): () => number {
  let state = Number.parseInt(seedHex.slice(0, 8), 16) >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}
