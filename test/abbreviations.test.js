import assert from "assert";
import { abbreviated } from "../instrumented/abbreviations.js";

describe("abbreviated", function () {
  it("can handle undefined", function () {
    assert.deepEqual(abbreviated(undefined), undefined);
  });
  it("can handle non-array arguments", function () {
    assert.deepEqual(abbreviated({}), []);
  });
  it("can handle non-object element", function () {
    assert.deepEqual(abbreviated([5]), [5]);
  });
  it("can handle non-object element 2", function () {
    assert.deepEqual(abbreviated([null]), [null]);
  });
  it("expands strings", function () {
    assert.deepEqual(abbreviated(["me"]), [{ name: "me" }]);
  });
  it("expands abbreviated objects", function () {
    assert.deepEqual(abbreviated([{ me: "You" }]), [
      { name: "me", heading: "You" },
    ]);
  });
  it("does not loose information", function () {
    assert.deepEqual(
      abbreviated([
        { me: "You" },
        { name: "me", heading: "You", "ts:horizontalLine": "too" },
      ]),
      [
        { name: "me", heading: "You" },
        { name: "me", heading: "You", "ts:horizontalLine": "too" },
      ]
    );
  });
});
