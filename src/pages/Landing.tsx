import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wand2, Sparkles, Zap, Download, Palette, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const Landing = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20"></div>
      
      {/* Animated Glowing Orbs */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[120px] animate-float"></div>
      <div className="fixed bottom-20 right-20 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }}></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-pink/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: "4s" }}></div>
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-full mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 border-2 border-neon-cyan/30 animate-glow-pulse">
            <Sparkles className="w-8 h-8 text-neon-cyan animate-neon-glow" />
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
            <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
              Design Flyers
            </span>
            <br />
            <span className="text-foreground">with AI Magic</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Transform your ideas into stunning, professional flyers in seconds. 
            Just describe what you need, and let AI handle the design.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/90 hover:to-neon-purple/90 shadow-[0_0_30px_-5px_hsl(var(--neon-cyan)/0.6)] hover:shadow-[0_0_50px_-5px_hsl(var(--neon-cyan)/0.8)] transition-all duration-300 hover:scale-110 active:scale-95 border border-neon-cyan/50">
              <Link to="/generate">
                <Wand2 className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                Start Creating
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-2 border-neon-purple/50 hover:bg-neon-purple/10 hover:border-neon-purple hover:scale-105 transition-all duration-300 active:scale-95 hover:shadow-[0_0_20px_-5px_hsl(var(--neon-purple)/0.5)]">
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 bg-muted/10 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Why Choose PIYUSH.AI?
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            Powerful features that make flyer design effortless
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-2 border-neon-cyan/30 hover:border-neon-cyan hover:shadow-[0_0_30px_-5px_hsl(var(--neon-cyan)/0.5)] transition-all duration-300 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
              <div className="w-14 h-14 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-xl flex items-center justify-center mb-6 border border-neon-cyan/30 transition-all duration-300 hover:rotate-12 hover:scale-110 hover:shadow-[0_0_20px_-5px_hsl(var(--neon-cyan)/0.6)]">
                <Zap className="w-7 h-7 text-neon-cyan" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">
                Generate professional flyers in seconds. No design experience needed, 
                just describe your vision and watch it come to life.
              </p>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur-sm border-2 border-neon-purple/30 hover:border-neon-purple hover:shadow-[0_0_30px_-5px_hsl(var(--neon-purple)/0.5)] transition-all duration-300 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              <div className="w-14 h-14 bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 rounded-xl flex items-center justify-center mb-6 border border-neon-purple/30 transition-all duration-300 hover:rotate-12 hover:scale-110 hover:shadow-[0_0_20px_-5px_hsl(var(--neon-purple)/0.6)]">
                <Palette className="w-7 h-7 text-neon-purple" />
              </div>
              <h3 className="text-2xl font-bold mb-3">AI-Powered Design</h3>
              <p className="text-muted-foreground leading-relaxed">
                Advanced AI understands your requirements and creates visually 
                stunning designs with perfect color schemes and layouts.
              </p>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur-sm border-2 border-neon-pink/30 hover:border-neon-pink hover:shadow-[0_0_30px_-5px_hsl(var(--neon-pink)/0.5)] transition-all duration-300 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              <div className="w-14 h-14 bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 rounded-xl flex items-center justify-center mb-6 border border-neon-pink/30 transition-all duration-300 hover:rotate-12 hover:scale-110 hover:shadow-[0_0_20px_-5px_hsl(var(--neon-pink)/0.6)]">
                <Download className="w-7 h-7 text-neon-pink" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Instant Download</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get high-quality, print-ready flyers instantly. Download in 
                multiple formats and use them anywhere you need.
              </p>
            </Card>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 font-bold text-xl hover:scale-105 transition-transform duration-300">
              <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg transition-transform duration-300 hover:rotate-12">
                <Wand2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                PIYUSH.AI
              </span>
            </div>
            
            <div className="flex items-center gap-8">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110">
                Home
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110">
                About
              </Link>
              <Link to="/generate" className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110">
                Generate
              </Link>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2025 PIYUSH.AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
