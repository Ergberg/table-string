import { ColumnOption, ColumnOptions } from "../types.js";
import { columns } from "./tableState.js";

export function initColumn(
  data: any[],
  columnOptions: ColumnOptions,
  primitives: any[],
  hasIndex: any
) {
  const keyFilter = keyVisibilityFilter();
  columnOptions ??= namesFromData(data, keyFilter);

  columns.length = 0;
  columnOptions.forEach((e) =>
    columns.push({
      name: name(e),
      heading: heading(e),
      width: width(e),
      align: align(e),
      alignHeading: alignHeading(e),
    })
  );

  additionalColumns(columns, primitives, hasIndex);
}

function additionalColumns(
  columns: ColumnOption[],
  primitives: any[],
  hasIndex: any
) {
  const hasPrimitives = primitives.some((primitive: any) => primitive);
  if (hasPrimitives && !has(columns, "Values")) {
    columns.push({ name: "Values", heading: "Values", align: "left" });
  }
  if (hasIndex && !has(columns, "")) {
    columns.unshift({ name: "", heading: "", align: "left" });
  }
}

export function has(columns: ColumnOption[], key: string) {
  return columns.some((column) => column.name === key);
}

function keyVisibilityFilter() {
  return (obj: object) =>
    [...Object.keys(obj)].filter((k) => typeof obj[k] !== "function");
}

function namesFromData(data: any[], keys: (obj: object) => string[]) {
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

function name(e: string | ColumnOption | { [index: string]: string }) {
  let k: any[];
  const name =
    typeof e === "string"
      ? e
      : (k = Object.keys(e)).length === 1
      ? k[0]
      : e["name"];
  console.assert(
    name !== undefined,
    "column option %O does not define a name",
    e
  );
  return name;
}

function heading(e: string | { [s: string]: any }) {
  let v: any[];
  return typeof e === "string"
    ? e
    : (v = Object.values(e)).length === 1
    ? v[0]
    : e["heading"] ?? e["name"];
}

function width(e) {
  return typeof e === "string" || Object.values(e).length === 1
    ? undefined
    : e["width"];
}

function align(e) {
  return typeof e === "string" || Object.values(e).length === 1
    ? undefined
    : e["align"];
}

function alignHeading(e) {
  return typeof e === "string" || Object.values(e).length === 1
    ? undefined
    : e["alignHeading"] ?? e["align"];
}
