import { Tables, TablesInsert } from "@/lib/supabase/database.types";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "@/shared/services/supabase.transactions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
    staleTime: Infinity,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transaction: TablesInsert<"transactions">) =>
      createTransaction(transaction),
    onMutate: async (newTransaction) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });
      const previousTransactions = queryClient.getQueryData<
        Tables<"transactions">[]
      >(["transactions"]);
      queryClient.setQueryData(
        ["transactions"],
        [
          ...(previousTransactions || []),
          { ...newTransaction, id: Date.now() },
        ],
      );
      return { previousTransactions };
    },
    onError: (err, newTransaction, context) => {
      queryClient.setQueryData(["transactions"], context?.previousTransactions);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTransaction,
    onMutate: async (updatedTransaction) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });
      const previousTransactions = queryClient.getQueryData<
        Tables<"transactions">[]
      >(["transactions"]);
      queryClient.setQueryData(
        ["transactions"],
        previousTransactions?.map((transaction) =>
          transaction.id === updatedTransaction.id
            ? { ...transaction, ...updatedTransaction.transaction }
            : transaction,
        ),
      );
      return { previousTransactions };
    },
    onError: (err, updatedTransaction, context) => {
      queryClient.setQueryData(["transactions"], context?.previousTransactions);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTransaction(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });
      const previousTransactions = queryClient.getQueryData<
        Tables<"transactions">[]
      >(["transactions"]);
      queryClient.setQueryData(
        ["transactions"],
        previousTransactions?.filter((transaction) => transaction.id !== id),
      );
      return { previousTransactions };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["transactions"], context?.previousTransactions);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
