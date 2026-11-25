import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Target, 
  Rocket, 
  Github, 
  Twitter, 
  Globe, 
  ArrowRight,
  Cpu,
  Database,
  Code2,
  Palette,
  Quote
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
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

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground flex flex-col justify-between">
      {/* Navbar */}
      <Navbar />

      {/* Subtle dot-grid map background matching Hero */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.35] dark:opacity-[0.16]"
        style={{
          backgroundImage: `radial-gradient(currentColor 1.2px, transparent 1.2px)`,
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 30%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 30%, #000 60%, transparent 100%)',
        }}
      />

      {/* Ambient background soft glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative pt-28 sm:pt-36 pb-24 px-4 sm:px-6 flex-1">
        <div className="container max-w-5xl mx-auto space-y-20 relative z-10">
          
          {/* Section Header */}
          <div className="text-center space-y-5 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/80 bg-card/90 backdrop-blur-sm text-xs font-semibold text-foreground shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Behind the Magic</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
              Democratizing Visual Design
            </h1>
            
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              We build tools that translate text prompts directly into high-fidelity, print-ready marketing assets without complex manual canvas editing.
            </p>
          </div>

          {/* Mission & Vision Cards (Matching 3D Tile Aesthetics) */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="group relative p-7 sm:p-9 bg-card/90 backdrop-blur-sm border border-border/80 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 text-left space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-background border border-border/80 shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex items-center justify-center text-foreground transition-transform duration-300 group-hover:scale-110">
                  <Target className="w-6 h-6 text-foreground" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-secondary/80 border border-border/60 text-muted-foreground">
                  Workflow Optimization
                </span>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  Our Core Mission
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  To simplify creation workflows. By leveraging advanced generative AI models, we remove technical barriers to graphic design, empowering small businesses, promoters, and creators to export visual assets instantly.
                </p>
              </div>
            </div>

            <div className="group relative p-7 sm:p-9 bg-card/90 backdrop-blur-sm border border-border/80 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 text-left space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-background border border-border/80 shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex items-center justify-center text-foreground transition-transform duration-300 group-hover:scale-110">
                  <Rocket className="w-6 h-6 text-foreground" />
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-secondary/80 border border-border/60 text-muted-foreground">
                  Adaptive AI Pipeline
                </span>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  Our Platform Vision
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  To build an adaptive prompt-to-design environment where natural language is the primary input. We aim to constantly optimize our rendering pipeline, producing highly tailored, print-ready digital flyers without setup times.
                </p>
              </div>
            </div>
          </div>

          {/* Founder Section (3D Monogram Tile + Hero-Aligned Quote Card) */}
          <div className="relative p-7 sm:p-10 bg-card/90 backdrop-blur-sm border border-border/80 rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.3)] overflow-hidden">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              {/* Founder Avatar with 3D perspective depth */}
              <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-border/70">
                <div 
                  className="w-24 h-24 rounded-3xl bg-background border border-border/80 flex items-center justify-center font-black text-2xl text-foreground mb-4 shadow-[0_18px_36px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:scale-105"
                  style={{
                    transform: 'perspective(700px) rotateY(-10deg) rotateX(6deg)',
                  }}
                >
                  PL
                </div>
                <h3 className="text-base font-extrabold text-foreground">Piyush Landge</h3>
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

              {/* Note from the Founder */}
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

          {/* Platform Journey (Connected Horizontal Timeline Cards) */}
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Our Platform Journey
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Tracing the development timeline of PIXIO.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {milestones.map((stone, idx) => (
                <div 
                  key={idx} 
                  className="group relative p-6 bg-card/80 backdrop-blur-sm border border-border/70 rounded-2xl shadow-2xs hover:shadow-md hover:border-foreground/40 transition-all duration-300 flex flex-col justify-between space-y-4"
                >
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
              ))}
            </div>
          </div>

          {/* Tech Stack Breakdown (Bento Grid matching Category Pills) */}
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Engineered for Performance
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                The modern tech stack driving our direct prompt generation pipeline.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {techStack.map((tech, idx) => {
                const IconComponent = tech.icon;
                return (
                  <div 
                    key={idx} 
                    className="group p-6 bg-card/80 backdrop-blur-sm border border-border/70 rounded-2xl shadow-2xs hover:shadow-md hover:border-foreground/40 transition-all duration-300 space-y-3.5"
                  >
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
                );
              })}
            </div>
          </div>

          {/* CTA / Action Card (Matching Hero Design & Action Style) */}
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

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
