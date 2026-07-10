"use client"; // ScrollTrigger + refs need browser APIs

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);
if (!CustomEase.get("premium")) CustomEase.create("premium", "0.16,1,0.3,1");

interface GsapRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Animate each direct child on its own stagger instead of the wrapper as one block. */
  stagger?: boolean;
  y?: number;
  /** Wrapper tag — use "ul" to keep list semantics when children are <li>. */
  as?: "div" | "ul";
}

export function GsapReveal({ children, className, stagger = false, y = 28, as: Tag = "div" }: GsapRevealProps) {
  const ref = useRef<HTMLDivElement & HTMLUListElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    const targets: gsap.TweenTarget = stagger ? gsap.utils.toArray(el.children) : el;

    const reveal = () =>
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "premium",
        stagger: stagger ? 0.07 : 0,
        overwrite: true,
      });

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y });
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: reveal,
      });
    }, el);

    // Safety net: whatever happens with the trigger, never leave content hidden.
    const safety = window.setTimeout(reveal, 1000);

    return () => {
      window.clearTimeout(safety);
      ctx.revert();
    };
  }, [stagger, y]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
