import { columnWidth } from "./tableState.js";
import { value } from "../util/value.js";
import { ansiDestruct } from "../util/ansiDestruct.js";

export function initColumnWidth(
  keys: string[],
  headings: string[],
  data: any[],
  primitives: any[],
  index: any
) {
  initWithHeadings(keys, headings);
  maximizeWithValues(keys, data, primitives, index);
  removeStaleEntries(keys);
}

function initWithHeadings(keys: string[], headings: string[]) {
  keys.forEach((key: string, idx: string | number) => {
    columnWidth[key] = ansiDestruct(headings[idx]).width + 2;
  });
}

function maximizeWithValues(
  keys: string[],
  data: any[],
  primitives: any[],
  index: any
) {
  data.forEach((row: any, rowIdx: number) => {
    keys.forEach((key: string) => {
      const s = "  " + value(row, key, primitives, index, rowIdx);
      columnWidth[key] = Math.max(columnWidth[key], ansiDestruct(s).width);
    });
  });
}

function removeStaleEntries(keys: string[]) {
  Object.keys(columnWidth).forEach(
    (key) => keys.includes(key) || delete columnWidth[key]
  );
}
