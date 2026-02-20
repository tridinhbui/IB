"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowLeft,
  Trophy,
  RotateCcw,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fitBehavioralQuestions } from "@/lib/questions/fit-behavioral";
import { Question } from "@/types/question";

const TOTAL_IB400 = 400;

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

export default function QuizPage() {
  const router = useRouter();
  const questions: Question[] = fitBehavioralQuestions;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (questionId: string, answer: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stats = useMemo(() => {
    if (!submitted) return null;
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        correct++;
      }
    });
    const accuracy = Math.round((correct / questions.length) * 100);
    return { correct, total: questions.length, accuracy };
  }, [submitted, answers, questions]);

  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            IB 400 Question Bank
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {questions.length} / {TOTAL_IB400} questions — Fit & Behavioral
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="tabular-nums">
            {answeredCount}/{questions.length} answered
          </Badge>
          {submitted ? (
            <Button size="sm" onClick={handleReset}>
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Retry
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={answeredCount === 0}
              className="gradient-primary text-white shadow-lg shadow-primary/20"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Submit All
            </Button>
          )}
        </div>
      </motion.div>

      {!submitted && <Progress value={progressPercent} className="h-2" />}

      {submitted && stats && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="shadow-sm border-border/40">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Trophy className={cn("w-14 h-14", getRankColor(stats.accuracy))} />
                <div className="text-center sm:text-left flex-1">
                  <p className={cn("text-xl font-bold", getRankColor(stats.accuracy))}>
                    {getRankLabel(stats.accuracy)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stats.correct}/{stats.total} correct ({stats.accuracy}%)
                  </p>
                </div>
                <div className="flex gap-6 text-center">
                  <div>
                    <p className="text-3xl font-bold text-emerald-600 tabular-nums">{stats.correct}</p>
                    <p className="text-[10px] text-muted-foreground">Correct</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-red-500 tabular-nums">{stats.total - stats.correct}</p>
                    <p className="text-[10px] text-muted-foreground">Wrong</p>
                  </div>
                  <div>
                    <p className={cn("text-3xl font-bold tabular-nums", getRankColor(stats.accuracy))}>{stats.accuracy}%</p>
                    <p className="text-[10px] text-muted-foreground">Accuracy</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="space-y-4">
        {questions.map((q, idx) => {
          const userAnswer = answers[q.id];
          const isAnswered = !!userAnswer;
          const isCorrect = submitted && userAnswer?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
          const isWrong = submitted && isAnswered && !isCorrect;

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 0.5) }}
            >
              <Card
                className={cn(
                  "shadow-sm border-border/40 transition-all",
                  submitted && isCorrect && "border-l-4 border-l-emerald-500",
                  submitted && isWrong && "border-l-4 border-l-red-500",
                  submitted && !isAnswered && "border-l-4 border-l-muted-foreground/30 opacity-60"
                )}
              >
                <CardContent className="pt-4 pb-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0.5 tabular-nums font-bold"
                      >
                        {idx + 1}/{TOTAL_IB400}
                      </Badge>
                      {submitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                      {submitted && isWrong && (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm font-medium leading-relaxed flex-1">
                      {q.question}
                    </p>
                    <Badge variant="outline" className="text-[9px] shrink-0">
                      {q.difficulty}
                    </Badge>
                  </div>

                  {q.choices && (
                    <RadioGroup
                      value={userAnswer || ""}
                      onValueChange={(val) => handleAnswer(q.id, val)}
                      className="space-y-1.5 ml-10"
                      disabled={submitted}
                    >
                      {q.choices.map((choice, ci) => {
                        const isThisCorrect = submitted && choice.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                        const isThisWrong = submitted && userAnswer === choice && !isThisCorrect;

                        return (
                          <div
                            key={ci}
                            className={cn(
                              "flex items-center space-x-2.5 rounded-lg border px-3 py-2 transition-all text-xs",
                              !submitted && userAnswer === choice && "border-primary/50 bg-primary/5",
                              !submitted && userAnswer !== choice && "border-border/40 hover:bg-muted/30 cursor-pointer",
                              submitted && isThisCorrect && "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800",
                              submitted && isThisWrong && "border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800",
                              submitted && !isThisCorrect && !isThisWrong && "border-border/20 opacity-50"
                            )}
                            onClick={() => !submitted && handleAnswer(q.id, choice)}
                          >
                            <RadioGroupItem value={choice} id={`q${idx}-c${ci}`} disabled={submitted} />
                            <Label htmlFor={`q${idx}-c${ci}`} className={cn("flex-1", submitted && "cursor-default")}>
                              {choice}
                            </Label>
                            {submitted && isThisCorrect && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            )}
                            {submitted && isThisWrong && (
                              <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </RadioGroup>
                  )}

                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="ml-10"
                    >
                      <div className={cn(
                        "p-3 rounded-lg text-xs leading-relaxed flex gap-2",
                        isCorrect
                          ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                          : "bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
                      )}>
                        <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <div>
                          {isWrong && (
                            <p className="font-semibold mb-1">
                              Correct answer: {q.correctAnswer}
                            </p>
                          )}
                          {q.explanation}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center gap-3 pt-4 pb-8">
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={answeredCount === 0}
            className="gradient-primary text-white shadow-lg shadow-primary/20"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Submit All ({answeredCount}/{questions.length})
          </Button>
        ) : (
          <Button onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}
