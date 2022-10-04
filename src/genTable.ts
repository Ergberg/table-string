import { padBoth, padEnd, padStart } from "./util/padding.js";
import { chalk, header, options, primitives } from "./state/tableState.js";
import { value } from "./util/value.js";
import { Alignment, Chalk } from "./types.js";
import { TS_CHALK, TS_HORIZONTAL_LINE } from "./constants.js";
import { ansiDestruct } from "./util/ansiDestruct.js";

export function genTable(
  data: object[],
  characters: { topRow: any; normal: any; h_line: any; bottom: any }
) {
  const { topRow, normal, h_line, bottom } = { ...characters };
  let res = genRow(topRow, "\n", -3);
  if (options.columns.some((column) => header[column.name])) {
    res += genRow(normal, "\n", -2, header) + genRow(h_line, "\n", -1);
  }
  for (let i = 0; i < data.length; ++i) {
    res += genRow(normal, "\n", i, data[i]);
    if (data[i]?.[TS_HORIZONTAL_LINE]) res += genRow(h_line, "\n", i);
  }
  return res + genRow(bottom, "", data.length);
}

function genRow(
  kind: string,
  newline: string,
  rowIndex: number,
  row?: object
): string {
  const [first, fill, separator, end] = kind.split("");

  let rowChalk: Chalk;
  const ansis = ansiDestruct(row?.[TS_CHALK]);
  row?.[TS_CHALK] && (rowChalk = { start: ansis.first, end: ansis.last });

  return (
    options.columns.reduce((res, columnOption, columnIndex) => {
      const val = value(
        row,
        columnOption.name,
        primitives,
        options.table?.index,
        rowIndex
      );
      const alignment =
        rowIndex === -2
          ? columnOption.alignHeading ??
            options.table?.alignTableHeadings ??
            "center"
          : columnOption.align;
      return (
        res +
        pad(
          val,
          columnOption.minWidth,
          columnOption.maxWidth,
          alignment,
          fill,
          columnOption.padding
        ) +
        (columnIndex === options.columns.length - 1
          ? ""
          : color(separator, rowIndex, columnIndex, rowChalk))
      );
    }, color(first, rowIndex, -1, rowChalk)) +
    color(end, rowIndex, options.columns.length - 1) +
    newline
  );

  function color(
    char: string,
    rowIndex: number,
    columnIndex: number,
    rowChalk?: Chalk
  ): any {
    let res = "";
    if (rowIndex === -2) {
      if (columnIndex >= 0) res = chalk.header.end;
      res +=
        chalk.headerFrame.start +
        char +
        chalk.headerFrame.end +
        (columnIndex === options.columns.length - 1 ? "" : chalk.header.start);
      return res;
    }
    if (row === undefined && rowIndex < 0) {
      if (columnIndex === -1) res = chalk.headerFrame.start;
      res += char;
      if (columnIndex === options.columns.length - 1)
        res += chalk.headerFrame.end;
      return res;
    }
    if (row === undefined) {
      if (columnIndex === -1) res = chalk.frame.start;
      res += char;
      if (columnIndex === options.columns.length - 1) res += chalk.frame.end;
      return res;
    }
    if (rowIndex % 2 === 0) {
      if (columnIndex >= 0)
        res = rowChalk
          ? rowChalk.end
          : options.internal[columnIndex]?.chalk?.end ?? chalk.table.end;
      res +=
        chalk.frame.start +
        char +
        chalk.frame.end +
        (columnIndex === options.columns.length - 1
          ? ""
          : rowChalk
          ? rowChalk.start
          : options.internal[columnIndex + 1]?.chalk?.start ??
            chalk.table.start);
    } else {
      if (columnIndex >= 0)
        res = rowChalk
          ? rowChalk.end
          : options.internal[columnIndex]?.alternateChalk?.end ??
            chalk.alternateTable.end;
      res +=
        chalk.alternateFrame.start +
        char +
        chalk.alternateFrame.end +
        (columnIndex === options.columns.length - 1
          ? ""
          : rowChalk
          ? rowChalk.start
          : options.internal[columnIndex + 1]?.alternateChalk?.start ??
            chalk.alternateTable.start);
    }
    return res;
  }
}

function pad(
  value: any,
  minWidth: number,
  maxWidth: number,
  align: Alignment,
  fill: string,
  padding: number
) {
  align = basedOnType(align, value);
  switch (align) {
    case "center":
      return padBoth(value, minWidth, maxWidth, fill, padding);
    case "right":
      return padStart(value, minWidth, maxWidth, fill, padding);
    default:
      return padEnd(value, minWidth, maxWidth, fill, padding);
  }
}

export function basedOnType(align: Alignment, value: any) {
  if (align === undefined || align === null || align === "based on type")
    align =
      typeof value === "number" || typeof value === "bigint" ? "right" : "left";
  return align;
}
