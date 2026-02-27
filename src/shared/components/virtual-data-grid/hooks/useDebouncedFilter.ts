import { useMemo, useState, useTransition } from "react";
import type { DataRow } from "../types";

export function useDebouncedFilter<T extends DataRow>(
  data: T[],
  enabled: boolean,
  filterFn?: (row: T, filterValue: string) => boolean,
) {
  const [filterValue, setFilterValue] = useState("");
  const [deferredFilter, setDeferredFilter] = useState("");
  const [, startTransition] = useTransition();

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    startTransition(() => {
      setDeferredFilter(value);
    });
  };

  const filteredData = useMemo(() => {
    if (!enabled || !deferredFilter) return data;
    if (filterFn) return data.filter((row) => filterFn(row, deferredFilter));

    const lower = deferredFilter.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some(
        (val) => val != null && String(val).toLowerCase().includes(lower),
      ),
    );
  }, [data, enabled, deferredFilter, filterFn]);

  return {
    filterValue,
    handleFilterChange,
    filteredData,
  };
}
