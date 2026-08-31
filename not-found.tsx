import Link from "next/link";
import { MarqueeDivider } from "@/components/MarqueeDivider";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-6 pt-20 text-center">
      <MarqueeDivider />
      <h1 className="font-display text-3xl font-semibold text-paper">We couldn&apos;t find that title.</h1>
      <p className="text-paper-dim">It may have been removed, or the link is broken.</p>
      <Link href="/" className="mt-2 rounded-full bg-marquee px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-105">
        Back to Home
      </Link>
    </div>
  );
}
