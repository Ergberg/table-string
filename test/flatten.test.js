import assert from "assert";
import { tableString } from "../instrumented/tableString.js";
import { flatten } from "../instrumented/flatten.js";

describe("flatten", function () {
  function test(what, expected, data, depth, verticalAlign) {
    it(
      (what ? what + " " : "") +
        (expected === undefined ? "" : "should render as expected"),
      function () {
        assert.deepStrictEqual(flatten(data, depth, verticalAlign), expected);
      }
    );
  }

  test("no array", [5], 5);
  test("empty array", [], []);
  test("one line string", [""], [""]);
  test("two line string", ["a", "b"], ["a\nb"]);
  test("three line string", ["a", "b", "c"], ["a\nb\nc"]);
  test("tow one liner", [{ a: "a", b: "b" }], [{ a: "a", b: "b" }]);

  test("objectDepth === 0", [{ a: { b: "c" } }], [{ a: { b: "c" } }]);
  test("objectDepth === 1", [{ "a.b": "c" }], [{ a: { b: "c" } }], 1);
  test(
    "objectDepth === 1 with deep object",
    [{ "a.b": { c: "d" } }],
    [{ a: { b: { c: "d" } } }],
    1
  );
  test("objectDepth === 2", [{ "a.b.c": "d" }], [{ a: { b: { c: "d" } } }], 2);

  test(
    "vertical align top",
    [
      {
        a: "b",
        c: "d",
      },
      {
        a: "",
        c: "e",
      },
      {
        a: "",
        c: "f",
      },
    ],
    [{ a: "b", c: ["d", "e", "f"] }],
    Infinity
  );
  test(
    "vertical align middle",
    [
      {
        a: "",
        c: "d",
      },
      {
        a: "b",
        c: "e",
      },
      {
        a: "",
        c: "f",
      },
    ],
    [{ a: "b", c: ["d", "e", "f"] }],
    Infinity,
    "middle"
  );
  test(
    "vertical align middle 2",
    [{ c: 1 }, { c: 2, a: 1 }, { c: 3, a: 2 }, { c: 4, a: 3 }, { c: 5 }],
    [{ a: [1, 2, 3], c: [1, 2, 3, 4, 5] }],
    Infinity,
    "middle"
  );
  test(
    "vertical align bottom",
    [
      { a: "", c: "d" },
      { a: "", c: "e" },
      { a: "b", c: "f" },
    ],
    [{ a: "b", c: ["d", "e", "f"] }],
    Infinity,
    "bottom"
  );
  test(
    "two arrays",
    [
      {
        a: 1,
        b: "a",
        x: "y",
      },
      {
        a: 2,
        b: "b",
        x: "",
      },
      {
        a: 3,
        x: "",
      },
      {
        a: 4,
        x: "",
      },
    ],
    { x: "y", a: [1, 2, 3, 4], b: ["a", "b"] },
    Infinity,
    "bottom"
  );

  it("throws an exception if the target column exists", function () {
    assert.throws(
      () =>
        console.log(
          'flatten([{ a: { b: "c" }, "a.b": "exists" }], 1) :>> ',
          flatten([{ a: { b: "c" }, "a.b": "exists" }], 1)
        ),
      /Error: Flattening object: property ".*?" already exists/
    );
  });

  test(
    "nested objects",
    [
      {
        arr: 1,
        "deep.person.firstName": "a",
        "deep.person.lastName": "b",
      },
      {
        arr: 2,
        "deep.person": "",
      },
      {
        arr: 1,
        "person.firstName": "c",
        "person.lastName": "d",
      },
      {
        arr: 2,
        "person.firstName": "",
        "person.lastName": "",
      },
    ],
    [
      { deep: { person: new Person2("a", "b") }, arr: [1, 2] },
      { person: new Person2("c", "d"), arr: [1, 2] },
    ],
    Infinity
  );
  test("flatten array", [{ a: 1 }, { a: 2 }], [{ a: [1, 2] }], 1);
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
    "three & one middle",
    [
      { a: "a", b: "" },
      { a: "b", b: "d" },
      { a: "c", b: "" },
    ],
    [{ a: "a\nb\nc", b: "d" }],
    Infinity,
    "middle"
  );
  test(
    "three & one middle",
    [
      { a: "a", b: "" },
      { a: "b", b: "d" },
      { a: "c", b: "" },
    ],
    [{ a: "a\nb\nc", b: "d" }],
    undefined,
    "middle"
  );
  test(
    "three & one bottom",
    [
      { a: "a", b: "" },
      { a: "b", b: "" },
      { a: "c", b: "d" },
    ],
    [{ a: "a\nb\nc", b: "d" }],
    undefined,
    "bottom"
  );

  test(
    "two with hline",
    [
      { a: "a", b: "c" },
      { a: "b", b: "", "ts:horizontalLine": true },
      { a: "d", b: "e" },
      { a: "", b: "f" },
    ],
    [
      { a: "a\nb", b: "c", "ts:horizontalLine": true },
      { a: "d", b: "e\nf" },
    ]
  );

  test(
    "with chalk",
    [
      { a: "a", b: "c", "ts:chalk": "whatever" },
      { a: "b", b: "", "ts:chalk": "whatever" },
      { a: "d", b: "e" },
      { a: "", b: "f" },
    ],
    [
      { a: "a\nb", b: "c", "ts:chalk": "whatever" },
      { a: "d", b: "e\nf" },
    ]
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

function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.toString = () => firstName + " " + lastName;
}
function Person2(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}
