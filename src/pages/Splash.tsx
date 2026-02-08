import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Recycle, Leaf } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Splash = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    const taglineTimer = setTimeout(() => setShowTagline(true), 800);

    const navigationTimer = setTimeout(() => {
      if (loading) return;
      const hasOnboarded = localStorage.getItem("scrapx_onboarded");
      if (!hasOnboarded) {
        navigate("/onboarding", { replace: true });
      } else if (session) {
        navigate("/home", { replace: true });
      } else {
        navigate("/auth", { replace: true });
      }
    }, 2500);

    return () => {
      clearTimeout(taglineTimer);
      clearTimeout(navigationTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen gradient-primary flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-white/10"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-white/5"
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Floating leaves */}
      <motion.div
        className="absolute top-20 right-10"
        animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Leaf className="w-8 h-8 text-white/30" />
      </motion.div>
      <motion.div
        className="absolute bottom-40 left-8"
        animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
      >
        <Leaf className="w-6 h-6 text-white/20" />
      </motion.div>

      {/* Main Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="relative"
      >
        <div className="w-28 h-28 rounded-3xl bg-white shadow-2xl flex items-center justify-center">
          <Recycle className="w-16 h-16 text-primary" />
        </div>
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <Leaf className="w-3 h-3 text-accent-foreground" />
        </motion.div>
      </motion.div>

      {/* Brand Name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8 text-4xl font-heading font-bold text-white tracking-tight"
      >
        ScrapX
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: showTagline ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="mt-3 text-white/80 text-center px-8 font-medium"
      >
        Smart Scrap. Clean Planet.
      </motion.p>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-20 flex gap-1"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-white/60"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Splash;
