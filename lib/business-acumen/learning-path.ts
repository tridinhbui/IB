import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Briefcase,
  Zap,
  BarChart3,
} from "lucide-react";

export interface BALearningStep {
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

/** Lộ trình học Business Acumen - theo thứ tự để nắm vững */
export const BA_LEARNING_PATH: BALearningStep[] = [
  {
    id: "learning",
    order: 1,
    href: "/business-acumen/learning",
    label: "Concept Learning",
    shortLabel: "Concepts",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    description: "Revenue drivers, unit economics, market sizing, pricing, competitive strategy",
    estimatedMinutes: 60,
  },
  {
    id: "cases",
    order: 2,
    href: "/business-acumen/cases",
    label: "Business Case Practice",
    shortLabel: "Cases",
    icon: Briefcase,
    color: "from-emerald-500 to-teal-500",
    description: "Phân tích scenario thực tế, chọn giải thích đúng",
    estimatedMinutes: 45,
  },
  {
    id: "simulation",
    order: 3,
    href: "/business-acumen/simulation",
    label: "Decision Simulation",
    shortLabel: "Simulation",
    icon: Zap,
    color: "from-amber-500 to-orange-500",
    description: "Đóng vai CFO, ra quyết định chiến lược, xem tác động",
    estimatedMinutes: 30,
  },
  {
    id: "data",
    order: 4,
    href: "/business-acumen/data",
    label: "Data Interpretation",
    shortLabel: "Data",
    icon: BarChart3,
    color: "from-violet-500 to-purple-500",
    description: "Đọc dữ liệu tài chính, tìm insight, phân tích xu hướng",
    estimatedMinutes: 40,
  },
];

export const BA_STEP_IDS = BA_LEARNING_PATH.map((s) => s.id);
