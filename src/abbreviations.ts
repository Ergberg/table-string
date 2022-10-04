import { ColumnOptions, AbbreviatedColumnOptions } from "./types.js";

export function abbreviated(
  abbreviations: AbbreviatedColumnOptions
): ColumnOptions {
  if (abbreviations === undefined) return undefined;
  const res = [];
  for (let i = 0; i < abbreviations.length; ++i) {
    const element = abbreviations[i];
    if (element) {
      if (typeof element === "string") {
        res.push({ name: element });
        continue;
      } else if (typeof element === "object") {
        const keys = Object.keys(element);
        if (keys.length === 1) {
          res.push({ name: keys[0], heading: element[keys[0]] });
          continue;
        }
      }
    }
    res.push(element);
  }
  return res;
}
