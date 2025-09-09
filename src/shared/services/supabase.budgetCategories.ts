import { supabaseClient } from "@/lib";
import { TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";

export const getBudgetCategories = async () => {
  const { data, error } = await supabaseClient
    .from("budget_categories")
    .select("*");
  if (error) throw new Error(error.message);
  return data;
};

export const getBudgetCategoryById = async (id: number) => {
  const { data, error } = await supabaseClient
    .from("budget_categories")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const createBudgetCategory = async (
  budgetCategory: TablesInsert<"budget_categories">,
) => {
  const { data, error } = await supabaseClient
    .from("budget_categories")
    .insert(budgetCategory)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateBudgetCategory = async (
  id: number,
  budgetCategory: TablesUpdate<"budget_categories">,
) => {
  const { data, error } = await supabaseClient
    .from("budget_categories")
    .update(budgetCategory)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteBudgetCategory = async (id: number) => {
  const { data, error } = await supabaseClient
    .from("budget_categories")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  return data;
};
