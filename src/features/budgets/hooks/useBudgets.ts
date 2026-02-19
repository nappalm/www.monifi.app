import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/supabase/database.types";
import { useOptimisticMutation } from "@/shared";
import {
  createBudget,
  deleteBudget,
  getBudgets,
  updateBudget,
} from "@/shared/services/supabase.budgets";
import { useQuery } from "@tanstack/react-query";

const CACHE_KEY = "budgets";

export const useBudgets = () => {
  return useQuery({
    queryKey: [CACHE_KEY],
    queryFn: getBudgets,
    staleTime: Infinity,
  });
};

export const useCreateBudget = () =>
  useOptimisticMutation<
    Tables<"budgets">,
    TablesInsert<"budgets">,
    Tables<"budgets">
  >(
    [CACHE_KEY],
    createBudget,
    (previous, newBudget) => [
      ...(previous || []),
      newBudget as Tables<"budgets">,
    ],
    (previous, serverResponse) => {
      const withoutOptimistic = previous?.slice(0, -1) || [];
      return [...withoutOptimistic, serverResponse];
    },
  );

export const useUpdateBudget = () =>
  useOptimisticMutation<
    Tables<"budgets">,
    { id: number } & Omit<TablesUpdate<"budgets">, "id">,
    Tables<"budgets">
  >(
    [CACHE_KEY],
    ({ id, ...budget }) => updateBudget(id, budget),
    (previous, updatedBudget) =>
      previous?.map((b) =>
        b.id === updatedBudget.id ? { ...b, ...updatedBudget } : b,
      ),
    (previous, serverResponse) =>
      previous?.map((b) => (b.id === serverResponse.id ? serverResponse : b)),
  );

export const useDeleteBudget = () =>
  useOptimisticMutation<Tables<"budgets">, number, null>(
    [CACHE_KEY],
    deleteBudget,
    (previous, id) => previous?.filter((b) => b.id !== id),
  );
