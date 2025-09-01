import { Navigate, Outlet } from "react-router-dom";

import { AUTH_PATHS } from "@/features/auth/router/paths";
import { useAuthenticatedUser } from "@/shared";

export function ProtectedRoute() {
  const { user, isLoadingSession, isLoadingProfile } = useAuthenticatedUser();
  if ((isLoadingSession && user === null) || isLoadingProfile) {
    return <div>loading...</div>;
  }

  if (!user) {
    return <Navigate to={AUTH_PATHS.signIn} replace />;
  }

  return <Outlet />;
}
