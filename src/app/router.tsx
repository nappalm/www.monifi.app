import { AUTH_PATHS, authRoutes, ProtectedRoute } from "@/features/auth";
import { HOME_PATHS, homeRoutes } from "@/features/home";
import { SETTINGS_PATHS, settingsRoutes } from "@/features/settings";

import { BaseLayout, SettingsLayout } from "@/shared";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

/**
 * @constant protectedRoutes
 * @description These routes are protected by the AuthGuard and are only accessible to authenticated users.
 * These routes are rendered within the main Layout, which includes the navigation bar and other shared components.
 */
const protectedRoutes = [
  {
    element: <BaseLayout />,
    children: [
      {
        path: HOME_PATHS.base,
        children: homeRoutes,
      },
      {
        path: "*",
        element: <Navigate to={HOME_PATHS.base} replace />,
      },
    ],
  },
];

/**
 * @constant settingRoutes
 * @description These routes are protected by the AuthGuard and are only accessible to authenticated users.
 * These routes are rendered within the SettingsLayout, which is specific to the settings section of the application.
 */
const settingRoutes = [
  {
    element: <SettingsLayout />,
    children: [
      {
        path: SETTINGS_PATHS.base,
        children: settingsRoutes,
      },
      {
        path: "*",
        element: <Navigate to={HOME_PATHS.base} replace />,
      },
    ],
  },
];

/**
 * @constant publicRoutes
 * @description These routes are public and do not require authentication.
 * This includes the authentication-related routes like sign-in and sign-up.
 * If a user navigates to the base "/auth" path, they will be redirected to the sign-in page.
 */
const publicRoutes = [
  {
    path: AUTH_PATHS.base,
    children: [
      ...authRoutes,
      {
        index: true,
        element: <Navigate to={AUTH_PATHS.signIn} replace />,
      },
    ],
  },
];

/**
 * @constant routerConfiguration
 * @description The main router configuration for the application.
 * It combines protected and public routes. The AuthGuard is used to protect the routes that require authentication.
 */
const routerConfiguration = [
  {
    element: <ProtectedRoute />,
    children: [...protectedRoutes, ...settingRoutes],
  },
  ...publicRoutes,
];

const router = createBrowserRouter(routerConfiguration);

export default function Router() {
  return <RouterProvider router={router} />;
}
