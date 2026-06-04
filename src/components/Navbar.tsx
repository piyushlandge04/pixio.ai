import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Wand2, LogOut, History as HistoryIcon, Shield, User, Menu } from "lucide-react";
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
        className={`text-sm font-medium transition-colors hover:text-foreground ${
          mobile 
            ? 'block py-2.5 px-4 hover:bg-secondary rounded-lg' 
            : ''
        } ${isActive("/") ? "text-primary" : "text-muted-foreground"}`}
      >
        Home
      </Link>
      <Link 
        to="/about" 
        onClick={mobile ? closeSheet : undefined}
        className={`text-sm font-medium transition-colors hover:text-foreground ${
          mobile 
            ? 'block py-2.5 px-4 hover:bg-secondary rounded-lg' 
            : ''
        } ${isActive("/about") ? "text-primary" : "text-muted-foreground"}`}
      >
        About
      </Link>
      {user ? (
        <>
          <Link 
            to="/generate" 
            onClick={mobile ? closeSheet : undefined}
            className={`text-sm font-medium transition-colors hover:text-foreground ${
              mobile 
                ? 'block py-2.5 px-4 hover:bg-secondary rounded-lg' 
                : ''
            } ${isActive("/generate") ? "text-primary" : "text-muted-foreground"}`}
          >
            Generate
          </Link>
          <Link 
            to="/history" 
            onClick={mobile ? closeSheet : undefined}
            className={`text-sm font-medium transition-colors hover:text-foreground flex items-center gap-1.5 ${
              mobile 
                ? 'py-2.5 px-4 hover:bg-secondary rounded-lg' 
                : ''
            } ${isActive("/history") ? "text-primary" : "text-muted-foreground"}`}
          >
            <HistoryIcon className="w-4 h-4" />
            History
          </Link>
          <Link 
            to="/profile" 
            onClick={mobile ? closeSheet : undefined}
            className={`text-sm font-medium transition-colors hover:text-foreground flex items-center gap-1.5 ${
              mobile 
                ? 'py-2.5 px-4 hover:bg-secondary rounded-lg' 
                : ''
            } ${isActive("/profile") ? "text-primary" : "text-muted-foreground"}`}
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
          {isAdmin && (
            <Link 
              to="/admin" 
              onClick={mobile ? closeSheet : undefined}
              className={`text-sm font-medium transition-colors hover:text-foreground flex items-center gap-1.5 ${
                mobile 
                  ? 'py-2.5 px-4 hover:bg-secondary rounded-lg' 
                  : ''
              } ${isActive("/admin") ? "text-primary" : "text-muted-foreground"}`}
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-md border-b border-border/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-xl group">
          <div className="p-1.5 bg-primary/10 rounded-lg text-primary transition-all duration-300 group-hover:bg-primary/20">
            <Wand2 className="w-5 h-5" />
          </div>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
            PIYUSH.AI
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
          <div className="w-[1px] h-4 bg-border/85" />
          <ThemeToggle />
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-secondary">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm px-4">
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-secondary">
                <Menu className="h-5 w-5 text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background border-l border-border">
              <div className="flex flex-col h-full pt-8">
                <div className="flex items-center gap-2.5 mb-8 px-4">
                  <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
                    PIYUSH.AI
                  </span>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <NavLinks mobile />
                </div>

                <div className="mt-auto pb-8 px-4 space-y-3">
                  {user ? (
                    <Button 
                      variant="outline" 
                      className="w-full hover:bg-secondary" 
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  ) : (
                    <Link to="/auth" className="block w-full" onClick={closeSheet}>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
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
