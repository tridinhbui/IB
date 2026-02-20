import type {
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
  FinancialModel,
  EventType,
  EventAssumptions,
  StatementDelta,
  EventResult,
  EventDefinition,
} from "./types";

export const EVENT_DEFINITIONS: EventDefinition[] = [
  {
    type: "buy_ppe_cash",
    label: "Purchase PP&E with Cash",
    description: "Buy property, plant & equipment using cash. Cash decreases, PP&E increases.",
    category: "Investing",
  },
  {
    type: "buy_ppe_debt",
    label: "Purchase PP&E with Debt",
    description: "Buy property, plant & equipment financed by long-term debt. PP&E and LT Debt both increase.",
    category: "Investing",
  },
  {
    type: "depreciation",
    label: "Record Depreciation",
    description: "Record depreciation expense. Non-cash charge that reduces net income but is added back on the cash flow statement.",
    category: "Operating",
  },
  {
    type: "issue_equity",
    label: "Issue Equity",
    description: "Raise capital by issuing common stock. Cash and common stock both increase.",
    category: "Financing",
  },
  {
    type: "pay_down_debt",
    label: "Pay Down Debt",
    description: "Repay long-term debt with cash. Cash and LT Debt both decrease.",
    category: "Financing",
  },
  {
    type: "increase_inventory",
    label: "Purchase Inventory",
    description: "Purchase additional inventory with cash. Cash decreases, inventory increases.",
    category: "Operating",
  },
  {
    type: "increase_ar",
    label: "Increase Accounts Receivable",
    description: "Accounts receivable increases with no cash collected. Working capital use of cash.",
    category: "Operating",
  },
  {
    type: "revenue_credit",
    label: "Earn Revenue (on Credit)",
    description: "Recognize revenue on credit. AR increases, flows through IS to retained earnings.",
    category: "Operating",
  },
  {
    type: "revenue_cash",
    label: "Earn Revenue (Cash)",
    description: "Recognize revenue collected in cash. Cash increases, flows through IS to retained earnings.",
    category: "Operating",
  },
  {
    type: "accrued_expense",
    label: "Accrue an Expense",
    description: "Record an expense not yet paid in cash. SGA increases, accrued liabilities increase.",
    category: "Operating",
  },
  {
    type: "prepaid_expense",
    label: "Prepay an Expense",
    description: "Pay cash in advance for a future expense. Cash decreases, prepaid expenses increase.",
    category: "Operating",
  },
  {
    type: "write_down",
    label: "Write Down / Impairment",
    description: "Impair goodwill or intangibles. Non-cash charge that reduces asset value and net income.",
    category: "Operating",
  },
];

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function createBaseModel(): FinancialModel {
  const is: IncomeStatement = {
    revenue: 1000,
    cogs: 400,
    grossProfit: 600,
    sga: 200,
    depreciation: 50,
    amortization: 20,
    ebit: 330,
    interestExpense: 30,
    ebt: 300,
    taxes: 75,
    netIncome: 225,
  };

  const totalCurrentAssets = 500 + 200 + 150 + 50;
  const netPPE = 1000 - 200;
  const totalAssets = totalCurrentAssets + netPPE + 300 + 100;
  const totalCurrentLiabilities = 150 + 100 + 50;
  const totalLiabilities = totalCurrentLiabilities + 500;
  const retainedEarnings = totalAssets - totalLiabilities - 800;
  const totalEquity = 800 + retainedEarnings;

  const bs: BalanceSheet = {
    cash: 500,
    accountsReceivable: 200,
    inventory: 150,
    prepaidExpenses: 50,
    totalCurrentAssets,
    ppe: 1000,
    accumulatedDepreciation: 200,
    netPPE,
    goodwill: 300,
    intangibles: 100,
    totalAssets,
    accountsPayable: 150,
    accruedExpenses: 100,
    currentDebt: 50,
    totalCurrentLiabilities,
    longTermDebt: 500,
    totalLiabilities,
    commonStock: 800,
    retainedEarnings,
    totalEquity,
    totalLiabilitiesAndEquity: totalLiabilities + totalEquity,
  };

  const cfs: CashFlowStatement = {
    netIncome: 225,
    depreciation: 50,
    amortization: 20,
    changesInWorkingCapital: 0,
    changeInAR: 0,
    changeInInventory: 0,
    changeInAP: 0,
    changeInAccruedExpenses: 0,
    changeInPrepaidExpenses: 0,
    cashFromOperations: 295,
    capitalExpenditures: 0,
    cashFromInvesting: 0,
    debtIssuance: 0,
    debtRepayment: 0,
    equityIssuance: 0,
    dividendsPaid: 0,
    cashFromFinancing: 0,
    netChangeInCash: 295,
    beginningCash: 205,
    endingCash: 500,
  };

  return {
    incomeStatement: is,
    balanceSheet: bs,
    cashFlowStatement: cfs,
  };
}

