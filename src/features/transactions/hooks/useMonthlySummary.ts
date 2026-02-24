import { getMonthlySummaries } from "@/shared/services/supabase.monthlySummaries";
import { useQuery } from "@tanstack/react-query";

const CACHE_KEY = "monthly_summaries";

export const useMonthlySummaries = () => {
  return useQuery({
    queryKey: [CACHE_KEY],
    queryFn: getMonthlySummaries,
    staleTime: Infinity,
  });
};
