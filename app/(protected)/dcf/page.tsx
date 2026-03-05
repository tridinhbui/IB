"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Calculator,
  RotateCcw,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  BookOpen,
  Hammer,
  Building2,
  Grid3X3,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Play,
  Trophy,
  Target,
  Info,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

import {
  Assumptions,
  DEFAULT_ASSUMPTIONS,
  ASSUMPTION_FIELDS,
} from "@/lib/dcf/types";
import {
  computeProjections,
  generateWarnings,
  generateFeedback,
  computeSensitivity,
  fmt,
  fmtCompact,
} from "@/lib/dcf/engine";
import { LEARNING_MODULES } from "@/lib/dcf/modules";
import { COMPANY_CASES, calculateHistoricalMetrics } from "@/lib/dcf/cases";
import { useDCFStore } from "@/store/useDCFStore";
import { DCF_LEARNING_PATH } from "@/lib/dcf/learning-path";

const BUILD_STEPS = [
  {
    id: 1,
    title: "Historical Financials",
    description: "Input the base revenue (Year 0) as your starting point.",
    fields: ["baseRevenue"] as (keyof Assumptions)[],
  },
  {
    id: 2,
    title: "Revenue Projection",
    description: "Set the annual revenue growth rate for your 5-year projection.",
    fields: ["revenueGrowth"] as (keyof Assumptions)[],
    thinkingPrompt: {
      question: "What revenue growth rate should you use for the next 5 years?",
      context: "Consider: historical growth rates, industry trends, competitive dynamics, and market saturation.",
    },
  },
  {
    id: 3,
    title: "Operating Margins",
    description: "Estimate EBITDA margin and D&A as a percentage of revenue.",
    fields: ["ebitdaMargin", "daPercent"] as (keyof Assumptions)[],
    thinkingPrompt: {
      question: "What EBITDA margin is appropriate for this business?",
      context: "Consider: current margins, industry benchmarks, operating leverage, and competitive pressure.",
    },
  },
  {
    id: 4,
    title: "Tax & Reinvestment",
    description: "Set the tax rate, CapEx, and working capital assumptions.",
    fields: ["taxRate", "capexPercent", "nwcPercent"] as (keyof Assumptions)[],
  },
  {
    id: 5,
    title: "Free Cash Flow",
    description: "Review the calculated Free Cash Flow based on your assumptions.",
    fields: [] as (keyof Assumptions)[],
  },
  {
    id: 6,
    title: "WACC",
    description: "Set the Weighted Average Cost of Capital (discount rate).",
    fields: ["wacc"] as (keyof Assumptions)[],
    thinkingPrompt: {
      question: "What WACC is appropriate for this company?",
      context: "Consider: risk-free rate (~4%), equity risk premium (~5-6%), company beta, and capital structure.",
    },
  },
  {
    id: 7,
    title: "Terminal Value",
    description: "Set terminal growth rate and exit multiple assumptions.",
    fields: ["terminalGrowth", "exitMultiple"] as (keyof Assumptions)[],
    thinkingPrompt: {
      question: "What terminal growth rate is sustainable forever?",
      context: "Terminal growth should not exceed long-term GDP (2-3%). Higher rates imply the company will eventually exceed the economy.",
    },
  },
  {
    id: 8,
    title: "Discount Cash Flows",
    description: "Review the present value of each year's cash flows.",
    fields: [] as (keyof Assumptions)[],
  },
  {
    id: 9,
    title: "Enterprise Value",
    description: "Review your final DCF valuation.",
    fields: [] as (keyof Assumptions)[],
  },
];

