import { Navigate, Outlet } from "react-router-dom";

import { AUTH_PATHS } from "@/features/auth/router/paths";
import useAuthenticatedUser from "../hooks/useAuthenticatedUser";

export default function AuthGuard() {
  const { user, loading } = useAuthenticatedUser();

  if (loading) {
    // Optionally, render a loading spinner or skeleton here
    return null;
  }

  if (!user) {
    return <Navigate to={AUTH_PATHS.signIn} replace />;
  }

  return <Outlet />;
}
