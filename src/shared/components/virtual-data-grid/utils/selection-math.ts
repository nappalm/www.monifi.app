import type { CellCoord } from "../types";

export interface SelectionRect {
  minRow: number;
  maxRow: number;
  minCol: number;
  maxCol: number;
}

export function getSelectionRect(
  start: CellCoord,
  end: CellCoord,
): SelectionRect {
  return {
    minRow: Math.min(start.row, end.row),
    maxRow: Math.max(start.row, end.row),
    minCol: Math.min(start.col, end.col),
    maxCol: Math.max(start.col, end.col),
  };
}

export function isCellInRect(
  row: number,
  col: number,
  rect: SelectionRect,
): boolean {
  return (
    row >= rect.minRow &&
    row <= rect.maxRow &&
    col >= rect.minCol &&
    col <= rect.maxCol
  );
}
