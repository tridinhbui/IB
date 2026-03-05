"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  RotateCcw,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  XCircle,
  BookOpen,
  Hammer,
  Grid3X3,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Calculator,
  Info,
  Target,
  Flame,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CompsAssumptions,
  DEFAULT_COMPASSUMPTIONS,
  type LearningModule,
} from "@/lib/comps/types";
import { computeComps, fmt } from "@/lib/comps/engine";
import { COMPS_LEARNING_MODULES } from "@/lib/comps/modules";
import { useCompsStore } from "@/store/useCompsStore";
import { COMPS_LEARNING_PATH } from "@/lib/comps/learning-path";

const ASSUMPTION_FIELDS: {
  key: keyof CompsAssumptions;
  label: string;
  suffix: string;
  min?: number;
  max?: number;
  step?: number;
}[] = [
  { key: "targetRevenue", label: "Target Revenue", suffix: "$M", min: 0, step: 100 },
  { key: "targetEbitda", label: "Target EBITDA", suffix: "$M", min: 0, step: 10 },
  { key: "targetNetIncome", label: "Target Net Income", suffix: "$M", min: 0, step: 10 },
  { key: "evEbitdaMultiple", label: "EV/EBITDA Multiple", suffix: "x", min: 1, max: 30, step: 0.5 },
  { key: "evRevenueMultiple", label: "EV/Revenue Multiple", suffix: "x", min: 0.5, max: 20, step: 0.5 },
  { key: "peMultiple", label: "P/E Multiple", suffix: "x", min: 5, max: 50, step: 1 },
];

