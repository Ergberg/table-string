import stripAnsi from "strip-ansi";

/* These are the default chars for the table frame*/
export let frame = {
  characters: {
    topRow: "┌─┬┐",
    normal: "│ ││",
    h_line: "├─┼┤",
    bottom: "└─┴┘",
  },
};
/* They can be redefined, e.g. with frame.characters = double.characters */
export const double = {
  characters: {
    topRow: "╔═╦╗",
    normal: "║ ║║",
    h_line: "╠═╬╣",
    bottom: "╚═╩╝",
  },
};
/* ... or frame.characters = ascii.characters */
export const ascii = {
  characters: {
    topRow: ".-..",
    normal: "| ||",
    h_line: "|-+|",
    bottom: "'-''",
  },
};

/**
 * A function that converts objects into a string that represents a table.
 * This is similar to console.table with the following main differences:
 * - It does not log to console but returns a string.
 * - It provides full control over table headings and alignment.
 * - It is compatible with ANSI color sequences, e.g. use the chalk package to color strings.
 * - By default numbers are right aligned. Others values are left aligned, headers are centered.
 * - It is more suitable for normal CLI output due to a less technical look:
 *   - no type based coloring of values
 *   - no quotes around strings, no 'm' suffix for bigints
 *   - does not show values of function type
 *   - for arrays, the index column is only shown if explicitly provided
 *   - the index column by default has no header
 *   - null values are not shown
 * 
 *  Non goals:
 *    - support for emojis. As of now, Emojis do not seem to be well supported in monospaced fonts. Emojis tend to break table spacing.
 *    - Dynamic effects on TTYs based on repositioning the cursor. The result of this function should be a simple string that can be printed to a text file. ANSI color escape sequences are fine and supported.
 *  
 * @param data The content for the table. An array or an object.
 * @param columns Optional column data to control selection, ordering, heading and alignment. {key: "col", heading: "Column"} can be shortened to {col: "Column"}, {column: "column"} can be abbreviated as "column".
 * @param index Data for the index column for arrays e.g. [...o.keys()].map((i) => i + 1)
 * @param option Global options, actually: {alignHeadings: left|right|center}
 * @returns A string representation of the table
 */
export function table(
  data: object,
  columns?: (
    | string
    | { column: string; heading?: string; align?: "left" | "center" | "right" }
    | { [index: string]: string }
  )[],
  options?: {
    alignHeadings?: "left" | "center" | "right";
    index?: any[];
  }
): string {
  if (typeof data !== "object" || data === null) return "" + data;

  if (!Array.isArray(data)) {
    const values = [];
    Object.keys(data).forEach(
      (key: string) =>
        typeof data[key] !== "function" && values.push({ key, data: data[key] })
    );
    values.sort((a, b) => a.key.localeCompare(b.key));
    return table(
      values.map((a) => a.data),
      columns,
      { ...options, index: values.map((a) => a.key) }
    );
  }

  function genTable(data: object[]) {
    const { topRow, normal, h_line, bottom } = { ...frame.characters };
    let res = genRow(topRow);
    if (columns.some((key: string) => header[key])) {
      res += genRow(normal, header, -1) + genRow(h_line);
    }
    for (let i = 0; i < data.length; ++i) {
      res += genRow(normal, data[i], i);
    }
    return res + genRow(bottom);

    function genRow(frame: string, obj?, rowIndex?: number): string {
      const [first, fill, separator, end] = frame.split("");

      function pad(value, fill: string, key: string, align: string) {
        align ??=
          typeof value === "number" || typeof value === "bigint"
            ? "right"
            : "left";
        switch (align) {
          case "center":
            return padBoth("" + value, columnWidth[key], fill);
          case "right":
            return padStart("" + value + fill, columnWidth[key], fill);
          default:
            return padEnd(fill + value, columnWidth[key], fill);
        }
      }

      return `\n${first}${columns.reduce(
        (res, key: string, columnIndex) =>
          res +
          pad(
            value(obj, key, rowIndex),
            fill,
            key,
            rowIndex === -1
              ? options?.alignHeadings ?? "center"
              : alignments[columnIndex]
          ) +
          (columnIndex !== columns.length - 1 ? separator : end),
        ""
      )}`;
    }
  }

  function value(row, key: string, rowIdx: number) {
    return (
      row?.[key] ??
      (key === "Values"
        ? primitives[rowIdx] ?? ""
        : key === ""
        ? options?.index?.[rowIdx] ?? ""
        : "")
    );
  }

  const primitives = [];
  data.forEach((value) =>
    primitives.push(value instanceof Object ? undefined : value)
  );

  let headings;
  let alignments;
  {
    const hasPrimitives = primitives.some((primitive: any) => primitive);
    const keys = (obj) =>
      [...Object.keys(obj)].filter((k) => typeof obj[k] !== "function");
    columns ??= [
      ...new Set(
        data.reduce(
          (res: string[], obj) =>
            obj instanceof Object ? [...res, ...keys(obj)] : res,
          []
        )
      ),
    ] as string[];

    {
      let k, v;
      headings = columns.map((e) =>
        typeof e === "string"
          ? e
          : (v = Object.values(e)).length === 1
          ? v[0]
          : e["heading"] ?? e["column"] ?? ""
      );
      alignments = columns.map((e) =>
        typeof e === "string" || Object.values(e).length === 1
          ? undefined
          : e["align"]
      );
      columns = columns.map((e) =>
        typeof e === "string"
          ? e
          : (k = Object.keys(e)).length === 1
          ? k[0]
          : e["column"]
      );
    }

    hasPrimitives &&
      !columns.includes("Values") &&
      columns.push("Values") &&
      headings.push("Values");
    options?.index &&
      !columns.includes("") &&
      columns.unshift("") &&
      headings.unshift("");
  }

  let columnWidth: Record<string, number> = {};
  columns.forEach((key: string, idx) => {
    columnWidth[key] = length(headings[idx]) + 2;
  });
  data.forEach((row, rowIdx) => {
    columns.forEach(
      (key: string) =>
        (columnWidth[key] = Math.max(
          columnWidth[key],
          length("  " + value(row, key, rowIdx))
        ))
    );
  });

  const header = {};
  columns.forEach((key: string, idx) => (header[key] = headings[idx]));

  function length(s: string) {
    return stripAnsi(s).length;
  }

  function padEnd(s: string, width: number, fill: string) {
    return s.padEnd(s.length - length(s) + width, fill);
  }
  function padStart(s: string, width: number, fill: string) {
    return s.padStart(s.length - length(s) + width, fill);
  }
  function padBoth(s: string, width: number, fill: string) {
    const w = s.length - length(s) + width;
    const start = "".padStart(Math.trunc((w - s.length) / 2), fill);
    return (start + s).padEnd(w, fill);
  }

  return genTable(data);
}
