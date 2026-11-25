import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Loader2,
  Download,
  Sparkles,
  Wand2,
  RefreshCw,
  History as HistoryIcon,
  Printer,
  Layers,
  Maximize2,
  Copy,
  Check,
  ZoomIn,
  AlertCircle
} from "lucide-react";
import { supabase, ensureSession } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DownloadMenu } from "@/components/DownloadMenu";

interface DesignRevision {
  id: string;
  imageUrl: string;
  prompt: string;
  basePrompt: string;
  correction?: string;
  timestamp: string;
}

const DESIGN_STYLES = [
  {
    id: "modern",
    name: "Modern",
    desc: "Clean geometric borders, slate grey & sleek contrast",
    badge: "Most Popular",
    color: "from-slate-800 to-zinc-900"
  },
  {
    id: "vibrant",
    name: "Vibrant",
    desc: "High-voltage neon accents & electric gradients",
    badge: "Concerts & EDM",
    color: "from-violet-600 to-pink-600"
  },
  {
    id: "elegant",
    name: "Elegant",
    desc: "Refined gold, warm marble tones & luxury typography",
    badge: "Galas & Dining",
    color: "from-amber-700 to-yellow-600"
  },
  {
    id: "minimal",
    name: "Minimal",
    desc: "Generous whitespace, cream canvas & botanical lines",
    badge: "Art & Cafes",
    color: "from-stone-600 to-zinc-700"
  },
  {
    id: "creative",
    name: "Creative",
    desc: "Surreal graphic compositions & expressive textures",
    badge: "Festivals",
    color: "from-cyan-600 to-indigo-600"
  },
  {
    id: "bold",
    name: "Bold",
    desc: "Massive headline typography & high-impact black/white",
    badge: "Retail & Promos",
    color: "from-neutral-900 to-stone-900"
  },
];

const SIZE_PRESETS = [
  { id: "poster", label: "Poster 3:4", width: 1200, height: 1600 },
  { id: "square", label: "Square 1:1", width: 1080, height: 1080 },
  { id: "story", label: "Story 9:16", width: 1080, height: 1920 },
  { id: "banner", label: "Banner 16:9", width: 1920, height: 1080 },
  { id: "custom", label: "Custom", width: 1200, height: 1600 },
] as const;

