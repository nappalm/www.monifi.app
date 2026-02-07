import { useMutation } from "@tanstack/react-query";
import { postTransactionsExtract } from "../services";

export default function useTransactionExtract() {
  return useMutation({
    mutationFn: postTransactionsExtract,
  });
}
