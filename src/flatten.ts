export function flatten(data: any[]) {
  const res = [];
  for (let i = 0; i < data.length; ++i) {
    const d = data[i];
    if (typeof d === "string") {
      const split = d.split("\n");
      res.splice(res.length, 0, ...split);
    } else if (d !== null && typeof d === "object") {
      const temp = {};
      let max = 0;
      Object.keys(d).forEach(
        (key) =>
          typeof d[key] === "string" &&
          (max = Math.max(max, (temp[key] = d[key].split("\n")).length))
      );
      for (let j = 0; j < max; ++j) {
        const r = {};
        Object.keys(d).forEach(
          (key) =>
            (r[key] =
              typeof d[key] === "string"
                ? temp[key][j] ?? ""
                : j !== 0
                ? ""
                : d[key])
        );
        res.push(r);
      }
    }
  }
  return res;
}
