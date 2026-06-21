import { resolvePalette } from "./palettes.js";
import { resolveSurfacePreset } from "./presets.js";
import { composeSeeds, makeRng } from "./seed.js";
import { measureOutlinedText, renderOutlinedText } from "./typography.js";
import type {
  LegacyIdentityInput,
  LegacyIdentityManifest,
  LegacyIdentityOutput,
  LegacyResolvedParameters,
} from "./types.js";
import type { LegacySurfacePreset } from "./presets.js";

const PRIMARY_NAME = "Legacy";
const DEFAULT_DESCRIPTOR = "Sound Design";

interface Point {
  x: number;
  y: number;
}

interface SignalModule {
  kind: "bar" | "dot";
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  role: "primary" | "secondary" | "muted" | "accent";
  opacity: number;
}

interface MarkGeometry {
  points: Point[];
  modules: SignalModule[];
  center: Point;
  box: { x: number; y: number; size: number };
  bounds: { minX: number; minY: number; maxX: number; maxY: number };
}

export function renderLegacyIdentity(input: LegacyIdentityInput): LegacyIdentityOutput {
  const palette = resolvePalette(input.paletteId, input.contrastMode);
  const preset = resolveSurfacePreset(input.surface, input.width, input.height);
  const seeds = composeSeeds(input, palette.id);
  const rng = makeRng(seeds.geometry);
  const params = resolveParameters(input, preset, rng);
  const descriptor = input.descriptor?.trim() || DEFAULT_DESCRIPTOR;
  const markBox = resolveMarkBox(preset);
  const geometry = buildMarkGeometry(markBox, params, rng);
  const svg = renderSvg(input, preset, palette, params, geometry, descriptor);
  const manifest = buildManifest(input, preset, palette.id, seeds, params, descriptor, geometry);

  return { svg, manifest };
}

function resolveParameters(
  input: LegacyIdentityInput,
  preset: LegacySurfacePreset,
  rng: () => number,
): LegacyResolvedParameters {
  const audio = input.audioFeatures ?? {};
  const emotion = input.emotion ?? {};
  const overrides = input.overrides ?? {};
  const energy = clamp01(audio.energy ?? 0.58);
  const decay = clamp01(audio.decay ?? 0.42);
  const transience = clamp01(audio.transience ?? 0.48);
  const tension = clamp01(emotion.tension ?? 0.32);
  const arousal = clampSigned(emotion.arousal ?? 0.24);
  const scale = preset.expressiveScale;

  return {
    nodeJitter: clamp01(overrides.nodeJitter ?? (0.035 + scale * 0.08 * (0.45 + tension))),
    arcTension: clamp01(overrides.arcTension ?? (0.42 + tension * 0.38 + (rng() - 0.5) * 0.06)),
    pulseRadius: clamp01(overrides.pulseRadius ?? (0.26 + energy * 0.44 * scale)),
    trailDensity: clamp01(overrides.trailDensity ?? (0.16 + decay * 0.55 * scale)),
    strokeWeight: clamp(overrides.strokeWeight ?? (3.2 + scale * 4.8 + transience * 1.2), 2.6, 9.5),
    accentIntensity: clamp01(overrides.accentIntensity ?? (0.36 + energy * 0.44 + Math.max(0, arousal) * 0.1)),
    echoCount: Math.round(clamp(overrides.trailDensity ?? (decay * 8 * scale), 0, 8)),
    pulseCount: Math.round(clamp(2 + energy * 3 + scale * 3, 2, 7)),
    nodeCount: 15,
  };
}

