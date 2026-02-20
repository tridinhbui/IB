"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calculator,
  RotateCcw,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  X,
  CheckCircle2,
  XCircle,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Assumptions {
  baseRevenue: number;
  revenueGrowth: number;
  ebitdaMargin: number;
  daPercent: number;
  taxRate: number;
  capexPercent: number;
  nwcPercent: number;
  wacc: number;
  terminalGrowth: number;
  exitMultiple: number;
}

interface YearProjection {
  revenue: number;
  ebitda: number;
  da: number;
  ebit: number;
  taxes: number;
  nopat: number;
  daAddBack: number;
  capex: number;
  nwcChange: number;
  ufcf: number;
}

const DEFAULT_ASSUMPTIONS: Assumptions = {
  baseRevenue: 1000,
  revenueGrowth: 10,
  ebitdaMargin: 30,
  daPercent: 5,
  taxRate: 25,
  capexPercent: 8,
  nwcPercent: 10,
  wacc: 10,
  terminalGrowth: 3,
  exitMultiple: 10,
};

const ASSUMPTION_FIELDS: {
  key: keyof Assumptions;
  label: string;
  suffix: string;
}[] = [
  { key: "baseRevenue", label: "Base Revenue (Year 0)", suffix: "$" },
  { key: "revenueGrowth", label: "Revenue Growth Rate", suffix: "%" },
  { key: "ebitdaMargin", label: "EBITDA Margin", suffix: "%" },
  { key: "daPercent", label: "D&A as % of Revenue", suffix: "%" },
  { key: "taxRate", label: "Tax Rate", suffix: "%" },
  { key: "capexPercent", label: "CapEx as % of Revenue", suffix: "%" },
  { key: "nwcPercent", label: "ΔNWC as % of Rev Change", suffix: "%" },
  { key: "wacc", label: "WACC", suffix: "%" },
  { key: "terminalGrowth", label: "Terminal Growth Rate", suffix: "%" },
  { key: "exitMultiple", label: "Exit Multiple (EV/EBITDA)", suffix: "x" },
];

interface FormulaDefinition {
  id: string;
  title: string;
  formula: string;
  explanation: string;
  blanks: {
    question: string;
    answer: string;
    hint: string;
  }[];
}

