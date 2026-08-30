import { GridSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="px-5 pb-24 pt-28 sm:px-8 md:pb-16">
      <div className="mb-8 h-10 w-48 animate-pulse rounded bg-ink-raised" />
      <GridSkeleton />
    </div>
  );
}
