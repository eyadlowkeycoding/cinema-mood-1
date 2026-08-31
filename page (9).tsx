import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/Hero";
import { MediaCarousel } from "@/components/MediaCarousel";
import { MarqueeDivider } from "@/components/MarqueeDivider";
import { getAllTimeGreats, getByCountry, getHiddenGems, getTopRated, getTrending } from "@/lib/tmdb";
import { ALL_GENRES } from "@/lib/genres";
import { MediaItem } from "@/lib/types";

export default async function HomePage() {
  const [
    trendingMovies, trendingSeries,
    topRatedMovies, topRatedSeries,
    allTimeMovies, allTimeSeries,
    hiddenGemsMovies,
    egyptianMovies, egyptianSeries,
  ] = await Promise.all([
    getTrending("movie", 14), getTrending("tv", 14),
    getTopRated("movie", 14), getTopRated("tv", 14),
    getAllTimeGreats("movie", 14), getAllTimeGreats("tv", 14),
    getHiddenGems("movie", 14),
    getByCountry("movie", "EG", 12, "rating"), getByCountry("tv", "EG", 12, "rating"),
  ]);

  const egyptianCinema: MediaItem[] = [...egyptianMovies, ...egyptianSeries].sort((a, b) => b.rating - a.rating);

  return (
    <div className="pb-24 md:pb-16">
      <Hero />

      <MediaCarousel title="Trending Movies" items={trendingMovies} />
      <MediaCarousel title="Trending Series" items={trendingSeries} />
      <MediaCarousel title="Top Rated Movies" items={topRatedMovies} />
      <MediaCarousel title="Top Rated Series" items={topRatedSeries} />
      <MediaCarousel title="Best Movies of All Time" items={allTimeMovies} />
      <MediaCarousel title="Best Series of All Time" items={allTimeSeries} />
      <MediaCarousel title="Hidden Gems" subtitle="Excellent, under-the-radar picks" items={hiddenGemsMovies} />
      <MediaCarousel title="🇪🇬 Egyptian Cinema" subtitle="Beloved Egyptian movies and series" items={egyptianCinema} />

      <section className="px-5 py-10 sm:px-8">
        <h2 className="mb-5 font-display text-xl font-semibold text-paper sm:text-2xl">Popular Genres</h2>
        <div className="flex flex-wrap gap-2.5">
          {ALL_GENRES.map((g) => (
            <Link
              key={g}
              href={`/movies?genre=${encodeURIComponent(g)}`}
              className="rounded-full border border-line px-4 py-2 text-sm text-paper-dim transition-colors hover:border-marquee hover:text-marquee"
            >
              {g}
            </Link>
          ))}
        </div>
      </section>

      <section className="relative mx-5 my-16 overflow-hidden rounded-3xl border border-line bg-ink-raised px-6 py-16 text-center sm:mx-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(232,163,61,0.14)_0%,transparent_70%)]" />
        <div className="relative z-10">
          <MarqueeDivider className="mb-6" />
          <h2 className="text-balance font-display text-2xl font-semibold text-paper sm:text-4xl">Not sure what to watch?</h2>
          <p className="mx-auto mt-3 max-w-md text-paper-dim">Answer a few quick questions and we&apos;ll match your mood to the right movie or series.</p>
          <Link
            href="/quiz"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-marquee px-7 py-3.5 text-sm font-semibold text-ink transition-transform hover:scale-105"
          >
            Take the Mood Quiz <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
