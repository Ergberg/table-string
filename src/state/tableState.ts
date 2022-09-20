import { ColumnOptions, TableOptions } from "../types.js";

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
export const column = { keys: [""], headings: [""], alignments: [] };
export const columnWidth: Record<string, number> = {};
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
    column.keys,
    column.headings,
    data,
    primitives,
    tableOptions?.index
  );
  initHeader(column.keys, column.headings);
  initFrameChalk(tableOptions?.frameChalk ?? "");
}
