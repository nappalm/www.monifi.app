import Base from "../pages";
import BudgetCategories from "../pages/categories";
import { BUDGETS_PATHS } from "./paths";

export const budgetsRoutes = [
  {
    index: true,
    element: <Base />,
  },
  {
    path: BUDGETS_PATHS.budgetCategories,
    element: <BudgetCategories />,
  },
];
