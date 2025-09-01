import { useMutation } from "@tanstack/react-query";
import {
  recoveryPassword,
  signInWithEmail,
  signInWithOAuth,
  signOut,
  signUpWithEmail,
} from "../services/auth.supabase";

export const useSignInWithEmail = () =>
  useMutation({
    mutationFn: signInWithEmail,
  });

export const useRecoveryPassword = () =>
  useMutation({
    mutationFn: recoveryPassword,
  });

export const useSignUpWithEmail = () =>
  useMutation({
    mutationFn: signUpWithEmail,
  });

export const useSignInWithOAuth = () =>
  useMutation({
    mutationFn: signInWithOAuth,
  });

export const useSignOut = () =>
  useMutation({
    mutationFn: signOut,
  });
