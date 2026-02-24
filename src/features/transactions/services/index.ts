import { mainApiClient } from "@/lib/axios";
import {
  PostTransactionsExtractRequest,
  PostTransactionsExtractResponse,
} from "../utils/types";

export const TRANSACTIONS_EXTRACT_ENDPOINT = "/extract";
export const postTransactionsExtract = async (
  data: PostTransactionsExtractRequest,
): Promise<PostTransactionsExtractResponse> => {
  const formData = new FormData();
  formData.append("file", data.file);

  const response = await mainApiClient.post(
    TRANSACTIONS_EXTRACT_ENDPOINT,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return response.data;
};
