import { supabaseClient } from "@/lib";
import { TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";

export const getBudgets = async () => {
  const { data, error } = await supabaseClient.from("budgets").select("*");
  if (error) throw new Error(error.message);
  return data;
};

export const getBudgetById = async (id: number) => {
  const { data, error } = await supabaseClient
    .from("budgets")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const createBudget = async (budget: TablesInsert<"budgets">) => {
  const { data, error } = await supabaseClient
    .from("budgets")
    .insert(budget)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateBudget = async (
  id: number,
  budget: TablesUpdate<"budgets">,
) => {
  const { data, error } = await supabaseClient
    .from("budgets")
    .update(budget)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteBudget = async (id: number) => {
  const { data, error } = await supabaseClient
    .from("budgets")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  return data;
};
