import { useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Phone,
  Star,
  MapPin,
  CalendarDays,
  IndianRupee,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import BottomNavBar from "@/components/layout/BottomNavBar";

type OrderStatus = "pending" | "assigned" | "in_transit" | "completed";

interface Order {
  id: string;
  date: string;
  address: string;
  items: { name: string; icon: string; quantity: number }[];
  status: OrderStatus;
  vendor?: {
    name: string;
    phone: string;
    rating: number;
    avatar: string;
  };
  amount?: number;
  timeSlot: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: "SX-2026-001",
    date: "Feb 10, 2026",
    address: "42, Green Park Colony, Delhi",
    items: [
      { name: "Metals", icon: "🔩", quantity: 5 },
      { name: "Paper", icon: "📄", quantity: 3 },
    ],
    status: "assigned",
    vendor: {
      name: "Ramesh Kumar",
      phone: "+91 98765 43210",
      rating: 4.8,
      avatar: "RK",
    },
    amount: 410,
    timeSlot: "Morning (9 AM – 12 PM)",
  },
  {
    id: "SX-2026-002",
    date: "Feb 8, 2026",
    address: "15, Nehru Nagar, Mumbai",
    items: [
      { name: "E-Waste", icon: "💻", quantity: 2 },
    ],
    status: "completed",
    vendor: {
      name: "Sunil Verma",
      phone: "+91 91234 56789",
      rating: 4.5,
      avatar: "SV",
    },
    amount: 650,
    timeSlot: "Afternoon (12 PM – 3 PM)",
  },
  {
    id: "SX-2026-003",
    date: "Feb 12, 2026",
    address: "7, MG Road, Bangalore",
    items: [
      { name: "Plastics", icon: "🧴", quantity: 8 },
      { name: "Glass", icon: "🫙", quantity: 4 },
    ],
    status: "pending",
    timeSlot: "Evening (3 PM – 6 PM)",
  },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-accent/10 text-accent", icon: Clock },
  assigned: { label: "Vendor Assigned", color: "bg-primary/10 text-primary", icon: Truck },
  in_transit: { label: "In Transit", color: "bg-blue-500/10 text-blue-600", icon: Truck },
  completed: { label: "Completed", color: "bg-primary/10 text-primary", icon: CheckCircle2 },
};

const TIMELINE_STEPS: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "Pickup Requested" },
  { status: "assigned", label: "Vendor Assigned" },
  { status: "in_transit", label: "Vendor En Route" },
  { status: "completed", label: "Pickup Complete" },
];

const getStepIndex = (status: OrderStatus) =>
  TIMELINE_STEPS.findIndex((s) => s.status === status);

const OrderCard = ({ order }: { order: Order }) => {
  const [expanded, setExpanded] = useState(false);
  const statusConfig = STATUS_CONFIG[order.status];
  const StatusIcon = statusConfig.icon;
  const currentStep = getStepIndex(order.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-border overflow-hidden">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-heading font-semibold text-sm text-foreground">
                {order.id}
              </p>
              <p className="text-xs text-muted-foreground">{order.date}</p>
            </div>
            <Badge
              variant="secondary"
              className={cn("text-xs font-medium gap-1", statusConfig.color)}
            >
              <StatusIcon className="h-3 w-3" />
              {statusConfig.label}
            </Badge>
          </div>

          {/* Items */}
          <div className="flex flex-wrap gap-2 mb-3">
            {order.items.map((item) => (
              <span
                key={item.name}
                className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full text-foreground"
              >
                {item.icon} {item.name} ({item.quantity} kg)
              </span>
            ))}
          </div>

          {/* Address & Time */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <MapPin className="h-3 w-3" />
            {order.address}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <CalendarDays className="h-3 w-3" />
            {order.timeSlot}
          </div>

          {/* Amount */}
          {order.amount && (
            <div className="flex items-center gap-1 text-sm font-semibold text-primary mb-3">
              <IndianRupee className="h-4 w-4" />
              {order.amount}
            </div>
          )}

          {/* Expand toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide Details" : "View Details"}
            {expanded ? (
              <ChevronUp className="h-3 w-3 ml-1" />
            ) : (
              <ChevronDown className="h-3 w-3 ml-1" />
            )}
          </Button>

          {/* Expanded */}
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="mt-3 pt-3 border-t border-border"
            >
              {/* Timeline */}
              <p className="text-xs font-medium text-foreground mb-3">
                Tracking Timeline
              </p>
              <div className="space-y-4 mb-4">
                {TIMELINE_STEPS.map((s, i) => {
                  const isComplete = i <= currentStep;
                  const isCurrent = i === currentStep;
                  return (
                    <div key={s.status} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                            isComplete
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {isComplete ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            i + 1
                          )}
                        </div>
                        {i < TIMELINE_STEPS.length - 1 && (
                          <div
                            className={cn(
                              "w-0.5 h-6 mt-1",
                              i < currentStep ? "bg-primary" : "bg-muted"
                            )}
                          />
                        )}
                      </div>
                      <div>
                        <p
                          className={cn(
                            "text-sm",
                            isCurrent
                              ? "font-semibold text-primary"
                              : isComplete
                              ? "font-medium text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {s.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Vendor Card */}
              {order.vendor && (
                <Card className="bg-muted/50 border-none">
                  <CardContent className="p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Assigned Vendor
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                          <span className="text-primary-foreground font-heading font-bold text-xs">
                            {order.vendor.avatar}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">
                            {order.vendor.name}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3 text-accent fill-accent" />
                            {order.vendor.rating}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full border-primary text-primary"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Orders = () => {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const filteredOrders = MOCK_ORDERS.filter((o) => {
    if (filter === "active") return o.status !== "completed";
    if (filter === "completed") return o.status === "completed";
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="My Orders" />

      <main className="px-4 py-6 max-w-md mx-auto">
        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(["all", "active", "completed"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              className={cn(
                "rounded-full capitalize",
                filter === f && "gradient-primary text-primary-foreground"
              )}
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>

        {/* Orders */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <OrderCard order={order} />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-16">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">
                No orders found
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNavBar />
    </div>
  );
};

export default Orders;
