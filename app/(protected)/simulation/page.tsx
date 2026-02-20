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
  CheckCircle2,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Minus,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fmt = (n: number) =>
  n < 0 ? `(${Math.abs(n).toLocaleString()})` : n.toLocaleString();

function DeltaBadge({ delta }: { delta: number }) {
  if (delta === 0) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[10px] font-semibold tabular-nums ml-1",
        delta > 0 ? "text-emerald-600" : "text-red-500"
      )}
    >
      {delta > 0 ? (
        <ArrowUp className="w-2.5 h-2.5" />
      ) : (
        <ArrowDown className="w-2.5 h-2.5" />
      )}
      {fmt(Math.abs(delta))}
    </span>
  );
}

function StatementColumn({
  title,
  color,
  deltas,
  showDeltas,
}: {
  title: string;
  color: string;
  deltas: StatementDelta[];
  showDeltas: boolean;
}) {
  return (
    <Card className="shadow-sm border-border/40 flex-1 min-w-0">
      <CardHeader className="pb-1 pt-3 px-3">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", color)} />
          <CardTitle className="text-xs font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left py-1.5 px-3 text-muted-foreground font-medium">
                Item
              </th>
              <th className="text-right py-1.5 px-2 text-muted-foreground font-medium w-16">
                Before
              </th>
              <th className="text-right py-1.5 px-2 text-muted-foreground font-medium w-16">
                After
              </th>
              {showDeltas && (
                <th className="text-right py-1.5 px-2 text-muted-foreground font-medium w-20">
                  Δ
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {deltas.map((d) => {
              const changed = d.delta !== 0;
              return (
                <motion.tr
                  key={d.field}
                  initial={changed ? { backgroundColor: "rgba(59,130,246,0.1)" } : {}}
                  animate={{ backgroundColor: "rgba(0,0,0,0)" }}
                  transition={{ duration: 1.5 }}
                  className={cn(
                    "border-b border-border/10",
                    changed && "font-medium"
                  )}
                >
                  <td
                    className={cn(
                      "py-1 px-3 truncate max-w-[120px]",
                      changed ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {d.label}
                  </td>
                  <td className="py-1 px-2 text-right tabular-nums text-muted-foreground">
                    {fmt(d.before)}
                  </td>
                  <td
                    className={cn(
                      "py-1 px-2 text-right tabular-nums",
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
                    <td className="py-1 px-2 text-right">
                      {changed ? <DeltaBadge delta={d.delta} /> : <Minus className="w-3 h-3 text-muted-foreground/30 ml-auto" />}
                    </td>
                  )}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

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
  interestExpense: "Interest", ebt: "EBT", taxes: "Taxes", netIncome: "Net Income",
  cash: "Cash", accountsReceivable: "Accts Recv", inventory: "Inventory",
  prepaidExpenses: "Prepaid", totalCurrentAssets: "Current Assets",
  ppe: "PP&E (Gross)", accumulatedDepreciation: "Accum Depr", netPPE: "Net PP&E",
  goodwill: "Goodwill", intangibles: "Intangibles", totalAssets: "Total Assets",
  accountsPayable: "Accts Pay", accruedExpenses: "Accrued Exp", currentDebt: "Current Debt",
  totalCurrentLiabilities: "Current Liab", longTermDebt: "LT Debt",
  totalLiabilities: "Total Liab", commonStock: "Common Stock",
  retainedEarnings: "Retained Earn", totalEquity: "Total Equity",
  totalLiabilitiesAndEquity: "Total L&E",
  changesInWorkingCapital: "WC Changes", changeInAR: "Δ AR", changeInInventory: "Δ Inventory",
  changeInAP: "Δ AP", changeInAccruedExpenses: "Δ Accrued", changeInPrepaidExpenses: "Δ Prepaid",
  cashFromOperations: "CFO", capitalExpenditures: "CapEx", cashFromInvesting: "CFI",
  debtIssuance: "Debt Issue", debtRepayment: "Debt Repay", equityIssuance: "Equity Issue",
  dividendsPaid: "Dividends", cashFromFinancing: "CFF", netChangeInCash: "Net Δ Cash",
  beginningCash: "Begin Cash", endingCash: "End Cash",
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
  const [eventHistory, setEventHistory] = useState<{ event: string; amount: number }[]>([]);

  const eventDef = useMemo(
    () => EVENT_DEFINITIONS.find((e) => e.type === selectedEvent),
    [selectedEvent]
  );

  const fullDeltas = useMemo(() => {
    if (!result) return null;
    return {
      is: buildFullDeltas(result.before, result.after, IS_FIELDS, "incomeStatement"),
      bs: buildFullDeltas(result.before, result.after, BS_FIELDS, "balanceSheet"),
      cfs: buildFullDeltas(result.before, result.after, CFS_FIELDS, "cashFlowStatement"),
    };
  }, [result]);

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

  const showDeltaColumn = !interviewMode || guessRevealed;

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
            Apply events and watch all 3 statements update side-by-side
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset Model
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-3 space-y-4">
          <Card className="shadow-sm border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Event Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Event</Label>
                <Select
                  value={selectedEvent}
                  onValueChange={(v) => setSelectedEvent(v as EventType)}
                >
                  <SelectTrigger className="shadow-sm text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_DEFINITIONS.map((evt) => (
                      <SelectItem key={evt.type} value={evt.type} className="text-xs">
                        <span className="flex items-center gap-1.5">
                          <Badge variant="outline" className="text-[8px] px-1 py-0">
                            {evt.category.slice(0, 3)}
                          </Badge>
                          {evt.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {eventDef && (
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    {eventDef.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px]">Amount ($)</Label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Tax Rate (%)</Label>
                  <Input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="h-8 text-xs"
                    min={0}
                    max={100}
                  />
                </div>
              </div>

              {(selectedEvent === "depreciation" ||
                selectedEvent === "buy_ppe_cash" ||
                selectedEvent === "buy_ppe_debt") && (
                <div className="space-y-1">
                  <Label className="text-[10px]">Useful Life (yrs)</Label>
                  <Input
                    type="number"
                    value={usefulLife}
                    onChange={(e) => setUsefulLife(Number(e.target.value))}
                    className="h-8 text-xs"
                    min={1}
                  />
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium flex items-center gap-1">
                    {interviewMode ? <EyeOff className="w-3 h-3 text-amber-500" /> : <Eye className="w-3 h-3 text-primary" />}
                    Interview Mode
                  </span>
                  <Switch
                    checked={interviewMode}
                    onCheckedChange={(v) => { setInterviewMode(v); setGuessRevealed(false); }}
                    className="scale-75"
                  />
                </div>
              </div>

              <Button
                onClick={handleApplyEvent}
                className="w-full gradient-primary text-white shadow-lg shadow-primary/20 h-9 text-xs"
              >
                <Play className="w-3.5 h-3.5 mr-1.5" />
                Apply Event
              </Button>
            </CardContent>
          </Card>

          {eventHistory.length > 0 && (
            <Card className="shadow-sm border-border/40">
              <CardHeader className="pb-1 pt-3">
                <CardTitle className="text-[10px] text-muted-foreground uppercase tracking-wider">History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 pb-3">
                {eventHistory.map((h, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Badge variant="secondary" className="text-[8px] px-1 py-0 shrink-0">{i + 1}</Badge>
                    <span className="truncate">{h.event}</span>
                    <span className="ml-auto tabular-nums font-medium">${h.amount}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {interviewMode && result && (
            <Card className="shadow-sm border-amber-500/30 border-border/40">
              <CardContent className="pt-3 space-y-2">
                <p className="text-[10px] text-muted-foreground">
                  What changes when you <strong>{eventDef?.label.toLowerCase()}</strong> for ${amount}?
                </p>
                <textarea
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  placeholder="Type your answer..."
                  className="w-full text-[10px] p-2 rounded-lg border border-border/40 bg-muted/30 min-h-[60px] resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <Button size="sm" variant="outline" className="w-full h-7 text-[10px]" onClick={() => setGuessRevealed(true)}>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Reveal
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="xl:col-span-9">
          {!result || !fullDeltas ? (
            <Card className="shadow-sm border-border/40 h-full flex items-center justify-center">
              <CardContent className="py-20 text-center">
                <FlaskConical className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="font-semibold mb-2">Ready to Simulate</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Select an event and click &quot;Apply Event&quot; to see all 3 statements update side-by-side.
                </p>
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={JSON.stringify(result.after.balanceSheet.cash)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {!result.isBalanced && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10 text-destructive text-xs">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Balance Sheet does not balance!
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <StatementColumn
                    title="Income Statement"
                    color="bg-blue-500"
                    deltas={fullDeltas.is}
                    showDeltas={showDeltaColumn}
                  />
                  <StatementColumn
                    title="Balance Sheet"
                    color="bg-amber-500"
                    deltas={fullDeltas.bs}
                    showDeltas={showDeltaColumn}
                  />
                  <StatementColumn
                    title="Cash Flow Statement"
                    color="bg-emerald-500"
                    deltas={fullDeltas.cfs}
                    showDeltas={showDeltaColumn}
                  />
                </div>

                {showExplanation && showDeltaColumn && (
                  <Card className="shadow-sm border-border/40 border-l-4 border-l-primary">
                    <CardContent className="pt-3 pb-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-3.5 h-3.5 text-primary" />
                        <h3 className="font-semibold text-xs">Explanation</h3>
                      </div>
                      <ol className="space-y-1 text-[11px] text-muted-foreground">
                        {result.explanation.map((step, i) => (
                          <li key={i} className="flex gap-1.5">
                            <span className="text-primary font-semibold shrink-0">{i + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                      {result.mentalModel.length > 0 && (
                        <>
                          <Separator className="opacity-50" />
                          <div className="space-y-0.5">
                            <p className="text-[10px] font-semibold">Mental Model</p>
                            {result.mentalModel.map((line, i) => (
                              <p key={i} className="text-[10px] text-muted-foreground">{line}</p>
                            ))}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" className="text-[10px] h-7" onClick={() => setShowExplanation(!showExplanation)}>
                    {showExplanation ? <><EyeOff className="w-3 h-3 mr-1" /> Hide</> : <><Eye className="w-3 h-3 mr-1" /> Show</>} Explanation
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
