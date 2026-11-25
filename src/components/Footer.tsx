import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Wand2, 
  ArrowRight, 
  Sparkles, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  ArrowUp, 
  CheckCircle2, 
  ShieldCheck, 
  Layers,
  Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsSubscribed(true);
    toast.success("Thank you for subscribing to PIXIO creative updates!");
    setEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full border-t border-border/80 bg-card/60 backdrop-blur-md text-foreground transition-colors relative z-10">
      {/* Upper Newsletter & Value Section */}
      <div className="border-b border-border/50">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-secondary/40 border border-border/70 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-2 text-center lg:text-left max-w-xl relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Creative Intelligence</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Stay updated with PIXIO model releases
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Receive prompt engineering recipes, new design style releases, and high-res print export features directly to your inbox.
              </p>
            </div>

            {/* Newsletter input */}
            <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex-1 max-w-md relative z-10">
              {isSubscribed ? (
                <div className="flex items-center gap-2 justify-center lg:justify-end text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>You're on the list! Watch for our next drop.</span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 rounded-xl bg-background border-border text-sm focus-visible:ring-1"
                    required
                  />
                  <Button 
                    type="submit" 
                    className="h-11 px-5 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold shrink-0 shadow-sm"
                  >
                    Subscribe
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Links Section */}
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Column 1: Brand Info (Spans 2 cols on desktop) */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Logo withLink size="lg" showTagline />
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary border border-border text-muted-foreground uppercase tracking-wider ml-1">
                v2.4
              </span>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              The modern prompt-driven design engine turning natural ideas into studio-grade, high-resolution flyers and visual marketing assets in seconds.
            </p>

            {/* Status Pill */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                All Systems Operational · Ready
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-border/80 bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-border/80 bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-border/80 bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@pixio.ai"
                className="w-8 h-8 rounded-lg border border-border/80 bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Studio & Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Studio
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link to="/generate" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                  Flyer Generator
                </Link>
              </li>
              <li>
                <Link to="/generate" className="hover:text-foreground transition-colors">
                  AI Revision Loop
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-foreground transition-colors">
                  Design History
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-foreground transition-colors">
                  Usage & Account
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 text-muted-foreground/80">
                  <Printer className="w-3.5 h-3.5" />
                  300 DPI Exports
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Styles & Inspiration */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Design Styles
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link 
                  to="/generate?prompt=A+cyberpunk+DJ+concert+flyer+with+neon+purple+and+cyan+accents" 
                  className="hover:text-foreground transition-colors"
                >
                  Cyberpunk & EDM
                </Link>
              </li>
              <li>
                <Link 
                  to="/generate?prompt=A+minimalist+coffee+shop+flyer+with+warm+cream+background" 
                  className="hover:text-foreground transition-colors"
                >
                  Minimalist Artisanal
                </Link>
              </li>
              <li>
                <Link 
                  to="/generate?prompt=A+modern+corporate+tech+summit+flyer+with+slate+grey+background" 
                  className="hover:text-foreground transition-colors"
                >
                  Modern Corporate
                </Link>
              </li>
              <li>
                <Link 
                  to="/generate?prompt=A+vibrant+summer+sunset+music+festival+flyer" 
                  className="hover:text-foreground transition-colors"
                >
                  Summer Festival
                </Link>
              </li>
              <li>
                <Link 
                  to="/generate?prompt=A+bold+retail+store+grand+opening+promotional+flyer" 
                  className="hover:text-foreground transition-colors"
                >
                  Grand Opening
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform & Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Company
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-foreground transition-colors">
                  About PIXIO
                </Link>
              </li>
              <li>
                <a href="/#about" className="hover:text-foreground transition-colors">
                  Our Mission
                </a>
              </li>
              <li>
                <a href="/#about" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Security & Auth
                </a>
              </li>
              <li>
                <a href="/#faq" className="hover:text-foreground transition-colors">
                  Frequently Asked
                </a>
              </li>
              <li>
                <a href="mailto:support@pixio.ai" className="hover:text-foreground transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Sub-Footer */}
      <div className="border-t border-border/60 bg-background/50">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-center sm:text-left">
            <p>© {new Date().getFullYear()} PIXIO Technologies. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground/80">
              <span className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span>
              <span>·</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</span>
              <span>·</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">Commercial Licensing</span>
            </div>
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-background hover:bg-secondary text-xs font-medium text-foreground transition-all shadow-2xs group"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
