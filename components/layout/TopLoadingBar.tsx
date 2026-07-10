"use client"; // global navigation progress line — needs click + pathname tracking

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Thin blue progress line pinned to the very top of the window. Starts when an
 * internal link is clicked and completes once the route commits (pathname
 * change) — a lightweight, dependency-free page-load indicator.
 */
export function TopLoadingBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const tick = useRef<number | null>(null);
  const done = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (tick.current) window.clearInterval(tick.current);
    if (done.current) window.clearTimeout(done.current);
    tick.current = null;
    done.current = null;
  }, []);

  const start = useCallback(() => {
    clearTimers();
    setActive(true);
    setProgress(8);
    tick.current = window.setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + Math.max(0.5, (90 - p) * 0.08)));
    }, 200);
  }, [clearTimers]);

  const complete = useCallback(() => {
    clearTimers();
    setProgress(100);
    done.current = window.setTimeout(() => {
      setActive(false);
      setProgress(0);
    }, 2050);
  }, [clearTimers]);

  // Begin on same-origin left-clicks to a different path.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("#")) return;
      if (anchor.getAttribute("target") === "_blank") return;
      if (href === pathname) return;
      start();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, start]);

  // Route committed → finish.
  useEffect(() => {
    if (active) complete();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!active && progress === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-[3px]" aria-hidden>
      <div
        className="h-full bg-[var(--color-loadbar)] shadow-[0_0_8px_var(--color-loadbar)] transition-[width,opacity] duration-[2000ms] ease-[var(--ease-premium)]"
        style={{ width: `${progress}%`, opacity: active ? 1 : 0 }}
      />
    </div>
  );
}
