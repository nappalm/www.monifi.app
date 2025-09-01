import Stripe from "npm:stripe@14.15.0";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Stripe-Signature",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const signature = req.headers.get("Stripe-Signature");
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!,
    );
  } catch (err) {
    console.error(`Stripe signature verification failed: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        if (!invoice.customer) {
          console.log(`No customer ID found for invoice: ${invoice.id}`);
          break;
        }

        const { data: customerData } = await supabase
          .from("stripe_customers")
          .select("user_id")
          .eq("stripe_customer_id", invoice.customer as string)
          .single();

        if (!customerData) {
          console.log(
            `No matching customer found for Stripe customer ID: ${invoice.customer}`,
          );
          break;
        }

        const { user_id } = customerData;
        let subscriptionName: string | null = null;

        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string,
          );
          const price = subscription.items.data[0].price;
          if (price.product) {
            const product = await stripe.products.retrieve(
              price.product as string,
            );
            subscriptionName = product.name;
          }

          await supabase.from("subscriptions").upsert(
            {
              user_id,
              stripe_customer_id: subscription.customer,
              stripe_subscription_id: subscription.id,
              stripe_price_id: subscription.items.data[0].price.id,
              status: subscription.status,
              current_period_start: new Date(
                subscription.current_period_start * 1000,
              ).toISOString(),
              current_period_end: new Date(
                subscription.current_period_end * 1000,
              ).toISOString(),
              canceled_at: subscription.canceled_at
                ? new Date(subscription.canceled_at * 1000).toISOString()
                : null,
            },
            { onConflict: "stripe_subscription_id" },
          );
        }

        let paymentMethod: Stripe.PaymentMethod | null = null;
        if (invoice.payment_intent) {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            invoice.payment_intent as string,
          );
          if (paymentIntent.payment_method) {
            paymentMethod = await stripe.paymentMethods.retrieve(
              paymentIntent.payment_method as string,
            );
          }
        }

        await supabase.from("stripe_payments").insert({
          user_id,
          stripe_invoice_id: invoice.id,
          amount_paid: (invoice.amount_paid ?? 0) / 100,
          currency: invoice.currency,
          payment_method_brand: paymentMethod?.card?.brand ?? null,
          payment_method_last4: paymentMethod?.card?.last4 ?? null,
          paid_at: invoice.status_transitions.paid_at
            ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
            : new Date().toISOString(),
        });

        if (subscriptionName) {
          await supabase
            .from("profiles")
            .update({ subscription: subscriptionName })
            .eq("id", user_id);
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (!invoice.subscription) {
          console.log(
            `No subscription ID found for failed invoice: ${invoice.id}`,
          );
          break;
        }

        await supabase
          .from("subscriptions")
          .update({ status: "past_due" })
          .eq("stripe_subscription_id", invoice.subscription as string);

        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const { data: customerData } = await supabase
          .from("stripe_customers")
          .select("user_id")
          .eq("stripe_customer_id", subscription.customer as string)
          .single();

        if (customerData) {
          const { user_id } = customerData;

          await supabase.from("subscriptions").upsert(
            {
              user_id,
              stripe_customer_id: subscription.customer,
              stripe_subscription_id: subscription.id,
              stripe_price_id: subscription.items.data[0].price.id,
              status: subscription.status,
              current_period_start: new Date(
                subscription.current_period_start * 1000,
              ).toISOString(),
              current_period_end: new Date(
                subscription.current_period_end * 1000,
              ).toISOString(),
              canceled_at: subscription.canceled_at
                ? new Date(subscription.canceled_at * 1000).toISOString()
                : null,
            },
            { onConflict: "stripe_subscription_id" },
          );

          if (
            subscription.status === "canceled" ||
            event.type === "customer.subscription.deleted"
          ) {
            await supabase
              .from("profiles")
              .update({ subscription: "FREE" })
              .eq("id", user_id);
          }
        }
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

