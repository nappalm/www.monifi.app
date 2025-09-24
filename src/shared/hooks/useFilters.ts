import { useState, useCallback, useMemo } from "react";

export const useFilters = <T extends Record<string, string[]>>(
  initialValues: T,
) => {
  const [filters, setFilters] = useState<T>(initialValues);

  const handleFilterChange = useCallback((key: keyof T, value: string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    const resetFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key as keyof T] = [] as any;
      return acc;
    }, {} as T);
    setFilters(resetFilters);
  }, [filters]);

  const areFiltersActive = useMemo(() => {
    return Object.values(filters).some((value) => value.length > 0);
  }, [filters]);

  return {
    filters,
    setFilter: handleFilterChange,
    clearFilters,
    areFiltersActive,
  };
};
