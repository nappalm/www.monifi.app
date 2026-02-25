import { mainApiClient } from "@/lib/axios";

export const GOALS_ENDPOINT = "/home";
export const getGoalsData = async () => {
  const response = await mainApiClient.get(GOALS_ENDPOINT);
  return response.data;
};
