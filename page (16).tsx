import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Star } from "lucide-react";
import { getDetails, getWatchProviders, imageUrl } from "@/lib/tmdb";
import { DetailActions } from "@/components/DetailActions";
import { MediaCarousel } from "@/components/MediaCarousel";
import { PosterArt } from "@/components/PosterArt";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = await getDetails("movie", Number(id));
  if (!item) return { title: "Movie not found" };
  return {
    title: item.title,
    description: item.overview?.slice(0, 155),
    openGraph: { title: item.title, description: item.overview?.slice(0, 155) },
  };
}

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getDetails("movie", Number(id));
  if (!item) notFound();

  const providers = await getWatchProviders("movie", item.id);
  const backdrop = imageUrl(item.backdropPath, "original");
  const poster = imageUrl(item.posterPath, "w500");

  return (
    <div className="pb-24 md:pb-16">
      <div className="relative flex min-h-[60vh] items-end overflow-hidden pt-28">
        <div className="absolute inset-0">
          {backdrop ? (
            <Image src={backdrop} alt="" fill priority className="object-cover" />
          ) : (
            <div className="h-full w-full opacity-30"><PosterArt item={item} /></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:px-8">
          <div className="relative hidden aspect-[2/3] w-48 shrink-0 overflow-hidden rounded-2xl ring-1 ring-line/60 shadow-2xl sm:block">
            {poster ? <Image src={poster} alt={item.title} fill className="object-cover" /> : <PosterArt item={item} />}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap gap-2">
              {item.genres.map((g) => (
                <span key={g} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-paper-dim">{g}</span>
              ))}
            </div>
            <h1 className="mt-3 text-balance font-display text-3xl font-semibold text-paper sm:text-5xl">{item.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-sm text-paper-dim">
              <span>{item.year}</span>
              <span className="flex items-center gap-1"><Star size={14} className="fill-marquee text-marquee" /> {item.rating.toFixed(1)}</span>
              {item.runtime && <span className="flex items-center gap-1"><Clock size={14} /> {item.runtime} min</span>}
            </div>
            <p className="mt-5 max-w-2xl text-balance text-paper-dim">{item.overview}</p>
            <div className="mt-6 flex flex-wrap gap-6 text-sm">
              <div><span className="text-paper-faint">Director</span><div className="text-paper">{item.director}</div></div>
              {item.cast.length > 0 && (
                <div><span className="text-paper-faint">Cast</span><div className="text-paper">{item.cast.slice(0, 4).join(", ")}</div></div>
              )}
            </div>
            <div className="mt-8">
              <DetailActions item={item} />
            </div>
          </div>
        </div>
      </div>

      {providers && (
        <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          <h2 className="mb-3 font-display text-lg font-semibold text-paper">Where to Watch</h2>
          <div className="flex flex-wrap gap-3">
            {providers.map((p) => (
              <div key={p.name} className="flex items-center gap-2 rounded-full border border-line bg-ink-raised px-4 py-2 text-sm text-paper-dim">
                {p.logoPath && <Image src={imageUrl(p.logoPath, "w200")!} alt={p.name} width={20} height={20} className="rounded" />}
                {p.name}
              </div>
            ))}
          </div>
        </section>
      )}

      {item.similar.length > 0 && <MediaCarousel title="Similar Movies" items={item.similar} />}
    </div>
  );
}
