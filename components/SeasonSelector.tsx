"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface Season {
  seasonNumber: number;
  name: string;
  episodeCount: number;
}

interface EpisodeInfo {
  episodeNumber: number;
  name: string;
  overview: string;
  runtime: number | null;
}

export function SeasonSelector({ tvId, seasons }: { tvId: number; seasons: Season[] }) {
  const [active, setActive] = useState(seasons[0]?.seasonNumber ?? 1);
  const [episodes, setEpisodes] = useState<EpisodeInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const season = seasons.find((s) => s.seasonNumber === active);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetch(`/api/episodes?id=${tvId}&season=${active}&fallbackCount=${season?.episodeCount ?? 8}`)
      .then((r) => r.json())
      .then((d) => setEpisodes(d.episodes))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, tvId]);

  if (!seasons.length) return null;

  return (
    <div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
        {seasons.map((s) => (
          <button
            key={s.seasonNumber}
            onClick={() => setActive(s.seasonNumber)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
              active === s.seasonNumber ? "border-marquee bg-marquee/10 text-marquee" : "border-line text-paper-dim hover:text-paper"
            }`}
          >
            {s.name || `Season ${s.seasonNumber}`}
          </button>
        ))}
      </div>

      <div className="mt-5 divide-y divide-line/60 rounded-2xl border border-line bg-ink-raised">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 animate-pulse" />)
        ) : (
          episodes.map((ep) => (
            <div key={ep.episodeNumber} className="flex items-center justify-between gap-4 px-4 py-3.5">
              <div>
                <div className="text-sm font-medium text-paper">
                  <span className="font-mono text-paper-faint">{String(ep.episodeNumber).padStart(2, "0")}</span>{" "}
                  {ep.name}
                </div>
                {ep.overview && <p className="mt-1 line-clamp-2 max-w-xl text-xs text-paper-dim">{ep.overview}</p>}
              </div>
              {ep.runtime && (
                <div className="flex shrink-0 items-center gap-1 font-mono text-xs text-paper-faint">
                  <Clock size={12} /> {ep.runtime}m
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
