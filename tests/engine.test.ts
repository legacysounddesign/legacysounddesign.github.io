import assert from "node:assert/strict";
import test from "node:test";
import { renderLegacyIdentity, surfacePresets } from "../src/index.js";
import type { LegacyIdentityInput, LegacySurface } from "../src/index.js";

const baseInput: LegacyIdentityInput = {
  engineVersion: "1.0.0",
  entityId: "legacy-test",
  seed: "LEGACY-RSN-TEST",
  seedStrategy: "manual",
  surface: "horizontal-lockup",
  width: 1200,
  height: 360,
  contrastMode: "normal",
  motionMode: "full",
  paletteId: "cinematic-01",
  descriptor: "Sound Design",
  audioFeatures: {
    energy: 0.68,
    centroid: 0.42,
    transience: 0.56,
    decay: 0.64,
  },
  emotion: {
    arousal: 0.44,
    tension: 0.36,
  },
};

test("same input produces stable SVG and manifest", () => {
  const first = renderLegacyIdentity(baseInput);
  const second = renderLegacyIdentity(baseInput);
  assert.equal(first.svg, second.svg);
  assert.deepEqual(first.manifest, second.manifest);
  assert.equal(first.manifest.qa.deterministic, true);
});

test("Legacy remains primary and Sound Design remains descriptor in lockups", () => {
  const output = renderLegacyIdentity(baseInput);
  assert.match(output.svg, />Legacy</);
  assert.match(output.svg, />SOUND DESIGN</);
  assert.match(output.svg, /data-layer="wordmark" data-font="newsreader-700"/);
  assert.match(output.svg, /data-layer="descriptor-accent" data-font="space-grotesk-500"/);
  assert.match(output.svg, /data-layer="descriptor" data-font="space-grotesk-500"/);
  assert.equal(output.manifest.canonicalInvariants.primaryName, "Legacy");
  assert.equal(output.manifest.canonicalInvariants.descriptor, "Sound Design");
  assert.equal(output.manifest.canonicalInvariants.motherform, "legacy-modular-waveform-a");
  assert.equal(output.manifest.qa.lockupPass, true);
});

test("surface presets pass bounds and accessibility QA", () => {
  for (const [surface, preset] of Object.entries(surfacePresets) as Array<[LegacySurface, typeof surfacePresets[LegacySurface]]>) {
    const output = renderLegacyIdentity({
      ...baseInput,
      surface,
      width: preset.width,
      height: preset.height,
      motionMode: surface === "favicon" ? "off" : "full",
    });
    assert.equal(output.manifest.qa.boundsPass, true, `${surface} bounds`);
    assert.equal(output.manifest.qa.contrastPass, true, `${surface} contrast`);
    assert.equal(output.manifest.qa.reducedMotionVariant, true, `${surface} reduced motion`);
    assert.equal(output.manifest.qa.smallSizeClear, true, `${surface} small-size clarity`);
  }
});

test("high contrast and monochrome variants are available", () => {
  const highContrast = renderLegacyIdentity({
    ...baseInput,
    contrastMode: "high",
    paletteId: "cinematic-01",
  });
  const monochrome = renderLegacyIdentity({
    ...baseInput,
    motionMode: "off",
    paletteId: "monochrome",
  });

  assert.equal(highContrast.manifest.paletteId, "cinematic-high-contrast");
  assert.equal(monochrome.manifest.paletteId, "monochrome");
  assert.match(monochrome.svg, /data-surface="horizontal-lockup"/);
});
