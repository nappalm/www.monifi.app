import { useMutation } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import {
  changePassword,
  deleteAccount,
  updateEmail,
  updateProfile,
} from "@/shared/services";

export const useUpdateProfile = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast({
        variant: "toast",
        title: "Profile updated",
        description: "Your profile has been updated.",
        position: "bottom-right",
      });
    },
  });
};

export const useUpdateEmail = () => {
  return useMutation({
    mutationFn: updateEmail,
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: deleteAccount,
  });
};
