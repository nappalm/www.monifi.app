import { supabaseClient, TablesUpdate } from "@/lib";

export async function updateEmail(email: string) {
  const { data, error } = await supabaseClient.auth.updateUser({ email });

  if (error) throw new Error(error.message);
  return data;
}

export async function updateProfile({
  id,
  ...values
}: TablesUpdate<"profiles">) {
  if (!id) return;

  const { data, error } = await supabaseClient
    .from("profiles")
    .update(values)
    .eq("id", id);

  if (error) throw new Error(error.message);
  return data;
}

export async function getProfiles() {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}
