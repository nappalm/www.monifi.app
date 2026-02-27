import { Box } from "@chakra-ui/react";
import { useCallback } from "react";
import type { VirtualItem } from "@tanstack/react-virtual";
import { useGridContext } from "../GridContext";
import { GridRow } from "./GridRow";
import type { DataRow } from "../types";

interface GridBodyProps {
  virtualItems: VirtualItem[];
  totalSize: number;
}

export function GridBody({ virtualItems, totalSize }: GridBodyProps) {
  const ctx = useGridContext<DataRow>();
  const {
    data,
    columns,
    totalWidth,
    activeCell,
    editState,
    setActiveCell,
    startEditing,
    updateCell,
    isDragging,
    dragStartCell,
    dragEndCell,
    handleDragHandleStart,
    showRowNumber,
    rowNumberWidth,
    currency,
  } = ctx;

  const isEditing = editState.status === "editing";

  const handleFocus = useCallback(
    (row: number, col: number) => {
      setActiveCell({ row, col });
    },
    [setActiveCell],
  );

  const handleDoubleClick = useCallback(
    (row: number, col: number) => {
      startEditing(row, col);
    },
    [startEditing],
  );

  return (
    <Box position="relative" width="100%" height={`${totalSize}px`}>
      {virtualItems.map((virtualRow) => {
        const rowIndex = virtualRow.index;
        const row = data[rowIndex];
        if (!row) return null;

        return (
          <GridRow
            key={rowIndex}
            row={row}
            rowIndex={rowIndex}
            columns={columns}
            style={{
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
            activeCell={activeCell}
            isEditing={isEditing}
            isDragging={isDragging}
            dragStartCell={dragStartCell}
            dragEndCell={dragEndCell}
            updateCell={updateCell}
            onFocus={handleFocus}
            onDoubleClick={handleDoubleClick}
            onDragHandleStart={handleDragHandleStart}
            showRowNumber={showRowNumber}
            rowNumberWidth={rowNumberWidth}
            totalWidth={totalWidth}
            currency={currency}
            totalRows={data.length}
          />
        );
      })}
    </Box>
  );
}
