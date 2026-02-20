export interface IncomeStatement {
  revenue: number;
  cogs: number;
  grossProfit: number;
  sga: number;
  depreciation: number;
  amortization: number;
  ebit: number;
  interestExpense: number;
  ebt: number;
  taxes: number;
  netIncome: number;
}

export interface BalanceSheet {
  cash: number;
  accountsReceivable: number;
  inventory: number;
  prepaidExpenses: number;
  totalCurrentAssets: number;
  ppe: number;
  accumulatedDepreciation: number;
  netPPE: number;
  goodwill: number;
  intangibles: number;
  totalAssets: number;
  accountsPayable: number;
  accruedExpenses: number;
  currentDebt: number;
  totalCurrentLiabilities: number;
  longTermDebt: number;
  totalLiabilities: number;
  commonStock: number;
  retainedEarnings: number;
  totalEquity: number;
  totalLiabilitiesAndEquity: number;
}

export interface CashFlowStatement {
  netIncome: number;
  depreciation: number;
  amortization: number;
  changesInWorkingCapital: number;
  changeInAR: number;
  changeInInventory: number;
  changeInAP: number;
  changeInAccruedExpenses: number;
  changeInPrepaidExpenses: number;
  cashFromOperations: number;
  capitalExpenditures: number;
  cashFromInvesting: number;
  debtIssuance: number;
  debtRepayment: number;
  equityIssuance: number;
  dividendsPaid: number;
  cashFromFinancing: number;
  netChangeInCash: number;
  beginningCash: number;
  endingCash: number;
}

export interface FinancialModel {
  incomeStatement: IncomeStatement;
  balanceSheet: BalanceSheet;
  cashFlowStatement: CashFlowStatement;
}

export type EventType =
  | "buy_ppe_cash"
  | "buy_ppe_debt"
  | "depreciation"
  | "issue_equity"
  | "pay_down_debt"
  | "increase_inventory"
  | "increase_ar"
  | "revenue_credit"
  | "revenue_cash"
  | "accrued_expense"
  | "prepaid_expense"
  | "write_down";

export interface EventAssumptions {
  amount: number;
  taxRate: number;
  usefulLife?: number;
}

export interface StatementDelta {
  field: string;
  label: string;
  before: number;
  after: number;
  delta: number;
}

export interface EventResult {
  before: FinancialModel;
  after: FinancialModel;
  incomeStatementDeltas: StatementDelta[];
  balanceSheetDeltas: StatementDelta[];
  cashFlowDeltas: StatementDelta[];
  explanation: string[];
  mentalModel: string[];
  isBalanced: boolean;
}

export interface EventDefinition {
  type: EventType;
  label: string;
  description: string;
  category: "Operating" | "Investing" | "Financing";
}
