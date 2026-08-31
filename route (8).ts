import { NextRequest, NextResponse } from "next/server";
import { getSeasonEpisodes } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get("id"));
  const season = Number(req.nextUrl.searchParams.get("season") ?? 1);
  const fallbackCount = Number(req.nextUrl.searchParams.get("fallbackCount") ?? 8);
  if (!id) return NextResponse.json({ episodes: [] }, { status: 400 });
  const episodes = await getSeasonEpisodes(id, season, fallbackCount);
  return NextResponse.json({ episodes });
}
