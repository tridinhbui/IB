"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  FlaskConical,
  ChevronRight,
  Flame,
  Trophy,
  BookOpen,
  Target,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useCorporateFinanceStore } from "@/store/useCorporateFinanceStore";
import { CF_LEARNING_PATH } from "@/lib/corporate-finance/learning-path";
import { cn } from "@/lib/utils";

function MasteryBadge({ level }: { level: string }) {
  const config: Record<string, { label: string; color: string }> = {
    "not-started": { label: "Chưa bắt đầu", color: "bg-muted text-muted-foreground" },
    learning: { label: "Đang học", color: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
    practicing: { label: "Đang luyện", color: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
    mastered: { label: "Đã nắm vững", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  };
  const c = config[level] ?? config["not-started"];
  return (
    <Badge variant="outline" className={cn("text-[10px] font-medium", c.color)}>
      {c.label}
    </Badge>
  );
}

export default function CorporateFinancePage() {
  const router = useRouter();
  const getLabProgress = useCorporateFinanceStore((s) => s.getLabProgress);
  const getOverallProgress = useCorporateFinanceStore((s) => s.getOverallProgress);
  const getNextStep = useCorporateFinanceStore((s) => s.getNextStep);
  const getStreakDays = useCorporateFinanceStore((s) => s.getStreakDays);

  const overallProgress = getOverallProgress();
  const nextStepId = getNextStep();
  const streakDays = getStreakDays();
  const nextStep = nextStepId
    ? CF_LEARNING_PATH.find((s) => s.id === nextStepId)
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <FlaskConical className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-varela font-bold tracking-tight text-finstep-brown dark:text-foreground">
          Corporate Finance Training
        </h1>
        <p className="text-sm text-finstep-brown/60 dark:text-muted-foreground mt-1">
          Build forecasts, analyze performance, evaluate investments. Theo dõi tiến độ và nắm vững từng phần.
        </p>
      </motion.div>

      {/* Progress & Motivation */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <Card className="shadow-sm border-border/40">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-finstep-orange/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-finstep-orange" />
              </div>
              <div>
                <p className="text-2xl font-varela font-bold tabular-nums">{overallProgress}%</p>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Tiến độ tổng thể
                </p>
              </div>
            </div>
            <Progress value={overallProgress} className="mt-3 h-2" />
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/40">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-varela font-bold tabular-nums">{streakDays}</p>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Ngày học liên tiếp
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Học mỗi ngày để giữ streak!
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/40">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-varela font-bold tabular-nums">
                  {CF_LEARNING_PATH.filter(
                    (s) => getLabProgress(s.id).masteryLevel === "mastered"
                  ).length}
                  /{CF_LEARNING_PATH.length}
                </p>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Phần đã nắm vững
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Next Step - Recommended */}
      {nextStep && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card
            className="shadow-md border-finstep-orange/30 bg-gradient-to-br from-finstep-orange/5 to-transparent cursor-pointer hover:shadow-lg transition-all"
            onClick={() => router.push(nextStep.href)}
          >
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${nextStep.color} flex items-center justify-center`}
                  >
                    <nextStep.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-finstep-orange uppercase tracking-wider mb-0.5">
                      Bước tiếp theo
                    </p>
                    <h3 className="font-varela font-bold text-lg text-finstep-brown dark:text-foreground">
                      {nextStep.label}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {nextStep.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      ~{nextStep.estimatedMinutes} phút
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-8 h-8 text-finstep-orange shrink-0" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Learning Path Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-varela font-bold text-finstep-brown dark:text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-finstep-orange" />
          Lộ trình học (theo thứ tự)
        </h2>
        <div className="space-y-3">
          {CF_LEARNING_PATH.map((step, i) => {
            const progress = getLabProgress(step.id);
            const isMastered = progress.masteryLevel === "mastered";
            const isNext = step.id === nextStepId;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <Card
                  className={cn(
                    "shadow-sm border-border/40 cursor-pointer transition-all hover:shadow-md",
                    isNext && "ring-2 ring-finstep-orange/40",
                    isMastered && "opacity-90"
                  )}
                  onClick={() => router.push(step.href)}
                >
                  <CardContent className="pt-4 pb-4 flex items-center gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                        isMastered ? "bg-emerald-500/10" : `bg-gradient-to-br ${step.color}`
                      )}
                    >
                      {isMastered ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <step.icon className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-muted-foreground">
                          Bước {step.order}
                        </span>
                        <MasteryBadge level={progress.masteryLevel} />
                        {progress.practiceCompleted && (
                          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600">
                            Đã luyện
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-varela font-bold text-finstep-brown dark:text-foreground">
                        {step.label}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {step.description} • ~{step.estimatedMinutes} phút
                      </p>
                      {progress.practiceBestScore > 0 && (
                        <p className="text-xs text-emerald-600 font-semibold mt-1">
                          Điểm cao nhất: {progress.practiceBestScore}%
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-4"
      >
        <p className="text-sm text-muted-foreground">
          💡 Học theo thứ tự từ Bước 1 để nền tảng vững. Mỗi phần có Learning → Practice. Đạt 80%+ practice để đánh dấu &quot;Đã nắm vững&quot;.
        </p>
      </motion.div>
    </div>
  );
}
