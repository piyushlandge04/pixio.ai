import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wand2, Sparkles, Zap, Download, Palette, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 animate-pulse">
            <Sparkles className="w-8 h-8 text-primary animate-in fade-in scale-in duration-1000 delay-300" />
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Design Flyers
            </span>
            <br />
            <span className="text-foreground">with AI Magic</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Transform your ideas into stunning, professional flyers in seconds. 
            Just describe what you need, and let AI handle the design.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <Link to="/generate">
              <Button size="lg" className="text-lg px-8 py-6 shadow-glow hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95">
                <Wand2 className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                Start Creating
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-2 hover:scale-105 transition-all duration-300 active:scale-95">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Why Choose PIYUSH.AI?
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            Powerful features that make flyer design effortless
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 hover:scale-105 border-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 hover:rotate-12 hover:scale-110">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">
                Generate professional flyers in seconds. No design experience needed, 
                just describe your vision and watch it come to life.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 hover:scale-105 border-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 hover:rotate-12 hover:scale-110">
                <Palette className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">AI-Powered Design</h3>
              <p className="text-muted-foreground leading-relaxed">
                Advanced AI understands your requirements and creates visually 
                stunning designs with perfect color schemes and layouts.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 hover:scale-105 border-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 hover:rotate-12 hover:scale-110">
                <Download className="w-7 h-7 text-accent" />
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
