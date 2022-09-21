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

function genRow(kind: string, obj?: object, rowIndex?: number): string {
  const [first, fill, separator, end] = kind.split("");

  return (
    columns.reduce(
      (res, column, columnIndex) =>
        res +
        pad(
          value(
            obj,
            column.name,
            primitives,
            options.tableOptions?.index,
            rowIndex
          ),
          column.width,
          rowIndex === -1
            ? column.alignHeading ??
                options.tableOptions?.alignTableHeadings ??
                "center"
            : column.align,
          fill
        ) +
        (obj !== undefined ? frameChalk.start : "") +
        (columnIndex !== columns.length - 1 ? separator : ""),
      "\n" + frameChalk.start + first
    ) +
    end +
    frameChalk.end
  );
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
