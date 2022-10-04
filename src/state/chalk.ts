import { TableOptions } from "./../types.js";
import { chalk } from "./tableState.js";
import { ansiDestruct, Parts } from "../util/ansiDestruct.js";

export function initChalk(tableOptions: TableOptions) {
  initTableChalk(tableOptions?.tableChalk);
  initAlternateTableChalk(tableOptions?.alternateTableChalk);
  initFrameChalk(tableOptions?.frameChalk);
  initAlternateFrameChalk(tableOptions?.alternateFrameChalk);
  initHeaderChalk(tableOptions?.headerChalk);
  initHeaderFrameChalk(tableOptions?.headerFrameChalk);
}

function initFrameChalk(frameChalkOption?: string) {
  let ansi: Parts;
  if (frameChalkOption) ansi = ansiDestruct(frameChalkOption);
  chalk.frame.start = ansi?.first ?? chalk.table.start;
  chalk.frame.end = ansi?.last ?? chalk.table.end;
}
function initAlternateFrameChalk(alternateFrameChalkOption?: string) {
  let ansi: Parts;
  if (alternateFrameChalkOption) ansi = ansiDestruct(alternateFrameChalkOption);
  chalk.alternateFrame.start = ansi?.first ?? chalk.frame.start;
  chalk.alternateFrame.end = ansi?.last ?? chalk.frame.end;
}
function initTableChalk(tableChalkOption?: string) {
  let ansi: Parts;
  if (tableChalkOption) ansi = ansiDestruct(tableChalkOption);
  chalk.table.start = ansi?.first ?? "";
  chalk.table.end = ansi?.last ?? "";
}
function initAlternateTableChalk(alternateTableChalkOption?: string) {
  let ansi: Parts;
  if (alternateTableChalkOption) ansi = ansiDestruct(alternateTableChalkOption);
  chalk.alternateTable.start = ansi?.first ?? chalk.table.start;
  chalk.alternateTable.end = ansi?.last ?? chalk.table.end;
}
function initHeaderChalk(headerChalkOption?: string) {
  let ansi: Parts;
  if (headerChalkOption) ansi = ansiDestruct(headerChalkOption);
  chalk.header.start = ansi?.first ?? chalk.table.start;
  chalk.header.end = ansi?.last ?? chalk.table.end;
}
function initHeaderFrameChalk(headerFrameChalkOption?: string) {
  let ansi: Parts;
  if (headerFrameChalkOption) ansi = ansiDestruct(headerFrameChalkOption);
  chalk.headerFrame.start = ansi?.first ?? chalk.frame.start;
  chalk.headerFrame.end = ansi?.last ?? chalk.frame.end;
}
