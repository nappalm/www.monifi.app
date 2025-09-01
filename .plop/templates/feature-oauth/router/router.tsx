import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";

export const authRoutes = [
  {
    path: "signin",
    element: <SignInPage />,
  },
  {
    path: "signup",
    element: <SignUpPage />,
  },
];
