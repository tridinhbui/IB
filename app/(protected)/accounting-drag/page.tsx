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
import { Progress } from "@/components/ui/progress";
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
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DragQuestion } from "@/types/question";

const DROP_ZONES = [
  "Income Statement",
  "Cash Flow Statement",
  "Balance Sheet",
  "Multiple Statements",
] as const;

const zoneIcons: Record<string, typeof FileText> = {
  "Income Statement": FileText,
  "Cash Flow Statement": DollarSign,
  "Balance Sheet": BarChart3,
  "Multiple Statements": Layers,
};

const zoneColors: Record<string, string> = {
  "Income Statement": "border-blue-500/30 bg-blue-500/5",
  "Cash Flow Statement": "border-emerald-500/30 bg-emerald-500/5",
  "Balance Sheet": "border-amber-500/30 bg-amber-500/5",
  "Multiple Statements": "border-purple-500/30 bg-purple-500/5",
};

const zoneActiveColors: Record<string, string> = {
  "Income Statement": "border-blue-500/60 bg-blue-500/10",
  "Cash Flow Statement": "border-emerald-500/60 bg-emerald-500/10",
  "Balance Sheet": "border-amber-500/60 bg-amber-500/10",
  "Multiple Statements": "border-purple-500/60 bg-purple-500/10",
};

function DraggableItem({
  question,
  isPlaced,
}: {
  question: DragQuestion;
  isPlaced: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: question.id,
    data: question,
  });

  if (isPlaced) return null;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center gap-2 px-4 py-3 rounded-lg border border-border/50 bg-card cursor-grab active:cursor-grabbing transition-all",
        isDragging && "opacity-50 scale-95"
      )}
    >
      <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
      <span className="text-sm font-medium">{question.lineItem}</span>
    </div>
  );
}

function DropZone({
  zone,
  placedItems,
  isActive,
}: {
  zone: string;
  placedItems: { id: string; lineItem: string }[];
  isActive: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: zone });
  const Icon = zoneIcons[zone] || FileText;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-lg border-2 border-dashed p-4 min-h-[120px] transition-all",
        isOver ? zoneActiveColors[zone] : zoneColors[zone],
        isActive && !isOver && "animate-pulse"
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-semibold">{zone}</span>
        {placedItems.length > 0 && (
          <Badge variant="secondary" className="text-[10px] ml-auto">
            {placedItems.length}
          </Badge>
        )}
      </div>
      <div className="space-y-2">
        {placedItems.map((item) => (
          <div
            key={item.id}
            className="px-3 py-2 rounded-md bg-card/80 text-sm border border-border/30"
          >
            {item.lineItem}
          </div>
        ))}
        {placedItems.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            Drop items here
          </p>
        )}
      </div>
    </div>
  );
}

export default function AccountingDragPage() {
  const router = useRouter();
  const {
    currentDragQuiz,
    dragAnswers,
    dragQuizStarted,
    dragQuizCompleted,
    submitDragAnswer,
    startDragQuiz,
    completeDragQuiz,
    resetDragQuiz,
  } = useQuizStore();

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

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

      if (DROP_ZONES.includes(zone as typeof DROP_ZONES[number])) {
        submitDragAnswer(questionId, zone);
      }
    },
    [submitDragAnswer]
  );

  const activeItem = currentDragQuiz.find((q) => q.id === activeId);

  if (!dragQuizStarted || currentDragQuiz.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-border/50">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <GripVertical className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Accounting Drag & Drop</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Classify accounting line items into the correct financial
                statement. Drag each item to Income Statement, Cash Flow
                Statement, Balance Sheet, or Multiple Statements.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button onClick={() => startDragQuiz()}>
                  Start Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (dragQuizCompleted) {
    let correct = 0;
    currentDragQuiz.forEach((q) => {
      if (dragAnswers[q.id] === q.correctAnswer) correct++;
    });
    const accuracy = Math.round((correct / currentDragQuiz.length) * 100);

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-border/50">
            <CardHeader className="text-center">
              <Trophy
                className={cn(
                  "w-16 h-16 mx-auto mb-2",
                  accuracy >= 75 ? "text-emerald-400" : "text-amber-400"
                )}
              />
              <CardTitle className="text-2xl">
                Drag & Drop Complete!
              </CardTitle>
              <p className="text-lg font-bold">
                {correct}/{currentDragQuiz.length} Correct ({accuracy}%)
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 justify-center mb-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    resetDragQuiz();
                    router.push("/dashboard");
                  }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  onClick={() => {
                    resetDragQuiz();
                    startDragQuiz();
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h3 className="font-semibold">Review</h3>
          {currentDragQuiz.map((q) => {
            const userAnswer = dragAnswers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;

            return (
              <Card
                key={q.id}
                className={cn(
                  "border-border/50",
                  isCorrect
                    ? "border-l-2 border-l-emerald-500"
                    : "border-l-2 border-l-red-500"
                )}
              >
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{q.lineItem}</p>
                      <div className="mt-1 text-xs space-y-0.5">
                        <p>
                          <span className="text-muted-foreground">
                            Your answer:{" "}
                          </span>
                          <span
                            className={
                              isCorrect
                                ? "text-emerald-400"
                                : "text-red-400"
                            }
                          >
                            {userAnswer || "Not answered"}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p>
                            <span className="text-muted-foreground">
                              Correct:{" "}
                            </span>
                            <span className="text-emerald-400">
                              {q.correctAnswer}
                            </span>
                          </p>
                        )}
                      </div>
                      <div className="mt-2 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                        {q.explanation}
                      </div>
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

  const placedIds = new Set(Object.keys(dragAnswers));
  const unplacedCount = currentDragQuiz.filter(
    (q) => !placedIds.has(q.id)
  ).length;
  const progressPercent =
    ((currentDragQuiz.length - unplacedCount) / currentDragQuiz.length) * 100;

  const placedByZone: Record<string, { id: string; lineItem: string }[]> = {};
  DROP_ZONES.forEach((z) => {
    placedByZone[z] = [];
  });
  Object.entries(dragAnswers).forEach(([qId, zone]) => {
    const q = currentDragQuiz.find((q) => q.id === qId);
    if (q && placedByZone[zone]) {
      placedByZone[zone].push({ id: q.id, lineItem: q.lineItem });
    }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Classify Line Items</h2>
          <p className="text-xs text-muted-foreground">
            Drag each item to the correct financial statement
          </p>
        </div>
        <Badge variant="secondary">
          {currentDragQuiz.length - unplacedCount}/{currentDragQuiz.length}{" "}
          placed
        </Badge>
      </div>

      <Progress value={progressPercent} className="h-1" />

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Line Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[60vh] overflow-y-auto scrollbar-thin">
                <AnimatePresence>
                  {currentDragQuiz.map((q) => {
                    const isPlaced = placedIds.has(q.id);
                    return (
                      <motion.div
                        key={q.id}
                        layout
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <DraggableItem question={q} isPlaced={isPlaced} />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {unplacedCount === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    All items placed!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DROP_ZONES.map((zone) => (
              <DropZone
                key={zone}
                zone={zone}
                placedItems={placedByZone[zone]}
                isActive={activeId !== null}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeItem && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-primary/50 bg-card shadow-lg">
              <GripVertical className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                {activeItem.lineItem}
              </span>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <div className="flex justify-end pt-2">
        <Button
          onClick={() => completeDragQuiz()}
          disabled={unplacedCount > 0}
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Submit All ({currentDragQuiz.length - unplacedCount}/
          {currentDragQuiz.length})
        </Button>
      </div>
    </div>
  );
}
