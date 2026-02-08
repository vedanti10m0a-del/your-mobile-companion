import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { order_id } = await req.json();

    if (!order_id) {
      return new Response(JSON.stringify({ error: "order_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Assigning vendor for order:", order_id);

    // Check user owns this order
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (orderErr || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (order.vendor_id) {
      return new Response(JSON.stringify({ error: "Vendor already assigned", vendor_id: order.vendor_id }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find available verified vendor (simple round-robin by least pickups)
    const { data: vendors, error: vendorErr } = await supabase
      .from("vendors")
      .select("*")
      .eq("is_available", true)
      .eq("is_verified", true)
      .order("total_pickups", { ascending: true })
      .limit(1);

    if (vendorErr || !vendors?.length) {
      console.log("No vendors available");
      return new Response(
        JSON.stringify({ error: "No vendors available in your area. Please try again later." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const vendor = vendors[0];
    console.log("Assigning vendor:", vendor.name, "to order:", order_id);

    // Update order with vendor and status
    const { data: updated, error: updateErr } = await supabase
      .from("orders")
      .update({ vendor_id: vendor.id, status: "assigned", updated_at: new Date().toISOString() })
      .eq("id", order_id)
      .select()
      .single();

    if (updateErr) {
      console.error("Order update error:", updateErr);
      return new Response(JSON.stringify({ error: updateErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Increment vendor pickup count
    await supabase
      .from("vendors")
      .update({ total_pickups: vendor.total_pickups + 1 })
      .eq("id", vendor.id);

    console.log("Vendor assigned successfully");

    return new Response(
      JSON.stringify({ order: updated, vendor: { id: vendor.id, name: vendor.name, phone: vendor.phone, rating: vendor.rating } }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("assign-vendor error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
