import { Chalk, ColumnOptions, TableOptions } from "../types.js";

import { initPrimitives } from "./primitives.js";
import { initColumn } from "./column.js";
import { initColumnWidth } from "./columnWidth.js";
import { initHeader } from "./header.js";
import { initChalk } from "./chalk.js";

export const primitives = [];
export const options: {
  columns: ColumnOptions;
  internal: { chalk?: Chalk; alternateChalk?: Chalk }[];
  table: TableOptions;
} = {
  columns: [],
  internal: [],
  table: {},
};

export const header = {};

export const chalk = {
  table: { start: "", end: "" },
  alternateTable: { start: "", end: "" },
  frame: { start: "", end: "" },
  alternateFrame: { start: "", end: "" },
  header: { start: "", end: "" },
  headerFrame: { start: "", end: "" },
};

export function init(
  data: any[],
  columnOptions: ColumnOptions,
  tableOptions: TableOptions
) {
  options.table = check(tableOptions);
  initPrimitives(data);
  initColumn(data, columnOptions, primitives, tableOptions?.index);
  initColumnWidth(data, primitives, tableOptions?.index);
  initHeader();
  initChalk(tableOptions);
}

const tableOptionKeys = [
  "alignTableHeadings",
  "tableChalk",
  "alternateTableChalk",
  "frameChalk",
  "alternateFrameChalk",
  "headerChalk",
  "headerFrameChalk",
  "propertyCompareFunction",
  "index",
];
function check(tableOptions: TableOptions): TableOptions {
  Object.keys(tableOptions ?? {}).forEach((k) => {
    if (!tableOptionKeys.includes(k)) throw Error(`unknown table option: ${k}`);
  });
  return tableOptions;
}
