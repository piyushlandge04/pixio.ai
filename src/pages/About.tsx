import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, Target, Rocket, Github, Twitter, Globe, Heart
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
      description: "Integrated the first text-to-image AI pipeline and established basic text overlay rendering to handle flyer typography."
    },
    {
      year: "Q1 2026",
      title: "Going Public",
      description: "Launched PIYUSH.AI v1.0. Welcomed over 10,000 active creators and handled over 50,000 successful exports."
    },
    {
      year: "Q2 2026",
      title: "Redesign v2.0",
      description: "Overhauled the platform aesthetics and generation speeds with Gemini AI Flash integrations, introducing clean layout controls."
    }
  ];

  const techStack = [
    {
      title: "Gemini 1.5 Flash",
      role: "AI Core",
      desc: "Handles prompt parsing, semantic color analysis, layout suggestions, and structured text composition."
    },
    {
      title: "Supabase DB & Auth",
      role: "Database & Security",
      desc: "Manages encrypted user authentication, profile storage, and user generation histories."
    },
    {
      title: "Vite & React 18",
      role: "Frontend Engine",
      desc: "Drives high-performance clientside page rendering and real-time canvas preview updates."
    },
    {
      title: "Tailwind CSS",
      role: "Style System",
      desc: "Powers our fluid dark-first UI design system and responsive grid structures."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Background radial gradients for ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <Navbar />

      <div className="relative pt-28 sm:pt-36 pb-20 px-4">
        <div className="container max-w-4xl mx-auto space-y-16">
          {/* Header */}
          <div className="text-center space-y-4 animate-slide-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">Behind the Magic</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
              Democratizing Visual Design
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We build tools that translate text prompts directly into high-fidelity, print-ready marketing assets.
            </p>
          </div>

          {/* Founder Section */}
          <Card className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden animate-slide-in-up">
            <div className="grid md:grid-cols-12">
              <div className="md:col-span-4 bg-secondary/50 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-border">
                <div className="h-24 w-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl mb-4 border border-primary/20 shadow-inner">
                  PL
                </div>
                <div className="text-center">
                  <h3 className="text-base font-bold text-foreground">Piyush Landge</h3>
                  <p className="text-xs text-muted-foreground">Founder & Lead Architect</p>
                </div>
                <div className="flex gap-3 mt-4">
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-lg transition-colors">
                    <Github className="h-4 w-4" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-lg transition-colors">
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a href="#" className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-lg transition-colors">
                    <Globe className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-center text-left space-y-4">
                <div className="p-2.5 bg-primary/5 rounded-xl text-primary w-fit border border-primary/10">
                  <Heart className="h-5 w-5 fill-current" />
                </div>
                <h3 className="text-xl font-bold text-foreground">A Note from the Founder</h3>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  &ldquo;Design shouldn't be a privilege limited to those who have hours to spare or large marketing budgets. It should be a fluid, instant translation of ideas. We created PIYUSH.AI to bridge that gap, giving everyone a personal design studio in their browser.&rdquo;
                </p>
              </div>
            </div>
          </Card>

          {/* Mission & Vision Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-card border border-border shadow-sm rounded-2xl text-left space-y-3.5">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Our Core Mission</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                To simplify creation workflows. By leveraging advanced generative AI models, we remove technical barriers to graphic design, empowering small businesses, local promoters, and creators to export visual assets instantly.
              </p>
            </Card>

            <Card className="p-6 bg-card border border-border shadow-sm rounded-2xl text-left space-y-3.5">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent border border-accent/20">
                <Rocket className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Our Platform Vision</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                To build an adaptive canvas environment where natural language is the primary input. We aim to constantly optimize our rendering pipeline, producing highly tailored, print-ready digital flyers without setup times.
              </p>
            </Card>
          </div>

          {/* Timeline / Milestones */}
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Our Platform Journey</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Tracing the development timeline of PIYUSH.AI.</p>
            </div>
            
            <div className="relative border-l border-border/80 pl-6 ml-2 space-y-8 text-left">
              {milestones.map((stone, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline bullet dot */}
                  <div className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-primary ring-4 ring-background" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{stone.year}</span>
                    <h4 className="text-base font-bold text-foreground">{stone.title}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">{stone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Breakdown */}
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Engineered for Performance</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">The modern tech stack driving our real-time composition canvas.</p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
              {techStack.map((tech, idx) => (
                <Card key={idx} className="p-5 bg-card border border-border shadow-sm rounded-xl space-y-2.5">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                      {tech.role}
                    </span>
                    <h4 className="text-sm font-bold text-foreground pt-1">{tech.title}</h4>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-normal">{tech.desc}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA / Action Card */}
          <Card className="p-8 sm:p-10 bg-secondary/35 border border-border/85 rounded-2xl shadow-sm text-center space-y-5">
            <div className="max-w-xl mx-auto space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold">Ready to build your next design?</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Experience our custom prompt engine. Select a template or write your requirements from scratch.
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-5 h-10 rounded-lg">
                <Link to="/generate">Create Flyer</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="hover:bg-secondary px-5 h-10 rounded-lg border-border">
                <Link to="/">Go Home</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
