"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createBaseModel,
  processEvent,
  EVENT_DEFINITIONS,
} from "@/lib/simulation/engine";
import type {
  FinancialModel,
  EventType,
  EventResult,
  StatementDelta,
} from "@/lib/simulation/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  FlaskConical,
  Play,
  RotateCcw,
  Eye,
  EyeOff,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Minus,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fmt = (n: number) =>
  n < 0
    ? `(${Math.abs(n).toLocaleString()})`
    : n.toLocaleString();

function DeltaIcon({ delta }: { delta: number }) {
  if (delta > 0) return <ArrowUp className="w-3 h-3 text-emerald-600" />;
  if (delta < 0) return <ArrowDown className="w-3 h-3 text-red-500" />;
  return <Minus className="w-3 h-3 text-muted-foreground" />;
}

function StatementTable({
  title,
  deltas,
  showDeltas,
}: {
  title: string;
  deltas: StatementDelta[];
  showDeltas: boolean;
}) {
  return (
    <Card className="shadow-sm border-border/40">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left py-2 px-4 text-muted-foreground font-medium">
                  Line Item
                </th>
                <th className="text-right py-2 px-4 text-muted-foreground font-medium">
                  Before
                </th>
                <th className="text-right py-2 px-4 text-muted-foreground font-medium">
                  After
                </th>
                {showDeltas && (
                  <th className="text-right py-2 px-4 text-muted-foreground font-medium">
                    Change
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {deltas.map((d) => {
                const changed = d.delta !== 0;
                return (
                  <tr
                    key={d.field}
                    className={cn(
                      "border-b border-border/20 transition-colors",
                      changed && "bg-primary/[0.03]"
                    )}
                  >
                    <td
                      className={cn(
                        "py-1.5 px-4 font-medium",
                        changed ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {d.label}
                    </td>
                    <td className="py-1.5 px-4 text-right tabular-nums text-muted-foreground">
                      {fmt(d.before)}
                    </td>
                    <td
                      className={cn(
                        "py-1.5 px-4 text-right tabular-nums font-medium",
                        changed
                          ? d.delta > 0
                            ? "text-emerald-600"
                            : "text-red-500"
                          : "text-muted-foreground"
                      )}
                    >
                      {fmt(d.after)}
                    </td>
                    {showDeltas && (
                      <td className="py-1.5 px-4 text-right">
                        {changed ? (
                          <span className="inline-flex items-center gap-1">
                            <DeltaIcon delta={d.delta} />
                            <span
                              className={cn(
                                "tabular-nums font-medium",
                                d.delta > 0
                                  ? "text-emerald-600"
                                  : "text-red-500"
                              )}
                            >
                              {fmt(Math.abs(d.delta))}
                            </span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SimulationPage() {
  const [model, setModel] = useState<FinancialModel>(createBaseModel);
  const [selectedEvent, setSelectedEvent] = useState<EventType>("buy_ppe_cash");
  const [amount, setAmount] = useState(100);
  const [taxRate, setTaxRate] = useState(25);
  const [usefulLife, setUsefulLife] = useState(10);
  const [result, setResult] = useState<EventResult | null>(null);
  const [showExplanation, setShowExplanation] = useState(true);
  const [interviewMode, setInterviewMode] = useState(false);
  const [userGuess, setUserGuess] = useState("");
  const [guessRevealed, setGuessRevealed] = useState(false);
  const [multiStepMode, setMultiStepMode] = useState(false);
  const [eventHistory, setEventHistory] = useState<
    { event: string; amount: number }[]
  >([]);

  const eventDef = useMemo(
    () => EVENT_DEFINITIONS.find((e) => e.type === selectedEvent),
    [selectedEvent]
  );

  const handleApplyEvent = useCallback(() => {
    const assumptions = { amount, taxRate, usefulLife };
    const res = processEvent(model, selectedEvent, assumptions);
    setResult(res);
    setModel(res.after);
    setGuessRevealed(false);
    setUserGuess("");
    setEventHistory((prev) => [
      ...prev,
      { event: eventDef?.label || selectedEvent, amount },
    ]);
  }, [model, selectedEvent, amount, taxRate, usefulLife, eventDef]);

  const handleReset = useCallback(() => {
    setModel(createBaseModel());
    setResult(null);
    setEventHistory([]);
    setGuessRevealed(false);
    setUserGuess("");
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-primary" />
            3-Statement Simulation
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Select a financial event and see how all 3 statements change
            instantly
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 space-y-4"
        >
          <Card className="shadow-sm border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Event Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Select Event</Label>
                <Select
                  value={selectedEvent}
                  onValueChange={(v) => setSelectedEvent(v as EventType)}
                >
                  <SelectTrigger className="shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_DEFINITIONS.map((evt) => (
                      <SelectItem key={evt.type} value={evt.type}>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-[9px] px-1 py-0"
                          >
                            {evt.category}
                          </Badge>
                          {evt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {eventDef && (
                  <p className="text-xs text-muted-foreground">
                    {eventDef.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Amount ($)</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Tax Rate (%)</Label>
                <Input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="shadow-sm"
                  min={0}
                  max={100}
                />
              </div>

              {(selectedEvent === "depreciation" ||
                selectedEvent === "buy_ppe_cash" ||
                selectedEvent === "buy_ppe_debt") && (
                <div className="space-y-2">
                  <Label className="text-xs">Useful Life (years)</Label>
                  <Input
                    type="number"
                    value={usefulLife}
                    onChange={(e) => setUsefulLife(Number(e.target.value))}
                    className="shadow-sm"
                    min={1}
                  />
                </div>
              )}

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {interviewMode ? (
                      <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 text-primary" />
                    )}
                    <Label className="text-xs font-medium">
                      Interview Mode
                    </Label>
                  </div>
                  <Switch
                    checked={interviewMode}
                    onCheckedChange={(v) => {
                      setInterviewMode(v);
                      setGuessRevealed(false);
                    }}
                    className="scale-90"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
                    <Label className="text-xs font-medium">
                      Multi-Step Mode
                    </Label>
                  </div>
                  <Switch
                    checked={multiStepMode}
                    onCheckedChange={setMultiStepMode}
                    className="scale-90"
                  />
                </div>
              </div>

              <Button
                onClick={handleApplyEvent}
                className="w-full gradient-primary text-white shadow-lg shadow-primary/20"
              >
                <Play className="w-4 h-4 mr-2" />
                Apply Event
              </Button>
            </CardContent>
          </Card>

          {multiStepMode && eventHistory.length > 0 && (
            <Card className="shadow-sm border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs">Event History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {eventHistory.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <Badge variant="secondary" className="text-[9px] px-1 shrink-0">
                      {i + 1}
                    </Badge>
                    <span className="truncate">{h.event}</span>
                    <span className="ml-auto tabular-nums font-medium">
                      ${h.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {interviewMode && result && (
            <Card className="shadow-sm border-border/40 border-amber-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Interview Challenge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  What changes on the 3 financial statements when you{" "}
                  <strong>{eventDef?.label.toLowerCase()}</strong> for $
                  {amount.toLocaleString()}?
                </p>
                <textarea
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  placeholder="Type your answer..."
                  className="w-full text-xs p-3 rounded-lg border border-border/40 bg-muted/30 min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => setGuessRevealed(true)}
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Reveal Solution
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 space-y-4"
        >
          {!result ? (
            <Card className="shadow-sm border-border/40">
              <CardContent className="py-16 text-center">
                <FlaskConical className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg mb-2">
                  Ready to Simulate
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Select a financial event from the left panel and click
                  &quot;Apply Event&quot; to see how all three financial
                  statements change.
                </p>
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={result.after.balanceSheet.cash}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {!result.isBalanced && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Balance Sheet does not balance! Check your inputs.
                  </div>
                )}

                <StatementTable
                  title="Income Statement"
                  deltas={result.incomeStatementDeltas}
                  showDeltas={!interviewMode || guessRevealed}
                />

                <StatementTable
                  title="Balance Sheet"
                  deltas={result.balanceSheetDeltas}
                  showDeltas={!interviewMode || guessRevealed}
                />

                <StatementTable
                  title="Cash Flow Statement"
                  deltas={result.cashFlowDeltas}
                  showDeltas={!interviewMode || guessRevealed}
                />

                {(showExplanation && (!interviewMode || guessRevealed)) && (
                  <Card className="shadow-sm border-border/40 border-l-4 border-l-primary">
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold text-sm">
                          Step-by-Step Explanation
                        </h3>
                      </div>
                      <ol className="space-y-1.5 text-xs text-muted-foreground">
                        {result.explanation.map((step, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-primary font-semibold shrink-0">
                              {i + 1}.
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                      {result.mentalModel.length > 0 && (
                        <>
                          <Separator className="opacity-50" />
                          <div>
                            <p className="text-xs font-semibold mb-1.5">
                              Mental Model
                            </p>
                            {result.mentalModel.map((line, i) => (
                              <p
                                key={i}
                                className="text-xs text-muted-foreground"
                              >
                                {line}
                              </p>
                            ))}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}

                {!interviewMode && (
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowExplanation(!showExplanation)}
                    >
                      {showExplanation ? (
                        <>
                          <EyeOff className="w-3 h-3 mr-1" />
                          Hide Explanation
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3 mr-1" />
                          Show Explanation
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
}
