import { mainApiClient } from "@/lib/axios";

export const STATISTICS_ENDPOINT = "/home";
export const getStatisticsData = async () => {
  const response = await mainApiClient.get(STATISTICS_ENDPOINT);
  return response.data;
};
