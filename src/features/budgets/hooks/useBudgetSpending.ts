import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { Tables } from "@/lib/supabase/database.types";
import { useMemo } from "react";
import { getPeriodDateRange, SelectedPeriod } from "../utils/period";

export type SpendingByCategory = Record<number, number>; // category_id → total gastado

export function useBudgetSpending(
  budget: Tables<"budgets"> | null,
  period: SelectedPeriod | null,
) {
  const dateRange = useMemo(() => {
    if (!budget || !period) return null;
    return getPeriodDateRange(budget, period);
  }, [budget, period]);

  const { data: transactions, isLoading } = useTransactions(dateRange);

  return useMemo(() => {
    if (!transactions) return { byCategory: {} as SpendingByCategory, total: 0, isLoading };

    const byCategory: SpendingByCategory = {};
    let total = 0;

    for (const tx of transactions) {
      if (tx.type !== "expense" || !tx.category_id) continue;
      byCategory[tx.category_id] = (byCategory[tx.category_id] ?? 0) + tx.amount;
      total += tx.amount;
    }

    return { byCategory, total, isLoading };
  }, [transactions, isLoading]);
}
