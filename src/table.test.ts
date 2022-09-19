import { double, frame, table } from "./table.js";
import chalk from "chalk";

(() => {
  let runs = 0;
  let failed = 0;
  let data;

  function test(expected: string, data, key?, options?) {
    ++runs;
    const got = table(data, key, options);
    console.log(got);
    if (got !== expected) {
      console.table(data);
      console.error({ expected, got });
      ++failed;
    }
  }

  test(
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
    ]
  );

  test(
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
    "\n" +
      "┌─────────┐\n" +
      "│ apples  │\n" +
      "│ oranges │\n" +
      "│ bananas │\n" +
      "└─────────┘",
    ["apples", "oranges", "bananas"],
    [{ column: "Values", heading: "" }]
  );

  test(
    "\n" +
      "┌───────┬───────┐\n" +
      "│ first │ last  │\n" +
      "├───────┼───────┤\n" +
      "│ John  │ Smith │\n" +
      "│ Jane  │ Doe   │\n" +
      "│ Emily │ Jones │\n" +
      "└───────┴───────┘",
    [
      ["John", "Smith"],
      ["Jane", "Doe"],
      ["Emily", "Jones"],
    ],
    [
      { column: "0", heading: "first" },
      { column: "1", heading: "last" },
    ]
  );

  test(
    "\n" +
      "┌─────────┬─────────┐\n" +
      "│ (index) │ Values  │\n" +
      "├─────────┼─────────┤\n" +
      "│       0 │ apples  │\n" +
      "│       1 │ oranges │\n" +
      "│       2 │ bananas │\n" +
      "└─────────┴─────────┘",
    (data = ["apples", "oranges", "bananas"]),
    [{ column: "", heading: "(index)" }],
    { index: [...data.keys()] }
  );

  test(
    "\n" +
      "\x1B[37m\x1B[40m┌───────┬──────────────┐\x1B[49m\x1B[39m\n" +
      "\x1B[37m\x1B[40m│ Price \x1B[37m\x1B[40m│ Fruit        \x1B[37m\x1B[40m│\x1B[49m\x1B[39m\n" +
      "\x1B[37m\x1B[40m├───────┼──────────────┤\x1B[49m\x1B[39m\n" +
      "\x1B[37m\x1B[40m│  1.99 \x1B[37m\x1B[40m│\x1B[32m Apples       \x1B[39m\x1B[37m\x1B[40m│\x1B[49m\x1B[39m\n" +
      "\x1B[37m\x1B[40m│  3.99 \x1B[37m\x1B[40m│\x1B[31m Strawberries \x1B[39m\x1B[37m\x1B[40m│\x1B[49m\x1B[39m\n" +
      "\x1B[37m\x1B[40m│  0.99 \x1B[37m\x1B[40m│\x1B[44m\x1B[33m Bananas      \x1B[39m\x1B[49m\x1B[37m\x1B[40m│\x1B[49m\x1B[39m\n" +
      "\x1B[37m\x1B[40m│ 12.99 \x1B[37m\x1B[40m│\x1B[34m\x1B[47m Bilberries   \x1B[49m\x1B[39m\x1B[37m\x1B[40m│\x1B[49m\x1B[39m\n" +
      "\x1B[37m\x1B[40m└───────┴─────────────┘\x1B[49m\x1B[39m",
    [
      { price: 1.99, fruit: chalk.green("Apples") },
      { price: 3.99, fruit: chalk.red("Strawberries") },
      { price: 0.99, fruit: chalk.bgBlue.yellow("Bananas") },
      { price: 12.99, fruit: chalk.blue.bgWhite("Bilberries") },
    ],
    [{ price: "Price" }, { fruit: "Fruit" }],
    {
      alignTableHeadings: "left",
      frameChalk: chalk.white.bgBlack(" "),
    }
  );

  test(
    "\n" +
      "┌───┬─────────┐\n" +
      "│   │  Values │\n" +
      "├───┼─────────┤\n" +
      "│ 1 │ apples  │\n" +
      "│ 2 │ oranges │\n" +
      "│ 3 │ bananas │\n" +
      "└───┴─────────┘",
    (data = ["apples", "oranges", "bananas"]),
    [{ column: "Values", align: "right" }],
    { alignTableHeadings: "right", index: [...data.keys()].map((i) => i + 1) }
  );

  test(
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
    [{ column: "Values", align: "center" }]
  );

  test(
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

  failed && console.log(`${runs} tests ran, ${failed} failed.`);
  !failed && console.log(`All ${runs} tests passed.`);

  function Person(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.toString = () => firstName + " " + lastName;
  }
  function Person2(firstName, lastName) {
    this["first name"] = firstName;
    this["last name"] = lastName;
  }
})();
