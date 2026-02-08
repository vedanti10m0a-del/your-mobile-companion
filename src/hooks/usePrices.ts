import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScrapPrice, MOCK_SCRAP_PRICES } from "@/lib/scrapData";

export function usePrices(category?: string) {
  const [prices, setPrices] = useState<ScrapPrice[]>(MOCK_SCRAP_PRICES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchPrices() {
      setLoading(true);
      setError(null);

      try {
        // Query scrap_materials directly via the Supabase client
        let query = (supabase as any)
          .from("scrap_materials")
          .select("*")
          .eq("is_active", true)
          .order("category")
          .order("name");

        if (category && category !== "all") {
          query = query.eq("category", category);
        }

        const { data: materials, error: matError } = await query;

        if (matError) throw matError;
        if (!materials || materials.length === 0) {
          // Fallback to mock data
          setPrices(MOCK_SCRAP_PRICES);
          return;
        }

        // Fetch latest market rates for trends
        const materialIds = materials.map((m: any) => m.id);
        const { data: rates } = await (supabase as any)
          .from("market_rates")
          .select("*")
          .in("material_id", materialIds)
          .order("recorded_at", { ascending: false });

        // Map to ScrapPrice format
        const categoryIcons: Record<string, string> = {
          metal: "🔩", plastic: "🧴", paper: "📄",
          "e-waste": "💻", glass: "🫙", textile: "👕", other: "♻️",
        };

        const mapped: ScrapPrice[] = materials.map((mat: any) => {
          const matRates = (rates || []).filter((r: any) => r.material_id === mat.id);
          const latest = matRates[0]?.price_per_kg || mat.price_per_kg;
          const previous = matRates[1]?.price_per_kg || mat.price_per_kg;
          const diff = latest - previous;

          return {
            id: mat.id,
            name: mat.name,
            category: mat.category,
            pricePerKg: latest,
            unit: mat.unit || "/kg",
            trend: (diff > 0 ? "up" : diff < 0 ? "down" : "stable") as "up" | "down" | "stable",
            trendValue: diff !== 0 ? `${diff > 0 ? "+" : ""}₹${Math.abs(diff).toFixed(0)}` : undefined,
            icon: categoryIcons[mat.category] || "♻️",
          };
        });

        if (!cancelled) setPrices(mapped);
      } catch (err) {
        console.error("Failed to fetch prices:", err);
        if (!cancelled) {
          setError("Failed to load live prices");
          setPrices(MOCK_SCRAP_PRICES); // fallback
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPrices();
    return () => { cancelled = true; };
  }, [category]);

  return { prices, loading, error };
}
