"use client";

import { useEffect, useState } from "react";
import { MediaItem, MediaType } from "@/lib/types";
import { MediaCard } from "./MediaCard";
import { GridSkeleton, ErrorState } from "./Skeleton";
import { Filters } from "./FilterBar";

export function BrowseGrid({ type, filters }: { type: MediaType; filters: Filters }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async (targetPage: number, replace: boolean) => {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({ type, sort: filters.sort, page: String(targetPage) });
      if (filters.genre) params.set("genre", filters.genre);
      if (filters.year) params.set("year", filters.year);
      if (filters.minRating) params.set("minRating", filters.minRating);
      if (filters.language) params.set("language", filters.language);
      const res = await fetch(`/api/discover?${params.toString()}`);
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      setItems((prev) => (replace ? data.items : [...prev, ...data.items]));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
    load(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, filters.genre, filters.year, filters.minRating, filters.language, filters.sort]);

  if (error && items.length === 0) return <ErrorState onRetry={() => load(page, true)} />;

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item) => (
          <MediaCard key={`${item.type}-${item.id}`} item={item} />
        ))}
      </div>
      {loading && <div className="mt-6"><GridSkeleton count={10} /></div>}
      {!loading && items.length > 0 && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => {
              const next = page + 1;
              setPage(next);
              load(next, false);
            }}
            className="rounded-full border border-line px-6 py-2.5 text-sm text-paper-dim transition-colors hover:border-marquee hover:text-marquee"
          >
            Load more
          </button>
        </div>
      )}
      {!loading && items.length === 0 && !error && (
        <div className="py-20 text-center text-paper-dim">No titles match those filters yet — try loosening one.</div>
      )}
    </div>
  );
}
