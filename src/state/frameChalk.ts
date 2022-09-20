import { frameChalk } from "./tableState.js";
import { ansiDestruct } from "../util/ansiDestruct.js";

export function initFrameChalk(frameChalkOption?: string) {
  const chalk = ansiDestruct(frameChalkOption);
  frameChalk.start = chalk.first;
  frameChalk.end = chalk.last;
}
