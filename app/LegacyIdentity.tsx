import { useMemo } from "react";

type IdentitySurface = "hero" | "horizontal-lockup" | "stacked-lockup" | "avatar";

interface LegacyIdentityProps {
  className?: string;
  showBackground?: boolean;
  seed?: string;
  surface: IdentitySurface;
  title?: string;
}

const paperPalette = {
  background: "#F7F3EA",
  field: "#EDE7DB",
  primary: "#111820",
  secondary: "#3B4650",
  muted: "#87919B",
  accent: "#315EA8",
  accentSoft: "#7894D4",
};

const surfacePresets: Record<IdentitySurface, { width: number; height: number; lockup: "field" | "horizontal" | "stacked" | "mark" }> = {
  hero: { width: 1600, height: 900, lockup: "field" },
  "horizontal-lockup": { width: 1200, height: 360, lockup: "horizontal" },
  "stacked-lockup": { width: 800, height: 800, lockup: "stacked" },
  avatar: { width: 512, height: 512, lockup: "mark" },
};

export function LegacyIdentity({ className, seed = "legacy-site", showBackground = true, surface, title = "Legacy Sound Design" }: LegacyIdentityProps) {
  const preset = surfacePresets[surface];
  const geometry = useMemo(() => buildGeometry(preset.width, preset.height, preset.lockup, `${surface}:${seed}`), [preset, seed, surface]);
  const titleId = `legacy-${surface}-${stableHash(seed)}-title`;
  const showText = preset.lockup !== "mark";
  const showField = showBackground && (preset.lockup === "field" || preset.lockup === "mark" || preset.lockup === "stacked");

  return (
    <svg
      className={className}
      viewBox={`0 0 ${preset.width} ${preset.height}`}
      role="img"
      aria-labelledby={titleId}
      data-engine="legacy-react-modular"
      data-surface={surface}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <defs>
        <linearGradient id={`${titleId}-field`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={paperPalette.background} />
          <stop offset="58%" stopColor={paperPalette.field} />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id={`${titleId}-accent`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={paperPalette.accentSoft} />
          <stop offset="54%" stopColor={paperPalette.accent} />
          <stop offset="100%" stopColor={paperPalette.field} />
        </linearGradient>
      </defs>

      {showField ? <rect width="100%" height="100%" rx={preset.lockup === "mark" ? preset.width * 0.08 : 0} fill={`url(#${titleId}-field)`} /> : null}
      {preset.lockup === "field" ? <ResonanceField geometry={geometry} gradientId={`${titleId}-accent`} /> : null}
      <g className="identity-modules">
        {geometry.modules.map((module, index) =>
          module.kind === "dot" ? (
            <circle
              key={module.key}
              className={`identity-module ${module.role === "accent" ? "identity-accent" : ""}`}
              style={{ transitionDelay: `${index * 18}ms` }}
              cx={module.x + module.width / 2}
              cy={module.y + module.height / 2}
              r={module.width * 0.55}
              fill={fillForModule(module.color, `${titleId}-accent`)}
              opacity={module.opacity}
            />
          ) : (
            <rect
              key={module.key}
              className={`identity-module ${module.role === "accent" ? "identity-accent" : ""}`}
              style={{ transitionDelay: `${index * 18}ms` }}
              x={module.x}
              y={module.y}
              width={module.width}
              height={module.height}
              rx={module.radius}
              fill={fillForModule(module.color, `${titleId}-accent`)}
              opacity={module.opacity}
            />
          ),
        )}
      </g>

      {showText ? <Wordmark lockup={preset.lockup} width={preset.width} height={preset.height} /> : null}
    </svg>
  );
}

function ResonanceField({ geometry, gradientId }: { geometry: ReturnType<typeof buildGeometry>; gradientId: string }) {
  return (
    <g className="identity-field-lines" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <circle
          key={index}
          className="identity-pulse"
          cx={geometry.center.x}
          cy={geometry.center.y}
          r={geometry.box.size * (0.32 + index * 0.04)}
          fill="none"
          stroke={index % 2 === 0 ? `url(#${gradientId})` : paperPalette.muted}
          strokeWidth={Math.max(1, geometry.stroke * 0.14)}
          opacity={0.18 - index * 0.02}
        />
      ))}
      <path
        d={`M ${geometry.box.x - geometry.box.size * 0.7} ${geometry.center.y + geometry.box.size * 0.46} H ${geometry.center.x - geometry.box.size * 0.18} l ${geometry.box.size * 0.045} ${-geometry.box.size * 0.04} l ${geometry.box.size * 0.06} ${geometry.box.size * 0.1} l ${geometry.box.size * 0.045} ${-geometry.box.size * 0.065} H ${geometry.box.x + geometry.box.size * 1.7}`}
        fill="none"
        stroke={paperPalette.muted}
        strokeWidth={Math.max(1, geometry.stroke * 0.12)}
        opacity="0.42"
      />
    </g>
  );
}

