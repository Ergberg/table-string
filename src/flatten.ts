export function flatten(data: any, objectDepth = 0) {
  if (!Array.isArray(data)) return flatten([data], objectDepth);
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
    const temp = {};
    const temp2 = {};
    let max = 0;
    const hasHR = "<hr>" in d;
    for (let idx = 0; idx < keys.length; ++idx) {
      const key = keys[idx];
      if (key === "<hr>") continue;
      const val = d[key];
      if (typeof val === "string") {
        temp[key] = val.split("\n");
        max = Math.max(max, temp[key].length);
        continue;
      }
      if (typeof val !== "object" || objectDepth <= 0) {
        continue;
      }
      if (Array.isArray(val)) {
        temp[key] = val;
        max = Math.max(max, temp[key].length);
        change = true;
      } else if ("" + val === "[object Object]") {
        Object.keys(val).forEach((k) => {
          const replacement = `${key}.${k}`;
          if (keys.includes(replacement))
            throw new Error(
              `Flattening object: property "${replacement}" already exists`
            );
          if (!(key in temp2)) temp2[key] = {};
          temp2[key][replacement] = val[k];
          max = Math.max(max, 1);
          change = true;
        });
      }
    }
    if (max === 0) res.push(d);
    addStringRows(max, d, temp, temp2, hasHR);
    return change;
  }

  function addStringRows(
    max: number,
    d: any,
    temp: {},
    temp2: {},
    hasHR: boolean
  ) {
    for (let j = 0; j < max; ++j) {
      const r = {};
      Object.keys(d).forEach((key) => {
        if (key !== "<hr>") {
          if (key in temp2)
            j === 0 &&
              Object.keys(temp2[key]).forEach((k) => (r[k] = temp2[key][k]));
          else
            key in temp
              ? (r[key] = temp[key][j] ?? "")
              : j === 0 && (r[key] = d[key]);
        }
      });
      if (j === max - 1 && hasHR) r["<hr>"] = true;
      res.push(r);
    }
  }
}
