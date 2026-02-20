"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  FlaskConical,
  Play,
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle2,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Bot,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fmt = (n: number) =>
  n < 0 ? `(${Math.abs(n).toLocaleString()})` : n.toLocaleString();

const IS_FIELDS = [
  "revenue", "cogs", "grossProfit", "sga", "depreciation", "amortization",
  "ebit", "interestExpense", "ebt", "taxes", "netIncome",
];
const BS_FIELDS = [
  "cash", "accountsReceivable", "inventory", "prepaidExpenses", "totalCurrentAssets",
  "ppe", "accumulatedDepreciation", "netPPE", "goodwill", "intangibles", "totalAssets",
  "accountsPayable", "accruedExpenses", "currentDebt", "totalCurrentLiabilities",
  "longTermDebt", "totalLiabilities", "commonStock", "retainedEarnings", "totalEquity",
  "totalLiabilitiesAndEquity",
];
const CFS_FIELDS = [
  "netIncome", "depreciation", "amortization", "changesInWorkingCapital",
  "changeInAR", "changeInInventory", "changeInAP", "changeInAccruedExpenses",
  "changeInPrepaidExpenses", "cashFromOperations", "capitalExpenditures",
  "cashFromInvesting", "debtIssuance", "debtRepayment", "equityIssuance",
  "dividendsPaid", "cashFromFinancing", "netChangeInCash", "beginningCash", "endingCash",
];

const LABELS: Record<string, string> = {
  revenue: "Revenue", cogs: "COGS", grossProfit: "Gross Profit", sga: "SG&A",
  depreciation: "Depreciation", amortization: "Amortization", ebit: "EBIT",
  interestExpense: "Interest Exp.", ebt: "EBT", taxes: "Taxes", netIncome: "Net Income",
  cash: "Cash", accountsReceivable: "Accts Recv.", inventory: "Inventory",
  prepaidExpenses: "Prepaid Exp.", totalCurrentAssets: "Current Assets",
  ppe: "PP&E (Gross)", accumulatedDepreciation: "Accum. Depr.", netPPE: "Net PP&E",
  goodwill: "Goodwill", intangibles: "Intangibles", totalAssets: "Total Assets",
  accountsPayable: "Accts Pay.", accruedExpenses: "Accrued Exp.", currentDebt: "Current Debt",
  totalCurrentLiabilities: "Current Liab.", longTermDebt: "LT Debt",
  totalLiabilities: "Total Liab.", commonStock: "Common Stock",
  retainedEarnings: "Retained Earn.", totalEquity: "Total Equity",
  totalLiabilitiesAndEquity: "Total L+E",
  changesInWorkingCapital: "WC Changes", changeInAR: "Δ AR", changeInInventory: "Δ Inventory",
  changeInAP: "Δ AP", changeInAccruedExpenses: "Δ Accrued", changeInPrepaidExpenses: "Δ Prepaid",
  cashFromOperations: "CFO", capitalExpenditures: "CapEx", cashFromInvesting: "CFI",
  debtIssuance: "Debt Issue", debtRepayment: "Debt Repay", equityIssuance: "Equity Issue",
  dividendsPaid: "Dividends", cashFromFinancing: "CFF", netChangeInCash: "Net Δ Cash",
  beginningCash: "Begin Cash", endingCash: "End Cash",
};

const CATEGORY_COLORS: Record<string, string> = {
  Operating: "bg-blue-500",
  Investing: "bg-amber-500",
  Financing: "bg-emerald-500",
};

function buildFullDeltas(
  before: FinancialModel,
  after: FinancialModel,
  fields: string[],
  statementKey: "incomeStatement" | "balanceSheet" | "cashFlowStatement"
): StatementDelta[] {
  const bObj = before[statementKey] as unknown as Record<string, number>;
  const aObj = after[statementKey] as unknown as Record<string, number>;
  return fields.map((f) => ({
    field: f,
    label: LABELS[f] || f,
    before: bObj[f] ?? 0,
    after: aObj[f] ?? 0,
    delta: Math.round(((aObj[f] ?? 0) - (bObj[f] ?? 0)) * 100) / 100,
  }));
}

