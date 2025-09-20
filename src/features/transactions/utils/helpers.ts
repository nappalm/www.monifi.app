import { TablesInsert } from "@/lib/supabase/database.types";

export const getNewTransaction = (): Omit<
  TablesInsert<"transactions">,
  "user_id"
> => ({
  amount: 0,
  account_id: 1,
  category_id: null,
  occurred_at: new Date().toISOString(),
  description: "",
  type: "expense",
});
