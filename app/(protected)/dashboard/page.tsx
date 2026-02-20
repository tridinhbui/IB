"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQuizStore } from "@/store/useQuizStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Target,
  AlertTriangle,
  BookOpen,
  GripVertical,
  Calculator,
  Building2,
  DollarSign,
  Scale,
  BarChart3,
  Percent,
  Zap,
  Trophy,
  FlaskConical,
  Users,
  ArrowRight,
} from "lucide-react";
import { Difficulty, Section } from "@/types/question";
import { allQuestions } from "@/lib/questions";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const sectionConfigs: {
  label: Section;
  icon: typeof Calculator;
  color: string;
  gradient: string;
}[] = [
  { label: "Accounting", icon: Calculator, color: "text-blue-600", gradient: "from-blue-500/10 to-blue-600/5" },
  { label: "EV vs Equity Value", icon: Building2, color: "text-emerald-600", gradient: "from-emerald-500/10 to-emerald-600/5" },
  { label: "Valuation", icon: DollarSign, color: "text-amber-600", gradient: "from-amber-500/10 to-amber-600/5" },
  { label: "M&A", icon: Scale, color: "text-purple-600", gradient: "from-purple-500/10 to-purple-600/5" },
  { label: "LBO", icon: BarChart3, color: "text-rose-600", gradient: "from-rose-500/10 to-rose-600/5" },
  { label: "Accretion/Dilution", icon: Percent, color: "text-cyan-600", gradient: "from-cyan-500/10 to-cyan-600/5" },
  { label: "Fit & Behavioral", icon: Users, color: "text-indigo-600", gradient: "from-indigo-500/10 to-indigo-600/5" },
];

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

export default function DashboardPage() {
  const router = useRouter();
  const {
    difficulty,
    setDifficulty,
    eliteMode,
    progress,
    getAccuracy,
    getWeakestSection,
    startQuiz,
  } = useQuizStore();

  const accuracy = getAccuracy();
  const weakest = getWeakestSection();

  const handleStartSectionQuiz = (section: Section) => {
    startQuiz(section);
    router.push("/quiz");
  };

  const handleStartMixedQuiz = () => {
    startQuiz();
    router.push("/quiz");
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto space-y-8"
    >
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and start training
          </p>
        </div>
        <Select
          value={difficulty}
          onValueChange={(v) => setDifficulty(v as Difficulty)}
        >
          <SelectTrigger className="w-44 shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
            <SelectItem value="Elite">Elite</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={item}>
          <Card className="shadow-sm hover:shadow-md transition-shadow border-border/40">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums">
                    {progress.totalCompleted}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Questions Done
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="shadow-sm hover:shadow-md transition-shadow border-border/40">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 flex items-center justify-center">
                  <Target className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums">{accuracy}%</p>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="shadow-sm hover:shadow-md transition-shadow border-border/40">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-bold truncate max-w-[120px]">
                    {weakest}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Weakest Section
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="shadow-sm hover:shadow-md transition-shadow border-border/40">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className={`text-sm font-bold ${getRankColor(accuracy)}`}>
                    {getRankLabel(accuracy)}
                  </p>
                  <p className="text-xs text-muted-foreground">Current Rank</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-sm border-border/40 md:col-span-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-lg">Quick Start</h3>
                {eliteMode && (
                  <Badge
                    variant="outline"
                    className="text-amber-600 border-amber-500/30 bg-amber-50 dark:bg-amber-500/10"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Elite
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  onClick={handleStartMixedQuiz}
                  className="h-auto py-4 flex-col gap-2 gradient-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                  size="lg"
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="text-xs font-normal opacity-90">20 Questions</span>
                  Mixed Quiz
                </Button>
                <Button
                  onClick={() => router.push("/accounting-drag")}
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2 shadow-sm"
                  size="lg"
                >
                  <GripVertical className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs font-normal text-muted-foreground">Interactive</span>
                  Drag & Drop
                </Button>
                <Button
                  onClick={() => router.push("/simulation")}
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2 shadow-sm"
                  size="lg"
                >
                  <FlaskConical className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs font-normal text-muted-foreground">Learn</span>
                  3-Statement Sim
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/40">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Recent Results</h3>
              {progress.quizHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No quizzes completed yet.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {progress.quizHistory.slice(-4).reverse().map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">
                          {result.section}
                        </span>
                        <Badge variant="secondary" className="text-[10px] px-1.5">
                          {result.difficulty}
                        </Badge>
                      </div>
                      <span className={`font-semibold tabular-nums ${getRankColor(result.accuracy)}`}>
                        {result.accuracy}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Sections</h2>
          <span className="text-xs text-muted-foreground">
            {allQuestions.length} total questions
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sectionConfigs.map((section) => {
            const stats = progress.sectionStats[section.label];
            const sectionAcc =
              stats && stats.total > 0
                ? Math.round((stats.correct / stats.total) * 100)
                : 0;
            const questionCount = allQuestions.filter(
              (q) => q.section === section.label
            ).length;

            return (
              <motion.div key={section.label} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
                <Card className="shadow-sm hover:shadow-lg transition-all border-border/40 overflow-hidden group">
                  <div className={`h-1 gradient-primary opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <CardHeader className="pb-2 pt-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${section.gradient} flex items-center justify-center`}>
                          <section.icon className={`w-4 h-4 ${section.color}`} />
                        </div>
                        <CardTitle className="text-sm font-semibold">
                          {section.label}
                        </CardTitle>
                      </div>
                      <Badge variant="secondary" className="text-[10px] px-1.5">
                        {questionCount}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-muted-foreground">Accuracy</span>
                          <span className="font-semibold tabular-nums">{sectionAcc}%</span>
                        </div>
                        <Progress value={sectionAcc} className="h-2" />
                      </div>
                      {stats && (
                        <p className="text-xs text-muted-foreground">
                          {stats.correct}/{stats.total} correct
                        </p>
                      )}
                      <Button
                        onClick={() => handleStartSectionQuiz(section.label)}
                        variant="ghost"
                        size="sm"
                        className="w-full group/btn"
                      >
                        Practice
                        <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