export const FlyerGenerator = () => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [prompt, setPrompt] = useState(searchParams.get("prompt") || "");
  const [selectedStyle, setSelectedStyle] = useState("modern");
  const [selectedSizeId, setSelectedSizeId] = useState<string>("poster");
  const [customWidth, setCustomWidth] = useState<number>(1200);
  const [customHeight, setCustomHeight] = useState<number>(1600);

  const activePreset = SIZE_PRESETS.find((p) => p.id === selectedSizeId);
  const targetWidth =
    selectedSizeId === "custom"
      ? Math.max(256, Math.min(4096, customWidth || 1200))
      : (activePreset?.width ?? 1200);
  const targetHeight =
    selectedSizeId === "custom"
      ? Math.max(256, Math.min(4096, customHeight || 1600))
      : (activePreset?.height ?? 1600);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Active design and revision trail
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [basePrompt, setBasePrompt] = useState<string>("");
  const [activePrompt, setActivePrompt] = useState<string>("");
  const [revisions, setRevisions] = useState<DesignRevision[]>([]);
  const [selectedRevisionIndex, setSelectedRevisionIndex] = useState<number>(-1);

  // Modal inspection & copy states
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Generation phase & error indicator
  const [generationPhase, setGenerationPhase] = useState<string>("Initializing...");
  const [generationError, setGenerationError] = useState<string | null>(null);

  const isBusy = isGenerating || isRegenerating;

  const extractFunctionError = async (err: unknown): Promise<string> => {
    if (err && typeof err === "object" && "context" in err) {
      const ctx = (err as { context?: unknown }).context;
      if (ctx instanceof Response) {
        try {
          const json = await ctx.clone().json();
          if (json?.error && typeof json.error === "string") {
            return json.error;
          }
        } catch {
          // fallback to standard Error message
        }
      }
    }
    return err instanceof Error ? err.message : "Failed to generate design";
  };

  // Handle keyboard shortcut: Cmd+Enter or Ctrl+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !isBusy && prompt.trim()) {
      e.preventDefault();
      handleGenerate();
    }
  };

  // Simulated multi-stage progress for high visual feedback
  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;

    if (isBusy) {
      setGenerationPhase("Analyzing prompt semantics & composition...");
      timer1 = setTimeout(() => {
        setGenerationPhase("Synthesizing layout hierarchy & typography...");
      }, 3500);
      timer2 = setTimeout(() => {
        setGenerationPhase("Rendering 300 DPI high-resolution artwork...");
      }, 7500);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isBusy]);

  // AI Prompt Enhancement
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first to enhance it.");
      return;
    }

    setIsEnhancing(true);
    try {
      const session = await ensureSession();
      if (!session) {
        throw new Error("Unable to establish session with AI server");
      }

      const { data, error } = await supabase.functions.invoke("generate-flyer", {
        body: { prompt: prompt.trim(), action: "suggest" },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;

      if (data?.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        setPrompt(data.suggestions[0]);
        toast.success("Creative brief enhanced with AI prompt engineering!");
      } else {
        toast.info("Prompt is already concise and descriptive.");
      }
    } catch (err: unknown) {
      console.error("Error enhancing prompt:", err);
      const message = err instanceof Error ? err.message : "Failed to enhance prompt";
      toast.error(message);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Main Action: Generate Design
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter what you want to create.");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    try {
      const session = await ensureSession();
      if (!session) {
        throw new Error("Unable to establish session with AI server");
      }

      const { data, error } = await supabase.functions.invoke("generate-flyer", {
        body: {
          prompt: prompt.trim(),
          style: selectedStyle,
          dimensions: { width: targetWidth, height: targetHeight },
        },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;

      if (data?.imageUrl) {
        const cleanPrompt = prompt.trim();
        const newRevision: DesignRevision = {
          id: crypto.randomUUID(),
          imageUrl: data.imageUrl,
          prompt: cleanPrompt,
          basePrompt: cleanPrompt,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        // Display flyer immediately before background history persistence
        setCurrentImage(data.imageUrl);
        setBasePrompt(cleanPrompt);
        setActivePrompt(cleanPrompt);
        setRevisions([newRevision]);
        setSelectedRevisionIndex(0);
        toast.success("Design rendered in 300 DPI resolution!");

        // Save to Supabase history without blocking UI display
        supabase
          .from("flyer_history")
          .insert({
            user_id: session.user.id,
            prompt: cleanPrompt,
            style: selectedStyle,
            image_url: data.imageUrl,
          })
          .then(({ error: dbError }) => {
            if (dbError) {
              console.error("Error saving to history:", dbError);
            } else {
              queryClient.invalidateQueries({ queryKey: ["flyer-history"] });
            }
          });
      } else {
        throw new Error(data?.error || "No image was returned from the generator");
      }
    } catch (err: unknown) {
      console.error("Error generating design:", err);
      const message = await extractFunctionError(err);
      setGenerationError(message);
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generated Output Action: Regenerate
  const handleRegenerate = async () => {
    if (!activePrompt) return;

    setIsRegenerating(true);
    setGenerationError(null);
    try {
      const session = await ensureSession();
      if (!session) {
        throw new Error("Unable to establish session with AI server");
      }

      const { data, error } = await supabase.functions.invoke("generate-flyer", {
        body: {
          prompt: activePrompt,
          style: selectedStyle,
          dimensions: { width: targetWidth, height: targetHeight },
        },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;

      if (data?.imageUrl) {
        const currentBase = basePrompt || activePrompt;
        const newRevision: DesignRevision = {
          id: crypto.randomUUID(),
          imageUrl: data.imageUrl,
          prompt: activePrompt,
          basePrompt: currentBase,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        const nextRevisions = [...revisions, newRevision];
        setCurrentImage(data.imageUrl);
        setRevisions(nextRevisions);
        setSelectedRevisionIndex(nextRevisions.length - 1);
        toast.success("New variation generated!");

        supabase
          .from("flyer_history")
          .insert({
            user_id: session.user.id,
            prompt: activePrompt,
            style: selectedStyle,
            image_url: data.imageUrl,
          })
          .then(({ error: dbError }) => {
            if (dbError) {
              console.error("Error saving regenerated design to history:", dbError);
            } else {
              queryClient.invalidateQueries({ queryKey: ["flyer-history"] });
            }
          });
      }
    } catch (err: unknown) {
      console.error("Error regenerating:", err);
      const message = await extractFunctionError(err);
      setGenerationError(message);
      toast.error(message);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Output Action: Download Image
  const handleDownload = async () => {
    if (!currentImage) return;

    try {
      const response = await fetch(currentImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pixio-flyer-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Print-ready flyer downloaded (300 DPI)!");
    } catch (err) {
      console.error("Download failed:", err);
      window.open(currentImage, "_blank");
    }
  };

  // Copy Active Prompt
  const handleCopyPrompt = () => {
    const textToCopy = activePrompt || prompt;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopiedPrompt(true);
    toast.success("Prompt copied to clipboard!");
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Switch between revisions in current session
  const selectRevision = (index: number) => {
    if (revisions[index]) {
      setSelectedRevisionIndex(index);
      setCurrentImage(revisions[index].imageUrl);
      setBasePrompt(revisions[index].basePrompt);
      setActivePrompt(revisions[index].prompt);
    }
  };

  return (
    <div className="relative overflow-hidden w-full px-4 sm:px-6">
      {/* Subtle dot-grid map background matching Hero */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35] dark:opacity-[0.16]"
        style={{
          backgroundImage: `radial-gradient(currentColor 1.2px, transparent 1.2px)`,
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 25%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 25%, #000 60%, transparent 100%)',
        }}
      />

      {/* Ambient background soft glow */}
      <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto relative z-10 space-y-10">

        {/* Compact Hero-Matched Studio Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/70">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-border/80 bg-card/90 backdrop-blur-sm text-xs font-semibold text-foreground shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>PIXIO Studio v2.4 · Direct Prompt Loop</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
              Create Your Flyer
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Describe your concept in natural language. PIXIO renders complete, print-ready 300 DPI designs with instant revision loops.
            </p>
          </div>

          {/* Spec Pills */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card/85 border border-border/80 text-xs font-semibold text-foreground shadow-2xs">
              <Printer className="w-3.5 h-3.5 text-primary" />
              <span>300 DPI Print-Ready</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card/85 border border-border/80 text-xs font-semibold text-foreground shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span>3:4 Vertical</span>
            </div>
          </div>
        </div>

        {/* Pro Two-Pane Studio Workspace */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Left Pane: Sticky Prompt & Aesthetic Controls */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="p-6 sm:p-7 bg-card/95 backdrop-blur-md border border-border/80 rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.3)] space-y-6">

              {/* Prompt Console */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-sm font-extrabold text-foreground">
                    What do you want to create?
                  </label>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleEnhancePrompt}
                    disabled={isBusy || isEnhancing || !prompt.trim()}
                    className="h-7 px-2.5 text-[11px] font-semibold text-primary hover:bg-primary/10 border border-primary/20 rounded-lg gap-1 shrink-0"
                  >
                    {isEnhancing ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    Enhance Prompt
                  </Button>
                </div>

                <div className="relative">
                  <Textarea
                    placeholder="Describe your event, venue, colors, and typography (e.g. A sleek modern tech summit flyer with slate grey background, clean geometric borders, and executive typography)..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isBusy}
                    className="min-h-[145px] text-sm leading-relaxed resize-none border-border/80 focus-visible:ring-1 focus-visible:ring-foreground bg-background rounded-2xl p-4 shadow-inner pb-8"
                  />
                  <div className="absolute bottom-2.5 right-3 text-[10px] font-mono text-muted-foreground/75 bg-background/90 px-2 py-0.5 rounded-md border border-border/40">
                    {prompt.length}/950
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                  <span>
                    Press <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border/60 font-mono text-[10px]">⌘</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border/60 font-mono text-[10px]">Enter</kbd> to generate
                  </span>
                  {prompt && (
                    <button
                      type="button"
                      onClick={() => setPrompt("")}
                      className="hover:text-foreground font-medium transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Aesthetic Style Selector with Gradient Swatches */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Aesthetic Style
                  </label>
                  <span className="text-[11px] font-semibold text-foreground">
                    {DESIGN_STYLES.find((s) => s.id === selectedStyle)?.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {DESIGN_STYLES.map((style) => {
                    const isSelected = selectedStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setSelectedStyle(style.id)}
                        disabled={isBusy}
                        className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-1.5 ${isSelected
                          ? "border-foreground bg-foreground text-background shadow-md scale-[1.01]"
                          : "border-border/70 hover:border-foreground/30 bg-background hover:bg-secondary/50 text-foreground"
                          } disabled:opacity-50`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-bold leading-tight">
                            {style.name}
                          </span>
                          <span className={`w-3 h-3 rounded-full bg-gradient-to-br ${style.color} ring-1 ${isSelected ? "ring-background/60" : "ring-border"
                            }`} />
                        </div>
                        <p className={`text-[10px] leading-tight line-clamp-1 ${isSelected ? "text-background/75" : "text-muted-foreground"
                          }`}>
                          {style.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Output Size & Custom Dimensions */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Output Size
                  </label>
                  <span className="text-[11px] font-mono font-semibold text-foreground">
                    {targetWidth} × {targetHeight} px
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {SIZE_PRESETS.map((preset) => {
                    const isSelected = selectedSizeId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setSelectedSizeId(preset.id);
                          if (preset.id !== "custom") {
                            setCustomWidth(preset.width);
                            setCustomHeight(preset.height);
                          }
                        }}
                        disabled={isBusy}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${isSelected
                          ? "border-foreground bg-foreground text-background shadow-xs"
                          : "border-border/70 bg-background hover:border-foreground/30 hover:bg-secondary/50 text-foreground"
                          } disabled:opacity-50`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                {selectedSizeId === "custom" && (
                  <div className="grid grid-cols-2 gap-2.5 pt-1 animate-fade-in">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Width (px)
                      </label>
                      <Input
                        type="number"
                        min={256}
                        max={4096}
                        value={customWidth}
                        onChange={(e) => setCustomWidth(Number(e.target.value))}
                        disabled={isBusy}
                        className="h-9 rounded-xl bg-background border-border/80 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Height (px)
                      </label>
                      <Input
                        type="number"
                        min={256}
                        max={4096}
                        value={customHeight}
                        onChange={(e) => setCustomHeight(Number(e.target.value))}
                        disabled={isBusy}
                        className="h-9 rounded-xl bg-background border-border/80 text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Primary Action Button */}
              <Button
                onClick={handleGenerate}
                disabled={isBusy || !prompt.trim()}
                size="lg"
                className="w-full h-12 text-sm font-bold bg-foreground text-background hover:bg-foreground/90 rounded-2xl shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Rendering Studio Flyer...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    <span>Generate Design</span>
                  </>
                )}
              </Button>
            </div>

            {/* Revision History Snapshot Rail */}
            {revisions.length > 1 && (
              <div className="p-5 bg-card/90 backdrop-blur-sm border border-border/80 rounded-3xl shadow-xs space-y-3.5">
                <div className="flex items-center justify-between text-foreground">
                  <div className="flex items-center gap-2 font-extrabold text-xs uppercase tracking-wider">
                    <HistoryIcon className="w-4 h-4 text-primary" />
                    <span>Snapshots ({revisions.length})</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    Active: #{selectedRevisionIndex + 1}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {revisions.map((rev, index) => {
                    const isSelected = selectedRevisionIndex === index;
                    return (
                      <button
                        key={rev.id}
                        type="button"
                        onClick={() => selectRevision(index)}
                        className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-between gap-1 ${isSelected
                          ? "border-foreground bg-foreground text-background shadow-xs font-semibold"
                          : "border-border/70 hover:border-foreground/30 bg-background text-foreground"
                          }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-[11px]">
                            {index === 0 ? "Initial" : `Rev ${index}`}
                          </span>
                          <span className={`text-[9px] font-mono ${isSelected ? "text-background/80" : "text-muted-foreground"}`}>
                            {rev.timestamp}
                          </span>
                        </div>
                        <p className={`text-[10px] truncate italic ${isSelected ? "text-background/80" : "text-muted-foreground"}`}>
                          {rev.correction ? `"${rev.correction}"` : "Original prompt"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Pane: Studio Artboard Mat & Iterative AI Copilot */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-7 bg-card/95 backdrop-blur-md border border-border/80 rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.3)] space-y-5">

              {/* Artboard Toolbar */}
              <div className="flex items-center justify-between pb-3 border-b border-border/70">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-extrabold text-foreground">
                    Artboard Preview
                  </h3>
                  <span className="text-[11px] text-muted-foreground font-mono hidden sm:inline">
                    · {targetWidth}×{targetHeight} px
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {currentImage && !isBusy && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsPreviewModalOpen(true)}
                      className="h-8 px-2.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground gap-1"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      Expand
                    </Button>
                  )}

                  {selectedRevisionIndex >= 0 && revisions[selectedRevisionIndex] ? (
                    <Badge variant="outline" className="text-[11px] font-semibold rounded-full border-border">
                      {selectedRevisionIndex === 0
                        ? "Initial Design"
                        : `Revision ${selectedRevisionIndex}`}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[11px] font-semibold rounded-full">
                      Ready to Render
                    </Badge>
                  )}
                </div>
              </div>

              {/* Studio Mat Framing the Artboard */}
              <div className="bg-secondary/25 rounded-2xl p-4 sm:p-6 border border-border/60 flex items-center justify-center">
                <div
                  className={`w-full max-h-[540px] bg-background/80 rounded-2xl border border-dashed border-border/80 overflow-hidden flex items-center justify-center relative shadow-md group transition-all duration-300 ${
                    targetWidth > targetHeight
                      ? "max-w-full"
                      : targetWidth === targetHeight
                        ? "max-w-[460px]"
                        : "max-w-[400px]"
                  }`}
                  style={{ aspectRatio: `${targetWidth} / ${targetHeight}` }}
                >
                  {isBusy ? (
                    /* Multi-Phase Loading State */
                    <div className="text-center space-y-5 p-8 max-w-xs mx-auto animate-fade-in">
                      <div className="relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 rounded-full border-2 border-primary/25 animate-ping" />
                        <div className="relative w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center shadow-lg">
                          <Loader2 className="w-7 h-7 animate-spin text-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-extrabold text-foreground tracking-tight">
                          {isGenerating
                            ? "Generating Studio Flyer..."
                            : isRegenerating
                              ? "Synthesizing Variation..."
                              : "Applying Creative Revision..."}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed animate-pulse">
                          {generationPhase}
                        </p>
                      </div>
                    </div>
                  ) : currentImage ? (
                    /* Rendered Flyer */
                    <div className="w-full h-full relative cursor-pointer" onClick={() => setIsPreviewModalOpen(true)}>
                      <img
                        src={currentImage}
                        alt="Generated Design Preview"
                        onError={() => {
                          setGenerationError("Failed to render the generated image URL.");
                          setCurrentImage(null);
                        }}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                      />

                      {/* Hover Quick Actions */}
                      <div className="absolute inset-0 bg-background/55 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsPreviewModalOpen(true);
                          }}
                          className="rounded-xl h-10 px-4 text-xs font-bold shadow-md gap-1.5"
                        >
                          <ZoomIn className="w-4 h-4" />
                          Inspect High-Res
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload();
                          }}
                          className="rounded-xl h-10 px-4 text-xs font-bold shadow-md bg-foreground text-background hover:bg-foreground/90 gap-1.5"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : generationError ? (
                    /* Clear Error State Inside Artboard */
                    <div className="text-center space-y-4 p-8 max-w-xs">
                      <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-center justify-center mx-auto text-destructive">
                        <AlertCircle className="w-7 h-7" />
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm font-extrabold text-foreground">
                          Generation Failed
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {generationError}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleGenerate}
                        className="rounded-xl text-xs font-semibold gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    /* Empty Artboard Placeholder */
                    <div className="text-center space-y-5 p-8 max-w-xs">
                      <div
                        className="w-16 h-16 rounded-2xl bg-card border border-border/80 shadow-[0_12px_24px_rgba(0,0,0,0.08)] flex items-center justify-center mx-auto text-foreground"
                        style={{
                          transform: 'perspective(600px) rotateY(-10deg) rotateX(6deg)',
                        }}
                      >
                        <Wand2 className="w-7 h-7" />
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm font-extrabold text-foreground">
                          Your Artboard is Ready
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Describe your idea on the left, choose an aesthetic mood, and click &ldquo;Generate Design&rdquo;.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Output Actions Toolbar */}
              {currentImage && !isBusy && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-2 gap-3">
                    <DownloadMenu
                      imageUrl={currentImage}
                      targetWidth={targetWidth}
                      targetHeight={targetHeight}
                      label="Download"
                      size="lg"
                      className="w-full h-11 text-xs"
                    />
                    <Button
                      onClick={handleRegenerate}
                      variant="outline"
                      size="lg"
                      className="h-11 text-xs font-bold rounded-xl border-border hover:bg-secondary transition-all gap-1.5"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                    <button
                      type="button"
                      onClick={handleCopyPrompt}
                      className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors font-medium"
                    >
                      {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPrompt ? "Prompt Copied" : "Copy Active Prompt"}</span>
                    </button>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      300 DPI Print-Ready
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Fullscreen High-Res Preview Modal Dialog */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[92vh] overflow-y-auto p-0 bg-card border border-border rounded-3xl shadow-2xl">
          <DialogHeader className="p-6 pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-black tracking-tight text-foreground">
                High-Resolution Flyer Inspection (300 DPI)
              </DialogTitle>
              {selectedRevisionIndex >= 0 && (
                <Badge variant="secondary" className="text-xs font-mono">
                  {selectedRevisionIndex === 0 ? "Initial Draft" : `Revision ${selectedRevisionIndex}`}
                </Badge>
              )}
            </div>
          </DialogHeader>

          {currentImage && (
            <div className="p-6 pt-2 space-y-5">
              <div
                className="relative rounded-2xl overflow-hidden border border-border/80 bg-secondary/30 max-h-[60vh] mx-auto flex items-center justify-center"
                style={{ aspectRatio: `${targetWidth} / ${targetHeight}` }}
              >
                <img
                  src={currentImage}
                  alt="Full-res flyer preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Active Creative Brief
                </p>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium bg-background p-4 rounded-2xl border border-border/80">
                  {activePrompt || prompt}
                </p>

                <DownloadMenu
                  imageUrl={currentImage}
                  targetWidth={targetWidth}
                  targetHeight={targetHeight}
                  label="Download Artwork (PNG / JPG / PDF / WEBP / SVG)"
                  size="lg"
                  className="w-full h-12 text-xs"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
