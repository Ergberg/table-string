import { tableString, flatten } from "../instrumented/index.js";
import chalk from "chalk";
import assert from "assert";

let data;
chalk.level = 3;
console.log("chalk.supportsColor :>> ", chalk.supportsColor);
describe("tableString", function () {
  function test(what, expected, data, columnOptions, tableOptions) {
    if (what === "-") return;
    it(
      (what ? what + " " : "") +
        (expected === undefined ? "" : "should render as expected"),
      function () {
        assert.equal(tableString(data, columnOptions, tableOptions), expected);
      }
    );
  }

  test("Non-object", "", () => 0);
  test("Null", "", null);
  test(
    "frameChalk",
    "\x1B[37m\x1B[40m┌──┐\x1B[49m\x1B[39m\n\x1B[37m\x1B[40m└──┘\x1B[49m\x1B[39m",
    [],
    [{ Values: "" }],
    {
      frameChalk: "\x1B[37m\x1B[40m\x1B[49m\x1B[39m",
    }
  );

  test(
    "Simple array with strings",
    "┌─────────┐\n" +
      "│ Values  │\n" +
      "├─────────┤\n" +
      "│ apples  │\n" +
      "│ oranges │\n" +
      "│ bananas │\n" +
      "└─────────┘",
    ["apples", "oranges", "bananas"]
  );

  test(
    "Simple array with h_line",
    "┌─────────┐\n" +
      "│ Values  │\n" +
      "├─────────┤\n" +
      "│ apples  │\n" +
      "├─────────┤\n" +
      "│ bananas │\n" +
      "└─────────┘",
    [{ Values: "apples", "ts:horizontalLine": true }, "bananas"]
  );

  test(
    "Simple array with numbers",
    "┌────────┐\n" +
      "│ Values │\n" +
      "├────────┤\n" +
      "│      1 │\n" +
      "│      2 │\n" +
      "│      3 │\n" +
      "└────────┘",
    [1, 2, 3]
  );

  test("Simple date value", "┌┐\n" + "││\n" + "└┘", [new Date()]);

  test(
    "Object with object",
    "┌─────────────────┐\n" +
      "│        o        │\n" +
      "├─────────────────┤\n" +
      "│ [object Object] │\n" +
      "└─────────────────┘",
    [{ o: {} }]
  );

  test(
    "Wide table",
    "┌──────────────────────┐\n" +
      "│        Values        │\n" +
      "├──────────────────────┤\n" +
      "│ apples               │\n" +
      "│ oranges              │\n" +
      "│ bananas              │\n" +
      "└──────────────────────┘",
    ["apples", "oranges", "bananas"],
    [{ name: "Values", width: 20 }]
  );

  test(
    "Array with tuples",
    "┌───────┬───────┐\n" +
      "│   0   │   1   │\n" +
      "├───────┼───────┤\n" +
      "│ John  │ Smith │\n" +
      "│ Jane  │ Doe   │\n" +
      "│ Emily │ Jones │\n" +
      "└───────┴───────┘",
    [
      ["John", "Smith"],
      ["Jane", "Doe"],
      ["Emily", "Jones"],
    ]
  );

  test(
    "Array with Persons",
    "┌───────────┬──────────┐\n" +
      "│ firstName │ lastName │\n" +
      "├───────────┼──────────┤\n" +
      "│ John      │ Smith    │\n" +
      "│ Jane      │ Doe      │\n" +
      "│ Emily     │ Jones    │\n" +
      "└───────────┴──────────┘",
    [
      new Person("John", "Smith"),
      new Person("Jane", "Doe"),
      new Person("Emily", "Jones"),
    ],
    [{ name: "firstName", align: "left" }, "lastName"]
  );

  test(
    "Color column Persons",
    "┌───────────┬──────────┐\n" +
      "│ firstName │ lastName │\n" +
      "├───────────┼──────────┤\n" +
      "│\x1B[44m\x1B[37m John      \x1B[39m\x1B[49m│\x1B[100m\x1B[37m Smith    \x1B[39m\x1B[49m│\n" +
      "│\x1B[47m\x1B[32m Jane      \x1B[39m\x1B[49m│\x1B[40m\x1B[33m Doe      \x1B[39m\x1B[49m│\n" +
      "│\x1B[44m\x1B[37m Emily     \x1B[39m\x1B[49m│\x1B[100m\x1B[37m Jones    \x1B[39m\x1B[49m│\n" +
      "└───────────┴──────────┘",
    [
      new Person("John", "Smith"),
      new Person("Jane", "Doe"),
      new Person("Emily", "Jones"),
    ],
    [
      {
        name: "firstName",
        align: "left",
        chalk: chalk.bgBlue.white(" "),
        alternateChalk: chalk.bgWhite.green(" "),
      },
      {
        name: "lastName",
        chalk: chalk.bgGrey.white(" "),
        alternateChalk: chalk.bgBlack.yellow(" "),
      },
    ]
  );

  test(
    "Family object",
    "┌──────────┬───────────┬──────────┐\n" +
      "│          │ firstName │ lastName │\n" +
      "├──────────┼───────────┼──────────┤\n" +
      "│ daughter │ Emily     │ Smith    │\n" +
      "│ father   │ John      │ Smith    │\n" +
      "│ mother   │ Jane      │ Smith    │\n" +
      "└──────────┴───────────┴──────────┘",
    {
      mother: new Person("Jane", "Smith"),
      father: new Person("John", "Smith"),
      daughter: new Person("Emily", "Smith"),
    }
  );
  test(
    "Unsorted family object",
    "┌──────────┬───────────┬──────────┐\n" +
      "│          │ firstName │ lastName │\n" +
      "├──────────┼───────────┼──────────┤\n" +
      "│ mother   │ Jane      │ Smith    │\n" +
      "│ father   │ John      │ Smith    │\n" +
      "│ daughter │ Emily     │ Smith    │\n" +
      "└──────────┴───────────┴──────────┘",
    {
      mother: new Person("Jane", "Smith"),
      father: new Person("John", "Smith"),
      daughter: new Person("Emily", "Smith"),
    },
    undefined,
    { propertyCompareFunction: null }
  );

  test(
    "Column selection",
    "┌───────────┐\n" +
      "│ firstName │\n" +
      "├───────────┤\n" +
      "│ John      │\n" +
      "│ Jane      │\n" +
      "│ Emily     │\n" +
      "└───────────┘",
    [
      new Person("John", "Smith"),
      new Person("Jane", "Doe"),
      new Person("Emily", "Jones"),
    ],
    ["firstName"]
  );

  test(
    "Column reordering",
    "┌───────────┬────────────┐\n" +
      "│ last name │ first name │\n" +
      "├───────────┼────────────┤\n" +
      "│ Smith     │ John       │\n" +
      "│ Doe       │ Jane       │\n" +
      "│ Jones     │ Emily      │\n" +
      "└───────────┴────────────┘",
    [
      new Person2("John", "Smith"),
      new Person2("Jane", "Doe"),
      new Person2("Emily", "Jones"),
    ],
    ["last name", "first name"]
  );

  test(
    "Column renaming",
    "┌───────────┬────────────┐\n" +
      "│ Last Name │ First Name │\n" +
      "├───────────┼────────────┤\n" +
      "│ Smith     │ John       │\n" +
      "│ Doe       │ Jane       │\n" +
      "│ Jones     │ Emily      │\n" +
      "└───────────┴────────────┘",
    [
      new Person("John", "Smith"),
      new Person("Jane", "Doe"),
      new Person("Emily", "Jones"),
    ],
    [{ lastName: "Last Name" }, { firstName: "First Name" }]
  );

  test(
    "Deletion of heading",
    "┌─────────┐\n" +
      "│ apples  │\n" +
      "│ oranges │\n" +
      "│ bananas │\n" +
      "└─────────┘",
    ["apples", "oranges", "bananas"],
    [{ name: "Values", heading: "" }]
  );

  test(
    "config",
    "┌─────────────────┬─────────────┬──────────┬───────────┬──────────┐\n" +
      "│      name       │ maxVersions │ maxDays  │ projects  │ branches │\n" +
      "├─────────────────┼─────────────┼──────────┼───────────┼──────────┤\n" +
      "│ default         │           5 │       30 │ .*        │ .*       │\n" +
      "│ blog_production │    Infinity │ Infinity │ blog      │ main     │\n" +
      "│ rule-2          │    Infinity │       90 │ .*        │ main     │\n" +
      "│ bugfix          │           5 │ Infinity │ .*-plugin │ bug-.*   │\n" +
      "└─────────────────┴─────────────┴──────────┴───────────┴──────────┘",
    [
      {
        name: "default",
        maxVersions: 5n,
        maxDays: 30n,
        projects: ".*",
        branches: ".*",
      },
      {
        name: "blog_production",
        projects: "blog",
        branches: "main",
        maxDays: Infinity,
        maxVersions: Infinity,
      },
      {
        projects: ".*",
        branches: "main",
        maxDays: 90n,
        name: "rule-2",
        maxVersions: Infinity,
      },
      {
        name: "bugfix",
        projects: ".*-plugin",
        branches: "bug-.*",
        maxVersions: 5n,
        maxDays: Infinity,
      },
    ]
  );

  test(
    "Headers for indices",
    "┌──────────┬──────────┐\n" +
      "│ first    │     last │\n" +
      "├──────────┼──────────┤\n" +
      "│ John-Boy │ Smith    │\n" +
      "│ Jane     │ Doe      │\n" +
      "│ Emilie   │ Johannes │\n" +
      "└──────────┴──────────┘",
    [
      ["John-Boy", "Smith"],
      ["Jane", "Doe"],
      ["Emilie", "Johannes"],
    ],
    [
      { name: "0", heading: "first", align: "left" },
      { name: "1", heading: "last" },
    ],
    { alignTableHeadings: "right" }
  );

  test(
    "Explicit (index) column",
    "┌─────────┬─────────┐\n" +
      "│ (index) │ Values  │\n" +
      "├─────────┼─────────┤\n" +
      "│       0 │ apples  │\n" +
      "│       1 │ oranges │\n" +
      "│       2 │ bananas │\n" +
      "└─────────┴─────────┘",
    (data = ["apples", "oranges", "bananas"]),
    [{ name: "", heading: "(index)" }],
    { index: [...data.keys()] }
  );

  test(
    "truncated to maxWidth",
    "" +
      "┌──────────┐\n" +
      "│  Values  │\n" +
      "├──────────┤\n" +
      "│ long     │\n" +
      "│ longer   │\n" +
      "│ the l... │\n" +
      "└──────────┘",
    ["long", "longer", "the longest"],
    [{ name: "Values", maxWidth: 8 }]
  );

  it("throws an exception if minWidth > maxWidth", function () {
    assert.throws(
      () =>
        tableString(
          ["long", "longer", "the longest"],
          [{ name: "Values", maxWidth: 10, minWidth: 20 }]
        ),
      /must not exceed maxWidth/
    );
  });

  it("throws an exception if a column option has no name", function () {
    assert.throws(
      () =>
        tableString(
          ["long", "longer", "the longest"],
          [{ maxWidth: 10, minWidth: 20 }]
        ),
      /does not define a name/
    );
  });

  it("throws an exception on unknown table options", function () {
    assert.throws(() => tableString([], [], { "!unknown!": true }));
  });
  test(
    "sorted columns",
    "┌───┬───┬───┐\n│ x │ y │ z │\n├───┼───┼───┤\n│ 2 │ 4 │ 3 │\n└───┴───┴───┘",
    (data = [{ z: 3, y: 4, x: 2 }]),
    [...Object.keys(data[0])].sort()
  );

  test(
    "Colorful content",
    "\u001b[48;2;255;102;0m\u001b[30m┌────────────┬──────────────┐\u001b[39m\u001b[49m\n\u001b[48;2;255;102;0m\u001b[30m│\u001b[39m\u001b[49m\u001b[48;2;255;170;0m\u001b[30m Price in $ \u001b[39m\u001b[49m\u001b[48;2;255;102;0m\u001b[30m│\u001b[39m\u001b[49m\u001b[48;2;255;170;0m\u001b[30m    Fruit     \u001b[39m\u001b[49m\u001b[48;2;255;102;0m\u001b[30m│\u001b[39m\u001b[49m\n\u001b[48;2;255;102;0m\u001b[30m├────────────┼──────────────┤\u001b[39m\u001b[49m\n\u001b[48;2;221;221;187m\u001b[30m│\u001b[39m\u001b[49m\u001b[48;2;221;221;187m\u001b[30m       1.99 \u001b[39m\u001b[49m\u001b[48;2;221;221;187m\u001b[30m│\u001b[39m\u001b[49m\u001b[48;2;221;221;187m\u001b[30m\u001b[32m Apples       \u001b[39m\u001b[39m\u001b[49m\u001b[48;2;221;221;187m\u001b[30m│\u001b[39m\u001b[49m\n\u001b[48;2;221;221;187m\u001b[30m│\u001b[39m\u001b[49m\u001b[48;2;221;221;187m\u001b[30m       3.99 \u001b[39m\u001b[49m\u001b[48;2;221;221;187m\u001b[30m│\u001b[39m\u001b[49m\u001b[48;2;221;221;187m\u001b[30m\u001b[31m Strawberries \u001b[39m\u001b[39m\u001b[49m\u001b[48;2;221;221;187m\u001b[30m│\u001b[39m\u001b[49m\n\u001b[48;2;221;221;187m\u001b[30m│\u001b[39m\u001b[49m\u001b[48;2;221;221;187m\u001b[30m       0.99 \u001b[39m\u001b[49m\u001b[48;2;221;221;187m\u001b[30m│\u001b[39m\u001b[49m\u001b[48;2;221;221;187m\u001b[30m\u001b[44m\u001b[33m Bananas      \u001b[39m\u001b[49m\u001b[39m\u001b[49m\u001b[48;2;221;221;187m\u001b[30m│\u001b[39m\u001b[49m\n\u001b[48;2;221;221;187m\u001b[30m│\u001b[39m\u001b[49m\u001b[48;2;221;221;187m\u001b[30m      12.99 \u001b[39m\u001b[49m\u001b[48;2;221;221;187m\u001b[30m│\u001b[39m\u001b[49m\u001b[48;2;221;221;187m\u001b[30m\u001b[48;2;255;255;255m Bilberries   \u001b[49m\u001b[39m\u001b[49m\u001b[48;2;221;221;187m\u001b[30m│\u001b[39m\u001b[49m\n\u001b[48;2;221;221;187m\u001b[30m└────────────┴──────────────┘\u001b[39m\u001b[49m",
    (data = [
      { price: 1.99, fruit: chalk.green("Apples") },
      { price: 3.99, fruit: chalk.red("Strawberries") },
      { price: 0.99, fruit: chalk.bgBlue.yellow("Bananas") },
      { price: 12.99, fruit: chalk.bgHex("#ffffff")("Bilberries") },
    ]),
    [{ price: "Price in $" }, { fruit: "Fruit" }],
    {
      tableChalk: chalk.bgHex("#ddddbb").black(" "),
      headerChalk: chalk.bgHex("#ffaa00").black(" "),
      headerFrameChalk: chalk.bgHex("#ff6600").black(" "),
    }
  );

  test(
    "Right alignment for values and headings",
    "┌───┬─────────┐\n" +
      "│   │  Values │\n" +
      "├───┼─────────┤\n" +
      "│ 1 │  apples │\n" +
      "│ 2 │ oranges │\n" +
      "│ 3 │ bananas │\n" +
      "└───┴─────────┘",
    (data = ["apples", "oranges", "bananas"]),
    [{ name: "Values", align: "right" }],
    {
      alignTableHeadings: "right",
      index: [...data.keys()].map((i) => i + 1),
    }
  );

  test(
    "Center alignment",
    "┌───────────────┐\n" +
      "│    Values     │\n" +
      "├───────────────┤\n" +
      "│    apples     │\n" +
      "│    oranges    │\n" +
      "│    bananas    │\n" +
      "│ a longer text │\n" +
      "└───────────────┘",
    ["apples", "oranges", "bananas", "a longer text"],
    [{ name: "Values", align: "center" }]
  );

  test(
    "Suppression of null and regexp",
    "┌─────────┬──────────┬────────┐\n" +
      "│  Goods  │ Services │ Values │\n" +
      "├─────────┼──────────┼────────┤\n" +
      "│         │          │ apples │\n" +
      "│ oranges │          │        │\n" +
      "│         │          │        │\n" +
      "│         │ John Doe │        │\n" +
      "│         │          │        │\n" +
      "│       5 │        6 │        │\n" +
      "│         │        5 │        │\n" +
      "└─────────┴──────────┴────────┘",
    [
      "apples",
      { Goods: "oranges" },
      null,
      { Services: new Person("John", "Doe") },
      /gg/,
      { Goods: 5, Services: 6 },
      { Services: BigInt(5) },
    ]
  );

  test(
    "Values center trimmed with padding",
    "┌───────────────────┐\n" +
      "│      Values       │\n" +
      "├───────────────────┤\n" +
      "│    one by one     │\n" +
      "│   two and a ...   │\n" +
      "│   ...here wh...   │\n" +
      "│   ... musket...   │\n" +
      "└───────────────────┘",
    [
      "one by one",
      "two and a half",
      "and then there where three ",
      "four musketeers ",
    ],
    [{ name: "Values", padding: 3, align: "center", maxWidth: 13 }]
  );

  test(
    "zero-padding",
    "┌──────────┐\n" +
      "│  Values  │\n" +
      "├──────────┤\n" +
      "│one by one│\n" +
      "│...nd a...│\n" +
      "│...ere ...│\n" +
      "│...musk...│\n" +
      "└──────────┘",
    [
      "one by one",
      "two and a half",
      "and then there where three",
      "four musketeers",
    ],
    [{ name: "Values", padding: 0, align: "center", maxWidth: 10 }]
  );

  test(
    "heading chalk",
    "┌────────┐\n" +
      "│\x1B[1m Values \x1B[22m│\n" +
      "├────────┤\n" +
      "│      1 │\n" +
      "│      2 │\n" +
      "└────────┘",
    [1, 2],
    undefined,
    {
      headerChalk: chalk.bold("x"),
    }
  );
  test(
    "Object with toString()",
    "┌────────┐\n" +
      "│ person │\n" +
      "├────────┤\n" +
      "│ a b    │\n" +
      "│ c d    │\n" +
      "└────────┘",
    flatten([
      { person: new Person("a", "b") },
      { person: new Person("c", "d") },
    ])
  );
  test(
    "alternate chalk 1",
    "┌────────┐\n" +
      "│ Values │\n" +
      "├────────┤\n" +
      "│      1 │\n" +
      "│\x1B[44m\x1B[37m      2 \x1B[39m\x1B[49m│\n" +
      "│      3 │\n" +
      "│\x1B[44m\x1B[37m      4 \x1B[39m\x1B[49m│\n" +
      "└────────┘",
    [1, 2, 3, 4],
    undefined,
    {
      alternateTableChalk: chalk.bgBlue.white("x"),
    }
  );
  test(
    "alternate chalk 2",
    "┌────────┐\n" +
      "│ Values │\n" +
      "├────────┤\n" +
      "│      1 │\n" +
      "\x1B[44m\x1B[37m│\x1B[39m\x1B[49m\x1B[44m\x1B[37m      2 \x1B[39m\x1B[49m\x1B[44m\x1B[37m│\x1B[39m\x1B[49m\n" +
      "│      3 │\n" +
      "\x1B[44m\x1B[37m│\x1B[39m\x1B[49m\x1B[44m\x1B[37m      4 \x1B[39m\x1B[49m\x1B[44m\x1B[37m│\x1B[39m\x1B[49m\n" +
      "└────────┘",
    [1, 2, 3, 4],
    undefined,
    {
      alternateTableChalk: chalk.bgBlue.white("x"),
      alternateFrameChalk: chalk.bgBlue.white("x"),
    }
  );
});

function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.toString = () => firstName + " " + lastName;
}

function Person2(firstName, lastName) {
  this["first name"] = firstName;
  this["last name"] = lastName;
}
