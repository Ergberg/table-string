import { ansiDestruct } from "./ansiDestruct.js";

export function padEnd(
  value: any,
  minWidth: number,
  maxWidth: number,
  fill: string,
  padding: number
) {
  const { width, first, trimmed, last } = ansiDestruct(value, maxWidth, "left");
  return (
    first +
    (fill.repeat(padding) + trimmed).padEnd(
      trimmed.length - width + minWidth + 2 * padding,
      fill
    ) +
    last
  );
}

export function padStart(
  value: string,
  minWidth: number,
  maxWidth: number,
  fill: string,
  padding: number
) {
  const { width, first, trimmed, last } = ansiDestruct(
    value,
    maxWidth,
    "right"
  );
  return (
    first +
    (trimmed + fill.repeat(padding)).padStart(
      trimmed.length - width + minWidth + 2 * padding,
      fill
    ) +
    last
  );
}

export function padBoth(
  value: any,
  minWidth: number,
  maxWidth: number,
  fill: string,
  padding: number
) {
  const { width, first, trimmed, last } = ansiDestruct(
    value,
    maxWidth,
    "center"
  );
  const w = trimmed.length - width + minWidth + 2 * padding;
  const start = first.padStart(Math.trunc((w - trimmed.length) / 2), fill);
  return (start + trimmed).padEnd(w, fill) + last;
}
