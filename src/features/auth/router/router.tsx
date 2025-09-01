import { AUTH_PATHS } from "./paths";
import RecoveryPage from "../pages/RecoveryPage";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";

export const authRoutes = [
  {
    path: AUTH_PATHS.signIn,
    element: <SignInPage />,
  },
  {
    path: AUTH_PATHS.signUp,
    element: <SignUpPage />,
  },
  {
    path: AUTH_PATHS.recovery,
    element: <RecoveryPage />,
  },
];
