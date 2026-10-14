import React from "react";
import { Plane, Compass } from "lucide-react";

interface IOSSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "current" | "amber" | "white" | "slate" | "cyan";
  variant?: "ios" | "travel";
  className?: string;
  label?: string;
}

const sizeMap = {
  xs: "w-3.5 h-3.5",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-7 h-7",
  xl: "w-9 h-9",
};

const colorMap = {
  current: "text-current",
  amber: "text-amber-500",
  white: "text-white",
  slate: "text-slate-400",
  cyan: "text-cyan-500",
};

export default function IOSSpinner({
  size = "md",
  color = "current",
  variant = "ios",
  className = "",
  label,
}: IOSSpinnerProps) {
  const sizeClass = sizeMap[size];
  const colorClass = colorMap[color];

  if (variant === "travel") {
    return (
      <div className={`inline-flex items-center gap-2 select-none ${className}`}>
        <div className={`relative ${sizeClass} flex items-center justify-center`}>
          {/* iOS circular track */}
          <div className="absolute inset-0 rounded-full border border-dashed border-amber-400/60 animate-spin [animation-duration:3s]" />
          <Plane className="w-2.5 h-2.5 text-amber-500 rotate-45 animate-pulse" />
        </div>
        {label && <span className="text-xs font-semibold text-slate-500">{label}</span>}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <svg
        className={`animate-spin ${sizeClass} ${colorClass}`}
        style={{
          animationDuration: "0.85s",
          animationTimingFunction: "steps(12, end)",
        }}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={label || "Loading"}
      >
        <rect x="11" y="1.5" width="2" height="4.5" rx="1" fill="currentColor" opacity="1.0" />
        <rect
          x="11"
          y="1.5"
          width="2"
          height="4.5"
          rx="1"
          fill="currentColor"
          opacity="0.92"
          transform="rotate(30 12 12)"
        />
        <rect
          x="11"
          y="1.5"
          width="2"
          height="4.5"
          rx="1"
          fill="currentColor"
          opacity="0.84"
          transform="rotate(60 12 12)"
        />
        <rect
          x="11"
          y="1.5"
          width="2"
          height="4.5"
          rx="1"
          fill="currentColor"
          opacity="0.76"
          transform="rotate(90 12 12)"
        />
        <rect
          x="11"
          y="1.5"
          width="2"
          height="4.5"
          rx="1"
          fill="currentColor"
          opacity="0.68"
          transform="rotate(120 12 12)"
        />
        <rect
          x="11"
          y="1.5"
          width="2"
          height="4.5"
          rx="1"
          fill="currentColor"
          opacity="0.6"
          transform="rotate(150 12 12)"
        />
        <rect
          x="11"
          y="1.5"
          width="2"
          height="4.5"
          rx="1"
          fill="currentColor"
          opacity="0.52"
          transform="rotate(180 12 12)"
        />
        <rect
          x="11"
          y="1.5"
          width="2"
          height="4.5"
          rx="1"
          fill="currentColor"
          opacity="0.44"
          transform="rotate(210 12 12)"
        />
        <rect
          x="11"
          y="1.5"
          width="2"
          height="4.5"
          rx="1"
          fill="currentColor"
          opacity="0.36"
          transform="rotate(240 12 12)"
        />
        <rect
          x="11"
          y="1.5"
          width="2"
          height="4.5"
          rx="1"
          fill="currentColor"
          opacity="0.28"
          transform="rotate(270 12 12)"
        />
        <rect
          x="11"
          y="1.5"
          width="2"
          height="4.5"
          rx="1"
          fill="currentColor"
          opacity="0.2"
          transform="rotate(300 12 12)"
        />
        <rect
          x="11"
          y="1.5"
          width="2"
          height="4.5"
          rx="1"
          fill="currentColor"
          opacity="0.12"
          transform="rotate(330 12 12)"
        />
      </svg>
      {label && <span className="text-xs font-semibold text-slate-500">{label}</span>}
    </div>
  );
}