export function recalculateModel(model: FinancialModel): FinancialModel {
  const is = model.incomeStatement;
  is.grossProfit = is.revenue - is.cogs;
  is.ebit = is.grossProfit - is.sga - is.depreciation - is.amortization;
  is.ebt = is.ebit - is.interestExpense;
  is.taxes = Math.round(Math.max(0, is.ebt) * (is.ebt > 0 ? is.taxes / Math.max(1, is.ebt) : 0.25) * 100) / 100;
  is.netIncome = is.ebt - is.taxes;

  const bs = model.balanceSheet;
  bs.totalCurrentAssets = bs.cash + bs.accountsReceivable + bs.inventory + bs.prepaidExpenses;
  bs.netPPE = bs.ppe - bs.accumulatedDepreciation;
  bs.totalAssets = bs.totalCurrentAssets + bs.netPPE + bs.goodwill + bs.intangibles;
  bs.totalCurrentLiabilities = bs.accountsPayable + bs.accruedExpenses + bs.currentDebt;
  bs.totalLiabilities = bs.totalCurrentLiabilities + bs.longTermDebt;
  bs.totalEquity = bs.commonStock + bs.retainedEarnings;
  bs.totalLiabilitiesAndEquity = bs.totalLiabilities + bs.totalEquity;

  const cfs = model.cashFlowStatement;
  cfs.changesInWorkingCapital =
    cfs.changeInAR + cfs.changeInInventory + cfs.changeInAP + cfs.changeInAccruedExpenses + cfs.changeInPrepaidExpenses;
  cfs.cashFromOperations = cfs.netIncome + cfs.depreciation + cfs.amortization + cfs.changesInWorkingCapital;
  cfs.cashFromInvesting = cfs.capitalExpenditures;
  cfs.cashFromFinancing = cfs.debtIssuance - cfs.debtRepayment + cfs.equityIssuance - cfs.dividendsPaid;
  cfs.netChangeInCash = cfs.cashFromOperations + cfs.cashFromInvesting + cfs.cashFromFinancing;
  cfs.endingCash = cfs.beginningCash + cfs.netChangeInCash;

  return model;
}

export function validateBalance(model: FinancialModel): boolean {
  const diff = Math.abs(model.balanceSheet.totalAssets - model.balanceSheet.totalLiabilitiesAndEquity);
  return diff < 0.01;
}

