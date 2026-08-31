import { EraKey, LengthKey, MediaItem, Pacing, QuizAnswers, RatingPref, RecommendationBundle, ScoredMedia } from "./types";
import { MOOD_GENRE_WEIGHTS, MoodKey } from "./genres";

const FAST_GENRES = new Set(["Action", "Thriller", "Horror", "Crime", "War"]);
const SLOW_GENRES = new Set(["Drama", "Documentary", "Romance", "Historical"]);

function eraRange(era: EraKey): [number, number] | null {
  switch (era) {
    case "classic": return [1900, 1969];
    case "70s": return [1970, 1979];
    case "80s": return [1980, 1989];
    case "90s": return [1990, 1999];
    case "2000s": return [2000, 2009];
    case "2010s": return [2010, 2019];
    case "2020s": return [2020, 2029];
    default: return null;
  }
}

function ratingPrefScore(item: MediaItem, pref: RatingPref | null): number {
  if (!pref) return item.rating >= 7 ? 6 : 3;
  switch (pref) {
    case "hidden": return item.rating >= 7.2 && item.popularity < 55 ? 10 : item.rating >= 7 ? 5 : 2;
    case "popular": return item.popularity >= 65 ? 10 : item.popularity >= 40 ? 5 : 2;
    case "high": return item.rating >= 7.8 ? 10 : item.rating >= 7 ? 6 : 2;
    case "best": return item.rating >= 8.5 ? 10 : item.rating >= 8 ? 6 : 1;
    default: return 4;
  }
}

function eraScore(item: MediaItem, era: EraKey | null): number {
  if (!era || era === "any") return 3;
  const range = eraRange(era);
  if (!range) return 3;
  return item.year >= range[0] && item.year <= range[1] ? 5 : 0;
}

function paceScore(item: MediaItem, pacing: Pacing | null): number {
  if (!pacing || pacing === "any") return 6;
  const isFast = item.genres.some((g) => FAST_GENRES.has(g));
  const isSlow = item.genres.some((g) => SLOW_GENRES.has(g));
  if (pacing === "fast") return isFast ? 10 : isSlow ? 2 : 6;
  if (pacing === "slow") return isSlow ? 10 : isFast ? 2 : 6;
  return 8; // balanced — most things qualify reasonably
}

function lengthScore(item: MediaItem, length: LengthKey | null): number {
  if (!length || length === "any") return 3;
  if (item.type === "movie" && item.runtime) {
    if (length === "short") return item.runtime < 90 ? 5 : item.runtime < 105 ? 2 : 0;
    if (length === "medium") return item.runtime >= 90 && item.runtime <= 120 ? 5 : 2;
    if (length === "long") return item.runtime > 120 ? 5 : 1;
  }
  if (item.type === "tv" && item.numberOfSeasons) {
    if (length === "short") return item.numberOfSeasons <= 2 ? 5 : 1;
    if (length === "medium") return item.numberOfSeasons >= 2 && item.numberOfSeasons <= 4 ? 5 : 2;
    if (length === "long") return item.numberOfSeasons > 4 ? 5 : 1;
  }
  return 2;
}

function moodAffinity(item: MediaItem, mood: MoodKey | null): number {
  if (!mood) return 0.5;
  const weights = MOOD_GENRE_WEIGHTS[mood];
  if (!weights) return 0.4;
  const scores = item.genres.map((g) => weights[g] ?? 0);
  if (!scores.length) return 0.2;
  return Math.min(1, Math.max(...scores) * 0.7 + (scores.reduce((a, b) => a + b, 0) / scores.length) * 0.3);
}

