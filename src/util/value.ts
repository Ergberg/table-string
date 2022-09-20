export function value(
  row: { [x: string]: any },
  key: string,
  primitives: any[],
  index: any[],
  rowIdx: number
) {
  const v =
    row?.[key] ??
    (key === "Values"
      ? primitives?.[rowIdx] ?? ""
      : key === ""
      ? index?.[rowIdx] ?? ""
      : "");
  return v;
}
