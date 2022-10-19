import { cleanUp } from "../instrumented/cleanUp.js";
import { flatten } from "../instrumented/flatten.js";
import { standard, frame, double, space } from "../instrumented/frame.js";
import { tableString } from "../instrumented/tableString.js";
import assert from "assert";
import chalk from "chalk";

describe("cleanUp", function () {
  it("handles string without escapes", function () {
    assert.equal("x", cleanUp("x"));
  });
  it("drops superfluous escapes", function () {
    assert.equal(
      "\x1B[37m\x1B[41mx\x1B[39m\x1B[49m",
      cleanUp(chalk.yellow.bgGreen(chalk.bgRed.white("x")))
    );
  });
  it("drops superfluous resets", function () {
    assert.equal(
      "\x1B[37m\x1B[41mxx\x1B[39m\x1B[49m",
      cleanUp(
        "\x1B[37m\x1B[41mx\x1B[39m\x1B[49m\x1B[37m\x1B[41mx\x1B[39m\x1B[49m"
      )
    );
  });
  it("handles 8bit color", function () {
    assert.equal(
      "\x1B[100m║\x1B[97m\x1B[49m              \x1B[39m",
      cleanUp(
        "\x1B[100m║\x1B[49m\x1B[39m\x1B[38;5;102m\x1B[97m              \x1B[39m"
      )
    );
  });
  it("handles 24bit color", function () {
    assert.equal(
      "\x1B[40m║\x1B[37m\x1B[48;2;102;68;34m              \x1B[39m",
      cleanUp(
        "\x1B[40m║\x1B[49m\x1B[39m\x1B[48;2;102;68;34m\x1B[37m              \x1B[39m"
      )
    );
  });

  it("handles non color escapes 1", function () {
    assert.equal(
      "\x1b[37m\x1b4m\x1b[36mhuhu\x1b[34m\x1b[0m\x1b[39m",
      cleanUp(
        "\x1b[37m\x1b4m\x1b[32m\x1b[36mhuhu\x1b[34m\x1b[0m\x1b[31m\x1b[39m"
      )
    );
  });

  it("handles non color escapes 2", function () {
    assert.equal(
      "\x1b[37m x \x1b[0m\x1b[37m y \x1b[39m",
      cleanUp("\x1b[37m x \x1b[0m\x1b[37m y \x1b[39m",
      true)
    );
  });

  it("handles null argument", function () {
    assert.equal(undefined, cleanUp());
  });

  it("handles complex cases", function () {
    const data = flatten(
      [
        {
          id: "0001",
          type: "Donut",
          name: "Cake",
          ppu: 0.55,
          batter: [
            { id: "1001", type: "Regular" },
            {
              id: "1002",
              type: chalk.bgHex("#444444").greenBright("Chocolate"),
            },
            { id: "1003", type: "Blueberry" },
            { id: "1004", type: "Devil's Food" },
          ],
          topping: [
            { id: "5001", type: "None" },
            { id: "5002", type: "Glazed" },
            { id: "5005", type: "Sugar" },
            { id: "5007", type: "Powdered Sugar" },
            {
              id: "5006",
              type: chalk
                .bgHex("#444444")
                .greenBright("Chocolate with Sprinkles"),
            },
            {
              id: "5003",
              type: chalk.bgHex("#444444").greenBright("Chocolate"),
            },
            { id: "5004", type: "Maple" },
          ],
          "ts:horizontalLine": true,
        },
        {
          id: "0002",
          type: "Donut",
          name: chalk.bgYellowBright.black("Raised"),
          ppu: 0.55,
          batter: [{ id: "1001", type: "Regular" }],
          topping: [
            { id: "5001", type: "None" },
            { id: "5002", type: "Glazed" },
            { id: "5005", type: "Sugar" },
            {
              id: "5003",
              type: chalk.bgHex("#444444").greenBright("Chocolate"),
            },
            { id: "5004", type: "Maple" },
          ],
          "ts:horizontalLine": true,
        },
        {
          id: "0003",
          type: "Donut",
          name: "Old Fashioned",
          ppu: 0.55,
          batter: [
            { id: "1001", type: "Regular" },
            {
              id: "1002",
              type: chalk.bgHex("#444444").greenBright("Chocolate"),
            },
          ],
          topping: [
            { id: "5001", type: "None" },
            { id: "5002", type: "Glazed" },
            {
              id: "5003",
              type: chalk.bgHex("#444444").greenBright("Chocolate"),
            },
            { id: "5004", type: "Maple" },
          ],
          "ts:chalk": chalk.bgHex("#660000").yellowBright("x"),
        },
      ],
      Infinity,
      "middle"
    );

    const co = [
      { name: "type", heading: "Type", padding: 4 },
      { name: "name", heading: "Name", align: "center" },
      {
        name: "batter.type",
        heading: "Batter",
        align: "right",
        chalk: chalk.bgHex("#664422").white("x"),
        alternateChalk: chalk.bgHex("#553311").white("x"),
      },
      { name: "topping.type", heading: "Topping", maxWidth: 23 },
    ];
    const to = {
      frameChalk: chalk.yellow.bgBlack("x"),
      headerChalk: chalk.bgYellow.blue("x"),
      alternateTableChalk: chalk.bgHex("#002244").white("x"),
    };
    frame.characters = double.characters;
    const flat = flatten(tableString(data, co, to));
    frame.characters = space.characters;
    const result = tableString(flat, [
      { name: "Values", heading: "", padding: 20 },
    ]);
    frame.characters = standard.characters;

    const clean = cleanUp(result);

    assert.equal(result, clean);
  });
});
