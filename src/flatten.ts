import { TS_CHALK, TS_HORIZONTAL_LINE, TS_KEYS } from "./constants.js";
import { ansiDestruct } from "./util/ansiDestruct.js";

export function flatten(data: any, objectDepth = 0, verticalAlign = "top") {
  if (!Array.isArray(data)) return flatten([data], objectDepth);
  const verticalAlignFactor =
    verticalAlign === "top" ? 0 : verticalAlign === "bottom" ? 2 : 1;
  const res = [];
  let change = false;
  for (let i = 0; i < data.length; ++i) {
    const d = data[i];
    if (typeof d === "string") {
      const split = d.split("\n");
      res.splice(res.length, 0, ...split);
    } else if (d !== null && typeof d === "object") {
      change = flattenNonPrimitive(d);
    } else {
      res.push(d);
    }
  }
  return change ? flatten(res, objectDepth - 1) : res;

  function flattenNonPrimitive(d: any) {
    let change = false;
    const keys = Object.keys(d);
    const array = {};
    const hoisted = {};
    let max = 0;
    const hasHR = TS_HORIZONTAL_LINE in d;
    const chalk = d[TS_CHALK];
    for (let idx = 0; idx < keys.length; ++idx) {
      const key = keys[idx];
      const val = d[key];
      if (TS_KEYS.includes(key)) continue;

      if (typeof val === "string") {
        const split = val.split("\n");
        if (split.length > 1) {
          array[key] = split;
          max = Math.max(max, array[key].length);
        }
        continue;
      }

      if (typeof val !== "object" || objectDepth <= 0) {
        continue;
      }

      max = Array.isArray(val)
        ? flattenArray(key, val, max)
        : "" + val === "[object Object]" && flattenObject(key, val, max);
    }
    if (max === 0) res.push(d);
    addRows(max, d, array, hoisted, hasHR, chalk);
    return change;

    function flattenArray(key: string, val: any[], max: number) {
      array[key] = val;
      max = Math.max(max, array[key].length);
      change = true;
      return max;
    }

    function flattenObject(key: string, val: any, max: number) {
      Object.keys(val).forEach((k) => {
        const replacement = `${key}.${k}`;
        if (keys.includes(replacement))
          throw new Error(
            `Flattening object: property "${replacement}" already exists`
          );
        if (!(key in hoisted)) hoisted[key] = {};
        hoisted[key][replacement] = val[k];
        max = Math.max(max, 1);
        change = true;
      });
      return max;
    }
  }

  function addRows(
    max: number,
    d: any,
    array: {},
    hoisted: {},
    hasHR: boolean,
    chalk: string
  ) {
    const middle = Math.floor(((max - 1) * verticalAlignFactor) / 2);
    for (let j = 0; j < max; ++j) {
      const r = {};
      Object.keys(d).forEach((key) => {
        if (!TS_KEYS.includes(key)) {
          if (key in hoisted) {
            Object.keys(hoisted[key]).forEach((k) => {
              if (j === middle) {
                r[k] = hoisted[key][k];
              } else {
                const tmp = ansiDestruct(hoisted[key][k]);
                r[k] = tmp.first + "" + tmp.last;
              }
            });
          } else if (key in array) {
            const delta = Math.trunc(
              ((max - array[key].length) * verticalAlignFactor) / 2
            );
            if (array[key][j - delta]) {
              r[key] = array[key][j - delta];
            }
          } else {
            if (j === middle) {
              r[key] = d[key];
            } else {
              const tmp = ansiDestruct(d[key]);
              r[key] = tmp.first + "" + tmp.last;
            }
          }
        }
      });
      if (chalk) r[TS_CHALK] = chalk;
      if (j === max - 1 && hasHR) r[TS_HORIZONTAL_LINE] = true;
      res.push(r);
    }
  }
}
