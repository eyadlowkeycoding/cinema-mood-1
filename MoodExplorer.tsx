"use client";

import { useState } from "react";
import { MediaItem } from "@/lib/types";
import { MediaCard } from "./MediaCard";
import { GridSkeleton, ErrorState } from "./Skeleton";

const MOOD_CATEGORIES: { key: string; label: string; emoji: string; genre: string }[] = [
  { key: "chill", label: "Chill Night", emoji: "😌", genre: "Comedy" },
  { key: "cry", label: "I Want To Cry", emoji: "😭", genre: "Drama" },
  { key: "adrenaline", label: "Adrenaline", emoji: "🔥", genre: "Action" },
  { key: "romance", label: "Romance", emoji: "❤️", genre: "Romance" },
  { key: "laugh", label: "Make Me Laugh", emoji: "😂", genre: "Comedy" },
  { key: "think", label: "Make Me Think", emoji: "🧠", genre: "Mystery" },
  { key: "dark", label: "Dark & Mysterious", emoji: "🌑", genre: "Thriller" },
  { key: "feelgood", label: "Feel Good", emoji: "✨", genre: "Family" },
  { key: "nostalgic", label: "Nostalgic", emoji: "🕰️", genre: "Adventure" },
  { key: "scary", label: "Scary Night", emoji: "👻", genre: "Horror" },
  { key: "escape", label: "Escape Reality", emoji: "🚀", genre: "Sci-Fi" },
];

export function MoodExplorer() {
  const [active, setActive] = useState<string | null>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const select = async (key: string, genre: string) => {
    setActive(key);
    setLoading(true);
    setError(false);
    try {
      const [m, t] = await Promise.all([
        fetch(`/api/discover?type=movie&genre=${encodeURIComponent(genre)}&sort=rating`).then((r) => r.json()),
        fetch(`/api/discover?type=tv&genre=${encodeURIComponent(genre)}&sort=rating`).then((r) => r.json()),
      ]);
      const merged: MediaItem[] = [...m.items, ...t.items].sort((a, b) => b.rating - a.rating);
      setItems(merged);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {MOOD_CATEGORIES.map((m) => (
          <button
            key={m.key}
            onClick={() => select(m.key, m.genre)}
            className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-6 text-center transition-all ${
              active === m.key ? "border-marquee bg-marquee/10" : "border-line bg-ink-raised hover:border-paper-faint"
            }`}
          >
            <span className="text-3xl">{m.emoji}</span>
            <span className="text-sm font-medium text-paper">{m.label}</span>
          </button>
        ))}
      </div>

      {active && (
        <div className="mt-10">
          {error && <ErrorState onRetry={() => { const m = MOOD_CATEGORIES.find((x) => x.key === active); if (m) select(m.key, m.genre); }} />}
          {!error && loading && <GridSkeleton count={10} />}
          {!error && !loading && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {items.map((item) => (
                <MediaCard key={`${item.type}-${item.id}`} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
