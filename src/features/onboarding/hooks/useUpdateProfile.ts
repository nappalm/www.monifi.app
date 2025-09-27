import { useMutation } from "@tanstack/react-query";

import { TablesUpdate } from "@/lib";
import { updateProfile } from "@/shared/services/supabase.profiles";

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (values: TablesUpdate<"profiles">) => updateProfile(values),
  });
}
