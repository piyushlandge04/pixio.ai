import { Link } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showTagline?: boolean;
  withLink?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: { icon: "w-7 h-7", text: "text-base", tagline: "text-[9px]" },
  md: { icon: "w-9 h-9", text: "text-lg", tagline: "text-[10px]" },
  lg: { icon: "w-11 h-11", text: "text-xl", tagline: "text-[11px]" },
  xl: { icon: "w-14 h-14", text: "text-3xl", tagline: "text-xs" },
};

export const LogoMark = ({ className = "w-9 h-9" }: { className?: string }) => {
  return (
    <div className={`relative shrink-0 flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          {/* Deep architectural slate-obsidian background */}
          <linearGradient id="pixio-new-bg" x1="2" y1="2" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#18181b" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>

          {/* Vibrant Prism Ribbon Gradient */}
          <linearGradient id="pixio-new-prism" x1="10" y1="8" x2="34" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>

          {/* Crisp White/Silver Geometric Plane */}
          <linearGradient id="pixio-new-plane" x1="12" y1="10" x2="30" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>

        {/* Rounded Architectural Badge */}
        <rect
          x="2"
          y="2"
          width="40"
          height="40"
          rx="12"
          fill="url(#pixio-new-bg)"
          stroke="url(#pixio-new-prism)"
          strokeWidth="1.25"
          strokeOpacity="0.45"
        />

        {/* Back Layered Flyer Canvas Frame (Rotated subtle depth) */}
        <rect
          x="12"
          y="10"
          width="19"
          height="24"
          rx="4"
          transform="rotate(-7 21.5 22)"
          fill="url(#pixio-new-prism)"
          fillOpacity="0.22"
          stroke="url(#pixio-new-prism)"
          strokeWidth="1.2"
        />

        {/* Front Architectural 'P' Geometric Cutout */}
        <path
          d="M15 12.5C15 11.6716 15.6716 11 16.5 11H24.5C28.6421 11 32 14.3579 32 18.5C32 22.6421 28.6421 26 24.5 26H19.5V31.5C19.5 32.3284 18.8284 33 18 33H16.5C15.6716 33 15 32.3284 15 31.5V12.5Z"
          fill="url(#pixio-new-plane)"
        />

        {/* Precision Aperture Cutout inside 'P' */}
        <circle cx="23.5" cy="18.5" r="3.4" fill="url(#pixio-new-bg)" />

        {/* Radiant AI Spark Accent */}
        <path
          d="M31.5 9.5C31.5 11.15 32.35 12 34 12C32.35 12 31.5 12.85 31.5 14.5C31.5 12.85 30.65 12 29 12C30.65 12 31.5 11.15 31.5 9.5Z"
          fill="#38bdf8"
        />
      </svg>
    </div>
  );
};

export const Logo = ({
  size = "md",
  showText = true,
  showTagline = false,
  withLink = false,
  className = "",
}: LogoProps) => {
  const sizeStyles = SIZE_MAP[size];

  const content = (
    <div className={`flex items-center gap-2.5 group cursor-pointer select-none ${className}`}>
      <LogoMark className={sizeStyles.icon} />

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1">
            <span className={`font-black tracking-tight text-foreground ${sizeStyles.text} leading-none`}>
              PIXIO
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 self-end mb-0.5" />
          </div>
          {showTagline && (
            <span className={`font-semibold tracking-wider uppercase text-muted-foreground ${sizeStyles.tagline} mt-0.5`}>
              AI-Powered Flyer Generator
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (withLink) {
    return (
      <Link to="/" className="inline-block" aria-label="PIXIO Home">
        {content}
      </Link>
    );
  }

  return content;
};
