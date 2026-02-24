import { supabaseClient } from "@/lib";

export const getMonthlySummaries = async () => {
  const { data, error } = await supabaseClient
    .from("monthly_summaries")
    .select("*")
    .order("year", { ascending: false })
    .order("month", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};
