"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { COMPS_STEP_IDS } from "@/lib/comps/learning-path";

export type CompsMasteryLevel = "not-started" | "learning" | "practicing" | "mastered";

export interface CompsStepProgress {
  stepId: string;
  lessonsViewed: string[];
  practiceCompleted: boolean;
  practiceBestScore: number;
  scenariosCompleted: number;
  lastVisitedAt: string | null;
  masteryLevel: CompsMasteryLevel;
}

export interface CompsState {
  stepProgress: Record<string, CompsStepProgress>;
  streakDays: number;
  lastActiveDate: string | null;

  markLessonViewed: (stepId: string, lessonId: string) => void;
  completePractice: (stepId: string, score: number) => void;
  completeScenario: (stepId: string) => void;
  setMasteryLevel: (stepId: string, level: CompsMasteryLevel) => void;
  recordVisit: (stepId: string) => void;
  getStepProgress: (stepId: string) => CompsStepProgress;
  getOverallProgress: () => number;
  getNextStep: () => string | null;
  getStreakDays: () => number;
}

const today = () => new Date().toISOString().slice(0, 10);

function getInitialProgress(stepId: string): CompsStepProgress {
  return {
    stepId,
    lessonsViewed: [],
    practiceCompleted: false,
    practiceBestScore: 0,
    scenariosCompleted: 0,
    lastVisitedAt: null,
    masteryLevel: "not-started",
  };
}

export const useCompsStore = create<CompsState>()(
  persist(
    (set, get) => ({
      stepProgress: {},
      streakDays: 0,
      lastActiveDate: null,

      markLessonViewed: (stepId, lessonId) => {
        set((state) => {
          const step = state.stepProgress[stepId] ?? getInitialProgress(stepId);
          if (step.lessonsViewed.includes(lessonId)) return state;
          const lessonsViewed = [...step.lessonsViewed, lessonId];
          const masteryLevel: CompsMasteryLevel =
            step.masteryLevel === "not-started" ? "learning" : step.masteryLevel;
          return {
            stepProgress: {
              ...state.stepProgress,
              [stepId]: {
                ...step,
                lessonsViewed,
                lastVisitedAt: today(),
                masteryLevel,
              },
            },
          };
        });
        get().recordVisit(stepId);
      },

      completePractice: (stepId, score) => {
        set((state) => {
          const step = state.stepProgress[stepId] ?? getInitialProgress(stepId);
          const practiceBestScore = Math.max(step.practiceBestScore, score);
          const masteryLevel: CompsMasteryLevel =
            score >= 80 ? "mastered" : score >= 60 ? "practicing" : step.masteryLevel;
          return {
            stepProgress: {
              ...state.stepProgress,
              [stepId]: {
                ...step,
                practiceCompleted: true,
                practiceBestScore,
                lastVisitedAt: today(),
                masteryLevel,
              },
            },
          };
        });
        get().recordVisit(stepId);
      },

      completeScenario: (stepId) => {
        set((state) => {
          const step = state.stepProgress[stepId] ?? getInitialProgress(stepId);
          return {
            stepProgress: {
              ...state.stepProgress,
              [stepId]: {
                ...step,
                scenariosCompleted: step.scenariosCompleted + 1,
                lastVisitedAt: today(),
              },
            },
          };
        });
        get().recordVisit(stepId);
      },

      setMasteryLevel: (stepId, level) => {
        set((state) => {
          const step = state.stepProgress[stepId] ?? getInitialProgress(stepId);
          return {
            stepProgress: {
              ...state.stepProgress,
              [stepId]: { ...step, masteryLevel: level },
            },
          };
        });
      },

      recordVisit: (stepId) => {
        set((state) => {
          const step = state.stepProgress[stepId] ?? getInitialProgress(stepId);
          const lastActive = state.lastActiveDate;
          const todayStr = today();

          let streakDays = state.streakDays;
          if (lastActive) {
            const last = new Date(lastActive);
            const now = new Date(todayStr);
            const diffDays = Math.floor((now.getTime() - last.getTime()) / (24 * 60 * 60 * 1000));
            if (diffDays === 0) {
              streakDays = state.streakDays;
            } else if (diffDays === 1) {
              streakDays = state.streakDays + 1;
            } else {
              streakDays = 1;
            }
          } else {
            streakDays = 1;
          }

          return {
            stepProgress: {
              ...state.stepProgress,
              [stepId]: { ...step, lastVisitedAt: todayStr },
            },
            lastActiveDate: todayStr,
            streakDays,
          };
        });
      },

      getStepProgress: (stepId) => {
        return get().stepProgress[stepId] ?? getInitialProgress(stepId);
      },

      getOverallProgress: () => {
        const state = get();
        let total = 0;
        let completed = 0;
        for (const stepId of COMPS_STEP_IDS) {
          const step = state.stepProgress[stepId] ?? getInitialProgress(stepId);
          total += 3;
          if (step.lessonsViewed.length > 0) completed += 1;
          if (step.practiceCompleted || step.scenariosCompleted > 0) completed += 1;
          if (step.masteryLevel === "mastered") completed += 1;
        }
        return total > 0 ? Math.round((completed / total) * 100) : 0;
      },

      getNextStep: () => {
        const state = get();
        for (const stepId of COMPS_STEP_IDS) {
          const step = state.stepProgress[stepId] ?? getInitialProgress(stepId);
          if (step.masteryLevel !== "mastered") return stepId;
        }
        return null;
      },

      getStreakDays: () => {
        const state = get();
        if (!state.lastActiveDate) return 0;
        const last = new Date(state.lastActiveDate);
        const now = new Date(today());
        const diffDays = Math.floor((now.getTime() - last.getTime()) / (24 * 60 * 60 * 1000));
        if (diffDays === 0) return state.streakDays;
        return 0;
      },
    }),
    { name: "comps-progress" }
  )
);
