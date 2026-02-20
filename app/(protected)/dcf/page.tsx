"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
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

const FORMULAS: { title: string; formula: string }[] = [
  { title: "UFCF", formula: "NOPAT + D&A − CapEx − ΔNWC" },
  { title: "TV (Gordon Growth)", formula: "FCF₅ × (1+g) / (WACC − g)" },
  { title: "TV (Exit Multiple)", formula: "EBITDA₅ × Multiple" },
  { title: "Enterprise Value", formula: "Σ PV(FCF) + PV(TV)" },
  { title: "Present Value", formula: "CF / (1 + WACC)ⁿ" },
  { title: "WACC", formula: "(E/V)×Rₑ + (D/V)×Rᵈ×(1−t)" },
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

      years.push({
        revenue,
        ebitda,
        da,
        ebit,
        taxes,
        nopat,
        daAddBack: da,
        capex,
        nwcChange,
        ufcf,
      });

      prevRevenue = revenue;
    }

    const lastYear = years[4];
    const waccDecimal = a.wacc / 100;
    const gDecimal = a.terminalGrowth / 100;

    const tvGordon =
      waccDecimal > gDecimal
        ? (lastYear.ufcf * (1 + gDecimal)) / (waccDecimal - gDecimal)
        : 0;
    const tvExit = lastYear.ebitda * a.exitMultiple;

    const pvFactors = years.map((_, i) => 1 / Math.pow(1 + waccDecimal, i + 1));
    const pvFCFs = years.map((y, i) => y.ufcf * pvFactors[i]);
    const sumPvFCF = pvFCFs.reduce((s, v) => s + v, 0);

    const pvTvGordon = tvGordon * pvFactors[4];
    const pvTvExit = tvExit * pvFactors[4];

    const evGordon = sumPvFCF + pvTvGordon;
    const evExit = sumPvFCF + pvTvExit;
    const evAverage = (evGordon + evExit) / 2;

    return {
      years,
      tvGordon,
      tvExit,
      pvFactors,
      pvFCFs,
      sumPvFCF,
      pvTvGordon,
      pvTvExit,
      evGordon,
      evExit,
      evAverage,
    };
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
  {
    label: "Unlevered FCF",
    getValue: (y) => y.ufcf,
    isBold: true,
    isTopBorder: true,
  },
];