function applyEvent(model: FinancialModel, eventType: EventType, assumptions: EventAssumptions): FinancialModel {
  const { amount, taxRate } = assumptions;
  const is = model.incomeStatement;
  const bs = model.balanceSheet;
  const cfs = model.cashFlowStatement;

  switch (eventType) {
    case "buy_ppe_cash": {
      bs.cash -= amount;
      bs.ppe += amount;
      cfs.capitalExpenditures -= amount;
      break;
    }

    case "buy_ppe_debt": {
      bs.ppe += amount;
      bs.longTermDebt += amount;
      cfs.capitalExpenditures -= amount;
      cfs.debtIssuance += amount;
      break;
    }

    case "depreciation": {
      const depAmount = assumptions.usefulLife ? amount / assumptions.usefulLife : amount;
      is.depreciation += depAmount;
      bs.accumulatedDepreciation += depAmount;
      cfs.depreciation += depAmount;
      const taxShield = depAmount * taxRate;
      is.taxes -= taxShield;
      bs.retainedEarnings -= depAmount - taxShield;
      break;
    }

    case "issue_equity": {
      bs.cash += amount;
      bs.commonStock += amount;
      cfs.equityIssuance += amount;
      break;
    }

    case "pay_down_debt": {
      bs.cash -= amount;
      bs.longTermDebt -= amount;
      cfs.debtRepayment += amount;
      break;
    }

    case "increase_inventory": {
      bs.cash -= amount;
      bs.inventory += amount;
      cfs.changeInInventory -= amount;
      break;
    }

    case "increase_ar": {
      bs.accountsReceivable += amount;
      cfs.changeInAR -= amount;
      break;
    }

    case "revenue_credit": {
      is.revenue += amount;
      const taxOnRevenue = amount * taxRate;
      is.taxes += taxOnRevenue;
      bs.accountsReceivable += amount;
      bs.retainedEarnings += amount - taxOnRevenue;
      cfs.netIncome += amount - taxOnRevenue;
      cfs.changeInAR -= amount;
      break;
    }

    case "revenue_cash": {
      is.revenue += amount;
      const taxOnCashRevenue = amount * taxRate;
      is.taxes += taxOnCashRevenue;
      bs.cash += amount - taxOnCashRevenue;
      bs.retainedEarnings += amount - taxOnCashRevenue;
      cfs.netIncome += amount - taxOnCashRevenue;
      break;
    }

    case "accrued_expense": {
      is.sga += amount;
      const taxSaving = amount * taxRate;
      is.taxes -= taxSaving;
      bs.accruedExpenses += amount;
      bs.retainedEarnings -= amount - taxSaving;
      cfs.netIncome -= amount - taxSaving;
      cfs.changeInAccruedExpenses += amount;
      break;
    }

    case "prepaid_expense": {
      bs.cash -= amount;
      bs.prepaidExpenses += amount;
      cfs.changeInPrepaidExpenses -= amount;
      break;
    }

    case "write_down": {
      const halfAmount = amount / 2;
      bs.goodwill -= halfAmount;
      bs.intangibles -= halfAmount;
      is.sga += amount;
      const writeDownTaxSaving = amount * taxRate;
      is.taxes -= writeDownTaxSaving;
      bs.retainedEarnings -= amount - writeDownTaxSaving;
      cfs.netIncome -= amount - writeDownTaxSaving;
      cfs.amortization += amount;
      break;
    }
  }

  recalculateModel(model);
  return model;
}

function computeStatementDeltas(
  beforeObj: Record<string, number>,
  afterObj: Record<string, number>,
  labelMap: Record<string, string>
): StatementDelta[] {
  const deltas: StatementDelta[] = [];
  for (const key of Object.keys(beforeObj)) {
    const before = beforeObj[key];
    const after = afterObj[key];
    const delta = Math.round((after - before) * 100) / 100;
    if (Math.abs(delta) > 0.001) {
      deltas.push({
        field: key,
        label: labelMap[key] || key,
        before,
        after,
        delta,
      });
    }
  }
  return deltas;
}

const IS_LABELS: Record<string, string> = {
  revenue: "Revenue",
  cogs: "Cost of Goods Sold",
  grossProfit: "Gross Profit",
  sga: "SG&A Expenses",
  depreciation: "Depreciation",
  amortization: "Amortization",
  ebit: "EBIT",
  interestExpense: "Interest Expense",
  ebt: "Earnings Before Tax",
  taxes: "Income Taxes",
  netIncome: "Net Income",
};

const BS_LABELS: Record<string, string> = {
  cash: "Cash",
  accountsReceivable: "Accounts Receivable",
  inventory: "Inventory",
  prepaidExpenses: "Prepaid Expenses",
  totalCurrentAssets: "Total Current Assets",
  ppe: "PP&E (Gross)",
  accumulatedDepreciation: "Accumulated Depreciation",
  netPPE: "Net PP&E",
  goodwill: "Goodwill",
  intangibles: "Intangible Assets",
  totalAssets: "Total Assets",
  accountsPayable: "Accounts Payable",
  accruedExpenses: "Accrued Expenses",
  currentDebt: "Current Debt",
  totalCurrentLiabilities: "Total Current Liabilities",
  longTermDebt: "Long-Term Debt",
  totalLiabilities: "Total Liabilities",
  commonStock: "Common Stock",
  retainedEarnings: "Retained Earnings",
  totalEquity: "Total Equity",
  totalLiabilitiesAndEquity: "Total Liabilities & Equity",
};

