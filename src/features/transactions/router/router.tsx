import Base from "../pages";
import ExtractPage from "../pages/extract";
import { TRANSACTIONS_PATHS } from "./paths";

export const transactionsRoutes = [
  {
    index: true,
    element: <Base />,
  },
  {
    path: TRANSACTIONS_PATHS.extract,
    element: <ExtractPage />,
  },
];
