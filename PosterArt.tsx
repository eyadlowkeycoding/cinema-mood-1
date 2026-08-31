import { MediaItem } from "@/lib/types";

const PALETTES: [string, string][] = [
  ["#E8A33D", "#0a0a0d"],
  ["#6B5CA5", "#0a0a0d"],
  ["#C6432B", "#0a0a0d"],
  ["#3d7a8a", "#0a0a0d"],
  ["#5a8a4d", "#0a0a0d"],
];

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const GENRE_GLYPH: Record<string, string> = {
  Action: "◆", Adventure: "▲", Comedy: "☺", Drama: "◉", Romance: "♡",
  Thriller: "!", Horror: "☠", Mystery: "?", "Sci-Fi": "✦", Fantasy: "✶",
  Crime: "◈", Animation: "✺", Documentary: "▣", Historical: "⌛",
  Family: "❀", War: "✕", Musical: "♪", Western: "☆",
};

/**
 * A designed placeholder poster — used instead of guessing at real image URLs.
 * Deterministic per title so the same title always renders the same look.
 */
export function PosterArt({ item, className = "" }: { item: Pick<MediaItem, "title" | "genres">; className?: string }) {
  const h = hashStr(item.title);
  const [accent, base] = PALETTES[h % PALETTES.length];
  const glyph = GENRE_GLYPH[item.genres[0]] ?? "✦";
  const initial = item.title.trim()[0]?.toUpperCase() ?? "?";

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{ background: `radial-gradient(120% 90% at 50% 0%, ${accent}33 0%, ${base} 65%)` }}
    >
      {/* concentric spotlight rings — signature marquee motif */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="absolute rounded-full border"
            style={{ width: `${n * 70}%`, height: `${n * 70}%`, borderColor: `${accent}55` }}
          />
        ))}
      </div>
      <div className="relative z-10 flex flex-col items-center gap-2 px-3 text-center">
        <span className="text-3xl" style={{ color: accent }}>{glyph}</span>
        <span className="font-display text-lg leading-tight text-paper/90" style={{ fontWeight: 600 }}>
          {initial}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute inset-x-2 bottom-2 line-clamp-2 text-center font-display text-[11px] leading-tight text-paper/80">
        {item.title}
      </div>
    </div>
  );
}
