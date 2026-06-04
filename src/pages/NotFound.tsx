import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[80px]" />
      </div>

      <div className="text-center relative z-10 space-y-5 max-w-sm">
        <h1 className="text-7xl font-extrabold tracking-tight text-foreground">404</h1>
        <div className="space-y-1">
          <p className="text-lg font-bold text-foreground">Page Not Found</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>
        <div className="pt-2">
          <Button asChild className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 py-5 rounded-xl shadow-sm">
            <Link to="/">
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
