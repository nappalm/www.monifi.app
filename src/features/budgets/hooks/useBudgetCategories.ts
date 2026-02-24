import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/supabase/database.types";
import { useOptimisticMutation } from "@/shared";
import {
  bulkUpsertBudgetCategories,
  createBudgetCategory,
  deleteBudgetCategory,
  getBudgetCategories,
  updateBudgetCategory,
} from "@/shared/services/supabase.budgetCategories";
import { useQuery } from "@tanstack/react-query";

const CACHE_KEY = "budget_categories";

export const useBudgetCategories = (budgetId?: number) => {
  return useQuery({
    queryKey: [CACHE_KEY, budgetId],
    queryFn: () => getBudgetCategories(budgetId!),
    staleTime: Infinity,
    enabled: !!budgetId,
  });
};

export const useCreateBudgetCategory = () =>
  useOptimisticMutation<
    Partial<Tables<"budget_categories">>,
    { budgetId: number; userId: string },
    Partial<Tables<"budget_categories">>
  >(
    [CACHE_KEY],
    createBudgetCategory,
    (previous) => previous,
    (previous, serverResponse) => [...(previous || []), serverResponse],
  );

export const useUpdateBudgetCategory = () =>
  useOptimisticMutation<
    Partial<Tables<"budget_categories">>,
    { id: number } & Omit<TablesUpdate<"budget_categories">, "id">
  >(
    [CACHE_KEY],
    ({ id, ...category }) => updateBudgetCategory(id, category),
    (previous, updatedCategory) =>
      previous?.map((c) =>
        c.id === updatedCategory.id ? { ...c, ...updatedCategory } : c,
      ),
  );

export const useDeleteBudgetCategory = () =>
  useOptimisticMutation<Tables<"budget_categories">, number, null>(
    [CACHE_KEY],
    deleteBudgetCategory,
    (previous, id) => previous?.filter((c) => c.id !== id),
  );

export const useBulkUpsertBudgetCategories = () =>
  useOptimisticMutation<
    Partial<Tables<"budget_categories">>,
    TablesInsert<"budget_categories">[],
    Tables<"budget_categories">[]
  >(
    [CACHE_KEY],
    bulkUpsertBudgetCategories,
    (previous, newCategories) => [...(previous || []), ...newCategories],
    (previous, serverResponse) => {
      const serverIds = new Set(serverResponse.map((c) => c.id));
      const withoutUpserted =
        previous?.filter((c) => !serverIds.has(c.id)) || [];
      return [...withoutUpserted, ...serverResponse];
    },
  );