const CFS_LABELS: Record<string, string> = {
  netIncome: "Net Income",
  depreciation: "Depreciation (Add-back)",
  amortization: "Amortization (Add-back)",
  changesInWorkingCapital: "Changes in Working Capital",
  changeInAR: "Change in Accounts Receivable",
  changeInInventory: "Change in Inventory",
  changeInAP: "Change in Accounts Payable",
  changeInAccruedExpenses: "Change in Accrued Expenses",
  changeInPrepaidExpenses: "Change in Prepaid Expenses",
  cashFromOperations: "Cash from Operations",
  capitalExpenditures: "Capital Expenditures",
  cashFromInvesting: "Cash from Investing",
  debtIssuance: "Debt Issuance",
  debtRepayment: "Debt Repayment",
  equityIssuance: "Equity Issuance",
  dividendsPaid: "Dividends Paid",
  cashFromFinancing: "Cash from Financing",
  netChangeInCash: "Net Change in Cash",
  beginningCash: "Beginning Cash",
  endingCash: "Ending Cash",
};

export function computeDeltas(
  before: FinancialModel,
  after: FinancialModel
): {
  incomeStatementDeltas: StatementDelta[];
  balanceSheetDeltas: StatementDelta[];
  cashFlowDeltas: StatementDelta[];
} {
  return {
    incomeStatementDeltas: computeStatementDeltas(
      before.incomeStatement as unknown as Record<string, number>,
      after.incomeStatement as unknown as Record<string, number>,
      IS_LABELS
    ),
    balanceSheetDeltas: computeStatementDeltas(
      before.balanceSheet as unknown as Record<string, number>,
      after.balanceSheet as unknown as Record<string, number>,
      BS_LABELS
    ),
    cashFlowDeltas: computeStatementDeltas(
      before.cashFlowStatement as unknown as Record<string, number>,
      after.cashFlowStatement as unknown as Record<string, number>,
      CFS_LABELS
    ),
  };
}

