import type { Metadata } from "next";
import { Quiz } from "@/components/quiz/Quiz";

export const metadata: Metadata = {
  title: "Mood Quiz — CineMood",
  description: "Answer a few quick questions and let CineMood find your perfect movie or series.",
};

export default function QuizPage() {
  return <Quiz />;
}