function Wordmark({ lockup, width, height }: { lockup: "field" | "horizontal" | "stacked" | "mark"; width: number; height: number }) {
  if (lockup === "horizontal") {
    return (
      <g className="identity-wordmark" transform={`translate(${width * 0.3} ${height * 0.42})`}>
        <text className="identity-legacy" x="0" y="0">Legacy</text>
        <text className="identity-descriptor" x="2" y="44">Sound design</text>
      </g>
    );
  }

  if (lockup === "stacked") {
    return (
      <g className="identity-wordmark" textAnchor="middle" transform={`translate(${width * 0.5} ${height * 0.74})`}>
        <text className="identity-legacy" x="0" y="0">Legacy</text>
        <text className="identity-descriptor" x="0" y="54">Sound design</text>
      </g>
    );
  }

  return (
    <g className="identity-wordmark" transform={`translate(${width * 0.13} ${height * 0.72})`}>
      <text className="identity-legacy" x="0" y="0">Legacy</text>
      <text className="identity-descriptor" x="4" y="78">Sound design</text>
    </g>
  );
}

function buildGeometry(width: number, height: number, lockup: "field" | "horizontal" | "stacked" | "mark", seed: string) {
  const safe = Math.min(width, height) * 0.1;
  const size = lockup === "horizontal"
    ? Math.min(height - safe * 2, width * 0.22)
    : lockup === "field"
      ? Math.min(width, height) * 0.42
      : Math.min(width, height) * 0.54;
  const box = lockup === "horizontal"
    ? { x: safe, y: (height - size) / 2, size }
    : lockup === "field"
      ? { x: width * 0.5 - size * 0.5, y: height * 0.16, size }
      : { x: width * 0.5 - size * 0.5, y: height * 0.18, size };
  const unit = size / 100;
  const center = { x: box.x + size / 2, y: box.y + size / 2 };
  const stroke = Math.max(3, size * 0.016);
  const modules = Array.from({ length: 6 }, (_, index) => {
    const rng = makeRng(stableHash(`${seed}:${index}`));
    return buildCandidateModules(rng, center, unit);
  })
    .map((candidate) => ({ candidate, score: scoreModules(candidate) }))
    .sort((a, b) => b.score - a.score)[0].candidate;

  return {
    box,
    center,
    stroke,
    modules,
  };
}