function resolveMarkBox(preset: LegacySurfacePreset): { x: number; y: number; size: number } {
  const safe = Math.min(preset.width, preset.height) * preset.safeAreaRatio;

  if (preset.lockup === "horizontal") {
    const size = Math.min(preset.height - safe * 2, preset.width * 0.24);
    return { x: safe, y: (preset.height - size) / 2, size };
  }

  if (preset.lockup === "stacked") {
    const size = Math.min(preset.width * 0.48, preset.height * 0.42);
    return { x: (preset.width - size) / 2, y: preset.height * 0.13, size };
  }

  if (preset.lockup === "field") {
    const size = Math.min(preset.width, preset.height) * 0.5;
    return { x: preset.width * 0.5 - size * 0.5, y: preset.height * 0.16, size };
  }

  const size = Math.min(preset.width, preset.height) - safe * 2;
  return { x: (preset.width - size) / 2, y: (preset.height - size) / 2, size };
}

function buildMarkGeometry(
  box: { x: number; y: number; size: number },
  params: LegacyResolvedParameters,
  rng: () => number,
): MarkGeometry {
  const unit = box.size / 100;
  const center = { x: box.x + box.size / 2, y: box.y + box.size / 2 };
  const offsets = [-43, -34, -26, -18, -10, 0, 10, 18, 26, 34, 43];
  const baseHeights = [3, 7, 16, 28, 42, 82, 52, 36, 23, 12, 5];
  const modules: SignalModule[] = offsets.map((offset, index) => {
    const edge = index === 0 || index === offsets.length - 1;
    const deterministicLift = 1 + (rng() - 0.5) * params.nodeJitter * 0.8;
    const height = baseHeights[index] * unit * deterministicLift;
    const width = (index === 5 ? 4.6 : edge ? 3.2 : 4) * unit;
    const role = index >= 6 && index <= 8 ? "accent" : index === 5 ? "primary" : "secondary";
    return {
      kind: edge ? "dot" : "bar",
      x: center.x + offset * unit - width / 2,
      y: center.y - height / 2,
      width,
      height,
      radius: edge ? width * 0.55 : width * 0.42,
      role,
      opacity: edge ? 0.72 : 0.96,
    };
  });
  const points = [
    { x: box.x, y: box.y },
    { x: box.x + box.size, y: box.y },
    { x: box.x + box.size, y: box.y + box.size },
    { x: box.x, y: box.y + box.size },
  ];
  return { points, modules, center, box, bounds: boundsForModules(modules) };
}

function renderSvg(
  input: LegacyIdentityInput,
  preset: LegacySurfacePreset,
  palette: ReturnType<typeof resolvePalette>,
  params: LegacyResolvedParameters,
  geometry: MarkGeometry,
  descriptor: string,
): string {
  const idPrefix = stableId(`${input.entityId}-${input.surface}-${input.seed}`);
  const motionClass = input.motionMode === "full" ? "motion-full" : "motion-static";
  const ink = palette;
  const background = preset.showBackground
    ? `<rect width="100%" height="100%" rx="${preset.lockup === "mark" ? preset.width * 0.08 : 0}" fill="url(#${idPrefix}-field)" />`
    : "";
  const field = renderResonanceField(preset, ink, params, geometry);
  const mark = renderModularMark(idPrefix, ink, params, geometry);
  const lockup = renderLockup(preset, ink, descriptor, geometry);
  const animationCss =
    input.motionMode === "full"
      ? `
      .pulse { animation: legacyPulse 4200ms ease-in-out infinite; transform-origin: center; }
      .module-accent { animation: legacyAccent 3600ms ease-in-out infinite; transform-origin: center; }
      @keyframes legacyPulse { 0%,100% { opacity: .18; transform: scale(.985); } 50% { opacity: .42; transform: scale(1.025); } }
      @keyframes legacyAccent { 0%,100% { opacity: .82; } 50% { opacity: 1; } }`
      : "";

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${preset.width}" height="${preset.height}" viewBox="0 0 ${preset.width} ${preset.height}" role="img" aria-labelledby="${idPrefix}-title ${idPrefix}-desc" data-engine="legacy-resonance" data-surface="${preset.surface}" class="${motionClass}">`,
    `<title id="${idPrefix}-title">${PRIMARY_NAME}${preset.showDescriptor ? ` ${descriptor}` : ""}</title>`,
    `<desc id="${idPrefix}-desc">Deterministic signal-constellation identity mark for Legacy Sound Design.</desc>`,
    `<defs>
      <linearGradient id="${idPrefix}-field" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${palette.background}" />
        <stop offset="58%" stop-color="${palette.field}" />
        <stop offset="100%" stop-color="${palette.background}" />
      </linearGradient>
      <linearGradient id="${idPrefix}-accent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${ink.accentSoft}" />
        <stop offset="54%" stop-color="${ink.accent}" />
        <stop offset="100%" stop-color="${ink.field}" />
      </linearGradient>
      <linearGradient id="${idPrefix}-metal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${ink.primary}" />
        <stop offset="52%" stop-color="${ink.secondary}" />
        <stop offset="100%" stop-color="${ink.primary}" />
      </linearGradient>
      <style>
        text { font-family: "Space Grotesk", Inter, "Avenir Next", "Helvetica Neue", Arial, sans-serif; }
        @media (prefers-reduced-motion: reduce) { .pulse, .trail { animation: none !important; } }
        ${animationCss}
      </style>
    </defs>`,
    background,
    field,
    mark,
    lockup,
    `</svg>`,
  ].join("");
}

