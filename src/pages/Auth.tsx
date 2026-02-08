import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, ArrowLeft, Recycle, Leaf, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type AuthMode = "select" | "email-login" | "email-signup" | "phone" | "phone-verify";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("select");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Email state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Phone state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/home", { replace: true });
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "We sent you a confirmation link." });
    }
  };

  const handlePhoneSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setLoading(false);
    if (error) {
      toast({ title: "OTP failed", description: error.message, variant: "destructive" });
    } else {
      setMode("phone-verify");
      toast({ title: "OTP sent", description: `Code sent to ${phone}` });
    }
  };

  const handlePhoneVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
    setLoading(false);
    if (error) {
      toast({ title: "Verification failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/home", { replace: true });
    }
  };

  const goBack = () => {
    if (mode === "phone-verify") setMode("phone");
    else setMode("select");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="gradient-primary px-4 pt-12 pb-16 text-center relative overflow-hidden">
        <motion.div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        {mode !== "select" && (
          <button onClick={goBack} className="absolute top-4 left-4 text-white/80 p-2">
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center mx-auto mb-3"
        >
          <Recycle className="h-9 w-9 text-primary" />
        </motion.div>
        <h1 className="text-2xl font-heading font-bold text-white">ScrapX</h1>
        <p className="text-white/80 text-sm mt-1">Smart Scrap. Clean Planet.</p>
      </div>

      {/* Content */}
      <div className="flex-1 -mt-6 bg-background rounded-t-3xl px-6 pt-8 pb-6">
        <AnimatePresence mode="wait">
          {mode === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-heading font-semibold text-foreground text-center mb-6">
                Welcome Back
              </h2>
              <Button
                onClick={() => setMode("email-login")}
                className="w-full h-14 rounded-xl text-base gap-3"
                variant="default"
              >
                <Mail className="h-5 w-5" />
                Continue with Email
              </Button>
              <Button
                onClick={() => setMode("phone")}
                className="w-full h-14 rounded-xl text-base gap-3"
                variant="outline"
              >
                <Phone className="h-5 w-5" />
                Continue with Phone
              </Button>
              <div className="flex items-center gap-2 pt-4">
                <Leaf className="h-4 w-4 text-primary" />
                <p className="text-xs text-muted-foreground">
                  Join 10,000+ eco-warriors recycling smarter
                </p>
              </div>
            </motion.div>
          )}

          {mode === "email-login" && (
            <motion.form
              key="email-login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleEmailLogin}
              className="space-y-5"
            >
              <h2 className="text-xl font-heading font-semibold text-foreground text-center mb-2">
                Sign In
              </h2>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("email-signup")}
                  className="text-primary font-medium"
                >
                  Sign Up
                </button>
              </p>
            </motion.form>
          )}

          {mode === "email-signup" && (
            <motion.form
              key="email-signup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleEmailSignup}
              className="space-y-5"
            >
              <h2 className="text-xl font-heading font-semibold text-foreground text-center mb-2">
                Create Account
              </h2>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("email-login")}
                  className="text-primary font-medium"
                >
                  Sign In
                </button>
              </p>
            </motion.form>
          )}

          {mode === "phone" && (
            <motion.form
              key="phone"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handlePhoneSendOtp}
              className="space-y-5"
            >
              <h2 className="text-xl font-heading font-semibold text-foreground text-center mb-2">
                Phone Login
              </h2>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Include country code (e.g. +91)</p>
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl" disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </motion.form>
          )}

          {mode === "phone-verify" && (
            <motion.form
              key="phone-verify"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handlePhoneVerify}
              className="space-y-5"
            >
              <h2 className="text-xl font-heading font-semibold text-foreground text-center mb-2">
                Verify OTP
              </h2>
              <p className="text-sm text-muted-foreground text-center">
                Enter the 6-digit code sent to {phone}
              </p>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl" disabled={loading || otp.length < 6}>
                {loading ? "Verifying..." : "Verify & Login"}
              </Button>
              <button
                type="button"
                onClick={() => handlePhoneSendOtp({ preventDefault: () => {} } as React.FormEvent)}
                className="w-full text-center text-sm text-primary font-medium"
              >
                Resend OTP
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Auth;
