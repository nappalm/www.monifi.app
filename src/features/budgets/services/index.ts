import { mainApiClient } from "@/lib/axios";

export const BUDGETS_ENDPOINT = "/home";
export const getBudgetsData = async () => {
  const response = await mainApiClient.get(BUDGETS_ENDPOINT);
  return response.data;
};
