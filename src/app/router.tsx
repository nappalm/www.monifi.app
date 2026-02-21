import { AUTH_PATHS, authRoutes, ProtectedRoute } from "@/features/auth";
import { BUDGETS_PATHS, budgetsRoutes } from "@/features/budgets";
import { GOALS_PATHS, goalsRoutes } from "@/features/goals";
import { ONBOARDING_PATHS, onboardingRoutes } from "@/features/onboarding";
import { SETTINGS_PATHS, settingsRoutes } from "@/features/settings";
import { STATISTICS_PATHS, statisticsRoutes } from "@/features/statistics";
import {
  TRANSACTIONS_PATHS,
  transactionsRoutes,
} from "@/features/transactions";

import { BaseLayout, SettingsLayout, SimpleLayout } from "@/shared";
import { Children } from "react";
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
        path: TRANSACTIONS_PATHS.base,
        children: transactionsRoutes,
      },
      {
        path: BUDGETS_PATHS.base,
        children: budgetsRoutes,
      },
      {
        path: GOALS_PATHS.base,
        children: goalsRoutes,
      },
      {
        path: STATISTICS_PATHS.base,
        children: statisticsRoutes,
      },
      {
        path: "*",
        element: <Navigate to={TRANSACTIONS_PATHS.base} replace />,
      },
    ],
  },
];

const onboardingProtectedRoutes = [
  {
    element: <SimpleLayout />,
    children: [
      {
        path: ONBOARDING_PATHS.base,
        children: onboardingRoutes,
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
        element: <Navigate to={SETTINGS_PATHS.base} replace />,
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
    children: [
      ...protectedRoutes,
      ...settingRoutes,
      ...onboardingProtectedRoutes,
    ],
  },
  ...publicRoutes,
];

const router = createBrowserRouter(routerConfiguration);

export default function Router() {
  return <RouterProvider router={router} />;
}
