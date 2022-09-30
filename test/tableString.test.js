import { tableString, flatten } from "../instrumented/index.js";
import chalk from "chalk";
import assert from "assert";

let data;
chalk.level = 1;
describe("tableString", function () {
  function test(what, expected, data, columnOptions, tableOptions) {
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
    [{ Values: "apples", "<hr>": true }, "bananas"]
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

  test(
    "sorted columns",
    "┌───┬───┬───┐\n│ x │ y │ z │\n├───┼───┼───┤\n│ 2 │ 4 │ 3 │\n└───┴───┴───┘",
    (data = [{ z: 3, y: 4, x: 2 }]),
    [...Object.keys(data[0])].sort()
  );

  test(
    "Colorful content",
    "\x1B[37m\x1B[40m┌────────────┬──────────────┐\x1B[49m\x1B[39m\n" +
      "\x1B[37m\x1B[40m│ Price in $ \x1B[37m\x1B[40m│    Fruit     \x1B[37m\x1B[40m│\x1B[49m\x1B[39m\n" +
      "\x1B[37m\x1B[40m├────────────┼──────────────┤\x1B[49m\x1B[39m\n" +
      "\x1B[37m\x1B[40m│       1.99 \x1B[37m\x1B[40m│\x1B[32m Apples       \x1B[39m\x1B[37m\x1B[40m│\x1B[49m\x1B[39m\n" +
      "\x1B[37m\x1B[40m│       3.99 \x1B[37m\x1B[40m│\x1B[31m Strawberries \x1B[39m\x1B[37m\x1B[40m│\x1B[49m\x1B[39m\n" +
      "\x1B[37m\x1B[40m│       0.99 \x1B[37m\x1B[40m│\x1B[44m\x1B[33m Bananas      \x1B[39m\x1B[49m\x1B[37m\x1B[40m│\x1B[49m\x1B[39m\n" +
      "\x1B[37m\x1B[40m│      12.99 \x1B[37m\x1B[40m│\x1B[34m\x1B[47m Bilberries   \x1B[49m\x1B[39m\x1B[37m\x1B[40m│\x1B[49m\x1B[39m\n" +
      "\x1B[37m\x1B[40m└────────────┴──────────────┘\x1B[49m\x1B[39m",
    (data = [
      { price: 1.99, fruit: chalk.green("Apples") },
      { price: 3.99, fruit: chalk.red("Strawberries") },
      { price: 0.99, fruit: chalk.bgBlue.yellow("Bananas") },
      { price: 12.99, fruit: chalk.blue.bgWhite("Bilberries") },
    ]),
    [{ price: "Price in $" }, { fruit: "Fruit" }],
    {
      frameChalk: chalk.white.bgBlack(" "),
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
    "\x1B[1m┌────────┐\x1B[22m\n" +
      "\x1B[1m│ Values \x1B[1m│\x1B[22m\n" +
      "\x1B[1m├────────┤\x1B[22m\n" +
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
    "alternative chalk",
    "\x1B[40m\x1B[97m┌────────┐\x1B[39m\x1B[49m\n" +
      "\x1B[40m\x1B[97m│ Values \x1B[40m\x1B[97m│\x1B[39m\x1B[49m\n" +
      "\x1B[40m\x1B[97m├────────┤\x1B[39m\x1B[49m\n" +
      "\x1B[44m\x1B[37m│      1 \x1B[44m\x1B[37m│\x1B[39m\x1B[49m\n" +
      "\x1B[40m\x1B[37m│      2 \x1B[40m\x1B[37m│\x1B[39m\x1B[49m\n" +
      "\x1B[44m\x1B[37m│      3 \x1B[44m\x1B[37m│\x1B[39m\x1B[49m\n" +
      "\x1B[40m\x1B[37m│      4 \x1B[40m\x1B[37m│\x1B[39m\x1B[49m\n" +
      "\x1B[44m\x1B[37m└────────┘\x1B[39m\x1B[49m",
    [1, 2, 3, 4],
    undefined,
    {
      alternativeChalk: chalk.bgBlack.white("x"),
      frameChalk: chalk.bgBlue.white("x"),
      headerChalk: chalk.bgBlack.whiteBright("x"),
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