function buildCandidateModules(rng: () => number, center: { x: number; y: number }, unit: number) {
  const moduleCount = 9 + Math.floor(rng() * 4) * 2;
  const centerIndex = Math.floor(moduleCount / 2);
  const spacing = 86 / Math.max(1, moduleCount - 1);
  const profileShift = (rng() - 0.5) * 0.22;
  const accentCenter = Math.max(1, Math.min(moduleCount - 2, Math.floor(rng() * moduleCount)));
  const accentSpan = 1 + Math.floor(rng() * 2);
  const secondaryAccent = Math.max(1, Math.min(moduleCount - 2, Math.floor(rng() * moduleCount)));
  const rawHeights = Array.from({ length: moduleCount }, (_, index) => {
    const ratio = moduleCount === 1 ? 0 : index / (moduleCount - 1) * 2 - 1;
    const centered = index === centerIndex;
    const shiftedRatio = Math.max(-1, Math.min(1, ratio - profileShift));
    const envelope = Math.max(0.1, 1 - Math.abs(shiftedRatio) ** 1.62);
    const localPulse = centered ? 1 : 0.82 + rng() * 0.44;
    return (7 + envelope * 74 * localPulse) * unit;
  });
  const heights = rawHeights.map((height, index) => {
    if (index === 0 || index === rawHeights.length - 1) return Math.max(height, 5 * unit);
    const neighborAverage = (rawHeights[index - 1] + rawHeights[index + 1]) / 2;
    return Math.max(Math.min(height, neighborAverage * 1.72), neighborAverage * 0.38);
  });

  return heights.map((moduleHeight, index) => {
    const ratio = moduleCount === 1 ? 0 : index / (moduleCount - 1) * 2 - 1;
    const edge = index === 0 || index === moduleCount - 1;
    const centered = index === centerIndex;
    const offsetJitter = centered ? 0 : (rng() - 0.5) * spacing * 0.22;
    const offset = ratio * 43 + offsetJitter;
    const moduleWidth = (centered ? 4.8 : edge ? 3.1 + rng() * 0.9 : 3.5 + rng() * 1.2) * unit;
    const accentDistance = Math.abs(index - accentCenter);
    const color = centered
      ? "primary"
      : accentDistance <= accentSpan
        ? rng() > 0.38 ? "accent" : "accentSoft"
        : index === secondaryAccent
          ? "accentSoft"
          : rng() > 0.88
            ? "muted"
            : "secondary";

    return {
      key: `${offset}-${index}`,
      kind: edge && rng() > 0.45 ? "dot" : "bar",
      x: center.x + offset * unit - moduleWidth / 2,
      y: center.y - moduleHeight / 2,
      width: moduleWidth,
      height: moduleHeight,
      radius: moduleWidth * 0.42,
      role: color === "accent" || color === "accentSoft" ? "accent" : color,
      color,
      opacity: edge ? 0.72 : 0.96,
    };
  });
}

function scoreModules(modules: ReturnType<typeof buildCandidateModules>) {
  const heights = modules.map((module) => module.height);
  const center = Math.floor(heights.length / 2);
  const max = Math.max(...heights);
  const leftMass = heights.slice(0, center).reduce((sum, value) => sum + value, 0);
  const rightMass = heights.slice(center + 1).reduce((sum, value) => sum + value, 0);
  const centerDominance = heights[center] / max;
  const balance = 1 - Math.min(0.9, Math.abs(leftMass - rightMass) / Math.max(leftMass, rightMass, 1));
  const rhythmPenalty = heights.slice(1).reduce((penalty, height, index) => {
    const previous = heights[index];
    const ratio = Math.max(height, previous) / Math.max(1, Math.min(height, previous));
    return penalty + Math.max(0, ratio - 2.05);
  }, 0);
  const accentCount = modules.filter((module) => module.color === "accent" || module.color === "accentSoft").length;
  const accentScore = accentCount >= 2 && accentCount <= 5 ? 1 : 0.45;
  const edgeDiscipline = heights[0] < max * 0.42 && heights[heights.length - 1] < max * 0.42 ? 1 : 0.4;

  return centerDominance * 1.4 + balance * 1.1 + accentScore + edgeDiscipline - rhythmPenalty * 0.6;
}

function fillForModule(color: string, accentGradientId: string) {
  if (color === "accent") return `url(#${accentGradientId})`;
  if (color === "accentSoft") return paperPalette.accentSoft;
  if (color === "primary") return paperPalette.primary;
  if (color === "muted") return paperPalette.muted;
  return paperPalette.secondary;
}

function stableHash(input: string) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function makeRng(seedHex: string) {
  let state = Number.parseInt(seedHex.slice(0, 8), 16) >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}
