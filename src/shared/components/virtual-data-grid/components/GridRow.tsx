import { Box, useColorModeValue } from "@chakra-ui/react";
import { memo } from "react";
import type { CellCoord, ComputedColumn, DataRow } from "../types";
import { GridCell } from "./GridCell";

interface GridRowProps<T extends DataRow> {
  row: T;
  rowIndex: number;
  columns: ComputedColumn<T>[];
  style: React.CSSProperties;
  activeCell: CellCoord | null;
  isEditing: boolean;
  isDragging: boolean;
  dragStartCell: CellCoord | null;
  dragEndCell: CellCoord | null;
  updateCell: (rowIndex: number, colIndex: number, value: any) => void;
  onFocus: (row: number, col: number) => void;
  onDoubleClick: (row: number, col: number) => void;
  onDragHandleStart: (
    e: React.MouseEvent,
    direction: "up" | "down",
    rowIndex: number,
    colIndex: number,
  ) => void;
  showRowNumber: boolean;
  rowNumberWidth: number;
  totalWidth: number;
  currency: string;
  totalRows: number;
}

function GridRowComponent<T extends DataRow>({
  row,
  rowIndex,
  columns,
  style,
  activeCell,
  isEditing,
  isDragging,
  dragStartCell,
  dragEndCell,
  updateCell,
  onFocus,
  onDoubleClick,
  onDragHandleStart,
  showRowNumber,
  rowNumberWidth,
  totalWidth,
  currency,
  totalRows,
}: GridRowProps<T>) {
  const isOdd = rowIndex % 2 === 0;

  const stripeBg = useColorModeValue(
    "rgba(113, 128, 150, 0.1)",
    "rgba(113, 128, 150, 0.08)",
  );
  const borderColor = useColorModeValue("gray.200", "gray.800");

  const fullWidth = totalWidth + (showRowNumber ? rowNumberWidth : 0);

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      width={`${fullWidth}px`}
      minWidth="100%"
      height={`${parseInt(style.height as string)}px`}
      style={{ transform: style.transform }}
      display="flex"
      alignItems="stretch"
      borderBottom="1px solid"
      borderColor={borderColor}
      bg={isOdd ? stripeBg : "transparent"}
      sx={{
        ...(row.enabled === false && { opacity: 0.5 }),
      }}
    >
      {showRowNumber && (
        <Box
          width={`${rowNumberWidth}px`}
          minWidth={`${rowNumberWidth}px`}
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          px={2}
          fontSize="xs"
          color="gray.500"
          userSelect="none"
        >
          {rowIndex + 1}
        </Box>
      )}
      {columns.map((column, colIndex) => {
        let isInDragRange = false;
        if (isDragging && dragStartCell && dragEndCell) {
          const minRow = Math.min(dragStartCell.row, dragEndCell.row);
          const maxRow = Math.max(dragStartCell.row, dragEndCell.row);
          const minCol = Math.min(dragStartCell.col, dragEndCell.col);
          const maxCol = Math.max(dragStartCell.col, dragEndCell.col);
          isInDragRange =
            rowIndex >= minRow &&
            rowIndex <= maxRow &&
            colIndex >= minCol &&
            colIndex <= maxCol;
        }

        return (
          <GridCell
            key={column.accessor as string}
            row={row}
            rowIndex={rowIndex}
            colIndex={colIndex}
            column={column}
            isCellActive={
              activeCell?.row === rowIndex && activeCell?.col === colIndex
            }
            isEditing={isEditing}
            isDragging={isDragging}
            isInDragRange={isInDragRange}
            updateCell={updateCell}
            onFocus={onFocus}
            onDoubleClick={onDoubleClick}
            onDragHandleStart={onDragHandleStart}
            currency={currency}
            totalRows={totalRows}
          />
        );
      })}
    </Box>
  );
}

function rowPropsAreEqual(prev: any, next: any) {
  return (
    prev.rowIndex === next.rowIndex &&
    prev.row === next.row &&
    prev.style.transform === next.style.transform &&
    prev.style.height === next.style.height &&
    prev.activeCell?.row === next.activeCell?.row &&
    prev.activeCell?.col === next.activeCell?.col &&
    prev.isEditing === next.isEditing &&
    prev.isDragging === next.isDragging &&
    prev.dragStartCell === next.dragStartCell &&
    prev.dragEndCell === next.dragEndCell &&
    prev.columns === next.columns &&
    prev.totalWidth === next.totalWidth &&
    prev.currency === next.currency
  );
}

export const GridRow = memo(GridRowComponent, rowPropsAreEqual) as typeof GridRowComponent;
