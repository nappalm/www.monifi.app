import { mainApiClient } from "@/lib/axios";

export const ONBOARDING_ENDPOINT = "/home";
export const getOnboardingData = async () => {
  const response = await mainApiClient.get(ONBOARDING_ENDPOINT);
  return response.data;
};
