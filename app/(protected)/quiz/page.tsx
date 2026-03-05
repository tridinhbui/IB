"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
import { allQuestions as localAllQuestions } from "@/lib/questions";
import { Question, Section } from "@/types/question";
import { useQuizStore } from "@/store/useQuizStore";
import { Calculator, Building2, DollarSign, Scale, BarChart3, Percent, Users, Loader2 } from "lucide-react";

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

type QuizMode = "select" | "section_select" | "mc";

const sectionConfigs: {
  label: Section;
  icon: typeof Calculator;
  color: string;
  gradient: string;
}[] = [
    { label: "Accounting", icon: Calculator, color: "text-amber-600", gradient: "from-amber-500/10 to-amber-600/5" },
    { label: "EV vs Equity Value", icon: Building2, color: "text-orange-600", gradient: "from-orange-500/10 to-orange-600/5" },
    { label: "Valuation", icon: DollarSign, color: "text-amber-600", gradient: "from-amber-500/10 to-amber-600/5" },
    { label: "M&A", icon: Scale, color: "text-orange-600", gradient: "from-orange-500/10 to-orange-600/5" },
    { label: "LBO", icon: BarChart3, color: "text-red-600", gradient: "from-red-500/10 to-red-600/5" },
    { label: "Accretion/Dilution", icon: Percent, color: "text-rose-600", gradient: "from-rose-500/10 to-rose-600/5" },
    { label: "Fit & Behavioral", icon: Users, color: "text-orange-600", gradient: "from-orange-500/10 to-orange-600/5" },
  ];