export function scoreItem(item: MediaItem, answers: QuizAnswers): number {
  let score = 0;
  let max = 0;

  // Genre match — up to 30
  if (answers.genres.length) {
    max += 30;
    const hits = answers.genres.filter((g) => item.genres.includes(g)).length;
    score += 30 * Math.min(1, hits / Math.min(2, answers.genres.length));
  }

  // Mood match — up to 30
  max += 30;
  score += 30 * moodAffinity(item, answers.mood);

  // Content type match — up to 15
  max += 15;
  if (!answers.want || answers.want === "either") score += 15;
  else score += item.type === answers.want ? 15 : 0;

  // Language match — up to 10
  if (answers.language && answers.language !== "any") {
    max += 10;
    score += item.originalLanguage === answers.language ? 10 : 0;
  } else {
    max += 4;
    score += 4;
  }

  // Rating preference — up to 10
  max += 10;
  score += ratingPrefScore(item, answers.ratingPref);

  // Era — up to 5
  max += 5;
  score += eraScore(item, answers.era);

  // Pace — up to 10
  max += 10;
  score += paceScore(item, answers.pacing);

  // Length — up to 5
  max += 5;
  score += lengthScore(item, answers.length);

  // Baseline popularity nudge — up to 5 (keeps ties sensible, never dominates)
  max += 5;
  score += (item.popularity / 100) * 5;

  // Adventurousness reshapes the curve rather than adding flat points
  if (answers.adventure === "familiar") {
    score *= 1; // straightforward best-match ranking
  } else if (answers.adventure === "different") {
    // Slightly reward titles that satisfy mood but sit outside the exact genre list
    const exactGenreOverlap = answers.genres.length && answers.genres.every((g) => item.genres.includes(g));
    if (!exactGenreOverlap && moodAffinity(item, answers.mood) > 0.4) score += max * 0.05;
  } else if (answers.adventure === "surprise") {
    score += max * 0.08 * (0.5 - Math.abs(0.5 - (item.id % 100) / 100)); // gentle deterministic shuffle
  }

  const pct = max > 0 ? (score / max) * 100 : 50;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

function toScored(items: MediaItem[], answers: QuizAnswers): ScoredMedia[] {
  return items.map((item) => ({ ...item, match: scoreItem(item, answers) }));
}

export function buildRecommendations(catalog: MediaItem[], answers: QuizAnswers): RecommendationBundle {
  const pool = answers.want && answers.want !== "either" ? catalog.filter((m) => m.type === answers.want) : catalog;
  const scored = toScored(pool, answers).sort((a, b) => b.match - a.match);
  const usedIds = new Set<string>();
  const take = (arr: ScoredMedia[], n: number, mark = true) => {
    const chosen = arr.filter((m) => !usedIds.has(`${m.type}-${m.id}`)).slice(0, n);
    if (mark) chosen.forEach((m) => usedIds.add(`${m.type}-${m.id}`));
    return chosen;
  };

  const perfectMatch = take(scored, 10);

  const alsoLikeSorted = [...scored].sort((a, b) => {
    const genreOverlapA = answers.genres.filter((g) => a.genres.includes(g)).length;
    const genreOverlapB = answers.genres.filter((g) => b.genres.includes(g)).length;
    return genreOverlapB - genreOverlapA || b.match - a.match;
  });
  const alsoLike = take(alsoLikeSorted, 8);

  const hiddenGemsSorted = [...scored]
    .filter((m) => m.rating >= 7.3 && m.popularity < 55)
    .sort((a, b) => b.rating - a.rating);
  const hiddenGems = take(hiddenGemsSorted, 8);

  const differentSorted = [...toScored(catalog, answers)]
    .filter((m) => (!answers.want || answers.want === "either" || m.type !== answers.want) || (answers.genres.length > 0 && !answers.genres.some((g) => m.genres.includes(g))))
    .sort((a, b) => b.rating - a.rating);
  const different = take(differentSorted, 8);

  const popularSorted = [...toScored(pool, answers)].sort((a, b) => b.popularity - a.popularity);
  const popular = take(popularSorted, 8, false);

  const allTimeSorted = [...toScored(pool, answers)].sort(
    (a, b) => b.rating * Math.log10(b.voteCount + 10) - a.rating * Math.log10(a.voteCount + 10)
  );
  const allTime = take(allTimeSorted, 8, false);

  return { perfectMatch, alsoLike, hiddenGems, different, popular, allTime };
}
