import { Question } from "@/types/question";

export const lboQuestions: Question[] = [
  {
    id: "lbo-1",
    section: "LBO",
    difficulty: "Beginner",
    type: "mcq",
    question: "What is a leveraged buyout (LBO)?",
    choices: [
      "A transaction where a company is acquired using primarily equity financing",
      "A transaction where a company is acquired using a significant amount of debt to fund the purchase price",
      "A public offering of shares to raise capital for an acquisition",
      "A government-funded acquisition of a distressed company"
    ],
    correctAnswer: "A transaction where a company is acquired using a significant amount of debt to fund the purchase price",
    explanation: "An LBO is the acquisition of a company using a significant amount of borrowed money (typically 50-70% of the purchase price) to meet the cost of acquisition. The assets of the acquired company often serve as collateral for the debt, and the company's cash flows are used to service and repay the debt over time."
  },
  {
    id: "lbo-2",
    section: "LBO",
    difficulty: "Beginner",
    type: "mcq",
    question: "Which of the following is the most important characteristic of a strong LBO candidate?",
    choices: [
      "High revenue growth rate",
      "Large market capitalization",
      "Stable and predictable free cash flows",
      "Significant research and development spending"
    ],
    correctAnswer: "Stable and predictable free cash flows",
    explanation: "The most critical characteristic of an LBO candidate is stable, predictable free cash flows because the company must be able to service its significant debt load. Other desirable traits include strong market position, low capex requirements, opportunities for operational improvement, and a solid asset base for collateral."
  },
  {
    id: "lbo-3",
    section: "LBO",
    difficulty: "Beginner",
    type: "mcq",
    question: "In an LBO sources and uses table, which of the following would be a 'use' of funds?",
    choices: [
      "Revolving credit facility",
      "Sponsor equity contribution",
      "Purchase of target equity",
      "Senior secured term loan"
    ],
    correctAnswer: "Purchase of target equity",
    explanation: "Uses of funds include: purchase of target equity, refinancing of existing debt, transaction fees, and financing fees. Sources of funds include: senior debt (term loans, revolving credit), subordinated debt, mezzanine financing, and sponsor equity. Sources must always equal uses."
  },
  {
    id: "lbo-4",
    section: "LBO",
    difficulty: "Beginner",
    type: "mcq",
    question: "What is the typical priority of debt repayment in an LBO capital structure (from first to last)?",
    choices: [
      "Mezzanine → Senior Secured → Senior Unsecured → Equity",
      "Senior Secured → Senior Unsecured → Mezzanine/Subordinated → Equity",
      "Equity → Mezzanine → Senior Unsecured → Senior Secured",
      "All debt tranches are repaid equally (pari passu)"
    ],
    correctAnswer: "Senior Secured → Senior Unsecured → Mezzanine/Subordinated → Equity",
    explanation: "In a bankruptcy or liquidation, the order of repayment follows the capital structure waterfall: senior secured debt is repaid first (backed by collateral), followed by senior unsecured, then mezzanine/subordinated debt, and finally equity holders. Higher priority comes with lower risk and therefore lower interest rates."
  },
  {
    id: "lbo-5",
    section: "LBO",
    difficulty: "Beginner",
    type: "mcq",
    question: "Which metric measures the total return on invested capital in an LBO, expressed as a multiple?",
    choices: [
      "Internal Rate of Return (IRR)",
      "Multiple of Invested Capital (MOIC)",
      "Debt-to-EBITDA ratio",
      "Free Cash Flow Yield"
    ],
    correctAnswer: "Multiple of Invested Capital (MOIC)",
    explanation: "MOIC (Multiple of Invested Capital) measures how many times the PE sponsor gets back its original equity investment. For example, a 3.0x MOIC means the sponsor received 3 times its initial equity check. IRR measures the annualized rate of return, which accounts for the time value of money. Both are important, but MOIC specifically measures the cash-on-cash multiple."
  },
  {
    id: "lbo-6",
    section: "LBO",
    difficulty: "Beginner",
    type: "mcq",
    question: "What are the three primary ways a PE sponsor generates returns in an LBO?",
    choices: [
      "Revenue growth, cost cutting, and share buybacks",
      "EBITDA growth, multiple expansion, and debt paydown",
      "Dividend recaps, IPOs, and mergers",
      "Interest income, capital gains, and management fees"
    ],
    correctAnswer: "EBITDA growth, multiple expansion, and debt paydown",
    explanation: "PE sponsors create value through three levers: (1) EBITDA growth — improving the company's operations to grow earnings; (2) Multiple expansion — selling at a higher EV/EBITDA multiple than the purchase multiple; and (3) Debt paydown — using the company's free cash flows to pay down debt, increasing the equity value at exit."
  },
  {
    id: "lbo-7",
    section: "LBO",
    difficulty: "Beginner",
    type: "mcq",
    question: "Which of the following is NOT a common exit strategy for a PE sponsor in an LBO?",
    choices: [
      "Sale to a strategic buyer",
      "Secondary buyout (sale to another PE firm)",
      "Initial Public Offering (IPO)",
      "Filing for Chapter 11 bankruptcy"
    ],
    correctAnswer: "Filing for Chapter 11 bankruptcy",
    explanation: "Common LBO exit strategies include: sale to a strategic buyer (most common), secondary buyout (sale to another PE firm), IPO, and dividend recapitalization (partial exit). Bankruptcy is not an exit strategy — it represents a failure of the investment where debt obligations cannot be met."
  },
  {
    id: "lbo-8",
    section: "LBO",
    difficulty: "Beginner",
    type: "mcq",
    question: "What is a cash sweep (excess cash flow sweep) in an LBO?",
    choices: [
      "The sponsor withdrawing all cash from the company after acquisition",
      "A mandatory prepayment of debt using a percentage of the company's excess free cash flow",
      "A tax optimization strategy to minimize cash taxes",
      "A provision that prevents the company from holding any cash on its balance sheet"
    ],
    correctAnswer: "A mandatory prepayment of debt using a percentage of the company's excess free cash flow",
    explanation: "A cash sweep requires the company to use a specified percentage (often 50-75%) of its excess free cash flow to prepay outstanding debt. This accelerates debt paydown, reduces interest expense, and is typically required by senior lenders. The sweep percentage may step down as leverage decreases."
  },
  {
    id: "lbo-9",
    section: "LBO",
    difficulty: "Advanced",
    type: "mcq",
    question: "A PE sponsor is evaluating an LBO where the target has a Debt/EBITDA ratio of 6.0x at entry. Which debt tranche structure is most typical?",
    choices: [
      "6.0x all in a single senior secured term loan",
      "4.0x senior secured, 2.0x senior unsecured or mezzanine",
      "3.0x senior secured, 3.0x equity bridge loan",
      "1.0x revolving credit facility, 5.0x subordinated notes"
    ],
    correctAnswer: "4.0x senior secured, 2.0x senior unsecured or mezzanine",
    explanation: "A typical 6.0x leverage structure would split the debt into senior secured (around 4.0x, with lower interest rates and priority claim on assets) and junior debt like senior unsecured notes or mezzanine (around 2.0x, with higher interest rates to compensate for subordination). The revolver is typically undrawn at close and reserved for working capital needs."
  },
  {
    id: "lbo-10",
    section: "LBO",
    difficulty: "Advanced",
    type: "mcq",
    question: "What is a dividend recapitalization in the context of an LBO?",
    choices: [
      "The company issues new equity to pay a special dividend to all shareholders",
      "The company raises additional debt to fund a special dividend to the PE sponsor",
      "The PE sponsor reinvests its dividend income back into the company",
      "The company converts its preferred stock dividends into common equity"
    ],
    correctAnswer: "The company raises additional debt to fund a special dividend to the PE sponsor",
    explanation: "A dividend recapitalization involves the portfolio company raising new debt to pay a special dividend to the PE sponsor. This allows the sponsor to extract cash returns without selling the company, effectively reducing the sponsor's net equity at risk and boosting IRR. It increases the company's leverage and is typically done when credit markets are favorable."
  },
  {
    id: "lbo-11",
    section: "LBO",
    difficulty: "Advanced",
    type: "mcq",
    question: "In an LBO model, which of the following actions would most improve the IRR while keeping MOIC constant?",
    choices: [
      "Increasing the hold period from 5 years to 7 years",
      "Decreasing the hold period from 5 years to 3 years",
      "Increasing the entry multiple",
      "Reducing EBITDA growth"
    ],
    correctAnswer: "Decreasing the hold period from 5 years to 3 years",
    explanation: "IRR is an annualized return metric that accounts for the time value of money. If MOIC stays the same (say 2.5x), achieving that return in 3 years yields a much higher IRR (~36%) than in 5 years (~20%). This is why PE sponsors care about both metrics — a high MOIC with a long hold period can result in a mediocre IRR."
  },
  {
    id: "lbo-12",
    section: "LBO",
    difficulty: "Advanced",
    type: "mcq",
    question: "What is management rollover in an LBO?",
    choices: [
      "Replacing the entire management team after the acquisition closes",
      "Existing management reinvesting a portion of their equity proceeds into the new entity alongside the PE sponsor",
      "Management receiving a guaranteed employment contract for the duration of the hold period",
      "A strategy where management buys back the company from the PE sponsor"
    ],
    correctAnswer: "Existing management reinvesting a portion of their equity proceeds into the new entity alongside the PE sponsor",
    explanation: "Management rollover occurs when the target's management team reinvests a portion of their equity proceeds back into the post-LBO company alongside the PE sponsor. This aligns management's incentives with the sponsor's and reduces the amount of equity the sponsor needs to contribute. Typical rollover ranges from 20-50% of management's equity."
  },
  {
    id: "lbo-13",
    section: "LBO",
    difficulty: "Advanced",
    type: "mcq",
    question: "An interest coverage ratio below 1.0x in an LBO indicates:",
    choices: [
      "The company has more cash than debt",
      "The company's EBITDA is insufficient to cover its interest expense",
      "The company is generating positive free cash flow",
      "The debt-to-equity ratio is above the covenant threshold"
    ],
    correctAnswer: "The company's EBITDA is insufficient to cover its interest expense",
    explanation: "The interest coverage ratio (EBITDA / Interest Expense) measures a company's ability to service its debt. A ratio below 1.0x means the company's EBITDA is not enough to cover interest payments, signaling significant financial distress. Most lenders require minimum coverage of 2.0-3.0x as a debt covenant."
  },
  {
    id: "lbo-14",
    section: "LBO",
    difficulty: "Advanced",
    type: "numeric",
    question: "A PE firm invests $400M in equity for an LBO and exits after 5 years, receiving $1,200M. What is the MOIC (round to one decimal place)?",
    correctAnswer: "3.0",
    explanation: "MOIC = Exit Equity Value / Initial Equity Investment = $1,200M / $400M = 3.0x. This means the PE firm received 3 times its original equity investment back over the 5-year holding period."
  },
  {
    id: "lbo-15",
    section: "LBO",
    difficulty: "Advanced",
    type: "numeric",
    question: "An LBO target has EBITDA of $100M and an enterprise value of $1,000M at entry. Total debt at entry is 5.0x EBITDA. Transaction and financing fees total $50M. How much sponsor equity is required (in $M)?",
    correctAnswer: "550",
    explanation: "Total debt = 5.0x × $100M EBITDA = $500M. Total uses = $1,000M (enterprise value) + $50M (fees) = $1,050M. Total sources = $500M (debt) + Sponsor Equity. Sponsor equity = $1,050M - $500M = $550M."
  },
  {
    id: "lbo-16",
    section: "LBO",
    difficulty: "Advanced",
    type: "numeric",
    question: "An LBO target has $200M EBITDA, $80M in interest expense, and $25M in mandatory debt amortization. What is the fixed charge coverage ratio (EBITDA / (Interest + Mandatory Amortization))? Round to one decimal place.",
    correctAnswer: "1.9",
    explanation: "Fixed Charge Coverage Ratio = EBITDA / (Interest Expense + Mandatory Debt Amortization) = $200M / ($80M + $25M) = $200M / $105M = 1.9x. This metric is more conservative than interest coverage alone because it also accounts for required principal repayments."
  },
  {
    id: "lbo-17",
    section: "LBO",
    difficulty: "Elite",
    type: "mcq",
    question: "A PE sponsor is considering two financing structures for the same LBO: Structure A uses 60% debt at 6% average cost, and Structure B uses 40% debt at 5% average cost. Assuming the same entry EV, EBITDA growth, and exit multiple, which structure likely produces a higher IRR and why?",
    choices: [
      "Structure A, because more leverage amplifies equity returns",
      "Structure B, because lower debt reduces risk and interest expense",
      "Both produce the same IRR because the entry EV and exit multiple are identical",
      "Cannot be determined without knowing the hold period"
    ],
    correctAnswer: "Structure A, because more leverage amplifies equity returns",
    explanation: "Higher leverage amplifies equity returns in an LBO because the sponsor puts up less equity and benefits from the same enterprise value growth. With 60% debt, the sponsor contributes only 40% equity; if the EV increases, a larger proportion of that gain accrues to a smaller equity base, boosting both MOIC and IRR. However, higher leverage also increases risk — if the business underperforms, the sponsor faces greater downside."
  },
  {
    id: "lbo-18",
    section: "LBO",
    difficulty: "Elite",
    type: "numeric",
    question: "A PE firm acquires a company at 8.0x EBITDA ($100M EBITDA) with 60% debt. Over 5 years, EBITDA grows to $140M, all debt is repaid, and the firm exits at 9.0x EBITDA. What is the MOIC on the sponsor's equity (round to one decimal place)?",
    correctAnswer: "3.9",
    explanation: "Entry EV = 8.0x × $100M = $800M. Debt = 60% × $800M = $480M. Sponsor equity = $800M - $480M = $320M. Exit EV = 9.0x × $140M = $1,260M. Exit debt = $0 (all repaid). Exit equity = $1,260M - $0 = $1,260M. MOIC = $1,260M / $320M = 3.9x. Returns were driven by all three levers: EBITDA growth (40%), multiple expansion (8.0x to 9.0x), and debt paydown ($480M)."
  },
  {
    id: "lbo-19",
    section: "LBO",
    difficulty: "Elite",
    type: "mcq",
    question: "In an LBO, a PIK (Payment-in-Kind) toggle note allows the borrower to:",
    choices: [
      "Convert debt to equity at the borrower's option",
      "Pay interest in the form of additional debt instead of cash during certain periods",
      "Defer all principal payments until maturity without penalty",
      "Swap the interest rate from fixed to floating at any time"
    ],
    correctAnswer: "Pay interest in the form of additional debt instead of cash during certain periods",
    explanation: "PIK toggle notes give the borrower the option to pay interest in cash or 'in kind' by adding the interest to the principal balance. This preserves cash flow during periods of financial stress or heavy investment, but increases the total debt burden over time. PIK interest rates are typically 200-300bps higher than cash-pay rates to compensate lenders for the deferred cash."
  },
  {
    id: "lbo-20",
    section: "LBO",
    difficulty: "Elite",
    type: "numeric",
    question: "A PE firm acquires a company for $500M with $300M in debt and $200M in equity. After 4 years, the firm exits at an enterprise value of $700M with $150M of remaining debt. What is the approximate IRR on the sponsor's equity (round to the nearest whole number)?",
    correctAnswer: "29",
    explanation: "Entry equity = $200M. Exit equity = $700M - $150M = $550M. MOIC = $550M / $200M = 2.75x over 4 years. IRR = (MOIC)^(1/n) - 1 = (2.75)^(1/4) - 1 = (2.75)^0.25 - 1 ≈ 1.288 - 1 = 0.288, or approximately 29%. The three return drivers here are EBITDA growth ($700M exit EV vs $500M entry EV), and debt paydown ($300M to $150M), which together grew the equity from $200M to $550M."
  }
];
