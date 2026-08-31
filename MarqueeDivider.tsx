export function MarqueeDivider({ className = "" }: { className?: string }) {
  const bulbs = Array.from({ length: 24 });
  return (
    <div className={`flex items-center justify-center gap-2.5 ${className}`} aria-hidden="true">
      {bulbs.map((_, i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-marquee animate-marquee-blink"
          style={{ animationDelay: `${(i % 8) * 0.15}s` }}
        />
      ))}
    </div>
  );
}
