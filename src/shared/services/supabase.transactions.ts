import { supabaseClient } from "@/lib";
import { TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";

export const getTransactions = async (dateRange?: [string, string] | null) => {
  let query = supabaseClient
    .from("transactions")
    .select("*")
    .order("id", { ascending: true });

  if (dateRange?.[0]) {
    query = query.gte("occurred_at", dateRange[0]);
  }
  if (dateRange?.[1]) {
    let endDate = dateRange[1];
    if (!endDate.includes(" ") && !endDate.includes("T")) {
      endDate = `${endDate} 23:59:59`;
    }
    query = query.lte("occurred_at", endDate);
  }

  const { data, error } = await query;
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
