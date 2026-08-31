"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, SkipForward } from "lucide-react";
import { QUIZ_STEPS } from "./quiz-data";
import { emptyQuizAnswers, QuizAnswers } from "@/lib/types";
import { MarqueeDivider } from "../MarqueeDivider";

export function Quiz() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(emptyQuizAnswers);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [finishing, setFinishing] = useState(false);

  const step = QUIZ_STEPS[stepIndex];
  const progress = Math.round(((stepIndex + 1) / QUIZ_STEPS.length) * 100);

  const finish = (finalAnswers: QuizAnswers) => {
    setFinishing(true);
    sessionStorage.setItem("cinemood.quiz", JSON.stringify(finalAnswers));
    setTimeout(() => router.push("/results"), 900);
  };

  const goNext = () => {
    if (stepIndex === QUIZ_STEPS.length - 1) {
      finish(answers);
      return;
    }
    setDirection(1);
    setStepIndex((i) => i + 1);
  };

  const goBack = () => {
    if (stepIndex === 0) return;
    setDirection(-1);
    setStepIndex((i) => i - 1);
  };

  const selectSingle = (value: string) => {
    setAnswers((a) => ({ ...a, [step.key]: value }));
    setDirection(1);
    setTimeout(() => {
      if (stepIndex === QUIZ_STEPS.length - 1) finish({ ...answers, [step.key]: value });
      else setStepIndex((i) => i + 1);
    }, 260);
  };

  const toggleMulti = (value: string) => {
    setAnswers((a) => {
      const current = (a[step.key] as string[]) ?? [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...a, [step.key]: next };
    });
  };

  const currentMultiValues = useMemo(() => (step.multi ? ((answers[step.key] as string[]) ?? []) : []), [answers, step]);
  const currentSingleValue = step.multi ? null : (answers[step.key] as string | null);

  if (finishing) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <MarqueeDivider />
        <h2 className="font-display text-2xl font-semibold text-paper sm:text-3xl">Perfect. We found your vibe.</h2>
        <p className="text-paper-dim">Rolling out your picks…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col justify-center px-5 py-16 sm:px-8">
      <div className="mb-10">
        <div className="mb-2 flex items-center justify-between font-mono text-xs text-paper-faint">
          <span>Step {stepIndex + 1} of {QUIZ_STEPS.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-ink-raised">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-dusk to-marquee"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step.key}
          custom={direction}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <h2 className="text-balance font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
            {step.title}
          </h2>
          {step.subtitle && <p className="mt-2 text-paper-dim">{step.subtitle}</p>}

          <div className={`mt-8 grid gap-3 ${step.options.length > 8 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3"}`}>
            {step.options.map((opt) => {
              const selected = step.multi ? currentMultiValues.includes(opt.value) : currentSingleValue === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => (step.multi ? toggleMulti(opt.value) : selectSingle(opt.value))}
                  className={`flex flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-5 text-center transition-all duration-200 ${
                    selected
                      ? "border-marquee bg-marquee/10 text-paper shadow-[0_0_0_1px_rgba(232,163,61,0.4)]"
                      : "border-line bg-ink-raised text-paper-dim hover:border-paper-faint hover:text-paper"
                  }`}
                >
                  {opt.emoji && <span className="text-2xl">{opt.emoji}</span>}
                  <span className="text-sm font-medium leading-tight">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={goBack}
          disabled={stepIndex === 0}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-paper-dim transition-colors hover:text-paper disabled:opacity-30"
        >
          <ArrowLeft size={15} /> Back
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={goNext}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-paper-faint transition-colors hover:text-paper"
          >
            Skip <SkipForward size={14} />
          </button>
          <button
            onClick={goNext}
            className="flex items-center gap-1.5 rounded-full bg-marquee px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-105"
          >
            {stepIndex === QUIZ_STEPS.length - 1 ? "See my picks" : "Continue"} <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
