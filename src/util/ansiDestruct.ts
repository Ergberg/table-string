import ansiRegex from "ansi-regex";

/**
 * Checks wether the string is surrounded by ANSI color codes and splits it apart.
 * It returns the initial part that consists only of color codes (first), the trailing part (last) and the in between part (trimmed). It also returns the width of the string, i.e. the length after all color codes have been removed (even those inside the trimmed part)
 * @param value
 * @returns a tuple {width, first, trimmed, last}
 */
export function ansiDestruct(value: any) {
  const s = "" + (value ?? "");
  const length = s.length;
  const ansis = [...s.matchAll(ansiRegex())];
  const width = length - ansis.reduce((len, match) => len + match[0].length, 0);
  if (ansis.length >= 2) {
    let [first, start, last, end] = [0, 0, ansis.length - 1, length];
    ({ first, start } = fromLeft(first, ansis, start));
    ({ last, end } = fromRight(last, ansis, end));
    if (first > 0 && last < ansis.length - 1) {
      return {
        width,
        first: ansis.slice(0, first).reduce((res, match) => res + match[0], ""),
        trimmed: s.slice(
          ansis[--first].index + ansis[first][0].length,
          ansis[++last].index
        ),
        last: ansis.slice(last).reduce((res, match) => res + match[0], ""),
      };
    }
  }
  return { width, first: "", trimmed: s, last: "" };
}

function fromLeft(first: number, ansis: RegExpMatchArray[], start: number) {
  while (first < ansis.length / 2 && ansis[first].index === start)
    start += ansis[first++][0].length;
  return { first, start };
}

function fromRight(last: number, ansis: RegExpMatchArray[], end: number) {
  while (
    last > (ansis.length - 1) / 2 &&
    ansis[last].index + ansis[last][0].length === end
  )
    end = ansis[last--].index;
  return { last, end };
}

