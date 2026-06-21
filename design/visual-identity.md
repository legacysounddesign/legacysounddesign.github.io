# Legacy Visual Identity Guide

This guide defines the visual identity rules for Legacy Sound Design. It is written for web implementation and should be treated as the bridge between the deterministic identity engine in `src/` and future website, deck, social, and business-material usage.

The current source of truth is the generated identity system:

- Engine: `src/`
- Exported assets: `output/identity/assets/`
- Review gallery: `output/identity/gallery/index.html`
- Strategy references: `design/Legacy Identity Engine.pdf` and `design/Notes.pdf`

## Brand Position

Legacy Sound Design is a boutique audio studio with a premium cinematic identity. The system should feel artistic, immersive, elevated, polished, and accessible.

Use these tone rules when making visual decisions:

- Confident, not arrogant.
- Artistic, not vague.
- Premium, not cold.
- Accessible, not cheap.
- Cinematic, not overdramatic.
- Boutique, not small or casual.

The identity should suggest sound, signal, memory, precision, and atmosphere without becoming a literal waveform brand. The mark is a signal constellation: structured enough to be remembered, expressive enough to feel alive.

## Core Identity Model

Legacy uses a procedural identity grammar instead of a single static logo file. Every output should preserve a fixed brand nucleus and let variation happen only inside controlled zones.

Required invariants:

- Primary name: `Legacy`
- Descriptor: `Sound Design`
- Canonical mark: `legacy-signal-constellation-a`
- Motherform: seven-node signal constellation
- Source format: SVG-first exports from the engine
- Required variants: default, reduced motion, monochrome
- Accessibility modes: normal and high contrast

Do not manually redraw the mark or wordmark. Use approved engine exports as source assets.

## Typography

Use the dedicated typography system in `design/typography.md`. Legacy uses a serif, sans, and mono pairing to separate heritage from forward vision:

```css
--font-display: "Newsreader", Georgia, serif;
--font-body: "Space Grotesk", Inter, "Avenir Next", Arial, sans-serif;
--font-mono: "Space Mono", "SFMono-Regular", Consolas, monospace;
```

Usage rules:

- Use Newsreader 700 for the `Legacy` wordmark, hero headlines, page titles, pull quotes, and atelier/prestige moments.
- Use Space Grotesk 400/500 for body copy, navigation, captions, controls, cards, forms, and client-facing UI.
- Use Space Mono 400/700 for metadata, specs, file labels, version tags, and technical notes.
- Keep normal UI letter spacing at `0`.
- Use moderate positive tracking only for descriptor text, compact labels, and technical metadata.
- Avoid decorative display faces, sci-fi fonts, typewriter fonts, and high-fashion serif pairings outside this approved system.
- Keep body text readable and direct; the brand can be cinematic without making the interface cryptic.
- The visible `Legacy` wordmark in exported SVG assets is outlined from Newsreader 700 and is not dependent on live browser fonts.
- The descriptor remains uppercase `SOUND DESIGN`, outlined from Space Grotesk 500 in exported SVG lockups.

Suggested web type scale:

| Token | Size | Use |
| --- | ---: | --- |
| `type-meta` | `12px` | Space Mono metadata, specs, version tags |
| `type-label` | `13px` | Space Grotesk labels and compact controls |
| `type-small` | `14px` | Secondary UI, helper text |
| `type-body` | `16px` | Space Grotesk body and controls |
| `type-lead` | `20px` | Intros and important supporting copy |
| `type-card-title` | `22px` | Card and panel titles |
| `type-section` | `40px` | Newsreader editorial sections |
| `type-page` | `56px` | Newsreader page headings |
| `type-hero` | `88px` | Newsreader hero moments |

Line-height guidance:

- Dense labels: `1.2`
- Headings: `1.1` to `1.2`
- Body: `1.45` to `1.6`
- Captions: `1.35` to `1.45`

## Color

Use the engine palettes as the canonical color source. Cyan is a signal accent, not a broad decorative wash.

### Canonical Palette

