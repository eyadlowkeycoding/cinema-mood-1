import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { searchMulti, hasApiKey, imageUrl } from "@/lib/tmdb";
import { FALLBACK_CATALOG } from "@/lib/fallback-data";

const API_KEY = process.env.TMDB_API_KEY;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (!q.trim()) return NextResponse.json({ movies: [], series: [], people: [] });

  const { movies, series } = await searchMulti(q, 12);

  let people: { name: string; knownFor: string; profilePath: string | null }[] = [];

  if (hasApiKey()) {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        people = (data.results ?? []).slice(0, 6).map((p: { name: string; known_for_department: string; profile_path: string | null }) => ({
          name: p.name,
          knownFor: p.known_for_department,
          profilePath: imageUrl(p.profile_path, "w200"),
        }));
      }
    } catch {
      // ignore, fall through with empty people
    }
  } else {
    const ql = q.toLowerCase();
    const names = new Set<string>();
    FALLBACK_CATALOG.forEach((m) => {
      [...(m.cast ?? []), ...(m.director ? [m.director] : [])].forEach((name) => {
        if (name.toLowerCase().includes(ql)) names.add(name);
      });
    });
    people = Array.from(names)
      .slice(0, 6)
      .map((name) => ({ name, knownFor: "Film & TV", profilePath: null }));
  }

  return NextResponse.json({ movies, series, people });
}
