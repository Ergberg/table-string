import assert from "assert";
import { ansiDestruct } from "../idist/util/ansiDestruct.js";

describe("ansiDestruct", function () {
  it("should treat null as ''", function () {
    assert.deepEqual(ansiDestruct(null), ansiDestruct(""));
  });
  it("should handle empty strings", function () {
    assert.deepEqual(ansiDestruct(""), {
      width: 0,
      first: "",
      trimmed: "",
      last: "",
    });
  });
  it("should handle string without escapes", function () {
    assert.deepEqual(ansiDestruct("non-empty"), {
      width: 9,
      first: "",
      trimmed: "non-empty",
      last: "",
    });
  });
  it("should handle string with opening escape", function () {
    assert.deepEqual(ansiDestruct("\x1B39mnon-empty"), {
      width: 9,
      first: "\x1B39m",
      trimmed: "non-empty",
      last: "",
    });
  });
  it("should handle string with closing escape", function () {
    assert.deepEqual(ansiDestruct("non-empty\x1B39m"), {
      width: 9,
      last: "\x1B39m",
      trimmed: "non-empty",
      first: "",
    });
  });
  it("should handle string with surrounding escape", function () {
    assert.deepEqual(ansiDestruct("\x1B37mnon-empty\x1B39m"), {
      width: 9,
      first: "\x1B37m",
      trimmed: "non-empty",
      last: "\x1B39m",
    });
  });
  it("should handle string with embedded escape", function () {
    assert.deepEqual(ansiDestruct("non-\x1B37mempty"), {
      width: 9,
      first: "",
      trimmed: "non-\x1B37mempty",
      last: "",
    });
  });
  it("should handle string with embedded & surrounding escape", function () {
    assert.deepEqual(ansiDestruct("\x1B37mnon-\x1B38mempty\x1B39m"), {
      width: 9,
      first: "\x1B37m",
      trimmed: "non-\x1B38mempty",
      last: "\x1B39m",
    });
  });
  it("should not truncate short strings", function () {
    assert.deepEqual(ansiDestruct("\x1B37mnon-\x1B38mempty\x1B39m", 9), {
      width: 9,
      first: "\x1B37m",
      trimmed: "non-\x1B38mempty",
      last: "\x1B39m",
    });
  });
  it("should truncate long strings (1)", function () {
    assert.deepEqual(ansiDestruct("\x1B37mnon-\x1B38mempty\x1B39m", 8), {
      width: 8,
      first: "\x1B37m",
      trimmed: "non-\x1B38me...",
      last: "\x1B39m",
    });
  });
  it("should truncate long strings (2)", function () {
    assert.deepEqual(ansiDestruct("\x1B37mnon-\x1B38mempty\x1B39m", 5), {
      width: 5,
      first: "\x1B37m",
      trimmed: "no..\x1B38m.",
      last: "\x1B39m",
    });
  });
  it("should truncate long strings (3)", function () {
    assert.deepEqual(ansiDestruct("\x1B37mnon-\x1B38mempty\x1B39m", 4), {
      width: 4,
      first: "\x1B37m",
      trimmed: "n...\x1B38m",
      last: "\x1B39m",
    });
  });
  it("should truncate long strings (4)", function () {
    assert.deepEqual(ansiDestruct("\x1B37mnon-\x1B38mempty\x1B39m", 3), {
      width: 3,
      first: "\x1B37m",
      trimmed: "...\x1B38m",
      last: "\x1B39m",
    });
  });
  it("should truncate long strings (5)", function () {
    assert.deepEqual(ansiDestruct("\x1B37mnon-\x1B38mempty\x1B39m", 0), {
      width: 0,
      first: "\x1B37m",
      trimmed: "\x1B38m",
      last: "\x1B39m",
    });
  });
  it("should left truncate long strings (1)", function () {
    assert.deepEqual(
      ansiDestruct("\x1B37mnon-\x1B38mempty\x1B39m", 8, "right"),
      {
        width: 8,
        first: "\x1B37m",
        trimmed: "...\x1B38mempty",
        last: "\x1B39m",
      }
    );
  });
  it("should left truncate long strings (2)", function () {
    assert.deepEqual(
      ansiDestruct("\x1B37mnon-\x1B38mempty\x1B39m", 5, "right"),
      {
        width: 5,
        first: "\x1B37m",
        trimmed: "\x1B38m...ty",
        last: "\x1B39m",
      }
    );
  });
  it("should left truncate long strings (3)", function () {
    assert.deepEqual(
      ansiDestruct("\x1B37mnon-\x1B38mempty\x1B39m", 4, "right"),
      {
        width: 4,
        first: "\x1B37m",
        trimmed: "\x1B38m...y",
        last: "\x1B39m",
      }
    );
  });
  it("should left truncate long strings (4)", function () {
    assert.deepEqual(
      ansiDestruct("\x1B37mnon-\x1B38mempty\x1B39m", 3, "right"),
      {
        width: 3,
        first: "\x1B37m",
        trimmed: "\x1B38m...",
        last: "\x1B39m",
      }
    );
  });
  it("should left truncate long strings (5)", function () {
    assert.deepEqual(
      ansiDestruct("\x1B37mnon-\x1B38mempty\x1B39m", 6, "right"),
      {
        width: 6,
        first: "\x1B37m",
        trimmed: ".\x1B38m..pty",
        last: "\x1B39m",
      }
    );
  });

  it("should center long strings (1)", function () {
    assert.deepEqual(
      ansiDestruct("\x1B37mnon-\x1B38mempty\x1B39m", 8, "center"),
      {
        width: 8,
        first: "\x1B37m",
        trimmed: "non-\x1B38me...",
        last: "\x1B39m",
      }
    );
  });
  it("should center long strings (2)", function () {
    assert.deepEqual(
      ansiDestruct("\x1B37mnon-\x1B38mempty\x1B39m", 5, "center"),
      {
        width: 5,
        first: "\x1B37m",
        trimmed: "..\x1B38m...",
        last: "\x1B39m",
      }
    );
  });
  it("should center long strings (3)", function () {
    assert.deepEqual(
      ansiDestruct("\x1B37mnon-\x1B38mempty\x1B39m", 4, "center"),
      {
        width: 4,
        first: "\x1B37m",
        trimmed: "..\x1B38m..",
        last: "\x1B39m",
      }
    );
  });
  it("should center long strings (4)", function () {
    assert.deepEqual(
      ansiDestruct("\x1B37mnon-\x1B38mempty\x1B39m", 3, "center"),
      {
        width: 3,
        first: "\x1B37m",
        trimmed: ".\x1B38m..",
        last: "\x1B39m",
      }
    );
  });
  it("should not center short  strings", function () {
    assert.deepEqual(
      ansiDestruct("\x1B37mnon-\x1B38mempty\x1B39m", undefined, "center"),
      {
        width: 9,
        first: "\x1B37m",
        trimmed: "non-\x1B38mempty",
        last: "\x1B39m",
      }
    );
  });
  it("should not left truncate short  strings", function () {
    assert.deepEqual(
      ansiDestruct("\x1B37mnon-\x1B38mempty\x1B39m", undefined, "right"),
      {
        width: 9,
        first: "\x1B37m",
        trimmed: "non-\x1B38mempty",
        last: "\x1B39m",
      }
    );
  });
});
