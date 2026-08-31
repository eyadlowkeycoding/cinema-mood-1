import type { Metadata } from "next";
import { MediaCarousel } from "@/components/MediaCarousel";
import { BrowseSection } from "@/components/BrowseSection";
import {
  discover, getAllTimeGreats, getByCountry, getHiddenGems, getNewReleases, getPopular, getTopRated, getTrending,
} from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Movies",
  description: "Browse thousands of movies by genre, year, rating, language, and mood.",
};

const GENRE_ROWS = ["Action", "Comedy", "Drama", "Thriller", "Horror", "Sci-Fi", "Romance", "Fantasy", "Crime", "Animation"];

export default async function MoviesPage({ searchParams }: { searchParams: Promise<{ genre?: string; country?: string }> }) {
  const { genre, country } = await searchParams;

  const [trending, topRated, allTime, popular, hiddenGems, newReleases, egyptian, ...genreRows] = await Promise.all([
    getTrending("movie", 16),
    getTopRated("movie", 16),
    getAllTimeGreats("movie", 16),
    getPopular("movie", 16),
    getHiddenGems("movie", 16),
    getNewReleases("movie", 16),
    getByCountry("movie", "EG", 16, "rating"),
    ...GENRE_ROWS.map((g) => discover("movie", { genre: g, sort: "popularity" })),
  ]);

  return (
    <div className="pb-24 pt-28 md:pb-16">
      <div className="px-5 sm:px-8">
        <h1 className="font-display text-3xl font-semibold text-paper sm:text-5xl">Movies</h1>
        <p className="mt-2 max-w-lg text-paper-dim">A huge catalog of films — filter by genre, era, rating, language, and mood.</p>
      </div>

      <MediaCarousel title="Trending Movies" items={trending} />
      <MediaCarousel title="Top Rated Movies" items={topRated} />
      <MediaCarousel title="Best Movies of All Time" items={allTime} />
      <MediaCarousel title="Popular Movies" items={popular} />
      <MediaCarousel title="Hidden Gems" items={hiddenGems} />
      <MediaCarousel title="New Releases" items={newReleases} />
      <MediaCarousel title="🇪🇬 Egyptian Movies" items={egyptian} />
      {GENRE_ROWS.map((g, i) => (
        <MediaCarousel key={g} title={g} items={genreRows[i]} />
      ))}

      <section className="px-5 py-10 sm:px-8">
        <h2 className="mb-5 font-display text-xl font-semibold text-paper sm:text-2xl">Browse All Movies</h2>
        <BrowseSection type="movie" initialGenre={genre} initialCountry={country} />
      </section>
    </div>
  );
}