interface StepChange {
  statement: "Income Statement" | "Balance Sheet" | "Cash Flow";
  field: string;
  label: string;
  before: number;
  after: number;
  delta: number;
}

function buildStepChanges(result: EventResult): StepChange[] {
  const steps: StepChange[] = [];
  const addDeltas = (deltas: StatementDelta[], statement: StepChange["statement"]) => {
    deltas.forEach((d) => {
      if (d.delta !== 0) {
        steps.push({ statement, ...d });
      }
    });
  };

  const isDelta = buildFullDeltas(result.before, result.after, IS_FIELDS, "incomeStatement");
  const bsDelta = buildFullDeltas(result.before, result.after, BS_FIELDS, "balanceSheet");
  const cfsDelta = buildFullDeltas(result.before, result.after, CFS_FIELDS, "cashFlowStatement");

  addDeltas(isDelta, "Income Statement");
  addDeltas(bsDelta, "Balance Sheet");
  addDeltas(cfsDelta, "Cash Flow");

  return steps;
}

function StatementRow({
  label,
  value,
  delta,
  isHighlighted,
  isBold,
}: {
  label: string;
  value: number;
  delta: number;
  isHighlighted: boolean;
  isBold?: boolean;
}) {
  return (
    <motion.div
      layout
      className={cn(
        "flex items-center justify-between px-3 py-1.5 rounded-md transition-all text-[12px]",
        isHighlighted && delta > 0 && "bg-emerald-50 dark:bg-emerald-950/30",
        isHighlighted && delta < 0 && "bg-red-50 dark:bg-red-950/30",
        !isHighlighted && "hover:bg-muted/30"
      )}
    >
      <span className={cn("truncate", isBold ? "font-bold" : "text-muted-foreground", isHighlighted && "text-foreground font-medium")}>
        {label}
      </span>
      <div className="flex items-center gap-2 shrink-0">
        <span className={cn("tabular-nums", isHighlighted ? "font-semibold" : "text-muted-foreground")}>
          {fmt(value)}
        </span>
        <AnimatePresence>
          {isHighlighted && delta !== 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5, x: -8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "inline-flex items-center gap-0.5 text-[10px] font-bold tabular-nums min-w-[50px] justify-end",
                delta > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
              )}
            >
              {delta > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {fmt(Math.abs(delta))}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function StatementCard({
  title,
  color,
  model,
  fields,
  statementKey,
  highlightedFields,
}: {
  title: string;
  color: string;
  model: FinancialModel;
  fields: string[];
  statementKey: "incomeStatement" | "balanceSheet" | "cashFlowStatement";
  highlightedFields: Map<string, number>;
}) {
  const obj = model[statementKey] as unknown as Record<string, number>;
  const boldFields = ["grossProfit", "ebit", "ebt", "netIncome", "totalCurrentAssets", "totalAssets", "totalCurrentLiabilities", "totalLiabilities", "totalEquity", "totalLiabilitiesAndEquity", "cashFromOperations", "cashFromInvesting", "cashFromFinancing", "netChangeInCash", "endingCash"];

  return (
    <Card className="shadow-sm border-border/40">
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-center gap-2">
          <div className={cn("w-2.5 h-2.5 rounded-full", color)} />
          <CardTitle className="text-sm font-bold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-1 pb-2 space-y-0">
        {fields.map((f) => {
          const delta = highlightedFields.get(f) ?? 0;
          const isHighlighted = highlightedFields.has(f);
          return (
            <StatementRow
              key={f}
              label={LABELS[f] || f}
              value={obj[f] ?? 0}
              delta={delta}
              isHighlighted={isHighlighted}
              isBold={boldFields.includes(f)}
            />
          );
        })}
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
  const [interviewMode, setInterviewMode] = useState(false);
  const [userGuess, setUserGuess] = useState("");
  const [guessRevealed, setGuessRevealed] = useState(false);
  const [eventHistory, setEventHistory] = useState<{ event: string; amount: number }[]>([]);

  const [stepChanges, setStepChanges] = useState<StepChange[]>([]);
  const [revealedStepCount, setRevealedStepCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const eventDef = useMemo(
    () => EVENT_DEFINITIONS.find((e) => e.type === selectedEvent),
    [selectedEvent]
  );

  const highlightedIS = useMemo(() => {
    const map = new Map<string, number>();
    stepChanges.slice(0, revealedStepCount).forEach((s) => {
      if (s.statement === "Income Statement") map.set(s.field, s.delta);
    });
    return map;
  }, [stepChanges, revealedStepCount]);

  const highlightedBS = useMemo(() => {
    const map = new Map<string, number>();
    stepChanges.slice(0, revealedStepCount).forEach((s) => {
      if (s.statement === "Balance Sheet") map.set(s.field, s.delta);
    });
    return map;
  }, [stepChanges, revealedStepCount]);

  const highlightedCFS = useMemo(() => {
    const map = new Map<string, number>();
    stepChanges.slice(0, revealedStepCount).forEach((s) => {
      if (s.statement === "Cash Flow") map.set(s.field, s.delta);
    });
    return map;
  }, [stepChanges, revealedStepCount]);

  const revealedExplanationIndex = useMemo(() => {
    if (!result) return -1;
    const totalSteps = stepChanges.length;
    if (totalSteps === 0) return -1;
    const ratio = revealedStepCount / totalSteps;
    return Math.min(Math.floor(ratio * result.explanation.length), result.explanation.length - 1);
  }, [result, stepChanges.length, revealedStepCount]);

  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  const animateSteps = useCallback((steps: StepChange[]) => {
    setRevealedStepCount(0);
    setIsAnimating(true);
    let count = 0;

    const revealNext = () => {
      count++;
      setRevealedStepCount(count);
      if (count < steps.length) {
        animationRef.current = setTimeout(revealNext, 400);
      } else {
        setIsAnimating(false);
      }
    };

    animationRef.current = setTimeout(revealNext, 300);
  }, []);

  const handleApplyEvent = useCallback(() => {
    if (animationRef.current) clearTimeout(animationRef.current);

    const assumptions = { amount, taxRate: taxRate / 100, usefulLife };
    const res = processEvent(model, selectedEvent, assumptions);
    setResult(res);
    setModel(res.after);
    setGuessRevealed(false);
    setUserGuess("");
    setEventHistory((prev) => [
      ...prev,
      { event: eventDef?.label || selectedEvent, amount },
    ]);

    const steps = buildStepChanges(res);
    setStepChanges(steps);
    animateSteps(steps);
  }, [model, selectedEvent, amount, taxRate, usefulLife, eventDef, animateSteps]);

  const handleRevealAll = useCallback(() => {
    if (animationRef.current) clearTimeout(animationRef.current);
    setRevealedStepCount(stepChanges.length);
    setIsAnimating(false);
  }, [stepChanges.length]);

  const handleReset = useCallback(() => {
    if (animationRef.current) clearTimeout(animationRef.current);
    setModel(createBaseModel());
    setResult(null);
    setEventHistory([]);
    setStepChanges([]);
    setRevealedStepCount(0);
    setIsAnimating(false);
    setGuessRevealed(false);
    setUserGuess("");
  }, []);

  const showExplanation = !interviewMode || guessRevealed;
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);

  return (
    <div className="max-w-[1400px] mx-auto space-y-5">
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
            Apply events step-by-step and watch changes flow across all 3 statements
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAnimating && (
            <Button variant="outline" size="sm" onClick={handleRevealAll} className="text-xs">
              Show All
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-3 space-y-4">
          <Card className="shadow-sm border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Play className="w-4 h-4 text-primary" />
                Choose Event
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <div className="relative">
                  <button
                    onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
                    className="w-full text-left flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background px-3 py-2.5 text-sm shadow-sm hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={cn("w-2 h-2 rounded-full shrink-0", CATEGORY_COLORS[eventDef?.category || "Operating"])} />
                      <span className="truncate font-medium">{eventDef?.label}</span>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-muted-foreground shrink-0 transition-transform", eventDropdownOpen && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {eventDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute z-50 top-full left-0 right-0 mt-1 rounded-lg border border-border/60 bg-background shadow-lg overflow-hidden"
                      >
                        <div className="max-h-[300px] overflow-y-auto p-1">
                          {EVENT_DEFINITIONS.map((evt) => (
                            <button
                              key={evt.type}
                              onClick={() => {
                                setSelectedEvent(evt.type);
                                setEventDropdownOpen(false);
                              }}
                              className={cn(
                                "w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-xs hover:bg-muted/50 transition-colors",
                                selectedEvent === evt.type && "bg-primary/10 text-primary font-medium"
                              )}
                            >
                              <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", CATEGORY_COLORS[evt.category])} />
                              <span className="truncate">{evt.label}</span>
                              <Badge variant="outline" className="text-[8px] px-1 py-0 ml-auto shrink-0">
                                {evt.category}
                              </Badge>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {eventDef && (
                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-2 px-1">
                    {eventDef.description}
                  </p>
                )}
              </div>

              <Separator />

              <div className="space-y-2.5">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Amount ($)</Label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Tax Rate (%)</Label>
                  <Input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="h-9 text-sm"
                    min={0}
                    max={100}
                  />
                </div>
                {(selectedEvent === "depreciation" ||
                  selectedEvent === "buy_ppe_cash" ||
                  selectedEvent === "buy_ppe_debt") && (
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Useful Life (yrs)</Label>
                    <Input
                      type="number"
                      value={usefulLife}
                      onChange={(e) => setUsefulLife(Number(e.target.value))}
                      className="h-9 text-sm"
                      min={1}
                    />
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium flex items-center gap-1.5">
                  {interviewMode ? <EyeOff className="w-3.5 h-3.5 text-amber-500" /> : <Eye className="w-3.5 h-3.5 text-primary" />}
                  Interview Mode
                </span>
                <Switch
                  checked={interviewMode}
                  onCheckedChange={(v) => { setInterviewMode(v); setGuessRevealed(false); }}
                  className="scale-90"
                />
              </div>

              <Button
                onClick={handleApplyEvent}
                disabled={isAnimating}
                className="w-full gradient-primary text-white shadow-lg shadow-primary/20 h-10 text-sm font-semibold"
              >
                <Play className="w-4 h-4 mr-2" />
                Apply Event
              </Button>
            </CardContent>
          </Card>

          {eventHistory.length > 0 && (
            <Card className="shadow-sm border-border/40">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Event History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 pb-3">
                {eventHistory.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0 shrink-0 font-bold">{i + 1}</Badge>
                    <span className="truncate">{h.event}</span>
                    <span className="ml-auto tabular-nums font-semibold text-foreground">${h.amount}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {interviewMode && result && !guessRevealed && (
            <Card className="shadow-sm border-amber-400/40">
              <CardContent className="pt-4 space-y-3">
                <p className="text-xs font-medium">
                  What changes when you <strong>{eventDef?.label.toLowerCase()}</strong> for ${amount}?
                </p>
                <textarea
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  placeholder="Describe the IS, BS, and CFS changes..."
                  className="w-full text-xs p-3 rounded-lg border border-border/40 bg-muted/20 min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <Button size="sm" onClick={() => setGuessRevealed(true)} className="w-full h-8 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  Reveal Answer
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="xl:col-span-9 space-y-4">
          {!result ? (
            <Card className="shadow-sm border-border/40 h-full flex items-center justify-center min-h-[400px]">
              <CardContent className="py-16 text-center">
                <FlaskConical className="w-16 h-16 mx-auto text-muted-foreground/20 mb-4" />
                <h3 className="text-lg font-bold mb-2">Ready to Simulate</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Choose an event from the panel and click &quot;Apply Event&quot;.
                  Each change will appear step-by-step across all 3 statements.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {!result.isBalanced && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
                  <AlertTriangle className="w-4 h-4" />
                  Balance Sheet does not balance!
                </div>
              )}

              {isAnimating && (
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${(revealedStepCount / stepChanges.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                    {revealedStepCount}/{stepChanges.length} changes
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <StatementCard
                  title="Income Statement"
                  color="bg-blue-500"
                  model={model}
                  fields={IS_FIELDS}
                  statementKey="incomeStatement"
                  highlightedFields={highlightedIS}
                />
                <StatementCard
                  title="Balance Sheet"
                  color="bg-amber-500"
                  model={model}
                  fields={BS_FIELDS}
                  statementKey="balanceSheet"
                  highlightedFields={highlightedBS}
                />
                <StatementCard
                  title="Cash Flow Statement"
                  color="bg-emerald-500"
                  model={model}
                  fields={CFS_FIELDS}
                  statementKey="cashFlowStatement"
                  highlightedFields={highlightedCFS}
                />
              </div>

              {revealedStepCount > 0 && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                  >
                    <Card className="shadow-sm border-border/40">
                      <CardContent className="pt-4 pb-4 space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <h3 className="font-bold text-sm">Step-by-Step Changes</h3>
                        </div>
                        <div className="space-y-1.5">
                          {stepChanges.slice(0, revealedStepCount).map((step, i) => (
                            <motion.div
                              key={`${step.field}-${i}`}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center gap-2 text-xs"
                            >
                              <Badge variant="secondary" className="text-[8px] px-1.5 py-0 font-bold shrink-0">{i + 1}</Badge>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[8px] px-1 py-0 shrink-0",
                                  step.statement === "Income Statement" && "border-blue-300 text-blue-600",
                                  step.statement === "Balance Sheet" && "border-amber-300 text-amber-600",
                                  step.statement === "Cash Flow" && "border-emerald-300 text-emerald-600"
                                )}
                              >
                                {step.statement === "Income Statement" ? "IS" : step.statement === "Balance Sheet" ? "BS" : "CFS"}
                              </Badge>
                              <span className="font-medium truncate">{step.label}</span>
                              <span className={cn(
                                "ml-auto flex items-center gap-0.5 font-bold tabular-nums shrink-0",
                                step.delta > 0 ? "text-emerald-600" : "text-red-500"
                              )}>
                                {step.delta > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                {fmt(Math.abs(step.delta))}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {showExplanation && result && (
                      <Card className="shadow-sm border-l-4 border-l-primary border-border/40">
                        <CardContent className="pt-4 pb-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4 text-primary" />
                            <h3 className="font-bold text-sm">Explanation</h3>
                          </div>
                          <ol className="space-y-2">
                            {result.explanation.map((step, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: i <= revealedExplanationIndex ? 1 : 0.2 }}
                                className="flex gap-2 text-xs leading-relaxed"
                              >
                                <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                                <span className="text-muted-foreground">{step}</span>
                              </motion.li>
                            ))}
                          </ol>

                          {revealedStepCount === stepChanges.length && result.mentalModel.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-3"
                            >
                              <Separator className="mb-3 opacity-50" />
                              <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                                <p className="text-[11px] font-bold">Mental Model</p>
                              </div>
                              <div className="space-y-1 p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/30 dark:border-amber-800/30">
                                {result.mentalModel.map((line, i) => (
                                  <p key={i} className="text-[11px] text-muted-foreground leading-relaxed">{line}</p>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
