import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

export const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
            <Wand2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            FlyerAI
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/") ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/about") ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            About
          </Link>
          <Link to="/generate">
            <Button size="sm" className="shadow-glow">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
