"use client";

import React, { forwardRef, useEffect, useState } from "react";

export interface ShineFxProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Sweep duration in milliseconds. Was seconds until 2.0. */
  speed?: number;
  disabled?: boolean;
  inverse?: boolean;
  baseOpacity?: number;
  reducedMotion?: boolean | "auto";
  children?: React.ReactNode;
}

export const useReducedMotion = (reducedMotion: boolean | "auto" = "auto") => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || reducedMotion !== "auto") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener?.("change", handler);
    return () => mediaQuery.removeEventListener?.("change", handler);
  }, [reducedMotion]);

  const shouldAnimate =
    reducedMotion === false
      ? true
      : reducedMotion === true
      ? false
      : !prefersReducedMotion;

  return { shouldAnimate };
};

const ShineFx = forwardRef<HTMLSpanElement, ShineFxProps>(
  (
    {
      speed = 1200,
      disabled = false,
      inverse = false,
      baseOpacity = 0.35,
      reducedMotion = "auto",
      children,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    const { shouldAnimate } = useReducedMotion(reducedMotion);
    const isDisabled = disabled || !shouldAnimate;
    const animationName = inverse ? "text-shine-reverse" : "text-shine";

    const shineStyle: React.CSSProperties = isDisabled
      ? style || {}
      : {
          backgroundImage: `linear-gradient(110deg, rgba(216, 180, 254, ${baseOpacity}) 0%, rgba(216, 180, 254, ${baseOpacity}) 35%, rgba(255, 255, 255, 1) 50%, rgba(216, 180, 254, ${baseOpacity}) 65%, rgba(216, 180, 254, ${baseOpacity}) 100%)`,
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
          animation: `${animationName} ${speed}ms linear infinite`,
          display: "inline-block",
          ...style,
        };

    return (
      <span
        ref={ref}
        className={`font-semibold tracking-wide ${className}`}
        style={shineStyle}
        {...props}
      >
        {children}
      </span>
    );
  }
);

ShineFx.displayName = "ShineFx";

export { ShineFx };
export default ShineFx;
