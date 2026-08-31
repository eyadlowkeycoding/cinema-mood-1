"use client";

import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck, PlayCircle, Wand2 } from "lucide-react";
import { MediaDetails } from "@/lib/types";
import { useWatchlist } from "@/lib/useWatchlist";

export function DetailActions({ item }: { item: MediaDetails }) {
  const { isSaved, toggle } = useWatchlist();
  const saved = isSaved(item.type, item.id);
  const router = useRouter();

  const findSimilar = () => {
    const answers = {
      mood: null,
      want: item.type,
      genres: item.genres.slice(0, 2),
      pacing: null,
      era: null,
      length: null,
      language: null,
      ratingPref: "high",
      companion: null,
      adventure: "familiar",
    };
    sessionStorage.setItem("cinemood.quiz", JSON.stringify(answers));
    router.push("/results");
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {item.trailerKey && (
        <a
          href={`https://www.youtube.com/watch?v=${item.trailerKey}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-marquee px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-105"
        >
          <PlayCircle size={17} /> Watch Trailer
        </a>
      )}
      <button
        onClick={() => toggle(item)}
        className={`flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition-colors ${
          saved ? "border-marquee text-marquee" : "border-line text-paper-dim hover:border-paper-faint hover:text-paper"
        }`}
      >
        {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        {saved ? "In Watchlist" : "Add to Watchlist"}
      </button>
      <button
        onClick={findSimilar}
        className="flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-paper-dim transition-colors hover:border-paper-faint hover:text-paper"
      >
        <Wand2 size={16} /> I want something like this
      </button>
    </div>
  );
}
