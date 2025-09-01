import { supabaseClient } from "@/lib";

export async function changePassword(password: string) {
  const { data, error } = await supabaseClient.auth.updateUser({
    password,
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteAccount() {
  const { data, error } =
    await supabaseClient.functions.invoke("delete-account");

  if (error) throw new Error(error.message);
  return data;
}
