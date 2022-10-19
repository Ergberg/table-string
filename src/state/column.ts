import { TS_CHALK, TS_HORIZONTAL_LINE } from "./../constants.js";
import { Chalk, ColumnOption, ColumnOptions } from "../types.js";
import { ansiDestruct } from "../util/ansiDestruct.js";
import { options } from "./tableState.js";

export function initColumn(
  data: any[],
  columnOptions: ColumnOptions,
  primitives: any[],
  hasIndex: any
) {
  const keyFilter = keyVisibilityFilter();
  columnOptions ??= namesFromData(data, keyFilter);
  options.columns.length = 0;
  options.internal.length = 0;
  columnOptions.forEach(
    (e) => (
      options.columns.push({
        name: name(e),
        heading: heading(e),
        padding: padding(e),
        ...width(e),
        align: align(e),
        alignHeading: alignHeading(e),
      }),
      options.internal.push(
        setDefault({
          chalk: chalk(e),
          alternateChalk: alternateChalk(e),
        })
      )
    )
  );

  additionalColumns(primitives, hasIndex);
}

function additionalColumns(primitives: any[], hasIndex: any) {
  const hasPrimitives = primitives.some((primitive: any) => primitive);
  if (hasPrimitives && !has(options.columns, "Values")) {
    options.columns.push({
      name: "Values",
      heading: "Values",
      padding: 1,
    });
    options.internal.push({
      chalk: undefined,
      alternateChalk: undefined,
    });
  }

  if (hasIndex && !has(options.columns, "")) {
    options.columns.unshift({ name: "", heading: "", padding: 1 });
    options.internal.unshift({
      chalk: undefined,
      alternateChalk: undefined,
    });
  }
}

export function has(columns: ColumnOptions, key: string) {
  return columns.some((column) => column.name === key);
}

function keyVisibilityFilter() {
  return (obj: object) => {
    const res = [...Object.keys(obj)].filter(
      (k) =>
        k !== TS_HORIZONTAL_LINE &&
        k !== TS_CHALK &&
        typeof obj[k] !== "function"
    );
    return res;
  };
}

function namesFromData(
  data: any[],
  keys: (obj: object) => string[]
): ColumnOptions {
  return [
    ...new Set<string>(
      data.reduce((res: string[], obj) => {
        return obj !== null && typeof obj === "object"
          ? [...res, ...keys(obj)]
          : res;
      }, [])
    ),
  ].map((name) => ({ name }));
}

function name(e: ColumnOption) {
  let k: any[];
  const name = e.name;
  if (name === undefined)
    throw Error(
      `Column option {${Object.keys(e)
        .map((key) => `${key}: ${e[key]}`)
        .join(", ")}} does not define a name`
    );
  return name;
}

function heading(e: ColumnOption) {
  return e.heading ?? e.name;
}

function padding(e: ColumnOption) {
  return e.padding ?? 1;
}

function width(e: ColumnOption) {
  const minWidth = e.minWidth ?? e["width"];
  const maxWidth = e.maxWidth ?? e["width"];
  if (minWidth !== undefined && maxWidth !== undefined && maxWidth < minWidth) {
    throw Error(
      `Column "${e["name"]}": minWidth (${minWidth}) must not exceed maxWidth (${maxWidth})`
    );
  }
  return { minWidth, maxWidth };
}

function align(e: ColumnOption) {
  return e.align ?? "based on type";
}

function alignHeading(e: ColumnOption) {
  return e.alignHeading ?? e.align;
}
function chalk(e: ColumnOption): Chalk {
  if (e.chalk === undefined) return undefined;
  const ansi = ansiDestruct(e.chalk);
  return { start: ansi.first, end: ansi.last };
}
function alternateChalk(e: ColumnOption): Chalk {
  if (e.alternateChalk === undefined) return undefined;
  const ansi = ansiDestruct(e.alternateChalk);
  return { start: ansi.first, end: ansi.last };
}
function setDefault(column: { chalk: Chalk; alternateChalk: Chalk }): {
  chalk?: Chalk;
  alternateChalk?: Chalk;
} {
  column.alternateChalk ??= column.chalk;
  return column;
}
