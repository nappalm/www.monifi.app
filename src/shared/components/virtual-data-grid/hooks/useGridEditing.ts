import { useCallback, useState } from "react";
import type { CellChange, ComputedColumn, DataRow, EditState } from "../types";

interface UseGridEditingProps<T extends DataRow> {
  columns: ComputedColumn<T>[];
  data: T[];
  onDataChange?: (newData: T[]) => void;
  onCellChange?: (change: CellChange<T>) => void;
  onRowChange?: (row: T, rowIndex: number, colIndex: number) => void;
}

export function useGridEditing<T extends DataRow>({
  columns,
  data,
  onDataChange,
  onCellChange,
  onRowChange,
}: UseGridEditingProps<T>) {
  const [editState, setEditState] = useState<EditState>({ status: "idle" });
  const [inputValue, setInputValue] = useState("");

  const startEditing = useCallback(
    (row: number, col: number) => {
      const column = columns[col];
      if (!column || column.isEditable === false) return;
      const accessor = column.accessor as keyof T;
      const rawValue = data[row]?.[accessor];
      const initial = rawValue != null ? String(rawValue) : "";
      setInputValue(initial);
      setEditState({
        status: "editing",
        coord: { row, col },
        initialValue: initial,
      });
    },
    [data, columns],
  );

  const stopEditing = useCallback(
    (update = true) => {
      if (editState.status !== "editing") {
        setEditState({ status: "idle" });
        return;
      }

      const { coord } = editState;
      const column = columns[coord.col];
      if (!column) {
        setEditState({ status: "idle" });
        return;
      }

      if (update) {
        const accessor = column.accessor as keyof T;
        const previousValue = data[coord.row]?.[accessor];

        let processedValue: any = inputValue;
        if (column.isAmount) {
          const numericValue = parseFloat(inputValue.replace(/[^0-9.-]+/g, ""));
          processedValue = Number.isNaN(numericValue)
            ? previousValue
            : numericValue;
        }

        if (String(previousValue) !== String(processedValue)) {
          const newData = data.map((r, i) => {
            if (i === coord.row) return { ...r, [accessor]: processedValue };
            return r;
          });

          onDataChange?.(newData);

          const changedRow = newData[coord.row];
          onCellChange?.({
            value: processedValue,
            previousValue,
            rowIndex: coord.row,
            columnAccessor: accessor,
            row: changedRow,
          });
          onRowChange?.(changedRow, coord.row, coord.col);
        }
      }

      setEditState({ status: "idle" });
    },
    [
      editState,
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
      const previousValue = data[rowIndex]?.[accessor];

      if (String(previousValue) !== String(value)) {
        const newData = data.map((r, i) => {
          if (i === rowIndex) return { ...r, [accessor]: value };
          return r;
        });

        onDataChange?.(newData);

        const changedRow = newData[rowIndex];
        onCellChange?.({
          value,
          previousValue,
          rowIndex,
          columnAccessor: accessor,
          row: changedRow,
        });
        onRowChange?.(changedRow, rowIndex, colIndex);
      }
    },
    [columns, data, onDataChange, onCellChange, onRowChange],
  );

  return {
    editState,
    inputValue,
    setInputValue,
    startEditing,
    stopEditing,
    updateCell,
  };
}