export function generateExplanation(eventType: EventType, assumptions: EventAssumptions): string[] {
  const { amount, taxRate } = assumptions;
  const afterTax = amount * (1 - taxRate);

  switch (eventType) {
    case "buy_ppe_cash":
      return [
        `Purchase $${amount} of PP&E using cash.`,
        `Balance Sheet: Cash decreases by $${amount}, PP&E increases by $${amount}. Total assets unchanged.`,
        `Cash Flow Statement: Capital expenditure of $${amount} recorded in Cash from Investing.`,
        `Income Statement: No impact — this is a capital expenditure, not an expense.`,
      ];

    case "buy_ppe_debt":
      return [
        `Purchase $${amount} of PP&E financed with long-term debt.`,
        `Balance Sheet: PP&E increases by $${amount}, Long-Term Debt increases by $${amount}. Both sides increase equally.`,
        `Cash Flow Statement: CapEx of $${amount} in CFI, offset by $${amount} debt issuance in CFF. Net cash impact is zero.`,
        `Income Statement: No impact — no expense recognized at purchase.`,
      ];

    case "depreciation": {
      const dep = assumptions.usefulLife ? amount / assumptions.usefulLife : amount;
      const taxShield = dep * taxRate;
      return [
        `Record $${dep} of depreciation expense.`,
        `Income Statement: Depreciation expense of $${dep} reduces EBIT. Tax shield of $${taxShield.toFixed(2)} reduces taxes. Net income decreases by $${(dep - taxShield).toFixed(2)}.`,
        `Balance Sheet: Accumulated depreciation increases by $${dep}, reducing Net PP&E. Retained earnings decrease by $${(dep - taxShield).toFixed(2)}.`,
        `Cash Flow Statement: Depreciation of $${dep} is added back (non-cash charge). Net cash impact from operations reflects tax shield benefit.`,
      ];
    }

    case "issue_equity":
      return [
        `Issue $${amount} of common stock.`,
        `Balance Sheet: Cash increases by $${amount}, Common Stock increases by $${amount}. Both sides increase equally.`,
        `Cash Flow Statement: $${amount} inflow recorded in Cash from Financing.`,
        `Income Statement: No impact — equity issuance is not revenue.`,
      ];

    case "pay_down_debt":
      return [
        `Repay $${amount} of long-term debt.`,
        `Balance Sheet: Cash decreases by $${amount}, Long-Term Debt decreases by $${amount}. Both sides decrease equally.`,
        `Cash Flow Statement: $${amount} outflow recorded in Cash from Financing.`,
        `Income Statement: No impact — principal repayment is not an expense.`,
      ];

    case "increase_inventory":
      return [
        `Purchase $${amount} of inventory with cash.`,
        `Balance Sheet: Cash decreases by $${amount}, Inventory increases by $${amount}. Total assets unchanged.`,
        `Cash Flow Statement: Working capital change — inventory increase is a use of cash in CFO.`,
        `Income Statement: No impact — inventory is an asset, not an expense until sold.`,
      ];

    case "increase_ar":
      return [
        `Accounts Receivable increases by $${amount}.`,
        `Balance Sheet: AR increases by $${amount}. This is an asset increase with no offsetting cash.`,
        `Cash Flow Statement: AR increase is a use of cash (working capital) in CFO.`,
        `Income Statement: No direct impact from the AR change alone.`,
      ];

    case "revenue_credit":
      return [
        `Earn $${amount} of revenue on credit.`,
        `Income Statement: Revenue increases by $${amount}. Taxes increase by $${(amount * taxRate).toFixed(2)}. Net income increases by $${afterTax.toFixed(2)}.`,
        `Balance Sheet: AR increases by $${amount}. Retained earnings increase by $${afterTax.toFixed(2)}.`,
        `Cash Flow Statement: Net income up $${afterTax.toFixed(2)} in CFO, offset by AR increase of $${amount}. Net cash impact from operations is negative $${(amount * taxRate).toFixed(2)} (taxes owed).`,
      ];

    case "revenue_cash":
      return [
        `Earn $${amount} of revenue collected in cash.`,
        `Income Statement: Revenue increases by $${amount}. Taxes increase by $${(amount * taxRate).toFixed(2)}. Net income increases by $${afterTax.toFixed(2)}.`,
        `Balance Sheet: Cash increases by $${afterTax.toFixed(2)}. Retained earnings increase by $${afterTax.toFixed(2)}.`,
        `Cash Flow Statement: Net income up $${afterTax.toFixed(2)} flows directly through CFO.`,
      ];

    case "accrued_expense":
      return [
        `Accrue $${amount} of expense (not yet paid in cash).`,
        `Income Statement: SG&A increases by $${amount}. Tax saving of $${(amount * taxRate).toFixed(2)}. Net income decreases by $${afterTax.toFixed(2)}.`,
        `Balance Sheet: Accrued expenses (liability) increase by $${amount}. Retained earnings decrease by $${afterTax.toFixed(2)}.`,
        `Cash Flow Statement: Net income decreases by $${afterTax.toFixed(2)}, but accrued expense increase of $${amount} is added back in working capital. Net CFO impact is positive $${(amount * taxRate).toFixed(2)}.`,
      ];

    case "prepaid_expense":
      return [
        `Prepay $${amount} of expense in cash.`,
        `Balance Sheet: Cash decreases by $${amount}, Prepaid Expenses increase by $${amount}. Total assets unchanged.`,
        `Cash Flow Statement: Prepaid increase is a use of cash (working capital change) in CFO.`,
        `Income Statement: No impact — expense is not yet recognized until the period it covers.`,
      ];

    case "write_down": {
      const halfAmount = amount / 2;
      return [
        `Write down $${amount} of intangible assets (split equally between goodwill and other intangibles).`,
        `Income Statement: Impairment charge of $${amount} recorded in SG&A. Tax benefit of $${(amount * taxRate).toFixed(2)}. Net income decreases by $${afterTax.toFixed(2)}.`,
        `Balance Sheet: Goodwill decreases by $${halfAmount}, Intangibles decrease by $${halfAmount}. Retained earnings decrease by $${afterTax.toFixed(2)}.`,
        `Cash Flow Statement: Non-cash charge — impairment of $${amount} is added back in CFO. No cash impact.`,
      ];
    }

    default:
      return [`Event "${eventType}" processed with amount $${amount}.`];
  }
}

