import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
          
          {/* Main app */}
          <Route path="/home" element={<Home />} />
          
          {/* Placeholder routes for bottom nav - will be implemented in Phase 2 */}
          <Route path="/scan" element={<PlaceholderPage title="AI Scan" />} />
          <Route path="/booking" element={<PlaceholderPage title="Book Pickup" />} />
          <Route path="/orders" element={<PlaceholderPage title="Orders" />} />
          <Route path="/profile" element={<PlaceholderPage title="Profile" />} />
          <Route path="/prices" element={<PlaceholderPage title="Price List" />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Temporary placeholder for routes to be implemented
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
      Coming in Phase 2
    </p>
  </div>
);

export default App;
