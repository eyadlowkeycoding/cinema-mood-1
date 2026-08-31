"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import { MarqueeDivider } from "./MarqueeDivider";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-5 pt-16 sm:px-8">
      {/* ambient cinema backdrop — layered gradients standing in for a poster collage */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_15%,rgba(107,92,165,0.28)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_85%_25%,rgba(232,163,61,0.22)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_100%,rgba(198,67,43,0.16)_0%,transparent_65%)]" />
        <motion.div
          className="absolute -inset-x-20 top-1/3 h-[60vh] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(232,163,61,0.08),transparent_30%,rgba(107,92,165,0.1),transparent_70%)]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 rounded-full border border-line px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-paper-dim"
        >
          Mood-first discovery
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-balance font-display text-4xl font-semibold leading-[1.05] text-paper sm:text-6xl md:text-7xl"
        >
          What are you in the <span className="text-marquee">mood</span> to watch?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22 }}
          className="mt-6 max-w-xl text-balance text-base text-paper-dim sm:text-lg"
        >
          CineMood reads your mood, pace, and taste, then matches you with movies and series worth your evening — not just what&apos;s trending.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.34 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link
            href="/quiz"
            className="group flex items-center gap-2 rounded-full bg-marquee px-7 py-3.5 text-sm font-semibold text-ink shadow-[0_8px_30px_rgba(232,163,61,0.25)] transition-transform hover:scale-105"
          >
            Find My Watch
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/discover"
            className="flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-medium text-paper-dim transition-colors hover:border-paper-faint hover:text-paper"
          >
            <Compass size={16} />
            Explore Movies &amp; Series
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-16">
          <MarqueeDivider />
        </motion.div>
      </div>
    </section>
  );
}
