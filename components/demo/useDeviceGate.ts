"use client";

import { useEffect, useState } from "react";

export type GateState = "checking" | "phone" | "blocked";

/**
 * useDeviceGate — decides whether the demo should run on this device.
 * Passes only on portrait, touch-first, narrow viewports (a real phone).
 * Returns "checking" until mounted to keep SSR and first paint stable.
 */
export function useDeviceGate(): GateState {
  const [state, setState] = useState<GateState>("checking");

  useEffect(() => {
    const evaluate = () => {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const narrow = window.matchMedia("(max-width: 640px)").matches;
      const portrait = window.matchMedia("(orientation: portrait)").matches;
      setState(coarse && narrow && portrait ? "phone" : "blocked");
    };

    evaluate();
    const mqls = [
      window.matchMedia("(pointer: coarse)"),
      window.matchMedia("(max-width: 640px)"),
      window.matchMedia("(orientation: portrait)"),
    ];
    mqls.forEach((m) => m.addEventListener("change", evaluate));
    return () => mqls.forEach((m) => m.removeEventListener("change", evaluate));
  }, []);

  return state;
}
