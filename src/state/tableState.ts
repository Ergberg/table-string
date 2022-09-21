import { ColumnOption, ColumnOptions, TableOptions } from "../types.js";

import { initPrimitives } from "./primitives.js";
import { initColumn } from "./column.js";
import { initColumnWidth } from "./columnWidth.js";
import { initHeader } from "./header.js";
import { initFrameChalk } from "./frameChalk.js";

export const options: {
  columnOptions: ColumnOptions;
  tableOptions: TableOptions;
} = { columnOptions: [], tableOptions: {} };
export const primitives = [];
export const columns:ColumnOption[]=[];
export const header = {};
export const frameChalk = { start: "", end: "" };

export function init(
  data: any[],
  columnOptions: ColumnOptions,
  tableOptions: TableOptions
) {
  options.columnOptions = columnOptions;
  options.tableOptions = tableOptions;
  initPrimitives(data);
  initColumn(data, columnOptions, primitives, tableOptions?.index);
  initColumnWidth(
    columns,
    data,
    primitives,
    tableOptions?.index
  );
  initHeader(columns);
  initFrameChalk(tableOptions?.frameChalk ?? "");
}
