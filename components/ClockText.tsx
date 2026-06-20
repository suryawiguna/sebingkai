"use client";

import { useEffect, useState } from "react";

// Live countdown timecode used inside the camera screen.
export function ClockText({ start, className = "" }: { start: number; className?: string }) {
  const [t, setT] = useState(start);
  useEffect(() => {
    const id = setInterval(() => setT((v) => (v > 0 ? v - 1 : start)), 1000);
    return () => clearInterval(id);
  }, [start]);
  const h = String(Math.floor(t / 3600)).padStart(2, "0");
  const m = String(Math.floor((t % 3600) / 60)).padStart(2, "0");
  const s = String(t % 60).padStart(2, "0");
  return <span className={className}>{`${h} : ${m} : ${s}`}</span>;
}
