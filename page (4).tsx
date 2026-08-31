"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import { useWatchlist } from "@/lib/useWatchlist";
import { MediaCard } from "@/components/MediaCard";

export default function WatchlistPage() {
  const { items } = useWatchlist();

  return (
    <div className="min-h-screen px-5 pb-24 pt-28 sm:px-8 md:pb-16">
      <h1 className="font-display text-3xl font-semibold text-paper sm:text-5xl">Your Watchlist</h1>
      <p className="mt-2 text-paper-dim">{items.length ? `${items.length} saved title${items.length > 1 ? "s" : ""}` : "Nothing saved yet"}</p>

      {items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <div className="font-display text-xl text-paper">Your watchlist is empty.</div>
          <p className="text-paper-dim">Find something you&apos;ll love.</p>
          <Link
            href="/discover"
            className="mt-2 flex items-center gap-2 rounded-full bg-marquee px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-105"
          >
            <Compass size={16} /> Discover Movies
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((item) => (
            <MediaCard key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
