import { useEffect, useRef, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

type AnimationVariant = "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-in" | "fade";

interface ScrollRevealProps {
  children: ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
}

const VARIANT_HIDDEN_CLASSES: Record<AnimationVariant, string> = {
  "fade-up": "opacity-0 translate-y-7",
  "fade-down": "opacity-0 -translate-y-7",
  "fade-left": "opacity-0 translate-x-7",
  "fade-right": "opacity-0 -translate-x-7",
  "zoom-in": "opacity-0 scale-95",
  "fade": "opacity-0",
};

const VARIANT_VISIBLE_CLASSES: Record<AnimationVariant, string> = {
  "fade-up": "opacity-100 translate-y-0",
  "fade-down": "opacity-100 translate-y-0",
  "fade-left": "opacity-100 translate-x-0",
  "fade-right": "opacity-100 translate-x-0",
  "zoom-in": "opacity-100 scale-100",
  "fade": "opacity-100",
};

export const ScrollReveal = ({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 650,
  threshold = 0.12,
  once = true,
  className,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Respect user's reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, once]);

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={cn(
        "transition-all will-change-transform motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100",
        isVisible ? VARIANT_VISIBLE_CLASSES[variant] : VARIANT_HIDDEN_CLASSES[variant],
        className
      )}
    >
      {children}
    </div>
  );
};
