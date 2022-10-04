export type AbbreviatedColumnOptions = (
  | ColumnOption
  // {name: "col", heading: "Column"} can be shortened to {col: "Column"},
  | { [index: string]: string }
  // { name: "column" } can be abbreviated as "column".
  | string
)[];

export type TableOptions = {
  // How to align the column headings
  alignTableHeadings?: "left" | "center" | "right";
  // Want to color the table? Give any string with ansi color escapes, e.g. chalk.bgBlue.yellow("Take This!")
  tableChalk?: string;
  // Want to color every second row differently?
  alternateTableChalk?: string;
  // Want to color the frame differently?
  frameChalk?: string;
  // Want to color every second row differently?
  alternateFrameChalk?: string;
  // Want to color the header differently?
  headerChalk?: string;
  // Want to color the header differently?
  headerFrameChalk?: string;
  // When an Object is converted to an array of properties, how to sort those?
  propertyCompareFunction?: (a: any, b: any) => number;
  // the values for an explicit index column
  index?: any[];
};

export type Alignment = "based on type" | "left" | "center" | "right";
export type Chalk = { start: string; end: string };

export type ColumnOption = {
  name: string;
  heading?: string;
  padding?: number;
  minWidth?: number;
  maxWidth?: number;
  align?: Alignment;
  alignHeading?: Alignment;
  chalk?: string;
  alternateChalk?: string;
};

export type ColumnOptions = ColumnOption[];
