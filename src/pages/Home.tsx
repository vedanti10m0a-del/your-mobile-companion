import { Camera, CalendarPlus, Newspaper, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import BottomNavBar from "@/components/layout/BottomNavBar";
import PriceCard from "@/components/PriceCard";

// Mock price data - will be replaced with API data later
const mockPrices = [
  { name: "Iron/Steel", price: 28, trend: "up" as const, trendValue: "+₹2" },
  { name: "Copper", price: 450, trend: "up" as const, trendValue: "+₹15" },
  { name: "Aluminum", price: 95, trend: "stable" as const },
  { name: "Paper", price: 12, trend: "down" as const, trendValue: "-₹1" },
];

const ecoTips = [
  "♻️ Sort your scrap before pickup for better rates!",
  "🌱 Every kg of recycled paper saves 17 trees",
  "💡 Clean plastic fetches 20% higher prices",
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="ScrapX" showNotification />

      <main className="px-4 py-6 max-w-md mx-auto">
        {/* Greeting */}
        <section className="mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Hello, Eco Warrior! 🌿
          </h2>
          <p className="text-muted-foreground text-sm">
            Ready to turn your scrap into cash?
          </p>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-4 mb-8">
          <Button
            onClick={() => navigate("/scan")}
            className="h-24 flex-col gap-2 gradient-primary text-primary-foreground rounded-2xl shadow-soft hover:shadow-lg transition-shadow"
          >
            <Camera className="h-8 w-8" />
            <span className="font-heading font-semibold">Scan Scrap</span>
          </Button>
          <Button
            onClick={() => navigate("/booking")}
            variant="outline"
            className="h-24 flex-col gap-2 border-2 border-primary text-primary rounded-2xl hover:bg-primary/5"
          >
            <CalendarPlus className="h-8 w-8" />
            <span className="font-heading font-semibold">Book Pickup</span>
          </Button>
        </section>

        {/* Live Prices Preview */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-heading font-semibold text-foreground">
                Live Scrap Rates
              </h3>
            </div>
            <Button
              variant="link"
              onClick={() => navigate("/prices")}
              className="text-primary p-0 h-auto"
            >
              View All
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {mockPrices.map((price) => (
              <PriceCard
                key={price.name}
                name={price.name}
                price={price.price}
                trend={price.trend}
                trendValue={price.trendValue}
              />
            ))}
          </div>
        </section>

        {/* Eco Tips */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="h-5 w-5 text-accent" />
            <h3 className="font-heading font-semibold text-foreground">
              Eco Tips
            </h3>
          </div>
          <Card className="bg-muted/50 border-none">
            <CardContent className="p-4">
              {ecoTips.map((tip, index) => (
                <p
                  key={index}
                  className="text-sm text-foreground py-2 border-b border-border last:border-0"
                >
                  {tip}
                </p>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>

      <BottomNavBar />
    </div>
  );
};

export default Home;
