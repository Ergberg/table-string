import { padBoth, padEnd, padStart } from "./util/padding.js";
import {
  columns,
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
  if (columns.some((column) => header[column.name])) {
    res += genRow(normal, header, -1) + genRow(h_line);
  }
  for (let i = 0; i < data.length; ++i) {
    res += genRow(normal, data[i], i);
  }
  return res + genRow(bottom);
}

function genRow(kind: string, row?: object, rowIndex?: number): string {
  const [first, fill, separator, end] = kind.split("");

  return (
    columns.reduce(
      (res, column, columnIndex) => (
        res +
          pad(
            value(
              row,
              column.name,
              primitives,
              options.tableOptions?.index,
              rowIndex
            ),
            column.minWidth,
            column.maxWidth - 2,
            rowIndex === -1
              ? column.alignHeading ??
                  options.tableOptions?.alignTableHeadings ??
                  "center"
              : column.align,
            fill,
            column.padding
          ) +
          (row !== undefined ? frameChalk.start : "") +
          (columnIndex !== columns.length - 1 ? separator : "")
      ),
      frameChalk.start + first
    ) +
    end +
    frameChalk.end +
    "\n"
  );
}

function pad(
  value: string,
  minWidth: number,
  maxWidth: number,
  align: string,
  fill: string,
  padding: number
) {
  align ??=
    typeof value === "number" || typeof value === "bigint" ? "right" : "left";
  switch (align) {
    case "center":
      return padBoth(value, minWidth, maxWidth, fill, padding);
    case "right":
      return padStart(value, minWidth, maxWidth, fill, padding);
    default:
      return padEnd(value, minWidth, maxWidth, fill, padding);
  }
}
