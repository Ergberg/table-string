import { primitives } from "./tableState.js";

export function initPrimitives(data: any[]) {
  primitives.length = 0;
  data.forEach((value: any) =>
    primitives.push(
      value !== null && typeof value === "object" ? undefined : value
    )
  );
}
