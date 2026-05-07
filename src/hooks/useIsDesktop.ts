"use client";

import { useEffect, useState } from "react";

/**
 * Returns true if viewport is at least 1024px (Tailwind lg breakpoint)
 * AND user has not requested reduced motion AND device is not coarse pointer (touch).
 * Used to gate heavy 3D content to capable desktop devices only.
 */
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => {
      const wide = window.matchMedia("(min-width: 1024px)").matches;
      const finePointer = window.matchMedia("(pointer: fine)").matches;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setIsDesktop(wide && finePointer && !reducedMotion);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isDesktop;
}