const FORMULA_DEFINITIONS: FormulaDefinition[] = [
  {
    id: "ufcf",
    title: "Unlevered FCF",
    formula: "UFCF = NOPAT + D&A − CapEx − ΔNWC",
    explanation:
      "Unlevered Free Cash Flow represents the cash a company generates from its operations that is available to ALL capital providers (both debt and equity holders). It starts with NOPAT (Net Operating Profit After Tax), adds back non-cash charges (D&A), then subtracts cash reinvestments (CapEx and changes in working capital). This is the core cash flow used in DCF analysis because it's independent of capital structure.",
    blanks: [
      { question: "UFCF = ___ + D&A − CapEx − ΔNWC", answer: "NOPAT", hint: "Net Operating Profit After Tax" },
      { question: "UFCF = NOPAT + ___ − CapEx − ΔNWC", answer: "D&A", hint: "Non-cash charge added back" },
      { question: "NOPAT = EBIT × (1 − ___)", answer: "Tax Rate", hint: "The government's share" },
    ],
  },
  {
    id: "tv-gordon",
    title: "TV (Gordon Growth)",
    formula: "TV = FCF₅ × (1 + g) / (WACC − g)",
    explanation:
      "The Gordon Growth Model calculates Terminal Value by assuming the company's FCF grows at a constant rate forever. It takes the last projected year's FCF, grows it by one year (1+g), then divides by (WACC − g). This is the perpetuity formula. Key insight: g must be LESS than WACC, and g should approximate long-term GDP growth (2-3%). A small change in g can massively change the TV.",
    blanks: [
      { question: "TV = FCF₅ × (1 + g) / (___ − g)", answer: "WACC", hint: "Weighted average cost of capital" },
      { question: "TV = FCF₅ × (1 + ___) / (WACC − g)", answer: "g", hint: "Terminal growth rate" },
      { question: "g should approximate long-term ___ growth", answer: "GDP", hint: "Macroeconomic growth benchmark" },
    ],
  },
  {
    id: "tv-exit",
    title: "TV (Exit Multiple)",
    formula: "TV = EBITDA₅ × EV/EBITDA Multiple",
    explanation:
      "The Exit Multiple method assumes the company is sold at the end of the projection period for a multiple of its EBITDA. This multiple is typically derived from comparable company trading multiples or precedent transactions. This approach is more market-driven and often preferred by practitioners because it's anchored to observable market data rather than a theoretical perpetuity growth rate.",
    blanks: [
      { question: "TV = ___₅ × Exit Multiple", answer: "EBITDA", hint: "Earnings Before Interest, Taxes, D&A" },
      { question: "The exit multiple is typically derived from ___ company analysis", answer: "comparable", hint: "Companies similar to the target" },
    ],
  },
  {
    id: "ev",
    title: "Enterprise Value",
    formula: "EV = Σ PV(FCF₁₋₅) + PV(Terminal Value)",
    explanation:
      "Enterprise Value in a DCF is the sum of the present values of all future free cash flows (projection period + terminal value). Each year's FCF is discounted back to today using the WACC. The terminal value, which often represents 60-80% of total EV, is also discounted back. This gives you the intrinsic value of the entire business, before accounting for net debt.",
    blanks: [
      { question: "EV = Σ PV(FCF) + PV(___)", answer: "Terminal Value", hint: "Value beyond the projection period" },
      { question: "Terminal Value often represents ___-80% of total EV", answer: "60", hint: "A surprisingly large percentage" },
    ],
  },
  {
    id: "pv",
    title: "Present Value",
    formula: "PV = CF / (1 + WACC)ⁿ",
    explanation:
      "Present Value discounts a future cash flow back to today. The logic: a dollar today is worth more than a dollar tomorrow because you can invest it. The discount factor (1 + WACC)ⁿ accounts for the time value of money and the riskiness of the cash flows (captured in WACC). The higher the WACC or the further in the future (n), the lower the PV.",
    blanks: [
      { question: "PV = CF / (1 + ___)ⁿ", answer: "WACC", hint: "Discount rate reflecting cost of capital" },
      { question: "A higher WACC results in a ___ present value", answer: "lower", hint: "Inverse relationship" },
      { question: "n represents the number of ___ in the future", answer: "years", hint: "Time dimension" },
    ],
  },
  {
    id: "wacc",
    title: "WACC",
    formula: "WACC = (E/V) × Rₑ + (D/V) × Rᵈ × (1 − t)",
    explanation:
      "Weighted Average Cost of Capital blends the cost of equity (Rₑ) and after-tax cost of debt (Rᵈ × (1−t)) based on the company's capital structure. E/V is the equity weight and D/V is the debt weight. Debt gets a tax shield because interest is tax-deductible, which is why we multiply by (1−t). WACC represents the minimum return a company must earn to satisfy all investors.",
    blanks: [
      { question: "WACC = (E/V) × Rₑ + (D/V) × Rᵈ × (1 − ___)", answer: "t", hint: "Tax rate (the shield)" },
      { question: "E/V represents the ___ weight in capital structure", answer: "equity", hint: "Shareholders' portion" },
      { question: "Interest is tax-deductible, creating a tax ___", answer: "shield", hint: "A benefit that reduces cost" },
    ],
  },
];

const fmt = (n: number) =>
  n < 0
    ? `(${Math.abs(n).toLocaleString(undefined, { maximumFractionDigits: 1 })})`
    : n.toLocaleString(undefined, { maximumFractionDigits: 1 });

