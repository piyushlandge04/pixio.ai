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
      <section className="pt-20 pb-12 px-4 min-h-[calc(100vh-4rem)] flex items-center">
        <div className="container max-w-6xl mx-auto text-center w-full">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 animate-pulse">
            <Sparkles className="w-6 h-6 text-primary animate-in fade-in scale-in duration-1000 delay-300" />
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Design Flyers
            </span>
            <br />
            <span className="text-foreground">with AI Magic</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Transform your ideas into stunning, professional flyers in seconds. 
            Just describe what you need, and let AI handle the design.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 mb-8">
            <Link to="/generate">
              <Button size="lg" className="px-6 py-5 shadow-glow hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95">
                <Wand2 className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                Start Creating
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="px-6 py-5 border-2 hover:scale-105 transition-all duration-300 active:scale-95">
                Learn More
              </Button>
            </Link>
          </div>
          
          {/* Quick Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400">
            <Card className="p-6 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 hover:scale-105 border-2">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 mx-auto transition-transform duration-300 hover:rotate-12 hover:scale-110">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Generate flyers in seconds
              </p>
            </Card>

            <Card className="p-6 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 hover:scale-105 border-2">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-3 mx-auto transition-transform duration-300 hover:rotate-12 hover:scale-110">
                <Palette className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-bold mb-2">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">
                Advanced design algorithms
              </p>
            </Card>

            <Card className="p-6 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 hover:scale-105 border-2">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-3 mx-auto transition-transform duration-300 hover:rotate-12 hover:scale-110">
                <Download className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold mb-2">Instant Download</h3>
              <p className="text-sm text-muted-foreground">
                High-quality, print-ready
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
            Why Choose FlyerAI?
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Powerful features that make flyer design effortless
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
...
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
                FlyerAI
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
              © 2025 FlyerAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
