"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Question,
  DragQuestion,
  Section,
  Difficulty,
  Rank,
  QuizResult,
  UserProgress,
  IbQuestion,
} from "@/types/question";
import {
  getFilteredQuestions,
  getRandomQuestions,
  getDragQuestionsByDifficulty,
} from "@/lib/questions";

function getRank(accuracy: number): Rank {
  if (accuracy >= 85) return "EB/BB Ready";
  if (accuracy >= 75) return "MM Ready";
  if (accuracy >= 60) return "Boutique Ready";
  return "Not Ready";
}

interface QuizState {
  difficulty: Difficulty;
  eliteMode: boolean;
  currentQuiz: Question[];
  currentDragQuiz: DragQuestion[];
  currentIndex: number;
  answers: Record<string, string>;
  dragAnswers: Record<string, string>;
  quizStarted: boolean;
  quizCompleted: boolean;
  dragQuizStarted: boolean;
  dragQuizCompleted: boolean;
  timeRemaining: number;
  progress: UserProgress;
  dbAnalytics: {
    overall: {
      totalQuestionsDone: number;
      totalCorrectAnswers: number;
      overallAccuracy: number;
    };
    sections: {
      section: string;
      questionsDone: number;
      correctAnswers: number;
      accuracy: number;
    }[];
    recentResults: {
      id: string;
      section: string;
      difficulty: string;
      accuracy: number;
      createdAt: string;
    }[];
  };

  essayQuestions: IbQuestion[];
  allTechnicalQuestions: Question[];

  setDifficulty: (d: Difficulty) => void;
  setEliteMode: (elite: boolean) => void;
  setEssayQuestions: (questions: IbQuestion[]) => void;
  setAllTechnicalQuestions: (questions: Question[]) => void;
  startQuiz: (section?: Section, questions?: Question[]) => void;
  startDragQuiz: () => void;
  fetchDBAnalytics: () => Promise<void>;
  fetchAllTechnicalQuestions: () => Promise<void>;
  submitAnswer: (questionId: string, answer: string) => void;
  submitDragAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  completeQuiz: () => Promise<void>;
  completeDragQuiz: () => void;
  setTimeRemaining: (t: number) => void;
  resetQuiz: () => void;
  resetDragQuiz: () => void;
  resetUserData: () => void;
  getWeakestSection: () => string;
  getAccuracy: () => number;
}

