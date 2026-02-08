import { useState, useMemo } from "react";
import { Camera, CalendarPlus, Newspaper, TrendingUp, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import BottomNavBar from "@/components/layout/BottomNavBar";
import SideMenu from "@/components/layout/SideMenu";
import PriceCard from "@/components/PriceCard";
import { usePrices } from "@/hooks/usePrices";
import { useAuth } from "@/contexts/AuthContext";

const ecoTips = [
  "♻️ Sort your scrap before pickup for better rates!",
  "🌱 Every kg of recycled paper saves 17 trees",
  "💡 Clean plastic fetches 20% higher prices",
  "🔋 E-waste contains valuable metals - don't throw!",
];

const Home = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const { prices } = usePrices();
  
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Eco Warrior";
  
  // Get top 4 trending prices
  const trendingPrices = useMemo(() => 
    prices.filter(p => p.trend === "up").slice(0, 4),
    [prices]
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        title="ScrapX" 
        showMenu 
        showNotification 
        onMenuClick={() => setMenuOpen(true)}
        onNotificationClick={() => navigate("/notifications")}
      />
      <SideMenu open={menuOpen} onOpenChange={setMenuOpen} />

      <main className="px-4 py-6 max-w-md mx-auto">
        {/* Greeting */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Hello, {displayName}!
            </h2>
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            >
              🌿
            </motion.span>
          </div>
          <p className="text-muted-foreground text-sm">
            Ready to turn your scrap into cash?
          </p>
        </motion.section>

        {/* Quick Actions */}
        <motion.section 
          className="grid grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            onClick={() => navigate("/scan")}
            className="h-28 flex-col gap-3 gradient-primary text-primary-foreground rounded-2xl shadow-soft hover:shadow-lg transition-all hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Camera className="h-7 w-7" />
            </div>
            <span className="font-heading font-semibold">Scan Scrap</span>
          </Button>
          <Button
            onClick={() => navigate("/booking")}
            variant="outline"
            className="h-28 flex-col gap-3 border-2 border-primary text-primary rounded-2xl hover:bg-primary/5 transition-all hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <CalendarPlus className="h-7 w-7" />
            </div>
            <span className="font-heading font-semibold">Book Pickup</span>
          </Button>
        </motion.section>

        {/* Environmental Impact Banner */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="gradient-primary overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <div className="text-white">
                  <p className="text-sm opacity-90">Your Impact This Month</p>
                  <p className="text-xl font-heading font-bold">12.5 kg CO₂ Saved</p>
                  <p className="text-xs opacity-80">Equivalent to planting 3 trees! 🌳</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Live Prices Preview */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-heading font-semibold text-foreground">
                Trending Prices
              </h3>
            </div>
            <Button
              variant="link"
              onClick={() => navigate("/prices")}
              className="text-primary p-0 h-auto font-medium"
            >
              View All →
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {trendingPrices.map((price, index) => (
              <motion.div
                key={price.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + index * 0.05 }}
              >
                <PriceCard
                  name={price.name}
                  price={price.pricePerKg}
                  trend={price.trend}
                  trendValue={price.trendValue}
                  icon={<span className="text-lg">{price.icon}</span>}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Eco Tips */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="h-5 w-5 text-accent" />
            <h3 className="font-heading font-semibold text-foreground">
              Eco Tips
            </h3>
          </div>
          <Card className="bg-muted/50 border-none">
            <CardContent className="p-4">
              {ecoTips.map((tip, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.05 }}
                  className="text-sm text-foreground py-2.5 border-b border-border last:border-0"
                >
                  {tip}
                </motion.p>
              ))}
            </CardContent>
          </Card>
        </motion.section>
      </main>

      <BottomNavBar />
    </div>
  );
};

export default Home;
