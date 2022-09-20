/* These are the default chars for the table frame*/
export let frame = {
  characters: {
    topRow: "┌─┬┐",
    normal: "│ ││",
    h_line: "├─┼┤",
    bottom: "└─┴┘",
  },
};
/* They can be redefined, e.g. with frame.characters = double.characters */
export const double = {
  characters: {
    topRow: "╔═╦╗",
    normal: "║ ║║",
    h_line: "╠═╬╣",
    bottom: "╚═╩╝",
  },
};
/* ... or frame.characters = ascii.characters */
export const ascii = {
  characters: {
    topRow: ".-..",
    normal: "| ||",
    h_line: "|-+|",
    bottom: "'-''",
  },
};