export default function QuizPage() {
  const router = useRouter();
  const { allTechnicalQuestions, setAllTechnicalQuestions } = useQuizStore();
  const [loading, setLoading] = useState(allTechnicalQuestions.length === 0);
  const [mode, setMode] = useState<QuizMode>("select");
  const [selectedSection, setSelectedSection] = useState<Section>("Fit & Behavioral");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);

  // Load questions from DB if store is empty
  useEffect(() => {
    if (allTechnicalQuestions.length > 0) {
      setLoading(false);
      return;
    }

    fetch("/api/technical-questions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAllTechnicalQuestions(data);
        } else {
          console.error("API did not return an array:", data);
          setAllTechnicalQuestions([]); // Fallback
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
        setLoading(false);
      });
  }, [allTechnicalQuestions.length, setAllTechnicalQuestions]);

  const handleStartSection = useCallback((section: Section) => {
    const safeQuestions = Array.isArray(allTechnicalQuestions) ? allTechnicalQuestions : [];
    const sectionQuestions = safeQuestions.filter(q => q.section === section);
    setSelectedSection(section);
    setQuestions(shuffleArray(sectionQuestions));
    setCurrentIndex(0);
    setAnswers({});
    setRevealed({});
    setFinished(false);
    setMode("mc");
  }, [allTechnicalQuestions]);

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
    const safeQuestions = Array.isArray(allTechnicalQuestions) ? allTechnicalQuestions : [];
    const sectionQuestions = safeQuestions.filter(q => q.section === selectedSection);
    setQuestions(shuffleArray(sectionQuestions));
    setCurrentIndex(0);
    setAnswers({});
    setRevealed({});
    setFinished(false);
  }, [allTechnicalQuestions, selectedSection]);

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
    const tips = TIPS[selectedSection] || TIPS["Fit & Behavioral"];
    return tips[Math.floor(Math.random() * tips.length)];
  }, [currentIndex, selectedSection]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
                onClick={() => setMode("section_select")}
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

  if (mode === "section_select") {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                <ListChecks className="w-6 h-6 text-primary" />
                Select a Section
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Choose a specific domain to practice your multiple-choice questions
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setMode("select")} className="hidden sm:flex">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sectionConfigs.map((section, index) => {
              const safeQuestions = Array.isArray(allTechnicalQuestions) ? allTechnicalQuestions : [];
              const questionCount = safeQuestions.filter(q => q.section === section.label).length;
              return (
                <motion.div
                  key={section.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Card
                    className="cursor-pointer shadow-sm hover:shadow-md transition-all h-full group border-border/40 hover:border-primary/30"
                    onClick={() => handleStartSection(section.label)}
                  >
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110", `bg-gradient-to-br ${section.gradient}`)}>
                        <section.icon className={cn("w-7 h-7", section.color)} />
                      </div>
                      <div>
                        <h3 className="font-bold text-base leading-tight">{section.label}</h3>
                        <Badge variant="secondary" className="mt-2 text-[10px] px-2 py-0">
                          {questionCount} questions
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <Button variant="outline" className="w-full mt-6 sm:hidden" onClick={() => setMode("select")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Modes
          </Button>
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
              <Trophy className={cn("w-16 h-16 sm:w-20 sm:h-20 mx-auto", getRankColor(stats.accuracy))} />
              <div>
                <p className={cn("text-xl sm:text-2xl font-bold", getRankColor(stats.accuracy))}>
                  {getRankLabel(stats.accuracy)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.correct} / {stats.total} correct — {stats.accuracy}%
                </p>
              </div>
              <div className="flex flex-wrap gap-4 sm:gap-8 justify-center">
                <div className="text-center min-w-[80px]">
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-600 tabular-nums">{stats.correct}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">Correct</p>
                </div>
                <div className="text-center min-w-[80px]">
                  <p className="text-2xl sm:text-3xl font-bold text-red-500 tabular-nums">{stats.answered - stats.correct}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">Wrong</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Button variant="outline" onClick={() => setMode("section_select")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Other Sections
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
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-20 px-3 sm:px-0">
      {/* Header Section */}
      <div className="pt-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate max-w-[200px] sm:max-w-none">
                IB 400 — {selectedSection}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">✨ Master your technical & qualitative skills</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setMode("section_select")}
            className="w-full sm:w-auto h-9 text-xs font-semibold border-border/60 hover:bg-muted/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Sections
          </Button>
        </div>

        <div className="flex items-center justify-between py-2 border-y border-border/5">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="tabular-nums font-bold">
              {stats.correct}/{stats.answered} Correct
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={handleShuffle} title="Shuffle questions">
              <Shuffle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-background/95 backdrop-blur-sm pb-2 pt-1 border-b border-border/10 mb-2">
        <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-1.5 mb-4" />

        <div className="flex gap-1.5 overflow-x-auto pb-2 px-1 scrollbar-none">
          {questions.length > 20 ? (
            // For large sets, only show range around current
            questions.map((_, i) => {
              const qId = questions[i].id;
              const answered = !!answers[qId];
              const correct = answered && answers[qId]?.trim().toLowerCase() === questions[i].correctAnswer.trim().toLowerCase();

              // Only show if within range (e.g., current +/- 10)
              const inRange = i >= currentIndex - 10 && i <= currentIndex + 10;
              if (!inRange && i !== 0 && i !== questions.length - 1) return null;

              if (!inRange && i === 0 && currentIndex > 11) return <span key="start-dots" className="text-xs text-muted-foreground self-center px-1">...</span>;
              if (!inRange && i === questions.length - 1 && currentIndex < questions.length - 12) return <span key="end-dots" className="text-xs text-muted-foreground self-center px-1">...</span>;

              return (
                <button
                  key={i}
                  id={`q-dot-${i}`}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-[10px] sm:text-xs font-bold shrink-0 transition-all flex items-center justify-center",
                    i === currentIndex
                      ? "bg-primary text-primary-foreground shadow-md scale-110"
                      : answered
                        ? correct
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {i + 1}
                </button>
              );
            })
          ) : (
            questions.map((_, i) => {
              const qId = questions[i].id;
              const answered = !!answers[qId];
              const correct = answered && answers[qId]?.trim().toLowerCase() === questions[i].correctAnswer.trim().toLowerCase();
              return (
                <button
                  key={i}
                  id={`q-dot-${i}`}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-[10px] sm:text-xs font-bold shrink-0 transition-all flex items-center justify-center",
                    i === currentIndex
                      ? "bg-primary text-primary-foreground shadow-md scale-110"
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
            })
          )}
        </div>
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
                  <p className="text-sm font-medium leading-relaxed flex-1 break-words overflow-wrap-anywhere overflow-hidden">
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
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
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
                        <div className="flex-1 min-w-0">
                          <p className={cn("font-bold text-sm", isCorrect ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                            {isCorrect ? "Correct!" : "Incorrect"}
                          </p>
                          {isWrong && (
                            <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug">
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
