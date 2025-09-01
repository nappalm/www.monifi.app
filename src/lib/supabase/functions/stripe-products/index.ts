import Stripe from "npm:stripe@14.15.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Retrieve active products with their prices
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    });

    // Format products for frontend
    const formattedProducts = products.data.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      images: product.images,
      price: {
        id: product.default_price?.id,
        unit_amount: product.default_price?.unit_amount,
        currency: product.default_price?.currency,
        recurring: product.default_price?.recurring,
      },
    }));

    return new Response(JSON.stringify(formattedProducts), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error fetching Stripe products:", error);
    return new Response(
      JSON.stringify({ error: "Failed to retrieve products", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
});