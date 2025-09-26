import { Navigate, Outlet, useLocation } from "react-router-dom";

import { AUTH_PATHS } from "@/features/auth/router/paths";
import { ONBOARDING_PATHS } from "@/features/onboarding";
import { useAuthenticatedUser } from "@/shared";
import { useProfile } from "../hooks/useProfile";

export function ProtectedRoute() {
  const { pathname } = useLocation();

  const { user, isLoadingSession, isLoadingProfile } = useAuthenticatedUser();
  const { isOnboarding } = useProfile(user);

  if ((isLoadingSession && user === null) || isLoadingProfile) {
    return <div>loading...</div>;
  }

  if (!user) {
    return <Navigate to={AUTH_PATHS.signIn} replace />;
  }

  if (!isOnboarding && !Object.values(ONBOARDING_PATHS).includes(pathname)) {
    return <Navigate to={ONBOARDING_PATHS.base} replace />;
  }

  return <Outlet />;
}
