import { value } from "../util/value.js";
import { ansiDestruct } from "../util/ansiDestruct.js";
import { ColumnOption } from "../types.js";

export function initColumnWidth(
  columns: ColumnOption[],
  data: any[],
  primitives: any[],
  index: any
) {
  initWithHeadings(columns);
  maximizeWithValues(columns, data, primitives, index);
}

function initWithHeadings(columns: ColumnOption[]) {
  columns.forEach((column: ColumnOption) => {
    column.width = Math.max(
      column.width ?? 0,
      ansiDestruct(column.heading).width + 2
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
      const s = "  " + value(row, column.name, primitives, index, rowIdx);
      column.width = Math.max(column.width, ansiDestruct(s).width);
    });
  });
}
