# Legacy Typography Guide

This document is the source of truth for Legacy Sound Design typography. It replaces the earlier Inter-only direction with a serif, sans, and mono system: Newsreader for prestige, Space Grotesk for forward-facing clarity, and Space Mono for technical metadata.

Use this alongside:

- `design/visual-identity.md`
- `design/copy-design.md`
- `assets/fonts/README.md`

## Typography Position

Legacy needs type with two signals at once:

- Heritage and heft: the studio should feel like an atelier with craft, memory, and prestige.
- Forward vision: the website should still feel contemporary, precise, and technically capable.

The type system should not feel like a generic tech startup, a luxury fashion brand, or a retro recording studio. It should feel cinematic, exacting, and human.

## Font System

| Role | Font | Weight | Use |
| --- | --- | ---: | --- |
| Display and wordmark | Newsreader | `700` | `Legacy` wordmark, hero headlines, page titles, pull quotes, high-prestige atelier moments |
| Body and UI | Space Grotesk | `400` | Body copy, paragraphs, navigation, buttons, forms, explanatory text |
| UI emphasis | Space Grotesk | `500` | Section labels, card titles, CTAs, descriptor text, selected states |
| Metadata | Space Mono | `400` | Specs, file labels, tiny metadata, technical notes, asset tables |
| Metadata emphasis | Space Mono | `700` | Short labels, status values, version tags, strong technical callouts |

Font references:

- https://fonts.google.com/specimen/Newsreader
- https://fonts.google.com/specimen/Space+Grotesk
- https://fonts.google.com/specimen/Space+Mono

## Brand Wordmark

The visible wordmark is:

```text
Legacy
```

Rules:

- Use Title Case, not all caps.
- Use Newsreader 700.
- Use it as a mark-level element, not ordinary heading text.
- Do not fake the wordmark with browser text in exported SVG assets.
- Exported SVG lockups must use outlined paths generated from the vendored Newsreader font file.
- Keep hidden SVG accessibility text as live text for screen readers and metadata.

The descriptor remains:

```text
SOUND DESIGN
```

Rules:

- Use uppercase.
- Use Space Grotesk 500.
- Use moderate tracking.
- Keep `SOUND` available as the accent-color segment in lockups when the engine splits the descriptor.

## Website Hierarchy

### Hero

Use Newsreader 700 for the main line. Keep it large, calm, and confident.

Recommended:

```css
.hero-title {
  font-family: "Newsreader", Georgia, serif;
  font-weight: 700;
  font-size: clamp(48px, 8vw, 112px);
  line-height: 0.95;
  letter-spacing: 0;
}
```

Use Space Grotesk 400 for supporting copy:

```css
.hero-copy {
  font-family: "Space Grotesk", Inter, "Avenir Next", Arial, sans-serif;
  font-weight: 400;
  font-size: clamp(18px, 2vw, 24px);
  line-height: 1.45;
  letter-spacing: 0;
}
```

### Headings

Use Newsreader when the heading is editorial, brand-led, or emotionally important. Use Space Grotesk when the heading is functional, navigational, or part of a dense interface.

| Level | Font | Weight | Size |
| --- | --- | ---: | --- |
| Hero | Newsreader | `700` | `72px` to `112px` |
| Page title | Newsreader | `700` | `48px` to `72px` |
| Editorial section | Newsreader | `700` | `36px` to `56px` |
| Functional section | Space Grotesk | `500` | `24px` to `32px` |
| Card title | Space Grotesk | `500` | `18px` to `24px` |

### Body

Use Space Grotesk 400 for body copy.

```css
body {
  font-family: "Space Grotesk", Inter, "Avenir Next", Arial, sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.55;
  letter-spacing: 0;
}
```

Use Space Grotesk 500 only for emphasis, not for entire long-form passages.

### Metadata

Use Space Mono for technical and operational details:

- Asset names
- Surface labels
- Version tags
- Build IDs
- Spec tables
- Timecodes
- File types
- Input/output notes

```css
.meta {
  font-family: "Space Mono", "SFMono-Regular", Consolas, monospace;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.4;
  letter-spacing: 0;
}
```

## Google Fonts CDN

Use CDN delivery for the website v1.

Recommended `<head>` links:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:wght@700&family=Space+Grotesk:wght@400;500&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

Recommended CSS variables:

```css
:root {
  --font-display: "Newsreader", Georgia, serif;
  --font-body: "Space Grotesk", Inter, "Avenir Next", Arial, sans-serif;
  --font-mono: "Space Mono", "SFMono-Regular", Consolas, monospace;
}
```

Production hardening note:

- The public website may start with Google Fonts CDN.
- If privacy, uptime, or cache control becomes a priority, self-host the same font files and keep the family names unchanged.
- SVG exports do not use the CDN. They use local vendored TTF files and convert visible type to paths.

## Type Scale Tokens

Use this as the default website scale.

| Token | Size | Line Height | Font |
| --- | ---: | ---: | --- |
| `type-meta` | `12px` | `1.4` | Space Mono 400 |
| `type-label` | `13px` | `1.3` | Space Grotesk 500 |
| `type-small` | `14px` | `1.45` | Space Grotesk 400 |
| `type-body` | `16px` | `1.55` | Space Grotesk 400 |
| `type-lead` | `20px` | `1.45` | Space Grotesk 400 |
| `type-card-title` | `22px` | `1.2` | Space Grotesk 500 |
| `type-section` | `40px` | `1.05` | Newsreader 700 |
| `type-page` | `56px` | `1` | Newsreader 700 |
| `type-hero` | `88px` | `0.95` | Newsreader 700 |

## Letter Spacing

Default letter spacing is `0`.

Allowed exceptions:

- Descriptor text may use moderate positive tracking.
- Space Mono labels may use small uppercase tracking in compact technical UI.
- The outlined SVG engine may use optical tracking to fit lockups.

Avoid:

- Negative tracking on website body text.
- Wide tracking on long headings.
- All-caps serif headlines except rare campaign artwork.

## SVG Export Rules

Visible SVG typography must be outlined.

Engine rules:

- `Legacy` uses `assets/fonts/Newsreader-700.ttf`.
- `SOUND DESIGN` uses `assets/fonts/SpaceGrotesk-500.ttf`.
- Outlines are generated locally through `opentype.js`.
- Exported SVGs must not link to Google Fonts.
- Hidden accessibility `<text>` elements remain live text.
- The mark geometry and motherform stay independent from the website font stack.

## Do And Do Not

Do:

- Let Newsreader create the atelier/prestige signal.
- Let Space Grotesk carry clarity, navigation, body copy, and client-facing instructions.
- Use Space Mono sparingly for specs and technical texture.
- Keep the system quiet, spacious, and exact.

Do not:

- Use Inter as the primary brand font.
- Use decorative display fonts.
- Set long paragraphs in Newsreader.
- Let mono typography dominate the public website.
- Depend on browser font loading for SVG logo exports.