| Token | Hex | Use |
| --- | --- | --- |
| `color-background` | `#07090D` | App/page background, cinematic base |
| `color-field` | `#0B1A2C` | Deep field gradients, mark backgrounds |
| `color-primary` | `#F7F8FA` | Primary text, primary mark strokes |
| `color-secondary` | `#C9D0D8` | Secondary text, descriptor strokes |
| `color-muted` | `#7A8492` | Metadata, subdued trails, inactive UI |
| `color-accent` | `#28C8FF` | Signal highlights, nodes, key actions |
| `color-accent-soft` | `#74DFFF` | Soft signal glow, hover detail |

### High-Contrast Palette

| Token | Hex |
| --- | --- |
| `color-background-high` | `#030406` |
| `color-field-high` | `#07182D` |
| `color-primary-high` | `#FFFFFF` |
| `color-secondary-high` | `#E8EDF4` |
| `color-muted-high` | `#A9B4C3` |
| `color-accent-high` | `#37D7FF` |
| `color-accent-soft-high` | `#7DE7FF` |

### Monochrome Palette

| Token | Hex |
| --- | --- |
| `color-background-mono` | `#050608` |
| `color-field-mono` | `#101216` |
| `color-primary-mono` | `#FFFFFF` |
| `color-secondary-mono` | `#C8CDD4` |
| `color-muted-mono` | `#7F8793` |
| `color-accent-mono` | `#FFFFFF` |
| `color-accent-soft-mono` | `#D9DDE3` |

Implementation rules:

- Default pages should read dark, cinematic, and restrained.
- Use cyan for signal meaning: active state, selected state, key CTA, mark detail, playback/sound cues, and important data.
- Avoid large cyan backgrounds except in controlled campaign artwork.
- Avoid broad purple, beige, orange, brown, rainbow, or generic neon palettes.
- Do not depend on glow or blend modes for text contrast.
- Maintain high-contrast equivalents for critical text and controls.

Suggested semantic tokens:

```css
:root {
  color-scheme: dark;
  --legacy-bg: #07090D;
  --legacy-field: #0B1A2C;
  --legacy-text: #F7F8FA;
  --legacy-text-secondary: #C9D0D8;
  --legacy-text-muted: #7A8492;
  --legacy-accent: #28C8FF;
  --legacy-accent-soft: #74DFFF;
}
```

## Wordmark And Mark

The identity engine exports these approved surfaces:

| Surface | Size | Safe Area | Descriptor | Background | Lockup |
| --- | ---: | ---: | --- | --- | --- |
| `favicon` | `64 x 64` | `0.15` | No | No | Mark |
| `avatar` | `512 x 512` | `0.13` | No | Yes | Mark |
| `horizontal-lockup` | `1200 x 360` | `0.10` | Yes | No | Horizontal |
| `stacked-lockup` | `800 x 800` | `0.11` | Yes | No | Stacked |
| `hero` | `1600 x 900` | `0.08` | Yes | Yes | Field |
| `poster` | `1080 x 1350` | `0.09` | Yes | Yes | Field |
| `social` | `1200 x 630` | `0.09` | Yes | Yes | Field |

Usage rules:

- Use `horizontal-lockup` when the reader needs immediate brand recognition.
- Use `stacked-lockup` for square or centered brand moments.
- Use `favicon` only at small utility sizes.
- Use `avatar` for profile images and square app/social containers.
- Use `hero`, `poster`, and `social` for expressive surfaces where the signal field can breathe.
- Preserve the exported safe area. Do not crop to the outer bounds of visible pixels.
- Keep the hero/field composition consistent with the engine: mark high-center, wordmark lower-left.
- Pair abstract marks with the descriptor in unfamiliar contexts.
- Do not add shadows, bevels, outlines, extra gradients, or live type over the exported lockup.

## Shape Language

Legacy should sit slightly on the kiki side of the kiki/bouba spectrum: precise, signal-like, angular, technical, and intentional. It should be softened by bouba traits only where they support cinematic immersion.

