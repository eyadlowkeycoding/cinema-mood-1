import { NextRequest, NextResponse } from "next/server";
import { discover } from "@/lib/tmdb";
import { MediaType } from "@/lib/types";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const type = (sp.get("type") ?? "movie") as MediaType;
  const genre = sp.get("genre") ?? undefined;
  const year = sp.get("year") ? Number(sp.get("year")) : undefined;
  const language = sp.get("language") ?? undefined;
  const minRating = sp.get("minRating") ? Number(sp.get("minRating")) : undefined;
  const sort = (sp.get("sort") as "rating" | "popularity" | "newest" | null) ?? "popularity";
  const page = sp.get("page") ? Number(sp.get("page")) : 1;

  const items = await discover(type, { genre, year, language, minRating, sort, page });
  return NextResponse.json({ items });
}
