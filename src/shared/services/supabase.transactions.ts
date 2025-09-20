import { supabaseClient } from "@/lib";
import { TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";

export const getTransactions = async () => {
  const { data, error } = await supabaseClient
    .from("transactions")
    .select("*")
    .order("id", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
};

export const getTransactionById = async (id: number) => {
  const { data, error } = await supabaseClient
    .from("transactions")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const createTransaction = async (
  transaction: Omit<TablesInsert<"transactions">, "user_id">,
) => {
  const { data, error } = await supabaseClient
    .from("transactions")
    .insert(transaction as TablesInsert<"transactions">)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateTransaction = async ({
  id,
  ...transaction
}: { id: number } & Omit<TablesUpdate<"transactions">, "id">) => {
  const { data, error } = await supabaseClient
    .from("transactions")
    .update(transaction)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteTransaction = async (id: number) => {
  const { data, error } = await supabaseClient
    .from("transactions")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  return data;
};
