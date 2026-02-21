"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    ArrowLeft,
    Send,
    ChevronRight,
    Trophy,
    RotateCcw,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    TrendingUp,
    BookOpen,
    ChevronDown,
    ChevronUp,
    Star,
    Target,
    Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IbQuestion {
    category: string;
    question: string;
    answer: string;
}

interface GradeResult {
    score: number;
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
    summary: string;
}

interface AnsweredQuestion {
    question: IbQuestion;
    userAnswer: string;
    grade: GradeResult;
}

function getScoreColor(score: number) {
    if (score >= 8) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 6) return "text-blue-600 dark:text-blue-400";
    if (score >= 4) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
}

function getScoreBg(score: number) {
    if (score >= 8)
        return "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700";
    if (score >= 6)
        return "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700";
    if (score >= 4)
        return "bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700";
    return "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700";
}

function getScoreLabel(score: number) {
    if (score >= 9) return "Excellent";
    if (score >= 7) return "Strong";
    if (score >= 5) return "Adequate";
    if (score >= 3) return "Needs Work";
    return "Poor";
}


export default function EssayQuizPage() {
    const router = useRouter();
    const [allQuestions, setAllQuestions] = useState<IbQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sessionQuestions, setSessionQuestions] = useState<IbQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");
    const [grading, setGrading] = useState(false);
    const [currentGrade, setCurrentGrade] = useState<GradeResult | null>(null);
    // keyed by question index for O(1) lookup and accurate restoration
    const [answeredQuestions, setAnsweredQuestions] = useState<
        Record<number, AnsweredQuestion>
    >({});
    const [finished, setFinished] = useState(false);
    const [showRefAnswer, setShowRefAnswer] = useState(false);

    // Load questions from JSON
    useEffect(() => {
        fetch("/ib_questions.json")
            .then((res) => res.json())
            .then((data: IbQuestion[]) => {
                setAllQuestions(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const categories = useMemo(() => {
        const cats = new Set(allQuestions.map((q) => q.category));
        return Array.from(cats).sort();
    }, [allQuestions]);

    const handleSelectCategory = useCallback(
        (cat: string) => {
            setSelectedCategory(cat);
            const filtered = allQuestions.filter((q) => q.category === cat);
            // Shuffle all questions in the category
            const shuffled = [...filtered].sort(() => Math.random() - 0.5);
            setSessionQuestions(shuffled);
            setCurrentIndex(0);
            setUserAnswer("");
            setCurrentGrade(null);
            setAnsweredQuestions({});
            setFinished(false);
            setShowRefAnswer(false);
        },
        [allQuestions]
    );

    const handleSubmitAnswer = useCallback(async () => {
        if (!userAnswer.trim() || grading) return;
        const question = sessionQuestions[currentIndex];
        setGrading(true);
        setCurrentGrade(null);

        try {
            const res = await fetch("/api/grade-essay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question: question.question,
                    referenceAnswer: question.answer,
                    userAnswer: userAnswer.trim(),
                }),
            });

            if (!res.ok) throw new Error("Grading failed");

            const grade: GradeResult = await res.json();
            setCurrentGrade(grade);
            setAnsweredQuestions((prev) => ({
                ...prev,
                [currentIndex]: { question, userAnswer: userAnswer.trim(), grade },
            }));
        } catch {
            setCurrentGrade({
                score: -1,
                strengths: [],
                weaknesses: [],
                improvements: ["Unable to grade. Please try again."],
                summary: "Grading service unavailable.",
            });
        } finally {
            setGrading(false);
        }
    }, [userAnswer, grading, sessionQuestions, currentIndex]);

    const handleNext = useCallback(() => {
        if (currentIndex < sessionQuestions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setUserAnswer("");
            setCurrentGrade(null);
            setShowRefAnswer(false);
        } else {
            setFinished(true);
        }
    }, [currentIndex, sessionQuestions.length]);

    const handleReset = useCallback(() => {
        setSelectedCategory(null);
        setSessionQuestions([]);
        setCurrentIndex(0);
        setUserAnswer("");
        setCurrentGrade(null);
        setAnsweredQuestions({});
        setFinished(false);
        setShowRefAnswer(false);
    }, []);

    const handleJumpTo = useCallback((i: number) => {
        if (i === currentIndex) return;
        setCurrentIndex(i);
        const saved = answeredQuestions[i];
        if (saved) {
            setUserAnswer(saved.userAnswer);
            setCurrentGrade(saved.grade);
        } else {
            setUserAnswer("");
            setCurrentGrade(null);
        }
        setShowRefAnswer(false);
    }, [currentIndex, answeredQuestions]);

    const answeredList = useMemo(
        () => Object.values(answeredQuestions),
        [answeredQuestions]
    );

    const avgScore = useMemo(() => {
        if (answeredList.length === 0) return 0;
        const total = answeredList.reduce(
            (sum, aq) => sum + (aq.grade.score >= 0 ? aq.grade.score : 0),
            0
        );
        return Math.round((total / answeredList.length) * 10) / 10;
    }, [answeredList]);

    // Loading state
    if (loading) {
        return (
            <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Finished summary
    if (finished) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Card className="shadow-sm border-border/40">
                        <CardContent className="pt-8 pb-8 text-center space-y-6">
                            <Trophy
                                className={cn("w-20 h-20 mx-auto", getScoreColor(avgScore))}
                            />
                            <div>
                                <p
                                    className={cn(
                                        "text-2xl font-bold",
                                        getScoreColor(avgScore)
                                    )}
                                >
                                    {getScoreLabel(avgScore)}
                                </p>
                                <p className="text-muted-foreground mt-1">
                                    Average Score:{" "}
                                    <span className="font-bold text-foreground">
                                        {avgScore}/10
                                    </span>{" "}
                                    across {answeredList.length} questions
                                </p>
                            </div>
                            <div className="flex gap-8 justify-center">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-emerald-600 tabular-nums">
                                        {answeredList.filter((q) => q.grade.score >= 7).length}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Strong (7+)</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-amber-500 tabular-nums">
                                        {
                                            answeredList.filter(
                                                (q) => q.grade.score >= 4 && q.grade.score < 7
                                            ).length
                                        }
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Adequate (4-6)
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-red-500 tabular-nums">
                                        {answeredList.filter((q) => q.grade.score < 4).length}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Needs Work (&lt;4)
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-center pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => router.push("/quiz")}
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Quiz Selection
                                </Button>
                                <Button onClick={handleReset}>
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    New Session
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed breakdown */}
                    <div className="mt-6 space-y-3">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                            Question Breakdown
                        </h3>
                        {answeredList.map((aq, i) => (
                            <Card key={i} className="shadow-sm border-border/40">
                                <CardContent className="pt-4 pb-4">
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border",
                                                getScoreBg(aq.grade.score)
                                            )}
                                        >
                                            {aq.grade.score}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium leading-relaxed line-clamp-2">
                                                {aq.question.question}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {aq.grade.summary}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>
            </div>
        );
    }

    // Category selection
    if (!selectedCategory) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => router.push("/quiz")}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                Tự Luận — Essay Mode
                            </h1>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Select a category to begin
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        {categories.map((cat) => {
                            const count = allQuestions.filter((q) => q.category === cat).length;
                            return (
                                <motion.div
                                    key={cat}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <Card
                                        className="shadow-sm border-border/40 cursor-pointer hover:bg-muted/40 hover:border-primary/30 transition-all"
                                        onClick={() => handleSelectCategory(cat)}
                                    >
                                        <CardContent className="pt-4 pb-4 flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{cat}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="text-[10px]">
                                                    {count} Q
                                                </Badge>
                                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        );
    }

    // Question + answer flow
    const question = sessionQuestions[currentIndex];
    if (!question) return null;

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
                        Tự Luận
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Question {currentIndex + 1}/{sessionQuestions.length} •{" "}
                        {selectedCategory}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {answeredList.length > 0 && (
                        <Badge variant="secondary" className="tabular-nums text-xs">
                            Avg: {avgScore}/10
                        </Badge>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={handleReset}
                    >
                        <ArrowLeft className="w-3 h-3 mr-1" />
                        Categories
                    </Button>
                </div>
            </motion.div>

            <Progress
                value={((currentIndex + 1) / sessionQuestions.length) * 100}
                className="h-2"
            />

            {/* Question navigation dots — clickable */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {sessionQuestions.map((_, i) => {
                    const answered = answeredQuestions[i];
                    return (
                        <button
                            key={i}
                            onClick={() => handleJumpTo(i)}
                            title={`Question ${i + 1}${answered ? ` — Score: ${answered.grade.score}/10` : " (unanswered)"}`}
                            className={cn(
                                "w-7 h-7 rounded-md text-[10px] font-bold shrink-0 transition-all flex items-center justify-center",
                                i === currentIndex
                                    ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/30"
                                    : answered
                                        ? answered.grade.score >= 7
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:opacity-80"
                                            : answered.grade.score >= 4
                                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:opacity-80"
                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:opacity-80"
                                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                            )}
                        >
                            {answered ? answered.grade.score : i + 1}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={question.question}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                >
                    {/* Question card */}
                    <Card className="shadow-sm border-border/40">
                        <CardContent className="pt-5 pb-5 space-y-4">
                            <div className="flex items-start gap-3">
                                <Badge className="gradient-primary text-white text-[10px] px-2 py-0.5 shrink-0 tabular-nums">
                                    {currentIndex + 1}/{sessionQuestions.length}
                                </Badge>
                                <p className="text-sm font-medium leading-relaxed flex-1">
                                    {question.question}
                                </p>
                            </div>

                            {/* Answer textarea */}
                            {!currentGrade && (
                                <div className="space-y-3">
                                    <textarea
                                        value={userAnswer}
                                        onChange={(e) => setUserAnswer(e.target.value)}
                                        placeholder="Type your answer here... Be specific and structured, as you would in a real IB interview."
                                        className="w-full min-h-[150px] p-4 rounded-xl border border-border/40 bg-background text-sm leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-y transition-all"
                                        disabled={grading}
                                    />
                                    <div className="flex items-center justify-between">
                                        <p className="text-[11px] text-muted-foreground">
                                            {userAnswer.length > 0
                                                ? `${userAnswer.split(/\s+/).filter(Boolean).length} words`
                                                : "Write your answer above"}
                                        </p>
                                        <Button
                                            onClick={handleSubmitAnswer}
                                            disabled={!userAnswer.trim() || grading}
                                            className="gradient-primary text-white shadow-md shadow-primary/20"
                                            size="sm"
                                        >
                                            {grading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Grading...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Submit Answer
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Grade result */}
                    <AnimatePresence>
                        {currentGrade && (
                            <motion.div
                                initial={{ opacity: 0, y: 16, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.35 }}
                                className="space-y-4"
                            >
                                {/* Score card */}
                                <Card
                                    className={cn(
                                        "shadow-md border-l-4",
                                        currentGrade.score >= 7
                                            ? "border-l-emerald-500"
                                            : currentGrade.score >= 4
                                                ? "border-l-amber-500"
                                                : "border-l-red-500"
                                    )}
                                >
                                    <CardContent className="pt-5 pb-5 space-y-4">
                                        {/* Score header */}
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={cn(
                                                    "w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2",
                                                    getScoreBg(currentGrade.score)
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        "text-2xl font-bold",
                                                        getScoreColor(currentGrade.score)
                                                    )}
                                                >
                                                    {currentGrade.score}
                                                </span>
                                                <span className="text-[9px] text-muted-foreground">
                                                    /10
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <p
                                                    className={cn(
                                                        "font-bold text-lg",
                                                        getScoreColor(currentGrade.score)
                                                    )}
                                                >
                                                    {getScoreLabel(currentGrade.score)}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {currentGrade.summary}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Strengths */}
                                        {currentGrade.strengths.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Star className="w-3.5 h-3.5 text-emerald-500" />
                                                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                                                        Strengths
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {currentGrade.strengths.map((s, i) => (
                                                        <Badge
                                                            key={i}
                                                            variant="secondary"
                                                            className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 text-[11px]"
                                                        >
                                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                                            {s}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Weaknesses */}
                                        {currentGrade.weaknesses.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                                                    <span className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider">
                                                        Weaknesses
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {currentGrade.weaknesses.map((w, i) => (
                                                        <Badge
                                                            key={i}
                                                            variant="secondary"
                                                            className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 text-[11px]"
                                                        >
                                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                                            {w}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Improvements */}
                                        {currentGrade.improvements.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                                                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                                                        Areas to Improve
                                                    </span>
                                                </div>
                                                <div className="space-y-1.5">
                                                    {currentGrade.improvements.map((imp, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex items-start gap-2 text-xs text-muted-foreground"
                                                        >
                                                            <TrendingUp className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                                                            <span>{imp}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Reference answer toggle */}
                                        <div className="border-t border-border/40 pt-3">
                                            <button
                                                onClick={() => setShowRefAnswer(!showRefAnswer)}
                                                className="flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                                            >
                                                {showRefAnswer ? (
                                                    <ChevronUp className="w-3.5 h-3.5" />
                                                ) : (
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                )}
                                                {showRefAnswer
                                                    ? "Hide Reference Answer"
                                                    : "Show Reference Answer"}
                                            </button>
                                            <AnimatePresence>
                                                {showRefAnswer && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="mt-3 p-3 rounded-lg bg-muted/50 border border-border/30"
                                                    >
                                                        <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                                                            Reference Answer
                                                        </p>
                                                        <p className="text-xs leading-relaxed text-muted-foreground">
                                                            {question.answer}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Next button */}
                                        <div className="flex justify-end pt-1">
                                            <Button
                                                onClick={handleNext}
                                                size="sm"
                                                className="gradient-primary text-white shadow-md shadow-primary/20"
                                            >
                                                {currentIndex < sessionQuestions.length - 1 ? (
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

                                {/* Your answer recap */}
                                <Card className="shadow-sm border-border/40">
                                    <CardContent className="pt-4 pb-4">
                                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                                            Your Answer
                                        </p>
                                        <p className="text-xs leading-relaxed text-foreground/80">
                                            {userAnswer}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