function generateMentalModel(eventType: EventType, assumptions: EventAssumptions): string[] {
  const { amount, taxRate } = assumptions;

  switch (eventType) {
    case "buy_ppe_cash":
      return [
        "Think of it as swapping one asset for another — cash leaves, a fixed asset arrives.",
        "Key insight: CapEx is NOT an expense. It's an investment that gets expensed over time via depreciation.",
        "The Income Statement is completely unaffected.",
      ];

    case "buy_ppe_debt":
      return [
        "Both sides of the balance sheet grow — assets (PP&E) and liabilities (debt) increase equally.",
        "No cash changes hands, but the CFS shows the CapEx and debt issuance as offsetting items.",
        "This is why you can't just look at CapEx to understand cash usage — check the financing too.",
      ];

    case "depreciation":
      return [
        "Depreciation is the classic non-cash charge. It reduces net income but cash never leaves the building.",
        "On the CFS, it gets added back because we start with net income (which already subtracted it).",
        "The tax shield is real cash savings: the government gives you a break for asset wear and tear.",
      ];

    case "issue_equity":
      return [
        "Selling stock is like inviting new partners — cash comes in, ownership stake goes up.",
        "It flows through CFF, not CFO. Revenue is earned; equity is raised.",
        "No income statement impact — issuing stock is not the same as earning revenue.",
      ];

    case "pay_down_debt":
      return [
        "Paying off debt shrinks both sides of the balance sheet equally.",
        "Principal repayment is NOT an expense — only interest is. That's why it's in CFF, not CFO.",
        "Many beginners confuse debt repayment with interest expense. They're fundamentally different.",
      ];

    case "increase_inventory":
      return [
        "Buying inventory swaps cash for another current asset. Total assets don't change.",
        "Inventory isn't an expense until it's sold (then it becomes COGS).",
        "The cash outflow shows up in working capital changes in CFO, not in CFI.",
      ];

    case "increase_ar":
      return [
        "AR going up means you're owed more money — you made sales but haven't collected cash yet.",
        "An increase in AR is a USE of cash in working capital. Think: asset goes up = cash goes down.",
        "Working capital rule: current asset increases are cash outflows, current liability increases are cash inflows.",
      ];

    case "revenue_credit":
      return [
        `Revenue of $${amount} flows through the IS, but since it's on credit, no cash is collected.`,
        "AR increases on the BS, and retained earnings increase by the after-tax amount.",
        "On the CFS: net income goes up (good), but AR increase offsets it (no cash came in).",
        "Net cash effect: you actually lose cash because you owe taxes on revenue you haven't collected!",
      ];

    case "revenue_cash":
      return [
        `Revenue of $${amount} flows through IS and cash actually comes in.`,
        "This is the simplest revenue scenario: earn it, collect it, pay tax on it.",
        `Cash increases by the after-tax amount: $${(amount * (1 - taxRate)).toFixed(2)}.`,
      ];

    case "accrued_expense":
      return [
        "You recognized an expense but haven't paid cash yet — the opposite of a prepaid.",
        "The liability (accrued expenses) increases, which is a SOURCE of cash in working capital.",
        "Net cash effect: the expense hurts net income, but the accrual adds back in working capital, netting to a small positive (tax benefit).",
      ];

    case "prepaid_expense":
      return [
        "You paid cash now for a future expense — like paying rent 3 months ahead.",
        "Cash goes down, but a prepaid asset goes up. Total assets unchanged.",
        "No IS impact yet. The expense hits the IS later when the prepaid is 'used up.'",
      ];

    case "write_down":
      return [
        "An impairment is admitting an asset is worth less than what's on the books.",
        "It's a non-cash charge: no cash leaves, but the asset value drops and so does net income.",
        "On the CFS, it's added back (like depreciation) because it's non-cash.",
        "The tax benefit is real: lower pre-tax income means lower taxes (actual cash savings).",
      ];

    default:
      return [];
  }
}

export function processEvent(
  model: FinancialModel,
  eventType: EventType,
  assumptions: EventAssumptions
): EventResult {
  const before = deepClone(model);
  const after = deepClone(model);

  applyEvent(after, eventType, assumptions);

  const { incomeStatementDeltas, balanceSheetDeltas, cashFlowDeltas } = computeDeltas(before, after);

  return {
    before,
    after,
    incomeStatementDeltas,
    balanceSheetDeltas,
    cashFlowDeltas,
    explanation: generateExplanation(eventType, assumptions),
    mentalModel: generateMentalModel(eventType, assumptions),
    isBalanced: validateBalance(after),
  };
}
