"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuizStore } from "@/store/useQuizStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowLeft,
  Trophy,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
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

export default function QuizPage() {
  const router = useRouter();
  const {
    currentQuiz,
    currentIndex,
    answers,
    quizStarted,
    quizCompleted,
    timeRemaining,
    progress,
    submitAnswer,
    nextQuestion,
    prevQuestion,
    completeQuiz,
    setTimeRemaining,
    resetQuiz,
    startQuiz,
  } = useQuizStore();

  const [numericInput, setNumericInput] = useState("");

  const handleComplete = useCallback(() => {
    completeQuiz();
  }, [completeQuiz]);

  useEffect(() => {
    if (!quizStarted || quizCompleted) return;

    const interval = setInterval(() => {
      setTimeRemaining(timeRemaining - 1);
      if (timeRemaining <= 1) {
        handleComplete();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, quizStarted, quizCompleted, setTimeRemaining, handleComplete]);

  if (!quizStarted || currentQuiz.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-border/50">
            <CardContent className="pt-6 text-center space-y-4">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground" />
              <h2 className="text-xl font-bold">No Active Quiz</h2>
              <p className="text-muted-foreground text-sm">
                Start a quiz from the dashboard by selecting a section or
                launching a mixed quiz.
              </p>
              <Button onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (quizCompleted) {
    const lastResult = progress.quizHistory[progress.quizHistory.length - 1];
    if (!lastResult) return null;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-border/50">
            <CardHeader className="text-center">
              <Trophy
                className={`w-16 h-16 mx-auto mb-2 ${getRankColor(lastResult.accuracy)}`}
              />
              <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
              <p
                className={`text-lg font-bold ${getRankColor(lastResult.accuracy)}`}
              >
                {getRankLabel(lastResult.accuracy)}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold">{lastResult.score}</p>
                  <p className="text-xs text-muted-foreground">Correct</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{lastResult.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div>
                  <p
                    className={`text-3xl font-bold ${getRankColor(lastResult.accuracy)}`}
                  >
                    {lastResult.accuracy}%
                  </p>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                </div>
              </div>

              {Object.keys(lastResult.sectionBreakdown).length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 text-sm">
                    Section Breakdown
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(lastResult.sectionBreakdown).map(
                      ([section, data]) => {
                        const acc = Math.round(
                          (data.correct / data.total) * 100
                        );
                        return (
                          <div key={section} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{section}</span>
                              <span className={getRankColor(acc)}>
                                {data.correct}/{data.total} ({acc}%)
                              </span>
                            </div>
                            <Progress value={acc} className="h-1.5" />
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    resetQuiz();
                    router.push("/dashboard");
                  }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    resetQuiz();
                    startQuiz();
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="font-semibold">Review Answers</h3>
          {currentQuiz.map((q, i) => {
            const userAnswer = answers[q.id];
            const isCorrect =
              userAnswer?.trim().toLowerCase() ===
              q.correctAnswer.trim().toLowerCase();

            return (
              <Card
                key={q.id}
                className={cn(
                  "border-border/50",
                  isCorrect ? "border-l-2 border-l-emerald-500" : "border-l-2 border-l-red-500"
                )}
              >
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      )}
                      <p className="text-sm font-medium">
                        {i + 1}. {q.question}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0">
                      {q.section}
                    </Badge>
                  </div>

                  <div className="ml-7 space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">
                        Your answer:{" "}
                      </span>
                      <span
                        className={
                          isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                        }
                      >
                        {userAnswer || "No answer"}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p>
                        <span className="text-muted-foreground">
                          Correct:{" "}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {q.correctAnswer}
                        </span>
                      </p>
                    )}
                    <div className="mt-2 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                      {q.explanation}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>
      </div>
    );
  }

  const question = currentQuiz[currentIndex];
  const progressPercent = ((currentIndex + 1) / currentQuiz.length) * 100;
  const isUrgent = timeRemaining < 120;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary">
            {currentIndex + 1} / {currentQuiz.length}
          </Badge>
          <Badge variant="outline">{question.section}</Badge>
          <Badge variant="outline">{question.difficulty}</Badge>
        </div>
        <div
          className={cn(
            "flex items-center gap-1.5 text-sm font-mono font-medium",
            isUrgent ? "text-red-400" : "text-muted-foreground"
          )}
        >
          <Clock className="w-4 h-4" />
          {formatTime(timeRemaining)}
        </div>
      </div>

      <Progress value={progressPercent} className="h-1" />

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-border/50">
            <CardContent className="pt-6 space-y-6">
              <p className="text-lg font-medium leading-relaxed">
                {question.question}
              </p>

              {question.type === "mcq" && question.choices && (
                <RadioGroup
                  value={answers[question.id] || ""}
                  onValueChange={(val) => submitAnswer(question.id, val)}
                  className="space-y-3"
                >
                  {question.choices.map((choice, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center space-x-3 rounded-lg border border-border/50 p-4 transition-colors cursor-pointer",
                        answers[question.id] === choice
                          ? "border-primary/50 bg-primary/5"
                          : "hover:bg-muted/30"
                      )}
                      onClick={() => submitAnswer(question.id, choice)}
                    >
                      <RadioGroupItem value={choice} id={`choice-${idx}`} />
                      <Label
                        htmlFor={`choice-${idx}`}
                        className="cursor-pointer flex-1 text-sm"
                      >
                        {choice}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.type === "numeric" && (
                <div className="space-y-2">
                  <Label>Your Answer</Label>
                  <Input
                    type="text"
                    placeholder="Enter your answer..."
                    value={answers[question.id] || numericInput}
                    onChange={(e) => {
                      setNumericInput(e.target.value);
                      submitAnswer(question.id, e.target.value);
                    }}
                    className="max-w-xs"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          onClick={prevQuestion}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <div className="flex gap-1.5 overflow-x-auto max-w-[300px] px-2">
          {currentQuiz.map((_, i) => (
            <button
              key={i}
              onClick={() =>
                useQuizStore.setState({ currentIndex: i })
              }
              className={cn(
                "w-7 h-7 rounded-md text-xs font-medium shrink-0 transition-colors",
                i === currentIndex
                  ? "bg-primary text-primary-foreground"
                  : answers[currentQuiz[i].id]
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {currentIndex === currentQuiz.length - 1 ? (
          <Button onClick={handleComplete}>
            Submit Quiz
            <CheckCircle2 className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={nextQuestion}>
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
