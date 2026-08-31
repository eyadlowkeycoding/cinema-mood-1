import { HeroSkeleton, GridSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="pb-24 md:pb-16">
      <HeroSkeleton />
      <div className="px-5 py-10 sm:px-8">
        <GridSkeleton />
      </div>
    </div>
  );
}
