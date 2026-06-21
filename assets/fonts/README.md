# Legacy Vendored Fonts

These TTF files are vendored for deterministic SVG outlining in the identity engine. Website implementation may use the Google Fonts CDN, but exported SVG assets should not depend on browser font availability.

Font files:

- `Newsreader-700.ttf`
- `SpaceGrotesk-400.ttf`
- `SpaceGrotesk-500.ttf`
- `SpaceMono-400.ttf`
- `SpaceMono-700.ttf`

Public font references:

- https://fonts.google.com/specimen/Newsreader
- https://fonts.google.com/specimen/Space+Grotesk
- https://fonts.google.com/specimen/Space+Mono

Implementation note:

- `src/typography.ts` loads these files locally and converts visible lockup text to SVG path outlines through `opentype.js`.
