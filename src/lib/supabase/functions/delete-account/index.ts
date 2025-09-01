import { createClient } from "npm:@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: jwtError,
    } = await supabase.auth.getUser(token);

    if (jwtError || !user) {
      return new Response(
        JSON.stringify({ error: "Authentication failed", details: jwtError?.message }),
        {
          status: 403,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Delete user profile if it exists
    await supabase
      .from("profiles")
      .delete()
      .eq("id", user.id);

    // Delete user from auth.users
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(
      user.id,
    );

    if (authDeleteError) {
      console.error("Error deleting user from auth:", authDeleteError);
      return new Response(
        JSON.stringify({ error: "Failed to delete account", details: authDeleteError.message }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    return new Response(
      JSON.stringify({
        message: "Account deleted successfully",
        deletedUserId: user.id,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err) {
    console.error("Unexpected error during account deletion:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: err.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});