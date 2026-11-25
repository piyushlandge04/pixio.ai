import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Wand2, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Palette, 
  Zap, 
  Flame,
  Target,
  Rocket,
  Github,
  Twitter,
  Globe,
  Cpu,
  Database,
  Code2,
  Quote,
  Download,
  RefreshCw,
  Printer,
  ShieldCheck
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";

const Landing = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");

  const workflowSteps = [
    {
      step: "01",
      title: "Describe Your Vision",
      desc: "Type a natural language prompt describing your event, brand, or mood. Enhance it with one click for richer creative detail.",
      icon: Wand2,
    },
    {
      step: "02",
      title: "Instant AI Synthesis",
      desc: "Our multi-pass engine composes balanced layout geometry, typography, and high-resolution graphics in seconds.",
      icon: Sparkles,
    },
    {
      step: "03",
      title: "Refine & Export",
      desc: "Not satisfied? Request natural language revisions and download your final flyer in 300 DPI print-ready quality.",
      icon: Download,
    },
  ];

  const milestones = [
    {
      year: "Q1 2025",
      title: "The Conception",
      description: "Observed that small business owners and community organizers lacked design resources, inspiring a text-to-flyer generation solution."
    },
    {
      year: "Q3 2025",
      title: "AI Engine Alpha",
      description: "Integrated the first text-to-image AI pipeline and established direct prompt-to-flyer generation."
    },
    {
      year: "Q1 2026",
      title: "Going Public",
      description: "Launched PIXIO v1.0. Welcomed over 10,000 active creators and handled over 50,000 successful exports."
    },
    {
      year: "Q2 2026",
      title: "Redesign v2.0",
      description: "Overhauled the platform aesthetics and generation speeds with Gemini AI integrations, introducing streamlined prompt-to-design controls."
    }
  ];

  const techStack = [
    {
      title: "Gemini AI Models",
      role: "AI Core",
      desc: "Handles prompt enhancement, semantic color analysis, layout composition, and high-resolution flyer rendering.",
      icon: Cpu,
    },
    {
      title: "Supabase DB & Auth",
      role: "Database & Security",
      desc: "Manages encrypted user authentication, profile storage, and user generation histories.",
      icon: Database,
    },
    {
      title: "Vite & React 18",
      role: "Frontend Engine",
      desc: "Drives high-performance client-side page rendering and instant design preview updates.",
      icon: Code2,
    },
    {
      title: "Tailwind CSS",
      role: "Style System",
      desc: "Powers our fluid dark-first UI design system and responsive grid structures.",
      icon: Palette,
    }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate(`/generate?prompt=${encodeURIComponent(prompt.trim())}`);
    } else {
      navigate("/generate");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-x-hidden">
      {/* Fixed Modern Navbar */}
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (XM Aesthetic + Command Bar + Floating 3D Tiles)          */}
      {/* ========================================================================= */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Subtle dot grid map background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.4] dark:opacity-[0.18]"
          style={{
            backgroundImage: `radial-gradient(currentColor 1.2px, transparent 1.2px)`,
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse 65% 55% at 50% 45%, #000 60%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 45%, #000 60%, transparent 100%)',
          }}
        />

        {/* Ambient radial glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-primary/5 rounded-full blur-[130px] pointer-events-none" />

        {/* Floating 3D Tiles - Left Group */}
        <div className="hidden lg:flex absolute left-8 xl:left-24 top-[38%] -translate-y-1/2 flex-col items-center z-10">
          <div 
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-card/95 backdrop-blur-sm border border-border/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.14)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55)] flex items-center justify-center p-5 transform -rotate-12 hover:-rotate-6 transition-all duration-500 hover:scale-105 cursor-pointer animate-float"
            onClick={() => navigate("/generate")}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-inner text-white">
              <Flame className="w-9 h-9 fill-current" />
            </div>
          </div>
        </div>

        <div className="hidden lg:flex absolute left-20 xl:left-44 top-[18%] flex-col items-center z-10">
          <div 
            className="w-20 h-20 rounded-2xl bg-card/95 backdrop-blur-sm border border-border/80 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.12)] dark:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.45)] flex items-center justify-center p-3 transform rotate-6 hover:rotate-12 transition-all duration-500 hover:scale-105 cursor-pointer animate-float"
            style={{ animationDelay: '1.2s' }}
            onClick={() => navigate("/generate")}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-black text-lg shadow-inner">
              <Wand2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="hidden xl:flex absolute left-48 top-[10%] opacity-75 pointer-events-none">
          <div className="w-12 h-12 rounded-xl bg-card border border-border/60 shadow-md flex items-center justify-center transform -rotate-12">
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        {/* Floating 3D Tiles - Right Group */}
        <div className="hidden lg:flex absolute right-8 xl:right-24 top-[38%] -translate-y-1/2 flex-col items-center z-10">
          <div 
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-card/95 backdrop-blur-sm border border-border/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.14)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55)] flex items-center justify-center p-5 transform rotate-12 hover:rotate-6 transition-all duration-500 hover:scale-105 cursor-pointer animate-float"
            style={{ animationDelay: '0.6s' }}
            onClick={() => navigate("/generate")}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center shadow-inner text-white">
              <Layers className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="hidden lg:flex absolute right-20 xl:right-44 top-[18%] flex-col items-center z-10">
          <div 
            className="w-20 h-20 rounded-2xl bg-card/95 backdrop-blur-sm border border-border/80 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.12)] dark:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.45)] flex items-center justify-center p-3 transform -rotate-8 hover:-rotate-12 transition-all duration-500 hover:scale-105 cursor-pointer animate-float"
            style={{ animationDelay: '1.8s' }}
            onClick={() => navigate("/generate")}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-inner">
              <Palette className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="hidden xl:flex absolute right-48 top-[10%] opacity-75 pointer-events-none">
          <div className="w-12 h-12 rounded-xl bg-card border border-border/60 shadow-md flex items-center justify-center transform rotate-12">
            <Zap className="w-5 h-5 text-rose-500" />
          </div>
        </div>

        {/* Center Content Section */}
        <div className="max-w-3xl mx-auto text-center z-10 space-y-7 pt-2 sm:pt-6">
          {/* Announcement Pill */}
          <Link 
            to="/generate" 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/80 bg-card/90 backdrop-blur-sm text-xs font-semibold text-foreground shadow-2xs hover:border-foreground/40 transition-all group"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>PIXIO Studio v2.4 · 300 DPI Print-Ready</span>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05]">
              Discover
              <span className="block mt-1 font-black">AI Flyer & Design</span>
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-xl mx-auto pt-2 leading-relaxed">
              Generate complete, print-ready marketing flyers directly from text prompts with unparalleled AI precision.
            </p>
          </div>

          {/* Action Buttons & Command Bar */}
          <div className="pt-2 flex flex-col items-center gap-4 w-full max-w-xl mx-auto">
            {/* Elevated AI Command Bar Input */}
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative flex items-center p-1.5 rounded-2xl border border-border/90 bg-card/95 backdrop-blur-md shadow-[0_12px_35px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_35px_rgba(0,0,0,0.4)] focus-within:border-foreground/40 transition-all">
                <Sparkles className="w-4 h-4 text-primary ml-3 shrink-0" />
                <Input
                  type="text"
                  placeholder="Describe the flyer you want to create..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="h-11 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-xs sm:text-sm px-3"
                />
                <Button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold text-xs sm:text-sm shrink-0 shadow-sm gap-1.5"
                >
                  <span>Generate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-9 px-5 rounded-xl border-border/80 bg-card/80 hover:bg-secondary text-xs font-semibold gap-1.5"
              >
                <Link to="/generate">
                  <Wand2 className="w-3.5 h-3.5" />
                  Open Full Studio
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-9 px-4 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <a href="#workflow">
                  How It Works
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Clean Performance Metrics Strip */}
        <ScrollReveal variant="fade-up" delay={120} className="w-full max-w-4xl mx-auto pt-14 z-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 sm:p-6 rounded-3xl border border-border/70 bg-card/70 backdrop-blur-md shadow-2xs text-center">
            <div className="space-y-1">
              <div className="text-xl sm:text-2xl font-black tracking-tight text-foreground">50k+</div>
              <div className="text-[11px] font-medium text-muted-foreground">Flyers Generated</div>
            </div>
            <div className="space-y-1 sm:border-l border-border/60">
              <div className="text-xl sm:text-2xl font-black tracking-tight text-foreground">300 DPI</div>
              <div className="text-[11px] font-medium text-muted-foreground">Print-Ready Quality</div>
            </div>
            <div className="space-y-1 sm:border-l border-border/60">
              <div className="text-xl sm:text-2xl font-black tracking-tight text-foreground">&lt; 15s</div>
              <div className="text-[11px] font-medium text-muted-foreground">Average Render</div>
            </div>
            <div className="space-y-1 sm:border-l border-border/60">
              <div className="text-xl sm:text-2xl font-black tracking-tight text-foreground">100%</div>
              <div className="text-[11px] font-medium text-muted-foreground">Commercial Ready</div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ========================================================================= */}
      {/* 2. WORKFLOW & CAPABILITIES SECTION (Clean SaaS Bento Grid)                */}
      {/* ========================================================================= */}
      <section id="workflow" className="relative py-24 sm:py-28 px-4 border-t border-border/70 bg-secondary/15 scroll-mt-16 overflow-hidden">
        <div className="container max-w-5xl mx-auto space-y-16 relative z-10">
          
          {/* Workflow Header */}
          <ScrollReveal variant="fade-up" className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-border/80 bg-card/90 text-xs font-semibold text-foreground shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span>Zero-Friction Studio</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              From Prompt to Print in Seconds
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              No complex layers, no manual canvas dragging. Just describe what you need and refine it in plain language.
            </p>
          </ScrollReveal>

          {/* 3-Step Workflow Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {workflowSteps.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <ScrollReveal key={idx} variant="fade-up" delay={idx * 120} className="h-full">
                  <div className="group h-full p-7 bg-card/90 backdrop-blur-sm border border-border/80 rounded-3xl shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-background border border-border/80 shadow-xs flex items-center justify-center text-foreground group-hover:scale-105 transition-transform">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-muted-foreground/70 bg-secondary px-2.5 py-1 rounded-full">
                        {item.step}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-extrabold text-foreground">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Core Capabilities Bento Highlights */}
          <ScrollReveal variant="fade-up" delay={150}>
            <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card/80 border border-border/70 rounded-2xl flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-background border border-border/80 text-foreground shrink-0">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground">Iterative AI Revisions</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Request specific tweaks in plain text and compare revision snapshots side-by-side.
                </p>
              </div>
            </div>

            <div className="p-6 bg-card/80 border border-border/70 rounded-2xl flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-background border border-border/80 text-foreground shrink-0">
                <Printer className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground">300 DPI Print Standard</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Engineered in 3:4 vertical poster orientation ready for social media or commercial printing.
                </p>
              </div>
            </div>

            <div className="p-6 bg-card/80 border border-border/70 rounded-2xl flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-background border border-border/80 text-foreground shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground">Encrypted Archive</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every generated flyer and prompt history is securely stored in your personal Supabase vault.
                </p>
              </div>
            </div>
          </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ABOUT SECTION ("Behind the Magic" Matched with Hero Aesthetic)         */}
      {/* ========================================================================= */}
      <section id="about" className="relative py-28 sm:py-36 px-4 border-t border-border/70 bg-background scroll-mt-16 overflow-hidden">
        {/* Subtle dot-grid map background matching Hero */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.35] dark:opacity-[0.16]"
          style={{
            backgroundImage: `radial-gradient(currentColor 1.2px, transparent 1.2px)`,
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse 65% 55% at 50% 35%, #000 60%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 35%, #000 60%, transparent 100%)',
          }}
        />

        {/* Ambient soft glow orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container max-w-5xl mx-auto space-y-20 relative z-10">
          
          {/* Section Header */}
          <ScrollReveal variant="fade-up" className="text-center space-y-5 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/80 bg-card/90 backdrop-blur-sm text-xs font-semibold text-foreground shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Behind the Magic</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
              Democratizing Visual Design
            </h2>
            
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              We build tools that translate text prompts directly into high-fidelity, print-ready marketing assets without complex manual canvas editing.
            </p>
          </ScrollReveal>

          {/* Mission & Vision Cards */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <ScrollReveal variant="fade-up" delay={0} className="h-full">
              <div className="group h-full relative p-7 sm:p-9 bg-card/90 backdrop-blur-sm border border-border/80 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 text-left space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-background border border-border/80 shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex items-center justify-center text-foreground transition-transform duration-300 group-hover:scale-110">
                    <Target className="w-6 h-6 text-foreground" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-secondary/80 border border-border/60 text-muted-foreground">
                    Workflow Optimization
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                    Our Core Mission
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    To simplify creation workflows. By leveraging advanced generative AI models, we remove technical barriers to graphic design, empowering small businesses, promoters, and creators to export visual assets instantly.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={150} className="h-full">
              <div className="group h-full relative p-7 sm:p-9 bg-card/90 backdrop-blur-sm border border-border/80 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 text-left space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-background border border-border/80 shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex items-center justify-center text-foreground transition-transform duration-300 group-hover:scale-110">
                    <Rocket className="w-6 h-6 text-foreground" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-secondary/80 border border-border/60 text-muted-foreground">
                    Adaptive AI Pipeline
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                    Our Platform Vision
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    To build an adaptive prompt-to-design environment where natural language is the primary input. We aim to constantly optimize our rendering pipeline, producing highly tailored, print-ready digital flyers without setup times.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Founder Section */}
          <ScrollReveal variant="zoom-in" delay={100}>
            <div className="relative p-7 sm:p-10 bg-card/90 backdrop-blur-sm border border-border/80 rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.3)] overflow-hidden">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-border/70">
                <div 
                  className="w-24 h-24 rounded-3xl bg-background border border-border/80 flex items-center justify-center font-black text-2xl text-foreground mb-4 shadow-[0_18px_36px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:scale-105"
                  style={{
                    transform: 'perspective(700px) rotateY(-10deg) rotateX(6deg)',
                  }}
                >
                  PL
                </div>
                <h4 className="text-base font-extrabold text-foreground">Piyush Landge</h4>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">Founder & Lead Architect</p>
                <div className="flex gap-2.5 mt-4">
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-8 h-8 rounded-lg border border-border/80 bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="h-3.5 w-3.5" />
                  </a>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-8 h-8 rounded-lg border border-border/80 bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-3.5 w-3.5" />
                  </a>
                  <Link 
                    to="/" 
                    className="w-8 h-8 rounded-lg border border-border/80 bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                    aria-label="Website"
                  >
                    <Globe className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="md:col-span-8 text-left space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/80 border border-border/60 text-xs font-semibold text-foreground">
                  <Quote className="w-3.5 h-3.5 text-primary" />
                  <span>A Note from the Founder</span>
                </div>
                <blockquote className="text-base sm:text-lg text-foreground/90 font-medium leading-relaxed italic border-l-2 border-foreground/30 pl-4 py-1">
                  &ldquo;Design shouldn't be a privilege limited to those who have hours to spare or large marketing budgets. It should be a fluid, instant translation of ideas. We created PIXIO to bridge that gap, giving everyone a personal design studio in their browser.&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
          </ScrollReveal>

          {/* Platform Journey */}
          <div className="space-y-8">
            <ScrollReveal variant="fade-up" className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Our Platform Journey
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Tracing the development timeline of PIXIO.
              </p>
            </ScrollReveal>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {milestones.map((stone, idx) => (
                <ScrollReveal key={idx} variant="fade-up" delay={idx * 100} className="h-full">
                  <div className="group h-full relative p-6 bg-card/80 backdrop-blur-sm border border-border/70 rounded-2xl shadow-2xs hover:shadow-md hover:border-foreground/40 transition-all duration-300 flex flex-col justify-between space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-foreground text-background shadow-xs">
                        {stone.year}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        0{idx + 1}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-base font-bold text-foreground">
                        {stone.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {stone.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Tech Stack Breakdown */}
          <div className="space-y-8">
            <ScrollReveal variant="fade-up" className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Engineered for Performance
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                The modern tech stack driving our direct prompt generation pipeline.
              </p>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {techStack.map((tech, idx) => {
                const IconComponent = tech.icon;
                return (
                  <ScrollReveal key={idx} variant="fade-up" delay={idx * 100} className="h-full">
                    <div className="group h-full p-6 bg-card/80 backdrop-blur-sm border border-border/70 rounded-2xl shadow-2xs hover:shadow-md hover:border-foreground/40 transition-all duration-300 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-background border border-border/80 flex items-center justify-center text-foreground group-hover:scale-105 transition-transform">
                          <IconComponent className="w-5 h-5 text-foreground" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-secondary/80 px-2 py-0.5 rounded text-muted-foreground border border-border/50">
                          {tech.role}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{tech.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-1">{tech.desc}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>

          {/* Final CTA Card */}
          <ScrollReveal variant="zoom-in" delay={100}>
            <div className="relative p-8 sm:p-12 bg-card/90 backdrop-blur-sm border border-border/80 rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.3)] text-center space-y-6 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="max-w-xl mx-auto space-y-3 relative z-10">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  Ready to build your next design?
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Experience our direct prompt-to-design engine. Enter what you want to create and get a complete visual design instantly.
                </p>
              </div>
              
              <div className="flex justify-center relative z-10">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-foreground text-background hover:bg-foreground/90 font-bold px-8 h-12 rounded-xl shadow-lg hover:scale-105 transition-all text-sm"
                >
                  <Link to="/generate">
                    Start Designing Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* Professional Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
