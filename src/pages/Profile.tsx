import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, Calendar, User, Mail, Shield, Sparkles, Check, Phone, Image, Clock, CheckCircle2, AlertCircle, LogOut } from "lucide-react";
import { format } from "date-fns";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email().optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<string>("free");
  const [joinedDate, setJoinedDate] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [flyerCount, setFlyerCount] = useState(0);
  const [lastActivity, setLastActivity] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      email: "",
    },
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUserPhone(session.user.phone || null);
    setUserEmail(session.user.email || null);

    await Promise.all([
      fetchProfile(session.user.id),
      fetchFlyerStats(session.user.id),
    ]);
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        form.reset({
          full_name: data.full_name || "",
          email: data.email || "",
        });
        setAvatarUrl(data.avatar_url || null);
        setAccountType(data.account_type || "free");
        setJoinedDate(data.created_at || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchFlyerStats = async (userId: string) => {
    try {
      const { data, error, count } = await supabase
        .from("flyer_history")
        .select("created_at", { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      setFlyerCount(count || 0);
      if (data && data.length > 0) {
        setLastActivity(data[0].created_at);
      }
    } catch (error) {
      console.error("Error fetching flyer stats:", error);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You must be logged in to upload an avatar");
        return;
      }

      const fileName = `${session.user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', session.user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast.success("Profile picture updated!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    setUpdating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You must be logged in to update your profile");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: values.full_name,
          email: values.email || null,
        })
        .eq("user_id", session.user.id);

      if (error) throw error;

      setShowSuccess(true);
      toast.success("Profile updated successfully!");
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
    toast.success("Logged out successfully");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAccountBadgeStyles = () => {
    switch (accountType) {
      case "pro":
        return "bg-primary text-primary-foreground border-0";
      case "premium":
        return "bg-amber-600 text-white border-0";
      default:
        return "bg-secondary text-secondary-foreground border-border";
    }
  };

  const formatPhoneNumber = (phone: string) => {
    return phone;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background">
          <main className="container mx-auto px-4 pt-28 pb-8 max-w-2xl">
            <Card className="bg-card border border-border shadow-sm">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <Skeleton className="h-24 w-24 rounded-full" />
                </div>
                <Skeleton className="h-7 w-40 mx-auto mb-2" />
                <Skeleton className="h-4 w-60 mx-auto" />
              </CardHeader>
              <CardContent className="space-y-6">
                <Skeleton className="h-16 w-full rounded-xl" />
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-11 w-full" />
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-12 max-w-2xl">
        {/* Profile Card */}
        <Card className="bg-card border border-border shadow-sm rounded-2xl animate-slide-in-up">
          <CardHeader className="text-center pb-2">
            {/* Avatar Section */}
            <div className="flex justify-center mb-4">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-2 border-border ring-2 ring-primary/10 ring-offset-2 ring-offset-background">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt="Profile picture" className="object-cover" />}
                  <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                    {form.watch("full_name") ? getInitials(form.watch("full_name")) : <User className="h-8 w-8" />}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Camera className="h-6 w-6 text-white" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
            </div>
            
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              {form.watch("full_name") || "Your Profile"}
            </CardTitle>
            <CardDescription className="text-xs">
              Manage your personal details and app settings
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-secondary/50 rounded-xl border border-border/80">
                <div className="flex flex-col items-center text-center gap-1.5">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Account</p>
                    <Badge className={`mt-1 capitalize text-[10px] py-0 px-2 rounded-md ${getAccountBadgeStyles()}`}>
                      {accountType === "pro" && <Sparkles className="h-2.5 w-2.5 mr-0.5" />}
                      {accountType}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-secondary/50 rounded-xl border border-border/80">
                <div className="flex flex-col items-center text-center gap-1.5">
                  <Image className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Flyers</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{flyerCount}</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-secondary/50 rounded-xl border border-border/80">
                <div className="flex flex-col items-center text-center gap-1.5">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Joined</p>
                    <p className="text-xs font-semibold text-foreground/90 mt-0.5">
                      {joinedDate ? format(new Date(joinedDate), "MMM yyyy") : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-secondary/50 rounded-xl border border-border/80">
                <div className="flex flex-col items-center text-center gap-1.5">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Last Active</p>
                    <p className="text-xs font-semibold text-foreground/90 mt-0.5">
                      {lastActivity ? format(new Date(lastActivity), "MMM dd") : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Status */}
            <div className="p-4 bg-secondary/30 rounded-xl border border-border/60 space-y-2.5">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-primary" />
                Account Security Status
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex items-center gap-2">
                  {userEmail ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-xs text-foreground/80">
                    Email: {userEmail ? "Verified" : "Not Set"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {userPhone ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-xs text-foreground/80">
                    Phone: {userPhone ? "Verified" : "Not Set"}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60"></span>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className="bg-card px-3 text-muted-foreground">Profile Information</span>
              </div>
            </div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your full name" 
                          {...field} 
                          className="h-11 bg-background border-border focus-visible:ring-primary rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number (read-only, if user has one) */}
                {userPhone && (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      Phone Number
                      <Badge variant="outline" className="ml-auto text-[10px] text-emerald-600 border-emerald-200">
                        <CheckCircle2 className="h-3 w-3 mr-0.5" /> Verified
                      </Badge>
                    </FormLabel>
                    <Input 
                      value={formatPhoneNumber(userPhone)}
                      disabled 
                      className="h-11 bg-muted/40 border-border/80 text-muted-foreground cursor-not-allowed rounded-xl" 
                    />
                  </FormItem>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Email Address
                        {userEmail ? (
                          <Badge variant="outline" className="ml-auto text-[10px] text-emerald-600 border-emerald-200">
                            <CheckCircle2 className="h-3 w-3 mr-0.5" /> Verified
                          </Badge>
                        ) : (
                          <span className="text-[10px] text-muted-foreground ml-auto">(Optional)</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email"
                          placeholder={userEmail ? "" : "Add your email for account recovery"}
                          disabled={!!userEmail}
                          className={`h-11 rounded-xl ${
                            userEmail 
                              ? "bg-muted/40 border-border/80 text-muted-foreground cursor-not-allowed"
                              : "bg-background border-border focus-visible:ring-primary"
                          }`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-11 text-sm font-bold bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl shadow-sm transition-all" 
                  disabled={updating}
                >
                  {updating ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin h-4 w-4" />
                      Updating Profile...
                    </span>
                  ) : showSuccess ? (
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Profile Updated
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </Form>

            {/* Logout Button */}
            <div className="pt-4 border-t border-border/60">
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="w-full h-11 text-sm font-semibold border-destructive/20 text-destructive hover:bg-destructive/5 hover:border-destructive/40 rounded-xl"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out of Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
