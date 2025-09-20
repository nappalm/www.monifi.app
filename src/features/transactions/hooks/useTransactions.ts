import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/supabase/database.types";
import { useOptimisticMutation } from "@/shared";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "@/shared/services/supabase.transactions";
import { useQuery } from "@tanstack/react-query";

const CACHE_KEY = "transactions";

export const useTransactions = (dateRange?: [string, string] | null) => {
  return useQuery({
    queryKey: [CACHE_KEY, dateRange],
    queryFn: () => getTransactions(dateRange),
    staleTime: Infinity,
    enabled: !!dateRange,
  });
};

export const useCreateTransaction = () =>
  useOptimisticMutation<
    Partial<Tables<"transactions">>,
    Omit<TablesInsert<"transactions">, "user_id">
  >([CACHE_KEY], createTransaction, (previous, newTransaction) => {
    return [...(previous || []), newTransaction];
  });

export const useUpdateTransaction = () =>
  useOptimisticMutation<
    Partial<Tables<"transactions">>,
    { id: number } & Omit<TablesUpdate<"transactions">, "id">
  >([CACHE_KEY], updateTransaction, (previous, updatedTransaction) =>
    previous?.map((t) =>
      t.id === updatedTransaction.id ? { ...t, ...updatedTransaction } : t,
    ),
  );

export const useDeleteTransaction = () =>
  useOptimisticMutation<Tables<"transactions">, number>(
    [CACHE_KEY],
    deleteTransaction,
    (previous, id) => previous?.filter((t) => t.id !== id),
  );
