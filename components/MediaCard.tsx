"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, BookmarkCheck, Star } from "lucide-react";
import { MediaItem, ScoredMedia } from "@/lib/types";
import { PosterArt } from "./PosterArt";
import { MatchGauge } from "./MatchGauge";
import { useWatchlist } from "@/lib/useWatchlist";

function imageUrlClient(path: string | null, size = "w342") {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function MediaCard({ item, priority = false }: { item: MediaItem | ScoredMedia; priority?: boolean }) {
  const { isSaved, toggle } = useWatchlist();
  const saved = isSaved(item.type, item.id);
  const match = "match" in item ? item.match : undefined;
  const poster = imageUrlClient(item.posterPath);
  const meta = item.type === "movie" ? (item.runtime ? `${item.runtime} min` : item.year) : item.numberOfSeasons ? `${item.numberOfSeasons} season${item.numberOfSeasons > 1 ? "s" : ""}` : item.year;

  return (
    <div className="group relative w-[168px] shrink-0 sm:w-[200px]">
      <Link href={`/${item.type === "movie" ? "movie" : "tv"}/${item.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-ink-raised ring-1 ring-line/60 transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:ring-marquee/50">
          {poster ? (
            <Image src={poster} alt={item.title} fill priority={priority} sizes="200px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <PosterArt item={item} />
          )}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {match !== undefined && (
            <div className="absolute right-2 top-2 rounded-full bg-ink/80 p-0.5 backdrop-blur">
              <MatchGauge value={match} size={38} />
            </div>
          )}
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-ink/80 px-2 py-0.5 font-mono text-[11px] text-paper backdrop-blur">
            <Star size={11} className="fill-marquee text-marquee" />
            {item.rating.toFixed(1)}
          </div>
        </div>
      </Link>
      <button
        aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
        onClick={(e) => {
          e.preventDefault();
          toggle(item);
        }}
        className="absolute bottom-[calc(100%-2.1rem)] right-2 z-10 rounded-full bg-ink/85 p-1.5 text-paper backdrop-blur transition-colors hover:text-marquee"
      >
        {saved ? <BookmarkCheck size={15} className="text-marquee" /> : <Bookmark size={15} />}
      </button>
      <div className="mt-2.5 px-0.5">
        <Link href={`/${item.type === "movie" ? "movie" : "tv"}/${item.id}`} className="line-clamp-1 font-display text-sm font-medium text-paper hover:text-marquee">
          {item.title}
        </Link>
        <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[11px] text-paper-faint">
          <span>{item.year || "—"}</span>
          <span>·</span>
          <span className="truncate">{meta}</span>
        </div>
      </div>
    </div>
  );
}
