import { ColumnOptions } from "../types.js";
import { column } from "./tableState.js";

export function initColumn(
  data: any[],
  columnOptions: ColumnOptions,
  primitives: any[],
  hasIndex: any
) {
  const keyFilter = keyVisibilityFilter();
  columnOptions ??= keysFromData(data, keyFilter);

  column.keys = keys(columnOptions);
  column.headings = headings(columnOptions);
  column.alignments = alignments(columnOptions);

  additionalColumns(column, primitives, hasIndex);
}

function additionalColumns(
  column: { keys: any; headings: any; alignments: any },
  primitives: any[],
  hasIndex: any
) {
  const hasPrimitives = primitives.some((primitive: any) => primitive);
  if (hasPrimitives && !column.keys.includes("Values")) {
    column.keys.push("Values");
    column.headings.push("Values");
    column.alignments.push("Values");
  }
  if (hasIndex && !column.keys.includes("")) {
    column.keys.unshift("");
    column.headings.unshift("");
    column.alignments.unshift("");
  }
}

function keyVisibilityFilter() {
  return (obj: object) =>
    [...Object.keys(obj)].filter((k) => typeof obj[k] !== "function");
}

function keysFromData(data: any[], keys: (obj: object) => string[]) {
  return [
    ...new Set(
      data.reduce(
        (res: string[], obj) =>
          obj instanceof Object ? [...res, ...keys(obj)] : res,
        []
      )
    ),
  ] as string[];
}

function keys(columnOptions: ColumnOptions) {
  let k: any[];
  return columnOptions.map((e) => {
    const key =
      typeof e === "string"
        ? e
        : (k = Object.keys(e)).length === 1
        ? k[0]
        : e["column"];
    console.assert(
      key !== undefined,
      "column option %O does not define a column",
      e
    );
    return key;
  });
}

function headings(columnOptions: ColumnOptions) {
  let v: any[];
  return columnOptions.map((e) =>
    typeof e === "string"
      ? e
      : (v = Object.values(e)).length === 1
      ? v[0]
      : e["heading"] ?? e["column"]
  );
}

function alignments(columnOptions: ColumnOptions) {
  return columnOptions.map((e) =>
    typeof e === "string" || Object.values(e).length === 1
      ? undefined
      : e["align"]
  );
}
