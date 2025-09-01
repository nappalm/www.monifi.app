import { StripeProduct, supabaseClient } from "@/lib";
import { fromToPagination, lastPage } from "@/shared/utils/pagination";
import { PaymentMethod } from "@stripe/stripe-js";
import {
  type StripeCreatePaymentMethod,
  type StripeCreateSubscription,
  type StripeDownloadInvoice,
} from "./types";

export async function stripeCreateSubscription({
  priceId,
  paymentMethodId,
}: StripeCreateSubscription) {
  const { data, error } = await supabaseClient.functions.invoke(
    "stripe-subscriptions",
    {
      body: { priceId, paymentMethodId },
    },
  );

  if (error) {
    const res = await new Response(error.context.body).json();
    throw new Error(res.error);
  }
  return data;
}

export async function stripeSubscriptionCancellation() {
  const { data, error } = await supabaseClient.functions.invoke(
    "stripe-subscription-cancellation",
  );

  if (error) {
    const res = await new Response(error.context.body).json();
    throw new Error(res.error);
  }

  return data;
}

export async function stripeProducts() {
  const { data, error } = await supabaseClient.functions.invoke<
    StripeProduct[]
  >("stripe-products", {
    method: "GET",
  });

  if (error) {
    const res = await new Response(error.context.body).json();
    throw new Error(res.error);
  }

  return data;
}

export async function stripePaymentMethods() {
  const { data, error } = await supabaseClient.functions.invoke<
    PaymentMethod[]
  >("list-payment-methods", { method: "GET" });

  if (error) {
    const res = await new Response(error.context.body).json();
    throw new Error(res.error);
  }

  return data;
}

export async function stripeRemovePaymentMethod(paymentMethodId: string) {
  const { data, error } = await supabaseClient.functions.invoke(
    "remove-payment-method",
    {
      body: { paymentMethodId },
    },
  );

  if (error) {
    const res = await new Response(error.context.body).json();
    throw new Error(res.error);
  }

  return data;
}

export async function stripeCreatePaymentMethod({
  paymentMethodId,
}: StripeCreatePaymentMethod) {
  const { data, error } = await supabaseClient.functions.invoke(
    "add-payment-method",
    {
      body: { paymentMethodId },
    },
  );

  if (error) {
    const res = await new Response(error.context.body).json();
    throw new Error(res.details);
  }

  return data;
}

export async function paymentHistory(page: number) {
  const { from, to, itemsPerPage } = fromToPagination(page);

  const { data, error, count } = await supabaseClient
    .from("stripe_payments")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);

  return {
    data,
    count,
    lastPage: lastPage(count, itemsPerPage),
  };
}

export async function stripeDownloadInvoice({
  invoiceId,
}: StripeDownloadInvoice) {
  const { data, error } = await supabaseClient.functions.invoke(
    "stripe-download-invoice",
    {
      body: { invoiceId },
    },
  );

  if (error) {
    const res = await new Response(error.context.body).json();
    throw new Error(res.details);
  }

  return data;
}
