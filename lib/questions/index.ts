import { accountingQuestions } from "./accounting";
import { valuationQuestions } from "./valuation";
import { evEquityQuestions } from "./ev-equity";
import { mnaQuestions } from "./mna";
import { lboQuestions } from "./lbo";
import { accretionDilutionQuestions } from "./accretion-dilution";
import { fitBehavioralQuestions } from "./fit-behavioral";
import { dragQuestions } from "./drag-questions";
import { Question, DragQuestion, Section, Difficulty } from "@/types/question";

export const allQuestions: Question[] = [
  ...accountingQuestions,
  ...valuationQuestions,
  ...evEquityQuestions,
  ...mnaQuestions,
  ...lboQuestions,
  ...accretionDilutionQuestions,
  ...fitBehavioralQuestions,
];

export const allDragQuestions: DragQuestion[] = dragQuestions;

export function getQuestionsBySection(section: Section): Question[] {
  return allQuestions.filter((q) => q.section === section);
}

export function getQuestionsByDifficulty(difficulty: Difficulty): Question[] {
  return allQuestions.filter((q) => q.difficulty === difficulty);
}

export function getFilteredQuestions(
  section?: Section,
  difficulty?: Difficulty,
  elite?: boolean
): Question[] {
  let filtered = allQuestions;

  if (section) {
    filtered = filtered.filter((q) => q.section === section);
  }

  if (difficulty && !elite) {
    filtered = filtered.filter((q) => q.difficulty === difficulty);
  }

  if (!elite) {
    filtered = filtered.filter((q) => q.difficulty !== "Elite");
  }

  return filtered;
}

export function getRandomQuestions(
  pool: Question[],
  count: number
): Question[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getDragQuestionsByDifficulty(
  difficulty: Difficulty,
  elite: boolean
): DragQuestion[] {
  if (elite) return allDragQuestions;
  return allDragQuestions.filter((q) => q.difficulty !== "Elite");
}
