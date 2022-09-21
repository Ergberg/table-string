import { ColumnOption } from "../types.js";
import { header } from "./tableState.js";

export function initHeader(columns: ColumnOption[]) {
  fromHeadings(columns);
  removeStaleEntries(columns);
}

function fromHeadings(columns: ColumnOption[]) {
  columns.forEach((column) => (header[column.name] = column.heading));
}

function removeStaleEntries(columns: ColumnOption[]) {
  Object.keys(header).forEach(
    (key) => columns.some((column) => column.name === key) || delete header[key]
  );
}
