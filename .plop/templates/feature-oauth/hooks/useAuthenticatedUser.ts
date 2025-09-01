import { supabaseClient as supabase } from "@/lib";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type UserWithToken = User & { access_token?: string };

type Profile = {
  id: string;
  full_name: string;
  avatar_url: string;
  website: string;
};

export default function useAuthenticatedUser() {
  const [user, setUser] = useState<UserWithToken | null>(null);
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error getting profile:", error.message);
      return null;
    }
    return data;
  };

  const { data: profile, isLoading: isLoadingProfile } = useQuery<
    Profile | null
  >({
    queryKey: ["profile", user?.id],
    queryFn: getProfile,
    enabled: !!user,
  });

  useEffect(() => {
    const getSession = async () => {
      if (!supabase) return;

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      const s = session?.user ?? null;

      if (error) {
        // eslint-disable-next-line no-console
        console.error("Error getting session:", error.message);
        setUser(null);
      } else {
        setUser(
          s
            ? {
                ...s,
                access_token: session?.access_token,
              }
            : null,
        );
      }
      setLoading(false);
    };

    getSession();

    if (!supabase) return;
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const s = session?.user ?? null;
        setUser(
          s
            ? {
                ...s,
                access_token: session?.access_token,
              }
            : null,
        );
        setLoading(false);
      },
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return {
    user: user
      ? {
          ...user,
          profile,
        }
      : null,
    loading: loading || isLoadingProfile,
  };
}
