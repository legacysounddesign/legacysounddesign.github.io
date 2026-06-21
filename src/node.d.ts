declare module "node:assert/strict";
declare module "node:child_process";
declare module "node:crypto";
declare module "node:fs";
declare module "node:fs/promises";
declare module "node:module";
declare module "node:path";
declare module "node:test";
declare module "node:util";

declare module "opentype.js" {
  interface OpenTypePathCommand {
    type: "M" | "L" | "C" | "Q" | "Z";
    x?: number;
    y?: number;
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
  }

  interface OpenTypePath {
    commands: OpenTypePathCommand[];
    toPathData(decimalPlaces?: number): string;
  }

  interface OpenTypeFont {
    ascender: number;
    descender: number;
    unitsPerEm: number;
    getAdvanceWidth(text: string, fontSize: number, options?: { kerning?: boolean }): number;
    getPath(text: string, x: number, y: number, fontSize: number, options?: { kerning?: boolean }): OpenTypePath;
  }

  const opentype: {
    parse(buffer: ArrayBuffer): OpenTypeFont;
  };

  export default opentype;
}

declare const console: {
  error: (...values: unknown[]) => void;
  log: (...values: unknown[]) => void;
};

declare const process: {
  cwd: () => string;
  exitCode?: number;
};