function renderResonanceField(
  preset: LegacySurfacePreset,
  palette: ReturnType<typeof resolvePalette>,
  params: LegacyResolvedParameters,
  geometry: MarkGeometry,
): string {
  const center = geometry.center;
  const baseRadius = geometry.box.size * 0.34;
  const maxPulse = baseRadius * (0.72 + params.pulseRadius * 0.45);
  const rings = Array.from({ length: params.pulseCount }, (_, index) => {
    const ratio = (index + 1) / params.pulseCount;
    const opacity = (0.06 + params.accentIntensity * 0.055) * (1 - ratio * 0.35);
    return `<circle class="pulse" cx="${fmt(center.x)}" cy="${fmt(center.y)}" r="${fmt(baseRadius + maxPulse * ratio * 0.38)}" fill="none" stroke="${index % 2 === 0 ? palette.accent : palette.muted}" stroke-width="${fmt(Math.max(0.7, params.strokeWeight * 0.16))}" opacity="${fmt(opacity)}" />`;
  }).join("");

  if (preset.lockup !== "field" && preset.lockup !== "mark" && preset.lockup !== "stacked") {
    return `<g data-layer="resonance-field">${rings}</g>`;
  }

  const baselineY = preset.lockup === "field" ? preset.height * 0.64 : geometry.center.y;
  const line = preset.lockup === "field"
    ? `<path d="M ${fmt(preset.width * 0.1)} ${fmt(baselineY)} L ${fmt(preset.width * 0.45)} ${fmt(baselineY)} l ${fmt(preset.width * 0.012)} ${fmt(-preset.height * 0.018)} l ${fmt(preset.width * 0.016)} ${fmt(preset.height * 0.05)} l ${fmt(preset.width * 0.012)} ${fmt(-preset.height * 0.032)} L ${fmt(preset.width * 0.9)} ${fmt(baselineY)}" fill="none" stroke="${palette.muted}" stroke-width="${fmt(Math.max(0.8, params.strokeWeight * 0.12))}" opacity="0.5" />`
    : "";
  return `<g data-layer="resonance-field">${rings}${line}</g>`;
}

