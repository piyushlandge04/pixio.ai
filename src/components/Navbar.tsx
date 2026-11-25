import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LogOut,
  History as HistoryIcon,
  User,
  Menu,
  Sparkles,
  ArrowRight,
  Home as HomeIcon,
  Info,
  Wand2,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Logo } from "@/components/Logo";

const NAV_LINKS = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/generate", label: "Studio", icon: Sparkles },
  { to: "/history", label: "History", icon: HistoryIcon },
  { to: "/about", label: "About", icon: Info },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && session.user.email !== "guest@pixio.ai") {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && session.user.email !== "guest@pixio.ai") {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to logout");
    } else {
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/");
      setIsOpen(false);
    }
  };

  const closeSheet = () => setIsOpen(false);

  const userInitial = user?.user_metadata?.full_name
    ? String(user.user_metadata.full_name).charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 pt-3 pointer-events-none">
      <div
        className={`pointer-events-auto max-w-6xl mx-auto h-14 px-4 sm:px-5 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300 ${
          isScrolled
            ? "bg-background/90 backdrop-blur-xl border border-border/90 shadow-[0_10px_35px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.45)]"
            : "bg-background/75 backdrop-blur-lg border border-border/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
        }`}
      >
        {/* Left: New Brand Logo */}
        <div className="flex items-center shrink-0">
          <Logo withLink size="md" />
        </div>

        {/* Center: Clean Architectural Nav Links with Active Indicator */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  active
                    ? "text-foreground bg-secondary/80"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                {item.to === "/generate" && (
                  <Sparkles className={`w-3.5 h-3.5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                )}
                <span>{item.label}</span>
                {active && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Theme + Account Actions */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <ThemeToggle />

          <div className="h-4 w-px bg-border/70 mx-0.5" />

          {user ? (
            <div className="flex items-center gap-2">
              <Button
                asChild
                size="sm"
                className="h-9 px-4 rounded-xl bg-foreground hover:bg-foreground/90 text-background font-bold text-xs shadow-xs transition-all hover:scale-[1.02] gap-1.5"
              >
                <Link to="/generate">
                  <Wand2 className="w-3.5 h-3.5" />
                  Create Flyer
                </Link>
              </Button>

              <Link
                to="/profile"
                className={`h-9 pl-1.5 pr-3 rounded-xl border transition-all flex items-center gap-2 text-xs font-semibold ${
                  isActive("/profile")
                    ? "border-foreground/50 bg-secondary text-foreground"
                    : "border-border/80 bg-card/80 hover:bg-secondary text-foreground/90"
                }`}
                title="Profile & Account"
              >
                <span className="w-6 h-6 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-[11px]">
                  {userInitial}
                </span>
                <span className="hidden lg:inline max-w-[90px] truncate">
                  {user.user_metadata?.full_name || "Profile"}
                </span>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-9 px-3.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              >
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="h-9 px-4 rounded-xl bg-foreground hover:bg-foreground/90 text-background font-bold text-xs shadow-sm transition-all hover:scale-[1.02] gap-1.5"
              >
                <Link to="/generate">
                  Start Creating
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl border-border/80 bg-card/80 hover:bg-secondary"
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4 text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[290px] bg-background border-l border-border p-6 flex flex-col justify-between">
              <div className="space-y-6 pt-2">
                <div onClick={closeSheet} className="pb-4 border-b border-border/60">
                  <Logo withLink size="md" showTagline />
                </div>

                <nav className="flex flex-col gap-1.5">
                  {NAV_LINKS.map((item) => {
                    const IconComp = item.icon;
                    const active = isActive(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={closeSheet}
                        className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2.5 ${
                          active
                            ? "bg-foreground text-background shadow-xs"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                        {item.label}
                      </Link>
                    );
                  })}

                  {user && (
                    <Link
                      to="/profile"
                      onClick={closeSheet}
                      className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2.5 ${
                        isActive("/profile")
                          ? "bg-foreground text-background shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  )}
                </nav>
              </div>

              {/* Mobile Bottom Actions */}
              <div className="pt-6 border-t border-border/70 space-y-2.5">
                <Button
                  asChild
                  className="w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold text-xs shadow-sm gap-1.5"
                >
                  <Link to="/generate" onClick={closeSheet}>
                    <Wand2 className="w-3.5 h-3.5" />
                    Start Creating
                  </Link>
                </Button>
                {user ? (
                  <Button
                    variant="outline"
                    className="w-full h-10 rounded-xl text-xs gap-1.5 border-border font-semibold"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-10 rounded-xl text-xs font-semibold border-border"
                  >
                    <Link to="/auth" onClick={closeSheet}>
                      Sign in / Register
                    </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
