import { supabaseClient } from "@/lib";
import { type UpdateProfile } from "./types";

export async function updateEmail(email: string) {
  const { data, error } = await supabaseClient.auth.updateUser({ email });

  if (error) throw new Error(error.message);
  return data;
}

export async function updateProfile(values: UpdateProfile) {
  const { uuid, ...profileData } = values;
  const { data, error } = await supabaseClient
    .from("profiles")
    .update(profileData)
    .eq("id", uuid);

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
