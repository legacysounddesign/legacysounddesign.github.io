# Legacy Sound Design

Public website and standalone identity engine for Legacy Sound Design.

## Commands

```bash
npm run dev
npm test
npm run export
npm run build
```

`npm run dev` starts the Vite/React site. `npm run export` writes deterministic SVG masters, JSON manifests, review gallery files, PNG derivatives when a compatible local rasterizer is available, and synchronized website identity assets under `public/identity/`.

## System Boundary

- `app/`: React single-page website.
- `src/`: TypeScript identity engine.
- `scripts/`: local export and gallery tooling.
- `tests/`: deterministic and brand-rule checks.
- `public/`: static website assets, including `CNAME` and the generated identity assets.
- `output/identity/`: generated review assets.

The website consumes approved exports from the identity engine and deploys to GitHub Pages for `legacysounddesign.org`.
