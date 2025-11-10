import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FlyerHistoryItem {
  id: string;
  prompt: string;
  style: string;
  image_url: string;
  created_at: string;
}

const History = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<FlyerHistoryItem[]>([]);

  useEffect(() => {
    checkAuthAndFetchHistory();
  }, []);

  const checkAuthAndFetchHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please login to view your history");
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("flyer_history")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setHistory(data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Failed to load history");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20"></div>
      
      {/* Animated Glowing Orbs */}
      <div className="fixed top-20 left-1/4 w-80 h-80 bg-neon-purple/10 rounded-full blur-[120px] animate-float"></div>
      <div className="fixed bottom-20 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }}></div>
      
      <Navbar />
      <div className="relative pt-20 px-4 pb-12">
        <div className="container max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">Your Flyer History</h1>
            <p className="text-muted-foreground">
              {history.length} flyer{history.length !== 1 ? "s" : ""} generated
            </p>
          </div>

          {history.length === 0 ? (
            <Card className="bg-card/80 backdrop-blur-sm border-2 border-neon-purple/30">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No flyers generated yet</p>
                <a href="/generate" className="text-neon-cyan hover:text-neon-purple transition-colors">
                  Create your first flyer
                </a>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map((item) => (
                <Card key={item.id} className="overflow-hidden bg-card/80 backdrop-blur-sm border-2 border-neon-cyan/30 hover:border-neon-cyan hover:shadow-[0_0_30px_-5px_hsl(var(--neon-cyan)/0.5)] transition-all duration-300 hover:-translate-y-2">
                  <div className="aspect-[3/4] bg-muted relative">
                    <img
                      src={item.image_url}
                      alt="Generated flyer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{item.style}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2">{item.prompt}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
