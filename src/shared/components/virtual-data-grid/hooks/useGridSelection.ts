import { useCallback, useState } from "react";
import type { CellCoord } from "../types";

interface SelectionRange {
  start: CellCoord;
  end: CellCoord;
}

export function useGridSelection(enabled: boolean) {
  const [selectionRange, setSelectionRange] = useState<SelectionRange | null>(
    null,
  );
  const [anchor, setAnchor] = useState<CellCoord | null>(null);

  const startSelection = useCallback(
    (coord: CellCoord) => {
      if (!enabled) return;
      setAnchor(coord);
      setSelectionRange({ start: coord, end: coord });
    },
    [enabled],
  );

  const extendSelection = useCallback(
    (coord: CellCoord) => {
      if (!enabled || !anchor) return;
      setSelectionRange({ start: anchor, end: coord });
    },
    [enabled, anchor],
  );

  const clearSelection = useCallback(() => {
    setSelectionRange(null);
    setAnchor(null);
  }, []);

  const isInSelection = useCallback(
    (row: number, col: number) => {
      if (!selectionRange) return false;
      const minRow = Math.min(selectionRange.start.row, selectionRange.end.row);
      const maxRow = Math.max(selectionRange.start.row, selectionRange.end.row);
      const minCol = Math.min(selectionRange.start.col, selectionRange.end.col);
      const maxCol = Math.max(selectionRange.start.col, selectionRange.end.col);
      return row >= minRow && row <= maxRow && col >= minCol && col <= maxCol;
    },
    [selectionRange],
  );

  return {
    selectionRange,
    startSelection,
    extendSelection,
    clearSelection,
    isInSelection,
  };
}
