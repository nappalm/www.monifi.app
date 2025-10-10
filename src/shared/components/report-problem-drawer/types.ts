import { Database, Tables, TablesInsert } from "@/lib/supabase/database.types";

export type Report = Tables<"reports">;
export type ReportInsert = TablesInsert<"reports">;
export type ReportStatus = Database["public"]["Enums"]["report_status"];
