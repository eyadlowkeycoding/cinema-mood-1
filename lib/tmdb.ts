import "server-only";
import { MediaDetails, MediaItem, MediaType } from "./types";
import { genresFromTmdbIds, moodsFromGenres } from "./genres";
import { FALLBACK_CATALOG, fallbackById } from "./fallback-data";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

export const hasApiKey = () => Boolean(API_KEY);

export function imageUrl(path: string | null, size: "w200" | "w342" | "w500" | "w780" | "original" = "w500") {
  if (!path) return null;
  return `${IMG_BASE}/${size}${path}`;
}

async function tmdbFetch<T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<T | null> {
  if (!API_KEY) return null;
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api_key", API_KEY);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) url.searchParams.set(k, String(v));
  });
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// -------- normalization --------

interface RawTmdbItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  original_language: string;
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  episode_run_time?: number[];
}

const LANG_NAMES: Record<string, string> = {
  en: "English", ar: "Arabic", ko: "Korean", ja: "Japanese", es: "Spanish",
  fr: "French", de: "German", it: "Italian", pt: "Portuguese", hi: "Hindi",
  zh: "Chinese", ru: "Russian",
};

function normalizeTmdb(raw: RawTmdbItem, type: MediaType): MediaItem {
  const genreIds = raw.genre_ids ?? raw.genres?.map((g) => g.id) ?? [];
  const genres = raw.genres?.length ? raw.genres.map((g) => g.name) : genresFromTmdbIds(genreIds);
  const dateStr = raw.release_date || raw.first_air_date || "";
  const year = dateStr ? parseInt(dateStr.slice(0, 4), 10) : 0;
  return {
    id: raw.id,
    type,
    title: raw.title || raw.name || "Untitled",
    year,
    overview: raw.overview,
    posterPath: raw.poster_path,
    backdropPath: raw.backdrop_path,
    rating: Math.round((raw.vote_average ?? 0) * 10) / 10,
    voteCount: raw.vote_count ?? 0,
    popularity: Math.min(100, Math.round((raw.popularity ?? 0))),
    genres,
    language: LANG_NAMES[raw.original_language] ?? raw.original_language,
    originalLanguage: raw.original_language,
    runtime: raw.runtime ?? (raw.episode_run_time?.[0] ?? null),
    numberOfSeasons: raw.number_of_seasons ?? null,
    numberOfEpisodes: raw.number_of_episodes ?? null,
    moods: moodsFromGenres(genres),
    trailerKey: null,
  };
}

// -------- fallback-mode helpers --------

function fbList(type: MediaType | "all"): MediaItem[] {
  return type === "all" ? FALLBACK_CATALOG : FALLBACK_CATALOG.filter((m) => m.type === type);
}

function sortBy<T>(arr: T[], key: (x: T) => number): T[] {
  return [...arr].sort((a, b) => key(b) - key(a));
}

export interface DiscoverParams {
  genre?: string;
  year?: number;
  language?: string; // ISO code
  minRating?: number;
  sort?: "rating" | "popularity" | "newest";
  page?: number;
}

export async function getTrending(type: MediaType, limit = 20): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: RawTmdbItem[] }>(`/trending/${type}/week`);
  if (data) return data.results.slice(0, limit).map((r) => normalizeTmdb(r, type));
  return sortBy(fbList(type), (m) => m.popularity).slice(0, limit);
}

export async function getTopRated(type: MediaType, limit = 20): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: RawTmdbItem[] }>(`/${type}/top_rated`);
  if (data) return data.results.slice(0, limit).map((r) => normalizeTmdb(r, type));
  return sortBy(fbList(type), (m) => m.rating).slice(0, limit);
}

export async function getPopular(type: MediaType, limit = 20): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: RawTmdbItem[] }>(`/${type}/popular`);
  if (data) return data.results.slice(0, limit).map((r) => normalizeTmdb(r, type));
  return sortBy(fbList(type), (m) => m.popularity).slice(0, limit);
}

export async function getNewReleases(type: MediaType, limit = 20): Promise<MediaItem[]> {
  const path = type === "movie" ? "/movie/now_playing" : "/tv/on_the_air";
  const data = await tmdbFetch<{ results: RawTmdbItem[] }>(path);
  if (data) return data.results.slice(0, limit).map((r) => normalizeTmdb(r, type));
  return sortBy(fbList(type), (m) => m.year).slice(0, limit);
}

export async function getHiddenGems(type: MediaType, limit = 20): Promise<MediaItem[]> {
  // High rating, lower popularity/vote-count — "gems" heuristic works in both modes.
  const data = await tmdbFetch<{ results: RawTmdbItem[] }>(`/discover/${type}`, {
    sort_by: "vote_average.desc",
    "vote_count.gte": 50,
    "vote_count.lte": 2000,
  });
  if (data) return data.results.slice(0, limit).map((r) => normalizeTmdb(r, type));
  return sortBy(
    fbList(type).filter((m) => m.rating >= 7.5 && m.popularity < 55),
    (m) => m.rating
  ).slice(0, limit);
}

export async function getAllTimeGreats(type: MediaType, limit = 20): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: RawTmdbItem[] }>(`/discover/${type}`, {
    sort_by: "vote_average.desc",
    "vote_count.gte": 3000,
  });
  if (data) return data.results.slice(0, limit).map((r) => normalizeTmdb(r, type));
  return sortBy(fbList(type), (m) => m.rating * Math.log10(m.voteCount + 1)).slice(0, limit);
}