function useProjections(a: Assumptions) {
  return useMemo(() => {
    const years: YearProjection[] = [];
    let prevRevenue = a.baseRevenue;

    for (let i = 0; i < 5; i++) {
      const revenue = prevRevenue * (1 + a.revenueGrowth / 100);
      const ebitda = revenue * (a.ebitdaMargin / 100);
      const da = revenue * (a.daPercent / 100);
      const ebit = ebitda - da;
      const taxes = ebit * (a.taxRate / 100);
      const nopat = ebit - taxes;
      const capex = revenue * (a.capexPercent / 100);
      const nwcChange = (revenue - prevRevenue) * (a.nwcPercent / 100);
      const ufcf = nopat + da - capex - nwcChange;

      years.push({ revenue, ebitda, da, ebit, taxes, nopat, daAddBack: da, capex, nwcChange, ufcf });
      prevRevenue = revenue;
    }

    const lastYear = years[4];
    const waccDecimal = a.wacc / 100;
    const gDecimal = a.terminalGrowth / 100;

    const tvGordon = waccDecimal > gDecimal ? (lastYear.ufcf * (1 + gDecimal)) / (waccDecimal - gDecimal) : 0;
    const tvExit = lastYear.ebitda * a.exitMultiple;

    const pvFactors = years.map((_, i) => 1 / Math.pow(1 + waccDecimal, i + 1));
    const pvFCFs = years.map((y, i) => y.ufcf * pvFactors[i]);
    const sumPvFCF = pvFCFs.reduce((s, v) => s + v, 0);

    const pvTvGordon = tvGordon * pvFactors[4];
    const pvTvExit = tvExit * pvFactors[4];

    const evGordon = sumPvFCF + pvTvGordon;
    const evExit = sumPvFCF + pvTvExit;
    const evAverage = (evGordon + evExit) / 2;

    return { years, tvGordon, tvExit, pvFactors, pvFCFs, sumPvFCF, pvTvGordon, pvTvExit, evGordon, evExit, evAverage };
  }, [a]);
}

type RowDef = {
  label: string;
  getValue: (y: YearProjection) => number;
  isBold?: boolean;
  isTopBorder?: boolean;
  isNegativeLabel?: boolean;
};

const TABLE_ROWS: RowDef[] = [
  { label: "Revenue", getValue: (y) => y.revenue },
  { label: "EBITDA", getValue: (y) => y.ebitda },
  { label: "D&A", getValue: (y) => y.da },
  { label: "EBIT", getValue: (y) => y.ebit },
  { label: "Taxes", getValue: (y) => y.taxes },
  { label: "NOPAT", getValue: (y) => y.nopat },
  { label: "(+) D&A", getValue: (y) => y.daAddBack },
  { label: "(−) CapEx", getValue: (y) => y.capex, isNegativeLabel: true },
  { label: "(−) ΔNWC", getValue: (y) => y.nwcChange, isNegativeLabel: true },
  { label: "Unlevered FCF", getValue: (y) => y.ufcf, isBold: true, isTopBorder: true },
];

