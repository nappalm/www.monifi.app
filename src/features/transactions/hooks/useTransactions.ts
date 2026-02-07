import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/supabase/database.types";
import { useOptimisticMutation } from "@/shared";
import {
  createBulkTransactions,
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
    Omit<TablesInsert<"transactions">, "user_id">,
    Tables<"transactions">
  >(
    [CACHE_KEY],
    createTransaction,
    (previous, newTransaction) => {
      return [...(previous || []), newTransaction];
    },
    (previous, serverResponse) => {
      // Reemplazar el elemento optimista con el elemento real del servidor
      // Asumiendo que el elemento optimista es el último
      const withoutOptimistic = previous?.slice(0, -1) || [];
      return [...withoutOptimistic, serverResponse];
    },
  );

export const useCreateBulkTransactions = () =>
  useOptimisticMutation<
    Partial<Tables<"transactions">>,
    Omit<TablesInsert<"transactions">, "user_id">[],
    Tables<"transactions">[]
  >(
    [CACHE_KEY],
    createBulkTransactions,
    (previous, newTransactions) => {
      return [...(previous || []), ...newTransactions];
    },
    (previous, serverResponse) => {
      const withoutOptimistic =
        previous?.slice(0, -serverResponse.length) || [];
      return [...withoutOptimistic, ...serverResponse];
    },
  );

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
  useOptimisticMutation<Tables<"transactions">, number, null>(
    [CACHE_KEY],
    deleteTransaction,
    (previous, id) => previous?.filter((t) => t.id !== id),
  );
