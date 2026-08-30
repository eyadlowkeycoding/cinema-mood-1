import { NextRequest, NextResponse } from "next/server";
import { MediaItem, MediaType, QuizAnswers } from "@/lib/types";
import { buildRecommendations } from "@/lib/recommendations";
import { discover, getPopular, getTopRated, getTrending, hasApiKey } from "@/lib/tmdb";
import { FALLBACK_CATALOG } from "@/lib/fallback-data";

function dedupe(items: MediaItem[]): MediaItem[] {
  const seen = new Set<string>();
  const out: MediaItem[] = [];
  for (const item of items) {
    const key = `${item.type}-${item.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

async function buildPool(answers: QuizAnswers): Promise<MediaItem[]> {
  if (!hasApiKey()) return FALLBACK_CATALOG;

  const types: MediaType[] = answers.want && answers.want !== "either" ? [answers.want] : ["movie", "tv"];
  const calls: Promise<MediaItem[]>[] = [];
  for (const t of types) {
    calls.push(getTrending(t, 20), getTopRated(t, 20), getPopular(t, 20));
    calls.push(discover(t, { sort: "rating", minRating: 7 }));
    if (answers.genres[0]) calls.push(discover(t, { genre: answers.genres[0], sort: "popularity" }));
    if (answers.language && answers.language !== "any") calls.push(discover(t, { language: answers.language, sort: "rating" }));
  }
  const results = await Promise.all(calls);
  return dedupe(results.flat());
}

export async function POST(req: NextRequest) {
  try {
    const answers = (await req.json()) as QuizAnswers;
    const pool = await buildPool(answers);
    const bundle = buildRecommendations(pool, answers);
    return NextResponse.json(bundle);
  } catch {
    return NextResponse.json({ error: "Failed to build recommendations." }, { status: 500 });
  }
}
