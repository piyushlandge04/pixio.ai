import { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Download, Eye } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

// Optimized image component with lazy loading
const OptimizedImage = memo(({ src, alt, className }: { src: string; alt: string; className?: string }) => (
  <img
    src={src}
    alt={alt}
    className={className}
    loading="lazy"
    decoding="async"
  />
));

interface FlyerHistoryItem {
  id: string;
  prompt: string;
  style: string;
  image_url: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 12;

const History = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [selectedFlyer, setSelectedFlyer] = useState<FlyerHistoryItem | null>(null);

  const { data: history, isLoading } = useQuery({
    queryKey: ['flyer-history', page],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please login to view your history");
        navigate("/auth");
        throw new Error("Not authenticated");
      }
      
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from("flyer_history")
        .select("*", { count: 'exact' })
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      return { data: data || [], count: count || 0 };
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const totalPages = Math.ceil((history?.count || 0) / ITEMS_PER_PAGE);

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `flyer-${prompt.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Flyer downloaded!");
    } catch (error) {
      toast.error("Failed to download flyer");
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
    <div className="min-h-screen relative bg-background">
      {/* Simplified background - static gradient for performance */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-muted/10 pointer-events-none" />
      
      <Navbar />
      <div className="relative pt-20 px-4 pb-8 sm:pb-12">
        <div className="container max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">Your Flyer History</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {history?.count || 0} flyer{history?.count !== 1 ? "s" : ""} generated
            </p>
          </div>

          {!history?.data?.length ? (
            <Card className="bg-card/80 backdrop-blur-sm border-2 border-neon-purple/30">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No flyers generated yet</p>
                <a href="/generate" className="text-neon-cyan hover:text-neon-purple transition-colors">
                  Create your first flyer
                </a>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {history.data.map((item) => (
                  <Card key={item.id} className="overflow-hidden bg-card border border-border hover:border-primary/50 transition-colors duration-200 group">
                    <div 
                      className="aspect-[3/4] bg-muted relative cursor-pointer"
                      onClick={() => setSelectedFlyer(item)}
                    >
                      <OptimizedImage
                        src={item.image_url}
                        alt="Generated flyer"
                        className="w-full h-full object-cover"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFlyer(item);
                          }}
                        >
                          <Eye className="w-5 h-5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(item.image_url, item.prompt);
                          }}
                        >
                          <Download className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">{item.style}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm line-clamp-2">{item.prompt}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="border-neon-cyan/30 hover:border-neon-cyan"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="border-neon-cyan/30 hover:border-neon-cyan"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Flyer Preview Modal */}
      <Dialog open={!!selectedFlyer} onOpenChange={() => setSelectedFlyer(null)}>
        <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-auto p-0 bg-card/95 backdrop-blur-xl border-neon-purple/50">
          <DialogHeader className="p-4 sm:p-6 pb-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg sm:text-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                  Flyer Preview
                </DialogTitle>
                {selectedFlyer && (
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="secondary">{selectedFlyer.style}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(selectedFlyer.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </DialogHeader>
          
          {selectedFlyer && (
            <div className="p-4 sm:p-6 pt-4 space-y-4">
              <div className="relative rounded-lg overflow-hidden border border-border">
                <img
                  src={selectedFlyer.image_url}
                  alt="Generated flyer"
                  className="w-full h-auto max-h-[60vh] object-contain bg-muted"
                />
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Prompt</p>
                  <p className="text-sm">{selectedFlyer.prompt}</p>
                </div>
                
                <Button
                  onClick={() => handleDownload(selectedFlyer.image_url, selectedFlyer.prompt)}
                  className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-90"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Flyer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default History;
