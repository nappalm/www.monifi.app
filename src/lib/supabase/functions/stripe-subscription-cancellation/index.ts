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

    // 2. Get the user's most recent subscription
    const { data: subscriptionData, error: dbError } = await supabase
      .from("subscriptions")
      .select("stripe_subscription_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (dbError || !subscriptionData) {
      return new Response(
        JSON.stringify({ error: "No active subscription found for this user", details: dbError?.message }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { stripe_subscription_id: subscriptionId } = subscriptionData;

    // 3. Cancel the subscription in Stripe
    const deletedSubscription =
      await stripe.subscriptions.cancel(subscriptionId);

    // 4. Update subscription status in Supabase
    await supabase
      .from("subscriptions")
      .update({
        status: deletedSubscription.status,
        canceled_at: deletedSubscription.canceled_at
          ? new Date(deletedSubscription.canceled_at * 1000).toISOString()
          : null,
      })
      .eq("stripe_subscription_id", subscriptionId);

    // 5. Respond to the frontend with the result
    return new Response(JSON.stringify({
      message: "Subscription cancelled successfully",
      status: deletedSubscription.status,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Subscription cancellation error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to cancel subscription", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});