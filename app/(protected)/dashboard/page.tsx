"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQuizStore } from "@/store/useQuizStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Zap,
  Trophy,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Difficulty } from "@/types/question";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { DOMAINS } from "@/lib/navigation/domains";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

function getRankColor(accuracy: number) {
  if (accuracy >= 85) return "text-emerald-600";
  if (accuracy >= 75) return "text-amber-600";
  if (accuracy >= 60) return "text-orange-600";
  return "text-red-600";
}

function getRankLabel(accuracy: number) {
  if (accuracy >= 85) return "EB/BB Ready";
  if (accuracy >= 75) return "MM Ready";
  if (accuracy >= 60) return "Boutique Ready";
  return "Not Ready";
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    difficulty,
    setDifficulty,
    eliteMode,
    dbAnalytics,
    fetchDBAnalytics,
  } = useQuizStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchDBAnalytics();
  }, [fetchDBAnalytics]);

  const accuracy = mounted ? dbAnalytics.overall.overallAccuracy : 0;
  const totalDone = mounted ? dbAnalytics.overall.totalQuestionsDone : 0;
  const weakest = useMemo(() => {
    if (!mounted || dbAnalytics.sections.length === 0) return "N/A";
    const sorted = [...dbAnalytics.sections].sort((a, b) => a.accuracy - b.accuracy);
    return sorted[0]?.section || "N/A";
  }, [mounted, dbAnalytics]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto space-y-8 font-nunito text-finstep-brown w-full min-w-0"
    >
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-varela font-bold tracking-tight text-finstep-orange">
              Welcome back{session?.user?.name ? `, ${session.user.name?.split(" ")[0] ?? ""}` : ""}
            </h1>
            {session?.user?.image && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-finstep-beige border border-finstep-brown/10 shadow-sm">
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={20}
                  height={20}
                  className="rounded-full border border-finstep-orange/20"
                />
                <span className="text-[9px] font-nunito font-bold text-finstep-brown/40 uppercase tracking-tighter">
                  Google
                </span>
              </div>
            )}
          </div>
          <p className="text-finstep-lightbrown font-medium">
            Track your progress and start training
          </p>
        </div>
        <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
          <SelectTrigger className="w-44 shadow-sm">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
            <SelectItem value="Elite">Elite</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: "Questions Done", value: totalDone, color: "from-amber-500/10 to-amber-600/5", iconColor: "text-amber-600" },
          { icon: Target, label: "Accuracy", value: `${accuracy}%`, color: "from-finstep-orange/10 to-finstep-orange/5", iconColor: "text-finstep-orange" },
          { icon: AlertTriangle, label: "Weakest Section", value: weakest, color: "from-red-500/10 to-red-600/5", iconColor: "text-red-600" },
          { icon: Trophy, label: "Current Rank", value: getRankLabel(accuracy), color: "from-orange-500/10 to-orange-600/5", iconColor: getRankColor(accuracy) },
        ].map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <Card className="shadow-sm hover:shadow-md transition-shadow border-finstep-brown/10 bg-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-varela font-bold tabular-nums text-finstep-brown">
                      {stat.value}
                    </p>
                    <p className="text-xs text-finstep-brown/60 font-semibold uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div variants={item}>
        <h2 className="font-varela font-bold text-xl text-finstep-brown mb-4 flex items-center gap-2">
          Explore by Domain
          {eliteMode && (
            <Badge variant="outline" className="text-amber-600 border-amber-500/30 bg-amber-50">
              <Zap className="w-3 h-3 mr-1" />
              Elite
            </Badge>
          )}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {DOMAINS.map((domain) => (
            <motion.div
              key={domain.id}
              variants={item}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card
                className="shadow-sm border-border/40 hover:shadow-xl hover:border-finstep-orange/30 transition-all cursor-pointer group overflow-hidden h-full"
                onClick={() => router.push(domain.landingHref)}
              >
                <div className={`h-1.5 bg-gradient-to-r ${domain.color}`} />
                <CardContent className="pt-6 pb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${domain.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                    <domain.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-varela font-bold text-finstep-brown dark:text-foreground group-hover:text-finstep-orange transition-colors">
                    {domain.label}
                  </h3>
                  <p className="text-xs text-finstep-brown/60 dark:text-muted-foreground mt-1 line-clamp-2">
                    {domain.description}
                  </p>
                  <div className="flex items-center gap-1 mt-3 text-finstep-orange text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Card className="shadow-sm border-finstep-brown/10 bg-card/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <h3 className="font-varela font-bold text-lg text-finstep-brown mb-4">Recent Results</h3>
            {(dbAnalytics.recentResults?.length ?? 0) === 0 ? (
              <p className="text-sm text-finstep-brown/60">No quizzes completed yet.</p>
            ) : (
              <div className="space-y-2.5">
                {(dbAnalytics.recentResults ?? []).slice(0, 4).map((result: { id: string; section: string; difficulty: string; accuracy: number }) => (
                  <div key={result.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-finstep-brown/70 font-semibold text-xs truncate max-w-[120px]">
                        {result.section}
                      </span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 bg-finstep-beige text-finstep-lightbrown border-none hover:bg-finstep-beige">
                        {result.difficulty}
                      </Badge>
                    </div>
                    <span className={`font-varela font-bold tabular-nums ${getRankColor(result.accuracy)}`}>
                      {result.accuracy}%
                    </span>
                  </div>
                ))}
              </div>
            )}
            {(dbAnalytics.recentResults?.length ?? 0) > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={() => router.push("/quiz")}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Continue to Quiz
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
