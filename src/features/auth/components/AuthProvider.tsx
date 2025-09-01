import { createContext, ReactNode } from "react";
import { AuthContextType } from "../utils/types";
import { useProfile } from "../hooks/useProfile";
import { useAuthSession } from "../hooks/useAuthSession";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isLoadingSession } = useAuthSession();
  const { profile, isLoadingProfile, isFree } = useProfile(user);

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
