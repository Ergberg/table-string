export type ColumnOption = {
  name: string;
  heading?: string;
  width?: number;
  align?: "left" | "center" | "right";
  alignHeading?: "left" | "center" | "right";
};

export type ColumnOptions = (
  | ColumnOption
  // {name: "col", heading: "Column"} can be shortened to {col: "Column"},
  | { [index: string]: string }
  // { name: "column" } can be abbreviated as "column".
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
