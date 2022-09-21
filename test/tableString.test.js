import { tableString } from "../idist/tableString.js";
import chalk from "chalk";
import assert from "assert";

let data;

describe("tableString", function () {
  function test(what, expected, data, columnOptions, tableOptions) {
    it((what ? what + " " : "") + "should render as expected", function () {
      assert.equal(tableString(data, columnOptions, tableOptions), expected);
    });
  }

  test("Non-object", "", () => 0);
  test("Null", "", null);
  test(
    "frameChalk",
    "\n\x1B[37m\x1B[40m┌──┐\x1B[49m\x1B[39m\n\x1B[37m\x1B[40m└──┘\x1B[49m\x1B[39m",
    [],
    [{ Values: "" }],
    {
      frameChalk: "\x1B[37m\x1B[40m\x1B[49m\x1B[39m",
    }
  );
  console.log(
    tableString([], [{ Values: "" }], {
      frameChalk: "\x1B[37m\x1B[40m\x1B[49m\x1B[39m",
    })
  );
  test(
    "Simple array with strings",
    "\n" +
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
    "Wide table",
    "\n" +
      "┌────────────────────┐\n" +
      "│       Values       │\n" +
      "├────────────────────┤\n" +
      "│ apples             │\n" +
      "│ oranges            │\n" +
      "│ bananas            │\n" +
      "└────────────────────┘",
    ["apples", "oranges", "bananas"],
    [{ name: "Values", width: 20 }]
  );

  test(
    "Array with tuples",
    "\n" +
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
    "\n" +
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
    "\n" +
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
    "\n" +
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
    "\n" +
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
    "\n" +
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
    "\n" +
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
    "\n" +
      "┌─────────┐\n" +
      "│ apples  │\n" +
      "│ oranges │\n" +
      "│ bananas │\n" +
      "└─────────┘",
    ["apples", "oranges", "bananas"],
    [{ name: "Values", heading: "" }]
  );

  test(
    "Headers for indices",
    "\n" +
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
    "\n" +
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
    "sorted columns",
    "\n┌───┬───┬───┐\n│ x │ y │ z │\n├───┼───┼───┤\n│ 2 │ 4 │ 3 │\n└───┴───┴───┘",
    (data = [{ z: 3, y: 4, x: 2 }]),
    [...Object.keys(data[0])].sort()
  );

  test(
    "Colorful content",
    "\n" +
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
    "\n" +
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
    "\n" +
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
    "\n" +
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
