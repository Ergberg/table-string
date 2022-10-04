import { value } from "../util/value.js";
import { ansiDestruct } from "../util/ansiDestruct.js";
import { ColumnOption } from "../types.js";
import { options } from "./tableState.js";

export function initColumnWidth(data: any[], primitives: any[], index: any) {
  initWithHeadings(options.columns);
  maximizeWithValues(options.columns, data, primitives, index);
  cappedByMaxWidth(options.columns);
}

function initWithHeadings(columns: ColumnOption[]) {
  columns.forEach((column: ColumnOption) => {
    column.minWidth = Math.max(
      column.minWidth ?? 0,
      ansiDestruct(column.heading).width
    );
  });
}

function maximizeWithValues(
  columns: ColumnOption[],
  data: any[],
  primitives: any[],
  index: any
) {
  data.forEach((row: any, rowIdx: number) => {
    columns.forEach((column: ColumnOption) => {
      const s = value(row, column.name, primitives, index, rowIdx);
      column.minWidth = Math.max(column.minWidth, ansiDestruct(s).width);
    });
  });
}

function cappedByMaxWidth(columns: ColumnOption[]) {
  columns.forEach((column) => {
    column.maxWidth ??= column.minWidth;
    column.minWidth = Math.min(column.minWidth, column.maxWidth);
  });
}
