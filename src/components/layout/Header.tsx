import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title?: string;
  showMenu?: boolean;
  showNotification?: boolean;
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
}

const Header = ({
  title = "ScrapX",
  showMenu = false,
  showNotification = true,
  onMenuClick,
  onNotificationClick,
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {showMenu && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="text-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold text-sm">
                SX
              </span>
            </div>
            <h1 className="font-heading font-semibold text-lg text-foreground">
              {title}
            </h1>
          </div>
        </div>

        {showNotification && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onNotificationClick}
            className="relative text-foreground"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
