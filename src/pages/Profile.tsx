import { useEffect, useState, useRef, memo } from "react";
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
import { Camera, Calendar, User, Shield, Sparkles, Image, Clock, CheckCircle2, AlertCircle, LogOut } from "lucide-react";
import { format } from "date-fns";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email().optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// Memoized stat card
const StatCard = memo(({ icon: Icon, label, value, colorClass }: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  colorClass: string;
}) => (
  <div className={`p-3 bg-muted/50 rounded-xl border ${colorClass}`}>
    <div className="flex flex-col items-center text-center gap-2">
      <div className="p-2 bg-background rounded-lg">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
        {value}
      </div>
    </div>
  </div>
));

StatCard.displayName = "StatCard";

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
        return "bg-primary text-primary-foreground";
      case "premium":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background">
          <main className="container mx-auto px-4 pt-24 pb-8 max-w-2xl">
            <Card className="bg-card border">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <Skeleton className="h-28 w-28 rounded-full" />
                </div>
                <Skeleton className="h-8 w-48 mx-auto mb-2" />
                <Skeleton className="h-4 w-64 mx-auto" />
              </CardHeader>
              <CardContent className="space-y-6">
                <Skeleton className="h-20 w-full rounded-xl" />
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-12 w-full" />
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
      <main className="container mx-auto px-4 pt-24 pb-8 max-w-2xl">
        {/* Profile Card */}
        <Card className="bg-card border">
          <CardHeader className="text-center pb-2">
            {/* Avatar Section */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt="Profile picture" className="object-cover" />}
                  <AvatarFallback className="text-3xl font-bold bg-muted text-foreground">
                    {form.watch("full_name") ? getInitials(form.watch("full_name")) : <User className="h-10 w-10" />}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Camera className="h-7 w-7 text-white" />
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
            
            <CardTitle className="text-3xl font-bold">
              {form.watch("full_name") || "Your Profile"}
            </CardTitle>
            <CardDescription className="mt-2">
              Manage your account settings and preferences
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                icon={Shield}
                label="Account"
                colorClass="border-border"
                value={
                  <Badge className={`mt-1 capitalize text-xs ${getAccountBadgeStyles()}`}>
                    {accountType === "pro" && <Sparkles className="h-3 w-3 mr-1" />}
                    {accountType}
                  </Badge>
                }
              />
              <StatCard
                icon={Image}
                label="Flyers"
                colorClass="border-border"
                value={<p className="text-lg font-bold text-foreground">{flyerCount}</p>}
              />
              <StatCard
                icon={Calendar}
                label="Joined"
                colorClass="border-border"
                value={
                  <p className="text-xs font-medium">
                    {joinedDate ? format(new Date(joinedDate), "MMM yyyy") : "N/A"}
                  </p>
                }
              />
              <StatCard
                icon={Clock}
                label="Last Active"
                colorClass="border-border"
                value={
                  <p className="text-xs font-medium">
                    {lastActivity ? format(new Date(lastActivity), "MMM dd") : "N/A"}
                  </p>
                }
              />
            </div>

            {/* Security Status */}
            <div className="p-4 bg-muted/30 rounded-xl border border-border">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Account Security
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  {userEmail ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={`text-sm ${userEmail ? "text-foreground" : "text-muted-foreground"}`}>
                    Email {userEmail ? "Verified" : "Not Set"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {userPhone ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={`text-sm ${userPhone ? "text-foreground" : "text-muted-foreground"}`}>
                    Phone {userPhone ? "Verified" : "Not Set"}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground">Profile Details</span>
              </div>
            </div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter your full name"
                          className="bg-background border-border focus:border-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="submit"
                    disabled={updating}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    {updating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    ) : showSuccess ? (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    ) : null}
                    {showSuccess ? "Saved!" : "Save Changes"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLogout}
                    className="flex-1 sm:flex-none"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
