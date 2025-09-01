import { getProfiles } from "@/shared/services";
import { supabaseClient } from "@/lib";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { UserWithToken } from "../utils/types";

export const useProfile = (user: UserWithToken | null) => {
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfiles(),
    enabled: !!user,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    const profileChannel = supabaseClient
      .channel("custom-update-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        (payload) => {
          queryClient.setQueryData(["profile"], payload.new);
        },
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(profileChannel);
    };
  }, [queryClient]);

  return {
    profile,
    isLoadingProfile,
    isFree: profile?.subscription === "FREE" || !profile?.subscription,
  };
};
