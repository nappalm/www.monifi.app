import { mainApiClient } from "@/lib/axios";
import {
  PostTransactionsExtractRequest,
  PostTransactionsExtractResponse,
} from "../utils/types";

export const TRANSACTIONS_EXTRACT_ENDPOINT = "/extract";
export const postTransactionsExtract = async (
  data: PostTransactionsExtractRequest,
): Promise<PostTransactionsExtractResponse> => {
  const response = await mainApiClient.post(
    TRANSACTIONS_EXTRACT_ENDPOINT,
    data,
  );

  return response.data;
};