export async function discover(type: MediaType, params: DiscoverParams = {}): Promise<MediaItem[]> {
  const sortMap = { rating: "vote_average.desc", popularity: "popularity.desc", newest: type === "movie" ? "release_date.desc" : "first_air_date.desc" };
  const data = await tmdbFetch<{ results: RawTmdbItem[] }>(`/discover/${type}`, {
    sort_by: sortMap[params.sort ?? "popularity"],
    with_original_language: params.language,
    "vote_average.gte": params.minRating,
    page: params.page ?? 1,
    ...(type === "movie" ? { primary_release_year: params.year } : { first_air_date_year: params.year }),
  });
  let results: MediaItem[];
  if (data) {
    results = data.results.map((r) => normalizeTmdb(r, type));
  } else {
    results = fbList(type);
    if (params.year) results = results.filter((m) => m.year === params.year);
    if (params.language) results = results.filter((m) => m.originalLanguage === params.language);
    if (params.minRating) results = results.filter((m) => m.rating >= params.minRating!);
    const key = params.sort === "rating" ? (m: MediaItem) => m.rating : params.sort === "newest" ? (m: MediaItem) => m.year : (m: MediaItem) => m.popularity;
    results = sortBy(results, key);
  }
  if (params.genre) results = results.filter((m) => m.genres.includes(params.genre!));
  return results;
}

export async function searchMulti(query: string, limit = 20): Promise<{ movies: MediaItem[]; series: MediaItem[] }> {
  if (!query.trim()) return { movies: [], series: [] };
  const data = await tmdbFetch<{ results: (RawTmdbItem & { media_type: string })[] }>("/search/multi", { query });
  if (data) {
    const movies = data.results.filter((r) => r.media_type === "movie").slice(0, limit).map((r) => normalizeTmdb(r, "movie"));
    const series = data.results.filter((r) => r.media_type === "tv").slice(0, limit).map((r) => normalizeTmdb(r, "tv"));
    return { movies, series };
  }
  const q = query.toLowerCase();
  const hits = FALLBACK_CATALOG.filter((m) => m.title.toLowerCase().includes(q) || m.cast?.some((c) => c.toLowerCase().includes(q)) || m.director?.toLowerCase().includes(q));
  return {
    movies: hits.filter((m) => m.type === "movie").slice(0, limit),
    series: hits.filter((m) => m.type === "tv").slice(0, limit),
  };
}

export async function getDetails(type: MediaType, id: number): Promise<MediaDetails | null> {
  const data = await tmdbFetch<RawTmdbItem & {
    credits?: { cast: { name: string }[]; crew: { name: string; job: string }[] };
    videos?: { results: { key: string; site: string; type: string }[] };
    similar?: { results: RawTmdbItem[] };
    seasons?: { season_number: number; name: string; episode_count: number }[];
  }>(`/${type}/${id}`, { append_to_response: "credits,videos,similar" });

  if (data) {
    const base = normalizeTmdb(data, type);
    const director = data.credits?.crew.find((c) => c.job === "Director")?.name ?? data.credits?.crew[0]?.name ?? "Unknown";
    const cast = data.credits?.cast.slice(0, 6).map((c) => c.name) ?? [];
    const trailer = data.videos?.results.find((v) => v.site === "YouTube" && v.type === "Trailer");
    const similar = (data.similar?.results ?? []).slice(0, 12).map((r) => normalizeTmdb(r, type));
    return {
      ...base,
      director,
      cast,
      trailerKey: trailer?.key ?? null,
      similar,
      seasons: data.seasons?.map((s) => ({ seasonNumber: s.season_number, name: s.name, episodeCount: s.episode_count })),
    };
  }

  if (API_KEY) return null; // API configured but this title/id was not found there
  const fb = fallbackById(type, id);
  if (!fb) return null;
  const similar = FALLBACK_CATALOG.filter((m) => m.type === type && m.id !== id && m.genres.some((g) => fb.genres.includes(g))).slice(0, 8);
  return {
    ...fb,
    director: fb.director ?? "Unknown",
    cast: fb.cast ?? [],
    similar,
    seasons: fb.numberOfSeasons
      ? Array.from({ length: fb.numberOfSeasons }, (_, i) => ({ seasonNumber: i + 1, name: `Season ${i + 1}`, episodeCount: Math.round((fb.numberOfEpisodes ?? fb.numberOfSeasons! * 8) / fb.numberOfSeasons!) }))
      : undefined,
  };
}

export interface EpisodeInfo {
  episodeNumber: number;
  name: string;
  overview: string;
  runtime: number | null;
}

export async function getSeasonEpisodes(id: number, seasonNumber: number, fallbackCount = 8): Promise<EpisodeInfo[]> {
  const data = await tmdbFetch<{ episodes: { episode_number: number; name: string; overview: string; runtime: number | null }[] }>(
    `/tv/${id}/season/${seasonNumber}`
  );
  if (data) {
    return data.episodes.map((e) => ({ episodeNumber: e.episode_number, name: e.name, overview: e.overview, runtime: e.runtime }));
  }
  // No API configured — avoid inventing episode titles/plots, just number them.
  return Array.from({ length: fallbackCount }, (_, i) => ({
    episodeNumber: i + 1,
    name: `Episode ${i + 1}`,
    overview: "",
    runtime: null,
  }));
}

export interface WatchProvider {
  name: string;
  logoPath: string | null;
}

export async function getWatchProviders(type: MediaType, id: number, region = "US"): Promise<WatchProvider[] | null> {
  const data = await tmdbFetch<{ results: Record<string, { flatrate?: { provider_name: string; logo_path: string }[] }> }>(
    `/${type}/${id}/watch/providers`
  );
  const entry = data?.results?.[region];
  if (!entry?.flatrate?.length) return null;
  return entry.flatrate.map((p) => ({ name: p.provider_name, logoPath: p.logo_path }));
}