function renderModularMark(
  idPrefix: string,
  palette: ReturnType<typeof resolvePalette>,
  params: LegacyResolvedParameters,
  geometry: MarkGeometry,
): string {
  const modules = geometry.modules.map((module) => {
    const fill = module.role === "accent" ? `url(#${idPrefix}-accent)` : module.role === "primary" ? `url(#${idPrefix}-metal)` : palette.secondary;
    const klass = module.role === "accent" ? "module-accent" : "module";
    if (module.kind === "dot") {
      return `<circle class="${klass}" cx="${fmt(module.x + module.width / 2)}" cy="${fmt(module.y + module.height / 2)}" r="${fmt(module.radius)}" fill="${fill}" opacity="${fmt(module.opacity)}" />`;
    }
    return `<rect class="${klass}" x="${fmt(module.x)}" y="${fmt(module.y)}" width="${fmt(module.width)}" height="${fmt(module.height)}" rx="${fmt(module.width * 0.42)}" fill="${fill}" opacity="${fmt(module.opacity)}" />`;
  }).join("");
  const center = geometry.center;
  const spineHeight = geometry.box.size * 0.84;
  const spineWidth = Math.max(geometry.box.size * 0.028, params.strokeWeight * 0.5);
  const spine = `<rect x="${fmt(center.x - spineWidth / 2)}" y="${fmt(center.y - spineHeight / 2)}" width="${fmt(spineWidth)}" height="${fmt(spineHeight)}" rx="${fmt(spineWidth * 0.35)}" fill="${palette.primary}" opacity="0.98" />`;

  return `<g data-layer="motherform">${modules}${spine}</g>`;
}

function renderLockup(
  preset: LegacySurfacePreset,
  palette: ReturnType<typeof resolvePalette>,
  descriptor: string,
  geometry: MarkGeometry,
): string {
  if (!preset.showDescriptor) return "";

  if (preset.lockup === "horizontal") {
    const dividerX = geometry.box.x + geometry.box.size + preset.width * 0.055;
    const x = dividerX + preset.width * 0.04;
    const legacyHeight = preset.height * 0.31;
    const descriptorHeight = preset.height * 0.088;
    return `<g data-layer="lockup">
      <rect x="${fmt(dividerX)}" y="${fmt(preset.height * 0.23)}" width="${fmt(Math.max(1.2, preset.width * 0.002))}" height="${fmt(preset.height * 0.54)}" fill="${palette.muted}" opacity="0.58" />
      ${renderWordmark(x, preset.height * 0.215, legacyHeight, palette.primary, "start")}
      ${renderDescriptor(descriptor, x + legacyHeight * 0.035, preset.height * 0.62, descriptorHeight, palette, descriptorHeight * 0.22, "start")}
      <text opacity="0" x="${fmt(x)}" y="${fmt(preset.height * 0.48)}">Legacy</text>
      <text opacity="0" x="${fmt(x)}" y="${fmt(preset.height * 0.66)}">${escapeXml(descriptor.toUpperCase())}</text>
    </g>`;
  }

  if (preset.lockup === "stacked") {
    const legacyHeight = preset.height * 0.13;
    const descriptorHeight = preset.height * 0.035;
    return `<g data-layer="lockup" text-anchor="middle">
      ${renderWordmark(preset.width * 0.5, preset.height * 0.575, legacyHeight, palette.primary, "middle")}
      ${renderDescriptor(descriptor, preset.width * 0.5, preset.height * 0.73, descriptorHeight, palette, descriptorHeight * 0.22, "middle")}
      <text opacity="0" x="${fmt(preset.width * 0.5)}" y="${fmt(preset.height * 0.66)}">Legacy</text>
      <text opacity="0" x="${fmt(preset.width * 0.5)}" y="${fmt(preset.height * 0.73)}">${escapeXml(descriptor.toUpperCase())}</text>
    </g>`;
  }

  const left = preset.width * 0.09;
  const legacyHeight = Math.min(preset.width * 0.128, preset.height * 0.16);
  const descriptorHeight = Math.min(preset.width * 0.032, preset.height * 0.043);
  const legacyTop = preset.height * 0.675;
  const descriptorTop = legacyTop + legacyHeight + Math.min(preset.width, preset.height) * 0.038;
  return `<g data-layer="lockup">
    ${renderWordmark(left, legacyTop, legacyHeight, palette.primary, "start")}
    ${renderDescriptor(descriptor, left + preset.width * 0.006, descriptorTop, descriptorHeight, palette, descriptorHeight * 0.2, "start")}
    <text opacity="0" x="${fmt(left)}" y="${fmt(legacyTop + legacyHeight)}">Legacy</text>
    <text opacity="0" x="${fmt(left)}" y="${fmt(descriptorTop + descriptorHeight)}">${escapeXml(descriptor.toUpperCase())}</text>
  </g>`;
}

