import { TdProps } from "@chakra-ui/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { flushSync } from "react-dom";

interface Column {
  header: string;
  accessor: string;
  render?: (value: any, row: any) => React.ReactNode;
  isEditable?: boolean;
  sx?: TdProps;
}

interface UseInlineEditorProps {
  columns: Column[];
  data: any[];
  onDataChange: (newData: any[]) => void;
}

export function useInlineEditor({
  columns,
  data,
  onDataChange,
}: UseInlineEditorProps) {
  const [activeCell, setActiveCell] = useState<{
    row: number;
    col: number;
  } | null>({ row: 0, col: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartCell, setDragStartCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [dragEndCell, setDragEndCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const tableRef = useRef<HTMLTableElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const numRows = data.length;
  const numCols = columns.length;

  const startEditing = useCallback(
    (row: number, col: number) => {
      setActiveCell({ row, col });
      setIsEditing(true);
      const accessor = columns[col].accessor;
      setInputValue(String(data[row][accessor]));
    },
    [data, columns],
  );

  const stopEditing = useCallback(
    (update = true) => {
      if (isEditing && activeCell && update) {
        const { row, col } = activeCell;
        const newData = data.map((r) => ({ ...r }));
        const accessor = columns[col].accessor;
        newData[row][accessor] = inputValue as any;
        onDataChange(newData);
      }
      setIsEditing(false);
    },
    [isEditing, activeCell, inputValue, data, columns, onDataChange],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!activeCell) return;

      const { row, col } = activeCell;

      const move = (dRow: number, dCol: number) => {
        event.preventDefault();
        if (isEditing) stopEditing();
        const newRow = Math.max(0, Math.min(numRows - 1, row + dRow));
        const newCol = Math.max(0, Math.min(numCols - 1, col + dCol));
        setActiveCell({ row: newRow, col: newCol });
        tableRef.current
          ?.querySelector<HTMLElement>(
            `[data-row="${newRow}"][data-col="${newCol}"]`,
          )
          ?.focus();
      };

      switch (event.key) {
        case "ArrowUp":
          move(-1, 0);
          break;
        case "ArrowDown":
          move(1, 0);
          break;
        case "ArrowLeft":
          move(0, -1);
          break;
        case "ArrowRight":
          move(0, 1);
          break;
        case "Tab":
          event.preventDefault();
          if (isEditing) stopEditing();
          // eslint-disable-next-line no-case-declarations
          let newRow = row;
          // eslint-disable-next-line no-case-declarations
          let newCol = col + (event.shiftKey ? -1 : 1);
          if (newCol < 0) {
            newRow = Math.max(0, row - 1);
            newCol = numCols - 1;
          } else if (newCol >= numCols) {
            newRow = Math.min(numRows - 1, row + 1);
            newCol = 0;
          }
          if (newRow < 0) newRow = 0; // Stay in table
          setActiveCell({ row: newRow, col: newCol });
          tableRef.current
            ?.querySelector<HTMLElement>(
              `[data-row="${newRow}"][data-col="${newCol}"]`,
            )
            ?.focus();
          break;
        case "Enter":
          event.preventDefault();
          if (isEditing) {
            flushSync(() => {
              stopEditing();
            });
            const nextRow = Math.min(numRows - 1, row + 1);
            setActiveCell({ row: nextRow, col });
            tableRef.current
              ?.querySelector<HTMLElement>(
                `[data-row="${nextRow}"][data-col="${col}"]`,
              )
              ?.focus();
          } else {
            startEditing(row, col);
          }
          break;
        case "Escape":
          if (isEditing) {
            flushSync(() => {
              stopEditing(false); // Cancel edit
            });
            tableRef.current
              ?.querySelector<HTMLElement>(
                `[data-row="${row}"][data-col="${col}"]`,
              )
              ?.focus();
          }
          break;
        default:
          if (
            !isEditing &&
            event.key.length === 1 &&
            !event.ctrlKey &&
            !event.metaKey &&
            !event.altKey
          ) {
            startEditing(row, col);
            setInputValue(event.key);
          }
          break;
      }
    },
    [activeCell, isEditing, numRows, numCols, startEditing, stopEditing],
  );

  useEffect(() => {
    const table = tableRef.current;
    if (table) {
      table.addEventListener("keydown", handleKeyDown);
      return () => table.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleKeyDown]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (activeCell && activeCell.row === 0 && activeCell.col === 0) {
      tableRef.current
        ?.querySelector<HTMLElement>(`[data-row="0"][data-col="0"]`)
        ?.focus();
    }
  }, []);

  const handleDragStart = useCallback(
    (event: React.MouseEvent) => {
      // Prevent default to avoid text selection
      event.preventDefault();
      // Stop propagation to prevent Td's onClick from firing
      event.stopPropagation();

      if (activeCell) {
        setIsDragging(true);
        setDragStartCell(activeCell);
        setDragEndCell(activeCell); // Initialize dragEndCell to dragStartCell
      }
    },
    [activeCell],
  );

  const handleDragMove = useCallback(
    (event: MouseEvent) => {
      if (!isDragging || !tableRef.current) return;

      // Get the cell element under the mouse
      const targetElement = event.target as HTMLElement;
      const cellElement = targetElement.closest("td");

      if (cellElement) {
        const row = parseInt(cellElement.dataset.row || "0");
        const col = parseInt(cellElement.dataset.col || "0");
        setDragEndCell({ row, col });
      }
    },
    [isDragging],
  );

  const handleDragEnd = useCallback(() => {
    if (isDragging && dragStartCell && dragEndCell) {
      setIsDragging(false);

      const startRow = Math.min(dragStartCell.row, dragEndCell.row);
      const endRow = Math.max(dragStartCell.row, dragEndCell.row);
      const startCol = Math.min(dragStartCell.col, dragEndCell.col);
      const endCol = Math.max(dragStartCell.col, dragEndCell.col);

      const sourceValue =
        data[dragStartCell.row][columns[dragStartCell.col].accessor];
      const newData = data.map((row) => ({ ...row })); // Create a deep copy of objects

      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          const accessor = columns[c].accessor;
          newData[r][accessor] = sourceValue;
        }
      }
      onDataChange(newData);

      // Reset drag cells
      setDragStartCell(null);
      setDragEndCell(null);
    }
  }, [isDragging, dragStartCell, dragEndCell, data, columns, onDataChange]);

  // Effect to add/remove mouse listeners on window
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
    } else {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const getCellProps = (row: number, col: number) => ({
    "data-row": row,
    "data-col": col,
    tabIndex: activeCell?.row === row && activeCell?.col === col ? 0 : -1,
    onFocus: () => {
      setActiveCell({ row, col });
    },
    onDoubleClick: () => {
      startEditing(row, col);
    },
  });

  const getInputProps = () => {
    const shouldShowInput =
      isEditing && activeCell && columns[activeCell.col]?.isEditable !== false;

    if (!shouldShowInput) return { style: { display: "none" } };

    const cellElement = tableRef.current?.querySelector<HTMLElement>(
      `[data-row="${activeCell.row}"][data-col="${activeCell.col}"]`,
    );
    if (!cellElement) return { style: { display: "none" } };

    const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = cellElement;
    const style = {
      position: "absolute" as const,
      top: offsetTop,
      left: offsetLeft,
      width: offsetWidth,
      height: offsetHeight,
      zIndex: 1,
    };

    return {
      ref: inputRef,
      value: inputValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setInputValue(e.target.value),
      onBlur: () => stopEditing(),
      style,
      shouldShowInput: true,
    };
  };

  return {
    tableRef,
    data,
    activeCell,
    isEditing,
    getCellProps,
    getInputProps,
    handleDragStart,
    isDragging,
    dragStartCell,
    dragEndCell,
  };
}
