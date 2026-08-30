import type { Metadata } from "next";
import { MediaCarousel } from "@/components/MediaCarousel";
import { BrowseSection } from "@/components/BrowseSection";
import {
  discover, getAllTimeGreats, getHiddenGems, getNewReleases, getPopular, getTopRated, getTrending,
} from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "TV Series",
  description: "Browse thousands of TV series by genre, year, rating, language, and mood.",
};

const GENRE_ROWS = ["Crime", "Drama", "Comedy", "Sci-Fi", "Fantasy", "Thriller", "Mystery"];

export default async function SeriesPage({ searchParams }: { searchParams: Promise<{ genre?: string }> }) {
  const { genre } = await searchParams;

  const [trending, allTime, topRated, popular, hiddenGems, recent, short, long, ...genreRows] = await Promise.all([
    getTrending("tv", 16),
    getAllTimeGreats("tv", 16),
    getTopRated("tv", 16),
    getPopular("tv", 16),
    getHiddenGems("tv", 16),
    getNewReleases("tv", 16),
    discover("tv", { sort: "rating" }),
    discover("tv", { sort: "popularity" }),
    ...GENRE_ROWS.map((g) => discover("tv", { genre: g, sort: "popularity" })),
  ]);

  return (
    <div className="pb-24 pt-28 md:pb-16">
      <div className="px-5 sm:px-8">
        <h1 className="font-display text-3xl font-semibold text-paper sm:text-5xl">TV Series</h1>
        <p className="mt-2 max-w-lg text-paper-dim">Bingeable, acclaimed, and everything between — filter by genre, era, rating, language, and mood.</p>
      </div>

      <MediaCarousel title="Trending Series" items={trending} />
      <MediaCarousel title="Best Series of All Time" items={allTime} />
      <MediaCarousel title="Top Rated Series" items={topRated} />
      <MediaCarousel title="Popular Series" items={popular} />
      <MediaCarousel title="Hidden Gems" items={hiddenGems} />
      <MediaCarousel title="Recently Released" items={recent} />
      <MediaCarousel title="Short Series" subtitle="Bite-sized, 1–2 seasons" items={short.filter((s) => (s.numberOfSeasons ?? 99) <= 2)} />
      <MediaCarousel title="Long-Running Series" subtitle="Series with plenty to sink into" items={long.filter((s) => (s.numberOfSeasons ?? 0) > 4)} />
      {GENRE_ROWS.map((g, i) => (
        <MediaCarousel key={g} title={`${g} Series`} items={genreRows[i]} />
      ))}

      <section className="px-5 py-10 sm:px-8">
        <h2 className="mb-5 font-display text-xl font-semibold text-paper sm:text-2xl">Browse All Series</h2>
        <BrowseSection type="tv" initialGenre={genre} />
      </section>
    </div>
  );
}
