import assert from "assert";
import { tableString } from "../instrumented/tableString.js";
import { flatten } from "../dist/flatten.js";

describe("flatten", function () {
  function test(what, expected, data) {
    it(
      (what ? what + " " : "") +
        (expected === undefined ? "" : "should render as expected"),
      function () {
        assert.deepStrictEqual(flatten(data), expected);
      }
    );
  }

  test("empty array", [], []);
  test("one line string", [""], [""]);
  test("two line string", ["a", "b"], ["a\nb"]);
  test("three line string", ["a", "b", "c"], ["a\nb\nc"]);
  test("tow one liner", [{ a: "a", b: "b" }], [{ a: "a", b: "b" }]);
  test(
    "one & two",
    [
      { a: "a", b: "b" },
      { a: "", b: "c" },
    ],
    [{ a: "a", b: "b\nc" }]
  );
  test(
    "two & one",
    [
      { a: "a", b: "c" },
      { a: "b", b: "" },
    ],
    [{ a: "a\nb", b: "c" }]
  );
  test(
    "two & two",
    [
      { a: "a", b: "c" },
      { a: "b", b: "d" },
    ],
    [{ a: "a\nb", b: "c\nd" }]
  );
  test(
    "two tables",
    [
      {
        a: "┌────────┐",
        b: "┌────────┐",
      },
      {
        a: "│ Values │",
        b: "│ Values │",
      },
      {
        a: "├────────┤",
        b: "├────────┤",
      },
      {
        a: "│      1 │",
        b: "│ a      │",
      },
      {
        a: "│      2 │",
        b: "│ b      │",
      },
      {
        a: "│      3 │",
        b: "│ c      │",
      },
      {
        a: "└────────┘",
        b: "└────────┘",
      },
    ],
    [{ a: tableString([1, 2, 3]), b: tableString(["a", "b", "c"]) }]
  );
  test(
    "more complicated",
    [
      {
        a: "┌────────┐",
        b: 5,
        c: "┌────────┐",
      },
      {
        a: "│ Values │",
        b: "",
        c: "│ Values │",
      },
      {
        a: "├────────┤",
        b: "",
        c: "├────────┤",
      },
      {
        a: "│      1 │",
        b: "",
        c: "│ a      │",
      },
      {
        a: "│      2 │",
        b: "",
        c: "│      6 │",
      },
      {
        a: "│ false  │",
        b: "",
        c: "│ c      │",
      },
      {
        a: "└────────┘",
        b: "",
        c: "└────────┘",
      },
    ],
    [
      {
        a: tableString([1, 2, false]),
        b: 5,
        c: tableString(["a", 6, "c"]),
      },
    ]
  );
});
