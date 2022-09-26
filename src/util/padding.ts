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
  const w = (minWidth - width) / 2;
  return (
    first +
    (fill.repeat(padding + w) + trimmed).padEnd(
      trimmed.length - width + minWidth + 2 * padding,
      fill
    ) +
    last
  );
}
