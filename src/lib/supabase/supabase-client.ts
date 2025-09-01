import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY;

export const supabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
);
