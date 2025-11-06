import { useEffect, useState } from "react";
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [recentFlyers, setRecentFlyers] = useState<FlyerHistory[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalFlyers: 0 });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please login to access this page");
        navigate("/auth");
        return;
      }

      // Check if user has admin role
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (error || !roles) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/generate");
        return;
      }

      setIsAdmin(true);
      await fetchDashboardData();
    } catch (error) {
      toast.error("Error checking admin access");
      navigate("/generate");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch user stats with flyer counts
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select(`
          user_id,
          email,
          full_name,
          created_at,
          flyer_history(count)
        `);

      if (userError) throw userError;

      // Transform user data
      const transformedUsers: UserData[] = await Promise.all(
        (userData || []).map(async (user: any) => {
          const { data: lastFlyer } = await supabase
            .from("flyer_history")
            .select("created_at")
            .eq("user_id", user.user_id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          return {
            user_id: user.user_id,
            email: user.email,
            full_name: user.full_name,
            created_at: user.created_at,
            flyer_count: user.flyer_history?.[0]?.count || 0,
            last_flyer_date: lastFlyer?.created_at || null,
          };
        })
      );

      setUsers(transformedUsers);

      // Fetch recent flyers
      const { data: flyerData, error: flyerError } = await supabase
        .from("flyer_history")
        .select(`
          id,
          user_id,
          prompt,
          style,
          created_at,
          profiles(email)
        `)
        .order("created_at", { ascending: false })
        .limit(10);

      if (flyerError) throw flyerError;

      const transformedFlyers = (flyerData || []).map((flyer: any) => ({
        id: flyer.id,
        user_id: flyer.user_id,
        email: flyer.profiles?.email || "Unknown",
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
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 px-4 pb-12">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor user activity and flyer generation analytics</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Flyers Generated</CardTitle>
                <FileImage className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalFlyers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Flyers per User</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalUsers > 0 ? (stats.totalFlyers / stats.totalUsers).toFixed(1) : 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Overview of all registered users and their activity</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Flyers Created</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>{user.full_name || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{user.flyer_count}</Badge>
                      </TableCell>
                      <TableCell>
                        {user.last_flyer_date
                          ? new Date(user.last_flyer_date).toLocaleDateString()
                          : "Never"}
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Flyers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Flyers</CardTitle>
              <CardDescription>Latest flyers generated across all users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Email</TableHead>
                    <TableHead>Prompt</TableHead>
                    <TableHead>Style</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentFlyers.map((flyer) => (
                    <TableRow key={flyer.id}>
                      <TableCell className="font-medium">{flyer.email}</TableCell>
                      <TableCell className="max-w-md truncate">{flyer.prompt}</TableCell>
                      <TableCell>
                        <Badge>{flyer.style}</Badge>
                      </TableCell>
                      <TableCell>{new Date(flyer.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
