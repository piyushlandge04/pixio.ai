import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, memo, useCallback } from "react";
import { Wand2, LogOut, History as HistoryIcon, Shield, User, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

// Memoized nav link for better performance
const NavLink = memo(({ to, isActive, children, onClick, mobile = false }: {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  mobile?: boolean;
}) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`text-sm font-medium ${
      mobile ? 'block py-3 px-4 hover:bg-muted rounded-lg' : ''
    } ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
  >
    {children}
  </Link>
));

NavLink.displayName = "NavLink";

export const Navbar = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    } catch {
      setIsAdmin(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to logout");
    } else {
      toast.success("Logged out successfully");
      navigate("/");
      setIsOpen(false);
    }
  };

  const closeSheet = useCallback(() => setIsOpen(false), []);

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <NavLink to="/" isActive={isActive("/")} onClick={mobile ? closeSheet : undefined} mobile={mobile}>
        Home
      </NavLink>
      <NavLink to="/about" isActive={isActive("/about")} onClick={mobile ? closeSheet : undefined} mobile={mobile}>
        About
      </NavLink>
      {user && (
        <>
          <NavLink to="/generate" isActive={isActive("/generate")} onClick={mobile ? closeSheet : undefined} mobile={mobile}>
            Generate
          </NavLink>
          <NavLink to="/history" isActive={isActive("/history")} onClick={mobile ? closeSheet : undefined} mobile={mobile}>
            <span className="flex items-center gap-1">
              <HistoryIcon className="w-4 h-4" />
              History
            </span>
          </NavLink>
          <NavLink to="/profile" isActive={isActive("/profile")} onClick={mobile ? closeSheet : undefined} mobile={mobile}>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              Profile
            </span>
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" isActive={isActive("/admin")} onClick={mobile ? closeSheet : undefined} mobile={mobile}>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Admin
              </span>
            </NavLink>
          )}
        </>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="p-2 bg-primary rounded-lg">
            <Wand2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            PIYUSH.AI
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
          {user ? (
            <>
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Link to="/auth">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
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
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background border-l border-border">
              <div className="flex flex-col h-full pt-8">
                <div className="flex items-center gap-2 mb-8 px-4">
                  <div className="p-2 bg-primary rounded-lg">
                    <Wand2 className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
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
                      className="w-full" 
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  ) : (
                    <Link to="/auth" onClick={closeSheet}>
                      <Button className="w-full bg-primary hover:bg-primary/90">
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
});

Navbar.displayName = "Navbar";
