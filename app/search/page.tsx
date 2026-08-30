import type { Metadata } from "next";
import { SearchBar } from "@/components/SearchBar";

export const metadata: Metadata = {
  title: "Search",
  description: "Search movies, TV series, actors, and directors on CineMood.",
};

export default function SearchPage() {
  return (
    <div className="min-h-screen px-5 pb-24 pt-28 sm:px-8 md:pb-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 font-display text-3xl font-semibold text-paper sm:text-4xl">Search</h1>
        <SearchBar />
      </div>
    </div>
  );
}
