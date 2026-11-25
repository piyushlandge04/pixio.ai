import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, FileImage, Calendar } from "lucide-react";
import { toast } from "sonner";

interface UserData {
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  flyer_count: number;
  last_flyer_date: string | null;
}

interface FlyerHistory {
  id: string;
  user_id: string;
  email: string;
  prompt: string;
  style: string;
  created_at: string;
}

const GUEST_EMAIL = "guest@pixio.ai";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [recentFlyers, setRecentFlyers] = useState<FlyerHistory[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalFlyers: 0 });

  const fetchDashboardData = useCallback(async () => {
    try {
      // Fetch all profiles
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("user_id, email, full_name, created_at");

      if (profileError) throw profileError;

      // Fetch all flyer history for counts
      const { data: allFlyers, error: flyerError } = await supabase
        .from("flyer_history")
        .select("user_id, created_at")
        .order("created_at", { ascending: false });

      if (flyerError) throw flyerError;

      // Build user data with flyer counts
      const transformedUsers: UserData[] = (profileData || []).map((user) => {
        const userFlyers = (allFlyers || []).filter(f => f.user_id === user.user_id);
        return {
          user_id: user.user_id,
          email: user.email || "N/A",
          full_name: user.full_name,
          created_at: user.created_at,
          flyer_count: userFlyers.length,
          last_flyer_date: userFlyers.length > 0 ? userFlyers[0].created_at : null,
        };
      });

      setUsers(transformedUsers);

      // Fetch recent flyers with user emails
      const { data: recentFlyerData, error: recentError } = await supabase
        .from("flyer_history")
        .select("id, user_id, prompt, style, created_at")
        .order("created_at", { ascending: false })
        .limit(10);

      if (recentError) throw recentError;

      // Map user emails to recent flyers
      const profileMap = new Map((profileData || []).map(p => [p.user_id, p.email || "Unknown"]));
      const transformedFlyers = (recentFlyerData || []).map((flyer) => ({
        id: flyer.id,
        user_id: flyer.user_id,
        email: profileMap.get(flyer.user_id) || "Unknown",
        prompt: flyer.prompt,
        style: flyer.style,
        created_at: flyer.created_at,
      }));

      setRecentFlyers(transformedFlyers);

      // Calculate stats
      const totalFlyers = transformedUsers.reduce((sum, user) => sum + user.flyer_count, 0);
      setStats({
        totalUsers: transformedUsers.length,
        totalFlyers,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    }
  }, []);

  const checkAdminAccess = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session || session.user.email === GUEST_EMAIL) {
        toast.error("Please login to access this page");
        navigate("/auth", { replace: true });
        return;
      }

      // Check if user has admin role
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error || !roles) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/generate");
        return;
      }

      setIsAdmin(true);
      await fetchDashboardData();
    } catch {
      toast.error("Error checking admin access");
      navigate("/generate");
    } finally {
      setIsLoading(false);
    }
  }, [fetchDashboardData, navigate]);

  useEffect(() => {
    checkAdminAccess();
  }, [checkAdminAccess]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-4 pb-12">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-1.5">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Monitor platform growth, user activity, and flyer generation</p>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card border border-border shadow-sm rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Total Users</CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Users className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="pt-1">
                <div className="text-3xl font-bold tracking-tight text-foreground">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border shadow-sm rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Total Flyers Generated</CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <FileImage className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="pt-1">
                <div className="text-3xl font-bold tracking-tight text-foreground">{stats.totalFlyers}</div>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border shadow-sm rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Avg Flyers per User</CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Calendar className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="pt-1">
                <div className="text-3xl font-bold tracking-tight text-foreground">
                  {stats.totalUsers > 0 ? (stats.totalFlyers / stats.totalUsers).toFixed(1) : 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card className="mb-8 bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border/60 py-5">
              <CardTitle className="text-lg font-bold">User Registry</CardTitle>
              <CardDescription className="text-xs">Profiles of registered users and their generation history</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-secondary/45">
                    <TableRow className="border-b border-border hover:bg-transparent">
                      <TableHead className="font-semibold text-xs py-3">Email</TableHead>
                      <TableHead className="font-semibold text-xs py-3">Full Name</TableHead>
                      <TableHead className="font-semibold text-xs py-3 text-center">Flyers Created</TableHead>
                      <TableHead className="font-semibold text-xs py-3">Last Activity</TableHead>
                      <TableHead className="font-semibold text-xs py-3">Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.user_id} className="border-b border-border/65 hover:bg-secondary/15">
                        <TableCell className="font-medium text-sm py-3.5">{user.email}</TableCell>
                        <TableCell className="text-sm text-foreground/80 py-3.5">{user.full_name || "N/A"}</TableCell>
                        <TableCell className="text-center py-3.5">
                          <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-semibold rounded-md">{user.flyer_count}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground py-3.5">
                          {user.last_flyer_date
                            ? new Date(user.last_flyer_date).toLocaleDateString(undefined, { dateStyle: 'medium' })
                            : "Never"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground py-3.5">
                          {new Date(user.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Flyers Table */}
          <Card className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border/60 py-5">
              <CardTitle className="text-lg font-bold">Recent Flyers</CardTitle>
              <CardDescription className="text-xs">Chronological listing of the latest flyers generated on the platform</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-secondary/45">
                    <TableRow className="border-b border-border hover:bg-transparent">
                      <TableHead className="font-semibold text-xs py-3">User Email</TableHead>
                      <TableHead className="font-semibold text-xs py-3">Prompt Description</TableHead>
                      <TableHead className="font-semibold text-xs py-3">Style</TableHead>
                      <TableHead className="font-semibold text-xs py-3">Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentFlyers.map((flyer) => (
                      <TableRow key={flyer.id} className="border-b border-border/65 hover:bg-secondary/15">
                        <TableCell className="font-medium text-sm py-3.5">{flyer.email}</TableCell>
                        <TableCell className="max-w-md truncate text-sm text-foreground/80 py-3.5">{flyer.prompt}</TableCell>
                        <TableCell className="py-3.5">
                          <Badge className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-md">{flyer.style}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground py-3.5">
                          {new Date(flyer.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
