import { Home, Camera, CalendarPlus, Package, User } from "lucide-react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  highlight?: boolean;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Camera, label: "Scan", path: "/scan", highlight: true },
  { icon: CalendarPlus, label: "Book", path: "/booking" },
  { icon: Package, label: "Orders", path: "/orders" },
  { icon: User, label: "Profile", path: "/profile" },
];

const BottomNavBar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border pb-safe">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <RouterNavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-2 text-muted-foreground transition-colors",
                  isActive && "text-primary"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-full transition-all",
                      item.highlight
                        ? "w-12 h-12 -mt-4 gradient-primary text-primary-foreground shadow-soft"
                        : "w-6 h-6",
                      isActive && !item.highlight && "text-primary"
                    )}
                  >
                    <Icon
                      className={cn(
                        "transition-transform",
                        item.highlight ? "h-6 w-6" : "h-5 w-5",
                        isActive && "scale-110"
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      item.highlight && "mt-1",
                      isActive && "text-primary font-semibold"
                    )}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </RouterNavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
