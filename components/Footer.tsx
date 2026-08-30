import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line/60 bg-ink px-5 pb-24 pt-14 sm:px-8 md:pb-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2 font-display text-xl font-semibold text-paper">
            <span className="text-marquee">●</span>
            CineMood
          </div>
          <p className="mt-3 max-w-xs text-sm text-paper-dim">
            A mood-first way to find the next movie or series worth your evening.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <span className="mb-1 font-mono text-xs uppercase tracking-wider text-paper-faint">Browse</span>
            <Link href="/movies" className="text-paper-dim hover:text-paper">Movies</Link>
            <Link href="/series" className="text-paper-dim hover:text-paper">Series</Link>
            <Link href="/discover" className="text-paper-dim hover:text-paper">Discover</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="mb-1 font-mono text-xs uppercase tracking-wider text-paper-faint">You</span>
            <Link href="/watchlist" className="text-paper-dim hover:text-paper">Watchlist</Link>
            <Link href="/quiz" className="text-paper-dim hover:text-paper">Mood Quiz</Link>
            <Link href="/search" className="text-paper-dim hover:text-paper">Search</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-line/60 pt-6 font-mono text-[11px] text-paper-faint">
        CineMood is a discovery tool. Streaming availability and metadata are provided by The Movie Database (TMDB) when configured.
      </div>
    </footer>
  );
}
