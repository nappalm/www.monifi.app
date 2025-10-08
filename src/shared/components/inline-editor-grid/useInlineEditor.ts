import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { DataRow, UseInlineEditorProps } from "./types";

export function useInlineEditor<T extends DataRow>({
  columns,
  data,
  onDataChange,
  onCellChange,
  onRowChange,
}: UseInlineEditorProps<T>) {
  const [activeCell, setActiveCell] = useState<{
    row: number;
    col: number;
  } | null>({ row: 0, col: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState<"up" | "down" | null>(
    null,
  );
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
      const accessor = columns[col].accessor as keyof T;
      setInputValue(String(data[row][accessor]));
    },
    [data, columns],
  );

  const stopEditing = useCallback(
    (update = true) => {
      if (isEditing && activeCell && update) {
        const { row: rowIndex, col: colIndex } = activeCell;
        const column = columns[colIndex];
        const accessor = column.accessor as keyof T;
        const previousValue = data[rowIndex][accessor];

        let processedValue: any = inputValue;
        if (column.isAmount) {
          const numericValue = parseFloat(inputValue.replace(/[^0-9.-]+/g, ""));
          processedValue = Number.isNaN(numericValue)
            ? previousValue
            : numericValue;
        }

        if (String(previousValue) !== String(processedValue)) {
          const newData = data.map((r) => ({ ...r }));
          newData[rowIndex][accessor] = processedValue;

          onDataChange?.(newData);

          const changedRow = newData[rowIndex];

          onCellChange?.({
            value: processedValue,
            previousValue,
            rowIndex,
            columnAccessor: accessor,
            row: changedRow,
          });

          onRowChange?.(changedRow, rowIndex);
        }
      }
      setIsEditing(false);
    },
    [
      isEditing,
      activeCell,
      inputValue,
      data,
      columns,
      onDataChange,
      onCellChange,
      onRowChange,
    ],
  );

  const updateCell = useCallback(
    (rowIndex: number, colIndex: number, value: any) => {
      const column = columns[colIndex];
      if (!column) return;

      const accessor = column.accessor as keyof T;
      const previousValue = data[rowIndex][accessor];

      if (String(previousValue) !== String(value)) {
        const newData = data.map((r, i) => {
          if (i === rowIndex) {
            return { ...r, [accessor]: value };
          }
          return r;
        });

        onDataChange?.(newData);

        const changedRow = newData[rowIndex];

        onCellChange?.({
          value: value,
          previousValue,
          rowIndex,
          columnAccessor: accessor,
          row: changedRow,
        });

        onRowChange?.(changedRow, rowIndex);
      }
    },
    [columns, data, onDataChange, onCellChange, onRowChange],
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
            // Find the cell and check for an interactive element like a button
            const cellElement = tableRef.current?.querySelector<HTMLElement>(
              `[data-row="${row}"][data-col="${col}"]`,
            );
            const interactiveElement = cellElement?.querySelector("button");

            if (interactiveElement) {
              // If a button is found, click it
              interactiveElement.click();
            } else {
              // Otherwise, fall back to the default behavior of starting to edit
              startEditing(row, col);
            }
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
  }, [activeCell]);

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
      if (!isDragging || !tableRef.current || !dragStartCell) return;

      // Get the cell element under the mouse
      const targetElement = event.target as HTMLElement;
      const cellElement = targetElement.closest("td");

      if (cellElement) {
        const row = parseInt(cellElement.dataset.row || "0");
        const col = parseInt(cellElement.dataset.col || "0");

        // Si hay una dirección de arrastre específica (desde los handles)
        if (dragDirection) {
          // Solo permitir arrastre en la misma columna
          if (col === dragStartCell.col) {
            // Validar la dirección del arrastre
            if (dragDirection === "down" && row >= dragStartCell.row) {
              setDragEndCell({ row, col });
            } else if (dragDirection === "up" && row <= dragStartCell.row) {
              setDragEndCell({ row, col });
            }
          }
        } else {
          // Arrastre normal (sin dirección específica)
          setDragEndCell({ row, col });
        }
      }
    },
    [isDragging, dragStartCell, dragDirection],
  );

  const handleDragEnd = useCallback(() => {
    if (isDragging && dragStartCell && dragEndCell) {
      setIsDragging(false);

      const startRow = Math.min(dragStartCell.row, dragEndCell.row);
      const endRow = Math.max(dragStartCell.row, dragEndCell.row);
      const startCol = Math.min(dragStartCell.col, dragEndCell.col);
      const endCol = Math.max(dragStartCell.col, dragEndCell.col);

      const sourceAccessor = columns[dragStartCell.col].accessor as keyof T;
      const sourceValue = data[dragStartCell.row][sourceAccessor];
      const newData = data.map((row) => ({ ...row })); // Create a deep copy of objects

      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          const accessor = columns[c].accessor as keyof T;
          newData[r][accessor] = sourceValue;
        }
      }
      onDataChange?.(newData);

      for (let r = startRow; r <= endRow; r++) {
        onRowChange?.(newData[r], r);
      }

      // Reset drag cells and direction
      setDragStartCell(null);
      setDragEndCell(null);
      setDragDirection(null);
    }
  }, [
    isDragging,
    dragStartCell,
    dragEndCell,
    data,
    columns,
    onDataChange,
    onRowChange,
  ]);

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

    const cellRect = cellElement.getBoundingClientRect();
    const containerRect = tableRef.current?.getBoundingClientRect();

    if (!containerRect) return { style: { display: "none" } };

    const style = {
      position: "absolute" as const,
      top: cellRect.top - containerRect.top,
      left: cellRect.left - containerRect.left,
      width: cellRect.width,
      height: cellRect.height,
      zIndex: 1,
    };

    const column = columns[activeCell.col];
    const inputType = column.isAmount ? "number" : "text";

    return {
      ref: inputRef,
      value: inputValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setInputValue(e.target.value),
      onBlur: () => stopEditing(),
      style,
      shouldShowInput: true,
      type: inputType,
      step: column.isAmount ? "0.01" : undefined,
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
    handleDragHandleStart,
    isDragging,
    dragStartCell,
    dragEndCell,
    updateCell,
  };
}
