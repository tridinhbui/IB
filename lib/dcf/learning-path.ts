import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Hammer,
  Building2,
  Grid3X3,
  Calculator,
} from "lucide-react";

export interface DCFLearningStep {
  id: string;
  order: number;
  tabId: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  color: string;
  description: string;
  estimatedMinutes: number;
}

/** Lộ trình học DCF - theo thứ tự để nắm vững */
export const DCF_LEARNING_PATH: DCFLearningStep[] = [
  {
    id: "learn",
    order: 1,
    tabId: "learn",
    label: "Concept Learning",
    shortLabel: "Learn",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    description: "Revenue, EBITDA, NOPAT, FCF, WACC, Terminal Value, EV",
    estimatedMinutes: 90,
  },
  {
    id: "build",
    order: 2,
    tabId: "build",
    label: "Build Wizard",
    shortLabel: "Build",
    icon: Hammer,
    color: "from-emerald-500 to-teal-500",
    description: "9 bước xây dựng mô hình DCF từ đầu",
    estimatedMinutes: 45,
  },
  {
    id: "case",
    order: 3,
    tabId: "case",
    label: "Case Study",
    shortLabel: "Case",
    icon: Building2,
    color: "from-amber-500 to-orange-500",
    description: "Valuation thực tế: Apple, Microsoft, NVIDIA, Tesla, Costco",
    estimatedMinutes: 60,
  },
  {
    id: "sensitivity",
    order: 4,
    tabId: "sensitivity",
    label: "Sensitivity Analysis",
    shortLabel: "Sensitivity",
    icon: Grid3X3,
    color: "from-violet-500 to-purple-500",
    description: "WACC vs Terminal Growth, phân tích độ nhạy",
    estimatedMinutes: 30,
  },
];

export const DCF_STEP_IDS = DCF_LEARNING_PATH.map((s) => s.id);
