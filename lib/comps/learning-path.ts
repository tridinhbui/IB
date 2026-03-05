import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Hammer,
  Grid3X3,
  BarChart3,
} from "lucide-react";

export interface CompsLearningStep {
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

/** Lộ trình học Comps - theo thứ tự để nắm vững */
export const COMPS_LEARNING_PATH: CompsLearningStep[] = [
  {
    id: "learn",
    order: 1,
    tabId: "learn",
    label: "Concept Learning",
    shortLabel: "Learn",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    description: "EV/EBITDA, EV/Revenue, P/E, Peer Selection, LTM vs NTM",
    estimatedMinutes: 60,
  },
  {
    id: "build",
    order: 2,
    tabId: "build",
    label: "Build Comps",
    shortLabel: "Build",
    icon: Hammer,
    color: "from-emerald-500 to-teal-500",
    description: "Nhập target metrics, chọn multiples, tính EV",
    estimatedMinutes: 30,
  },
  {
    id: "sensitivity",
    order: 3,
    tabId: "sensitivity",
    label: "Sensitivity Analysis",
    shortLabel: "Sensitivity",
    icon: Grid3X3,
    color: "from-violet-500 to-purple-500",
    description: "EV/EBITDA multiple sensitivity, range analysis",
    estimatedMinutes: 25,
  },
];

export const COMPS_STEP_IDS = COMPS_LEARNING_PATH.map((s) => s.id);
