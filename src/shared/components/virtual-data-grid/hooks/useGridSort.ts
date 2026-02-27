import { useCallback, useMemo, useState } from "react";
import type { DataRow } from "../types";

type SortDirection = "asc" | "desc" | null;

interface SortState {
  column: string | null;
  direction: SortDirection;
}

export function useGridSort<T extends DataRow>(data: T[]) {
  const [sort, setSort] = useState<SortState>({ column: null, direction: null });

  const onSort = useCallback((accessor: string) => {
    setSort((prev) => {
      if (prev.column !== accessor) return { column: accessor, direction: "asc" };
      if (prev.direction === "asc") return { column: accessor, direction: "desc" };
      return { column: null, direction: null };
    });
  }, []);

  const sortColumn = sort.column;
  const sortDirection = sort.direction;

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let cmp: number;
      if (typeof aVal === "number" && typeof bVal === "number") {
        cmp = aVal - bVal;
      } else {
        cmp = String(aVal).localeCompare(String(bVal), undefined, {
          numeric: true,
          sensitivity: "base",
        });
      }

      return sortDirection === "asc" ? cmp : -cmp;
    });
  }, [data, sortColumn, sortDirection]);

  return { sortedData, sortColumn, sortDirection, onSort };
}
