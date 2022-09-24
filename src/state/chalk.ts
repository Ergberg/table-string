import { alternativeChalk, frameChalk, headerChalk } from "./tableState.js";
import { ansiDestruct } from "../util/ansiDestruct.js";

export function initFrameChalk(frameChalkOption?: string) {
  const chalk = ansiDestruct(frameChalkOption);
  frameChalk.start = chalk.first;
  frameChalk.end = chalk.last;
}
export function initHeaderChalk(frameChalkOption?: string) {
  const chalk = ansiDestruct(frameChalkOption);
  headerChalk.start = chalk.first;
  headerChalk.end = chalk.last;
}
export function initAlternativeChalk(frameChalkOption?: string) {
  const chalk = ansiDestruct(frameChalkOption);
  alternativeChalk.start = chalk.first;
  alternativeChalk.end = chalk.last;
}
