import { useMutation } from "@tanstack/react-query";

import { updateProfile } from "@/shared/services/supabase.profiles";
import { type UpdateProfile } from "@/shared/services/types";

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (values: UpdateProfile) => updateProfile(values),
  });
}
