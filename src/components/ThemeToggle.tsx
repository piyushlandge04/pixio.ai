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
      className="relative w-10 h-10 p-0 rounded-full overflow-hidden group hover:bg-accent/50 transition-all duration-300"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Background glow effect */}
      <div 
        className={`absolute inset-0 rounded-full transition-all duration-500 ${
          isDark 
            ? "bg-gradient-to-br from-neon-purple/20 to-neon-blue/20" 
            : "bg-gradient-to-br from-amber-200/30 to-orange-200/30"
        }`}
      />
      
      {/* Sun icon */}
      <Sun 
        className={`absolute h-5 w-5 transition-all duration-500 ease-out ${
          isDark 
            ? "rotate-90 scale-0 opacity-0" 
            : "rotate-0 scale-100 opacity-100 text-amber-500"
        }`}
      />
      
      {/* Moon icon */}
      <Moon 
        className={`absolute h-5 w-5 transition-all duration-500 ease-out ${
          isDark 
            ? "rotate-0 scale-100 opacity-100 text-neon-purple" 
            : "-rotate-90 scale-0 opacity-0"
        }`}
      />
      
      {/* Hover glow ring */}
      <div 
        className={`absolute inset-0 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 ${
          isDark 
            ? "ring-2 ring-neon-purple/50 shadow-[0_0_15px_hsl(var(--neon-purple)/0.3)]" 
            : "ring-2 ring-amber-400/50 shadow-[0_0_15px_hsl(45_100%_50%/0.3)]"
        }`}
      />
    </Button>
  );
};