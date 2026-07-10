"use client"; // horizontal reel carousel + video modal

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, FastForward, Play, X } from "lucide-react";
import { carReels } from "@/lib/content";
import { cn } from "@/lib/utils";

export function CarsInAction() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [activeVideo, setActiveVideo] = useState<(typeof carReels)[number] | null>(null);

  const scroll = (dir: -1 | 1) => {
    trackRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <section className="my-8 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-5 md:p-6" aria-labelledby="reels-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
            <FastForward size={18} fill="currentColor" />
          </span>
          <div>
            <h2 id="reels-heading" className="text-lg font-semibold text-[var(--color-fg)] md:text-xl">
              Cars in Action
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--color-fg-muted)]">
              Discover the finest luxury car rentals through these stunning videos. Find exceptional
              cars for hire in Cyprus for your next trip through Apex Auto.
            </p>
          </div>
        </div>
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Previous videos"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-fg)] hover:text-[var(--color-fg)]"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Next videos"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-fg)] text-white transition-opacity hover:opacity-90"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1"
        role="list"
      >
        {carReels.map((reel) => (
          <li key={reel.id} className="w-[200px] shrink-0 snap-start sm:w-[220px]">
            <button
              type="button"
              onClick={() => setActiveVideo(reel)}
              className="group/reel relative block w-full overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface-2)] text-left"
              aria-label={`Play video: ${reel.brand} ${reel.model}`}
            >
              <div className="relative aspect-[9/16] w-full">
                <Image
                  src={reel.poster}
                  alt={`${reel.brand} ${reel.model}`}
                  fill
                  sizes="220px"
                  className="object-cover transition-transform duration-500 group-hover/reel:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-[var(--radius-sm)] bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-fg)]">
                  {reel.brand.slice(0, 3)}
                </span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[var(--color-fg)] shadow-md transition-transform group-hover/reel:scale-110">
                    <Play size={20} fill="currentColor" className="ml-0.5" />
                  </span>
                </span>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pb-3 pt-10">
                  <p className="truncate text-sm font-semibold text-white">
                    {reel.brand} {reel.model}
                  </p>
                  <p className="mt-0.5 text-xs text-white/90">
                    <span className="line-through opacity-70">EUR {reel.oldPricePerDay}</span>{" "}
                    <span className="font-bold text-[var(--color-accent-bright)]">EUR {reel.pricePerDay}</span>
                    <span className="text-white/80"> / day</span>
                  </p>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {/* Video modal — poster as preview until real clips are added */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeVideo.brand} ${activeVideo.model} video`}
          onClick={() => setActiveVideo(null)}
        >
          <button
            type="button"
            onClick={() => setActiveVideo(null)}
            aria-label="Close video"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X size={22} />
          </button>
          <div
            className="relative aspect-[9/16] w-full max-w-sm overflow-hidden rounded-[var(--radius-lg)] bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeVideo.poster}
              alt={`${activeVideo.brand} ${activeVideo.model}`}
              fill
              sizes="400px"
              className="object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/30">
              <Play size={48} fill="white" className="text-white opacity-90" />
              <p className="px-4 text-center text-sm text-white/80">
                Video reel placeholder — replace with real clip in{" "}
                <code className="text-xs">content/reels.json</code>
              </p>
              <Link
                href={`/rent-a-car-cyprus/${activeVideo.slug}`}
                className={cn(
                  "mt-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white",
                  "transition-colors hover:bg-[var(--color-accent-hover)]"
                )}
              >
                View car · EUR {activeVideo.pricePerDay}/day
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
