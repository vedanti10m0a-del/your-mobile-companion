import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PriceCardProps {
  name: string;
  price: number;
  unit?: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
}

const PriceCard = ({
  name,
  price,
  unit = "/kg",
  trend = "stable",
  trendValue,
  icon,
  className,
}: PriceCardProps) => {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-primary"
      : trend === "down"
      ? "text-destructive"
      : "text-muted-foreground";

  return (
    <Card className={cn("overflow-hidden hover:shadow-soft transition-shadow", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {icon && (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {icon}
                </div>
              )}
              <h3 className="font-heading font-medium text-sm text-foreground">
                {name}
              </h3>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-heading font-bold text-foreground">
                ₹{price.toFixed(0)}
              </span>
              <span className="text-xs text-muted-foreground">{unit}</span>
            </div>
          </div>
          
          <div className={cn("flex items-center gap-1", trendColor)}>
            <TrendIcon className="h-4 w-4" />
            {trendValue && (
              <span className="text-xs font-medium">{trendValue}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceCard;
