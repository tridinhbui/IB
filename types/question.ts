export type QuestionType = "mcq" | "numeric" | "drag";

export type Section =
  | "Accounting"
  | "EV vs Equity Value"
  | "Valuation"
  | "M&A"
  | "LBO"
  | "Accretion/Dilution"
  | "Fit & Behavioral";

export type Difficulty = "Beginner" | "Advanced" | "Elite";

export interface Question {
  id: string;
  section: Section;
  difficulty: Difficulty;
  type: QuestionType;
  question: string;
  choices?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface DragQuestion {
  id: string;
  lineItem: string;
  correctAnswer: "Income Statement" | "Cash Flow Statement" | "Balance Sheet" | "Multiple Statements";
  explanation: string;
  difficulty: Difficulty;
}

export type Rank = "Not Ready" | "Boutique Ready" | "MM Ready" | "EB/BB Ready";

export interface QuizResult {
  id: string;
  section: Section | "Mixed";
  difficulty: Difficulty;
  score: number;
  total: number;
  accuracy: number;
  rank: Rank;
  timestamp: number;
  sectionBreakdown: Record<string, { correct: number; total: number }>;
}

export interface UserProgress {
  totalCompleted: number;
  totalCorrect: number;
  sectionStats: Record<string, { correct: number; total: number }>;
  quizHistory: QuizResult[];
}