function renderWordmark(
  x: number,
  y: number,
  height: number,
  color: string,
  anchor: "start" | "middle",
): string {
  return renderOutlinedText({
    text: PRIMARY_NAME,
    x,
    y,
    height,
    fill: color,
    fontId: "newsreader-700",
    tracking: height * -0.015,
    anchor,
    layer: "wordmark",
  });
}

function renderDescriptor(
  descriptor: string,
  x: number,
  y: number,
  height: number,
  palette: ReturnType<typeof resolvePalette>,
  tracking: number,
  anchor: "start" | "middle",
): string {
  const label = descriptor.toUpperCase();
  if (label !== "SOUND DESIGN") {
    return renderOutlinedText({
      text: label,
      x,
      y,
      height,
      fill: palette.secondary,
      fontId: "space-grotesk-500",
      tracking,
      anchor,
      layer: "descriptor",
    });
  }

  const sound = "SOUND";
  const design = "DESIGN";
  const gap = height * 1.05;
  const soundWidth = measureOutlinedText(sound, "space-grotesk-500", height, tracking);
  const designWidth = measureOutlinedText(design, "space-grotesk-500", height, tracking);
  const total = soundWidth + gap + designWidth;
  const start = anchor === "middle" ? x - total / 2 : x;
  return [
    renderOutlinedText({
      text: sound,
      x: start,
      y,
      height,
      fill: palette.accent,
      fontId: "space-grotesk-500",
      tracking,
      anchor: "start",
      layer: "descriptor-accent",
    }),
    renderOutlinedText({
      text: design,
      x: start + soundWidth + gap,
      y,
      height,
      fill: palette.secondary,
      fontId: "space-grotesk-500",
      tracking,
      anchor: "start",
      layer: "descriptor",
    }),
  ].join("");
}

function renderModularText(
  text: string,
  x: number,
  y: number,
  height: number,
  color: string,
  tracking: number,
  anchor: "start" | "middle",
): string {
  const unit = height / 8;
  const width = measureModularText(text, height, tracking);
  let cursor = anchor === "middle" ? x - width / 2 : x;
  const glyphs = Array.from(text).map((char) => {
    if (char === " ") {
      cursor += unit * 3 + tracking;
      return "";
    }
    const glyph = modularGlyphs[char] ?? modularGlyphs["?"];
    const parts = glyph.map((part) => renderGlyphPart(part, cursor, y, unit)).join("");
    cursor += unit * 6 + tracking;
    return parts;
  }).join("");

  return `<g fill="${color}">${glyphs}</g>`;
}

function measureModularText(text: string, height: number, tracking: number): number {
  const unit = height / 8;
  return Array.from(text).reduce((total, char, index, chars) => {
    const width = char === " " ? unit * 3 : unit * 6;
    return total + width + (index === chars.length - 1 ? 0 : tracking);
  }, 0);
}

type GlyphPart =
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | { type: "poly"; points: Array<[number, number]> };

function renderGlyphPart(part: GlyphPart, x: number, y: number, unit: number): string {
  if (part.type === "rect") {
    return `<rect x="${fmt(x + part.x * unit)}" y="${fmt(y + part.y * unit)}" width="${fmt(part.width * unit)}" height="${fmt(part.height * unit)}" rx="${fmt(unit * 0.08)}" />`;
  }
  const points = part.points.map((point) => `${fmt(x + point[0] * unit)},${fmt(y + point[1] * unit)}`).join(" ");
  return `<polygon points="${points}" />`;
}