function FormulaModal({
  formula,
  onClose,
}: {
  formula: FormulaDefinition;
  onClose: () => void;
}) {
  const [blankAnswers, setBlankAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => setSubmitted(true);
  const handleRetry = () => {
    setBlankAnswers({});
    setSubmitted(false);
  };

  const results = formula.blanks.map((b, i) => ({
    correct: (blankAnswers[i] || "").trim().toLowerCase() === b.answer.toLowerCase(),
  }));

  const allCorrect = submitted && results.every((r) => r.correct);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-background border border-border rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border/40">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">{formula.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
            <p className="text-lg font-mono font-bold text-primary">{formula.formula}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Explanation
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {formula.explanation}
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-primary" />
              Fill in the Blanks
            </h3>

            {formula.blanks.map((blank, i) => {
              const isCorrect = submitted && results[i].correct;
              const isWrong = submitted && !results[i].correct;

              return (
                <div key={i} className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    {blank.question}
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      value={blankAnswers[i] || ""}
                      onChange={(e) => setBlankAnswers((prev) => ({ ...prev, [i]: e.target.value }))}
                      placeholder={blank.hint}
                      disabled={submitted}
                      className={cn(
                        "text-sm h-9",
                        isCorrect && "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20",
                        isWrong && "border-red-400 bg-red-50 dark:bg-red-950/20"
                      )}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !submitted) handleSubmit();
                      }}
                    />
                    {submitted && (
                      isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                      )
                    )}
                  </div>
                  {isWrong && (
                    <p className="text-[11px] text-red-500">
                      Answer: <strong>{blank.answer}</strong>
                    </p>
                  )}
                </div>
              );
            })}

            {!submitted ? (
              <Button onClick={handleSubmit} className="w-full h-9 text-sm gradient-primary text-white" disabled={Object.keys(blankAnswers).length === 0}>
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Check Answers
              </Button>
            ) : (
              <div className="space-y-2">
                {allCorrect ? (
                  <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-center">
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">All correct!</p>
                  </div>
                ) : (
                  <Button variant="outline" onClick={handleRetry} className="w-full h-9 text-sm">
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                    Try Again
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DCFPage() {
  const [assumptions, setAssumptions] = useState<Assumptions>(DEFAULT_ASSUMPTIONS);
  const [openFormula, setOpenFormula] = useState<FormulaDefinition | null>(null);

  const proj = useProjections(assumptions);

  const updateAssumption = (key: keyof Assumptions, value: string) => {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      setAssumptions((prev) => ({ ...prev, [key]: parsed }));
    }
  };

  const handleReset = () => setAssumptions(DEFAULT_ASSUMPTIONS);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Calculator className="w-6 h-6 text-primary" />
            DCF Valuation Model
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build a 5-year discounted cash flow model and estimate enterprise value
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="shadow-sm border-border/40 border-l-4 border-l-primary">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Key Formulas</span>
              <Badge variant="secondary" className="text-[9px] ml-1">Click to study</Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {FORMULA_DEFINITIONS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setOpenFormula(f)}
                  className="group rounded-lg bg-muted/50 hover:bg-primary/5 hover:border-primary/20 border border-transparent px-3 py-2.5 text-xs text-left transition-all hover:shadow-md cursor-pointer"
                >
                  <p className="font-bold text-foreground group-hover:text-primary transition-colors">{f.title}</p>
                  <p className="text-muted-foreground mt-0.5 group-hover:text-primary/60 transition-colors">{f.formula}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {openFormula && (
          <FormulaModal formula={openFormula} onClose={() => setOpenFormula(null)} />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 space-y-4"
        >
          <Card className="shadow-sm border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Assumptions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ASSUMPTION_FIELDS.map((field) => (
                <div key={field.key} className="space-y-1">
                  <Label className="text-xs">{field.label}</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={assumptions[field.key]}
                      onChange={(e) => updateAssumption(field.key, e.target.value)}
                      className="shadow-sm bg-blue-50/60 dark:bg-blue-950/20 pr-8"
                      step={field.key === "baseRevenue" ? 100 : 0.5}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                      {field.suffix}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-9 space-y-4"
        >
          <Card className="shadow-sm border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-primary" />
                5-Year Projection
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="text-left py-2.5 px-4 text-muted-foreground font-medium sticky left-0 bg-card z-10 min-w-[140px]">
                        Line Item
                      </th>
                      {[1, 2, 3, 4, 5].map((yr) => (
                        <th key={yr} className="text-right py-2.5 px-4 text-muted-foreground font-medium min-w-[100px]">
                          Year {yr}
                        </th>
                      ))}
                      <th className="text-right py-2.5 px-4 text-muted-foreground font-medium min-w-[120px]">
                        Terminal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {TABLE_ROWS.map((row) => (
                      <tr
                        key={row.label}
                        className={cn(
                          "border-b border-border/20 transition-colors hover:bg-muted/30",
                          row.isTopBorder && "border-t-2 border-t-border"
                        )}
                      >
                        <td className={cn("py-2 px-4 sticky left-0 bg-card z-10", row.isBold ? "font-bold text-foreground" : "font-medium text-muted-foreground")}>
                          {row.label}
                        </td>
                        {proj.years.map((y, i) => {
                          const val = row.getValue(y);
                          const displayVal = row.isNegativeLabel ? -val : val;
                          return (
                            <td key={i} className={cn("py-2 px-4 text-right tabular-nums", row.isBold && "font-bold", displayVal < 0 ? "text-red-500" : "text-foreground")}>
                              {fmt(displayVal)}
                            </td>
                          );
                        })}
                        <td className="py-2 px-4 text-right tabular-nums text-muted-foreground">—</td>
                      </tr>
                    ))}

                    <tr className="border-t-2 border-t-border bg-muted/20">
                      <td className="py-2 px-4 font-bold sticky left-0 bg-muted/20 z-10">TV (Gordon Growth)</td>
                      {[1, 2, 3, 4, 5].map((yr) => (
                        <td key={yr} className="py-2 px-4 text-right tabular-nums text-muted-foreground">—</td>
                      ))}
                      <td className="py-2 px-4 text-right tabular-nums font-bold text-foreground">{fmt(proj.tvGordon)}</td>
                    </tr>

                    <tr className="border-b border-border/20 bg-muted/20">
                      <td className="py-2 px-4 font-bold sticky left-0 bg-muted/20 z-10">TV (Exit Multiple)</td>
                      {[1, 2, 3, 4, 5].map((yr) => (
                        <td key={yr} className="py-2 px-4 text-right tabular-nums text-muted-foreground">—</td>
                      ))}
                      <td className="py-2 px-4 text-right tabular-nums font-bold text-foreground">{fmt(proj.tvExit)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calculator className="w-4 h-4 text-primary" />
                Valuation Output
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Present Value of Free Cash Flows</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/40">
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium" />
                        {[1, 2, 3, 4, 5].map((yr) => (
                          <th key={yr} className="text-right py-2 px-3 text-muted-foreground font-medium">Year {yr}</th>
                        ))}
                        <th className="text-right py-2 px-3 text-muted-foreground font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/20">
                        <td className="py-2 px-3 font-medium text-muted-foreground">Discount Factor</td>
                        {proj.pvFactors.map((f, i) => (
                          <td key={i} className="py-2 px-3 text-right tabular-nums">{f.toFixed(4)}</td>
                        ))}
                        <td className="py-2 px-3 text-right tabular-nums text-muted-foreground">—</td>
                      </tr>
                      <tr className="border-b border-border/20">
                        <td className="py-2 px-3 font-medium text-muted-foreground">PV of FCF</td>
                        {proj.pvFCFs.map((pv, i) => (
                          <td key={i} className={cn("py-2 px-3 text-right tabular-nums font-medium", pv < 0 ? "text-red-500" : "text-foreground")}>
                            {fmt(pv)}
                          </td>
                        ))}
                        <td className="py-2 px-3 text-right tabular-nums font-bold">{fmt(proj.sumPvFCF)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <ValuationCard label="PV of TV (Gordon Growth)" value={proj.pvTvGordon} />
                <ValuationCard label="PV of TV (Exit Multiple)" value={proj.pvTvExit} />
                <ValuationCard label="Σ PV of FCFs" value={proj.sumPvFCF} />
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-border/40 p-3 bg-muted/30">
                  <p className="text-xs text-muted-foreground">EV (Gordon Growth)</p>
                  <p className={cn("text-lg font-bold tabular-nums mt-1", proj.evGordon < 0 ? "text-red-500" : "text-foreground")}>
                    {fmt(proj.evGordon)}
                  </p>
                </div>
                <div className="rounded-lg border border-border/40 p-3 bg-muted/30">
                  <p className="text-xs text-muted-foreground">EV (Exit Multiple)</p>
                  <p className={cn("text-lg font-bold tabular-nums mt-1", proj.evExit < 0 ? "text-red-500" : "text-foreground")}>
                    {fmt(proj.evExit)}
                  </p>
                </div>
                <div className="rounded-lg gradient-primary p-3 text-white">
                  <p className="text-xs text-white/80">Average Enterprise Value</p>
                  <p className="text-lg font-bold tabular-nums mt-1">{fmt(proj.evAverage)}</p>
                  <Badge variant="secondary" className="mt-1 text-[10px] bg-white/20 text-white border-0 hover:bg-white/30">
                    Blended
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function ValuationCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("text-sm font-bold tabular-nums mt-1", value < 0 ? "text-red-500" : "text-foreground")}>
        {fmt(value)}
      </p>
    </div>
  );
}