export default function DCFPage() {
  const [assumptions, setAssumptions] = useState<Assumptions>(DEFAULT_ASSUMPTIONS);

  const proj = useProjections(assumptions);

  const updateAssumption = (key: keyof Assumptions, value: string) => {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      setAssumptions((prev) => ({ ...prev, [key]: parsed }));
    }
  };

  const handleReset = () => {
    setAssumptions(DEFAULT_ASSUMPTIONS);
  };

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
            Build a 5-year discounted cash flow model and estimate enterprise
            value
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
              <Lightbulb className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Key Formulas</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {FORMULAS.map((f) => (
                <div
                  key={f.title}
                  className="rounded-lg bg-muted/50 px-3 py-2 text-xs"
                >
                  <p className="font-semibold text-foreground">{f.title}</p>
                  <p className="text-muted-foreground mt-0.5">{f.formula}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

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
                      onChange={(e) =>
                        updateAssumption(field.key, e.target.value)
                      }
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
                        <th
                          key={yr}
                          className="text-right py-2.5 px-4 text-muted-foreground font-medium min-w-[100px]"
                        >
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
                        <td
                          className={cn(
                            "py-2 px-4 sticky left-0 bg-card z-10",
                            row.isBold
                              ? "font-bold text-foreground"
                              : "font-medium text-muted-foreground"
                          )}
                        >
                          {row.label}
                        </td>
                        {proj.years.map((y, i) => {
                          const val = row.getValue(y);
                          const displayVal = row.isNegativeLabel ? -val : val;
                          return (
                            <td
                              key={i}
                              className={cn(
                                "py-2 px-4 text-right tabular-nums",
                                row.isBold && "font-bold",
                                displayVal < 0
                                  ? "text-red-500"
                                  : "text-foreground"
                              )}
                            >
                              {fmt(displayVal)}
                            </td>
                          );
                        })}
                        <td className="py-2 px-4 text-right tabular-nums text-muted-foreground">
                          —
                        </td>
                      </tr>
                    ))}

                    <tr className="border-t-2 border-t-border bg-muted/20">
                      <td className="py-2 px-4 font-bold sticky left-0 bg-muted/20 z-10">
                        TV (Gordon Growth)
                      </td>
                      {[1, 2, 3, 4, 5].map((yr) => (
                        <td
                          key={yr}
                          className="py-2 px-4 text-right tabular-nums text-muted-foreground"
                        >
                          —
                        </td>
                      ))}
                      <td className="py-2 px-4 text-right tabular-nums font-bold text-foreground">
                        {fmt(proj.tvGordon)}
                      </td>
                    </tr>

                    <tr className="border-b border-border/20 bg-muted/20">
                      <td className="py-2 px-4 font-bold sticky left-0 bg-muted/20 z-10">
                        TV (Exit Multiple)
                      </td>
                      {[1, 2, 3, 4, 5].map((yr) => (
                        <td
                          key={yr}
                          className="py-2 px-4 text-right tabular-nums text-muted-foreground"
                        >
                          —
                        </td>
                      ))}
                      <td className="py-2 px-4 text-right tabular-nums font-bold text-foreground">
                        {fmt(proj.tvExit)}
                      </td>
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
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  Present Value of Free Cash Flows
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/40">
                        <th className="text-left py-2 px-3 text-muted-foreground font-medium" />
                        {[1, 2, 3, 4, 5].map((yr) => (
                          <th
                            key={yr}
                            className="text-right py-2 px-3 text-muted-foreground font-medium"
                          >
                            Year {yr}
                          </th>
                        ))}
                        <th className="text-right py-2 px-3 text-muted-foreground font-medium">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/20">
                        <td className="py-2 px-3 font-medium text-muted-foreground">
                          Discount Factor
                        </td>
                        {proj.pvFactors.map((f, i) => (
                          <td
                            key={i}
                            className="py-2 px-3 text-right tabular-nums"
                          >
                            {f.toFixed(4)}
                          </td>
                        ))}
                        <td className="py-2 px-3 text-right tabular-nums text-muted-foreground">
                          —
                        </td>
                      </tr>
                      <tr className="border-b border-border/20">
                        <td className="py-2 px-3 font-medium text-muted-foreground">
                          PV of FCF
                        </td>
                        {proj.pvFCFs.map((pv, i) => (
                          <td
                            key={i}
                            className={cn(
                              "py-2 px-3 text-right tabular-nums font-medium",
                              pv < 0 ? "text-red-500" : "text-foreground"
                            )}
                          >
                            {fmt(pv)}
                          </td>
                        ))}
                        <td className="py-2 px-3 text-right tabular-nums font-bold">
                          {fmt(proj.sumPvFCF)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <ValuationCard
                  label="PV of TV (Gordon Growth)"
                  value={proj.pvTvGordon}
                />
                <ValuationCard
                  label="PV of TV (Exit Multiple)"
                  value={proj.pvTvExit}
                />
                <ValuationCard
                  label="Σ PV of FCFs"
                  value={proj.sumPvFCF}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-border/40 p-3 bg-muted/30">
                  <p className="text-xs text-muted-foreground">
                    EV (Gordon Growth)
                  </p>
                  <p
                    className={cn(
                      "text-lg font-bold tabular-nums mt-1",
                      proj.evGordon < 0 ? "text-red-500" : "text-foreground"
                    )}
                  >
                    {fmt(proj.evGordon)}
                  </p>
                </div>
                <div className="rounded-lg border border-border/40 p-3 bg-muted/30">
                  <p className="text-xs text-muted-foreground">
                    EV (Exit Multiple)
                  </p>
                  <p
                    className={cn(
                      "text-lg font-bold tabular-nums mt-1",
                      proj.evExit < 0 ? "text-red-500" : "text-foreground"
                    )}
                  >
                    {fmt(proj.evExit)}
                  </p>
                </div>
                <div className="rounded-lg gradient-primary p-3 text-white">
                  <p className="text-xs text-white/80">
                    Average Enterprise Value
                  </p>
                  <p className="text-lg font-bold tabular-nums mt-1">
                    {fmt(proj.evAverage)}
                  </p>
                  <Badge
                    variant="secondary"
                    className="mt-1 text-[10px] bg-white/20 text-white border-0 hover:bg-white/30"
                  >
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
      <p
        className={cn(
          "text-sm font-bold tabular-nums mt-1",
          value < 0 ? "text-red-500" : "text-foreground"
        )}
      >
        {fmt(value)}
      </p>
    </div>
  );
}
