"use client";

import { ALL_GENRES, MOOD_GENRE_WEIGHTS, MOOD_LABELS, MoodKey } from "@/lib/genres";

export interface Filters {
  genre: string;
  year: string;
  minRating: string;
  language: string;
  country: string;
  sort: "popularity" | "rating" | "newest";
  mood: string;
}

export const DEFAULT_FILTERS: Filters = {
  genre: "",
  year: "",
  minRating: "",
  language: "",
  country: "",
  sort: "popularity",
  mood: "",
};

const YEARS = Array.from({ length: 2026 - 1950 + 1 }, (_, i) => 2026 - i);
const LANGUAGES: [string, string][] = [["en", "English"], ["ar", "Arabic"], ["ko", "Korean"], ["ja", "Japanese"], ["es", "Spanish"], ["fr", "French"], ["de", "German"], ["it", "Italian"], ["pt", "Portuguese"]];
const COUNTRIES: [string, string][] = [["EG", "🇪🇬 Egypt"], ["US", "🇺🇸 USA"], ["KR", "🇰🇷 South Korea"], ["JP", "🇯🇵 Japan"], ["FR", "🇫🇷 France"], ["GB", "🇬🇧 UK"], ["IN", "🇮🇳 India"], ["SA", "🇸🇦 Saudi Arabia"]];

function topGenreForMood(mood: string): string {
  const weights = MOOD_GENRE_WEIGHTS[mood as MoodKey];
  if (!weights) return "";
  return Object.entries(weights).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
}

function selectClass() {
  return "rounded-full border border-line bg-ink-raised px-3.5 py-2 text-xs text-paper-dim outline-none transition-colors focus:border-marquee focus:text-paper";
}

export function FilterBar({ value, onChange }: { value: Filters; onChange: (f: Filters) => void }) {
  const set = (patch: Partial<Filters>) => onChange({ ...value, ...patch });

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <select className={selectClass()} value={value.mood} onChange={(e) => set({ mood: e.target.value, genre: e.target.value ? topGenreForMood(e.target.value) : value.genre })}>
        <option value="">Any mood</option>
        {(Object.keys(MOOD_LABELS) as MoodKey[]).map((m) => (
          <option key={m} value={m}>{MOOD_LABELS[m].emoji} {MOOD_LABELS[m].label}</option>
        ))}
      </select>

      <select className={selectClass()} value={value.genre} onChange={(e) => set({ genre: e.target.value })}>
        <option value="">All genres</option>
        {ALL_GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
      </select>

      <select className={selectClass()} value={value.year} onChange={(e) => set({ year: e.target.value })}>
        <option value="">All years</option>
        {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>

      <select className={selectClass()} value={value.minRating} onChange={(e) => set({ minRating: e.target.value })}>
        <option value="">Any rating</option>
        <option value="8.5">8.5+</option>
        <option value="8">8.0+</option>
        <option value="7">7.0+</option>
        <option value="6">6.0+</option>
      </select>

      <select className={selectClass()} value={value.language} onChange={(e) => set({ language: e.target.value })}>
        <option value="">Any language</option>
        {LANGUAGES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
      </select>

      <select className={selectClass()} value={value.country} onChange={(e) => set({ country: e.target.value })}>
        <option value="">Any country</option>
        {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
      </select>

      <select className={selectClass()} value={value.sort} onChange={(e) => set({ sort: e.target.value as Filters["sort"] })}>
        <option value="popularity">Sort: Popularity</option>
        <option value="rating">Sort: Rating</option>
        <option value="newest">Sort: Newest</option>
      </select>

      {(value.genre || value.year || value.minRating || value.language || value.country || value.mood) && (
        <button onClick={() => onChange(DEFAULT_FILTERS)} className="text-xs text-paper-faint underline underline-offset-2 hover:text-paper">
          Clear filters
        </button>
      )}
    </div>
  );
}
