import  assert  from "assert";
import { ansiDestruct } from "../idist/util/ansiDestruct.js";

describe("ansiDestruct", function () {
  it("should treat null as ''", function () {
    assert.deepEqual(ansiDestruct(null), ansiDestruct(""));
  });
});
