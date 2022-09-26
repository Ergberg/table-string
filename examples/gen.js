import chalk from "chalk";
import { flatten, tableString } from "../dist/index.js";

chalk.level = 1;
console.log(
  tableString(["Hello,", "tabular", "world!"], [{ Values: "" }], {
    frameChalk: chalk.bgWhite.black("x"),
    alternativeChalk: chalk.black.bgYellowBright("x"),
  })
);
console.log(
  tableString(["Hello,", "tabular", "world!"], [{ Values: "" }], {
    frameChalk: chalk.bgBlack.white("x"),
    alternativeChalk: chalk.bgBlue.white("x"),
  })
);

console.log(
  tableString(
    flatten([
      {
        Light: tableString(["Hello,", "tabular", "world!"], [{ Values: "" }], {
          frameChalk: chalk.bgWhite.black("x"),
          alternativeChalk: chalk.black.bgYellowBright("x"),
        }),
        Dark: tableString(["Hello,", "tabular", "world!"], [{ Values: "" }], {
          frameChalk: chalk.bgBlack.white("x"),
          alternativeChalk: chalk.bgBlue.white("x"),
        }),
      },
    ]),
    undefined,
    { frameChalk: chalk.bgRgb(40, 40, 40).white("x") }
  )
);

const first = flatten([
  {
    Code: chalk.gray(`tableString(["Hello,", "tabular", "world!"], [{ Values: "" }], {
  frameChalk: chalk.bgWhite.black("x"),
  alternativeChalk: chalk.black.bgYellowBright("x"),
})`),
    Result: tableString(["Hello,", "tabular", "world!"], [{ Values: "" }], {
      frameChalk: chalk.bgWhite.black("x"),
      alternativeChalk: chalk.black.bgYellowBright("x"),
    }),
  },
]);
first[first.length - 1]["<hr>"] = true;

const second = flatten([
  {
    Code: chalk.gray(`flatten([{
  Light: tableString(["Hello,", "tabular", "world!"], [{ Values: "" }], {
    frameChalk: chalk.bgWhite.black("x"),
    alternativeChalk: chalk.black.bgYellowBright("x"),
  }),
  Dark: tableString(["Hello,", "tabular", "world!"], [{ Values: "" }], {
    frameChalk: chalk.bgBlack.white("x"),
    alternativeChalk: chalk.bgBlue.white("x"),
  }),
}])`),
    Result:
      "\n" +
      tableString(
        flatten([
          {
            Light: tableString(
              ["Hello,", "tabular", "world!"],
              [{ Values: "" }],
              {
                frameChalk: chalk.bgWhite.black("x"),
                alternativeChalk: chalk.black.bgYellowBright("x"),
              }
            ),
            Dark: tableString(
              ["Hello,", "tabular", "world!"],
              [{ Values: "" }],
              {
                frameChalk: chalk.bgBlack.white("x"),
                alternativeChalk: chalk.bgBlue.white("x"),
              }
            ),
          },
        ]),
        undefined,
        { frameChalk: chalk.bgRgb(40, 40, 40).white("x") }
      ),
  },
]);
console.log(
  tableString(
    [...first, ...second],
    ["Code", { name: "Result", align: "center" }],
    {
      frameChalk: chalk.bgBlue.white("x"),
      headerChalk: chalk.bgBlue.whiteBright("x"),
    }
  )
);

console.log(tableString(flatten([{ a: "one line", b: "two\nlines" }])));
