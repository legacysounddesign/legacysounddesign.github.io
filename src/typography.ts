import { readFileSync } from "node:fs";
import { join } from "node:path";
import opentype from "opentype.js";

type Font = ReturnType<typeof opentype.parse>;
type FontPath = ReturnType<Font["getPath"]>;
type FontPathCommand = FontPath["commands"][number];

export type LegacyFontId =
  | "newsreader-700"
  | "space-grotesk-400"
  | "space-grotesk-500"
  | "space-mono-400"
  | "space-mono-700";

interface OutlinedTextOptions {
  text: string;
  x: number;
  y: number;
  height: number;
  fill: string;
  fontId: LegacyFontId;
  tracking?: number;
  anchor?: "start" | "middle";
  layer?: string;
}

const fontFiles: Record<LegacyFontId, string> = {
  "newsreader-700": "Newsreader-700.ttf",
  "space-grotesk-400": "SpaceGrotesk-400.ttf",
  "space-grotesk-500": "SpaceGrotesk-500.ttf",
  "space-mono-400": "SpaceMono-400.ttf",
  "space-mono-700": "SpaceMono-700.ttf",
};

const fontCache = new Map<LegacyFontId, Font>();

export function renderOutlinedText(options: OutlinedTextOptions): string {
  const font = loadFont(options.fontId);
  const fontSize = fontSizeForHeight(font, options.height);
  const baseline = options.y + (font.ascender / font.unitsPerEm) * fontSize;
  const tracking = options.tracking ?? 0;
  const width = measureOutlinedText(options.text, options.fontId, options.height, tracking);
  let cursor = options.anchor === "middle" ? options.x - width / 2 : options.x;
  const paths = Array.from(options.text).map((char) => {
    const advance = font.getAdvanceWidth(char, fontSize, { kerning: true });
    if (char === " ") {
      cursor += advance + tracking;
      return "";
    }

    const d = pathToData(font.getPath(char, cursor, baseline, fontSize, { kerning: true }));
    cursor += advance + tracking;
    return d ? `<path d="${d}" />` : "";
  }).join("");
  const layer = options.layer ? ` data-layer="${options.layer}"` : "";

  return `<g${layer} data-font="${options.fontId}" fill="${options.fill}">${paths}</g>`;
}

export function measureOutlinedText(
  text: string,
  fontId: LegacyFontId,
  height: number,
  tracking = 0,
): number {
  const font = loadFont(fontId);
  const fontSize = fontSizeForHeight(font, height);
  return Array.from(text).reduce((total, char, index, chars) => {
    const advance = font.getAdvanceWidth(char, fontSize, { kerning: true });
    return total + advance + (index === chars.length - 1 ? 0 : tracking);
  }, 0);
}

function loadFont(fontId: LegacyFontId): Font {
  const cached = fontCache.get(fontId);
  if (cached) return cached;

  const path = join(process.cwd(), "assets", "fonts", fontFiles[fontId]);
  const data = readFileSync(path);
  const buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  const font = opentype.parse(buffer);
  fontCache.set(fontId, font);
  return font;
}

function fontSizeForHeight(font: Font, height: number): number {
  return height / ((font.ascender - font.descender) / font.unitsPerEm);
}

function pathToData(path: FontPath): string {
  return path.commands.map(commandToData).join("");
}

function commandToData(command: FontPathCommand): string {
  switch (command.type) {
    case "M":
      return `M${formatCoordinate(command.x)} ${formatCoordinate(command.y)}`;
    case "L":
      return `L${formatCoordinate(command.x)} ${formatCoordinate(command.y)}`;
    case "C":
      return `C${formatCoordinate(command.x1)} ${formatCoordinate(command.y1)} ${formatCoordinate(command.x2)} ${formatCoordinate(command.y2)} ${formatCoordinate(command.x)} ${formatCoordinate(command.y)}`;
    case "Q":
      return `Q${formatCoordinate(command.x1)} ${formatCoordinate(command.y1)} ${formatCoordinate(command.x)} ${formatCoordinate(command.y)}`;
    case "Z":
      return "Z";
    default:
      throw new Error(`Unsupported font path command: ${String((command as { type?: unknown }).type)}`);
  }
}

function formatCoordinate(value: number | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("Invalid font outline coordinate");
  }

  return value.toFixed(2).replace(/\.?0+$/, "");
}
