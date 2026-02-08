import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Package, 
  Wallet, 
  AlertCircle, 
  Gift, 
  Leaf,
  Check,
  Trash2,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import BottomNavBar from "@/components/layout/BottomNavBar";

interface Notification {
  id: string;
  type: "order" | "payment" | "promo" | "alert" | "eco";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "order",
      title: "Pickup Completed!",
      message: "Your scrap pickup has been completed. ₹850 has been added to your wallet.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      type: "promo",
      title: "Weekend Bonus! 🎉",
      message: "Get 10% extra on all metal scraps this weekend. Book now!",
      time: "5 hours ago",
      read: false,
    },
    {
      id: "3",
      type: "eco",
      title: "Environmental Impact",
      message: "You've saved 15kg of CO₂ this month! Keep up the great work.",
      time: "1 day ago",
      read: true,
    },
    {
      id: "4",
      type: "order",
      title: "Vendor Assigned",
      message: "Rajesh Kumar has been assigned for your pickup tomorrow at 10:00 AM.",
      time: "2 days ago",
      read: true,
    },
    {
      id: "5",
      type: "payment",
      title: "Payment Received",
      message: "₹1,200 has been credited to your bank account.",
      time: "3 days ago",
      read: true,
    },
    {
      id: "6",
      type: "alert",
      title: "Price Update",
      message: "Copper prices have increased by 12%. Check the latest rates!",
      time: "4 days ago",
      read: true,
    },
  ]);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "order":
        return Package;
      case "payment":
        return Wallet;
      case "promo":
        return Gift;
      case "alert":
        return AlertCircle;
      case "eco":
        return Leaf;
      default:
        return Bell;
    }
  };

  const getIconColor = (type: Notification["type"]) => {
    switch (type) {
      case "order":
        return "bg-primary/10 text-primary";
      case "payment":
        return "bg-green-100 text-green-600";
      case "promo":
        return "bg-accent/10 text-accent";
      case "alert":
        return "bg-yellow-100 text-yellow-600";
      case "eco":
        return "bg-emerald-100 text-emerald-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Notifications" showMenu showNotification={false} />

      <main className="p-4 space-y-4">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-heading font-semibold text-foreground">
              All Notifications
            </h2>
            {unreadCount > 0 && (
              <Badge className="bg-accent text-accent-foreground">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-primary"
            >
              <Check className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <AnimatePresence mode="popLayout">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => {
              const Icon = getIcon(notification.type);
              const iconColor = getIconColor(notification.type);

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`border-0 shadow-soft cursor-pointer transition-all ${
                      !notification.read
                        ? "bg-primary/5 border-l-4 border-l-primary"
                        : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${iconColor}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3
                              className={`font-medium text-foreground ${
                                !notification.read ? "font-semibold" : ""
                              }`}
                            >
                              {notification.title}
                            </h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Bell className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No notifications
              </h3>
              <p className="text-muted-foreground">
                You're all caught up! Check back later for updates.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNavBar />
    </div>
  );
};

export default Notifications;
