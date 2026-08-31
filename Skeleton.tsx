export function CardSkeleton() {
  return (
    <div className="w-[168px] shrink-0 sm:w-[200px]">
      <div className="aspect-[2/3] animate-pulse rounded-xl bg-ink-raised" />
      <div className="mt-2.5 h-3.5 w-3/4 animate-pulse rounded bg-ink-raised" />
      <div className="mt-1.5 h-2.5 w-1/2 animate-pulse rounded bg-ink-raised" />
    </div>
  );
}

export function HeroSkeleton() {
  return <div className="h-[70vh] w-full animate-pulse bg-ink-raised" />;
}

export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ErrorState({ message = "Something went wrong.", onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="font-display text-xl text-paper">{message}</div>
      <p className="text-sm text-paper-dim">Try again in a moment.</p>
      {onRetry && (
        <button onClick={onRetry} className="rounded-full bg-marquee px-5 py-2 text-sm font-medium text-ink transition-transform hover:scale-105">
          Try again
        </button>
      )}
    </div>
  );
}
