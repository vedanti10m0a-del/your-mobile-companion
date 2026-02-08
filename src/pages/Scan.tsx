import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  SwitchCamera,
  X,
  Flashlight,
  ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Leaf,
  Recycle,
  IndianRupee,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCamera } from "@/hooks/useCamera";
import { useToast } from "@/hooks/use-toast";
import { MaterialDetectionResult } from "@/lib/scrapData";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import BottomNavBar from "@/components/layout/BottomNavBar";

const Scan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    videoRef,
    canvasRef,
    isStreaming,
    error: cameraError,
    startCamera,
    stopCamera,
    captureImage,
    switchCamera,
    facingMode,
  } = useCamera({ facingMode: "environment" });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MaterialDetectionResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const handleCapture = async () => {
    const imageBase64 = captureImage();
    if (!imageBase64) {
      toast({
        title: "Capture failed",
        description: "Could not capture image. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setCapturedImage(`data:image/jpeg;base64,${imageBase64}`);
    setIsAnalyzing(true);
    stopCamera();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/detect-material`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ imageBase64 }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze image");
      }

      const data: MaterialDetectionResult = await response.json();
      setResult(data);

      // Save scan result to database
      if (data.detected) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await (supabase as any).from("ai_scan_results").insert({
              user_id: user.id,
              material_name: data.material,
              category: data.category,
              confidence: data.confidence,
              detected_price: data.pricePerKg,
              recycling_method: data.recyclingMethod,
              environmental_impact: data.environmentalImpact,
            });
          }
        } catch (saveErr) {
          console.error("Failed to save scan result:", saveErr);
          // Non-blocking — don't interrupt UX
        }
      }
    } catch (err) {
      console.error("Analysis error:", err);
      toast({
        title: "Analysis failed",
        description: err instanceof Error ? err.message : "Could not analyze the image",
        variant: "destructive",
      });
      // Reset to camera view
      setResult(null);
      setCapturedImage(null);
      startCamera();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setCapturedImage(null);
    startCamera();
  };

  const handleBookPickup = () => {
    navigate("/booking", {
      state: {
        material: result?.material,
        category: result?.category,
        pricePerKg: result?.pricePerKg,
      },
    });
  };

  // Camera View
  if (!result && !isAnalyzing) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header title="Scan Scrap" showNotification={false} />

        <div className="flex-1 relative">
          {/* Camera feed */}
          <div className="absolute inset-0 bg-black">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Camera overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Scanning frame */}
            <div className="absolute inset-12 border-2 border-white/50 rounded-3xl">
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
            </div>

            {/* Instruction text */}
            <div className="absolute top-8 left-0 right-0 text-center">
              <p className="text-white/90 font-medium text-sm bg-black/30 mx-auto px-4 py-2 rounded-full inline-block">
                Position scrap item within the frame
              </p>
            </div>
          </div>

          {/* Camera error */}
          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6">
              <Card className="max-w-sm">
                <CardContent className="p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <h3 className="font-heading font-semibold mb-2">Camera Error</h3>
                  <p className="text-sm text-muted-foreground mb-4">{cameraError}</p>
                  <Button onClick={startCamera}>Try Again</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Camera controls */}
          <div className="absolute bottom-24 left-0 right-0 flex items-center justify-center gap-8 pointer-events-auto">
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full bg-white/20 border-white/30 text-white backdrop-blur"
              onClick={() => navigate(-1)}
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              size="icon"
              className="w-20 h-20 rounded-full gradient-primary shadow-lg animate-pulse-green"
              onClick={handleCapture}
              disabled={!isStreaming}
            >
              <Camera className="h-10 w-10" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full bg-white/20 border-white/30 text-white backdrop-blur"
              onClick={switchCamera}
            >
              <SwitchCamera className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <BottomNavBar />
      </div>
    );
  }

  // Analyzing View
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header title="Analyzing..." showNotification={false} />

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {capturedImage && (
            <div className="w-48 h-48 rounded-2xl overflow-hidden mb-8 shadow-lg">
              <img
                src={capturedImage}
                alt="Captured scrap"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="mb-6"
          >
            <Loader2 className="h-12 w-12 text-primary" />
          </motion.div>

          <h2 className="font-heading font-semibold text-xl mb-2">
            Analyzing Scrap Material
          </h2>
          <p className="text-muted-foreground text-center">
            Our AI is identifying the material and fetching current rates...
          </p>
        </div>

        <BottomNavBar />
      </div>
    );
  }

  // Result View
  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Scan Result" showNotification={false} />

      <main className="px-4 py-6 max-w-md mx-auto">
        <AnimatePresence>
          {result?.detected ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Success header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-lg">
                    Material Detected!
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {result.confidence}% confidence
                  </p>
                </div>
              </div>

              {/* Material Card */}
              <Card className="overflow-hidden">
                <div className="gradient-primary p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-primary-foreground/80 text-sm">
                        {result.category?.toUpperCase()}
                      </p>
                      <h3 className="text-2xl font-heading font-bold text-primary-foreground">
                        {result.material}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-primary-foreground/80 text-sm">
                        Current Rate
                      </p>
                      <div className="flex items-center text-primary-foreground">
                        <IndianRupee className="h-5 w-5" />
                        <span className="text-2xl font-heading font-bold">
                          {result.pricePerKg}
                        </span>
                        <span className="text-sm ml-1">/kg</span>
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    {result.description}
                  </p>
                </CardContent>
              </Card>

              {/* Recycling Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Recycle className="h-5 w-5 text-primary" />
                    <h4 className="font-heading font-semibold">
                      Recycling Process
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {result.recyclingMethod}
                  </p>
                </CardContent>
              </Card>

              {/* Environmental Impact */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Leaf className="h-5 w-5 text-primary" />
                    <h4 className="font-heading font-semibold">
                      Environmental Impact
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {result.environmentalImpact}
                  </p>
                </CardContent>
              </Card>

              {/* Tips */}
              {result.tips && result.tips.length > 0 && (
                <Card className="bg-accent/10 border-accent/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-5 w-5 text-accent" />
                      <h4 className="font-heading font-semibold">
                        Tips for Better Rates
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {result.tips.map((tip, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-accent">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleRetry}
                >
                  Scan Again
                </Button>
                <Button
                  className="flex-1 gradient-primary"
                  onClick={handleBookPickup}
                >
                  Book Pickup
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="font-heading font-semibold text-xl mb-2">
                No Material Detected
              </h2>
              <p className="text-muted-foreground mb-8">
                {result?.message ||
                  "We couldn't identify any recyclable scrap in the image."}
              </p>
              <Button onClick={handleRetry} className="gradient-primary">
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNavBar />
    </div>
  );
};

export default Scan;
