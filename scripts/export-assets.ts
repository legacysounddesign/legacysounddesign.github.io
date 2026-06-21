import { cp, mkdir, rm, stat, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { renderLegacyIdentity, resolveSurfacePreset, surfacePresets } from "../src/index.js";
import type { LegacyIdentityInput, LegacyMotionMode, LegacyPaletteId, LegacySurface } from "../src/index.js";

const execFileAsync = promisify(execFile);
const outputRoot = "output/identity";
const assetRoot = join(outputRoot, "assets");
const galleryRoot = join(outputRoot, "gallery");
const publicIdentityRoot = "public/identity";
const engineVersion = "1.0.0";
const descriptor = "Sound Design";
const surfaces = Object.keys(surfacePresets) as LegacySurface[];
const seedBase = "LEGACY-RSN-V1";

interface ExportedAsset {
  surface: LegacySurface;
  title: string;
  svgPath: string;
  reducedSvgPath: string;
  monoSvgPath: string;
  manifestPath: string;
  pngPaths: string[];
}

async function main(): Promise<void> {
  await mkdir(assetRoot, { recursive: true });
  await mkdir(galleryRoot, { recursive: true });

  const exported: ExportedAsset[] = [];

  for (const surface of surfaces) {
    const preset = resolveSurfacePreset(surface);
    const input = makeInput(surface, preset.width, preset.height, "full", "cinematic-01");
    const output = renderLegacyIdentity(input);
    const reduced = renderLegacyIdentity({ ...input, motionMode: "reduced" });
    const mono = renderLegacyIdentity({ ...input, motionMode: "off", paletteId: "monochrome" });
    const baseName = `${surface}.${seedBase.toLowerCase()}`;
    const svgPath = join(assetRoot, `${baseName}.svg`);
    const reducedSvgPath = join(assetRoot, `${baseName}.reduced.svg`);
    const monoSvgPath = join(assetRoot, `${baseName}.mono.svg`);
    const manifestPath = join(assetRoot, `${baseName}.manifest.json`);
    const pngPaths = await tryRasterize(svgPath, baseName, output.svg);

    output.manifest.assets.svg = fileName(svgPath);
    output.manifest.assets.reducedSvg = fileName(reducedSvgPath);
    output.manifest.assets.monochromeSvg = fileName(monoSvgPath);
    output.manifest.assets.manifest = fileName(manifestPath);
    output.manifest.assets.png = pngPaths.map(fileName);

    await writeText(svgPath, output.svg);
    await writeText(reducedSvgPath, reduced.svg);
    await writeText(monoSvgPath, mono.svg);
    await writeText(manifestPath, `${JSON.stringify(output.manifest, null, 2)}\n`);

    exported.push({
      surface,
      title: labelFor(surface),
      svgPath,
      reducedSvgPath,
      monoSvgPath,
      manifestPath,
      pngPaths,
    });
  }

  await writeText(join(galleryRoot, "index.html"), renderGallery(exported));
  await writeText(join(outputRoot, "README.md"), renderOutputReadme(exported));
  await syncPublicIdentityAssets();
  console.log(`Exported ${exported.length} surface sets to ${outputRoot} and ${publicIdentityRoot}`);
}

async function syncPublicIdentityAssets(): Promise<void> {
  await rm(publicIdentityRoot, { recursive: true, force: true });
  await mkdir(publicIdentityRoot, { recursive: true });
  await cp(assetRoot, publicIdentityRoot, { recursive: true });
}

function makeInput(
  surface: LegacySurface,
  width: number,
  height: number,
  motionMode: LegacyMotionMode,
  paletteId: LegacyPaletteId,
): LegacyIdentityInput {
  return {
    engineVersion,
    entityId: `legacy-${surface}`,
    seed: seedBase,
    seedStrategy: "manual",
    surface,
    width,
    height,
    contrastMode: "normal",
    motionMode,
    paletteId,
    descriptor,
    audioFeatures: {
      energy: 0.68,
      centroid: 0.42,
      transience: 0.56,
      bandLow: 0.6,
      bandMid: 0.5,
      bandHigh: 0.32,
      decay: 0.64,
    },
    emotion: {
      valence: 0.12,
      arousal: 0.44,
      tension: 0.36,
    },
  };
}

async function tryRasterize(svgPath: string, baseName: string, svg: string): Promise<string[]> {
  await writeText(svgPath, svg);
  const pngPath = join(assetRoot, `${baseName}.png`);
  await removeIfExists(pngPath);
  const rasterizers: Array<{ command: string; args: string[] }> = [
    { command: "rsvg-convert", args: ["-o", pngPath, svgPath] },
  ];

  for (const rasterizer of rasterizers) {
    try {
      await execFileAsync(rasterizer.command, rasterizer.args);
    } catch {
      // Try the next local rasterizer. PNG output is optional for v1.
    }

    if (await existsNonEmpty(pngPath)) {
      return [pngPath];
    }
  }

  return [];
}

async function removeIfExists(path: string): Promise<void> {
  try {
    await unlink(path);
  } catch {
    // Nothing to remove.
  }
}

async function existsNonEmpty(path: string): Promise<boolean> {
  try {
    const info = await stat(path);
    return info.size > 0;
  } catch {
    return false;
  }
}

function renderGallery(items: ExportedAsset[]): string {
  const cards = items.map((item) => {
    const svgRel = relativeFromGallery(item.svgPath);
    const reducedRel = relativeFromGallery(item.reducedSvgPath);
    const monoRel = relativeFromGallery(item.monoSvgPath);
    const manifestRel = relativeFromGallery(item.manifestPath);
    const pngNote = item.pngPaths.length > 0 ? `${item.pngPaths.length} PNG` : "PNG skipped";
    const previewTone = "dark-preview";
    return `<article class="card">
      <div class="preview ${previewTone}"><img src="${svgRel}" alt="${escapeHtml(item.title)} logo preview"></div>
      <div class="meta">
        <h2>${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.surface)} · SVG master · reduced motion · monochrome · ${pngNote}</p>
        <nav>
          <a href="${svgRel}">SVG</a>
          <a href="${reducedRel}">Reduced</a>
          <a href="${monoRel}">Mono</a>
          <a href="${manifestRel}">Manifest</a>
        </nav>
      </div>
    </article>`;
  }).join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Legacy Identity Export Gallery</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #07090d;
      --panel: #10151d;
      --line: #263241;
      --text: #f7f8fa;
      --muted: #9aa6b5;
      --accent: #315ea8;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: Inter, Avenir Next, Helvetica Neue, Arial, sans-serif;
    }
    header {
      padding: 32px 40px 20px;
      border-bottom: 1px solid var(--line);
    }
    h1 { margin: 0 0 8px; font-size: 28px; letter-spacing: 0; }
    p { margin: 0; color: var(--muted); line-height: 1.5; }
    main {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 18px;
      padding: 24px;
    }
    .card {
      border: 1px solid var(--line);
      background: var(--panel);
      border-radius: 8px;
      overflow: hidden;
    }
    .preview {
      display: grid;
      place-items: center;
      min-height: 220px;
      border-bottom: 1px solid var(--line);
    }
    .dark-preview { background: #050608; }
    .light-preview { background: #f4f1ec; }
    .preview img {
      width: 100%;
      height: 220px;
      object-fit: contain;
      padding: 18px;
    }
    .meta { padding: 16px; }
    h2 { margin: 0 0 8px; font-size: 16px; letter-spacing: 0; }
    nav { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; }
    a { color: var(--accent); text-decoration: none; font-weight: 600; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <header>
    <h1>Legacy Resonance Identity Export Gallery</h1>
    <p>Internal review tool for deterministic logo-system exports. This is not the public website.</p>
  </header>
  <main>
    ${cards}
  </main>
</body>
</html>
`;
}

function renderOutputReadme(items: ExportedAsset[]): string {
  const lines = items.map((item) => `- ${item.title}: ${fileName(item.svgPath)}, ${fileName(item.reducedSvgPath)}, ${fileName(item.monoSvgPath)}, ${fileName(item.manifestPath)}`);
  return `# Legacy Identity Output

Generated by \`npm run export\`.

Open \`gallery/index.html\` in a browser to review the logo-system surfaces.

Transparent logo surfaces are rendered in the canonical dark-site palette for website use.

${lines.join("\n")}
`;
}

async function writeText(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, "utf8");
}

function labelFor(surface: LegacySurface): string {
  return surface.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
}

function relativeFromGallery(path: string): string {
  return `../assets/${fileName(path)}`;
}

function fileName(path: string): string {
  return path.split("/").at(-1) ?? path;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
