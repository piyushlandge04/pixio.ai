import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wand2, Sparkles, Zap, Download, Palette } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { memo } from "react";

// Memoized feature card for performance
const FeatureCard = memo(({ icon: Icon, title, description, colorClass }: {
  icon: React.ElementType;
  title: string;
  description: string;
  colorClass: string;
}) => (
  <Card className={`p-6 sm:p-8 bg-card/90 border ${colorClass} hover:neon-glow-purple transition-shadow duration-200`}>
    <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-muted rounded-xl flex items-center justify-center mb-4 sm:mb-6 neon-border`}>
      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
    </div>
    <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">{title}</h3>
    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{description}</p>
  </Card>
));

FeatureCard.displayName = "FeatureCard";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section - No heavy backgrounds */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-primary/10 rounded-full mb-4 sm:mb-6 neon-border">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent neon-text-purple">
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
            <Button asChild size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-primary hover:bg-primary/90 neon-glow-purple">
              <Link to="/generate">
                <Wand2 className="mr-2 h-5 w-5" />
                Start Creating
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 neon-border-cyan hover:neon-glow-cyan">
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4">
            Why Choose PIYUSH.AI?
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground text-center mb-8 sm:mb-16 max-w-2xl mx-auto px-4">
            Powerful features that make flyer design effortless
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Generate professional flyers in seconds. No design experience needed, just describe your vision and watch it come to life."
              colorClass="border-primary/30 hover:border-primary"
            />
            <FeatureCard
              icon={Palette}
              title="AI-Powered Design"
              description="Advanced AI understands your requirements and creates visually stunning designs with perfect color schemes and layouts."
              colorClass="border-secondary/30 hover:border-secondary"
            />
            <FeatureCard
              icon={Download}
              title="Instant Download"
              description="Get high-quality, print-ready flyers instantly. Download in multiple formats and use them anywhere you need."
              colorClass="border-accent/30 hover:border-accent sm:col-span-2 lg:col-span-1"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-4 py-6 sm:py-8">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-4 sm:gap-6 text-center md:flex-row md:justify-between md:text-left">
            <div className="flex items-center gap-2 font-bold text-xl">
              <div className="p-2 bg-primary rounded-lg neon-glow-purple">
                <Wand2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent neon-text-purple">
                PIYUSH.AI
              </span>
            </div>
            
            <div className="flex items-center gap-6 sm:gap-8">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                About
              </Link>
              <Link to="/generate" className="text-sm text-muted-foreground hover:text-foreground">
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
