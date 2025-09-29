import { ONBOARDING_PATHS } from "./paths";

import Base from "../pages/OnboardingPage";
import BaseQuestionPage from "../pages/OnboardingBaseQuestionPage";
import AccountsPage from "../pages/OnboardingAccountsPage";
import CategoriesPage from "../pages/OnboardingCategoriesPage";
import AppFeaturesPage from "../pages/OnboardingAppFeaturesPage";

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
