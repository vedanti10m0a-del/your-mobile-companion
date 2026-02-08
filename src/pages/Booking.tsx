import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  MapPin,
  CalendarDays,
  Clock,
  Package,
  ChevronRight,
  CheckCircle2,
  ArrowLeft,
  Plus,
  Minus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import BottomNavBar from "@/components/layout/BottomNavBar";
import { SCRAP_CATEGORIES } from "@/lib/scrapData";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const TIME_SLOTS = [
  { id: "morning", label: "Morning", time: "9 AM – 12 PM", icon: "🌅" },
  { id: "afternoon", label: "Afternoon", time: "12 PM – 3 PM", icon: "☀️" },
  { id: "evening", label: "Evening", time: "3 PM – 6 PM", icon: "🌇" },
];

interface ScrapItem {
  categoryId: string;
  label: string;
  icon: string;
  quantity: number;
}

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [timeSlot, setTimeSlot] = useState("");
  const [scrapItems, setScrapItems] = useState<ScrapItem[]>(() => {
    // Pre-select category if coming from AI scan
    const state = location.state as { category?: string; material?: string } | null;
    if (state?.category) {
      const cat = SCRAP_CATEGORIES.find(c => c.id === state.category);
      if (cat) return [{ categoryId: cat.id, label: cat.label, icon: cat.icon, quantity: 1 }];
    }
    return [];
  });
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bookableCategories = SCRAP_CATEGORIES.filter((c) => c.id !== "all");

  const toggleCategory = (cat: (typeof bookableCategories)[0]) => {
    setScrapItems((prev) => {
      const exists = prev.find((i) => i.categoryId === cat.id);
      if (exists) {
        return prev.filter((i) => i.categoryId !== cat.id);
      }
      return [...prev, { categoryId: cat.id, label: cat.label, icon: cat.icon, quantity: 1 }];
    });
  };

  const updateQuantity = (categoryId: string, delta: number) => {
    setScrapItems((prev) =>
      prev.map((item) =>
        item.categoryId === categoryId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const canProceed = () => {
    if (step === 1) return address.trim().length > 0;
    if (step === 2) return scrapItems.length > 0;
    if (step === 3) return date !== undefined && timeSlot !== "";
    return true;
  };

  const handleConfirm = async () => {
    if (!user || !date) return;
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-order", {
        body: {
          address: `${address}${landmark ? `, Near ${landmark}` : ""}`,
          scrap_category: scrapItems[0]?.categoryId || "other",
          estimated_weight: scrapItems.reduce((sum, i) => sum + i.quantity, 0),
          scheduled_date: format(date, "yyyy-MM-dd"),
          scheduled_time: TIME_SLOTS.find((t) => t.id === timeSlot)?.time || "",
          notes,
        },
      });

      if (error) throw error;

      toast({
        title: "Pickup Booked! 🎉",
        description: `Scheduled for ${format(date, "PPP")} (${TIME_SLOTS.find((t) => t.id === timeSlot)?.time}). We'll notify you when a vendor is assigned.`,
      });
      navigate("/orders");
    } catch (err) {
      console.error("Booking error:", err);
      toast({
        title: "Booking failed",
        description: err instanceof Error ? err.message : "Could not create order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = 4;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Book Pickup" />

      <main className="px-4 py-6 max-w-md mx-auto">
        {/* Progress */}
        <div className="flex items-center gap-1 mb-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all",
                i < step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Address */}
          {step === 1 && (
            <motion.div
              key="address"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-lg text-foreground">
                    Pickup Address
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Where should we collect?
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Full Address *
                  </label>
                  <Input
                    placeholder="e.g. 42, Green Park Colony, Delhi"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="h-12 rounded-xl"
                    maxLength={200}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Landmark (Optional)
                  </label>
                  <Input
                    placeholder="e.g. Near SBI Bank"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="h-12 rounded-xl"
                    maxLength={100}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Scrap Categories */}
          {step === 2 && (
            <motion.div
              key="scrap"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-lg text-foreground">
                    What Scrap?
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Select categories & approximate quantity (kg)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {bookableCategories.map((cat) => {
                  const selected = scrapItems.some((i) => i.categoryId === cat.id);
                  return (
                    <motion.button
                      key={cat.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => toggleCategory(cat)}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                        selected
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/40"
                      )}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="font-medium text-sm text-foreground">
                        {cat.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Quantity controls */}
              {scrapItems.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    Approx. Quantity (kg)
                  </p>
                  {scrapItems.map((item) => (
                    <Card key={item.categoryId} className="border-border">
                      <CardContent className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.icon}</span>
                          <span className="text-sm font-medium text-foreground">
                            {item.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.categoryId, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-semibold text-foreground">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.categoryId, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Schedule */}
          {step === 3 && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CalendarDays className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-lg text-foreground">
                    Schedule Pickup
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Choose date & time slot
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Date Picker */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Pickup Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 rounded-xl justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(d) => d < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Time Slot
                  </label>
                  <div className="space-y-3">
                    {TIME_SLOTS.map((slot) => (
                      <motion.button
                        key={slot.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setTimeSlot(slot.id)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                          timeSlot === slot.id
                            ? "border-primary bg-primary/5"
                            : "border-border bg-card hover:border-primary/40"
                        )}
                      >
                        <span className="text-2xl">{slot.icon}</span>
                        <div>
                          <p className="font-medium text-sm text-foreground">
                            {slot.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {slot.time}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-lg text-foreground">
                    Confirm Booking
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Review your pickup details
                  </p>
                </div>
              </div>

              <Card className="mb-6 border-border">
                <CardContent className="p-4 space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="text-sm font-medium text-foreground">
                        {address}
                      </p>
                      {landmark && (
                        <p className="text-xs text-muted-foreground">
                          Near {landmark}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  {/* Scrap items */}
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Scrap Items
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {scrapItems.map((item) => (
                          <span
                            key={item.categoryId}
                            className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium"
                          >
                            {item.icon} {item.label} ({item.quantity} kg)
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  {/* Schedule */}
                  <div className="flex items-start gap-3">
                    <CalendarDays className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Schedule</p>
                      <p className="text-sm font-medium text-foreground">
                        {date ? format(date, "PPP") : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {TIME_SLOTS.find((t) => t.id === timeSlot)?.time}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Additional Notes (Optional)
                </label>
                <Input
                  placeholder="e.g. Ring doorbell, heavy items"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-12 rounded-xl"
                  maxLength={200}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <Button
              variant="outline"
              className="h-12 rounded-xl flex-1"
              onClick={() => setStep((s) => s - 1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          {step < totalSteps ? (
            <Button
              className="h-12 rounded-xl flex-1 gradient-primary text-primary-foreground"
              disabled={!canProceed()}
              onClick={() => setStep((s) => s + 1)}
            >
              Continue
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              className="h-12 rounded-xl flex-1 gradient-primary text-primary-foreground"
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              )}
              {isSubmitting ? "Booking..." : "Confirm Pickup"}
            </Button>
          )}
        </div>
      </main>

      <BottomNavBar />
    </div>
  );
};

export default Booking;
