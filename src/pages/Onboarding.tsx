import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Camera, Recycle, Truck, Leaf, ArrowRight, Check } from "lucide-react";

interface OnboardingSlide {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const slides: OnboardingSlide[] = [
  {
    icon: Camera,
    title: "AI-Powered Detection",
    description:
      "Simply scan your scrap items with your camera. Our AI instantly identifies materials and shows current market rates.",
    color: "bg-primary",
  },
  {
    icon: Recycle,
    title: "Know Your Rates",
    description:
      "Get real-time scrap prices for metals, plastics, paper, and e-waste. Never undersell your recyclables again.",
    color: "bg-accent",
  },
  {
    icon: Truck,
    title: "Doorstep Pickup",
    description:
      "Book verified vendors for free doorstep collection. Track your pickup in real-time and get paid instantly.",
    color: "bg-secondary",
  },
  {
    icon: Leaf,
    title: "Save the Planet",
    description:
      "Every scrap you recycle matters. Track your environmental impact and contribute to a cleaner, greener future.",
    color: "bg-primary",
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = () => {
    localStorage.setItem("scrapx_onboarded", "true");
    navigate("/auth", { replace: true });
  };

  const currentData = slides[currentSlide];
  const Icon = currentData.icon;
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Skip button */}
      {!isLastSlide && (
        <div className="absolute top-6 right-6 z-10">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground"
          >
            Skip
          </Button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            {/* Icon container */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className={`w-32 h-32 rounded-3xl ${currentData.color} flex items-center justify-center shadow-lg mb-8`}
            >
              <Icon className="w-16 h-16 text-white" />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-heading font-bold text-foreground mb-4"
            >
              {currentData.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground max-w-sm leading-relaxed"
            >
              {currentData.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background">
        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Action button */}
        <Button
          onClick={handleNext}
          className="w-full h-14 text-lg font-heading font-semibold gradient-primary text-primary-foreground rounded-2xl shadow-soft"
        >
          {isLastSlide ? (
            <>
              Get Started
              <Check className="ml-2 h-5 w-5" />
            </>
          ) : (
            <>
              Next
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