Kiki traits to preserve:

- Angular constellation backbone
- Precise nodes and paths
- Sparse technical composition
- Clean geometry and strong anchor points
- Controlled signal arcs and trails

Bouba traits to use carefully:

- Rounded line caps and joins
- Soft pulse rings
- Subtle glow around signal strokes
- Slow echo/trail behavior
- Deep cinematic field gradients

Avoid:

- Playful blobs
- Decorative orbs
- Bokeh backgrounds
- Generic audio waveforms
- Random particle fields
- Uncontrolled gradients
- Liquid/glass effects as the main identity language

## Layout And Grid

Use a disciplined grid. The interface should feel calm, premium, and operationally clear.

Base spacing:

```css
--space-0: 0;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
--space-24: 96px;
```

Layout rules:

- Use `8px` as the default spacing base.
- Use `4px` only for tight internal relationships.
- Use `24px`, `32px`, `48px`, `64px`, and `96px` for section rhythm.
- Keep hero and field compositions sparse.
- Align UI to simple columns and consistent gutters.
- Maintain generous negative space around marks and lockups.
- Do not crowd the signal field with cards, labels, or dense copy.
- Avoid oversized marketing-card layouts for operational pages.
- Keep brand marks visually separate from navigation and controls.

Recommended page structure:

- Header/navigation: compact, text-led, restrained.
- Main content: dark flat surface with strong typographic hierarchy.
- Hero moments: full-width or full-bleed field, not boxed in a decorative card.
- Repeated content: simple cards only when comparing multiple items.
- Forms/tools: dense but calm, with clear labels and subdued borders.

## Corner Radii

Use modest radii. The identity already has softness in its line joins and pulse fields, so UI containers should stay controlled.

| Token | Value | Use |
| --- | ---: | --- |
| `radius-xs` | `2px` | Hairline technical details |
| `radius-sm` | `4px` | Chips, small controls, tags |
| `radius-md` | `8px` | Cards, panels, buttons, modals |
| `radius-lg` | `8px` | Maximum normal UI radius |

Rules:

- Default UI radius is `8px`.
- Small controls and chips use `4px`.
- Do not use large pill shapes except for small status tags.
- Do not nest rounded cards inside rounded cards.
- Do not make page sections look like floating cards.
- Preserve the engine's mark background radius where it is part of the exported asset.

## Surfaces

The core surface language is flat cinematic. Use depth through tone, spacing, line, and signal glow rather than glass or reflection.

Primary surface styles:

- Page background: flat `#07090D`.
- Deep field: subtle `#07090D` to `#0B1A2C` gradient for identity artwork.
- Panel: flat dark surface with a restrained border.
- Card: flat dark panel, `8px` radius, no heavy shadow.
- Signal artwork: luminous strokes, nodes, trails, and pulse rings.

Avoid as default styles:

- Glassmorphism
- Frosted panels
- Chrome or reflective surfaces
- Glossy button treatments
- Heavy blur layers
- Decorative gradient blobs

Glass or reflective effects may appear only in rare promotional art, not in the core website UI.

## Shadows And Glow

Use shadows sparingly. The brand's depth comes from the signal system, not from elevated UI chrome.

Recommended tokens:

```css
--shadow-none: none;
--shadow-border: inset 0 0 0 1px rgba(201, 208, 216, 0.14);
--shadow-soft: 0 12px 32px rgba(0, 0, 0, 0.28);
--glow-signal: 0 0 18px rgba(40, 200, 255, 0.32);
--glow-signal-soft: 0 0 32px rgba(116, 223, 255, 0.18);
```

Rules:

- Prefer borders and dividers over large shadows.
- Use `--shadow-soft` only for overlays, menus, or modals that need separation.
- Use signal glow only for marks, nodes, pulse fields, selected states, or key brand moments.
- Do not place large decorative shadows behind ordinary cards.
- Do not use glow to make low-contrast text readable.

## Blend Modes

Default blend mode is `normal`.

Rules:

