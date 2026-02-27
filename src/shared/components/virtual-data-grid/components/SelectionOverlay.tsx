import { Box } from "@chakra-ui/react";
import { memo } from "react";
import type { CellCoord, ComputedColumn, DataRow } from "../types";
import { ROW_NUMBER_WIDTH } from "../constants";

interface SelectionOverlayProps {
  selectionRange: { start: CellCoord; end: CellCoord } | null;
  columns: ComputedColumn<DataRow>[];
  rowHeight: number;
  headerHeight: number;
  scrollTop: number;
  scrollLeft: number;
  showRowNumber: boolean;
}

export const SelectionOverlay = memo(function SelectionOverlay({
  selectionRange,
  columns,
  rowHeight,
  headerHeight,
  scrollTop,
  scrollLeft,
  showRowNumber,
}: SelectionOverlayProps) {
  if (!selectionRange) return null;

  const minRow = Math.min(selectionRange.start.row, selectionRange.end.row);
  const maxRow = Math.max(selectionRange.start.row, selectionRange.end.row);
  const minCol = Math.min(selectionRange.start.col, selectionRange.end.col);
  const maxCol = Math.max(selectionRange.start.col, selectionRange.end.col);

  const startCol = columns[minCol];
  const endCol = columns[maxCol];
  if (!startCol || !endCol) return null;

  const rowNumberOffset = showRowNumber ? ROW_NUMBER_WIDTH : 0;
  const top = minRow * rowHeight - scrollTop + headerHeight;
  const left = startCol.offsetLeft - scrollLeft + rowNumberOffset;
  const width = endCol.offsetLeft + endCol.computedWidth - startCol.offsetLeft;
  const height = (maxRow - minRow + 1) * rowHeight;

  return (
    <Box
      position="absolute"
      pointerEvents="none"
      zIndex={5}
      border="2px solid"
      borderColor="cyan.500"
      background="rgba(0, 188, 212, 0.1)"
      sx={{
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
});
