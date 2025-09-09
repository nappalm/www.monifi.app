import { supabaseClient } from "@/lib";
import { TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";

export const getAccounts = async () => {
  const { data, error } = await supabaseClient.from("accounts").select("*");
  if (error) throw new Error(error.message);
  return data;
};

export const getAccountById = async (id: number) => {
  const { data, error } = await supabaseClient
    .from("accounts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const createAccount = async (account: TablesInsert<"accounts">) => {
  const { data, error } = await supabaseClient
    .from("accounts")
    .insert(account)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateAccount = async (
  id: number,
  account: TablesUpdate<"accounts">,
) => {
  const { data, error } = await supabaseClient
    .from("accounts")
    .update(account)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteAccount = async (id: number) => {
  const { data, error } = await supabaseClient
    .from("accounts")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  return data;
};
