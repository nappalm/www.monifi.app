import { useState, useRef, useEffect, useCallback } from "react";
import { flushSync } from "react-dom";

interface UseInlineEditorProps<T> {
  initialData: T[][];
}

export function useInlineEditor<T>({ initialData }: UseInlineEditorProps<T>) {
  const [data, setData] = useState(initialData);
  const [activeCell, setActiveCell] = useState<{
    row: number;
    col: number;
  } | null>({ row: 0, col: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  const tableRef = useRef<HTMLTableElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const numRows = data.length;
  const numCols = data.length > 0 ? data[0].length : 0;

  const startEditing = useCallback(
    (row: number, col: number) => {
      setActiveCell({ row, col });
      setIsEditing(true);
      setInputValue(String(data[row][col]));
    },
    [data],
  );

  const stopEditing = useCallback(
    (update = true) => {
      if (isEditing && activeCell && update) {
        const { row, col } = activeCell;
        const newData = data.map((r) => [...r]);
        // This is a simplification. In a real app, you'd handle type conversions.
        newData[row][col] = inputValue as T;
        setData(newData);
      }
      setIsEditing(false);
    },
    [isEditing, activeCell, inputValue, data],
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
    if (!isEditing || !activeCell) return { style: { display: "none" } };

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
    };
  };

  return {
    tableRef,
    data,
    activeCell,
    isEditing,
    getCellProps,
    getInputProps,
  };
}
