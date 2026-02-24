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
  updateCell,
  onFocus,
  onDoubleClick,
  onDragHandleStart,
  currency,
}: GridCellProps<T>) {
  const cellValue = row[column.accessor as keyof T];
  const isDraggable = column.isDraggable !== false;
  const shouldHideContent = isEditing && isCellActive && column.isEditable !== false;

  const dragRangeBg = useColorModeValue("cyan.200", "cyan.800");

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
      overflow={isCellActive ? "visible" : "hidden"}
      textAlign={align}
      justifyContent={
        align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start"
      }
      sx={{
        ...(isInDragRange &&
          isDragging && {
            boxShadow: "inset 0 0 0 1px var(--chakra-colors-cyan-500) !important",
            background: `${dragRangeBg} !important`,
          }),
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          border: "1px solid",
          borderColor: "cyan.500",
          background: "rgba(0, 188, 212, 0.15)",
          zIndex: 1,
          pointerEvents: "none",
          opacity: 0,
          transform: "scale(0.95)",
          transition:
            "opacity 0.25s ease, transform 0.25s ease, box-shadow 0.4s ease",
        },
        "&:hover::after, &[data-active='true']::after": {
          opacity: 1,
          transform: "scale(1)",
          boxShadow: "none",
        },
        "&:hover::after": {
          boxShadow: "0 0 15px 3px rgba(0, 188, 212, 0.3)",
        },
        "&[data-active='true']": {
          color: "cyan.500",
        },
        ...column.cellStyle,
        ...column.sx,
      }}
      visibility={shouldHideContent ? "hidden" : "visible"}
    >
      <Box position="relative" zIndex={2} width="100%">
        {content}
      </Box>
      {isCellActive && !isEditing && isDraggable && (
        <>
          <DragHandle position="top" onDragStart={handleDragStart} />
          <DragHandle position="bottom" onDragStart={handleDragStart} />
        </>
      )}
    </Box>
  );
}

export const GridCell = memo(GridCellComponent) as typeof GridCellComponent;
