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
import { Camera, Calendar, User, Mail, Shield, Sparkles, Check } from "lucide-react";
import { format } from "date-fns";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email(),
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

    await fetchProfile(session.user.id);
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

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
        return "bg-gradient-to-r from-neon-cyan to-neon-purple text-white border-0";
      case "premium":
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
          <div className="fixed inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20"></div>
          <main className="relative container mx-auto px-4 py-8 max-w-2xl">
            <Card className="bg-card/80 backdrop-blur-sm border-2 border-border/50">
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20"></div>
      
      {/* Animated Glowing Orbs */}
      <div className="fixed top-20 right-20 w-80 h-80 bg-neon-cyan/10 rounded-full blur-[120px] animate-float pointer-events-none"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px] animate-float pointer-events-none" style={{ animationDelay: "2s" }}></div>
      
      <Navbar />
      <main className="relative container mx-auto px-4 py-8 max-w-2xl">
        {/* Profile Card */}
        <Card className="bg-card/80 backdrop-blur-sm border-2 border-neon-purple/30 shadow-[0_0_40px_-10px_hsl(var(--neon-purple)/0.4)] transition-all duration-500 hover:shadow-[0_0_60px_-10px_hsl(var(--neon-purple)/0.5)] animate-slide-in-up">
          <CardHeader className="text-center pb-2">
            {/* Avatar Section */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                {/* Glowing ring around avatar */}
                <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink rounded-full opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300"></div>
                <Avatar className="h-28 w-28 relative border-4 border-background">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt="Profile picture" className="object-cover" />}
                  <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 text-foreground">
                    {form.watch("full_name") ? getInitials(form.watch("full_name")) : <User className="h-10 w-10" />}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer scale-95 group-hover:scale-100"
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
            
            {/* Name with gradient */}
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent animate-glow-pulse">
              {form.watch("full_name") || "Your Profile"}
            </CardTitle>
            <CardDescription className="text-muted-foreground/80 mt-2">
              Manage your account settings and preferences
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-4">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 gap-4">
              <div className="group p-4 bg-gradient-to-br from-neon-cyan/5 to-neon-cyan/10 rounded-xl border border-neon-cyan/20 hover:border-neon-cyan/40 transition-all duration-300 hover:shadow-[0_0_20px_-5px_hsl(var(--neon-cyan)/0.3)]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neon-cyan/10 rounded-lg group-hover:bg-neon-cyan/20 transition-colors">
                    <Shield className="h-5 w-5 text-neon-cyan" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Account Type</p>
                    <Badge className={`mt-1 capitalize ${getAccountBadgeStyles()}`}>
                      {accountType === "pro" && <Sparkles className="h-3 w-3 mr-1" />}
                      {accountType}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="group p-4 bg-gradient-to-br from-neon-purple/5 to-neon-purple/10 rounded-xl border border-neon-purple/20 hover:border-neon-purple/40 transition-all duration-300 hover:shadow-[0_0_20px_-5px_hsl(var(--neon-purple)/0.3)]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neon-purple/10 rounded-lg group-hover:bg-neon-purple/20 transition-colors">
                    <Calendar className="h-5 w-5 text-neon-purple" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Member Since</p>
                    <p className="text-sm font-medium mt-1">
                      {joinedDate ? format(new Date(joinedDate), "MMM dd, yyyy") : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50"></span>
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
                    <FormItem className="group">
                      <FormLabel className="text-sm font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-neon-cyan" />
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          {...field} 
                          className="h-12 bg-background/50 border-border/50 focus:border-neon-cyan/50 focus:ring-neon-cyan/20 transition-all duration-300 placeholder:text-muted-foreground/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4 text-neon-purple" />
                        Email Address
                        <span className="text-xs text-muted-foreground ml-auto">(Cannot be changed)</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled 
                          className="h-12 bg-muted/50 border-border/30 text-muted-foreground cursor-not-allowed" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/90 hover:to-neon-purple/90 shadow-[0_0_30px_-5px_hsl(var(--neon-cyan)/0.5)] border border-neon-cyan/30 transition-all duration-300 hover:shadow-[0_0_40px_-5px_hsl(var(--neon-purple)/0.6)] hover:scale-[1.02] active:scale-[0.98]" 
                  disabled={updating}
                >
                  {updating ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Updating...
                    </span>
                  ) : showSuccess ? (
                    <span className="flex items-center gap-2">
                      <Check className="h-5 w-5" />
                      Updated!
                    </span>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
