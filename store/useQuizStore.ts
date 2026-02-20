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

  setDifficulty: (d: Difficulty) => void;
  setEliteMode: (elite: boolean) => void;
  startQuiz: (section?: Section) => void;
  startDragQuiz: () => void;
  submitAnswer: (questionId: string, answer: string) => void;
  submitDragAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  completeQuiz: () => void;
  completeDragQuiz: () => void;
  setTimeRemaining: (t: number) => void;
  resetQuiz: () => void;
  resetDragQuiz: () => void;
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

      setDifficulty: (d) => set({ difficulty: d }),

      setEliteMode: (elite) => set({ eliteMode: elite }),

      startQuiz: (section) => {
        const { difficulty, eliteMode } = get();
        const pool = getFilteredQuestions(section, difficulty, eliteMode);
        const questions = getRandomQuestions(pool, 20);
        set({
          currentQuiz: questions,
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

      completeQuiz: () => {
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
      name: "ib400-quiz-store",
      partialize: (state) => ({
        progress: state.progress,
        difficulty: state.difficulty,
        eliteMode: state.eliteMode,
      }),
    }
  )
);
