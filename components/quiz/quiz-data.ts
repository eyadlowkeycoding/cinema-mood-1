import { MOOD_LABELS } from "@/lib/genres";
import { MoodKey, QuizAnswers } from "@/lib/types";

export interface QuizOption {
  value: string;
  label: string;
  emoji?: string;
}

export interface QuizStepConfig {
  key: keyof QuizAnswers;
  title: string;
  subtitle?: string;
  multi?: boolean;
  skippable: true;
  options: QuizOption[];
}

const moodOptions: QuizOption[] = (Object.keys(MOOD_LABELS) as MoodKey[]).map((key) => ({
  value: key,
  label: MOOD_LABELS[key].label,
  emoji: MOOD_LABELS[key].emoji,
}));

export const QUIZ_STEPS: QuizStepConfig[] = [
  {
    key: "mood",
    title: "What are you feeling right now?",
    subtitle: "There's no wrong answer — go with your gut.",
    skippable: true,
    options: moodOptions,
  },
  {
    key: "want",
    title: "What sounds good tonight?",
    skippable: true,
    options: [
      { value: "movie", label: "A Movie", emoji: "🎬" },
      { value: "tv", label: "A TV Series", emoji: "📺" },
      { value: "either", label: "Either works", emoji: "🤷" },
    ],
  },
  {
    key: "genres",
    title: "Pick a few genres you're craving",
    subtitle: "Choose as many as you like.",
    multi: true,
    skippable: true,
    options: [
      "Action", "Adventure", "Comedy", "Drama", "Romance", "Thriller", "Horror",
      "Mystery", "Sci-Fi", "Fantasy", "Crime", "Animation", "Documentary",
      "Historical", "Family", "War", "Musical", "Western",
    ].map((g) => ({ value: g, label: g })),
  },
  {
    key: "pacing",
    title: "What kind of pace do you want?",
    skippable: true,
    options: [
      { value: "slow", label: "Slow & atmospheric", emoji: "🌊" },
      { value: "balanced", label: "Balanced", emoji: "⚖️" },
      { value: "fast", label: "Fast-paced", emoji: "⚡" },
      { value: "any", label: "Doesn't matter", emoji: "✨" },
    ],
  },
  {
    key: "era",
    title: "Any era in mind?",
    skippable: true,
    options: [
      { value: "classic", label: "Classic (pre-1970)" },
      { value: "70s", label: "70s" },
      { value: "80s", label: "80s" },
      { value: "90s", label: "90s" },
      { value: "2000s", label: "2000s" },
      { value: "2010s", label: "2010s" },
      { value: "2020s", label: "2020s" },
      { value: "any", label: "Doesn't matter" },
    ],
  },
  {
    key: "length",
    title: "How much time do you have?",
    subtitle: "Movie runtime or series length — whichever applies.",
    skippable: true,
    options: [
      { value: "short", label: "Short & tight" },
      { value: "medium", label: "Standard length" },
      { value: "long", label: "I've got hours" },
      { value: "any", label: "Doesn't matter" },
    ],
  },
  {
    key: "language",
    title: "Preferred language?",
    skippable: true,
    options: [
      { value: "en", label: "English" },
      { value: "ar", label: "Arabic" },
      { value: "ko", label: "Korean" },
      { value: "ja", label: "Japanese" },
      { value: "es", label: "Spanish" },
      { value: "fr", label: "French" },
      { value: "de", label: "German" },
      { value: "any", label: "Any language" },
    ],
  },
  {
    key: "ratingPref",
    title: "How highly rated should it be?",
    skippable: true,
    options: [
      { value: "hidden", label: "Hidden gems", emoji: "💎" },
      { value: "popular", label: "Popular", emoji: "🔥" },
      { value: "high", label: "Highly rated", emoji: "⭐" },
      { value: "best", label: "The best of the best", emoji: "🏆" },
    ],
  },
  {
    key: "companion",
    title: "Watching alone or with others?",
    skippable: true,
    options: [
      { value: "alone", label: "Alone", emoji: "🧍" },
      { value: "friends", label: "With friends", emoji: "🎉" },
      { value: "family", label: "With family", emoji: "👨‍👩‍👧" },
      { value: "someone", label: "With someone special", emoji: "💞" },
      { value: "any", label: "Doesn't matter", emoji: "✨" },
    ],
  },
  {
    key: "adventure",
    title: "How adventurous are you feeling?",
    skippable: true,
    options: [
      { value: "familiar", label: "Give me something familiar", emoji: "🛋️" },
      { value: "different", label: "Something different", emoji: "🧭" },
      { value: "surprise", label: "Surprise me", emoji: "🎲" },
    ],
  },
];
