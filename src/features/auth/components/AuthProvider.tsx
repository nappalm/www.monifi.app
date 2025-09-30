import { createContext, ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AuthContextType } from "../utils/types";
import { useProfile } from "../hooks/useProfile";
import { useAuthSession } from "../hooks/useAuthSession";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const { user, isLoadingSession } = useAuthSession();
  const { profile, isLoadingProfile, isFree } = useProfile(user);

  useEffect(() => {
    if (profile?.language) {
      i18n.changeLanguage(profile.language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.language]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingSession,
        profile,
        isLoadingProfile,
        isFree,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
