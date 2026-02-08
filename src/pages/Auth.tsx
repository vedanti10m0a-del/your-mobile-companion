import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { Recycle, Mail, Phone, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
const phoneSchema = z.string().regex(/^\+\d{10,15}$/, "Enter phone with country code (e.g. +91XXXXXXXXXX)");

type AuthMode = "login" | "signup";
type AuthMethod = "email" | "phone";

const Auth = () => {
  const navigate = useNavigate();
  const { user, signUp, signInWithEmail, signInWithOtp, verifyOtp } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<AuthMode>("login");
  const [method, setMethod] = useState<AuthMethod>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/home", { replace: true });
  }, [user, navigate]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      toast({ title: "Invalid Email", description: emailResult.error.errors[0].message, variant: "destructive" });
      return;
    }
    const passResult = passwordSchema.safeParse(password);
    if (!passResult.success) {
      toast({ title: "Invalid Password", description: passResult.error.errors[0].message, variant: "destructive" });
      return;
    }

    setLoading(true);
    if (mode === "signup") {
      const { error } = await signUp(email, password);
      if (error) {
        const msg = error.message.includes("already registered")
          ? "This email is already registered. Try logging in instead."
          : error.message;
        toast({ title: "Sign Up Failed", description: msg, variant: "destructive" });
      } else {
        toast({ title: "Account Created!", description: "Check your email to confirm your account, or log in if email confirmation is disabled." });
        setMode("login");
      }
    } else {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        const msg = error.message.includes("Invalid login")
          ? "Invalid email or password. Please try again."
          : error.message;
        toast({ title: "Login Failed", description: msg, variant: "destructive" });
      }
    }
    setLoading(false);
  };

  const handleSendOtp = async () => {
    const phoneResult = phoneSchema.safeParse(phone);
    if (!phoneResult.success) {
      toast({ title: "Invalid Phone", description: phoneResult.error.errors[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signInWithOtp(phone);
    if (error) {
      toast({ title: "OTP Failed", description: error.message, variant: "destructive" });
    } else {
      setOtpSent(true);
      toast({ title: "OTP Sent!", description: "Check your phone for the verification code." });
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast({ title: "Enter OTP", description: "Please enter the 6-digit code.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await verifyOtp(phone, otp);
    if (error) {
      toast({ title: "Verification Failed", description: error.message, variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top green section */}
      <div className="gradient-primary pt-12 pb-16 px-6 text-center relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4"
        >
          <Recycle className="w-10 h-10 text-white" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-heading font-bold text-white"
        >
          {mode === "login" ? "Welcome Back!" : "Create Account"}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/80 text-sm mt-1"
        >
          {mode === "login" ? "Log in to continue your eco journey" : "Join ScrapX and start recycling smarter"}
        </motion.p>
      </div>

      {/* Auth card */}
      <div className="flex-1 -mt-8 px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="max-w-md mx-auto shadow-soft border-0">
            <CardContent className="p-6">
              {/* Method toggle */}
              <div className="flex rounded-xl bg-muted p-1 mb-6">
                <button
                  onClick={() => { setMethod("email"); setOtpSent(false); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    method === "email" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  <Mail className="h-4 w-4" /> Email
                </button>
                <button
                  onClick={() => { setMethod("phone"); setOtpSent(false); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    method === "phone" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  <Phone className="h-4 w-4" /> Phone
                </button>
              </div>

              <AnimatePresence mode="wait">
                {method === "email" ? (
                  <motion.form
                    key="email"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleEmailSubmit}
                    className="space-y-4"
                  >
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
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 gradient-primary text-primary-foreground font-heading font-semibold rounded-xl"
                      disabled={loading}
                    >
                      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {mode === "login" ? "Log In" : "Sign Up"}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="phone"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {!otpSent ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+91XXXXXXXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">Include country code (e.g. +91 for India)</p>
                        </div>
                        <Button
                          onClick={handleSendOtp}
                          className="w-full h-12 gradient-primary text-primary-foreground font-heading font-semibold rounded-xl"
                          disabled={loading}
                        >
                          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          Send OTP
                        </Button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setOtpSent(false)}
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
                        >
                          <ArrowLeft className="h-4 w-4" /> Change number
                        </button>
                        <p className="text-sm text-muted-foreground text-center mb-4">
                          Enter the 6-digit code sent to <span className="font-medium text-foreground">{phone}</span>
                        </p>
                        <div className="flex justify-center mb-4">
                          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        <Button
                          onClick={handleVerifyOtp}
                          className="w-full h-12 gradient-primary text-primary-foreground font-heading font-semibold rounded-xl"
                          disabled={loading}
                        >
                          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          Verify & Login
                        </Button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Toggle login/signup for email */}
              {method === "email" && (
                <p className="text-center text-sm text-muted-foreground mt-6">
                  {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => setMode(mode === "login" ? "signup" : "login")}
                    className="text-primary font-medium hover:underline"
                  >
                    {mode === "login" ? "Sign Up" : "Log In"}
                  </button>
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