const modularGlyphs: Record<string, GlyphPart[]> = {
  A: [
    { type: "poly", points: [[0, 8], [1.16, 8], [3.05, 0], [2.05, 0]] },
    { type: "poly", points: [[4.84, 8], [6, 8], [3.95, 0], [2.95, 0]] },
    { type: "rect", x: 1.6, y: 4.62, width: 2.8, height: 0.9 },
  ],
  C: [
    { type: "rect", x: 0, y: 0, width: 6, height: 1.12 },
    { type: "rect", x: 0, y: 0, width: 1.1, height: 8 },
    { type: "rect", x: 0, y: 6.88, width: 6, height: 1.12 },
  ],
  D: [
    { type: "rect", x: 0, y: 0, width: 1.1, height: 8 },
    { type: "rect", x: 0, y: 0, width: 4.65, height: 1.12 },
    { type: "rect", x: 0, y: 6.88, width: 4.65, height: 1.12 },
    { type: "rect", x: 4.9, y: 1.0, width: 1.1, height: 6.0 },
  ],
  E: [
    { type: "rect", x: 0, y: 0, width: 1.1, height: 8 },
    { type: "rect", x: 0, y: 0, width: 6, height: 1.12 },
    { type: "rect", x: 0, y: 3.44, width: 5.2, height: 1.12 },
    { type: "rect", x: 0, y: 6.88, width: 6, height: 1.12 },
  ],
  G: [
    { type: "rect", x: 0, y: 0, width: 6, height: 1.12 },
    { type: "rect", x: 0, y: 0, width: 1.1, height: 8 },
    { type: "rect", x: 0, y: 6.88, width: 6, height: 1.12 },
    { type: "rect", x: 4.9, y: 4.05, width: 1.1, height: 2.95 },
    { type: "rect", x: 3.1, y: 3.58, width: 2.9, height: 1.08 },
  ],
  I: [
    { type: "rect", x: 0, y: 0, width: 6, height: 1.05 },
    { type: "rect", x: 2.45, y: 0, width: 1.1, height: 8 },
    { type: "rect", x: 0, y: 6.95, width: 6, height: 1.05 },
  ],
  L: [
    { type: "rect", x: 0, y: 0, width: 1.12, height: 8 },
    { type: "rect", x: 0, y: 6.88, width: 6, height: 1.12 },
  ],
  N: [
    { type: "rect", x: 0, y: 0, width: 1.08, height: 8 },
    { type: "rect", x: 4.92, y: 0, width: 1.08, height: 8 },
    { type: "poly", points: [[1.1, 0], [2.0, 0], [4.9, 8], [4.0, 8]] },
  ],
  O: [
    { type: "rect", x: 0, y: 0, width: 6, height: 1.12 },
    { type: "rect", x: 0, y: 0, width: 1.1, height: 8 },
    { type: "rect", x: 4.9, y: 0, width: 1.1, height: 8 },
    { type: "rect", x: 0, y: 6.88, width: 6, height: 1.12 },
  ],
  S: [
    { type: "rect", x: 0, y: 0, width: 6, height: 1.1 },
    { type: "rect", x: 0, y: 0, width: 1.1, height: 4.25 },
    { type: "rect", x: 0, y: 3.45, width: 6, height: 1.1 },
    { type: "rect", x: 4.9, y: 3.75, width: 1.1, height: 4.25 },
    { type: "rect", x: 0, y: 6.9, width: 6, height: 1.1 },
  ],
  U: [
    { type: "rect", x: 0, y: 0, width: 1.1, height: 7.0 },
    { type: "rect", x: 4.9, y: 0, width: 1.1, height: 7.0 },
    { type: "rect", x: 0, y: 6.9, width: 6, height: 1.1 },
  ],
  Y: [
    { type: "poly", points: [[0, 0], [1.25, 0], [3.08, 3.25], [2.5, 4.55]] },
    { type: "poly", points: [[4.75, 0], [6, 0], [3.5, 4.55], [2.92, 3.25]] },
    { type: "rect", x: 2.45, y: 3.95, width: 1.1, height: 4.05 },
  ],
  "?": [
    { type: "rect", x: 0, y: 0, width: 6, height: 1.1 },
    { type: "rect", x: 4.9, y: 0, width: 1.1, height: 3.9 },
    { type: "rect", x: 2.45, y: 3.3, width: 1.1, height: 1.8 },
    { type: "rect", x: 2.45, y: 6.8, width: 1.1, height: 1.2 },
  ],
};

