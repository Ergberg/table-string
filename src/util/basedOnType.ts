import { Alignment } from "../types";

export function basedOnType(align: Alignment, value: any) {
  if (align === undefined || align === null || align === "based on type")
    align =
      typeof value === "number" || typeof value === "bigint" ? "right" : "left";
  return align;
}
