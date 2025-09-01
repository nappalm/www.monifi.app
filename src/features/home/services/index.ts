import { mainApiClient } from "@/lib/axios";

export const HOME_ENDPOINT = "/home";
export const getHomeData = async () => {
  const response = await mainApiClient.get(HOME_ENDPOINT);
  return response.data;
};
