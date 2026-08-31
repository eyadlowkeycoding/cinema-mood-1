import { MoodKey } from "./types";

export type { MoodKey };

// TMDB genre_id -> our display genre name (movie + tv ids merged; TMDB reuses most ids)
export const TMDB_GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "Historical",
  27: "Horror",
  10402: "Musical",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10759: "Action", // tv action & adventure
  10762: "Family", // tv kids
  10763: "Documentary", // tv news
  10764: "Reality",
  10765: "Sci-Fi", // tv sci-fi & fantasy
  10766: "Drama", // soap
  10767: "Talk",
  10768: "War", // tv war & politics
};

export const ALL_GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Romance", "Thriller", "Horror",
  "Mystery", "Sci-Fi", "Fantasy", "Crime", "Animation", "Documentary",
  "Historical", "Family", "War", "Musical", "Western",
];

// Which genres resonate with each mood — used both to steer TMDB discover queries
// and to score fallback / API results consistently.
export const MOOD_GENRE_WEIGHTS: Record<MoodKey, Record<string, number>> = {
  happy: { Comedy: 1, Family: 0.8, Animation: 0.7, Adventure: 0.6, Musical: 0.6 },
  sad: { Drama: 1, Romance: 0.6, War: 0.4 },
  chill: { Comedy: 0.7, Family: 0.6, Animation: 0.6, Drama: 0.4, Documentary: 0.4 },
  romantic: { Romance: 1, Drama: 0.6, Comedy: 0.5, Musical: 0.4 },
  excited: { Action: 1, Adventure: 0.9, Thriller: 0.6, "Sci-Fi": 0.6 },
  angry: { Action: 0.9, Thriller: 0.8, Crime: 0.7, War: 0.5 },
  emotional: { Drama: 1, Romance: 0.5, War: 0.5, Historical: 0.4 },
  nostalgic: { Family: 0.7, Adventure: 0.6, Animation: 0.6, Fantasy: 0.5, Musical: 0.5 },
  mysterious: { Mystery: 1, Thriller: 0.8, Crime: 0.6, "Sci-Fi": 0.4 },
  motivated: { Drama: 0.7, Historical: 0.6, Action: 0.5, Documentary: 0.5 },
  dark: { Horror: 0.9, Thriller: 0.8, Crime: 0.7, Mystery: 0.5 },
  fun: { Comedy: 1, Action: 0.6, Adventure: 0.6, Animation: 0.5 },
};

export const MOOD_LABELS: Record<MoodKey, { label: string; emoji: string }> = {
  happy: { label: "Happy", emoji: "😊" },
  sad: { label: "Sad", emoji: "😢" },
  chill: { label: "Chill", emoji: "😌" },
  romantic: { label: "Romantic", emoji: "❤️" },
  excited: { label: "Excited", emoji: "⚡" },
  angry: { label: "Angry", emoji: "😤" },
  emotional: { label: "Emotional", emoji: "🥺" },
  nostalgic: { label: "Nostalgic", emoji: "🕰️" },
  mysterious: { label: "Mysterious", emoji: "🌙" },
  motivated: { label: "Motivated", emoji: "🔥" },
  dark: { label: "Dark", emoji: "🌑" },
  fun: { label: "I just want something fun", emoji: "🎉" },
};

export function genresFromTmdbIds(ids: number[]): string[] {
  const set = new Set<string>();
  ids.forEach((id) => {
    const g = TMDB_GENRE_MAP[id];
    if (g) set.add(g);
  });
  return Array.from(set);
}

export function moodsFromGenres(genres: string[]): string[] {
  const moods = new Set<string>();
  (Object.keys(MOOD_GENRE_WEIGHTS) as MoodKey[]).forEach((mood) => {
    const weights = MOOD_GENRE_WEIGHTS[mood];
    const hit = genres.some((g) => (weights[g] ?? 0) >= 0.5);
    if (hit) moods.add(mood);
  });
  return Array.from(moods);
}
