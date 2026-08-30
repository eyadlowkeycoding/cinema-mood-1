# CineMood

A mood-first movie & TV discovery platform. Answer a short, animated quiz about
how you're feeling and CineMood scores a catalog of titles to build a
personalized set of recommendations — Perfect Match, Hidden Gems, Popular
Right Now, and more.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion
- TMDB API (optional — see below)
- Lucide icons

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Optional: connect a real movie database

By default CineMood runs entirely on a curated, hand-picked catalog of ~70
acclaimed and popular titles (English + international), so it works with
zero configuration. To unlock the full TMDB catalog (thousands of movies and
series, real posters/backdrops, trailers, cast, "where to watch" data):

1. Create a free account at https://www.themoviedb.org and generate a v3 API key
   under Settings -> API.
2. Copy `.env.local.example` to `.env.local`.
3. Paste your key:

   ```
   TMDB_API_KEY=your_key_here
   ```

4. Restart `npm run dev`.

The API key is only ever read on the server (`lib/tmdb.ts` is marked
`server-only` and all TMDB calls happen in server components or route
handlers under `app/api/*`), so it is never bundled to the client.

## Project structure

```
app/
  page.tsx              Landing page + home sections
  quiz/                 Mood questionnaire
  results/              Scored recommendations
  movies/ series/       Genre/year/rating/language/mood filterable catalogs
  discover/             Mood-category explorer
  search/               Global search (movies, series, actors, directors)
  watchlist/            LocalStorage-backed saved titles
  movie/[id]/ tv/[id]/  Detail pages (cast, trailer, seasons, similar titles)
  api/
    recommend/          Scores a candidate pool against quiz answers
    discover/            Filtered browse queries
    search/               Multi-search proxy
    episodes/              Season -> episode listing

components/             Navbar, MediaCard, MediaCarousel, Quiz, FilterBar, etc.
lib/
  tmdb.ts               Server-only TMDB client with automatic fallback
  fallback-data.ts      Curated offline catalog
  recommendations.ts    Scoring engine (easy to retune -- see comments)
  genres.ts             Mood <-> genre weighting tables
  useWatchlist.ts        localStorage watchlist hook
```

## Notes

- No TypeScript errors, broken imports, or placeholder pages -- `npm run build`
  passes clean.
- When no `TMDB_API_KEY` is set, poster art falls back to a designed
  placeholder (rather than guessing at real image URLs), so nothing ever
  looks broken.
- The recommendation weights live in `lib/recommendations.ts` -- genre, mood,
  content type, language, rating preference, era, pace, and length each
  contribute a capped point value that's easy to adjust.
