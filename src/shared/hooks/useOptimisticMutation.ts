import {
  useMutation,
  useQueryClient,
  MutationFunction,
} from "@tanstack/react-query";

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

  return useMutation({
    mutationFn,
    onMutate: async (variables: TVariables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<TData[]>(queryKey);

      const newData = optimisticUpdate(previousData, variables);

      queryClient.setQueryData(queryKey, newData);
      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
