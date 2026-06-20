"use client";

import { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
};

// Scroll-reveal: fades/rises in when it enters view. Guaranteed to end visible
// (fallback timer) so print/export never gets stuck.
export function Reveal({ children, delay = 0, className = "", style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("rv-show");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("rv-show");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    const t = setTimeout(() => el.classList.add("rv-show"), 1400);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <div ref={ref} className={`rv ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}
