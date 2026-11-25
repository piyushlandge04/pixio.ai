import { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { supabase, ensureSession } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DownloadMenu } from "@/components/DownloadMenu";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Download, 
  Eye, 
  AlertCircle, 
  RefreshCw, 
  Sparkles, 
  Wand2,
  Calendar,
  Layers,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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

OptimizedImage.displayName = "OptimizedImage";

interface FlyerHistoryItem {
  id: string;
  prompt: string;
  style: string;
  image_url: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 12;

const History = () => {
  const [page, setPage] = useState(1);
  const [selectedFlyer, setSelectedFlyer] = useState<FlyerHistoryItem | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: ["flyer-history"] });
      setPage(1);
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  // Optimized query without double-render waterfall
  const { data: history, isLoading, isError, refetch } = useQuery({
    queryKey: ["flyer-history", page],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentSession = session || (await ensureSession());

      if (!currentSession?.user?.id) {
        return { data: [], count: 0 };
      }

      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from("flyer_history")
        .select("id, prompt, style, image_url, created_at", { count: "exact" })
        .eq("user_id", currentSession.user.id)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      return { data: (data as FlyerHistoryItem[]) || [], count: count || 0 };
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const totalPages = Math.ceil((history?.count || 0) / ITEMS_PER_PAGE);

  const handleDownload = async (imageUrl: string, promptText: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pixio-flyer-${promptText.slice(0, 20).replace(/[^a-zA-Z0-9]/g, "-")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Flyer downloaded in print-ready resolution!");
    } catch (error) {
      console.error("Download failed:", error);
      window.open(imageUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Subtle dot-grid map background matching Hero */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.35] dark:opacity-[0.16]"
        style={{
          backgroundImage: `radial-gradient(currentColor 1.2px, transparent 1.2px)`,
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 25%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 25%, #000 60%, transparent 100%)',
        }}
      />

      {/* Ambient background soft glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content Area */}
      <main className="relative pt-24 sm:pt-28 pb-20 px-4 sm:px-6 flex-1 z-10">
        <div className="container max-w-6xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-border/70">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-border/80 bg-card/90 backdrop-blur-sm text-xs font-semibold text-foreground shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Creative Archive</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
                Your Flyer History
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {isLoading ? (
                  "Loading generated assets..."
                ) : (
                  `${history?.count || 0} flyer${history?.count === 1 ? "" : "s"} rendered in studio quality`
                )}
              </p>
            </div>

            <Button asChild className="h-10 px-4 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold text-xs gap-1.5 shadow-sm shrink-0">
              <Link to="/generate">
                <Wand2 className="w-3.5 h-3.5" />
                New Flyer
              </Link>
            </Button>
          </div>

          {/* Body: Loading Skeleton / Error / Empty / Grid */}
          {isLoading ? (
            /* Instant Skeleton Grid: Eliminates perceived delay */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div 
                  key={idx} 
                  className="bg-card/80 backdrop-blur-sm border border-border/80 rounded-3xl overflow-hidden p-3 space-y-3 shadow-2xs"
                >
                  <Skeleton className="aspect-[3/4] w-full rounded-2xl bg-secondary/50" />
                  <div className="space-y-2 p-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16 rounded-md bg-secondary/60" />
                      <Skeleton className="h-3 w-20 rounded-md bg-secondary/60" />
                    </div>
                    <Skeleton className="h-4 w-full rounded-md bg-secondary/60" />
                    <Skeleton className="h-4 w-2/3 rounded-md bg-secondary/60" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="p-8 sm:p-12 bg-card/90 backdrop-blur-sm border border-destructive/30 rounded-3xl shadow-sm text-center space-y-4 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">Unable to load flyer history</h3>
                <p className="text-xs text-muted-foreground">Please check your connection and try again.</p>
              </div>
              <Button onClick={() => refetch()} variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs font-semibold">
                <RefreshCw className="w-3.5 h-3.5" />
                Try Again
              </Button>
            </div>
          ) : !history?.data?.length ? (
            /* Empty State */
            <div className="p-12 sm:p-16 bg-card/90 backdrop-blur-sm border border-border/80 rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.3)] text-center space-y-6 max-w-md mx-auto">
              <div 
                className="w-16 h-16 rounded-2xl bg-background border border-border/80 shadow-[0_12px_24px_rgba(0,0,0,0.08)] flex items-center justify-center mx-auto text-foreground"
                style={{
                  transform: 'perspective(600px) rotateY(-10deg) rotateX(6deg)',
                }}
              >
                <Layers className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">No flyers created yet</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Describe what you want to create and generate your first print-ready flyer in seconds.
                </p>
              </div>
              <Button asChild size="lg" className="h-11 px-6 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold text-xs shadow-md">
                <Link to="/generate">
                  Start Designing Now
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          ) : (
            /* Populated History Grid */
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.data.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-card/90 backdrop-blur-sm border border-border/80 hover:border-foreground/40 rounded-3xl overflow-hidden p-3 space-y-3 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                  >
                    {/* Visual Card Canvas */}
                    <div 
                      className="aspect-[3/4] bg-secondary/30 rounded-2xl relative overflow-hidden cursor-pointer border border-border/40 shadow-inner"
                      onClick={() => setSelectedFlyer(item)}
                    >
                      <OptimizedImage
                        src={item.image_url}
                        alt="Generated flyer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Smooth Hover Overlay */}
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2.5">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="rounded-xl h-9 px-3 text-xs font-semibold gap-1.5 shadow-md border border-border"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFlyer(item);
                          }}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-xl h-9 px-3 text-xs font-bold gap-1.5 shadow-md bg-foreground text-background hover:bg-foreground/90"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(item.image_url, item.prompt);
                          }}
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </Button>
                      </div>
                    </div>

                    {/* Metadata Content */}
                    <div className="p-2 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <Badge 
                          variant="secondary" 
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border border-border/60"
                        >
                          {item.style}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-muted-foreground/70" />
                          {new Date(item.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/90 font-medium line-clamp-2 leading-relaxed">
                        {item.prompt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 pt-8">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="hover:bg-secondary rounded-xl text-xs px-4 h-10 border-border font-medium"
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-muted-foreground font-mono px-2">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="hover:bg-secondary rounded-xl text-xs px-4 h-10 border-border font-medium"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}

        </div>
      </main>

      {/* Flyer Details Modal Dialog */}
      <Dialog open={!!selectedFlyer} onOpenChange={() => setSelectedFlyer(null)}>
        <DialogContent className="max-w-xl w-[95vw] max-h-[90vh] overflow-y-auto p-0 bg-card border border-border rounded-3xl shadow-2xl">
          <DialogHeader className="p-6 pb-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-1">
                <DialogTitle className="text-lg font-extrabold text-foreground">
                  Flyer Details
                </DialogTitle>
                {selectedFlyer && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase rounded-md">
                      {selectedFlyer.style}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      Generated on {new Date(selectedFlyer.created_at).toLocaleDateString(undefined, { dateStyle: "long" })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </DialogHeader>

          {selectedFlyer && (
            <div className="p-6 pt-2 space-y-5">
              <div className="relative rounded-2xl overflow-hidden border border-border/80 bg-secondary/30 aspect-[3/4] max-h-[50vh] flex items-center justify-center">
                <img
                  src={selectedFlyer.image_url}
                  alt="Generated flyer"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Creative Prompt
                </p>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium bg-background p-3.5 rounded-2xl border border-border/80">
                  {selectedFlyer.prompt}
                </p>

                <DownloadMenu
                  imageUrl={selectedFlyer.image_url}
                  filename={`pixio-flyer-${selectedFlyer.prompt.slice(0, 20).replace(/[^a-zA-Z0-9]/g, "-")}`}
                  label="Download (PNG / JPG / PDF / WEBP / SVG)"
                  size="lg"
                  className="w-full h-11 text-xs"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default History;
