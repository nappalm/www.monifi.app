import { supabaseClient } from "@/lib";
import { TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";

export const getCategories = async () => {
  const { data, error } = await supabaseClient.from("categories").select("*");
  if (error) throw new Error(error.message);
  return data;
};

export const getCategoryById = async (id: number) => {
  const { data, error } = await supabaseClient
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const createCategory = async (category: TablesInsert<"categories">) => {
  const { data, error } = await supabaseClient
    .from("categories")
    .insert(category)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const bulkCreateCategories = async (
  categories: TablesInsert<"categories">[],
) => {
  const { data, error } = await supabaseClient
    .from("categories")
    .insert(categories)
    .select();
  if (error) throw new Error(error.message);
  return data;
};

export const updateCategory = async (
  id: number,
  category: TablesUpdate<"categories">,
) => {
  const { data, error } = await supabaseClient
    .from("categories")
    .update(category)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteCategory = async (id: number) => {
  const { data, error } = await supabaseClient
    .from("categories")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  return data;
};