- Use normal compositing for UI, text, buttons, navigation, and cards.
- Screen/lighten-style effects are allowed only inside controlled signal-field artwork.
- Do not rely on blend modes for legibility.
- Do not stack multiple blend modes in production UI unless they have static fallbacks.
- Monochrome and high-contrast variants must still work without blend modes.

## Motion

Motion should feel like resonance, echo, or signal persistence. It should never feel like a generic music visualizer.

Allowed motion:

- Slow pulse rings
- Subtle trail opacity shifts
- Gentle signal glow breathing
- Controlled path emphasis
- Echo or afterimage behavior in campaign moments

Rules:

- Full motion may use the engine's pulse and trail behavior.
- Reduced-motion and off variants are required wherever motion exists.
- Respect `prefers-reduced-motion`.
- Avoid rapid flashes, constant jitter, spinning marks, waveform bounces, and high-frequency particle noise.
- Keep interface motion quiet and functional; reserve expressive motion for hero, poster, social, and campaign surfaces.

Suggested CSS guardrail:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.001ms !important;
  }
}
```

## Imagery And Texture

Imagery should support the studio's cinematic, boutique sound identity. Prefer real project stills, stage/film context, behind-the-scenes sound work, or abstract signal-field artwork generated from the identity system.

Rules:

- Use dark, high-contrast imagery with controlled highlights.
- Let cyan appear as a signal accent, not as a blanket photo filter.
- Avoid generic stock photos of mixing boards, headphones, waveforms, or neon studios.
- Avoid muddy overlays that make the work hard to inspect.
- Use texture sparingly: grain, field noise, and echo trails should be subtle and intentional.

## UI Application

Buttons:

- Primary action: dark surface, cyan border or cyan text/accent.
- Secondary action: subdued border, primary text.
- Destructive action: do not use cyan; use a separate semantic error color in the product layer.
- Keep button radius at `8px` or less.

Cards and panels:

- Use only for repeated items, modals, and genuinely framed tools.
- Do not put cards inside cards.
- Use restrained borders, flat backgrounds, and clear typographic hierarchy.

Navigation:

- Keep compact and text-led.
- Avoid oversized nav pills.
- Use cyan for active or focused states only.

Forms:

- Dark flat inputs with subtle borders.
- Focus states may use cyan.
- Error, warning, and success states should be product semantic colors, not repurposed brand cyan.

## Asset Usage Checklist

Before shipping a visual implementation, confirm:

- The mark or lockup comes from `output/identity/assets/`.
- The correct surface is used for the target context.
- The safe area is preserved.
- The palette matches `src/palettes.ts`.
- The surface behavior matches `src/presets.ts`.
- Text uses the approved Newsreader, Space Grotesk, and Space Mono system.
- Normal UI letter spacing is `0`.
- Cyan is used as an accent, not a wash.
- Motion has reduced and off equivalents.
- Monochrome and high-contrast variants remain available.
- No glassmorphism, reflective chrome, decorative orbs, or generic waveform cliches have been introduced.

## Implementation Starter Tokens

```css
:root {
  color-scheme: dark;

  --legacy-bg: #07090D;
  --legacy-field: #0B1A2C;
  --legacy-text: #F7F8FA;
  --legacy-text-secondary: #C9D0D8;
  --legacy-text-muted: #7A8492;
  --legacy-accent: #28C8FF;
  --legacy-accent-soft: #74DFFF;

  --legacy-font-display: "Newsreader", Georgia, serif;
  --legacy-font-body: "Space Grotesk", Inter, "Avenir Next", Arial, sans-serif;
  --legacy-font-mono: "Space Mono", "SFMono-Regular", Consolas, monospace;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 8px;

  --shadow-border: inset 0 0 0 1px rgba(201, 208, 216, 0.14);
  --shadow-soft: 0 12px 32px rgba(0, 0, 0, 0.28);
  --glow-signal: 0 0 18px rgba(40, 200, 255, 0.32);
  --glow-signal-soft: 0 0 32px rgba(116, 223, 255, 0.18);
}
```
