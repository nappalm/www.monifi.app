import { supabaseClient as supabase } from "@/lib";
import { useEffect, useState } from "react";
import { UserWithToken } from "../utils/types";
import { mapSessionToUser } from "../utils/user";

export const useAuthSession = () => {
  const [user, setUser] = useState<UserWithToken | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        // eslint-disable-next-line no-console
        console.error("Error getting session:", error.message);
        setUser(null);
      } else {
        setUser(mapSessionToUser(data.session));
      }
      setIsLoadingSession(false);
    };

    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(mapSessionToUser(session));
        setIsLoadingSession(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, isLoadingSession };
};