export default function DCFPage() {
  const recordVisit = useDCFStore((s) => s.recordVisit);
  const markLessonViewed = useDCFStore((s) => s.markLessonViewed);
  const completePractice = useDCFStore((s) => s.completePractice);
  const completeScenario = useDCFStore((s) => s.completeScenario);
  const getStepProgress = useDCFStore((s) => s.getStepProgress);
  const getOverallProgress = useDCFStore((s) => s.getOverallProgress);
  const getNextStep = useDCFStore((s) => s.getNextStep);
  const getStreakDays = useDCFStore((s) => s.getStreakDays);

  const [activeTab, setActiveTab] = useState("learn");
  const sensitivityCompleted = useRef(false);
  useEffect(() => {
    recordVisit(activeTab);
    if (activeTab === "sensitivity" && !sensitivityCompleted.current) {
      sensitivityCompleted.current = true;
      completeScenario("sensitivity");
    }
  }, [activeTab, recordVisit, completeScenario]);
  const [assumptions, setAssumptions] = useState<Assumptions>(DEFAULT_ASSUMPTIONS);

  const [learnModuleIndex, setLearnModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const [buildStep, setBuildStep] = useState(1);
  const [thinkingAnswers, setThinkingAnswers] = useState<Record<number, string>>({});

  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [caseCompleted, setCaseCompleted] = useState(false);

  const proj = useMemo(() => computeProjections(assumptions), [assumptions]);
  const warnings = useMemo(() => generateWarnings(assumptions, proj), [assumptions, proj]);

  const sensitivity = useMemo(() => {
    const waccRange = [assumptions.wacc - 2, assumptions.wacc - 1, assumptions.wacc, assumptions.wacc + 1, assumptions.wacc + 2];
    const growthRange = [1, 2, assumptions.terminalGrowth, 4, 5].filter((g, i, arr) => arr.indexOf(g) === i).sort((a, b) => a - b);
    if (growthRange.length < 5) {
      const base = [1, 2, 3, 4, 5];
      return computeSensitivity(assumptions, waccRange, base);
    }
    return computeSensitivity(assumptions, waccRange, growthRange);
  }, [assumptions]);

  const selectedCase = selectedCompany ? COMPANY_CASES.find(c => c.id === selectedCompany) : null;
  const caseMetrics = selectedCase ? calculateHistoricalMetrics(selectedCase) : null;
  const caseFeedback = useMemo(() => {
    if (!selectedCase || !caseCompleted) return [];
    return generateFeedback(assumptions, proj, selectedCase);
  }, [selectedCase, caseCompleted, assumptions, proj]);

  const updateAssumption = useCallback((key: keyof Assumptions, value: string) => {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      setAssumptions((prev) => ({ ...prev, [key]: parsed }));
    }
  }, []);

  const handleReset = useCallback(() => {
    setAssumptions(DEFAULT_ASSUMPTIONS);
    setBuildStep(1);
    setThinkingAnswers({});
    setCaseCompleted(false);
  }, []);

  const currentModule = LEARNING_MODULES[learnModuleIndex];

  const handleModuleComplete = useCallback(() => {
    const correctCount = currentModule.quiz.filter((_, i) => (quizAnswers[i] || "").trim().toLowerCase() === currentModule.quiz[i].answer.toLowerCase()).length;
    const accuracy = currentModule.quiz.length > 0 ? Math.round((correctCount / currentModule.quiz.length) * 100) : 0;
    completePractice("learn", accuracy);
    markLessonViewed("learn", currentModule.id);
    setCompletedModules((prev) => new Set(Array.from(prev).concat(currentModule.id)));
    setQuizAnswers({});
    setQuizSubmitted(false);
    if (learnModuleIndex < LEARNING_MODULES.length - 1) {
      setLearnModuleIndex(learnModuleIndex + 1);
    }
  }, [currentModule, learnModuleIndex, quizAnswers, completePractice, markLessonViewed]);

  const quizResults = currentModule.quiz.map((q, i) => ({
    correct: (quizAnswers[i] || "").trim().toLowerCase() === q.answer.toLowerCase(),
  }));
  const allQuizCorrect = quizSubmitted && quizResults.every((r) => r.correct);

  return (
    <div className="max-w-[1600px] mx-auto space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-varela font-bold tracking-tight flex items-center gap-2 text-finstep-brown dark:text-foreground">
            <Calculator className="w-6 h-6 text-finstep-orange" />
            DCF Training Lab
          </h1>
          <p className="text-sm text-finstep-brown/60 dark:text-muted-foreground font-nunito mt-1">
            Master DCF valuation through learning, building, and practice
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset} className="h-8">
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset All
        </Button>
      </motion.div>

      {/* Progress & Motivation */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        <Card className="shadow-sm border-border/40">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-finstep-orange/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-finstep-orange" />
              </div>
              <div>
                <p className="text-xl font-varela font-bold tabular-nums">{getOverallProgress()}%</p>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase">Tiến độ</p>
              </div>
            </div>
            <Progress value={getOverallProgress()} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/40">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-varela font-bold tabular-nums">{getStreakDays()}</p>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase">Ngày streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/40">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xl font-varela font-bold tabular-nums">
                  {DCF_LEARNING_PATH.filter((s) => getStepProgress(s.id).masteryLevel === "mastered").length}/{DCF_LEARNING_PATH.length}
                </p>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase">Đã nắm vững</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-11 bg-finstep-beige/50 dark:bg-muted/30">
          <TabsTrigger value="learn" className="data-[state=active]:bg-finstep-orange data-[state=active]:text-white gap-1.5 text-xs font-bold">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Learning</span>
          </TabsTrigger>
          <TabsTrigger value="build" className="data-[state=active]:bg-finstep-orange data-[state=active]:text-white gap-1.5 text-xs font-bold">
            <Hammer className="w-4 h-4" />
            <span className="hidden sm:inline">Build</span>
          </TabsTrigger>
          <TabsTrigger value="case" className="data-[state=active]:bg-finstep-orange data-[state=active]:text-white gap-1.5 text-xs font-bold">
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">Case Study</span>
          </TabsTrigger>
          <TabsTrigger value="sensitivity" className="data-[state=active]:bg-finstep-orange data-[state=active]:text-white gap-1.5 text-xs font-bold">
            <Grid3X3 className="w-4 h-4" />
            <span className="hidden sm:inline">Sensitivity</span>
          </TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════════════════════════════════════
            LEARNING MODE
        ═══════════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="learn" className="space-y-4 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-3 space-y-3">
              <Card className="shadow-sm border-border/40">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-finstep-brown/60 dark:text-muted-foreground">
                    Modules ({completedModules.size}/{LEARNING_MODULES.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2 pb-3">
                  <div className="space-y-1">
                    {LEARNING_MODULES.map((mod, i) => {
                      const isActive = i === learnModuleIndex;
                      const isCompleted = completedModules.has(mod.id);
                      return (
                        <button
                          key={mod.id}
                          onClick={() => {
                            setLearnModuleIndex(i);
                            setQuizAnswers({});
                            setQuizSubmitted(false);
                            markLessonViewed("learn", mod.id);
                          }}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm font-nunito transition-all",
                            isActive
                              ? "bg-finstep-orange text-white"
                              : "text-finstep-brown/80 dark:text-muted-foreground hover:bg-finstep-beige/50 dark:hover:bg-muted/30"
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-emerald-500")} />
                          ) : (
                            <div className={cn("w-4 h-4 rounded-full border-2 shrink-0", isActive ? "border-white" : "border-finstep-brown/30 dark:border-muted-foreground/30")} />
                          )}
                          <span className="truncate font-medium">{mod.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-border/40 bg-finstep-beige/30 dark:bg-muted/20">
                <CardContent className="pt-4 pb-4 px-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-finstep-orange" />
                    <span className="text-xs font-bold text-finstep-brown dark:text-foreground">Progress</span>
                  </div>
                  <Progress
                    value={(completedModules.size / LEARNING_MODULES.length) * 100}
                    className="h-2 bg-finstep-beige dark:bg-muted [&>div]:bg-finstep-orange"
                  />
                  <p className="text-[10px] text-finstep-brown/60 dark:text-muted-foreground mt-2">
                    Complete all modules to master DCF fundamentals
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-9">
              <Card className="shadow-sm border-border/40">
                <CardHeader className="pb-3 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-finstep-orange/10 text-finstep-orange border-finstep-orange/30">
                        Module {learnModuleIndex + 1}
                      </Badge>
                      <CardTitle className="text-lg font-varela font-bold text-finstep-brown dark:text-foreground">
                        {currentModule.title}
                      </CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (learnModuleIndex > 0) {
                            setLearnModuleIndex(learnModuleIndex - 1);
                            setQuizAnswers({});
                            setQuizSubmitted(false);
                          }
                        }}
                        disabled={learnModuleIndex === 0}
                        className="h-8 px-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (learnModuleIndex < LEARNING_MODULES.length - 1) {
                            setLearnModuleIndex(learnModuleIndex + 1);
                            setQuizAnswers({});
                            setQuizSubmitted(false);
                          }
                        }}
                        disabled={learnModuleIndex === LEARNING_MODULES.length - 1}
                        className="h-8 px-2"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-5 space-y-5">
                  <div className="p-4 rounded-xl bg-finstep-orange/5 dark:bg-primary/5 border border-finstep-orange/20 dark:border-primary/20">
                    <p className="text-base font-mono font-bold text-finstep-orange dark:text-primary whitespace-pre-line">
                      {currentModule.formula}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-bold flex items-center gap-1.5 text-finstep-brown dark:text-foreground">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      Explanation
                    </h3>
                    <p className="text-sm text-finstep-brown/80 dark:text-muted-foreground leading-relaxed font-nunito">
                      {currentModule.explanation}
                    </p>
                  </div>

                  <Separator className="opacity-30" />

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-1.5 text-finstep-brown dark:text-foreground">
                      <Calculator className="w-4 h-4 text-finstep-orange" />
                      Example
                    </h3>
                    <div className="bg-finstep-beige/40 dark:bg-muted/30 rounded-lg p-4 space-y-3">
                      <p className="text-xs font-medium text-finstep-brown/70 dark:text-muted-foreground">
                        {currentModule.example.description}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {currentModule.example.inputs.map((inp, i) => (
                          <div key={i} className="bg-white dark:bg-background rounded-md px-3 py-1.5 border border-border/40">
                            <span className="text-[10px] text-finstep-brown/60 dark:text-muted-foreground">{inp.label}</span>
                            <p className="text-sm font-mono font-bold text-finstep-brown dark:text-foreground">{inp.value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="text-xs font-mono text-finstep-brown/70 dark:text-muted-foreground whitespace-pre-line">
                        {currentModule.example.calculation}
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-finstep-orange" />
                        <span className="text-sm font-bold text-finstep-brown dark:text-foreground">
                          Result: {currentModule.example.result}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator className="opacity-30" />

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-1.5 text-finstep-brown dark:text-foreground">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      Common Mistakes
                    </h3>
                    <ul className="space-y-2">
                      {currentModule.commonMistakes.map((mistake, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-finstep-brown/80 dark:text-muted-foreground">
                          <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <span>{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator className="opacity-30" />

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-1.5 text-finstep-brown dark:text-foreground">
                      <Play className="w-4 h-4 text-finstep-orange" />
                      Quick Quiz
                    </h3>
                    <div className="space-y-3">
                      {currentModule.quiz.map((q, i) => {
                        const isCorrect = quizSubmitted && quizResults[i].correct;
                        const isWrong = quizSubmitted && !quizResults[i].correct;
                        return (
                          <div key={i} className="space-y-1.5">
                            <p className="text-xs font-medium text-finstep-brown/70 dark:text-muted-foreground">
                              {q.question}
                            </p>
                            <div className="flex items-center gap-2">
                              <Input
                                value={quizAnswers[i] || ""}
                                onChange={(e) => setQuizAnswers((prev) => ({ ...prev, [i]: e.target.value }))}
                                placeholder={q.hint}
                                disabled={quizSubmitted}
                                className={cn(
                                  "text-sm h-9 max-w-xs",
                                  isCorrect && "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20",
                                  isWrong && "border-red-400 bg-red-50 dark:bg-red-950/20"
                                )}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !quizSubmitted) setQuizSubmitted(true);
                                }}
                              />
                              {quizSubmitted && (
                                isCorrect ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                                )
                              )}
                            </div>
                            {isWrong && (
                              <p className="text-[11px] text-red-500">
                                Answer: <strong>{q.answer}</strong>
                              </p>
                            )}
                          </div>
                        );
                      })}

                      {!quizSubmitted ? (
                        <Button
                          onClick={() => setQuizSubmitted(true)}
                          className="h-9 text-sm bg-finstep-orange text-white hover:brightness-110"
                          disabled={Object.keys(quizAnswers).length === 0}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1.5" />
                          Check Answers
                        </Button>
                      ) : (
                        <div className="flex items-center gap-3">
                          {allQuizCorrect ? (
                            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                              <Trophy className="w-5 h-5 text-emerald-500" />
                              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">All correct!</span>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              onClick={() => {
                                setQuizAnswers({});
                                setQuizSubmitted(false);
                              }}
                              className="h-9 text-sm"
                            >
                              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                              Try Again
                            </Button>
                          )}
                          <Button
                            onClick={handleModuleComplete}
                            className="h-9 text-sm bg-finstep-orange text-white hover:brightness-110"
                          >
                            {learnModuleIndex < LEARNING_MODULES.length - 1 ? (
                              <>
                                Next Module
                                <ArrowRight className="w-4 h-4 ml-1.5" />
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                Complete
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════════════
            BUILD MODE
        ═══════════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="build" className="space-y-4 mt-0">
          <Card className="shadow-sm border-border/40">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-finstep-orange/10 text-finstep-orange border-finstep-orange/30">
                    Step {buildStep}/9
                  </Badge>
                  <span className="text-sm font-bold text-finstep-brown dark:text-foreground">
                    {BUILD_STEPS[buildStep - 1].title}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBuildStep(Math.max(1, buildStep - 1))}
                    disabled={buildStep === 1}
                    className="h-8 px-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBuildStep(Math.min(9, buildStep + 1))}
                    disabled={buildStep === 9}
                    className="h-8 px-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Progress value={(buildStep / 9) * 100} className="h-2 bg-finstep-beige dark:bg-muted [&>div]:bg-finstep-orange" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-4 space-y-4">
              <Card className="shadow-sm border-border/40">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-finstep-brown dark:text-foreground">
                    <TrendingUp className="w-4 h-4 text-finstep-orange" />
                    {BUILD_STEPS[buildStep - 1].title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-finstep-brown/70 dark:text-muted-foreground">
                    {BUILD_STEPS[buildStep - 1].description}
                  </p>

                  {BUILD_STEPS[buildStep - 1].fields.length > 0 ? (
                    <div className="space-y-3">
                      {BUILD_STEPS[buildStep - 1].fields.map((fieldKey) => {
                        const field = ASSUMPTION_FIELDS.find((f) => f.key === fieldKey)!;
                        return (
                          <div key={fieldKey} className="space-y-1">
                            <Label className="text-xs">{field.label}</Label>
                            <div className="relative">
                              <Input
                                type="number"
                                value={assumptions[fieldKey]}
                                onChange={(e) => updateAssumption(fieldKey, e.target.value)}
                                className="bg-finstep-beige/30 dark:bg-muted/30 pr-8"
                                step={field.step}
                                min={field.min}
                                max={field.max}
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-finstep-brown/50 dark:text-muted-foreground pointer-events-none">
                                {field.suffix}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-finstep-beige/30 dark:bg-muted/20 text-xs text-finstep-brown/70 dark:text-muted-foreground">
                      <Info className="w-4 h-4 inline mr-1.5 text-finstep-orange" />
                      This step shows calculated values based on your assumptions.
                    </div>
                  )}

                  {BUILD_STEPS[buildStep - 1].thinkingPrompt && (
                    <div className="p-3 rounded-lg bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-800/30 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Think Like an Analyst</span>
                      </div>
                      <p className="text-xs text-finstep-brown/80 dark:text-muted-foreground">
                        {BUILD_STEPS[buildStep - 1].thinkingPrompt!.question}
                      </p>
                      <p className="text-[10px] text-finstep-brown/60 dark:text-muted-foreground italic">
                        {BUILD_STEPS[buildStep - 1].thinkingPrompt!.context}
                      </p>
                      <textarea
                        value={thinkingAnswers[buildStep] || ""}
                        onChange={(e) => setThinkingAnswers((prev) => ({ ...prev, [buildStep]: e.target.value }))}
                        placeholder="Your reasoning..."
                        className="w-full text-xs p-2 rounded-md border border-border/40 bg-white dark:bg-background min-h-[60px] resize-none"
                      />
                    </div>
                  )}

                  {warnings.length > 0 && (
                    <div className="space-y-2">
                      {warnings.slice(0, 3).map((w) => (
                        <div
                          key={w.id}
                          className={cn(
                            "p-2.5 rounded-lg text-xs flex items-start gap-2",
                            w.type === "error" && "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400",
                            w.type === "warning" && "bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400",
                            w.type === "info" && "bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400"
                          )}
                        >
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{w.message}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => setBuildStep(Math.max(1, buildStep - 1))}
                      variant="outline"
                      disabled={buildStep === 1}
                      className="flex-1 h-9 text-xs"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                      Back
                    </Button>
                    <Button
                      onClick={() => {
                        if (buildStep === 8) completeScenario("build");
                        setBuildStep(Math.min(9, buildStep + 1));
                      }}
                      className="flex-1 h-9 text-xs bg-finstep-orange text-white hover:brightness-110"
                    >
                      {buildStep === 9 ? "Complete" : "Next"}
                      {buildStep < 9 && <ArrowRight className="w-3.5 h-3.5 ml-1" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-8 space-y-4">
              {(buildStep <= 4 || buildStep === 5) && (
                <Card className="shadow-sm border-border/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-finstep-brown dark:text-foreground">
                      <ArrowRight className="w-4 h-4 text-finstep-orange" />
                      5-Year Projection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border/40">
                            <th className="text-left py-2 px-3 text-finstep-brown/60 dark:text-muted-foreground font-medium sticky left-0 bg-card z-10 min-w-[120px]">
                              Line Item
                            </th>
                            {proj.years.map((y) => (
                              <th key={y.year} className="text-right py-2 px-3 text-finstep-brown/60 dark:text-muted-foreground font-medium min-w-[80px]">
                                Year {y.year}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border/20">
                            <td className="py-1.5 px-3 font-medium text-finstep-brown dark:text-foreground sticky left-0 bg-card z-10">Revenue</td>
                            {proj.years.map((y) => (
                              <td key={y.year} className="py-1.5 px-3 text-right tabular-nums">{fmt(y.revenue)}</td>
                            ))}
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-1.5 px-3 font-medium text-finstep-brown dark:text-foreground sticky left-0 bg-card z-10">EBITDA</td>
                            {proj.years.map((y) => (
                              <td key={y.year} className="py-1.5 px-3 text-right tabular-nums">{fmt(y.ebitda)}</td>
                            ))}
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-1.5 px-3 text-finstep-brown/70 dark:text-muted-foreground sticky left-0 bg-card z-10">D&A</td>
                            {proj.years.map((y) => (
                              <td key={y.year} className="py-1.5 px-3 text-right tabular-nums text-finstep-brown/70 dark:text-muted-foreground">{fmt(y.da)}</td>
                            ))}
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-1.5 px-3 font-medium text-finstep-brown dark:text-foreground sticky left-0 bg-card z-10">EBIT</td>
                            {proj.years.map((y) => (
                              <td key={y.year} className="py-1.5 px-3 text-right tabular-nums">{fmt(y.ebit)}</td>
                            ))}
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-1.5 px-3 text-finstep-brown/70 dark:text-muted-foreground sticky left-0 bg-card z-10">Taxes</td>
                            {proj.years.map((y) => (
                              <td key={y.year} className="py-1.5 px-3 text-right tabular-nums text-finstep-brown/70 dark:text-muted-foreground">({fmt(y.taxes)})</td>
                            ))}
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-1.5 px-3 font-medium text-finstep-brown dark:text-foreground sticky left-0 bg-card z-10">NOPAT</td>
                            {proj.years.map((y) => (
                              <td key={y.year} className="py-1.5 px-3 text-right tabular-nums">{fmt(y.nopat)}</td>
                            ))}
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-1.5 px-3 text-finstep-brown/70 dark:text-muted-foreground sticky left-0 bg-card z-10">(+) D&A</td>
                            {proj.years.map((y) => (
                              <td key={y.year} className="py-1.5 px-3 text-right tabular-nums text-emerald-600 dark:text-emerald-400">{fmt(y.da)}</td>
                            ))}
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-1.5 px-3 text-finstep-brown/70 dark:text-muted-foreground sticky left-0 bg-card z-10">(−) CapEx</td>
                            {proj.years.map((y) => (
                              <td key={y.year} className="py-1.5 px-3 text-right tabular-nums text-red-500">({fmt(y.capex)})</td>
                            ))}
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-1.5 px-3 text-finstep-brown/70 dark:text-muted-foreground sticky left-0 bg-card z-10">(−) ΔNWC</td>
                            {proj.years.map((y) => (
                              <td key={y.year} className="py-1.5 px-3 text-right tabular-nums text-red-500">({fmt(y.nwcChange)})</td>
                            ))}
                          </tr>
                          <tr className="bg-finstep-beige/30 dark:bg-muted/20 border-t-2 border-finstep-orange/30">
                            <td className="py-2 px-3 font-bold text-finstep-brown dark:text-foreground sticky left-0 bg-finstep-beige/30 dark:bg-muted/20 z-10">
                              Unlevered FCF
                            </td>
                            {proj.years.map((y) => (
                              <td key={y.year} className={cn("py-2 px-3 text-right tabular-nums font-bold", y.ufcf < 0 ? "text-red-500" : "text-finstep-brown dark:text-foreground")}>
                                {fmt(y.ufcf)}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {buildStep === 2 && (
                <Card className="shadow-sm border-border/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-finstep-brown dark:text-foreground">Revenue Projection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={proj.years}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                          <XAxis dataKey="year" tick={{ fontSize: 11 }} tickFormatter={(v) => `Y${v}`} />
                          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmtCompact(v)} />
                          <Tooltip
                            formatter={(value: number | undefined) => [value != null ? `$${fmt(value)}` : "—", "Revenue"]}
                            labelFormatter={(label) => `Year ${label}`}
                            contentStyle={{ fontSize: 12, borderRadius: 8 }}
                          />
                          <Bar dataKey="revenue" fill="hsl(var(--finstep-orange))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              {buildStep === 5 && (
                <Card className="shadow-sm border-border/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-finstep-brown dark:text-foreground">Free Cash Flow Forecast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={proj.years}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                          <XAxis dataKey="year" tick={{ fontSize: 11 }} tickFormatter={(v) => `Y${v}`} />
                          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmtCompact(v)} />
                          <Tooltip
                            formatter={(value: number | undefined) => [value != null ? `$${fmt(value)}` : "—", "FCF"]}
                            labelFormatter={(label) => `Year ${label}`}
                            contentStyle={{ fontSize: 12, borderRadius: 8 }}
                          />
                          <Bar dataKey="ufcf" radius={[4, 4, 0, 0]}>
                            {proj.years.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.ufcf >= 0 ? "hsl(var(--finstep-orange))" : "#ef4444"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              {(buildStep >= 6 && buildStep <= 8) && (
                <Card className="shadow-sm border-border/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-finstep-brown dark:text-foreground">Present Value of Cash Flows</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border/40">
                            <th className="text-left py-2 px-3 text-finstep-brown/60 dark:text-muted-foreground font-medium sticky left-0 bg-card z-10" />
                            {proj.years.map((y) => (
                              <th key={y.year} className="text-right py-2 px-3 text-finstep-brown/60 dark:text-muted-foreground font-medium min-w-[80px]">
                                Year {y.year}
                              </th>
                            ))}
                            <th className="text-right py-2 px-3 text-finstep-brown/60 dark:text-muted-foreground font-medium min-w-[80px]">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border/20">
                            <td className="py-1.5 px-3 text-finstep-brown/70 dark:text-muted-foreground sticky left-0 bg-card z-10">Discount Factor</td>
                            {proj.pvFactors.map((f, i) => (
                              <td key={i} className="py-1.5 px-3 text-right tabular-nums text-finstep-brown/70 dark:text-muted-foreground">{f.toFixed(4)}</td>
                            ))}
                            <td className="py-1.5 px-3 text-right tabular-nums text-finstep-brown/50 dark:text-muted-foreground">—</td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <td className="py-1.5 px-3 font-medium text-finstep-brown dark:text-foreground sticky left-0 bg-card z-10">PV of FCF</td>
                            {proj.pvFCFs.map((pv, i) => (
                              <td key={i} className={cn("py-1.5 px-3 text-right tabular-nums", pv < 0 ? "text-red-500" : "text-finstep-brown dark:text-foreground")}>{fmt(pv)}</td>
                            ))}
                            <td className="py-1.5 px-3 text-right tabular-nums font-bold text-finstep-brown dark:text-foreground">{fmt(proj.sumPvFCF)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {buildStep === 9 && (
                <>
                  <Card className="shadow-sm border-border/40">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-finstep-brown dark:text-foreground">Valuation Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="rounded-lg border border-border/40 p-3">
                          <p className="text-[10px] text-finstep-brown/60 dark:text-muted-foreground">PV of FCFs</p>
                          <p className="text-lg font-bold tabular-nums text-finstep-brown dark:text-foreground">{fmt(proj.sumPvFCF)}</p>
                        </div>
                        <div className="rounded-lg border border-border/40 p-3">
                          <p className="text-[10px] text-finstep-brown/60 dark:text-muted-foreground">PV of TV (Gordon)</p>
                          <p className="text-lg font-bold tabular-nums text-finstep-brown dark:text-foreground">{fmt(proj.pvTvGordon)}</p>
                        </div>
                        <div className="rounded-lg border border-border/40 p-3">
                          <p className="text-[10px] text-finstep-brown/60 dark:text-muted-foreground">PV of TV (Exit)</p>
                          <p className="text-lg font-bold tabular-nums text-finstep-brown dark:text-foreground">{fmt(proj.pvTvExit)}</p>
                        </div>
                        <div className="rounded-lg bg-finstep-orange p-3 text-white">
                          <p className="text-[10px] text-white/80">Enterprise Value</p>
                          <p className="text-lg font-bold tabular-nums">{fmt(proj.evAverage)}</p>
                          <Badge variant="secondary" className="mt-1 text-[9px] bg-white/20 text-white border-0">
                            Average
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-border/40">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-finstep-brown dark:text-foreground">EV Composition</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: "Gordon Growth", pvFcf: proj.sumPvFCF, pvTv: proj.pvTvGordon },
                              { name: "Exit Multiple", pvFcf: proj.sumPvFCF, pvTv: proj.pvTvExit },
                            ]}
                            layout="vertical"
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                            <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => fmtCompact(v)} />
                            <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
                            <Tooltip
                              formatter={(value: number | undefined, name?: string) => [value != null ? `$${fmt(value)}` : "—", name === "pvFcf" ? "PV of FCFs" : "PV of TV"]}
                              contentStyle={{ fontSize: 12, borderRadius: 8 }}
                            />
                            <Legend formatter={(value) => (value === "pvFcf" ? "PV of FCFs" : "PV of Terminal Value")} wrapperStyle={{ fontSize: 11 }} />
                            <Bar dataKey="pvFcf" stackId="a" fill="hsl(var(--finstep-orange))" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="pvTv" stackId="a" fill="hsl(var(--finstep-brown))" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-[10px] text-finstep-brown/60 dark:text-muted-foreground mt-2 text-center">
                        Terminal value accounts for {proj.tvPercentGordon.toFixed(0)}% (Gordon) / {proj.tvPercentExit.toFixed(0)}% (Exit) of total EV
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════════════
            CASE STUDY MODE
        ═══════════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="case" className="space-y-4 mt-0">
          {!selectedCompany ? (
            <div className="space-y-4">
              <div className="text-center py-4">
                <h2 className="text-xl font-varela font-bold text-finstep-brown dark:text-foreground">Select a Company</h2>
                <p className="text-sm text-finstep-brown/60 dark:text-muted-foreground mt-1">Practice DCF valuation with real company data</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {COMPANY_CASES.map((company) => (
                  <Card
                    key={company.id}
                    className="shadow-sm border-border/40 hover:shadow-lg hover:border-finstep-orange/30 transition-all cursor-pointer group"
                    onClick={() => {
                      setSelectedCompany(company.id);
                      setCaseCompleted(false);
                      const metrics = calculateHistoricalMetrics(company);
                      setAssumptions({
                        ...DEFAULT_ASSUMPTIONS,
                        baseRevenue: metrics.lastRevenue,
                        revenueGrowth: Math.round(metrics.avgGrowth),
                        ebitdaMargin: Math.round(metrics.avgEbitMargin + metrics.avgDaPercent),
                        daPercent: Math.round(metrics.avgDaPercent),
                        capexPercent: Math.round(metrics.avgCapexPercent),
                        wacc: company.sectorAvgWacc,
                      });
                    }}
                  >
                    <CardContent className="pt-5 pb-4 text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-finstep-beige/50 dark:bg-muted/30 flex items-center justify-center group-hover:bg-finstep-orange/10 transition-colors">
                        <Building2 className="w-6 h-6 text-finstep-brown/60 dark:text-muted-foreground group-hover:text-finstep-orange transition-colors" />
                      </div>
                      <h3 className="font-varela font-bold text-finstep-brown dark:text-foreground group-hover:text-finstep-orange transition-colors">
                        {company.name}
                      </h3>
                      <p className="text-xs text-finstep-brown/50 dark:text-muted-foreground">{company.ticker}</p>
                      <Badge variant="secondary" className="mt-2 text-[9px] bg-finstep-beige dark:bg-muted text-finstep-brown dark:text-muted-foreground">
                        {company.sector}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedCompany(null)} className="h-8 px-2">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div>
                    <h2 className="text-lg font-varela font-bold text-finstep-brown dark:text-foreground flex items-center gap-2">
                      {selectedCase?.name}
                      <Badge variant="outline" className="text-[10px]">{selectedCase?.ticker}</Badge>
                    </h2>
                    <p className="text-xs text-finstep-brown/60 dark:text-muted-foreground">{selectedCase?.sector}</p>
                  </div>
                </div>
                {!caseCompleted && (
                  <Button
                    onClick={() => {
                    setCaseCompleted(true);
                    completeScenario("case");
                  }}
                    className="h-9 bg-finstep-orange text-white hover:brightness-110"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Submit Valuation
                  </Button>
                )}
              </div>

              <Card className="shadow-sm border-border/40 border-l-4 border-l-finstep-orange">
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-finstep-brown/80 dark:text-muted-foreground italic">
                    &quot;You are an equity research analyst covering <strong>{selectedCase?.name}</strong>. Your task is to estimate the company&apos;s intrinsic value using a 5-year DCF model. Analyze the historical data below and determine appropriate assumptions for revenue growth, operating margin, reinvestment, and discount rate.&quot;
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-8 space-y-4">
                  <Card className="shadow-sm border-border/40">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-finstep-brown dark:text-foreground">Historical Financials ($ millions)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-border/40">
                              <th className="text-left py-2 px-3 text-finstep-brown/60 dark:text-muted-foreground font-medium sticky left-0 bg-card z-10">Metric</th>
                              {selectedCase?.historicalData.map((d) => (
                                <th key={d.year} className="text-right py-2 px-3 text-finstep-brown/60 dark:text-muted-foreground font-medium min-w-[80px]">
                                  {d.year}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-border/20">
                              <td className="py-1.5 px-3 font-medium text-finstep-brown dark:text-foreground sticky left-0 bg-card z-10">Revenue</td>
                              {selectedCase?.historicalData.map((d) => (
                                <td key={d.year} className="py-1.5 px-3 text-right tabular-nums">{fmtCompact(d.revenue)}</td>
                              ))}
                            </tr>
                            <tr className="border-b border-border/20">
                              <td className="py-1.5 px-3 font-medium text-finstep-brown dark:text-foreground sticky left-0 bg-card z-10">EBIT</td>
                              {selectedCase?.historicalData.map((d) => (
                                <td key={d.year} className="py-1.5 px-3 text-right tabular-nums">{fmtCompact(d.ebit)}</td>
                              ))}
                            </tr>
                            <tr className="border-b border-border/20">
                              <td className="py-1.5 px-3 text-finstep-brown/70 dark:text-muted-foreground sticky left-0 bg-card z-10">D&A</td>
                              {selectedCase?.historicalData.map((d) => (
                                <td key={d.year} className="py-1.5 px-3 text-right tabular-nums text-finstep-brown/70 dark:text-muted-foreground">{fmtCompact(d.da)}</td>
                              ))}
                            </tr>
                            <tr className="border-b border-border/20">
                              <td className="py-1.5 px-3 text-finstep-brown/70 dark:text-muted-foreground sticky left-0 bg-card z-10">CapEx</td>
                              {selectedCase?.historicalData.map((d) => (
                                <td key={d.year} className="py-1.5 px-3 text-right tabular-nums text-finstep-brown/70 dark:text-muted-foreground">{fmtCompact(d.capex)}</td>
                              ))}
                            </tr>
                            <tr className="border-b border-border/20">
                              <td className="py-1.5 px-3 text-finstep-brown/70 dark:text-muted-foreground sticky left-0 bg-card z-10">Net Working Capital</td>
                              {selectedCase?.historicalData.map((d) => (
                                <td key={d.year} className="py-1.5 px-3 text-right tabular-nums text-finstep-brown/70 dark:text-muted-foreground">{fmtCompact(d.nwc)}</td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {caseMetrics && (
                    <Card className="shadow-sm border-border/40 bg-finstep-beige/20 dark:bg-muted/10">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Info className="w-4 h-4 text-finstep-orange" />
                          <span className="text-xs font-bold text-finstep-brown dark:text-foreground">Historical Averages</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="bg-white dark:bg-background rounded-lg p-2.5 border border-border/40">
                            <p className="text-[9px] text-finstep-brown/60 dark:text-muted-foreground">Avg Revenue Growth</p>
                            <p className="text-sm font-bold text-finstep-brown dark:text-foreground">{caseMetrics.avgGrowth.toFixed(1)}%</p>
                          </div>
                          <div className="bg-white dark:bg-background rounded-lg p-2.5 border border-border/40">
                            <p className="text-[9px] text-finstep-brown/60 dark:text-muted-foreground">Avg EBIT Margin</p>
                            <p className="text-sm font-bold text-finstep-brown dark:text-foreground">{caseMetrics.avgEbitMargin.toFixed(1)}%</p>
                          </div>
                          <div className="bg-white dark:bg-background rounded-lg p-2.5 border border-border/40">
                            <p className="text-[9px] text-finstep-brown/60 dark:text-muted-foreground">Avg D&A %</p>
                            <p className="text-sm font-bold text-finstep-brown dark:text-foreground">{caseMetrics.avgDaPercent.toFixed(1)}%</p>
                          </div>
                          <div className="bg-white dark:bg-background rounded-lg p-2.5 border border-border/40">
                            <p className="text-[9px] text-finstep-brown/60 dark:text-muted-foreground">Avg CapEx %</p>
                            <p className="text-sm font-bold text-finstep-brown dark:text-foreground">{caseMetrics.avgCapexPercent.toFixed(1)}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="shadow-sm border-border/40">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-finstep-brown dark:text-foreground">Your DCF Projection</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-border/40">
                              <th className="text-left py-2 px-3 text-finstep-brown/60 dark:text-muted-foreground font-medium sticky left-0 bg-card z-10">Line Item</th>
                              {proj.years.map((y) => (
                                <th key={y.year} className="text-right py-2 px-3 text-finstep-brown/60 dark:text-muted-foreground font-medium min-w-[80px]">
                                  Y{y.year}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-border/20">
                              <td className="py-1.5 px-3 font-medium text-finstep-brown dark:text-foreground sticky left-0 bg-card z-10">Revenue</td>
                              {proj.years.map((y) => (
                                <td key={y.year} className="py-1.5 px-3 text-right tabular-nums">{fmtCompact(y.revenue)}</td>
                              ))}
                            </tr>
                            <tr className="border-b border-border/20">
                              <td className="py-1.5 px-3 font-medium text-finstep-brown dark:text-foreground sticky left-0 bg-card z-10">EBITDA</td>
                              {proj.years.map((y) => (
                                <td key={y.year} className="py-1.5 px-3 text-right tabular-nums">{fmtCompact(y.ebitda)}</td>
                              ))}
                            </tr>
                            <tr className="border-b border-border/20 bg-finstep-beige/20 dark:bg-muted/10">
                              <td className="py-1.5 px-3 font-bold text-finstep-brown dark:text-foreground sticky left-0 bg-finstep-beige/20 dark:bg-muted/10 z-10">FCF</td>
                              {proj.years.map((y) => (
                                <td key={y.year} className={cn("py-1.5 px-3 text-right tabular-nums font-bold", y.ufcf < 0 ? "text-red-500" : "text-finstep-brown dark:text-foreground")}>
                                  {fmtCompact(y.ufcf)}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {caseCompleted && caseFeedback.length > 0 && (
                    <Card className="shadow-sm border-border/40 border-l-4 border-l-finstep-orange">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2 text-finstep-brown dark:text-foreground">
                          <Trophy className="w-4 h-4 text-finstep-orange" />
                          Feedback
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {caseFeedback.map((f) => (
                          <div
                            key={f.id}
                            className={cn(
                              "p-2.5 rounded-lg text-xs flex items-start gap-2",
                              f.type === "positive" && "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400",
                              f.type === "negative" && "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400",
                              f.type === "neutral" && "bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400"
                            )}
                          >
                            {f.type === "positive" && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
                            {f.type === "negative" && <XCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                            {f.type === "neutral" && <Info className="w-4 h-4 shrink-0 mt-0.5" />}
                            <span>{f.message}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="lg:col-span-4 space-y-4">
                  <Card className="shadow-sm border-border/40">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2 text-finstep-brown dark:text-foreground">
                        <TrendingUp className="w-4 h-4 text-finstep-orange" />
                        Your Assumptions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {ASSUMPTION_FIELDS.map((field) => (
                        <div key={field.key} className="space-y-1">
                          <Label className="text-[10px]">{field.label}</Label>
                          <div className="relative">
                            <Input
                              type="number"
                              value={assumptions[field.key]}
                              onChange={(e) => updateAssumption(field.key, e.target.value)}
                              className="h-8 text-xs bg-finstep-beige/30 dark:bg-muted/30 pr-7"
                              step={field.step}
                              min={field.min}
                              max={field.max}
                              disabled={caseCompleted}
                            />
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-finstep-brown/50 dark:text-muted-foreground pointer-events-none">
                              {field.suffix}
                            </span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-border/40 bg-finstep-orange text-white">
                    <CardContent className="pt-4 pb-4">
                      <p className="text-[10px] text-white/70">Your Enterprise Value</p>
                      <p className="text-2xl font-bold tabular-nums">${fmtCompact(proj.evAverage)}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="text-[9px] bg-white/20 text-white border-0">
                          Gordon: ${fmtCompact(proj.evGordon)}
                        </Badge>
                        <Badge variant="secondary" className="text-[9px] bg-white/20 text-white border-0">
                          Exit: ${fmtCompact(proj.evExit)}
                        </Badge>
                      </div>
                      {selectedCase && (
                        <p className="text-[10px] text-white/60 mt-2">
                          Reference: ${fmtCompact(selectedCase.referenceEVRange[0])} - ${fmtCompact(selectedCase.referenceEVRange[1])}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════════════
            SENSITIVITY LAB
        ═══════════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="sensitivity" className="space-y-4 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-3 space-y-4">
              <Card className="shadow-sm border-border/40">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-finstep-brown dark:text-foreground">
                    <TrendingUp className="w-4 h-4 text-finstep-orange" />
                    Base Assumptions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ASSUMPTION_FIELDS.filter((f) => ["wacc", "terminalGrowth", "baseRevenue", "revenueGrowth", "ebitdaMargin"].includes(f.key)).map((field) => (
                    <div key={field.key} className="space-y-1">
                      <Label className="text-[10px]">{field.label}</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={assumptions[field.key]}
                          onChange={(e) => updateAssumption(field.key, e.target.value)}
                          className="h-8 text-xs bg-finstep-beige/30 dark:bg-muted/30 pr-7"
                          step={field.step}
                          min={field.min}
                          max={field.max}
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-finstep-brown/50 dark:text-muted-foreground pointer-events-none">
                          {field.suffix}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-sm border-border/40 bg-finstep-beige/30 dark:bg-muted/20">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-finstep-brown dark:text-foreground">Key Insight</span>
                  </div>
                  <p className="text-[11px] text-finstep-brown/70 dark:text-muted-foreground leading-relaxed">
                    Terminal value often accounts for <strong>60-80%</strong> of total DCF valuation. Small changes in WACC and terminal growth can swing the valuation by <strong>20-50%</strong>. This is why sensitivity analysis is critical.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-9 space-y-4">
              <Card className="shadow-sm border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-finstep-brown dark:text-foreground">
                    <Grid3X3 className="w-4 h-4 text-finstep-orange" />
                    WACC vs Terminal Growth Sensitivity (Enterprise Value)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr>
                          <th className="py-2 px-3 text-finstep-brown/60 dark:text-muted-foreground font-medium text-left">
                            WACC ↓ / g →
                          </th>
                          {sensitivity.growthRange.map((g) => (
                            <th key={g} className="py-2 px-3 text-finstep-brown/60 dark:text-muted-foreground font-medium text-center min-w-[80px]">
                              {g}%
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sensitivity.cells.map((row, ri) => (
                          <tr key={sensitivity.waccRange[ri]}>
                            <td className="py-2 px-3 font-medium text-finstep-brown dark:text-foreground">
                              {sensitivity.waccRange[ri]}%
                            </td>
                            {row.map((cell, ci) => {
                              const isValid = isFinite(cell.ev) && cell.ev > 0;
                              const range = sensitivity.maxEV - sensitivity.minEV;
                              const normalized = isValid && range > 0 ? (cell.ev - sensitivity.minEV) / range : 0.5;
                              const hue = normalized * 120;

                              return (
                                <td
                                  key={ci}
                                  className={cn(
                                    "py-2 px-3 text-center tabular-nums font-medium transition-all",
                                    cell.isCurrent && "ring-2 ring-finstep-orange ring-offset-1 rounded-md"
                                  )}
                                  style={{
                                    backgroundColor: isValid ? `hsla(${hue}, 70%, 85%, 0.5)` : "transparent",
                                    color: isValid ? `hsl(${hue}, 80%, 25%)` : "inherit",
                                  }}
                                >
                                  {isValid ? fmt(cell.ev) : "N/A"}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-finstep-brown/60 dark:text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-3 rounded" style={{ backgroundColor: "hsla(0, 70%, 85%, 0.5)" }} />
                      <span>Lower EV</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-3 rounded" style={{ backgroundColor: "hsla(60, 70%, 85%, 0.5)" }} />
                      <span>Mid EV</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-3 rounded" style={{ backgroundColor: "hsla(120, 70%, 85%, 0.5)" }} />
                      <span>Higher EV</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-3 rounded ring-2 ring-finstep-orange" />
                      <span>Current</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="shadow-sm border-border/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-finstep-brown dark:text-foreground">EV Composition</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: "Gordon Growth", pvFcf: proj.sumPvFCF, pvTv: proj.pvTvGordon },
                            { name: "Exit Multiple", pvFcf: proj.sumPvFCF, pvTv: proj.pvTvExit },
                          ]}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                          <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => fmtCompact(v)} />
                          <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={90} />
                          <Tooltip
                            formatter={(value: number | undefined, name?: string) => [value != null ? `$${fmt(value)}` : "—", name === "pvFcf" ? "PV of FCFs" : "PV of TV"]}
                            contentStyle={{ fontSize: 11, borderRadius: 8 }}
                          />
                          <Legend formatter={(value) => (value === "pvFcf" ? "PV of FCFs" : "PV of TV")} wrapperStyle={{ fontSize: 10 }} />
                          <Bar dataKey="pvFcf" stackId="a" fill="hsl(var(--finstep-orange))" />
                          <Bar dataKey="pvTv" stackId="a" fill="hsl(var(--finstep-brown))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-border/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-finstep-brown dark:text-foreground">Valuation Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-border/40 p-3">
                        <p className="text-[9px] text-finstep-brown/60 dark:text-muted-foreground">EV (Gordon)</p>
                        <p className="text-lg font-bold tabular-nums text-finstep-brown dark:text-foreground">{fmt(proj.evGordon)}</p>
                        <p className="text-[9px] text-finstep-brown/50 dark:text-muted-foreground">TV: {proj.tvPercentGordon.toFixed(0)}%</p>
                      </div>
                      <div className="rounded-lg border border-border/40 p-3">
                        <p className="text-[9px] text-finstep-brown/60 dark:text-muted-foreground">EV (Exit)</p>
                        <p className="text-lg font-bold tabular-nums text-finstep-brown dark:text-foreground">{fmt(proj.evExit)}</p>
                        <p className="text-[9px] text-finstep-brown/50 dark:text-muted-foreground">TV: {proj.tvPercentExit.toFixed(0)}%</p>
                      </div>
                    </div>
                    <div className="rounded-lg bg-finstep-orange p-3 text-white">
                      <p className="text-[9px] text-white/70">Average Enterprise Value</p>
                      <p className="text-xl font-bold tabular-nums">{fmt(proj.evAverage)}</p>
                    </div>
                    <div className="text-[10px] text-finstep-brown/60 dark:text-muted-foreground space-y-1">
                      <p>Min in grid: <strong>{fmt(sensitivity.minEV)}</strong></p>
                      <p>Max in grid: <strong>{fmt(sensitivity.maxEV)}</strong></p>
                      <p>Range: <strong>{((sensitivity.maxEV - sensitivity.minEV) / proj.evAverage * 100).toFixed(0)}%</strong> of base case</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
