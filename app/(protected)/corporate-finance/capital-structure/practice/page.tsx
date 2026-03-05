"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CAPITAL_STRUCTURE_PRACTICE } from "@/lib/corporate-finance/practice";
import { useCorporateFinanceStore } from "@/store/useCorporateFinanceStore";
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

function isCorrect(userAnswer: number, correctAnswer: number, unit: string): boolean {
  const tolerance = unit === "%" ? 0.5 : unit === "x" ? 0.05 : 1;
  return Math.abs(userAnswer - correctAnswer) <= tolerance;
}

export default function CapitalStructurePracticePage() {
  const recordVisit = useCorporateFinanceStore((s) => s.recordVisit);
  const completePractice = useCorporateFinanceStore((s) => s.completePractice);
  useEffect(() => {
    recordVisit("capital-structure");
  }, [recordVisit]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);

  const q = CAPITAL_STRUCTURE_PRACTICE[currentIndex];
  const userAnswer = q ? answers[q.id] : undefined;
  const isRevealed = q ? !!revealed[q.id] : false;
  const correct =
    q &&
    userAnswer !== undefined &&
    isRevealed &&
    isCorrect(userAnswer, q.answer, q.unit);

  const stats = useMemo(() => {
    const answered = Object.keys(answers).length;
    const correctCount = CAPITAL_STRUCTURE_PRACTICE.filter(
      (x) => answers[x.id] !== undefined && isCorrect(answers[x.id], x.answer, x.unit)
    ).length;
    return {
      answered,
      correct: correctCount,
      total: CAPITAL_STRUCTURE_PRACTICE.length,
      accuracy: answered > 0 ? Math.round((correctCount / answered) * 100) : 0,
    };
  }, [answers]);

  useEffect(() => {
    if (finished && stats.answered > 0) {
      completePractice("capital-structure", stats.accuracy);
    }
  }, [finished, stats.answered, stats.accuracy, completePractice]);

  const handleSubmit = useCallback(() => {
    if (!q || userAnswer === undefined) return;
    setRevealed((prev) => ({ ...prev, [q.id]: true }));
  }, [q, userAnswer]);

  const handleNext = useCallback(() => {
    if (currentIndex < CAPITAL_STRUCTURE_PRACTICE.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  }, [currentIndex]);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setAnswers({});
    setRevealed({});
    setFinished(false);
  }, []);


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-varela font-bold text-finstep-brown dark:text-foreground flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-finstep-orange" />
          Practice Exercises
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Test your capital structure and WACC knowledge
        </p>
      </div>

      <Progress value={(stats.answered / stats.total) * 100} className="h-2" />

      <AnimatePresence mode="wait">
        {finished ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-varela font-bold mb-2">Session Complete</h2>
            <p className="text-sm text-muted-foreground mb-6">
              {stats.correct}/{stats.total} correct ({stats.accuracy}%)
            </p>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key={q?.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardContent className="pt-6 pb-6">
                <p className="text-xs text-muted-foreground mb-2">
                  Question {currentIndex + 1} of {CAPITAL_STRUCTURE_PRACTICE.length}
                </p>
                <p className="font-semibold mb-6">{q?.question}</p>
                <div className="flex flex-wrap items-center gap-4">
                  {q?.unit === "$" && <span className="text-muted-foreground">$</span>}
                  <Input
                    type="number"
                    value={userAnswer ?? ""}
                    onChange={(e) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [q!.id]: parseFloat(e.target.value) || 0,
                      }))
                    }
                    placeholder="Your answer"
                    disabled={isRevealed}
                    className={cn(
                      "max-w-[200px]",
                      isRevealed && correct && "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20",
                      isRevealed && !correct && "border-red-400 bg-red-50 dark:bg-red-950/20"
                    )}
                  />
                  {q?.unit === "%" && <span className="text-muted-foreground">%</span>}
                  {q?.unit === "x" && <span className="text-muted-foreground">x</span>}
                </div>
                {!isRevealed ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={userAnswer === undefined}
                    className="mt-4"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Check Answer
                  </Button>
                ) : (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2">
                      {correct ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className={cn("text-sm font-medium", correct ? "text-emerald-600" : "text-red-600")}>
                        {correct ? "Correct!" : `Answer: ${q?.unit === "%" ? q?.answer + "%" : q?.unit === "x" ? q?.answer + "x" : "$" + q?.answer}`}
                      </span>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-sm">
                      <p className="font-semibold mb-1">Explanation</p>
                      <p className="text-muted-foreground">{q?.explanation}</p>
                      <p className="text-xs font-mono mt-2 text-muted-foreground">{q?.formula}</p>
                    </div>
                    <Button onClick={handleNext}>
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
