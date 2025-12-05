import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Wand2, Mail, Phone, Chrome } from "lucide-react";
import { z } from "zod";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = loginSchema.extend({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
});

const phoneSchema = z.string().regex(/^\+[1-9]\d{1,14}$/, "Please enter a valid phone number with country code (e.g., +1234567890)");

type AuthMethod = "email" | "phone";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ email: "", password: "", fullName: "" });
  const [resetEmail, setResetEmail] = useState("");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [authMethod, setAuthMethod] = useState<AuthMethod>("email");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/generate");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/generate");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      loginSchema.parse(loginData);
      setIsLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password");
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success("Logged in successfully!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred during login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      signupSchema.parse(signupData);
      setIsLoading(true);

      const { error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            full_name: signupData.fullName,
          },
          emailRedirectTo: `${window.location.origin}/generate`,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("This email is already registered");
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success("Account created successfully!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred during signup");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/generate`,
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error("An error occurred with Google sign-in");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      phoneSchema.parse(phoneNumber);
      setIsLoading(true);

      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setShowOtpInput(true);
      toast.success("OTP sent to your phone!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otpCode,
        type: "sms",
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Phone verified successfully!");
    } catch (error) {
      toast.error("An error occurred during verification");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const emailSchema = z.string().email("Invalid email address");
      emailSchema.parse(resetEmail);
      setIsLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Password reset link sent to your email!");
      setIsResetDialogOpen(false);
      setResetEmail("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 p-4">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20"></div>
      
      {/* Animated Glowing Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-neon-cyan/20 rounded-full blur-[120px] animate-float pointer-events-none"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px] animate-float pointer-events-none" style={{ animationDelay: "2s" }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-neon-pink/10 rounded-full blur-[100px] animate-float pointer-events-none" style={{ animationDelay: "4s" }}></div>
      
      <Card className="w-full max-w-md relative backdrop-blur-sm bg-card/80 border-2 border-border/50 animate-slide-in-up shadow-[0_0_50px_-12px_hsl(var(--neon-cyan)/0.3)]">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center mb-2">
            <div className="p-4 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-2xl border-2 border-neon-cyan/30 animate-glow-pulse">
              <Wand2 className="w-10 h-10 text-neon-cyan animate-neon-glow" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
            Welcome to PIYUSH.AI
          </CardTitle>
          <CardDescription className="text-base">
            Sign in to create amazing flyers with AI-powered magic ✨
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8 space-y-6">
          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button 
              type="button"
              variant="outline"
              className="w-full h-12 bg-background/50 border-border/50 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all duration-300 group"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <Chrome className="w-5 h-5 mr-3 text-red-500 group-hover:text-neon-cyan transition-colors" />
              <span className="font-medium">Continue with Google</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Auth Method Toggle */}
          <div className="flex gap-2 p-1 bg-muted/30 rounded-lg">
            <Button
              type="button"
              variant={authMethod === "email" ? "default" : "ghost"}
              size="sm"
              className={`flex-1 ${authMethod === "email" ? "bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 text-neon-cyan border border-neon-cyan/30" : ""}`}
              onClick={() => { setAuthMethod("email"); setShowOtpInput(false); }}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button
              type="button"
              variant={authMethod === "phone" ? "default" : "ghost"}
              size="sm"
              className={`flex-1 ${authMethod === "phone" ? "bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 text-neon-purple border border-neon-purple/30" : ""}`}
              onClick={() => { setAuthMethod("phone"); setShowOtpInput(false); }}
            >
              <Phone className="w-4 h-4 mr-2" />
              Phone
            </Button>
          </div>

          {authMethod === "email" ? (
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 backdrop-blur-sm border border-neon-cyan/20">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-cyan/20 data-[state=active]:to-neon-purple/20 data-[state=active]:text-neon-cyan data-[state=active]:shadow-[0_0_20px_-5px_hsl(var(--neon-cyan)/0.5)] data-[state=active]:border data-[state=active]:border-neon-cyan/30 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-purple/20 data-[state=active]:to-neon-pink/20 data-[state=active]:text-neon-purple data-[state=active]:shadow-[0_0_20px_-5px_hsl(var(--neon-purple)/0.5)] data-[state=active]:border data-[state=active]:border-neon-purple/30 transition-all duration-300"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-foreground/90">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="bg-background/50 border-neon-cyan/30 focus:border-neon-cyan focus:ring-neon-cyan/50 transition-all duration-300 focus:shadow-[0_0_15px_-3px_hsl(var(--neon-cyan)/0.5)]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-foreground/90">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="bg-background/50 border-neon-cyan/30 focus:border-neon-cyan focus:ring-neon-cyan/50 transition-all duration-300 focus:shadow-[0_0_15px_-3px_hsl(var(--neon-cyan)/0.5)]"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/90 hover:to-neon-purple/90 text-white font-semibold shadow-[0_0_20px_-5px_hsl(var(--neon-cyan)/0.6)] hover:shadow-[0_0_30px_-5px_hsl(var(--neon-cyan)/0.8)] transition-all duration-300 border border-neon-cyan/50" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                  <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="link" className="w-full text-neon-cyan hover:text-neon-purple transition-colors">
                        Forgot Password?
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card/95 backdrop-blur-md border-2 border-neon-purple/30">
                      <DialogHeader>
                        <DialogTitle className="text-2xl bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">Reset Password</DialogTitle>
                        <DialogDescription>
                          Enter your email address and we'll send you a link to reset your password.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handlePasswordReset} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="reset-email">Email</Label>
                          <Input
                            id="reset-email"
                            type="email"
                            placeholder="you@example.com"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="bg-background/50 border-neon-purple/30 focus:border-neon-purple focus:ring-neon-purple/50 transition-all duration-300"
                            required
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-neon-purple to-neon-pink hover:from-neon-purple/90 hover:to-neon-pink/90 shadow-[0_0_20px_-5px_hsl(var(--neon-purple)/0.6)] border border-neon-purple/50" 
                          disabled={isLoading}
                        >
                          {isLoading ? "Sending..." : "Send Reset Link"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="mt-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-foreground/90">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      className="bg-background/50 border-neon-purple/30 focus:border-neon-purple focus:ring-neon-purple/50 transition-all duration-300 focus:shadow-[0_0_15px_-3px_hsl(var(--neon-purple)/0.5)]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-foreground/90">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className="bg-background/50 border-neon-purple/30 focus:border-neon-purple focus:ring-neon-purple/50 transition-all duration-300 focus:shadow-[0_0_15px_-3px_hsl(var(--neon-purple)/0.5)]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-foreground/90">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className="bg-background/50 border-neon-purple/30 focus:border-neon-purple focus:ring-neon-purple/50 transition-all duration-300 focus:shadow-[0_0_15px_-3px_hsl(var(--neon-purple)/0.5)]"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-neon-purple to-neon-pink hover:from-neon-purple/90 hover:to-neon-pink/90 text-white font-semibold shadow-[0_0_20px_-5px_hsl(var(--neon-purple)/0.6)] hover:shadow-[0_0_30px_-5px_hsl(var(--neon-purple)/0.8)] transition-all duration-300 border border-neon-purple/50" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4">
              {!showOtpInput ? (
                <form onSubmit={handlePhoneLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone-number" className="text-foreground/90">Phone Number</Label>
                    <Input
                      id="phone-number"
                      type="tel"
                      placeholder="+1234567890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="bg-background/50 border-neon-purple/30 focus:border-neon-purple focus:ring-neon-purple/50 transition-all duration-300 focus:shadow-[0_0_15px_-3px_hsl(var(--neon-purple)/0.5)]"
                      required
                    />
                    <p className="text-xs text-muted-foreground">Enter with country code (e.g., +1 for US)</p>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-neon-purple to-neon-pink hover:from-neon-purple/90 hover:to-neon-pink/90 text-white font-semibold shadow-[0_0_20px_-5px_hsl(var(--neon-purple)/0.6)] hover:shadow-[0_0_30px_-5px_hsl(var(--neon-purple)/0.8)] transition-all duration-300 border border-neon-purple/50" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Enter the 6-digit code sent to
                    </p>
                    <p className="font-medium text-neon-purple">{phoneNumber}</p>
                  </div>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otpCode}
                      onChange={(value) => setOtpCode(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="border-neon-purple/30 focus:border-neon-purple" />
                        <InputOTPSlot index={1} className="border-neon-purple/30 focus:border-neon-purple" />
                        <InputOTPSlot index={2} className="border-neon-purple/30 focus:border-neon-purple" />
                        <InputOTPSlot index={3} className="border-neon-purple/30 focus:border-neon-purple" />
                        <InputOTPSlot index={4} className="border-neon-purple/30 focus:border-neon-purple" />
                        <InputOTPSlot index={5} className="border-neon-purple/30 focus:border-neon-purple" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <Button 
                    type="button"
                    onClick={handleVerifyOtp}
                    className="w-full bg-gradient-to-r from-neon-purple to-neon-pink hover:from-neon-purple/90 hover:to-neon-pink/90 text-white font-semibold shadow-[0_0_20px_-5px_hsl(var(--neon-purple)/0.6)] transition-all duration-300 border border-neon-purple/50" 
                    disabled={isLoading || otpCode.length !== 6}
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>
                  <Button 
                    type="button"
                    variant="ghost"
                    className="w-full text-muted-foreground hover:text-neon-purple"
                    onClick={() => { setShowOtpInput(false); setOtpCode(""); }}
                  >
                    Change phone number
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
