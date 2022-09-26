import { padBoth, padEnd, padStart } from "./util/padding.js";
import {
  columns,
  frameChalk,
  headerChalk,
  alternativeChalk,
  header,
  options,
  primitives,
} from "./state/tableState.js";
import { value } from "./util/value.js";
import { H_LINE } from "./tableString.js";

export function genTable(
  data: object[],
  characters: { topRow: any; normal: any; h_line: any; bottom: any }
) {
  const { topRow, normal, h_line, bottom } = { ...characters };
  let res = genRow(topRow, undefined, -3);
  if (columns.some((column) => header[column.name])) {
    res += genRow(normal, header, -2) + genRow(h_line, undefined, -1);
  }
  for (let i = 0; i < data.length; ++i) {
    res += genRow(normal, data[i], i);
    if (data[i]?.[H_LINE]) res += genRow(h_line, undefined, i);
  }
  return res + genRow(bottom).slice(0, -1);
}

function genRow(kind: string, row?: object, rowIndex?: number): string {
  const [first, fill, separator, end] = kind.split("");

  return (
    columns.reduce((res, column, columnIndex) => {
      const val = value(
        row,
        column.name,
        primitives,
        options.tableOptions?.index,
        rowIndex
      );
      const alignment =
        rowIndex === -2
          ? column.alignHeading ??
            options.tableOptions?.alignTableHeadings ??
            "center"
          : column.align;
      return (
        res +
        pad(
          val,
          column.minWidth,
          column.maxWidth,
          alignment,
          fill,
          column.padding
        ) +
        (row !== undefined ? chalkStart(rowIndex) : "") +
        (columnIndex !== columns.length - 1 ? separator : "")
      );
    }, chalkStart(rowIndex) + first) +
    end +
    chalkEnd(rowIndex) +
    "\n"
  );

  function chalkStart(rowIndex) {
    return rowIndex < 0
      ? headerChalk.start
      : rowIndex % 2 === 1
      ? alternativeChalk.start
      : frameChalk.start;
  }
  function chalkEnd(rowIndex) {
    return rowIndex < 0
      ? headerChalk.end
      : rowIndex % 2 === 1
      ? alternativeChalk.end
      : frameChalk.end;
  }
}

function pad(
  value: any,
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
