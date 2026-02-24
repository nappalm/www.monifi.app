import { useCallback, useEffect, useState } from "react";
import type { CellCoord, ComputedColumn, DataRow } from "../types";
import { ROW_NUMBER_WIDTH } from "../constants";

interface UseDragToFillProps<T extends DataRow> {
  containerRef: React.RefObject<HTMLDivElement>;
  columns: ComputedColumn<T>[];
  data: T[];
  rowHeight: number;
  headerHeight: number;
  showRowNumber: boolean;
  onDataChange?: (newData: T[]) => void;
  onRowChange?: (row: T, rowIndex: number, colIndex: number) => void;
}

export function useDragToFill<T extends DataRow>({
  containerRef,
  columns,
  data,
  rowHeight,
  headerHeight,
  showRowNumber,
  onDataChange,
  onRowChange,
}: UseDragToFillProps<T>) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState<"up" | "down" | null>(
    null,
  );
  const [dragStartCell, setDragStartCell] = useState<CellCoord | null>(null);
  const [dragEndCell, setDragEndCell] = useState<CellCoord | null>(null);

  const handleDragHandleStart = useCallback(
    (
      event: React.MouseEvent,
      direction: "up" | "down",
      rowIndex: number,
      colIndex: number,
    ) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(true);
      setDragDirection(direction);
      setDragStartCell({ row: rowIndex, col: colIndex });
      setDragEndCell({ row: rowIndex, col: colIndex });
    },
    [],
  );

  const handleDragMove = useCallback(
    (event: MouseEvent) => {
      if (!isDragging || !containerRef.current || !dragStartCell) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scrollTop = containerRef.current.scrollTop;
      const scrollLeft = containerRef.current.scrollLeft;

      const y = event.clientY - rect.top + scrollTop - headerHeight;
      const x = event.clientX - rect.left + scrollLeft - (showRowNumber ? ROW_NUMBER_WIDTH : 0);

      const row = Math.max(0, Math.min(data.length - 1, Math.floor(y / rowHeight)));

      let col = 0;
      for (let i = 0; i < columns.length; i++) {
        if (x >= columns[i].offsetLeft && x < columns[i].offsetLeft + columns[i].computedWidth) {
          col = i;
          break;
        }
      }

      if (dragDirection) {
        if (col === dragStartCell.col) {
          if (dragDirection === "down" && row >= dragStartCell.row) {
            setDragEndCell({ row, col });
          } else if (dragDirection === "up" && row <= dragStartCell.row) {
            setDragEndCell({ row, col });
          }
        }
      } else {
        setDragEndCell({ row, col });
      }
    },
    [isDragging, dragStartCell, dragDirection, containerRef, data.length, columns, rowHeight, headerHeight, showRowNumber],
  );

  const handleDragEnd = useCallback(() => {
    if (isDragging && dragStartCell && dragEndCell) {
      setIsDragging(false);

      const startRow = Math.min(dragStartCell.row, dragEndCell.row);
      const endRow = Math.max(dragStartCell.row, dragEndCell.row);
      const startCol = Math.min(dragStartCell.col, dragEndCell.col);
      const endCol = Math.max(dragStartCell.col, dragEndCell.col);

      const sourceAccessor = columns[dragStartCell.col]?.accessor as keyof T;
      if (!sourceAccessor) return;
      const sourceValue = data[dragStartCell.row]?.[sourceAccessor];
      const newData = data.map((row) => ({ ...row }));

      const modifiedCells: Array<{ r: number; c: number }> = [];

      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          if (r === dragStartCell.row && c === dragStartCell.col) continue;
          const accessor = columns[c]?.accessor as keyof T;
          if (!accessor) continue;
          newData[r][accessor] = sourceValue;
          modifiedCells.push({ r, c });
        }
      }

      if (modifiedCells.length > 0) {
        onDataChange?.(newData);
        modifiedCells.forEach(({ r, c }) => {
          onRowChange?.(newData[r], r, c);
        });
      }

      setDragStartCell(null);
      setDragEndCell(null);
      setDragDirection(null);
    }
  }, [isDragging, dragStartCell, dragEndCell, data, columns, onDataChange, onRowChange]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  return {
    isDragging,
    dragStartCell,
    dragEndCell,
    handleDragHandleStart,
  };
}
