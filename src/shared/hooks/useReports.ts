import { TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReport,
  deleteReport,
  getReports,
  updateReport,
} from "../services/supabase.reports";

export const useReports = () => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
    staleTime: Infinity,
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (report: TablesInsert<"reports">) => createReport(report),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

export const useUpdateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      report,
    }: {
      id: string;
      report: TablesUpdate<"reports">;
    }) => updateReport(id, report),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReport(id),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};
