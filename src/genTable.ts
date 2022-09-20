import { padBoth, padEnd, padStart } from "./util/padding.js";
import {
  column,
  columnWidth,
  frameChalk,
  header,
  options,
  primitives,
} from "./state/tableState.js";
import { value } from "./util/value.js";

export function genTable(
  data: object[],
  characters: { topRow: any; normal: any; h_line: any; bottom: any }
) {
  const { topRow, normal, h_line, bottom } = { ...characters };

  let res = genRow(topRow);
  if (column.keys.some((key: string) => header[key])) {
    res += genRow(normal, header, -1) + genRow(h_line);
  }
  for (let i = 0; i < data.length; ++i) {
    res += genRow(normal, data[i], i);
  }
  return res + genRow(bottom);
}

function genRow(kind: string, obj?: object, rowIndex?: number): string {
  const [first, fill, separator, end] = kind.split("");

  return `\n${frameChalk.start}${first}${column.keys.reduce(
    (res, key: string, columnIndex) =>
      res +
      pad(
        value(obj, key, primitives, options.tableOptions?.index, rowIndex),
        columnWidth[key],
        rowIndex === -1
          ? options.tableOptions?.alignTableHeadings ?? "center"
          : column.alignments[columnIndex],
        fill
      ) +
      (obj !== undefined ? frameChalk.start : "") +
      (columnIndex !== column.keys.length - 1 ? separator : end),
    ""
  )}${frameChalk.end}`;
}

function pad(value: string, columnWidth: number, align: string, fill: string) {
  align ??=
    typeof value === "number" || typeof value === "bigint" ? "right" : "left";
  switch (align) {
    case "center":
      return padBoth(value, columnWidth, fill);
    case "right":
      return padStart(value + fill, columnWidth, fill);
    default:
      return padEnd(value, columnWidth, fill);
  }
}
