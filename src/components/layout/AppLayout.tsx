import { useState } from "react";
import Header from "./Header";
import BottomNavBar from "./BottomNavBar";
import SideMenu from "./SideMenu";
import { useNavigate } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  showBottomNav?: boolean;
  showNotification?: boolean;
}

const AppLayout = ({
  children,
  title = "ScrapX",
  showHeader = true,
  showBottomNav = true,
  showNotification = true,
}: AppLayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {showHeader && (
        <Header
          title={title}
          showMenu
          showNotification={showNotification}
          onMenuClick={() => setMenuOpen(true)}
          onNotificationClick={() => navigate("/notifications")}
        />
      )}
      
      <SideMenu open={menuOpen} onOpenChange={setMenuOpen} />
      
      {children}
      
      {showBottomNav && <BottomNavBar />}
    </div>
  );
};

export default AppLayout;
