"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useQuizStore } from "@/store/useQuizStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GripVertical,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  RotateCcw,
  Trophy,
  FileText,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DragQuestion } from "@/types/question";

const DROP_ZONES = [
  "Income Statement",
  "Balance Sheet",
  "Cash Flow Statement",
] as const;

type DropZoneType = (typeof DROP_ZONES)[number];

const zoneIcons: Record<string, typeof FileText> = {
  "Income Statement": FileText,
  "Balance Sheet": BarChart3,
  "Cash Flow Statement": DollarSign,
};

const zoneColors: Record<string, { border: string; bg: string; active: string; dot: string }> = {
  "Income Statement": {
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    active: "border-blue-500/60 bg-blue-500/10",
    dot: "bg-blue-500",
  },
  "Balance Sheet": {
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    active: "border-amber-500/60 bg-amber-500/10",
    dot: "bg-amber-500",
  },
  "Cash Flow Statement": {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    active: "border-emerald-500/60 bg-emerald-500/10",
    dot: "bg-emerald-500",
  },
};

interface PlacedItem {
  id: string;
  lineItem: string;
  correct: boolean;
  explanation: string;
  correctAnswer: string;
}

function DraggableItem({ question }: { question: DragQuestion }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: question.id,
    data: question,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border/50 bg-card cursor-grab active:cursor-grabbing transition-all text-sm shadow-sm hover:shadow-md",
        isDragging && "opacity-30 scale-95"
      )}
    >
      <GripVertical className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <span className="font-medium text-xs">{question.lineItem}</span>
    </div>
  );
}

