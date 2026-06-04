import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Wand2, Sparkles, Download, Palette, ArrowRight, Layers, 
  FileText, Check, HelpCircle, Star, MessageSquare, Shield, 
  Clock, Zap, CheckCircle2, AlertCircle, Laptop, Settings, Lock
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

const Landing = () => {
  const navigate = useNavigate();
  const [heroPrompt, setHeroPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("ai");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const promptChips = [
    { label: "🎸 Concert", prompt: "A vintage jazz concert flyer in dark mahogany tones, with gold typography and detailed saxophone illustration" },
    { label: "🥗 Brunch", prompt: "A modern organic restaurant brunch flyer, featuring fresh leaf decorations, light cream background, and clean layout" },
    { label: "💪 Fitness", prompt: "An energetic fitness gym promotion flyer with high-contrast black and electric green colors, bold sans-serif fonts, and abstract action shapes" },
    { label: "🏢 Tech Summit", prompt: "A sleek minimalist tech business summit flyer with slate grey colors, clean grid lines, and professional text layouts" },
  ];

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroPrompt.trim()) {
      navigate(`/generate?prompt=${encodeURIComponent(heroPrompt.trim())}`);
    } else {
      navigate("/generate");
    }
  };

  const handleUsePrompt = (promptText: string) => {
    navigate(`/generate?prompt=${encodeURIComponent(promptText)}`);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Sample templates for interactive gallery
  const demoTemplates = [
    {
      title: "Cyberpunk DJ Night",
      style: "Vibrant",
      prompt: "A cyberpunk DJ concert flyer with glowing purple and cyan accents, retro grids, and a DJ silhouette",
      bgGradient: "from-purple-950 via-slate-900 to-indigo-950",
      textColor: "text-purple-300",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      mockContent: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 rounded-xl relative overflow-hidden border border-purple-500/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl" />
          <div className="flex justify-between items-center z-10">
            <span className="text-[9px] font-bold tracking-widest text-cyan-400 uppercase">DJ SESSION</span>
            <span className="text-[9px] font-bold text-muted-foreground">06.25</span>
          </div>
          <div className="my-auto text-center z-10 space-y-1">
            <h4 className="text-lg font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 uppercase">NEON BEATS</h4>
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Live Electronic performance</p>
          </div>
          <div className="flex justify-between items-end z-10 pt-2 border-t border-purple-500/10">
            <div className="text-[7px] text-left text-purple-300">
              <p className="font-semibold">THE GRID CLUB</p>
              <p className="text-[6px] text-muted-foreground">10:00 PM - LATE</p>
            </div>
            <span className="text-[7px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-bold">18+ ONLY</span>
          </div>
        </div>
      )
    },
    {
      title: "Organic Brew Coffee",
      style: "Minimal",
      prompt: "A minimalist coffee shop flyer with warm cream background, leaf illustrations, and elegant serif font",
      bgGradient: "from-amber-50 to-stone-100",
      textColor: "text-amber-800",
      badgeColor: "bg-amber-600/10 text-amber-700 border-amber-600/20",
      mockContent: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-stone-50 rounded-xl relative overflow-hidden border border-amber-800/10">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-amber-100 rounded-full blur-lg" />
          <div className="flex justify-between items-center z-10">
            <span className="text-[9px] font-bold tracking-widest text-amber-800 uppercase">ROASTERS</span>
            <span className="text-[9px] font-bold text-stone-500">EST. 2026</span>
          </div>
          <div className="my-auto space-y-1.5 z-10">
            <h4 className="text-base font-bold text-amber-900 tracking-tight leading-tight">ARTISANAL BLENDS</h4>
            <p className="text-[8px] text-stone-600 leading-relaxed">Sustainably sourced single-origin coffee, roasted locally in small batches.</p>
          </div>
          <div className="flex justify-between items-end z-10 pt-2 border-t border-amber-800/10">
            <div className="text-[7px] text-left text-amber-800">
              <p className="font-semibold">GRAND OPENING</p>
              <p className="text-[6px] text-stone-500">Saturday, June 20</p>
            </div>
            <span className="text-[7px] border border-amber-800/20 text-amber-800 px-1.5 py-0.5 rounded font-bold">FREE TASTING</span>
          </div>
        </div>
      )
    },
    {
      title: "Tech Summit 2026",
      style: "Modern",
      prompt: "A modern corporate tech summit flyer with slate grey background, clean borders, and premium typography",
      bgGradient: "from-slate-900 to-zinc-950",
      textColor: "text-blue-300",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      mockContent: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-zinc-950 rounded-xl relative overflow-hidden border border-zinc-800">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
          <div className="flex justify-between items-center z-10">
            <span className="text-[9px] font-bold tracking-widest text-blue-400 uppercase">TECH SUMMIT</span>
            <span className="text-[9px] font-bold text-zinc-500">2026</span>
          </div>
          <div className="my-auto z-10 space-y-1">
            <h4 className="text-base font-extrabold tracking-tight text-white uppercase">SHAPING THE FUTURE</h4>
            <p className="text-[8px] text-zinc-400 leading-relaxed">Join industry leaders discussing AI advancements, automation, and tech ethics.</p>
          </div>
          <div className="flex justify-between items-end z-10 pt-2 border-t border-zinc-900">
            <div className="text-[7px] text-left text-zinc-400">
              <p className="font-semibold text-white">CONVENTION CENTER</p>
              <p className="text-[6px] text-zinc-500">KEYNOTE AT 9:00 AM</p>
            </div>
            <span className="text-[7px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold">RSVP NOW</span>
          </div>
        </div>
      )
    }
  ];

  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Event Director, Velo Media",
      quote: "Using PIYUSH.AI, we generated 15 event flyers for our summer series in less than an hour. The speed is mind-blowing, and the layout quality is top-tier.",
      stars: 5,
      avatar: "SJ"
    },
    {
      name: "Marcus Thorne",
      role: "Co-Founder, Brew & Bound",
      quote: "I have no design experience, but this tool made me look like an expert. The text overlay editor is incredibly simple and the vector-like export was ready for print.",
      stars: 5,
      avatar: "MT"
    },
    {
      name: "Alisha Patel",
      role: "Marketing Head, GrowthGym",
      quote: "We spent thousands on local designers every quarter. Now we draft variations in seconds. The prompt suggestions feature is like having a copywriter on standby.",
      stars: 5,
      avatar: "AP"
    }
  ];

  const faqs = [
    {
      q: "How does the AI flyer generator work?",
      a: "Our generator processes your text parameters (event types, styles, palettes, and descriptions) and utilizes state-of-the-art generative models to build a custom visual template. You can then layer headers, timings, descriptions, and custom brand logos directly over the generated template."
    },
    {
      q: "Can I upload my own company logos?",
      a: "Yes! In the generation canvas, you can easily overlay logo files, resize them, reposition them on the grid, and download them embedded into the final high-resolution PNG export."
    },
    {
      q: "What design styles can I choose from?",
      a: "Currently we support six core design philosophies: Modern (clean and contemporary), Vibrant (bold and energetic), Elegant (sophisticated and refined), Creative (artistic and unique), Minimal (simple and clean), and Bold (striking and high-contrast)."
    },
    {
      q: "Are the final downloads ready for commercial use?",
      a: "Absolutely. All flyers generated on PIYUSH.AI are fully royalty-free and export at high resolutions (300 DPI layout density equivalent) suitable for digital campaigns or physical printing."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[650px] h-[650px] bg-primary/5 rounded-full blur-[140px]" />
        <div className="absolute top-[400px] left-1/4 w-[550px] h-[550px] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-40 pb-16 px-4">
        <div className="container max-w-5xl mx-auto text-center space-y-8">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full animate-slide-in-up">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">Gemini 1.5 Powered Studio</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08] animate-slide-in-up">
            Design professional flyers <br />
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-text">
              with AI precision
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-in-up">
            Describe your event and watch AI instantly design a premium, print-ready flyer. Customize details, overlay text, and add logos instantly.
          </p>

          {/* Active Prompt Form */}
          <div className="max-w-2xl mx-auto space-y-3.5 animate-slide-in-up">
            <form onSubmit={handleHeroSubmit} className="p-1.5 bg-card border border-border rounded-2xl shadow-md flex flex-col sm:flex-row items-center gap-2">
              <Input
                type="text"
                placeholder="e.g., A vintage music concert flyer, mahogany tones, elegant fonts..."
                value={heroPrompt}
                onChange={(e) => setHeroPrompt(e.target.value)}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground/60 h-12 flex-1 pl-4 text-sm"
              />
              <Button 
                type="submit" 
                className="w-full sm:w-auto h-11 px-6 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl shrink-0 gap-1.5"
              >
                <Wand2 className="h-4 w-4" />
                Generate Now
              </Button>
            </form>

            {/* Prompt Chips */}
            <div className="flex flex-wrap justify-center gap-2 pt-1">
              {promptChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroPrompt(chip.prompt)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-border bg-card/60 hover:bg-secondary hover:text-foreground text-muted-foreground transition-all"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Browser Workspace Mockup */}
          <div className="pt-8 max-w-4xl mx-auto animate-slide-in-up">
            <div className="bg-card border border-border shadow-2xl rounded-2xl overflow-hidden relative">
              {/* Browser bar */}
              <div className="bg-secondary/60 px-4 py-3 border-b border-border/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="bg-background border border-border text-[10px] text-muted-foreground px-8 py-0.5 rounded-md font-medium tracking-wide">
                  piyush.ai/editor
                </div>
                <div className="w-12 h-1" />
              </div>

              {/* Editor Workspace Mockup */}
              <div className="grid grid-cols-12 h-[340px] sm:h-[420px] bg-background">
                {/* Editor Sidebar */}
                <div className="col-span-4 border-r border-border p-4 bg-card text-left space-y-4 hidden sm:block">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Event Details</p>
                    <div className="h-8 bg-secondary/65 border border-border rounded-lg flex items-center px-3 text-[11px] font-semibold text-foreground">
                      Summer Sunset Festival
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Color Harmony</p>
                    <div className="flex gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-primary" />
                      <div className="w-5 h-5 rounded-full bg-accent" />
                      <div className="w-5 h-5 rounded-full bg-indigo-500" />
                      <div className="w-5 h-5 rounded-full bg-zinc-200" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Design Style</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="h-7 bg-primary/10 border border-primary/30 rounded text-[10px] flex items-center justify-center font-bold text-primary">
                        ✨ Modern
                      </div>
                      <div className="h-7 bg-secondary/40 border border-border rounded text-[10px] flex items-center justify-center font-medium text-muted-foreground">
                        👑 Elegant
                      </div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="h-9 bg-primary text-primary-foreground text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm">
                      <Wand2 className="w-3.5 h-3.5" /> Re-Generate
                    </div>
                  </div>
                </div>

                {/* Editor Center Stage */}
                <div className="col-span-12 sm:col-span-8 p-6 flex items-center justify-center bg-secondary/20">
                  <div className="w-full max-w-[240px] sm:max-w-[280px] aspect-[3/4] bg-zinc-950 rounded-2xl shadow-lg border border-border/80 p-5 flex flex-col justify-between relative overflow-hidden text-left">
                    {/* Background glow overlay */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
                    
                    <div className="flex justify-between items-center z-10">
                      <span className="text-[9px] font-extrabold tracking-widest text-primary uppercase">MUSIC CONCERT</span>
                      <span className="text-[9px] font-bold text-muted-foreground">JULY 18</span>
                    </div>

                    <div className="my-auto space-y-1.5 z-10">
                      <h4 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-none">SUMMER <br />SUNSET</h4>
                      <p className="text-[9px] text-muted-foreground uppercase font-medium tracking-widest">LIVE AT SANTA MONICA PIER</p>
                    </div>

                    <div className="flex justify-between items-end z-10 pt-3 border-t border-border/40">
                      <div className="text-[8px] text-left text-zinc-300">
                        <p className="font-semibold text-white">THE BEACH STAGE</p>
                        <p className="text-[7px] text-muted-foreground">5:00 PM TILL MIDNIGHT</p>
                      </div>
                      <span className="text-[8px] bg-primary text-primary-foreground px-2 py-0.5 rounded font-bold uppercase tracking-wider">BUY TICKET</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SaaS Statistics Banner */}
      <section className="border-y border-border/60 bg-secondary/30 py-8 px-4">
        <div className="container max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-foreground">50k+</p>
            <p className="text-xs text-muted-foreground font-semibold">Designs Generated</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-foreground">99.8%</p>
            <p className="text-xs text-muted-foreground font-semibold">Uptime SLA</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-foreground">&lt; 30s</p>
            <p className="text-xs text-muted-foreground font-semibold">Generation Speed</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-foreground">100%</p>
            <p className="text-xs text-muted-foreground font-semibold">Print Ready Exports</p>
          </div>
        </div>
      </section>

      {/* Interactive Feature Tabs */}
      <section className="py-20 px-4 border-b border-border/50">
        <div className="container max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Fully Loaded Design Studio</h2>
            <p className="text-base text-muted-foreground">
              Everything you need to craft high-quality flyer campaigns in one simple workspace.
            </p>
          </div>

          <div className="flex justify-center p-1 bg-secondary rounded-xl max-w-md mx-auto">
            <button
              onClick={() => setActiveTab("ai")}
              className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all ${
                activeTab === "ai" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              1. AI Generator
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all ${
                activeTab === "edit" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              2. Text Overlays
            </button>
            <button
              onClick={() => setActiveTab("brand")}
              className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all ${
                activeTab === "brand" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              3. Custom Brand
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto pt-6">
            <div className="space-y-5 text-left">
              {activeTab === "ai" && (
                <>
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary w-fit border border-primary/20">
                    <Wand2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-bold">Generative Prompt Compositing</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Type structured data or simple descriptive sentences. Our parser translates it directly to color combinations, styles, and background templates matching your mood parameters.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> 6 custom flyer styles</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Auto-optimizing prompts</li>
                  </ul>
                </>
              )}
              {activeTab === "edit" && (
                <>
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary w-fit border border-primary/20">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-bold">Layered Custom Text</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Overlay critical event variables like titles, venue location coordinates, schedules, and details. Double-click or open the side drawer to modify parameters instantly.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Dynamic layout adjustments</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Crisp vector text rendering</li>
                  </ul>
                </>
              )}
              {activeTab === "brand" && (
                <>
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary w-fit border border-primary/20">
                    <Palette className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-bold">Logo Uploads & Branding</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ensure branding alignment. Drag and drop custom PNG and SVG files to place brand badges, resize them with a visual guide, and save presets for future templates.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Drag-and-drop overlay layout</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Transparency support (PNG/SVG)</li>
                  </ul>
                </>
              )}
            </div>

            {/* Tab Preview Graphic */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center justify-center min-h-[260px] relative overflow-hidden">
              {activeTab === "ai" && (
                <div className="space-y-4 w-full">
                  <div className="p-3 bg-secondary rounded-lg text-xs font-mono text-muted-foreground text-left">
                    Prompt: "Minimal jazz festival poster..."
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-primary/10 text-primary border border-primary/20 rounded flex items-center justify-center flex-1 text-[11px] font-bold">
                      Generating Style...
                    </div>
                    <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center">
                      <Clock className="h-4 w-4 text-muted-foreground animate-pulse" />
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "edit" && (
                <div className="space-y-3 w-full text-left">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Headline</p>
                    <div className="h-9 bg-secondary border border-border rounded-lg flex items-center px-3 text-xs font-semibold">
                      Live Indie Showcase
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Date</p>
                      <div className="h-8 bg-secondary border border-border rounded-lg flex items-center px-3 text-xs">
                        Oct 14
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Time</p>
                      <div className="h-8 bg-secondary border border-border rounded-lg flex items-center px-3 text-xs">
                        8:00 PM
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "brand" && (
                <div className="w-full flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 bg-secondary/20">
                  <Palette className="h-8 w-8 text-primary mb-2" />
                  <p className="text-xs font-bold text-foreground">Upload brand logo</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Drag PNG or SVG file here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Curated Flyer Gallery */}
      <section className="py-20 px-4 bg-secondary/10 border-t border-border/60">
        <div className="container max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Explore Styles & Prompts</h2>
            <p className="text-base text-muted-foreground">
              Hover over designs to examine the exact prompts used, and edit them directly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {demoTemplates.map((tmpl, idx) => (
              <Card key={idx} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm group relative flex flex-col h-[380px]">
                {/* Visual Preview */}
                <div className="p-4 bg-secondary/40 flex-1 flex items-center justify-center">
                  <div className="w-[180px] aspect-[3/4] rounded-xl shadow">
                    {tmpl.mockContent}
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-4 border-t border-border flex items-center justify-between bg-card z-10">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{tmpl.title}</h4>
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">Style: {tmpl.style}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleUsePrompt(tmpl.prompt)}
                    className="h-8 text-xs font-semibold rounded-lg hover:bg-secondary border-border"
                  >
                    Use Prompt
                  </Button>
                </div>

                {/* Slide-up prompt overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-background/95 backdrop-blur border-t border-border p-5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-20 flex flex-col justify-between h-[180px]">
                  <div className="space-y-2 text-left">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider">AI Prompt Details</p>
                    <p className="text-xs text-foreground/80 leading-relaxed italic">
                      "{tmpl.prompt}"
                    </p>
                  </div>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold h-9 text-xs rounded-lg mt-3"
                    onClick={() => handleUsePrompt(tmpl.prompt)}
                  >
                    Generate with this Prompt
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 border-t border-border/50">
        <div className="container max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Loved by Event Creators</h2>
            <p className="text-base text-muted-foreground">
              See what creators and marketing teams are saying about our generation speeds.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {testimonials.map((test, idx) => (
              <Card key={idx} className="bg-card border border-border p-6 shadow-sm rounded-2xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex gap-0.5 text-amber-500">
                    {[...Array(test.stars)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed italic">"{test.quote}"</p>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {test.avatar}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-foreground">{test.name}</p>
                    <p className="text-[10px] text-muted-foreground">{test.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SaaS Pricing Section */}
      <section className="py-20 px-4 bg-secondary/15 border-t border-border/50">
        <div className="container max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Flexible Pricing Plans</h2>
            <p className="text-base text-muted-foreground">
              Generate templates for free or upgrade to custom branding assets.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-4">
            {/* Starter Plan */}
            <Card className="bg-card border border-border p-6 shadow-sm rounded-2xl flex flex-col justify-between">
              <div className="space-y-4 text-left">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Starter</h4>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-extrabold">$0</span>
                    <span className="text-xs text-muted-foreground">/ month</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Perfect for drafting ideas and personal flyers.</p>
                <div className="w-full h-[1px] bg-border" />
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 5 generations per day</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Standard image downloads</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Core style templates</li>
                </ul>
              </div>
              <Button asChild variant="outline" className="w-full mt-6 rounded-lg border-border hover:bg-secondary">
                <Link to="/generate">Get Started</Link>
              </Button>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-card border-2 border-primary p-6 shadow-md rounded-2xl flex flex-col justify-between relative scale-[1.03] z-10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm">
                Most Popular
              </div>
              <div className="space-y-4 text-left">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Creator Pro</h4>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-extrabold">$19</span>
                    <span className="text-xs text-muted-foreground">/ month</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">For business owners, organizers, and promoters.</p>
                <div className="w-full h-[1px] bg-border" />
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited AI generation</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> High-res vector exports</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Logo overlays & branding</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Priority generation queue</li>
                </ul>
              </div>
              <Button asChild className="w-full mt-6 bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-lg shadow-sm">
                <Link to="/generate">Go Unlimited</Link>
              </Button>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-card border border-border p-6 shadow-sm rounded-2xl flex flex-col justify-between">
              <div className="space-y-4 text-left">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Enterprise</h4>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-extrabold">Custom</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">For design agencies and large corporations.</p>
                <div className="w-full h-[1px] bg-border" />
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Custom AI layout models</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Dedicated GPU priority server</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Bulk creation API</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Dedicated support manager</li>
                </ul>
              </div>
              <Button asChild variant="outline" className="w-full mt-6 rounded-lg border-border hover:bg-secondary">
                <Link to="/about">Contact Sales</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 px-4 border-t border-border/50">
        <div className="container max-w-4xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-base text-muted-foreground">
              Everything you need to know about PIYUSH.AI.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-3.5 pt-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-card border border-border rounded-xl p-4 cursor-pointer text-left transition-colors hover:bg-secondary/20"
                onClick={() => toggleFaq(idx)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-foreground">{faq.q}</span>
                  <HelpCircle className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                    openFaq === idx ? "rotate-180 text-primary" : ""
                  }`} />
                </div>
                {openFaq === idx && (
                  <div className="mt-3 text-xs text-muted-foreground leading-relaxed pt-2.5 border-t border-border/40 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box Section */}
      <section className="py-20 px-4 border-t border-border/50">
        <div className="container max-w-4xl mx-auto">
          <div className="p-8 sm:p-12 bg-card border border-border rounded-3xl relative overflow-hidden shadow-xl text-center space-y-6">
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
            
            <div className="relative z-10 max-w-xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Create your next flyer today</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Join thousands of small business owners, promoters, and event creators building premium design assets.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-8 h-12 rounded-xl">
                  <Link to="/generate">
                    Create Flyer Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="hover:bg-secondary px-8 h-12 rounded-xl border-border">
                  <Link to="/about">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 border-border bg-card">
        <div className="container max-w-5xl mx-auto">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-xl">
              <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                <Wand2 className="w-5 h-5" />
              </div>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
                PIYUSH.AI
              </span>
            </Link>
            
            <div className="flex items-center gap-8">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/generate" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Generate
              </Link>
            </div>
            
            <p className="text-xs sm:text-sm text-muted-foreground">
              © {new Date().getFullYear()} PIYUSH.AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
