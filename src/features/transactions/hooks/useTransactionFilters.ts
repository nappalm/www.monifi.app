import { useState } from "react";

export interface TransactionFilters {
  categories: string[];
  accounts: string[];
  types: string[];
}

export const useTransactionFilters = (
  initialFilters: Partial<TransactionFilters> = {},
) => {
  const [filters, setFilters] = useState<TransactionFilters>({
    categories: initialFilters.categories || [],
    accounts: initialFilters.accounts || [],
    types: initialFilters.types || [],
  });

  const setCategories = (categories: string[]) => {
    setFilters((prev) => ({ ...prev, categories }));
  };

  const setAccounts = (accounts: string[]) => {
    setFilters((prev) => ({ ...prev, accounts }));
  };

  const setTypes = (types: string[]) => {
    setFilters((prev) => ({ ...prev, types }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      accounts: [],
      types: [],
    });
  };

  return {
    filters,
    setCategories,
    setAccounts,
    setTypes,
    clearFilters,
  };
};
