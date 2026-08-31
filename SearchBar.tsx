"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, User } from "lucide-react";
import { MediaItem } from "@/lib/types";
import { PosterArt } from "./PosterArt";

interface SearchResults {
  movies: MediaItem[];
  series: MediaItem[];
  people: { name: string; knownFor: string; profilePath: string | null }[];
}

const EMPTY: SearchResults = { movies: [], series: [], people: [] };

export function SearchBar({ autoFocus = true }: { autoFocus?: boolean }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>(EMPTY);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults(EMPTY);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        setResults(await res.json());
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const hasResults = results.movies.length || results.series.length || results.people.length;

  return (
    <div>
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-paper-faint" />
        <input
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies, series, actors, directors…"
          className="w-full rounded-full border border-line bg-ink-raised py-3.5 pl-11 pr-4 text-sm text-paper outline-none transition-colors focus:border-marquee"
        />
      </div>

      {query.trim() && (
        <div className="mt-8 space-y-10">
          {loading && <p className="text-sm text-paper-dim">Searching…</p>}

          {!loading && !hasResults && <p className="text-sm text-paper-dim">No matches for &ldquo;{query}&rdquo;.</p>}

          {results.movies.length > 0 && (
            <section>
              <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-paper-faint">Movies</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
                {results.movies.map((m) => (
                  <ResultCard key={`movie-${m.id}`} item={m} />
                ))}
              </div>
            </section>
          )}

          {results.series.length > 0 && (
            <section>
              <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-paper-faint">Series</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
                {results.series.map((s) => (
                  <ResultCard key={`tv-${s.id}`} item={s} />
                ))}
              </div>
            </section>
          )}

          {results.people.length > 0 && (
            <section>
              <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-paper-faint">Actors &amp; Directors</h3>
              <div className="flex flex-wrap gap-4">
                {results.people.map((p) => (
                  <div key={p.name} className="flex items-center gap-2.5 rounded-full border border-line bg-ink-raised py-1.5 pl-1.5 pr-4">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full bg-ink">
                      {p.profilePath ? (
                        <Image src={p.profilePath} alt={p.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-paper-faint"><User size={14} /></div>
                      )}
                    </div>
                    <span className="text-sm text-paper">{p.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function ResultCard({ item }: { item: MediaItem }) {
  const poster = item.posterPath ? `https://image.tmdb.org/t/p/w200${item.posterPath}` : null;
  return (
    <Link href={`/${item.type === "movie" ? "movie" : "tv"}/${item.id}`} className="group">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-ink-raised ring-1 ring-line/60 transition-colors group-hover:ring-marquee/50">
        {poster ? <Image src={poster} alt={item.title} fill className="object-cover" /> : <PosterArt item={item} />}
      </div>
      <div className="mt-1.5 line-clamp-1 text-xs text-paper-dim group-hover:text-paper">{item.title}</div>
    </Link>
  );
}
