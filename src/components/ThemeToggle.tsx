import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full">
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 p-0 rounded-lg hover:bg-secondary transition-colors"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Sun icon */}
        <Sun 
          className={`h-5 w-5 transition-all duration-300 ${
            isDark 
              ? "rotate-90 scale-0 opacity-0" 
              : "rotate-0 scale-100 opacity-100 text-amber-500"
          }`}
        />
        
        {/* Moon icon */}
        <Moon 
          className={`absolute h-5 w-5 transition-all duration-300 ${
            isDark 
              ? "rotate-0 scale-100 opacity-100 text-indigo-400" 
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
    </Button>
  );
};