import { paymentHistory } from "@/shared/services";
import { useQuery } from "@tanstack/react-query";

export default function usePaymentHistory(page = 1) {
  const q = useQuery({
    queryKey: ["payment-history", page],
    queryFn: () => paymentHistory(page),
  });

  const { data, count, lastPage } = q.data ?? {};

  return {
    ...q,
    data,
    count,
    lastPage,
  };
}
