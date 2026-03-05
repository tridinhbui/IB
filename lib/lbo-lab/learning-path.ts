import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Search,
  Hammer,
  TrendingUp,
  Target,
} from "lucide-react";

export interface LBOLearningStep {
  id: string;
  order: number;
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  color: string;
  description: string;
  estimatedMinutes: number;
}

/** Lộ trình học LBO - theo thứ tự để nắm vững */
export const LBO_LEARNING_PATH: LBOLearningStep[] = [
  {
    id: "fundamentals",
    order: 1,
    href: "/valuation/lbo/fundamentals",
    label: "Private Equity Fundamentals",
    shortLabel: "PE Fundamentals",
    icon: BookOpen,
    color: "from-emerald-500 to-teal-500",
    description: "LBOs, PE lifecycle, capital structure, exit strategies, value creation",
    estimatedMinutes: 45,
  },
  {
    id: "deal-sourcing",
    order: 2,
    href: "/valuation/lbo/deal-sourcing",
    label: "Deal Sourcing Simulator",
    shortLabel: "Deal Sourcing",
    icon: Search,
    color: "from-blue-500 to-cyan-500",
    description: "Đánh giá target, quyết định pursue hay pass",
    estimatedMinutes: 30,
  },
  {
    id: "model",
    order: 3,
    href: "/valuation/lbo/model",
    label: "Advanced LBO Model Lab",
    shortLabel: "LBO Model",
    icon: Hammer,
    color: "from-amber-500 to-orange-500",
    description: "Purchase price, capital structure, FCF, debt schedule",
    estimatedMinutes: 60,
  },
  {
    id: "value-creation",
    order: 4,
    href: "/valuation/lbo/value-creation",
    label: "Value Creation Simulator",
    shortLabel: "Value Creation",
    icon: TrendingUp,
    color: "from-violet-500 to-purple-500",
    description: "Operational improvements, EBITDA growth, EV impact",
    estimatedMinutes: 30,
  },
  {
    id: "exit",
    order: 5,
    href: "/valuation/lbo/exit",
    label: "Exit & Investor Returns Lab",
    shortLabel: "Exit & Returns",
    icon: Target,
    color: "from-rose-500 to-pink-500",
    description: "IRR, MOIC, exit scenarios, leverage amplification",
    estimatedMinutes: 45,
  },
];

export const LBO_STEP_IDS = LBO_LEARNING_PATH.map((s) => s.id);
