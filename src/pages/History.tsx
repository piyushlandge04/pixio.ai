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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-4 pb-12">
        <div className="container max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-1.5">Your Flyer History</h1>
            <p className="text-sm text-muted-foreground">
              {history?.count || 0} flyer{history?.count !== 1 ? "s" : ""} generated
            </p>
          </div>

          {!history?.data?.length ? (
            <Card className="bg-card border border-border shadow-sm rounded-2xl">
              <CardContent className="py-16 text-center space-y-3">
                <p className="text-muted-foreground text-sm">No flyers generated yet</p>
                <Button asChild variant="outline" size="sm" className="rounded-lg">
                  <a href="/generate">Create your first flyer</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.data.map((item) => (
                  <Card key={item.id} className="overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 rounded-2xl group hover:-translate-y-0.5 hover:shadow-sm">
                    <div 
                      className="aspect-[3/4] bg-secondary relative cursor-pointer"
                      onClick={() => setSelectedFlyer(item)}
                    >
                      <OptimizedImage
                        src={item.image_url}
                        alt="Generated flyer"
                        className="w-full h-full object-cover"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full h-10 w-10 hover:bg-secondary/80 border border-border"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFlyer(item);
                          }}
                        >
                          <Eye className="w-4 h-4 text-foreground" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full h-10 w-10 hover:bg-secondary/80 border border-border"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(item.image_url, item.prompt);
                          }}
                        >
                          <Download className="w-4 h-4 text-foreground" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md">{item.style}</Badge>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-foreground/90 font-medium line-clamp-2 leading-relaxed">{item.prompt}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="hover:bg-secondary rounded-lg text-xs px-3 h-9"
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-muted-foreground font-medium">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="hover:bg-secondary rounded-lg text-xs px-3 h-9"
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
        <DialogContent className="max-w-xl w-[95vw] max-h-[90vh] overflow-y-auto p-0 bg-card border border-border rounded-2xl shadow-lg">
          <DialogHeader className="p-5 pb-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg font-bold text-foreground">
                  Flyer Details
                </DialogTitle>
                {selectedFlyer && (
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-[10px] font-semibold uppercase">{selectedFlyer.style}</Badge>
                    <span className="text-[11px] text-muted-foreground">
                      Generated on {new Date(selectedFlyer.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </DialogHeader>
          
          {selectedFlyer && (
            <div className="p-5 pt-4 space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-border">
                <img
                  src={selectedFlyer.image_url}
                  alt="Generated flyer"
                  className="w-full h-auto max-h-[50vh] object-contain bg-secondary/50"
                />
              </div>
              
              <div className="space-y-4 pt-1">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Prompt</p>
                  <p className="text-sm text-foreground/90 leading-relaxed font-medium bg-secondary/30 p-3 rounded-xl border border-border/40">{selectedFlyer.prompt}</p>
                </div>
                
                <Button
                  onClick={() => handleDownload(selectedFlyer.image_url, selectedFlyer.prompt)}
                  className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold h-11 rounded-xl shadow-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download High-Res Flyer
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
