export type MediaType = "movie" | "tv";

export interface MediaItem {
  id: number;
  type: MediaType;
  title: string;
  year: number;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  rating: number; // 0-10
  voteCount: number;
  popularity: number; // 0-100 normalized
  genres: string[];
  language: string;
  originalLanguage: string;
  runtime: number | null; // minutes, movies
  numberOfSeasons: number | null; // tv
  numberOfEpisodes: number | null; // tv
  moods: string[]; // internal mood tags, derived from genres
  director?: string;
  cast?: string[];
  trailerKey?: string | null;
}

export interface MediaDetails extends MediaItem {
  cast: string[];
  director: string;
  similar: MediaItem[];
  seasons?: { seasonNumber: number; name: string; episodeCount: number }[];
}

// ---------------- Quiz ----------------

export type MoodKey =
  | "happy"
  | "sad"
  | "chill"
  | "romantic"
  | "excited"
  | "angry"
  | "emotional"
  | "nostalgic"
  | "mysterious"
  | "motivated"
  | "dark"
  | "fun";

export type WantType = "movie" | "tv" | "either";

export type Pacing = "slow" | "balanced" | "fast" | "any";

export type EraKey = "classic" | "70s" | "80s" | "90s" | "2000s" | "2010s" | "2020s" | "any";

export type LengthKey = "short" | "medium" | "long" | "any";

export type LanguageKey =
  | "en" | "ar" | "ko" | "ja" | "es" | "fr" | "de" | "any";

export type RatingPref = "hidden" | "popular" | "high" | "best";

export type CompanionKey = "alone" | "friends" | "family" | "someone" | "any";

export type AdventureKey = "familiar" | "different" | "surprise";

export interface QuizAnswers {
  mood: MoodKey | null;
  want: WantType | null;
  genres: string[];
  pacing: Pacing | null;
  era: EraKey | null;
  length: LengthKey | null;
  language: LanguageKey | null;
  ratingPref: RatingPref | null;
  companion: CompanionKey | null;
  adventure: AdventureKey | null;
}

export const emptyQuizAnswers: QuizAnswers = {
  mood: null,
  want: null,
  genres: [],
  pacing: null,
  era: null,
  length: null,
  language: null,
  ratingPref: null,
  companion: null,
  adventure: null,
};

export interface ScoredMedia extends MediaItem {
  match: number; // 0-100
}

export interface RecommendationBundle {
  perfectMatch: ScoredMedia[];
  alsoLike: ScoredMedia[];
  hiddenGems: ScoredMedia[];
  different: ScoredMedia[];
  popular: ScoredMedia[];
  allTime: ScoredMedia[];
}
