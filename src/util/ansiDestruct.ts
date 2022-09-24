import ansiRegex from "ansi-regex";
const ansi = `(${ansiRegex().source})`;

/**
 * Checks wether the string is surrounded by ANSI color codes and splits it apart.
 * It returns the initial part that consists only of color codes (first), the trailing part (last) and the in between part (trimmed). It also returns the width of the string, i.e. the length after all color codes have been removed (even those inside the trimmed part)
 * @param value
 * @param maxWidth optional maximum width for the trimmed part
 * @returns a tuple {width, first, trimmed, last}
 */
export function ansiDestruct(
  value: any,
  maxWidth?: number,
  align?: "right" | "center" | "left"
) {
  const ansis = ("" + (value ?? "")).split(new RegExp(ansi));
  let done = false;
  let i = 0;
  let j = ansis.length - 1;
  while (!done && i < j) {
    done = true;
    if (ansis[i] === "") (done = false), (i += 2);
    if (j > i && ansis[j] === "") (done = false), (j -= 2);
  }

  let cnt = shorten();
  return {
    width: Math.min(cnt, maxWidth ?? Infinity),
    first: ansis.slice(0, i).join(""),
    trimmed: ansis.slice(i, j + 1).join(""),
    last: ansis.slice(j + 1).join(""),
  };

  function shorten() {
    return align === "center"
      ? shortenBoth()
      : align === "right"
      ? shortenLeft()
      : shortenRight();
  }
  function shortenRight() {
    let cnt = 0;
    for (let k = i; k <= j; k += 2) {
      if ((cnt += ansis[k].length) > (maxWidth ?? Infinity)) {
        ansis[k] = ansis[k].slice(0, maxWidth - cnt);
        dotRight(k);
        while ((k += 2) <= j) {
          ansis[k] = "";
        }
      }
    }
    return cnt;
  }

  function shortenLeft() {
    let cnt = 0;
    for (let k = j; k >= i; k -= 2) {
      if ((cnt += ansis[k].length) > (maxWidth ?? Infinity)) {
        ansis[k] = ansis[k].slice(cnt - maxWidth);
        dotLeft(k);
        while ((k -= 2) >= i) {
          ansis[k] = "";
        }
      }
    }
    return cnt;
  }

  function shortenBoth() {
    let cnt = 0;
    for (let k = i; k <= j; k += 2) cnt += ansis[k].length;
    const tooMuch = cnt - (maxWidth ?? Infinity);
    if (tooMuch > 0) {
      const originalMaxWidth = maxWidth;
      const right = Math.trunc((tooMuch + 1) / 2);
      maxWidth = cnt - right;
      shortenRight();   
      maxWidth -= tooMuch - right;
      shortenLeft();
      maxWidth = originalMaxWidth;
    }
    return cnt;
  }

  function dotRight(k) {
    let cnt = 3;
    while (k >= i && cnt > 0) {
      const len = ansis[k].length >= cnt ? cnt : ansis[k].length;
      ansis[k] = ansis[k].slice(0, -len) + ".".repeat(len);
      cnt -= len;
      k -= 2;
    }
  }
  function dotLeft(k) {
    let cnt = 3;
    while (k <= j && cnt > 0) {
      const len = ansis[k].length >= cnt ? cnt : ansis[k].length;
      ansis[k] = ".".repeat(len) + ansis[k].slice(len);
      cnt -= len;
      k += 2;
    }
  }
}