function DropColumn({
  zone,
  placedItems,
  isActive,
  score,
}: {
  zone: string;
  placedItems: PlacedItem[];
  isActive: boolean;
  score: { correct: number; wrong: number };
}) {
  const { setNodeRef, isOver } = useDroppable({ id: zone });
  const Icon = zoneIcons[zone] || FileText;
  const colors = zoneColors[zone];

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-xl border-2 border-dashed p-3 min-h-[300px] transition-all flex flex-col",
        isOver ? colors.active : `${colors.border} ${colors.bg}`,
        isActive && !isOver && "border-dashed"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn("w-2.5 h-2.5 rounded-full", colors.dot)} />
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-bold">{zone}</span>
        </div>
        <div className="flex gap-1">
          {score.correct > 0 && (
            <Badge className="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0 dark:bg-emerald-900/30 dark:text-emerald-400">
              +{score.correct}
            </Badge>
          )}
          {score.wrong > 0 && (
            <Badge className="bg-red-100 text-red-700 text-[9px] px-1.5 py-0 dark:bg-red-900/30 dark:text-red-400">
              -{score.wrong}
            </Badge>
          )}
        </div>
      </div>
      <div className="space-y-1.5 flex-1">
        <AnimatePresence>
          {placedItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "px-3 py-2 rounded-lg text-xs border flex items-start gap-2",
                item.correct
                  ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800"
                  : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
              )}
            >
              {item.correct ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
              )}
              <div className="min-w-0">
                <p className="font-medium truncate">{item.lineItem}</p>
                {!item.correct && (
                  <p className="text-[10px] text-red-600 dark:text-red-400 mt-0.5">
                    Correct: {item.correctAnswer}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {placedItems.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[10px] text-muted-foreground">Drop items here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AccountingDragPage() {
  const router = useRouter();
  const {
    currentDragQuiz,
    dragQuizStarted,
    startDragQuiz,
    resetDragQuiz,
  } = useQuizStore();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [placedItems, setPlacedItems] = useState<Record<string, PlacedItem[]>>({
    "Income Statement": [],
    "Balance Sheet": [],
    "Cash Flow Statement": [],
  });
  const [remainingQuestions, setRemainingQuestions] = useState<DragQuestion[]>([]);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleStart = useCallback(() => {
    startDragQuiz();
    const store = useQuizStore.getState();
    setRemainingQuestions([...store.currentDragQuiz]);
    setPlacedItems({ "Income Statement": [], "Balance Sheet": [], "Cash Flow Statement": [] });
    setTotalCorrect(0);
    setTotalWrong(0);
    setIsComplete(false);
  }, [startDragQuiz]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over) return;

      const questionId = active.id as string;
      const zone = over.id as string;

      if (!DROP_ZONES.includes(zone as DropZoneType)) return;

      const question = remainingQuestions.find((q) => q.id === questionId);
      if (!question) return;

      const isCorrect = question.correctAnswer === zone;

      const newItem: PlacedItem = {
        id: question.id,
        lineItem: question.lineItem,
        correct: isCorrect,
        explanation: question.explanation,
        correctAnswer: question.correctAnswer,
      };

      setPlacedItems((prev) => ({
        ...prev,
        [zone]: [...prev[zone], newItem],
      }));

      if (isCorrect) {
        setTotalCorrect((c) => c + 1);
      } else {
        setTotalWrong((w) => w + 1);
      }

      const newRemaining = remainingQuestions.filter((q) => q.id !== questionId);
      setRemainingQuestions(newRemaining);

      if (newRemaining.length === 0) {
        setIsComplete(true);
      }
    },
    [remainingQuestions]
  );

  const activeItem = remainingQuestions.find((q) => q.id === activeId);
  const totalQuestions = currentDragQuiz.length || (totalCorrect + totalWrong + remainingQuestions.length);

  const zoneScores = (zone: string) => ({
    correct: placedItems[zone]?.filter((i) => i.correct).length || 0,
    wrong: placedItems[zone]?.filter((i) => !i.correct).length || 0,
  });

  if (!dragQuizStarted || currentDragQuiz.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-sm border-border/40">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
                <GripVertical className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold">Accounting Drag & Drop</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Drag each accounting line item into the correct financial statement:
                Income Statement, Balance Sheet, or Cash Flow Statement.
                Wrong answers cost you points!
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => router.push("/dashboard")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button onClick={handleStart} className="gradient-primary text-white shadow-lg shadow-primary/20">
                  Start Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (isComplete) {
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const netScore = totalCorrect - totalWrong;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="shadow-sm border-border/40">
            <CardHeader className="text-center">
              <Trophy className={cn("w-16 h-16 mx-auto mb-2", accuracy >= 75 ? "text-emerald-500" : "text-amber-500")} />
              <CardTitle className="text-2xl">Challenge Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{totalCorrect}</p>
                  <p className="text-xs text-muted-foreground">Correct</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-500">{totalWrong}</p>
                  <p className="text-xs text-muted-foreground">Wrong</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{netScore}</p>
                  <p className="text-xs text-muted-foreground">Net Score</p>
                </div>
                <div>
                  <p className={cn("text-2xl font-bold", accuracy >= 75 ? "text-emerald-600" : "text-amber-600")}>{accuracy}%</p>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => { resetDragQuiz(); router.push("/dashboard"); }}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button onClick={() => { resetDragQuiz(); handleStart(); }}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-3">
          <h3 className="font-semibold">Review</h3>
          {Object.entries(placedItems).map(([zone, items]) =>
            items.map((item) => (
              <Card
                key={item.id}
                className={cn(
                  "shadow-sm border-border/40",
                  item.correct ? "border-l-2 border-l-emerald-500" : "border-l-2 border-l-red-500"
                )}
              >
                <CardContent className="pt-3 pb-3 space-y-1">
                  <div className="flex items-start gap-2">
                    {item.correct ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{item.lineItem}</p>
                      {!item.correct && (
                        <p className="text-xs mt-0.5">
                          <span className="text-muted-foreground">Dropped in: </span>
                          <span className="text-red-500">{zone}</span>
                          <span className="text-muted-foreground"> → Correct: </span>
                          <span className="text-emerald-600">{item.correctAnswer}</span>
                        </p>
                      )}
                      <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Classify Line Items</h2>
          <p className="text-xs text-muted-foreground">
            Drag each item into the correct statement. Wrong = -1 point.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            +{totalCorrect}
          </Badge>
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            -{totalWrong}
          </Badge>
          <Badge variant="secondary">
            {remainingQuestions.length} left
          </Badge>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm border-border/40">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-xs">Line Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 max-h-[65vh] overflow-y-auto scrollbar-thin pb-3">
              <AnimatePresence>
                {remainingQuestions.map((q) => (
                  <motion.div key={q.id} layout exit={{ opacity: 0, x: -20, height: 0 }}>
                    <DraggableItem question={q} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {remainingQuestions.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-6">All placed!</p>
              )}
            </CardContent>
          </Card>

          {DROP_ZONES.map((zone) => (
            <DropColumn
              key={zone}
              zone={zone}
              placedItems={placedItems[zone]}
              isActive={activeId !== null}
              score={zoneScores(zone)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeItem && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-primary/50 bg-card shadow-xl text-xs">
              <GripVertical className="w-3.5 h-3.5 text-primary" />
              <span className="font-medium">{activeItem.lineItem}</span>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
