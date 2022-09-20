import { header } from "./tableState.js";

export function initHeader(keys: string[], headings: string[]) {
  fromHeadings(keys, headings);
  removeStaleEntries(keys);
}

function fromHeadings(keys: string[], headings: string[]) {
  keys.forEach(
    (key: string, idx: string | number) => (header[key] = headings[idx])
  );
}

function removeStaleEntries(keys: string | string[]) {
  Object.keys(header).forEach(
    (key) => keys.includes(key) || delete header[key]
  );
}
