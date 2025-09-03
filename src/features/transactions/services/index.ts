import { mainApiClient } from "@/lib/axios";

export const TRANSACTIONS_ENDPOINT = "/home";
export const getTransactionsData = async () => {
  const response = await mainApiClient.get(TRANSACTIONS_ENDPOINT);
  return response.data;
};
