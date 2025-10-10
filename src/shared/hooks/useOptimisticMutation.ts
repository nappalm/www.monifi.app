import {
  useMutation,
  useQueryClient,
  MutationFunction,
} from "@tanstack/react-query";
import { useRef } from "react";

type OptimisticUpdateFn<TData, TVariables> = (
  previousData: TData[] | undefined,
  variables: TVariables,
) => TData[] | undefined;

export default function useOptimisticMutation<TData, TVariables>(
  queryKey: string[],
  mutationFn: MutationFunction<any, TVariables>,
  optimisticUpdate: OptimisticUpdateFn<TData, TVariables>,
) {
  const queryClient = useQueryClient();
  const invalidateTimerRef = useRef<NodeJS.Timeout | null>(null);

  return useMutation({
    mutationFn,
    onMutate: async (variables: TVariables) => {
      await queryClient.cancelQueries({ queryKey, exact: false });

      const queries = queryClient.getQueriesData<TData[]>({ queryKey });

      queries.forEach(([key, previousData]) => {
        const newData = optimisticUpdate(previousData, variables);
        queryClient.setQueryData(key, newData);
      });

      return { queries };
    },
    onError: (_err, _variables, context) => {
      if (context?.queries) {
        context.queries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      // Cancelar el timer anterior si existe
      if (invalidateTimerRef.current) {
        clearTimeout(invalidateTimerRef.current);
      }

      // Configurar un nuevo timer para agrupar invalidaciones
      invalidateTimerRef.current = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey, exact: false });
      }, 200); // 200ms de debounce
    },
  });
}
