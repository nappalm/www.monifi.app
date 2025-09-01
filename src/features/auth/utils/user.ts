import { Session } from "@supabase/supabase-js";
import { UserWithToken } from "./types";

export function mapSessionToUser(
  session: Session | null,
): UserWithToken | null {
  if (!session?.user) return null;
  return { ...session.user, access_token: session.access_token };
}
