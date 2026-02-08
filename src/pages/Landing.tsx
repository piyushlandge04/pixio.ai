import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wand2, Sparkles, Download, Palette } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const Landing = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Simplified Background - reduced opacity and removed heavy gradients */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10 pointer-events-none"></div>
      
      {/* Simplified Orbs - reduced blur for better performance */}
      <div className="fixed top-20 left-20 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-20 right-20 w-72 h-72 bg-neon-purple/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-full mb-4 sm:mb-6 border-2 border-neon-cyan/30">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-neon-cyan" />
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
              Design Flyers
            </span>
            <br />
            <span className="text-foreground">with AI Magic</span>
          </h1>
          
          <p className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-10 px-4">
            Transform your ideas into stunning, professional flyers in seconds. 
            Just describe what you need, and let AI handle the design.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
            <Button asChild size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/90 hover:to-neon-purple/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-neon-cyan/50">
              <Link to="/generate">
                <Wand2 className="mr-2 h-5 w-5" />
                Start Creating
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 border-2 border-neon-purple/50 hover:bg-neon-purple/10 hover:border-neon-purple hover:scale-105 transition-all duration-200 active:scale-95">
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-12 sm:py-20 px-4 bg-muted/5">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4">
            Why Choose PIYUSH.AI?
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground text-center mb-8 sm:mb-16 max-w-2xl mx-auto px-4">
            Powerful features that make flyer design effortless
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-8 max-w-4xl mx-auto">
            <Card className="p-6 sm:p-8 bg-card/80 border-2 border-neon-purple/30 hover:border-neon-purple hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 rounded-xl flex items-center justify-center mb-4 sm:mb-6 border border-neon-purple/30">
                <Palette className="w-6 h-6 sm:w-7 sm:h-7 text-neon-purple" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">AI-Powered Design</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Advanced AI understands your requirements and creates visually 
                stunning designs with perfect color schemes and layouts.
              </p>
            </Card>

            <Card className="p-6 sm:p-8 bg-card/80 border-2 border-neon-pink/30 hover:border-neon-pink hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 rounded-xl flex items-center justify-center mb-4 sm:mb-6 border border-neon-pink/30">
                <Download className="w-6 h-6 sm:w-7 sm:h-7 text-neon-pink" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Instant Download</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Get high-quality, print-ready flyers instantly. Download in 
                multiple formats and use them anywhere you need.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-6 sm:py-8 border-accent">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-4 sm:gap-6 text-center md:flex-row md:justify-between md:text-left">
            <div className="flex items-center gap-2 font-bold text-xl">
              <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
                <Wand2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                PIYUSH.AI
              </span>
            </div>
            
            <div className="flex items-center gap-6 sm:gap-8">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                Home
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                About
              </Link>
              <Link to="/generate" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                Generate
              </Link>
            </div>
            
            <p className="text-xs sm:text-sm text-muted-foreground">
              © 2025 PIYUSH.AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
