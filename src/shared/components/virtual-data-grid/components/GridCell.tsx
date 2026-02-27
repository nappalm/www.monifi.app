import { Box, useColorModeValue } from "@chakra-ui/react";
import { memo, useCallback, useMemo } from "react";
import { formatCurrency } from "@/shared/utils/formats";
import type { ComputedColumn, DataRow } from "../types";
import { DragHandle } from "./DragHandle";

interface GridCellProps<T extends DataRow> {
  row: T;
  rowIndex: number;
  colIndex: number;
  column: ComputedColumn<T>;
  isCellActive: boolean;
  isEditing: boolean;
  isDragging: boolean;
  isInDragRange: boolean;
  isLastColumn: boolean;
  borderColor: string;
  updateCell: (rowIndex: number, colIndex: number, value: any) => void;
  onFocus: (row: number, col: number) => void;
  onDoubleClick: (row: number, col: number) => void;
  onDragHandleStart: (
    e: React.MouseEvent,
    direction: "up" | "down",
    rowIndex: number,
    colIndex: number,
  ) => void;
  currency: string;
  totalRows: number;
}

function GridCellComponent<T extends DataRow>({
  row,
  rowIndex,
  colIndex,
  column,
  isCellActive,
  isEditing,
  isDragging,
  isInDragRange,
  isLastColumn,
  borderColor,
  updateCell,
  onFocus,
  onDoubleClick,
  onDragHandleStart,
  currency,
  totalRows,
}: GridCellProps<T>) {
  const cellValue = row[column.accessor as keyof T];
  const isDraggable = column.isDraggable !== false;
  const shouldHideContent =
    isEditing && isCellActive && column.isEditable !== false;

  const dragRangeBg = useColorModeValue("cyan.200", "cyan.800");
  const activeCellShadow = useColorModeValue(
    "inset 0 0 0 1px var(--chakra-colors-cyan-500), inset 0 0 0 2px var(--chakra-colors-cyan-100)",
    "inset 0 0 0 1px var(--chakra-colors-cyan-500), inset 0 0 0 2px var(--chakra-colors-cyan-900)",
  );

  const handleFocus = useCallback(() => {
    onFocus(rowIndex, colIndex);
  }, [onFocus, rowIndex, colIndex]);

  const handleDoubleClick = useCallback(() => {
    onDoubleClick(rowIndex, colIndex);
  }, [onDoubleClick, rowIndex, colIndex]);

  const handleChange = useCallback(
    (newValue: any) => {
      updateCell(rowIndex, colIndex, newValue);
    },
    [updateCell, rowIndex, colIndex],
  );

  const handleDragStart = useCallback(
    (e: React.MouseEvent, direction: "up" | "down") => {
      onDragHandleStart(e, direction, rowIndex, colIndex);
    },
    [onDragHandleStart, rowIndex, colIndex],
  );

  const content = useMemo(() => {
    if (column.render) {
      return column.render(cellValue, row, handleChange, rowIndex);
    }
    if (column.isAmount) {
      return formatCurrency(cellValue || 0, currency);
    }
    return cellValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column, cellValue, row, handleChange, currency]);

  const align = column.align || (column.isAmount ? "right" : "left");

  return (
    <Box
      data-row={rowIndex}
      data-col={colIndex}
      data-active={isCellActive}
      tabIndex={isCellActive ? 0 : -1}
      onFocus={handleFocus}
      onDoubleClick={handleDoubleClick}
      width={`${column.computedWidth}px`}
      minWidth={`${column.computedWidth}px`}
      height="100%"
      display="flex"
      alignItems="center"
      px={4}
      py={1}
      fontSize="sm"
      fontWeight={500}
      lineHeight="5"
      outline="none"
      cursor="cell"
      position="relative"
      borderRight={isLastColumn ? undefined : "1px dashed"}
      borderColor={isLastColumn ? undefined : borderColor}
      overflow={isCellActive ? "visible" : "hidden"}
      textAlign={align}
      justifyContent={
        align === "right"
          ? "flex-end"
          : align === "center"
            ? "center"
            : "flex-start"
      }
      sx={{
        ...(isInDragRange &&
          isDragging && {
            boxShadow:
              "inset 0 0 0 1px var(--chakra-colors-cyan-500) !important",
            background: `${dragRangeBg} !important`,
          }),
        "&[data-active='true']": {
          color: "cyan.500",
          boxShadow: activeCellShadow,
          background: "rgba(0, 188, 212, 0.15)",
          borderRadius: "sm",
        },
        ...column.cellStyle,
        ...column.sx,
      }}
    >
      <Box
        position="relative"
        zIndex={2}
        width="100%"
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        visibility={shouldHideContent ? "hidden" : "visible"}
      >
        {content}
      </Box>
      {isCellActive && !isEditing && isDraggable && (
        <>
          {rowIndex > 0 && (
            <DragHandle position="top" onDragStart={handleDragStart} />
          )}
          {rowIndex < totalRows - 1 && (
            <DragHandle position="bottom" onDragStart={handleDragStart} />
          )}
        </>
      )}
    </Box>
  );
}

export const GridCell = memo(GridCellComponent) as typeof GridCellComponent;
