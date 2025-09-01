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

Deno.serve(async (req: Request) => {
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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { paymentMethodId } = await req.json();
    if (!paymentMethodId) {
      return new Response(
        JSON.stringify({ error: "paymentMethodId is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

    if (authError || !user) {
      return new Response(
        JSON.stringify({
          error: "Authentication failed",
          details: authError?.message,
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { data: stripeData } = await supabase
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    let customerId = stripeData?.stripe_customer_id;

    if (!customerId) {
      const userEmail = user.email;
      if (!userEmail) {
        return new Response(
          JSON.stringify({ error: "User email not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { supabase_user_id: user.id },
      });

      await supabase.from("stripe_customers").insert({
        user_id: user.id,
        stripe_customer_id: customer.id,
      });

      customerId = customer.id;
    }

    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    return new Response(
      JSON.stringify({
        message: "Payment method added successfully",
        paymentMethod: {
          id: paymentMethod.id,
          brand: paymentMethod.card?.brand,
          last4: paymentMethod.card?.last4,
          expMonth: paymentMethod.card?.exp_month,
          expYear: paymentMethod.card?.exp_year,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error adding payment method:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to add payment method",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});