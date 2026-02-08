import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import Prices from "./pages/Prices";
import Booking from "./pages/Booking";
import Orders from "./pages/Orders";
import Wallet from "./pages/Wallet";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Placeholder component for routes to be implemented in Phase 3
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
    <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-4">
      <span className="text-2xl font-heading font-bold text-primary-foreground">
        {title.charAt(0)}
      </span>
    </div>
    <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
      {title}
    </h1>
    <p className="text-muted-foreground text-center">
      Coming in Phase 3
    </p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Entry point - Splash screen */}
          <Route path="/" element={<Splash />} />
          
          {/* Onboarding flow */}
          <Route path="/onboarding" element={<Onboarding />} />
          
          {/* Main app screens */}
          <Route path="/home" element={<Home />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/prices" element={<Prices />} />
          
          {/* Phase 3 screens */}
          <Route path="/booking" element={<Booking />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/wallet" element={<Wallet />} />
          
          {/* Placeholder for Phase 4 */}
          <Route path="/profile" element={<PlaceholderPage title="Profile" />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
