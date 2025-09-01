import Stripe from "npm:stripe@14.15.0";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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

  try {
    // 1. Authenticate Supabase user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Authentication failed", details: authError?.message }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 2. Get data from frontend
    const { priceId, paymentMethodId } = await req.json();
    if (!priceId || !paymentMethodId) {
      return new Response(
        JSON.stringify({ error: "Missing priceId or paymentMethodId" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 3. Validate existing subscription
    const { data: existingSubscription } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .eq("stripe_price_id", priceId)
      .in("status", ["active", "trialing"])
      .single();

    if (existingSubscription) {
      return new Response(
        JSON.stringify({ error: "User already has an active subscription for this plan." }),
        {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 4. Find or create customer in Stripe
    const { data: stripeData } = await supabase
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();
    
    let customerId = stripeData?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      await supabase.from("stripe_customers").insert({
        user_id: user.id,
        stripe_customer_id: customer.id,
      });
      customerId = customer.id;
    }

    // 5. Attach PaymentMethod
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // 6. Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ["latest_invoice.payment_intent"],
    });

    // 7. Save to subscriptions table
    const price = await stripe.prices.retrieve(priceId, {
      expand: ["product"],
    });
    const productName = (price.product as Stripe.Product).name;

    await supabase.from("subscriptions").insert({
      user_id: user.id,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      product_name: productName,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      canceled_at: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null,
    });

    // 8. Respond to the frontend
    const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent;

    return new Response(JSON.stringify({
      subscriptionId: subscription.id,
      status: subscription.status,
      clientSecret: paymentIntent.client_secret,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Subscription creation error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create subscription",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});