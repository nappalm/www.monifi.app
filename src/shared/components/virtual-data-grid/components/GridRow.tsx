import { Box, useColorModeValue } from "@chakra-ui/react";
import { memo, useCallback } from "react";
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
  selectedRow: number | null;
  setSelectedRow: (row: number | null) => void;
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
  selectedRow,
  setSelectedRow,
}: GridRowProps<T>) {
  const isOdd = rowIndex % 2 === 0;
  const isRowSelected = selectedRow === rowIndex;

  const stripeBg = useColorModeValue("gray.100", "gray.900");
  const selectedBg = useColorModeValue("gray.200", "gray.800");
  const borderColor = useColorModeValue("gray.300", "gray.700");

  const handleRowNumberClick = useCallback(() => {
    setSelectedRow(isRowSelected ? null : rowIndex);
  }, [setSelectedRow, isRowSelected, rowIndex]);

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
      bg={isRowSelected ? selectedBg : isOdd ? stripeBg : "transparent"}
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
          color={isRowSelected ? "gray.700" : "gray.500"}
          userSelect="none"
          cursor="pointer"
          borderRight="1px dashed"
          borderColor={borderColor}
          onClick={handleRowNumberClick}
          title={isRowSelected ? "Deseleccionar fila" : "Seleccionar fila"}
          _hover={{ color: "gray.700" }}
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
            isLastColumn={colIndex === columns.length - 1}
            updateCell={updateCell}
            onFocus={onFocus}
            onDoubleClick={onDoubleClick}
            onDragHandleStart={onDragHandleStart}
            currency={currency}
            totalRows={totalRows}
            borderColor={borderColor}
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
    prev.currency === next.currency &&
    prev.selectedRow === next.selectedRow
  );
}

export const GridRow = memo(
  GridRowComponent,
  rowPropsAreEqual,
) as typeof GridRowComponent;
