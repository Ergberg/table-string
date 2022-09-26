import { H_LINE } from "../tableString.js";
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
      padding: padding(e),
      ...width(e),
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
    columns.push({
      name: "Values",
      heading: "Values",
      padding: 1,
    });
  }
  if (hasIndex && !has(columns, "")) {
    columns.unshift({ name: "", heading: "", padding: 1 });
  }
}

export function has(columns: ColumnOption[], key: string) {
  return columns.some((column) => column.name === key);
}

function keyVisibilityFilter() {
  return (obj: object) => {
    const res = [...Object.keys(obj)].filter(
      (k) => k!==H_LINE && typeof obj[k] !== "function"
    );
    return res;
  };
}

function namesFromData(data: any[], keys: (obj: object) => string[]) {
  return [
    ...new Set(
      data.reduce((res: string[], obj) => {
        return obj !== null && typeof obj === "object"
          ? [...res, ...keys(obj)]
          : res;
      }, [])
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
  if (name === undefined)
    throw Error(
      `Column option {${Object.keys(e)
        .map((key) => `${key}: ${e[key]}`)
        .join(", ")}} does not define a name`
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

function padding(e) {
  return typeof e === "string" || Object.values(e).length === 1
    ? 1
    : e["padding"] ?? 1;
}

function width(e) {
  const minWidth =
    typeof e === "string" || Object.values(e).length === 1
      ? undefined
      : e["minWidth"] ?? e["width"];
  const maxWidth =
    typeof e === "string" || Object.values(e).length === 1
      ? undefined
      : e["maxWidth"] ?? e["width"];
  if (minWidth !== undefined && maxWidth !== undefined && maxWidth < minWidth) {
    throw Error(
      `Column "${e["name"]}": minWidth (${minWidth}) must not exceed maxWidth (${maxWidth})`
    );
  }
  return { minWidth, maxWidth };
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
