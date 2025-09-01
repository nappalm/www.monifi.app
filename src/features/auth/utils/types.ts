import { Tables } from "@/lib";
import { User } from "@supabase/supabase-js";

export type OnSubmitRecovery = {
  email: string;
};

export type OnSubmitEmailPassword = {
  email: string;
  password: string;
};

export type OnSubmitOAuth =
  | "apple"
  | "azure"
  | "bitbucket"
  | "discord"
  | "facebook"
  | "figma"
  | "github"
  | "gitlab"
  | "google"
  | "kakao"
  | "keycloak"
  | "linkedin"
  | "notion"
  | "slack"
  | "spotify"
  | "twitch"
  | "twitter"
  | "workos"
  | "zoom";

export type UserWithToken = User & { access_token?: string };
export type Profile = Tables<"profiles">;
export type AuthContextType = {
  user: UserWithToken | null;
  isLoadingSession: boolean;
  profile: Profile | null | undefined;
  isLoadingProfile: boolean;
  isFree: boolean;
};
