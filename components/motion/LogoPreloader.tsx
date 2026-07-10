"use client"; // first-visit logo drive-by preloader

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SESSION_KEY = "apex-preloader-seen";

export function LogoPreloader() {
  const [phase, setPhase] = useState<"idle" | "run" | "done">("idle");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (seen) {
      setPhase("done");
      return;
    }
    setVisible(true);
    setPhase("run");
    sessionStorage.setItem(SESSION_KEY, "1");

    const finish = window.setTimeout(() => {
      setVisible(false);
      window.setTimeout(() => setPhase("done"), 400);
    }, 2800);

    return () => window.clearTimeout(finish);
  }, []);

  if (phase === "done" || phase === "idle") return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center bg-white transition-opacity duration-400",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      aria-hidden={!visible}
      aria-live="polite"
    >
      <div className="relative flex w-full max-w-md items-center justify-center overflow-hidden px-8">
        {/* APEX — drives in from left, exits right */}
        <div className="preloader-apex flex items-baseline gap-1">
          {"APEX".split("").map((letter, i) => (
            <span
              key={letter + i}
              className="preloader-letter preloader-letter--ltr text-4xl font-extrabold tracking-[-0.04em] text-[var(--color-fg)] md:text-5xl"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* auto — drives in from right, exits left (offset timing) */}
        <span
          className="preloader-auto ml-1.5 text-4xl font-medium text-[var(--color-accent)] md:text-5xl"
          aria-hidden
        >
          auto
        </span>
      </div>

      {/* Speed lines — subtle motion cue */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-8 bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent preloader-line" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px translate-y-8 bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent preloader-line preloader-line--delay" aria-hidden />
    </div>
  );
}
