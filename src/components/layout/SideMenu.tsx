import { 
  Home, 
  Camera, 
  CalendarPlus, 
  Package, 
  Wallet,
  User,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Leaf,
  TrendingUp,
  X
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface SideMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: string | number;
}

const SideMenu = ({ open, onOpenChange }: SideMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const mainMenuItems: MenuItem[] = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Camera, label: "AI Scan", path: "/scan" },
    { icon: TrendingUp, label: "Price List", path: "/prices" },
    { icon: CalendarPlus, label: "Book Pickup", path: "/booking" },
    { icon: Package, label: "My Orders", path: "/orders", badge: 3 },
    { icon: Wallet, label: "Wallet", path: "/wallet" },
  ];

  const accountMenuItems: MenuItem[] = [
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Bell, label: "Notifications", path: "/notifications", badge: 2 },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: HelpCircle, label: "Help & Support", path: "/help" },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth", { replace: true });
    onOpenChange(false);
  };

  const renderMenuItem = (item: MenuItem, index: number) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;

    return (
      <motion.div
        key={item.path}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <button
          onClick={() => handleNavigate(item.path)}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
            isActive
              ? "bg-primary/10 text-primary"
              : "text-foreground hover:bg-muted"
          )}
        >
          <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
          <span className={cn("flex-1 text-left font-medium", isActive && "font-semibold")}>
            {item.label}
          </span>
          {item.badge && (
            <Badge className="bg-accent text-accent-foreground text-xs">
              {item.badge}
            </Badge>
          )}
        </button>
      </motion.div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] p-0">
        <SheetHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-primary">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                RS
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <SheetTitle className="text-left text-lg">Rahul Sharma</SheetTitle>
              <p className="text-sm text-muted-foreground text-left">
                Eco Warrior
              </p>
            </div>
          </div>
          {/* Eco Impact Badge */}
          <div className="mt-4 p-3 rounded-xl bg-primary/10 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">156 kg CO₂ saved</p>
              <p className="text-xs text-muted-foreground">Environmental impact</p>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          {/* Main Menu */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 mb-2">
              Main Menu
            </p>
            {mainMenuItems.map((item, index) => renderMenuItem(item, index))}
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-border" />

          {/* Account Menu */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 mb-2">
              Account
            </p>
            {accountMenuItems.map((item, index) =>
              renderMenuItem(item, mainMenuItems.length + index)
            )}
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            className="w-full border-destructive text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;