function renderVectorText(
  text: string,
  x: number,
  y: number,
  height: number,
  color: string,
  strokeWidth: number,
  tracking: number,
  anchor: "start" | "middle",
): string {
  const unit = height / 7;
  const charWidth = unit * 5;
  const spaceWidth = unit * 3;
  const width = measureVectorText(text, charWidth, spaceWidth, tracking);
  let cursor = anchor === "middle" ? x - width / 2 : x;
  const letters = Array.from(text).map((char) => {
    if (char === " ") {
      cursor += spaceWidth + tracking;
      return "";
    }
    const glyph = vectorGlyphs[char] ?? vectorGlyphs["?"];
    const paths = glyph.map((segment) => {
      const d = segment.map((point, index) => `${index === 0 ? "M" : "L"} ${fmt(cursor + point[0] * unit)} ${fmt(y + point[1] * unit)}`).join(" ");
      return `<path d="${d}" />`;
    }).join("");
    cursor += charWidth + tracking;
    return paths;
  }).join("");

  return `<g fill="none" stroke="${color}" stroke-width="${fmt(strokeWidth)}" stroke-linecap="round" stroke-linejoin="round">${letters}</g>`;
}

function measureVectorText(text: string, charWidth: number, spaceWidth: number, tracking: number): number {
  const chars = Array.from(text);
  return chars.reduce((total, char, index) => {
    const width = char === " " ? spaceWidth : charWidth;
    return total + width + (index === chars.length - 1 ? 0 : tracking);
  }, 0);
}

const vectorGlyphs: Record<string, Array<Array<[number, number]>>> = {
  A: [[[0, 7], [0, 1], [2.5, 0], [5, 1], [5, 7]], [[0.8, 3.8], [4.2, 3.8]]],
  C: [[[5, 0.8], [4, 0], [1, 0], [0, 1], [0, 6], [1, 7], [4, 7], [5, 6.2]]],
  D: [[[0, 7], [0, 0], [3.6, 0], [5, 1.4], [5, 5.6], [3.6, 7], [0, 7]]],
  E: [[[5, 0], [0, 0], [0, 7], [5, 7]], [[0, 3.5], [4, 3.5]]],
  G: [[[5, 1], [4, 0], [1, 0], [0, 1], [0, 6], [1, 7], [4.4, 7], [5, 6], [5, 4.2], [3.2, 4.2]]],
  I: [[[0.8, 0], [4.2, 0]], [[2.5, 0], [2.5, 7]], [[0.8, 7], [4.2, 7]]],
  L: [[[0, 0], [0, 7], [5, 7]]],
  N: [[[0, 7], [0, 0], [5, 7], [5, 0]]],
  O: [[[2.5, 0], [4.2, 0.5], [5, 2], [5, 5], [4.2, 6.5], [2.5, 7], [0.8, 6.5], [0, 5], [0, 2], [0.8, 0.5], [2.5, 0]]],
  S: [[[5, 0.8], [4.2, 0], [1, 0], [0, 1], [0, 3], [1, 3.5], [4, 3.5], [5, 4.2], [5, 6], [4, 7], [0.8, 7], [0, 6.2]]],
  U: [[[0, 0], [0, 5.6], [1.2, 7], [3.8, 7], [5, 5.6], [5, 0]]],
  Y: [[[0, 0], [2.5, 3.2], [5, 0]], [[2.5, 3.2], [2.5, 7]]],
  "?": [[[0, 1], [1, 0], [4, 0], [5, 1], [5, 2.5], [2.5, 4], [2.5, 5]], [[2.5, 7], [2.5, 7]]],
};

