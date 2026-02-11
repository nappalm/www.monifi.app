import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bulkCreateCategories,
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../services/supabase.categories";
import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/supabase/database.types";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: Infinity,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: TablesInsert<"categories">) =>
      createCategory(category),
    onMutate: async (newCategory) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });
      const previousCategories = queryClient.getQueryData<
        Tables<"categories">[]
      >(["categories"]);
      queryClient.setQueryData(
        ["categories"],
        [...(previousCategories || []), { ...newCategory, id: Date.now() }],
      );
      return { previousCategories };
    },
    onError: (_err, _newCategory, context) => {
      queryClient.setQueryData(["categories"], context?.previousCategories);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useBulkCreateCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categories: TablesInsert<"categories">[]) =>
      bulkCreateCategories(categories),
    onMutate: async (newCategories) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });
      const previousCategories = queryClient.getQueryData<
        Tables<"categories">[]
      >(["categories"]);
      const optimisticCategories = newCategories.map((cat, index) => ({
        ...cat,
        id: Date.now() + index,
      }));
      queryClient.setQueryData(
        ["categories"],
        [...(previousCategories || []), ...optimisticCategories],
      );
      return { previousCategories };
    },
    onError: (_err, _newCategories, context) => {
      queryClient.setQueryData(["categories"], context?.previousCategories);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      category,
    }: {
      id: number;
      category: TablesUpdate<"categories">;
    }) => updateCategory(id, category),
    onMutate: async (newCategory) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });
      const previousCategories = queryClient.getQueryData<
        Tables<"categories">[]
      >(["categories"]);
      queryClient.setQueryData(
        ["categories"],
        previousCategories?.map((category) =>
          category.id === newCategory.id
            ? { ...category, ...newCategory.category }
            : category,
        ),
      );
      return { previousCategories };
    },
    onError: (_err, _newCategory, context) => {
      queryClient.setQueryData(["categories"], context?.previousCategories);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });
      const previousCategories = queryClient.getQueryData<
        Tables<"categories">[]
      >(["categories"]);
      queryClient.setQueryData(
        ["categories"],
        previousCategories?.filter((category) => category.id !== id),
      );
      return { previousCategories };
    },

    onError: (_err, _id, context) => {
      queryClient.setQueryData(["categories"], context?.previousCategories);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
