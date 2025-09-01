import {
  stripeCreatePaymentMethod,
  stripeCreateSubscription,
  stripeDownloadInvoice,
  stripePaymentMethods,
  stripeProducts,
  stripeRemovePaymentMethod,
  stripeSubscriptionCancellation,
} from "@/shared/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useStripeCreateSubscription() {
  return useMutation({
    mutationFn: stripeCreateSubscription,
  });
}

export function useStripeSubscriptionCancellation() {
  return useMutation({
    mutationFn: stripeSubscriptionCancellation,
  });
}

export function useStripeProducts() {
  return useQuery({
    queryKey: ["stripe-products"],
    queryFn: stripeProducts,
  });
}

export function useStripePaymentMethods() {
  return useQuery({
    queryKey: ["stripe-payment-methods"],
    queryFn: stripePaymentMethods,
    staleTime: Infinity,
    retry: false,
  });
}

export function useStripeRemovePaymentMethod() {
  const queryClient = useQueryClient();
  const [pendingPaymentIdsDeletion, setPendingPaymentIdsDeletion] = useState<
    string[]
  >([]);

  const q = useMutation({
    onMutate: (paymentMethodId) => {
      setPendingPaymentIdsDeletion([
        ...pendingPaymentIdsDeletion,
        paymentMethodId,
      ]);
      return paymentMethodId;
    },

    mutationFn: stripeRemovePaymentMethod,
    onSuccess: (_, paymentMethodId) => {
      queryClient.setQueryData(
        ["stripe-payment-methods"],
        (old: { id: string }[] | undefined) =>
          old ? old.filter((pm) => pm.id !== paymentMethodId) : [],
      );
      setPendingPaymentIdsDeletion((state) =>
        state.filter((id) => id !== paymentMethodId),
      );
    },
  });

  return { ...q, pendingPaymentIdsDeletion };
}

export function useStripeCreatePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: stripeCreatePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stripe-payment-methods"] });
    },
  });
}

export function useStripeDownloadInvoice() {
  const [pendingInvoiceIds, setPendingInvoiceIds] = useState<string[]>([]);

  const q = useMutation({
    onMutate: async ({ invoiceId }: { invoiceId: string }) => {
      setPendingInvoiceIds((current) => [...current, invoiceId]);
    },
    mutationFn: stripeDownloadInvoice,
    onSettled: (data, error, { invoiceId }) => {
      setPendingInvoiceIds((current) =>
        current.filter((id) => id !== invoiceId),
      );
    },
  });

  return { ...q, pendingInvoiceIds };
}
