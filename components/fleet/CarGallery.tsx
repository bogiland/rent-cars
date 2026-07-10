"use client"; // lightbox + mosaic gallery interactions

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Film,
  MessageCircle,
  Phone,
  Play,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CarGalleryProps {
  /** Mosaic tiles shown on the page (up to 4). */
  images: string[];
  alt: string;
  /** Full set browsed in the lightbox (up to 16). Defaults to `images`. */
  lightboxImages?: string[];
  /** Real walkaround clips (up to 4); otherwise a prepared "coming soon" slot. */
  videoUrls?: string[];
  /** Contact CTAs surfaced inside the lightbox toolbar. */
  callHref?: string;
  waHref?: string;
}

type Slide = { type: "image"; src: string } | { type: "video"; src?: string };

export function CarGallery({
  images,
  alt,
  lightboxImages,
  videoUrls,
  callHref,
  waHref,
}: CarGalleryProps) {
  const photos = lightboxImages ?? images;
  const videos = videoUrls ?? [];
  const videoSlides: Slide[] = videos.length
    ? videos.map((src) => ({ type: "video" as const, src }))
    : [{ type: "video" as const }];
  const slides: Slide[] = [
    ...photos.map((src) => ({ type: "image" as const, src })),
    ...videoSlides,
  ];
  const firstVideo = photos.length;

  const [lightbox, setLightbox] = useState<number | null>(null);
  const [zoom, setZoom] = useState(false);

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i - 1 + slides.length) % slides.length));
  }, [slides.length]);
  const next = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i + 1) % slides.length));
  }, [slides.length]);

  // Reset zoom whenever the active slide changes.
  useEffect(() => setZoom(false), [lightbox]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, close, prev, next]);

  const [img0, img1, img2, img3] = images;
  const current = lightbox === null ? null : slides[lightbox]!;
  const isImage = current?.type === "image";
  const counter =
    current?.type === "image"
      ? `${lightbox! + 1} / ${photos.length}`
      : `Video ${lightbox! - firstVideo + 1}${videos.length ? ` / ${videos.length}` : ""}`;

  return (
    <>
      {/* OCD-style asymmetric mosaic — 4 photos */}
      <div className="mb-8 grid grid-cols-2 grid-rows-2 gap-2 md:grid-cols-4 md:grid-rows-2 md:gap-2.5">
        {img0 && (
          <button
            type="button"
            onClick={() => setLightbox(0)}
            className="relative col-span-2 row-span-2 aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-surface-2)] md:aspect-auto md:min-h-[250px]"
          >
            <Image
              src={img0}
              alt={`${alt} — photo 1`}
              fill
              priority
              sizes="(min-width: 768px) 42vw, 100vw"
              className="object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
          </button>
        )}

        {img1 && (
          <button
            type="button"
            onClick={() => setLightbox(1)}
            className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-surface-2)] md:aspect-auto md:min-h-[121px]"
          >
            <Image
              src={img1}
              alt={`${alt} — photo 2`}
              fill
              sizes="(min-width: 768px) 21vw, 50vw"
              className="object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
          </button>
        )}

        {img2 && (
          <button
            type="button"
            onClick={() => setLightbox(2)}
            className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-surface-2)] md:aspect-auto md:min-h-[121px]"
          >
            <Image
              src={img2}
              alt={`${alt} — photo 3`}
              fill
              sizes="(min-width: 768px) 21vw, 50vw"
              className="object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
          </button>
        )}

        {img3 && (
          <button
            type="button"
            onClick={() => setLightbox(3)}
            className="relative col-span-2 row-span-1 aspect-[16/7] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-surface-2)] md:col-span-1 md:row-span-2 md:aspect-auto md:min-h-[250px]"
          >
            <Image
              src={img3}
              alt={`${alt} — photo 4`}
              fill
              sizes="(min-width: 768px) 21vw, 100vw"
              className="object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
            <span className="absolute inset-x-0 bottom-0 flex items-end justify-end bg-gradient-to-t from-black/60 to-transparent p-3">
              <span className="rounded-[var(--radius-md)] bg-white px-3.5 py-1.5 text-xs font-semibold text-[var(--color-fg)] shadow-sm">
                Show all photos
              </span>
            </span>
          </button>
        )}
      </div>

      {/* Lightbox */}
      {current !== null && lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/92"
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} photo gallery`}
        >
          {/* Toolbar — all controls as buttons up top */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 text-white md:px-6">
            <span className="text-sm font-medium tabular-nums text-white/85">{counter}</span>
            <div className="flex items-center gap-1.5">
              {isImage && (
                <ToolBtn
                  label={zoom ? "Zoom out" : "Zoom in"}
                  onClick={() => setZoom((z) => !z)}
                >
                  {zoom ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
                </ToolBtn>
              )}
              <ToolBtn label="Play video" onClick={() => setLightbox(firstVideo)}>
                <Film size={18} />
              </ToolBtn>
              {callHref && (
                <ToolBtn as="a" href={callHref} label="Call">
                  <Phone size={18} />
                </ToolBtn>
              )}
              {waHref && (
                <ToolBtn as="a" href={waHref} target="_blank" rel="noopener noreferrer" label="WhatsApp">
                  <MessageCircle size={18} />
                </ToolBtn>
              )}
              <ToolBtn label="Close gallery" onClick={close}>
                <X size={18} />
              </ToolBtn>
            </div>
          </div>

          {/* Stage */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-16">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:left-6"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="relative flex h-full w-full max-w-5xl items-center justify-center overflow-hidden">
              {current.type === "image" ? (
                <button
                  type="button"
                  onClick={() => setZoom((z) => !z)}
                  aria-label={zoom ? "Zoom out" : "Zoom in"}
                  className={cn("relative h-full w-full", zoom ? "cursor-zoom-out" : "cursor-zoom-in")}
                >
                  <Image
                    key={lightbox}
                    src={current.src}
                    alt={`${alt} — photo ${lightbox + 1}`}
                    fill
                    sizes="100vw"
                    priority
                    className={cn(
                      "animate-lightbox-in object-contain transition-transform duration-300 ease-[var(--ease-premium)]",
                      zoom && "scale-[1.9]"
                    )}
                  />
                </button>
              ) : current.src ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video src={current.src} controls autoPlay playsInline className="h-full w-full object-contain" />
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 text-center text-white/70">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-white/5">
                    <Play size={26} className="translate-x-0.5" />
                  </span>
                  <p className="text-sm font-semibold text-white/85">Walkaround video coming soon</p>
                  <p className="max-w-xs text-xs text-white/50">
                    Up to 4 short video tours of this {alt} can be added here.
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:right-6"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Thumbnail strip */}
          <ul className="no-scrollbar flex max-w-full justify-start gap-2 overflow-x-auto px-4 py-4 md:justify-center md:px-6" role="list">
            {slides.map((slide, i) => (
              <li key={slide.type === "image" ? slide.src : `video-${i}`}>
                <button
                  type="button"
                  onClick={() => setLightbox(i)}
                  aria-label={slide.type === "video" ? "Video" : `Photo ${i + 1}`}
                  className={cn(
                    "relative h-12 w-16 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border-2 transition-colors",
                    lightbox === i ? "border-white" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  {slide.type === "image" ? (
                    <Image src={slide.src} alt="" fill sizes="64px" className="object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-white/15 text-white">
                      <Play size={15} className="translate-x-0.5" />
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function ToolBtn({
  children,
  label,
  as = "button",
  ...rest
}: {
  children: React.ReactNode;
  label: string;
  as?: "button" | "a";
} & React.ComponentPropsWithoutRef<"a">) {
  const className =
    "inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20";
  if (as === "a") {
    return (
      <a className={className} aria-label={label} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={className} aria-label={label} onClick={rest.onClick as never}>
      {children}
    </button>
  );
}