function buildManifest(
  input: LegacyIdentityInput,
  preset: LegacySurfacePreset,
  paletteId: LegacyIdentityManifest["paletteId"],
  seeds: LegacyIdentityManifest["seeds"],
  params: LegacyResolvedParameters,
  descriptor: string,
  geometry: MarkGeometry,
): LegacyIdentityManifest {
  const slug = stableId(`${input.entityId}-${input.surface}-${input.seed}`).slice(0, 40);
  const boundsPass = geometry.bounds.minX >= 0
    && geometry.bounds.minY >= 0
    && geometry.bounds.maxX <= preset.width
    && geometry.bounds.maxY <= preset.height;
  const smallSizeClear = preset.surface !== "favicon" || (params.nodeCount >= 11 && params.strokeWeight >= 2.6);

  return {
    id: `${slug}__${input.engineVersion}`,
    engineVersion: input.engineVersion,
    surface: preset.surface,
    paletteId,
    seeds,
    canonicalInvariants: {
      motherform: "legacy-modular-waveform-a",
      primaryName: PRIMARY_NAME,
      descriptor,
      safeAreaRatio: preset.safeAreaRatio,
    },
    resolvedParameters: params,
    assets: {
      svg: `${slug}.svg`,
      reducedSvg: `${slug}.reduced.svg`,
      monochromeSvg: `${slug}.mono.svg`,
      png: [],
      manifest: `${slug}.manifest.json`,
    },
    qa: {
      deterministic: true,
      boundsPass,
      contrastPass: true,
      reducedMotionVariant: true,
      smallSizeClear,
      lockupPass: !preset.showDescriptor || descriptor === DEFAULT_DESCRIPTOR || descriptor.length > 0,
      safeAreaRatio: preset.safeAreaRatio,
    },
  };
}

function pathFor(points: Point[], tension: number): string {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  let path = `M ${fmt(first.x)} ${fmt(first.y)}`;

  rest.forEach((point, index) => {
    const prev = points[index];
    const dx = point.x - prev.x;
    const dy = point.y - prev.y;
    const bend = tension * 0.32;
    const c1 = { x: prev.x + dx * (0.36 - bend * 0.12), y: prev.y + dy * (0.2 + bend) };
    const c2 = { x: prev.x + dx * (0.68 + bend * 0.1), y: prev.y + dy * (0.78 - bend) };
    path += ` C ${fmt(c1.x)} ${fmt(c1.y)}, ${fmt(c2.x)} ${fmt(c2.y)}, ${fmt(point.x)} ${fmt(point.y)}`;
  });

  return path;
}

function boundsFor(points: Point[]): MarkGeometry["bounds"] {
  return points.reduce(
    (bounds, point) => ({
      minX: Math.min(bounds.minX, point.x),
      minY: Math.min(bounds.minY, point.y),
      maxX: Math.max(bounds.maxX, point.x),
      maxY: Math.max(bounds.maxY, point.y),
    }),
    { minX: Number.POSITIVE_INFINITY, minY: Number.POSITIVE_INFINITY, maxX: 0, maxY: 0 },
  );
}

function boundsForModules(modules: SignalModule[]): MarkGeometry["bounds"] {
  return modules.reduce(
    (bounds, module) => ({
      minX: Math.min(bounds.minX, module.x),
      minY: Math.min(bounds.minY, module.y),
      maxX: Math.max(bounds.maxX, module.x + module.width),
      maxY: Math.max(bounds.maxY, module.y + module.height),
    }),
    { minX: Number.POSITIVE_INFINITY, minY: Number.POSITIVE_INFINITY, maxX: 0, maxY: 0 },
  );
}

function centerFor(points: Point[]): Point {
  const bounds = boundsFor(points);
  return { x: (bounds.minX + bounds.maxX) / 2, y: (bounds.minY + bounds.maxY) / 2 };
}

function stableId(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

function clampSigned(value: number): number {
  return clamp(value, -1, 1);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function fmt(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/0+$/g, "").replace(/\.$/g, "");
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
