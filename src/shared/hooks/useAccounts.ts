import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAccount,
  deleteAccount,
  getAccounts,
  updateAccount,
} from "../services/supabase.accounts";
import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/supabase/database.types";

export const useAccounts = () => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
    staleTime: Infinity,
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (account: TablesInsert<"accounts">) => createAccount(account),
    onMutate: async (newAccount) => {
      await queryClient.cancelQueries({ queryKey: ["accounts"] });
      const previousAccounts = queryClient.getQueryData<Tables<"accounts">[]>([
        "accounts",
      ]);
      queryClient.setQueryData(
        ["accounts"],
        [...(previousAccounts || []), { ...newAccount, id: Date.now() }],
      );
      return { previousAccounts };
    },
    onError: (_err, _newAccount, context) => {
      queryClient.setQueryData(["accounts"], context?.previousAccounts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      account,
    }: {
      id: number;
      account: TablesUpdate<"accounts">;
    }) => updateAccount(id, account),
    onMutate: async (newAccount) => {
      await queryClient.cancelQueries({ queryKey: ["accounts"] });
      const previousAccounts = queryClient.getQueryData<Tables<"accounts">[]>([
        "accounts",
      ]);
      queryClient.setQueryData(
        ["accounts"],
        previousAccounts?.map((account) =>
          account.id === newAccount.id
            ? { ...account, ...newAccount.account }
            : account,
        ),
      );
      return { previousAccounts };
    },
    onError: (_err, _newAccount, context) => {
      queryClient.setQueryData(["accounts"], context?.previousAccounts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAccount(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["accounts"] });
      const previousAccounts = queryClient.getQueryData<Tables<"accounts">[]>([
        "accounts",
      ]);
      queryClient.setQueryData(
        ["accounts"],
        previousAccounts?.filter((account) => account.id !== id),
      );
      return { previousAccounts };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["accounts"], context?.previousAccounts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};
