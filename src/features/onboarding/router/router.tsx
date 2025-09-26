import { ONBOARDING_PATHS } from "./paths";

import Base from "../pages";
import BaseQuestionPage from "../pages/BaseQuestionPage";
import AccountsPage from "../pages/AccountsPage";
import CategoriesPage from "../pages/CategoriesPage";
import AppFeaturesPage from "../pages/AppFeaturesPage";

export const onboardingRoutes = [
  {
    index: true,
    element: <Base />,
  },
  {
    path: ONBOARDING_PATHS.baseQuestions,
    element: <BaseQuestionPage />,
  },
  {
    path: ONBOARDING_PATHS.accounts,
    element: <AccountsPage />,
  },
  {
    path: ONBOARDING_PATHS.categories,
    element: <CategoriesPage />,
  },
  {
    path: ONBOARDING_PATHS.appFeatures,
    element: <AppFeaturesPage />,
  },
];
