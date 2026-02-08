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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization") || "" },
        },
      }
    );

    const url = new URL(req.url);
    const category = url.searchParams.get("category");

    console.log("Fetching prices, category filter:", category);

    // Get materials
    let materialsQuery = supabase.from("scrap_materials").select("*").eq("is_active", true);
    if (category && category !== "all") {
      materialsQuery = materialsQuery.eq("category", category);
    }
    const { data: materials, error: matError } = await materialsQuery.order("category").order("name");

    if (matError) {
      console.error("Materials fetch error:", matError);
      return new Response(JSON.stringify({ error: matError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get latest market rates for trend calculation
    const materialIds = (materials || []).map((m: any) => m.id);
    const { data: rates } = await supabase
      .from("market_rates")
      .select("*")
      .in("material_id", materialIds)
      .order("recorded_at", { ascending: false });

    // Calculate trends
    const enriched = (materials || []).map((mat: any) => {
      const matRates = (rates || []).filter((r: any) => r.material_id === mat.id);
      const latest = matRates[0]?.price_per_kg || mat.price_per_kg;
      const previous = matRates[1]?.price_per_kg || mat.price_per_kg;
      const diff = latest - previous;
      const trendPct = previous > 0 ? ((diff / previous) * 100).toFixed(1) : "0.0";

      return {
        ...mat,
        current_price: latest,
        trend: diff > 0 ? "up" : diff < 0 ? "down" : "stable",
        trend_value: `${diff > 0 ? "+" : ""}${trendPct}%`,
      };
    });

    console.log(`Returning ${enriched.length} materials`);

    return new Response(JSON.stringify({ materials: enriched }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("get-prices error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
