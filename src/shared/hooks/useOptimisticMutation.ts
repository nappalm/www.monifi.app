import {
  useMutation,
  useQueryClient,
  MutationFunction,
} from "@tanstack/react-query";
// import { useRef } from "react";

type OptimisticUpdateFn<TData, TVariables> = (
  previousData: TData[] | undefined,
  variables: TVariables,
) => TData[] | undefined;

type SuccessUpdateFn<TData, TResponse> = (
  previousData: TData[] | undefined,
  response: TResponse,
) => TData[] | undefined;

export default function useOptimisticMutation<
  TData,
  TVariables,
  TResponse = TData,
>(
  queryKey: string[],
  mutationFn: MutationFunction<TResponse, TVariables>,
  optimisticUpdate: OptimisticUpdateFn<TData, TVariables>,
  successUpdate?: SuccessUpdateFn<TData, TResponse>,
) {
  const queryClient = useQueryClient();

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
    onSuccess: (response, _variables, _context) => {
      if (successUpdate) {
        const queries = queryClient.getQueriesData<TData[]>({ queryKey });

        queries.forEach(([key, previousData]) => {
          const newData = successUpdate(previousData, response);
          queryClient.setQueryData(key, newData);
        });
      }
    },
    onError: (_err, _variables, context) => {
      if (context?.queries) {
        context.queries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
  });
}
