import { useCallback, useEffect } from "react";
import { flushSync } from "react-dom";
import type { CellCoord, EditState } from "../types";

interface UseGridNavigationProps {
  containerRef: React.RefObject<HTMLDivElement>;
  activeCell: CellCoord | null;
  setActiveCell: (cell: CellCoord | null) => void;
  editState: EditState;
  startEditing: (row: number, col: number) => void;
  stopEditing: (update?: boolean) => void;
  setInputValue: (value: string) => void;
  numRows: number;
  numCols: number;
}

export function useGridNavigation({
  containerRef,
  activeCell,
  setActiveCell,
  editState,
  startEditing,
  stopEditing,
  setInputValue,
  numRows,
  numCols,
}: UseGridNavigationProps) {
  const isEditing = editState.status === "editing";

  const focusCell = useCallback(
    (row: number, col: number) => {
      containerRef.current
        ?.querySelector<HTMLElement>(`[data-row="${row}"][data-col="${col}"]`)
        ?.focus();
    },
    [containerRef],
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
        focusCell(newRow, newCol);
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
        case "Tab": {
          event.preventDefault();
          if (isEditing) stopEditing();
          let newRow = row;
          let newCol = col + (event.shiftKey ? -1 : 1);
          if (newCol < 0) {
            newRow = Math.max(0, row - 1);
            newCol = numCols - 1;
          } else if (newCol >= numCols) {
            newRow = Math.min(numRows - 1, row + 1);
            newCol = 0;
          }
          if (newRow < 0) newRow = 0;
          setActiveCell({ row: newRow, col: newCol });
          focusCell(newRow, newCol);
          break;
        }
        case "Enter":
          event.preventDefault();
          if (isEditing) {
            flushSync(() => {
              stopEditing();
            });
            const nextRow = Math.min(numRows - 1, row + 1);
            setActiveCell({ row: nextRow, col });
            focusCell(nextRow, col);
          } else {
            const cellElement = containerRef.current?.querySelector<HTMLElement>(
              `[data-row="${row}"][data-col="${col}"]`,
            );
            const interactiveElement = cellElement?.querySelector("button");
            if (interactiveElement) {
              interactiveElement.click();
            } else {
              startEditing(row, col);
            }
          }
          break;
        case "Escape":
          if (isEditing) {
            flushSync(() => {
              stopEditing(false);
            });
            focusCell(row, col);
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
    [
      activeCell,
      isEditing,
      numRows,
      numCols,
      startEditing,
      stopEditing,
      setActiveCell,
      setInputValue,
      focusCell,
      containerRef,
    ],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("keydown", handleKeyDown);
      return () => container.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleKeyDown, containerRef]);

  return { focusCell };
}
