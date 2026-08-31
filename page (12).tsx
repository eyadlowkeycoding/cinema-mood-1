"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RefreshCw, Shuffle } from "lucide-react";
import { QuizAnswers, RecommendationBundle } from "@/lib/types";
import { MediaCarousel } from "@/components/MediaCarousel";
import { MarqueeDivider } from "@/components/MarqueeDivider";
import { MOOD_LABELS } from "@/lib/genres";
import { ErrorState } from "@/components/Skeleton";

export default function ResultsPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [bundle, setBundle] = useState<RecommendationBundle | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("cinemood.quiz");
    if (!raw) {
      router.replace("/quiz");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnswers(JSON.parse(raw));
  }, [router]);

  const fetchRecs = async (a: QuizAnswers) => {
    setError(false);
    setBundle(null);
    try {
      const res = await fetch("/api/recommend", { method: "POST", body: JSON.stringify(a) });
      if (!res.ok) throw new Error("bad response");
      setBundle(await res.json());
    } catch {
      setError(true);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (answers) fetchRecs(answers);
  }, [answers]);

  if (!answers) return null;

  const moodLabel = answers.mood ? MOOD_LABELS[answers.mood] : null;

  return (
    <div className="pb-24 pt-28 md:pb-16">
      <div className="px-5 text-center sm:px-8">
        <MarqueeDivider className="mb-6" />
        <h1 className="text-balance font-display text-3xl font-semibold text-paper sm:text-5xl">Your Perfect Watches</h1>
        <p className="mt-3 text-paper-dim">
          Based on your mood{moodLabel ? ` — ${moodLabel.emoji} ${moodLabel.label.toLowerCase()}` : ""} and preferences
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/quiz"
            className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-paper-dim transition-colors hover:border-marquee hover:text-paper"
          >
            <RefreshCw size={14} /> Retake quiz
          </Link>
          <button
            onClick={() => fetchRecs(answers)}
            className="flex items-center gap-1.5 rounded-full bg-marquee px-4 py-2 text-sm font-semibold text-ink transition-transform hover:scale-105"
          >
            <Shuffle size={14} /> Refresh picks
          </button>
        </div>
      </div>

      {error && <ErrorState onRetry={() => fetchRecs(answers)} />}

      {!error && (
        <div className="mt-6">
          <MediaCarousel title="Perfect Match" subtitle="Our strongest recommendations for you" items={bundle?.perfectMatch} loading={!bundle} />
          <MediaCarousel title="You Might Also Like" subtitle="Similar in tone and genre" items={bundle?.alsoLike} loading={!bundle} />
          <MediaCarousel title="Hidden Gems" subtitle="Excellent, less obvious picks" items={bundle?.hiddenGems} loading={!bundle} />
          <MediaCarousel title="If You Want Something Different" subtitle="A step outside your usual picks" items={bundle?.different} loading={!bundle} />
          <MediaCarousel title="Popular Right Now" items={bundle?.popular} loading={!bundle} />
          <MediaCarousel title="All-Time Greats" items={bundle?.allTime} loading={!bundle} />
        </div>
      )}
    </div>
  );
}
