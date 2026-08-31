"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Compass, Film, Home, Search, Tv, UserRound } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/series", label: "Series", icon: Tv },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/watchlist", label: "Watchlist", icon: Bookmark },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-ink/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-paper">
            <span className="text-marquee">●</span>
            CineMood
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {LINKS.map(({ href, label }) => {
              const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`text-sm font-medium transition-colors ${
                    active ? "text-marquee" : "text-paper-dim hover:text-paper"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/search" aria-label="Search" className="text-paper-dim transition-colors hover:text-paper">
              <Search size={19} />
            </Link>
            <button aria-label="Profile" className="hidden text-paper-dim transition-colors hover:text-paper sm:block">
              <UserRound size={19} />
            </button>
          </div>
        </div>
      </header>

      {/* mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-line/60 bg-ink/95 py-2 backdrop-blur-lg md:hidden">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-2 py-1 text-[10px] ${
                active ? "text-marquee" : "text-paper-faint"
              }`}
            >
              <Icon size={19} />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
