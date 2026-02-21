"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowLeft,
  Trophy,
  RotateCcw,
  ChevronRight,
  Shuffle,
  Sparkles,
  Bot,
  ListChecks,
  PenLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fitBehavioralQuestions } from "@/lib/questions/fit-behavioral";
import { Question } from "@/types/question";

const TOTAL_IB400 = 400;

const TIPS: Record<string, string[]> = {
  "Fit & Behavioral": [
    "Always structure answers: Situation → Action → Result.",
    "For 'Why banking?', never mention money or prestige.",
    "Keep your resume walkthrough under 3 minutes — chronological, with a clear narrative.",
    "Research every firm's recent deals before interviewing.",
    "Show self-awareness when discussing weaknesses — and always include how you're improving.",
    "For 'Why our firm?', reference specific people you've networked with.",
    "Practice your stock pitch: 5 steps — thesis, business overview, financials, valuation, risks/catalysts.",
  ],
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getRankColor(accuracy: number) {
  if (accuracy >= 85) return "text-emerald-600 dark:text-emerald-400";
  if (accuracy >= 75) return "text-blue-600 dark:text-blue-400";
  if (accuracy >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function getRankLabel(accuracy: number) {
  if (accuracy >= 85) return "EB/BB Ready";
  if (accuracy >= 75) return "MM Ready";
  if (accuracy >= 60) return "Boutique Ready";
  return "Not Ready";
}

type QuizMode = "select" | "mc";

export default function QuizPage() {
  const router = useRouter();
  const [mode, setMode] = useState<QuizMode>("select");
  const [questions, setQuestions] = useState<Question[]>(fitBehavioralQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);

  const question = questions[currentIndex];
  const userAnswer = question ? answers[question.id] : undefined;
  const isRevealed = question ? !!revealed[question.id] : false;
  const isCorrect = isRevealed && userAnswer?.trim().toLowerCase() === question?.correctAnswer.trim().toLowerCase();
  const isWrong = isRevealed && !!userAnswer && !isCorrect;

  const stats = useMemo(() => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        correct++;
      }
    });
    return {
      correct,
      answered: Object.keys(answers).length,
      total: questions.length,
      accuracy: Object.keys(answers).length > 0 ? Math.round((correct / Object.keys(answers).length) * 100) : 0,
    };
  }, [answers, questions]);

  const handleSelect = useCallback(
    (choice: string) => {
      if (isRevealed || !question) return;
      setAnswers((prev) => ({ ...prev, [question.id]: choice }));
      setRevealed((prev) => ({ ...prev, [question.id]: true }));
    },
    [isRevealed, question]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  }, [currentIndex, questions.length]);

  const handleShuffle = useCallback(() => {
    setQuestions(shuffleArray(fitBehavioralQuestions));
    setCurrentIndex(0);
    setAnswers({});
    setRevealed({});
    setFinished(false);
  }, []);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setAnswers({});
    setRevealed({});
    setFinished(false);
  }, []);

  const handleBackToSelect = useCallback(() => {
    setMode("select");
    handleReset();
  }, [handleReset]);

  const randomTip = useMemo(() => {
    const tips = TIPS["Fit & Behavioral"];
    return tips[Math.floor(Math.random() * tips.length)];
  }, [currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // === MODE SELECTION SCREEN ===
  if (mode === "select") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              Quiz Engine
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Choose your practice mode to sharpen your IB interview skills
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Multiple Choice Card */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                className="cursor-pointer shadow-sm border-border/40 hover:border-primary/40 hover:shadow-md transition-all h-full group"
                onClick={() => setMode("mc")}
              >
                <CardContent className="pt-8 pb-8 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                    <ListChecks className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">Trắc Nghiệm</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Multiple Choice
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Answer multiple-choice questions covering Fit & Behavioral topics. Instant feedback with explanations.
                  </p>
                  <Badge variant="secondary" className="text-[10px]">
                    {fitBehavioralQuestions.length} questions
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>

            {/* Essay Card */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                className="cursor-pointer shadow-sm border-border/40 hover:border-primary/40 hover:shadow-md transition-all h-full group"
                onClick={() => router.push("/quiz/essay")}
              >
                <CardContent className="pt-8 pb-8 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
                    <PenLine className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">Tự Luận</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Essay Mode
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Write free-form answers to real IB interview questions. AI-powered grading with detailed feedback.
                  </p>
                  <Badge variant="secondary" className="text-[10px]">
                    AI Graded • 400+ questions
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // === FINISHED SCREEN (MC) ===
  if (finished) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="shadow-sm border-border/40">
            <CardContent className="pt-8 pb-8 text-center space-y-6">
              <Trophy className={cn("w-20 h-20 mx-auto", getRankColor(stats.accuracy))} />
              <div>
                <p className={cn("text-2xl font-bold", getRankColor(stats.accuracy))}>
                  {getRankLabel(stats.accuracy)}
                </p>
                <p className="text-muted-foreground mt-1">
                  {stats.correct} / {stats.total} correct — {stats.accuracy}%
                </p>
              </div>
              <div className="flex gap-8 justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-600 tabular-nums">{stats.correct}</p>
                  <p className="text-xs text-muted-foreground">Correct</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-500 tabular-nums">{stats.answered - stats.correct}</p>
                  <p className="text-xs text-muted-foreground">Wrong</p>
                </div>
              </div>
              <div className="flex gap-3 justify-center pt-2">
                <Button variant="outline" onClick={handleBackToSelect}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quiz Selection
                </Button>
                <Button onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
                <Button variant="outline" onClick={handleShuffle}>
                  <Shuffle className="w-4 h-4 mr-2" />
                  Shuffle & Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // === MC QUIZ ===
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            IB 400 — Fit & Behavioral
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Question {currentIndex + 1}/{TOTAL_IB400}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="tabular-nums text-xs"
          >
            {stats.correct}/{stats.answered} correct
          </Badge>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShuffle} title="Shuffle questions">
            <Shuffle className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={handleBackToSelect}>
            <ArrowLeft className="w-3 h-3 mr-1" />
            Back
          </Button>
        </div>
      </motion.div>

      <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-2" />

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {questions.map((_, i) => {
          const qId = questions[i].id;
          const answered = !!answers[qId];
          const correct = answered && answers[qId]?.trim().toLowerCase() === questions[i].correctAnswer.trim().toLowerCase();
          return (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "w-7 h-7 rounded-md text-[10px] font-bold shrink-0 transition-all",
                i === currentIndex
                  ? "bg-primary text-primary-foreground shadow-md"
                  : answered
                    ? correct
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {question && (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <Card className="shadow-sm border-border/40">
              <CardContent className="pt-5 pb-5 space-y-5">
                <div className="flex items-start gap-3">
                  <Badge className="gradient-primary text-white text-[10px] px-2 py-0.5 shrink-0 tabular-nums">
                    {currentIndex + 1}/{TOTAL_IB400}
                  </Badge>
                  <p className="text-sm font-medium leading-relaxed flex-1">
                    {question.question}
                  </p>
                </div>

                {question.choices && (
                  <div className="space-y-2">
                    {question.choices.map((choice, ci) => {
                      const isThisSelected = userAnswer === choice;
                      const isThisCorrect = choice.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();

                      return (
                        <motion.button
                          key={ci}
                          whileHover={!isRevealed ? { scale: 1.01 } : {}}
                          whileTap={!isRevealed ? { scale: 0.99 } : {}}
                          onClick={() => handleSelect(choice)}
                          disabled={isRevealed}
                          className={cn(
                            "w-full text-left flex items-center gap-3 rounded-xl border px-4 py-3 transition-all text-sm",
                            !isRevealed && "hover:bg-muted/40 hover:border-primary/30 cursor-pointer",
                            !isRevealed && isThisSelected && "border-primary/50 bg-primary/5",
                            !isRevealed && !isThisSelected && "border-border/40",
                            isRevealed && isThisCorrect && "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-700",
                            isRevealed && isThisSelected && !isThisCorrect && "border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-700",
                            isRevealed && !isThisCorrect && !isThisSelected && "border-border/20 opacity-40",
                            isRevealed && "cursor-default"
                          )}
                        >
                          <span
                            className={cn(
                              "w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                              !isRevealed && "border-border/50 text-muted-foreground",
                              isRevealed && isThisCorrect && "border-emerald-500 bg-emerald-500 text-white",
                              isRevealed && isThisSelected && !isThisCorrect && "border-red-500 bg-red-500 text-white",
                              isRevealed && !isThisCorrect && !isThisSelected && "border-border/30 text-muted-foreground/40"
                            )}
                          >
                            {isRevealed && isThisCorrect ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : isRevealed && isThisSelected && !isThisCorrect ? (
                              <XCircle className="w-4 h-4" />
                            ) : (
                              String.fromCharCode(65 + ci)
                            )}
                          </span>
                          <span className="flex-1">{choice}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <AnimatePresence>
              {isRevealed && (
                <motion.div
                  initial={{ opacity: 0, y: 16, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  <Card
                    className={cn(
                      "shadow-md border-l-4",
                      isCorrect ? "border-l-emerald-500" : "border-l-red-500"
                    )}
                  >
                    <CardContent className="pt-4 pb-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            isCorrect
                              ? "bg-emerald-100 dark:bg-emerald-900/30"
                              : "bg-red-100 dark:bg-red-900/30"
                          )}
                        >
                          {isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className={cn("font-bold text-sm", isCorrect ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                            {isCorrect ? "Correct!" : "Incorrect"}
                          </p>
                          {isWrong && (
                            <p className="text-xs text-muted-foreground">
                              The answer is: <strong className="text-foreground">{question.correctAnswer}</strong>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 p-3 rounded-lg bg-muted/50">
                        <Bot className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
                          <p>{question.explanation}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <p className="text-[11px] text-primary/80 font-medium">
                          <span className="font-bold">Tip:</span> {randomTip}
                        </p>
                      </div>

                      <div className="flex justify-end pt-1">
                        <Button onClick={handleNext} size="sm" className="gradient-primary text-white shadow-md shadow-primary/20">
                          {currentIndex < questions.length - 1 ? (
                            <>
                              Next Question
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </>
                          ) : (
                            <>
                              See Results
                              <Trophy className="w-4 h-4 ml-1" />
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
