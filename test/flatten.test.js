import assert from "assert";
import { tableString } from "../instrumented/tableString.js";
import { flatten } from "../dist/flatten.js";

describe("flatten", function () {
  function test(what, expected, data, depth) {
    it(
      (what ? what + " " : "") +
        (expected === undefined ? "" : "should render as expected"),
      function () {
        assert.deepStrictEqual(flatten(data, depth), expected);
      }
    );
  }

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
        "deep.person.firstName": "a",
        "deep.person.lastName": "b",
      },
      {
        "person.firstName": "c",
        "person.lastName": "d",
      },
    ],
    [
      { deep: { person: new Person2("a", "b") } },
      { person: new Person2("c", "d") },
    ],
    2
  );
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
        c: "│ Values │",
      },
      {
        a: "├────────┤",
        c: "├────────┤",
      },
      {
        a: "│      1 │",
        c: "│ a      │",
      },
      {
        a: "│      2 │",
        c: "│      6 │",
      },
      {
        a: "│ false  │",
        c: "│ c      │",
      },
      {
        a: "└────────┘",
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
