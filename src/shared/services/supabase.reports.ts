import { supabaseClient } from "@/lib";
import { TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";

export const getReports = async () => {
  const { data, error } = await supabaseClient
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

export const getReportById = async (id: string) => {
  const { data, error } = await supabaseClient
    .from("reports")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const createReport = async (report: TablesInsert<"reports">) => {
  const { data, error } = await supabaseClient
    .from("reports")
    .insert(report)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateReport = async (
  id: string,
  report: TablesUpdate<"reports">,
) => {
  const { data, error } = await supabaseClient
    .from("reports")
    .update(report)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteReport = async (id: string) => {
  const { data, error } = await supabaseClient
    .from("reports")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  return data;
};
