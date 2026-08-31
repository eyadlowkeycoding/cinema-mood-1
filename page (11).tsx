import type { Metadata } from "next";
import { MoodExplorer } from "@/components/MoodExplorer";

export const metadata: Metadata = {
  title: "Discover",
  description: "Pick a mood and instantly see matching movies and series.",
};

export default function DiscoverPage() {
  return (
    <div className="pb-24 pt-28 md:pb-16">
      <div className="px-5 sm:px-8">
        <h1 className="font-display text-3xl font-semibold text-paper sm:text-5xl">Discover by Mood</h1>
        <p className="mt-2 max-w-lg text-paper-dim">Pick whatever fits tonight — results appear instantly below.</p>
      </div>
      <div className="mt-10 px-5 sm:px-8">
        <MoodExplorer />
      </div>
    </div>
  );
}
