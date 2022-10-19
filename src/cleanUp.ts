const ansi =
  /(\x1b\[[34][0-79]m|\x1b\[[34]8;5;[0-9]+m|\x1b\[9[0-7]m|\x1b\[10[0-7]m|\x1b\[[34]8;2;[0-9]+;[0-9]+;[0-9]+m)/;

export function cleanUp(s: string, dump?) {
  if (s === undefined || s === null) return s;
  const ansis = s.split(ansi);
  dump && console.table(ansis);
  if (ansis.length === 1) return s;
  let res = "";
  let i = 0;
  let lastFG, lastBG;
  let beforeFG, beforeBG;

  while (i + 1 < ansis.length) {
    while (ansis[i] === "" && i + 1 < ansis.length) {
      const color = ansis[i + 1];
      const code = color.charAt(2);
      if (code === "3" || code === "9") lastFG = color;
      else lastBG = color;
      i += 2;
    }
    lastFG && lastFG !== beforeFG && (res += lastFG);
    lastBG && lastBG !== beforeBG && (res += lastBG);
    if (ansis[i].match(/\x1b\[/)) {
      beforeBG = beforeFG = undefined;
    } else {
      lastFG && (beforeFG = lastFG);
      lastBG && (beforeBG = lastBG);
    }
    lastBG = lastFG = undefined;
    res += ansis[i];
    ansis[i] = "";
  }
  return res;
}