export default function CompsLabPage() {
  const recordVisit = useCompsStore((s) => s.recordVisit);
  const markLessonViewed = useCompsStore((s) => s.markLessonViewed);
  const completePractice = useCompsStore((s) => s.completePractice);
  const completeScenario = useCompsStore((s) => s.completeScenario);
  const getStepProgress = useCompsStore((s) => s.getStepProgress);
  const getOverallProgress = useCompsStore((s) => s.getOverallProgress);
  const getStreakDays = useCompsStore((s) => s.getStreakDays);
  const sensitivityCompleted = useRef(false);

  const [activeTab, setActiveTab] = useState("learn");
  useEffect(() => {
    recordVisit(activeTab);
    if (activeTab === "sensitivity" && !sensitivityCompleted.current) {
      sensitivityCompleted.current = true;
      completeScenario("sensitivity");
    }
  }, [activeTab, recordVisit, completeScenario]);

  const [assumptions, setAssumptions] = useState<CompsAssumptions>(DEFAULT_COMPASSUMPTIONS);

  const [learnModuleIndex, setLearnModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const output = useMemo(() => computeComps(assumptions), [assumptions]);
  const currentModule = COMPS_LEARNING_MODULES[learnModuleIndex] as LearningModule;

  const buildCompleted = useRef(false);
  const updateAssumption = useCallback((key: keyof CompsAssumptions, value: string) => {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      if (!buildCompleted.current) {
        buildCompleted.current = true;
        completeScenario("build");
      }
      setAssumptions((prev) => ({ ...prev, [key]: parsed }));
    }
  }, [completeScenario]);

  const handleReset = useCallback(() => {
    setAssumptions(DEFAULT_COMPASSUMPTIONS);
  }, []);

  const handleModuleComplete = useCallback(() => {
    const correctCount = currentModule.quiz.filter((_, i) => (quizAnswers[i] || "").trim().toLowerCase() === currentModule.quiz[i].answer.toLowerCase()).length;
    const accuracy = currentModule.quiz.length > 0 ? Math.round((correctCount / currentModule.quiz.length) * 100) : 0;
    completePractice("learn", accuracy);
    markLessonViewed("learn", currentModule.id);
    setCompletedModules((prev) => new Set(Array.from(prev).concat(currentModule.id)));
    setQuizAnswers({});
    setQuizSubmitted(false);
    if (learnModuleIndex < COMPS_LEARNING_MODULES.length - 1) {
      setLearnModuleIndex(learnModuleIndex + 1);
    }
  }, [currentModule, learnModuleIndex, quizAnswers, completePractice, markLessonViewed]);

  const quizResults = currentModule.quiz.map((q, i) => ({
    correct: (quizAnswers[i] || "").trim().toLowerCase() === q.answer.toLowerCase(),
  }));
  const allQuizCorrect = quizSubmitted && quizResults.every((r) => r.correct);

  const sensitivityData = useMemo(() => {
    const multiples = [6, 8, 10, 12, 14, 16];
    return multiples.map((m) => ({
      multiple: m,
      ev: assumptions.targetEbitda * m,
    }));
  }, [assumptions.targetEbitda]);

  return (
    <div className="max-w-[1600px] mx-auto space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-varela font-bold tracking-tight flex items-center gap-2 text-finstep-brown dark:text-foreground">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            Comparable Company Analysis Lab
          </h1>
          <p className="text-sm text-finstep-brown/60 dark:text-muted-foreground font-nunito mt-1">
            Master trading comps: EV/EBITDA, EV/Revenue, and peer selection
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset} className="h-8">
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset
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
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
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
                <Trophy className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xl font-varela font-bold tabular-nums">
                  {COMPS_LEARNING_PATH.filter((s) => getStepProgress(s.id).masteryLevel === "mastered").length}/{COMPS_LEARNING_PATH.length}
                </p>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase">Đã nắm vững</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 h-11 bg-finstep-beige/50 dark:bg-muted/30">
          <TabsTrigger value="learn" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white gap-1.5 text-xs font-bold">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Learning</span>
          </TabsTrigger>
          <TabsTrigger value="build" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white gap-1.5 text-xs font-bold">
            <Hammer className="w-4 h-4" />
            <span className="hidden sm:inline">Build</span>
          </TabsTrigger>
          <TabsTrigger value="sensitivity" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white gap-1.5 text-xs font-bold">
            <Grid3X3 className="w-4 h-4" />
            <span className="hidden sm:inline">Sensitivity</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="learn" className="space-y-4 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-3 space-y-3">
              <Card className="shadow-sm border-border/40">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-finstep-brown/60 dark:text-muted-foreground">
                    Modules ({completedModules.size}/{COMPS_LEARNING_MODULES.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2 pb-3">
                  <div className="space-y-1">
                    {COMPS_LEARNING_MODULES.map((mod, i) => {
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
                              ? "bg-blue-500 text-white"
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
            </div>

            <div className="lg:col-span-9">
              <Card className="shadow-sm border-border/40">
                <CardHeader className="pb-3 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-500 border-blue-500/30">
                      Module {learnModuleIndex + 1}
                    </Badge>
                    <CardTitle className="text-lg font-varela font-bold text-finstep-brown dark:text-foreground">
                      {currentModule.title}
                    </CardTitle>
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
                          if (learnModuleIndex < COMPS_LEARNING_MODULES.length - 1) {
                            setLearnModuleIndex(learnModuleIndex + 1);
                            setQuizAnswers({});
                            setQuizSubmitted(false);
                          }
                        }}
                        disabled={learnModuleIndex === COMPS_LEARNING_MODULES.length - 1}
                        className="h-8 px-2"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-5 space-y-5">
                  <div className="p-4 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20">
                    <p className="text-base font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-pre-line">
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

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-1.5 text-finstep-brown dark:text-foreground">
                      <Calculator className="w-4 h-4 text-blue-500" />
                      Example
                    </h3>
                    <div className="bg-finstep-beige/40 dark:bg-muted/30 rounded-lg p-4 space-y-3">
                      <p className="text-xs font-medium text-finstep-brown/70 dark:text-muted-foreground">
                        {currentModule.example.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-bold text-finstep-brown dark:text-foreground">
                          Result: {currentModule.example.result}
                        </span>
                      </div>
                    </div>
                  </div>

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

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-1.5 text-finstep-brown dark:text-foreground">
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
                              {quizSubmitted && (isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0" />)}
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
                          className="h-9 text-sm bg-blue-500 text-white hover:bg-blue-600"
                          disabled={Object.keys(quizAnswers).length === 0}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1.5" />
                          Check Answers
                        </Button>
                      ) : (
                        <div className="flex items-center gap-3">
                          {!allQuizCorrect && (
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
                            className="h-9 text-sm bg-blue-500 text-white hover:bg-blue-600"
                          >
                            {learnModuleIndex < COMPS_LEARNING_MODULES.length - 1 ? (
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

        <TabsContent value="build" className="space-y-4 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-4">
              <Card className="shadow-sm border-border/40">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-finstep-brown dark:text-foreground">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    Target & Multiples
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-finstep-brown/70 dark:text-muted-foreground">
                    Enter target company metrics and peer-derived multiples to calculate implied valuation.
                  </p>
                  <div className="space-y-3">
                    {ASSUMPTION_FIELDS.map((field) => (
                      <div key={field.key} className="space-y-1">
                        <Label className="text-xs">{field.label}</Label>
                        <div className="relative">
                          <Input
                            type="number"
                            value={assumptions[field.key]}
                            onChange={(e) => updateAssumption(field.key, e.target.value)}
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <Card className="shadow-sm border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-finstep-brown dark:text-foreground">
                    <Calculator className="w-4 h-4 text-blue-500" />
                    Implied Valuation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="rounded-lg border border-border/40 p-3">
                      <p className="text-[10px] text-finstep-brown/60 dark:text-muted-foreground">EV from EV/EBITDA</p>
                      <p className="text-lg font-bold tabular-nums text-finstep-brown dark:text-foreground">{fmt(output.evFromEbitda)}</p>
                    </div>
                    <div className="rounded-lg border border-border/40 p-3">
                      <p className="text-[10px] text-finstep-brown/60 dark:text-muted-foreground">EV from EV/Revenue</p>
                      <p className="text-lg font-bold tabular-nums text-finstep-brown dark:text-foreground">{fmt(output.evFromRevenue)}</p>
                    </div>
                    <div className="rounded-lg border border-border/40 p-3">
                      <p className="text-[10px] text-finstep-brown/60 dark:text-muted-foreground">Equity from P/E</p>
                      <p className="text-lg font-bold tabular-nums text-finstep-brown dark:text-foreground">{fmt(output.equityFromPe)}</p>
                    </div>
                    <div className="rounded-lg bg-blue-500 p-3 text-white">
                      <p className="text-[10px] text-white/80">EV Range</p>
                      <p className="text-lg font-bold tabular-nums">
                        {fmt(output.evRange[0])} - {fmt(output.evRange[1])}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-finstep-beige/30 dark:bg-muted/20">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-bold text-finstep-brown dark:text-foreground">Key Insight</span>
                    </div>
                    <p className="text-[11px] text-finstep-brown/70 dark:text-muted-foreground mt-2">
                      The valuation range comes from applying different multiples. EV/EBITDA is typically the primary multiple for profitable companies. Use the range (low-high) in your football field chart.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sensitivity" className="space-y-4 mt-0">
          <Card className="shadow-sm border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-finstep-brown dark:text-foreground">
                <Grid3X3 className="w-4 h-4 text-blue-500" />
                EV/EBITDA Multiple Sensitivity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="py-2 px-3 text-finstep-brown/60 dark:text-muted-foreground font-medium text-left">EV/EBITDA</th>
                      <th className="py-2 px-3 text-finstep-brown/60 dark:text-muted-foreground font-medium text-right">Implied EV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sensitivityData.map((row) => (
                      <tr
                        key={row.multiple}
                        className={cn(
                          "border-b border-border/20",
                          row.multiple === assumptions.evEbitdaMultiple && "bg-blue-500/10 dark:bg-blue-500/20"
                        )}
                      >
                        <td className="py-2 px-3 font-medium text-finstep-brown dark:text-foreground">
                          {row.multiple}x
                        </td>
                        <td className="py-2 px-3 text-right tabular-nums font-medium">
                          {fmt(row.ev)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-finstep-brown/60 dark:text-muted-foreground mt-3">
                Target EBITDA: {fmt(assumptions.targetEbitda)}. Each 1x change in multiple = {fmt(assumptions.targetEbitda)} change in EV.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
