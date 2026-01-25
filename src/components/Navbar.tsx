import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Wand2, LogOut, History as HistoryIcon, Shield, User, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      }
    });

    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    const {
      data
    } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").single();
    setIsAdmin(!!data);
  };

  const handleLogout = async () => {
    const {
      error
    } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to logout");
    } else {
      toast.success("Logged out successfully");
      navigate("/");
      setIsOpen(false);
    }
  };

  const closeSheet = () => setIsOpen(false);

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <Link 
        to="/" 
        onClick={mobile ? closeSheet : undefined}
        className={`text-sm font-medium transition-all hover:text-neon-cyan ${mobile ? 'block py-3 px-4 hover:bg-neon-cyan/10 rounded-lg' : 'hover:scale-110'} ${isActive("/") ? "text-neon-cyan" : "text-muted-foreground"}`}
      >
        Home
      </Link>
      <Link 
        to="/about" 
        onClick={mobile ? closeSheet : undefined}
        className={`text-sm font-medium transition-all hover:text-neon-cyan ${mobile ? 'block py-3 px-4 hover:bg-neon-cyan/10 rounded-lg' : 'hover:scale-110'} ${isActive("/about") ? "text-neon-cyan" : "text-muted-foreground"}`}
      >
        About
      </Link>
      {user ? (
        <>
          <Link 
            to="/generate" 
            onClick={mobile ? closeSheet : undefined}
            className={`text-sm font-medium transition-all hover:text-neon-purple ${mobile ? 'block py-3 px-4 hover:bg-neon-purple/10 rounded-lg' : 'hover:scale-110'} ${isActive("/generate") ? "text-neon-purple" : "text-muted-foreground"}`}
          >
            Generate
          </Link>
          <Link 
            to="/history" 
            onClick={mobile ? closeSheet : undefined}
            className={`text-sm font-medium transition-all hover:text-neon-purple flex items-center gap-1 ${mobile ? 'py-3 px-4 hover:bg-neon-purple/10 rounded-lg' : 'hover:scale-110'} ${isActive("/history") ? "text-neon-purple" : "text-muted-foreground"}`}
          >
            <HistoryIcon className="w-4 h-4" />
            History
          </Link>
          <Link 
            to="/profile" 
            onClick={mobile ? closeSheet : undefined}
            className={`text-sm font-medium transition-all hover:text-neon-purple flex items-center gap-1 ${mobile ? 'py-3 px-4 hover:bg-neon-purple/10 rounded-lg' : 'hover:scale-110'} ${isActive("/profile") ? "text-neon-purple" : "text-muted-foreground"}`}
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
          {isAdmin && (
            <Link 
              to="/admin" 
              onClick={mobile ? closeSheet : undefined}
              className={`text-sm font-medium transition-all hover:text-neon-pink flex items-center gap-1 ${mobile ? 'py-3 px-4 hover:bg-neon-pink/10 rounded-lg' : 'hover:scale-110'} ${isActive("/admin") ? "text-neon-pink" : "text-muted-foreground"}`}
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          )}
        </>
      ) : null}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-neon-cyan/20 shadow-[0_4px_20px_-4px_hsl(var(--neon-cyan)/0.1)]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl group">
          <div className="p-2 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-lg border border-neon-cyan/30 transition-all duration-300 group-hover:shadow-[0_0_20px_-5px_hsl(var(--neon-cyan)/0.6)] group-hover:scale-110">
            <Wand2 className="w-5 h-5 text-neon-cyan" />
          </div>
          <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
            PIYUSH.AI
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
          {user ? (
            <>
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-neon-purple/10 hover:text-neon-purple">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Link to="/auth">
                <Button size="sm" className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/90 hover:to-neon-purple/90 shadow-[0_0_20px_-5px_hsl(var(--neon-cyan)/0.6)] border border-neon-cyan/50 text-primary-foreground bg-primary">
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-neon-cyan/10">
                <Menu className="h-6 w-6 text-neon-cyan" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background/95 backdrop-blur-xl border-l border-neon-cyan/20">
              <div className="flex flex-col h-full pt-8">
                <div className="flex items-center gap-2 mb-8 px-4">
                  <div className="p-2 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-lg border border-neon-cyan/30">
                    <Wand2 className="w-5 h-5 text-neon-cyan" />
                  </div>
                  <span className="font-bold text-xl bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
                    PIYUSH.AI
                  </span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <NavLinks mobile />
                </div>

                <div className="mt-auto pb-8 px-4 space-y-3">
                  {user ? (
                    <Button 
                      variant="outline" 
                      className="w-full border-neon-purple/50 hover:bg-neon-purple/10 hover:text-neon-purple" 
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  ) : (
                    <Link to="/auth" onClick={closeSheet}>
                      <Button className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/90 hover:to-neon-purple/90 shadow-[0_0_20px_-5px_hsl(var(--neon-cyan)/0.6)] border border-neon-cyan/50">
                        Login
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