const defaultProgress: UserProgress = {
  totalCompleted: 0,
  totalCorrect: 0,
  sectionStats: {},
  quizHistory: [],
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      difficulty: "Beginner",
      eliteMode: false,
      currentQuiz: [],
      currentDragQuiz: [],
      currentIndex: 0,
      answers: {},
      dragAnswers: {},
      quizStarted: false,
      quizCompleted: false,
      dragQuizStarted: false,
      dragQuizCompleted: false,
      timeRemaining: 1200,
      progress: defaultProgress,
      dbAnalytics: {
        overall: { totalQuestionsDone: 0, totalCorrectAnswers: 0, overallAccuracy: 0 },
        sections: [],
        recentResults: []
      },
      essayQuestions: [],
      allTechnicalQuestions: [],

      setDifficulty: (d) => set({ difficulty: d }),

      setEliteMode: (elite) => set({ eliteMode: elite }),

      setEssayQuestions: (questions) => set({ essayQuestions: questions }),

      setAllTechnicalQuestions: (questions) => {
        if (Array.isArray(questions)) {
          set({ allTechnicalQuestions: questions });
        }
      },

      startQuiz: (section, questions) => {
        const { difficulty, eliteMode, allTechnicalQuestions } = get();

        let quizQuestions: Question[] = [];

        if (questions) {
          quizQuestions = questions;
        } else {
          // Logic to prefer DB questions if available
          const pool = allTechnicalQuestions.length > 0
            ? allTechnicalQuestions
            : getFilteredQuestions(section, difficulty, eliteMode);

          // If we are using the DB pool, we need to filter it here since we aren't using the local getFilteredQuestions on it
          let filteredPool = pool;
          if (allTechnicalQuestions.length > 0) {
            if (section) {
              filteredPool = filteredPool.filter(q => q.section === section);
            }
            if (difficulty && !eliteMode) {
              filteredPool = filteredPool.filter(q => q.difficulty === difficulty);
            }
            if (!eliteMode) {
              filteredPool = filteredPool.filter(q => q.difficulty !== "Elite");
            }
          }

          quizQuestions = getRandomQuestions(filteredPool, 20);
        }

        set({
          currentQuiz: quizQuestions,
          currentIndex: 0,
          answers: {},
          quizStarted: true,
          quizCompleted: false,
          timeRemaining: 1200,
        });
      },

      startDragQuiz: () => {
        const { difficulty, eliteMode } = get();
        const pool = getDragQuestionsByDifficulty(difficulty, eliteMode);
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        set({
          currentDragQuiz: shuffled,
          dragAnswers: {},
          dragQuizStarted: true,
          dragQuizCompleted: false,
        });
      },

      fetchDBAnalytics: async () => {
        // Immediately clear stale data before fetching new user's data
        set({
          dbAnalytics: {
            overall: { totalQuestionsDone: 0, totalCorrectAnswers: 0, overallAccuracy: 0 },
            sections: [],
            recentResults: [],
          }
        });
        try {
          const res = await fetch('/api/quiz-progress');
          if (res.ok) {
            const data = await res.json();
            console.log('[Store] fetchDBAnalytics response:', JSON.stringify(data, null, 2));
            set({
              dbAnalytics: {
                overall: data.overall || { totalQuestionsDone: 0, totalCorrectAnswers: 0, overallAccuracy: 0 },
                sections: data.sections || [],
                recentResults: data.recentResults || [],
              }
            });
          } else {
            console.error('[Store] fetchDBAnalytics failed with status:', res.status);
          }
        } catch (err) {
          console.error("[Store] fetchDBAnalytics network error:", err);
        }
      },

      fetchAllTechnicalQuestions: async () => {
        try {
          const res = await fetch('/api/technical-questions');
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              set({ allTechnicalQuestions: data });
            }
          }
        } catch (err) {
          console.error("[Store] fetchAllTechnicalQuestions network error:", err);
        }
      },

      submitAnswer: (questionId, answer) => {
        set((state) => ({
          answers: { ...state.answers, [questionId]: answer },
        }));
      },

      submitDragAnswer: (questionId, answer) => {
        set((state) => ({
          dragAnswers: { ...state.dragAnswers, [questionId]: answer },
        }));
      },

      nextQuestion: () => {
        const { currentIndex, currentQuiz } = get();
        if (currentIndex < currentQuiz.length - 1) {
          set({ currentIndex: currentIndex + 1 });
        }
      },

      prevQuestion: () => {
        const { currentIndex } = get();
        if (currentIndex > 0) {
          set({ currentIndex: currentIndex - 1 });
        }
      },

      completeQuiz: async () => {
        const { currentQuiz, answers, progress, difficulty } = get();

        let correct = 0;
        const sectionBreakdown: Record<
          string,
          { correct: number; total: number }
        > = {};

        currentQuiz.forEach((q) => {
          const isCorrect =
            answers[q.id]?.trim().toLowerCase() ===
            q.correctAnswer.trim().toLowerCase();
          if (isCorrect) correct++;

          if (!sectionBreakdown[q.section]) {
            sectionBreakdown[q.section] = { correct: 0, total: 0 };
          }
          sectionBreakdown[q.section].total++;
          if (isCorrect) sectionBreakdown[q.section].correct++;
        });

        const accuracy =
          currentQuiz.length > 0
            ? Math.round((correct / currentQuiz.length) * 100)
            : 0;

        const result: QuizResult = {
          id: Date.now().toString(),
          section: "Mixed",
          difficulty,
          score: correct,
          total: currentQuiz.length,
          accuracy,
          rank: getRank(accuracy),
          timestamp: Date.now(),
          sectionBreakdown,
        };

        const newSectionStats = { ...progress.sectionStats };
        Object.entries(sectionBreakdown).forEach(([sec, data]) => {
          if (!newSectionStats[sec]) {
            newSectionStats[sec] = { correct: 0, total: 0 };
          }
          newSectionStats[sec].correct += data.correct;
          newSectionStats[sec].total += data.total;
        });

        set({
          quizCompleted: true,
          progress: {
            totalCompleted: progress.totalCompleted + currentQuiz.length,
            totalCorrect: progress.totalCorrect + correct,
            sectionStats: newSectionStats,
            quizHistory: [...progress.quizHistory, result],
          },
        });

        // Sync with database
        console.log('Syncing sectionBreakdown to DB:', sectionBreakdown);
        try {
          const res = await fetch('/api/quiz-progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sectionBreakdown,
              difficulty,
              score: correct,
              total: currentQuiz.length,
              accuracy
            }),
          });
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ details: res.statusText }));
            console.error('[Store] Sync Error:', errorData);
          } else {
            console.log('[Store] Sync successful — refreshing analytics...');
            await get().fetchDBAnalytics();
          }
        } catch (err: any) {
          console.error('[Store] Network Error during sync:', err.message);
        }
      },

      completeDragQuiz: () => {
        const { currentDragQuiz, dragAnswers, progress } = get();

        let correct = 0;
        currentDragQuiz.forEach((q) => {
          if (dragAnswers[q.id] === q.correctAnswer) correct++;
        });

        const newSectionStats = { ...progress.sectionStats };
        if (!newSectionStats["Accounting (Drag)"]) {
          newSectionStats["Accounting (Drag)"] = { correct: 0, total: 0 };
        }
        newSectionStats["Accounting (Drag)"].correct += correct;
        newSectionStats["Accounting (Drag)"].total += currentDragQuiz.length;

        set({
          dragQuizCompleted: true,
          progress: {
            ...progress,
            totalCompleted: progress.totalCompleted + currentDragQuiz.length,
            totalCorrect: progress.totalCorrect + correct,
            sectionStats: newSectionStats,
          },
        });
      },

      setTimeRemaining: (t) => set({ timeRemaining: t }),

      resetQuiz: () =>
        set({
          currentQuiz: [],
          currentIndex: 0,
          answers: {},
          quizStarted: false,
          quizCompleted: false,
          timeRemaining: 1200,
        }),

      resetDragQuiz: () =>
        set({
          currentDragQuiz: [],
          dragAnswers: {},
          dragQuizStarted: false,
          dragQuizCompleted: false,
        }),

      resetUserData: () => {
        set({
          progress: defaultProgress,
          dbAnalytics: {
            overall: { totalQuestionsDone: 0, totalCorrectAnswers: 0, overallAccuracy: 0 },
            sections: [],
            recentResults: [],
          },
          allTechnicalQuestions: [],
          essayQuestions: [],
          currentQuiz: [],
          currentIndex: 0,
          answers: {},
          quizStarted: false,
          quizCompleted: false,
        });
      },

      getWeakestSection: () => {
        const { progress } = get();
        let weakest = "N/A";
        let lowestAccuracy = 101;

        Object.entries(progress.sectionStats).forEach(([section, stats]) => {
          if (stats.total > 0) {
            const acc = (stats.correct / stats.total) * 100;
            if (acc < lowestAccuracy) {
              lowestAccuracy = acc;
              weakest = section;
            }
          }
        });

        return weakest;
      },

      getAccuracy: () => {
        const { progress } = get();
        if (progress.totalCompleted === 0) return 0;
        return Math.round(
          (progress.totalCorrect / progress.totalCompleted) * 100
        );
      },
    }),
    {
      name: "ib400-quiz-store-v2",
      // SECURITY: Only persist non-sensitive UI preferences.
      // Never persist user-specific data (progress, analytics, questions).
      // This prevents data leakage between different users on the same browser.
      partialize: (state) => ({
        difficulty: state.difficulty,
        eliteMode: state.eliteMode,
      }),
    }
  )
);
