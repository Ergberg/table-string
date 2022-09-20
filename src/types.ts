export type ColumnOptions = (
  | { column: string; heading?: string; align?: "left" | "center" | "right" }
  // {key: "col", heading: "Column"} can be shortened to {col: "Column"},
  | { [index: string]: string }
  // { column: "column" } can be abbreviated as "column".
  | string
)[];

export type TableOptions = {
  // How to align the column headings
  alignTableHeadings?: "left" | "center" | "right";
  // Want to color the frame? Give any string with ansi color escapes, e.g. chalk.bgBlue.yellow("Take This!")
  frameChalk?: string;
  // When an Object is converted to an array of properties, how to sort those?
  propertyCompareFunction?: (a: any, b: any) => number;
  // the values for an explicit index column
  index?: any[];
};
