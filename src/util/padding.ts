import { ansiDestruct } from "./ansiDestruct.js";


export function padEnd(value: any, maxWidth: number, fill: string) {
  const { width, first, trimmed, last } = ansiDestruct(value);
  return (
    first +
    (fill + trimmed).padEnd(trimmed.length - width + maxWidth, fill) +
    last
  );
}

export function padStart(value: string, maxWidth: number, fill: string) {
  const { width, first, trimmed, last } = ansiDestruct(value);
  return (
    first + trimmed.padStart(trimmed.length - width + maxWidth, fill) + last
  );
}

export function padBoth(value: any, maxWidth: number, fill: string) {
  const { width, first, trimmed, last } = ansiDestruct(value);
  const w = trimmed.length - width + maxWidth;
  const start = first.padStart(Math.trunc((w - trimmed.length) / 2), fill);
  return (start + trimmed).padEnd(w, fill) + last;
}
