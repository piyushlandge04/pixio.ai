import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Wand2 } from "lucide-react";
import { z } from "zod";

const GUEST_EMAIL = "guest@pixio.ai";

const passwordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const navigate = useNavigate();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    let active = true;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

    const hasRecoveryParams =
      window.location.hash.includes("type=recovery") ||
      window.location.hash.includes("access_token=") ||
      window.location.search.includes("code=") ||
      window.location.search.includes("type=recovery");

    const redirectInvalid = () => {
      if (!active) return;
      toast.error("Invalid or expired reset link");
      navigate("/auth", { replace: true });
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      const isRealUserSession = Boolean(session && session.user.email !== GUEST_EMAIL);

      if ((event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") && isRealUserSession) {
        if (fallbackTimer) clearTimeout(fallbackTimer);
        setIsValidSession(true);
        setIsCheckingSession(false);
      } else if (event === "SIGNED_OUT") {
        setIsValidSession(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      const isRealUserSession = Boolean(session && session.user.email !== GUEST_EMAIL);

      if (isRealUserSession) {
        setIsValidSession(true);
        setIsCheckingSession(false);
        return;
      }

      if (hasRecoveryParams) {
        // Give Supabase Auth client time to exchange URL hash/PKCE recovery token
        fallbackTimer = setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session: retrySession } }) => {
            if (!active) return;
            if (retrySession && retrySession.user.email !== GUEST_EMAIL) {
              setIsValidSession(true);
              setIsCheckingSession(false);
            } else {
              redirectInvalid();
            }
          });
        }, 2000);
      } else {
        redirectInvalid();
      }
    });

    return () => {
      active = false;
      if (fallbackTimer) clearTimeout(fallbackTimer);
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      passwordSchema.parse({ password, confirmPassword });
      setIsLoading(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.email === GUEST_EMAIL) {
        toast.error("Invalid or expired reset link");
        navigate("/auth", { replace: true });
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Password updated successfully!");
      navigate("/generate");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred while updating password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isValidSession) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px]" />
      </div>

      <Card className="w-full max-w-md bg-card border border-border shadow-lg rounded-2xl animate-slide-in-up relative z-10">
        <CardHeader className="text-center space-y-3 pb-6">
          <div className="flex justify-center mb-1">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <Wand2 className="w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Reset Password</CardTitle>
          <CardDescription className="text-sm">Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent className="pb-6 space-y-4">
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-border focus-visible:ring-primary rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-background/50 border-border focus-visible:ring-primary rounded-xl"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold h-11 rounded-xl shadow-sm transition-all mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Updating Password..." : "Reset Password"}
            </Button>
          </form>
          <div className="text-center">
            <Link to="/auth" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
