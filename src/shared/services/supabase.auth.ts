import { supabaseClient as supabase } from "@/lib";
import {
  type OAuthProvider,
  type SignInWithPassword,
  type SignUpWithPassword,
} from "./types";

export const signInWithEmail = async ({
  email,
  password,
}: SignInWithPassword) => {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signUpWithEmail = async ({
  email,
  password,
}: SignUpWithPassword) => {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
};

export const signInWithOAuth = async (provider: OAuthProvider) => {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const recoveryPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/singin`,
  });

  if (error) throw new Error(error.message);
};
