import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import BottomNavBar from "@/components/layout/BottomNavBar";
import PriceCard from "@/components/PriceCard";
import { SCRAP_CATEGORIES, MOCK_SCRAP_PRICES } from "@/lib/scrapData";

const Prices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPrices = useMemo(() => {
    return MOCK_SCRAP_PRICES.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categoryStats = useMemo(() => {
    const stats: Record<string, { count: number; avgPrice: number }> = {};
    MOCK_SCRAP_PRICES.forEach((item) => {
      if (!stats[item.category]) {
        stats[item.category] = { count: 0, avgPrice: 0 };
      }
      stats[item.category].count++;
      stats[item.category].avgPrice += item.pricePerKg;
    });
    Object.keys(stats).forEach((cat) => {
      stats[cat].avgPrice = Math.round(stats[cat].avgPrice / stats[cat].count);
    });
    return stats;
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Scrap Prices" showNotification />

      <main className="px-4 py-6 max-w-md mx-auto">
        {/* Header section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-heading font-semibold text-lg">
              Live Market Rates
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Updated prices for all scrap categories
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {SCRAP_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              className={`shrink-0 ${
                selectedCategory === category.id
                  ? "gradient-primary text-primary-foreground"
                  : ""
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </Button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredPrices.length} items found
          </p>
          {selectedCategory !== "all" && categoryStats[selectedCategory] && (
            <p className="text-sm text-muted-foreground">
              Avg: ₹{categoryStats[selectedCategory].avgPrice}/kg
            </p>
          )}
        </div>

        {/* Price grid */}
        <motion.div
          className="grid grid-cols-2 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
        >
          {filteredPrices.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <PriceCard
                name={item.name}
                price={item.pricePerKg}
                unit={item.unit}
                trend={item.trend}
                trendValue={item.trendValue}
                icon={<span className="text-lg">{item.icon}</span>}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty state */}
        {filteredPrices.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-heading font-semibold mb-2">No results found</h3>
            <p className="text-sm text-muted-foreground">
              Try a different search term or category
            </p>
          </div>
        )}

        {/* Market info */}
        <div className="mt-8 p-4 bg-muted/50 rounded-xl">
          <h4 className="font-heading font-semibold text-sm mb-2">
            💡 Market Tip
          </h4>
          <p className="text-xs text-muted-foreground">
            Prices vary based on quality, quantity, and location. Clean and
            sorted scrap fetches 10-20% higher rates. Book a pickup to get the
            best prices!
          </p>
        </div>
      </main>

      <BottomNavBar />
    </div>
  );
};

export default Prices;
