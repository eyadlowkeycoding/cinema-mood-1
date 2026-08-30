"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaItem, ScoredMedia } from "@/lib/types";
import { MediaCard } from "./MediaCard";
import { CardSkeleton } from "./Skeleton";

export function MediaCarousel({
  title,
  subtitle,
  items,
  loading = false,
}: {
  title: string;
  subtitle?: string;
  items?: (MediaItem | ScoredMedia)[];
  loading?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * 560, behavior: "smooth" });
  };

  if (!loading && (!items || items.length === 0)) return null;

  return (
    <section className="py-6">
      <div className="mb-4 flex items-end justify-between px-5 sm:px-8">
        <div>
          <h2 className="font-display text-xl font-semibold text-paper sm:text-2xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-paper-dim">{subtitle}</p>}
        </div>
        <div className="hidden gap-2 sm:flex">
          <button onClick={() => scroll(-1)} aria-label="Scroll left" className="rounded-full border border-line p-1.5 text-paper-dim transition-colors hover:border-marquee hover:text-marquee">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll(1)} aria-label="Scroll right" className="rounded-full border border-line p-1.5 text-paper-dim transition-colors hover:border-marquee hover:text-marquee">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div ref={ref} className="no-scrollbar flex gap-4 overflow-x-auto px-5 pb-2 sm:px-8">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          : items!.map((item) => <MediaCard key={`${item.type}-${item.id}`} item={item} />)}
      </div>
    </section>
  );
}
