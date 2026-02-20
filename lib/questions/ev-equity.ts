import { Question } from "@/types/question";

export const evEquityQuestions: Question[] = [
  {
    id: "ev-1",
    section: "EV vs Equity Value",
    difficulty: "Beginner",
    type: "mcq",
    question: "What is the basic formula for Enterprise Value starting from equity value?",
    choices: [
      "Equity Value + Net Debt + Preferred Stock + Minority Interest",
      "Equity Value − Net Debt − Preferred Stock − Minority Interest",
      "Equity Value + Total Debt − Cash − Preferred Stock",
      "Equity Value + Cash − Total Debt + Minority Interest"
    ],
    correctAnswer: "Equity Value + Net Debt + Preferred Stock + Minority Interest",
    explanation: "Enterprise Value = Equity Value + Net Debt + Preferred Stock + Minority Interest. The bridge from equity value to enterprise value adds claims from all non-equity capital providers (debt holders, preferred shareholders) and minority interest, then removes excess cash. Net Debt = Total Debt − Cash & Cash Equivalents."
  },
  {
    id: "ev-2",
    section: "EV vs Equity Value",
    difficulty: "Beginner",
    type: "mcq",
    question: "A company has a share price of $45, 200 million diluted shares outstanding, $1.5B in total debt, and $400M in cash. What is its enterprise value?",
    choices: [
      "$9.0B",
      "$10.1B",
      "$7.9B",
      "$11.5B"
    ],
    correctAnswer: "$10.1B",
    explanation: "Equity Value = $45 × 200M = $9,000M = $9.0B. Enterprise Value = Equity Value + Total Debt − Cash = $9.0B + $1.5B − $0.4B = $10.1B. This assumes no preferred stock or minority interest for simplicity."
  },
  {
    id: "ev-3",
    section: "EV vs Equity Value",
    difficulty: "Beginner",
    type: "mcq",
    question: "Why do we subtract cash when calculating enterprise value from equity value?",
    choices: [
      "Cash is a liability that reduces the company's value",
      "Cash is a non-operating asset that could theoretically be used to immediately pay down debt, reducing the net acquisition cost",
      "Cash is excluded because it belongs to preferred shareholders",
      "Cash is subtracted to avoid double-counting with net income"
    ],
    correctAnswer: "Cash is a non-operating asset that could theoretically be used to immediately pay down debt, reducing the net acquisition cost",
    explanation: "When an acquirer purchases a company, it effectively gets the company's cash. That cash can immediately be used to pay down debt, so the net cost of the acquisition is reduced. Enterprise value represents the total cost to acquire the operating business, so we subtract cash (a non-operating asset) to arrive at the true cost of the core operations."
  },
  {
    id: "ev-4",
    section: "EV vs Equity Value",
    difficulty: "Beginner",
    type: "mcq",
    question: "Which of the following is an enterprise value (EV-based) multiple?",
    choices: [
      "Price / Earnings (P/E)",
      "Price / Book Value (P/BV)",
      "EV / EBITDA",
      "Dividend Yield"
    ],
    correctAnswer: "EV / EBITDA",
    explanation: "EV / EBITDA is an enterprise value multiple because EBITDA is a pre-interest, pre-tax metric available to all capital providers. P/E and P/BV are equity value multiples because earnings and book value accrue only to equity holders. The key rule: enterprise value metrics pair with enterprise value, equity metrics pair with equity value."
  },
  {
    id: "ev-5",
    section: "EV vs Equity Value",
    difficulty: "Beginner",
    type: "mcq",
    question: "Why is minority interest added when calculating enterprise value?",
    choices: [
      "Because minority interest is a form of debt financing",
      "Because minority interest represents outside ownership in consolidated subsidiaries whose financials are 100% included in the company's revenue and EBITDA",
      "Because minority interest reduces the parent company's tax liability",
      "Because minority interest is a non-operating asset that must be removed"
    ],
    correctAnswer: "Because minority interest represents outside ownership in consolidated subsidiaries whose financials are 100% included in the company's revenue and EBITDA",
    explanation: "When a parent consolidates a subsidiary it doesn't fully own, 100% of the subsidiary's revenue, EBITDA, etc. flow into the parent's financials. Minority interest represents the portion of that subsidiary owned by outside shareholders. To maintain consistency between the numerator (EV) and denominator (100% of EBITDA), we add minority interest to enterprise value."
  },
  {
    id: "ev-6",
    section: "EV vs Equity Value",
    difficulty: "Beginner",
    type: "mcq",
    question: "What is the difference between equity value and enterprise value in terms of what each represents?",
    choices: [
      "Equity value is the book value; enterprise value is the market value",
      "Equity value represents the value to common shareholders only; enterprise value represents the value of the entire operating business to all capital providers",
      "Equity value includes debt; enterprise value excludes debt",
      "There is no meaningful difference; they are interchangeable terms"
    ],
    correctAnswer: "Equity value represents the value to common shareholders only; enterprise value represents the value of the entire operating business to all capital providers",
    explanation: "Equity value (market capitalization for public companies) is the residual value belonging to common shareholders after all other claims. Enterprise value represents the total value of the core operating business available to all investors — equity holders, debt holders, preferred shareholders, and minority interest holders. EV is capital-structure-neutral; equity value is not."
  },
  {
    id: "ev-7",
    section: "EV vs Equity Value",
    difficulty: "Beginner",
    type: "mcq",
    question: "Net debt is calculated as:",
    choices: [
      "Total Debt + Cash and Cash Equivalents",
      "Total Debt − Cash and Cash Equivalents",
      "Long-Term Debt − Short-Term Debt",
      "Total Liabilities − Total Assets"
    ],
    correctAnswer: "Total Debt − Cash and Cash Equivalents",
    explanation: "Net Debt = Total Debt (short-term + long-term borrowings, including current portion of long-term debt and capital leases) − Cash and Cash Equivalents. A company with negative net debt (more cash than debt) is said to have a 'net cash' position, which reduces enterprise value below equity value."
  },
  {
    id: "ev-8",
    section: "EV vs Equity Value",
    difficulty: "Beginner",
    type: "mcq",
    question: "If a company's EV is $5.0B and its equity value is $6.0B, what can you conclude?",
    choices: [
      "The company has more debt than cash",
      "The company has a net cash position (more cash than debt)",
      "The company has significant minority interest",
      "The valuation analysis contains an error"
    ],
    correctAnswer: "The company has a net cash position (more cash than debt)",
    explanation: "If EV < Equity Value, the company's cash exceeds its total debt plus preferred stock plus minority interest. Since EV = Equity Value + Debt − Cash + Preferred + Minority Interest, for EV to be less than equity value, cash must exceed the sum of debt, preferred, and minority interest. This is common for cash-rich technology companies with little or no debt."
  },
  {
    id: "ev-9",
    section: "EV vs Equity Value",
    difficulty: "Advanced",
    type: "mcq",
    question: "How should you treat operating leases in the enterprise value bridge under current accounting standards (ASC 842 / IFRS 16)?",
    choices: [
      "Operating leases are never included in enterprise value",
      "Operating lease liabilities are already on the balance sheet as debt-like obligations and should be included in the EV bridge for consistency with EBITDA that excludes lease expense",
      "Only capital leases are included; operating leases are always excluded",
      "Operating leases are subtracted from enterprise value like cash"
    ],
    correctAnswer: "Operating lease liabilities are already on the balance sheet as debt-like obligations and should be included in the EV bridge for consistency with EBITDA that excludes lease expense",
    explanation: "Under ASC 842 / IFRS 16, operating leases are capitalized on the balance sheet as right-of-use assets and lease liabilities. If you are using EBITDA that adds back lease-related depreciation/amortization (i.e., EBITDA excludes lease costs), you must add operating lease liabilities to EV for numerator/denominator consistency. If EBITDA already deducts lease expense (EBITDA pre-842), you would not add them."
  },
  {
    id: "ev-10",
    section: "EV vs Equity Value",
    difficulty: "Advanced",
    type: "mcq",
    question: "A company has $800M in unfunded pension obligations. How should this be treated in the EV bridge?",
    choices: [
      "It should be subtracted from enterprise value like cash",
      "It should be added to enterprise value as a debt-like obligation",
      "It should be ignored because it is an operating item",
      "It should replace minority interest in the EV formula"
    ],
    correctAnswer: "It should be added to enterprise value as a debt-like obligation",
    explanation: "Unfunded pension obligations represent a liability that the company owes to employees, similar to debt. An acquirer would need to fund this obligation, so it increases the effective cost of acquiring the business. It is added to enterprise value alongside debt, preferred stock, and minority interest. This is especially important for legacy industrial companies with large defined benefit pension plans."
  },
  {
    id: "ev-11",
    section: "EV vs Equity Value",
    difficulty: "Advanced",
    type: "mcq",
    question: "A company owns a 30% stake in a non-consolidated joint venture valued at $600M. How does this affect the EV bridge?",
    choices: [
      "Add $600M to enterprise value",
      "Subtract $600M from enterprise value as a non-operating asset (equity investment)",
      "Ignore it because it is not consolidated",
      "Add $180M (30% × $600M) to minority interest"
    ],
    correctAnswer: "Subtract $600M from enterprise value as a non-operating asset (equity investment)",
    explanation: "Equity investments (non-consolidated stakes, typically 20–50% ownership accounted for under the equity method) are non-operating assets. Their income is not included in operating income or EBITDA, so for numerator/denominator consistency, the value of the investment should be subtracted from EV (or equivalently, added to the 'cash-like' side of the bridge). The acquirer could sell this stake to offset the acquisition price."
  },
  {
    id: "ev-12",
    section: "EV vs Equity Value",
    difficulty: "Advanced",
    type: "mcq",
    question: "Why is it incorrect to use EV / Net Income as a valuation multiple?",
    choices: [
      "Because net income is too volatile to be a useful metric",
      "Because net income is an equity-level metric (after interest and taxes) while EV is a total-firm metric, creating a mismatch",
      "Because net income includes depreciation which distorts the ratio",
      "Because EV / Net Income produces values that are too high"
    ],
    correctAnswer: "Because net income is an equity-level metric (after interest and taxes) while EV is a total-firm metric, creating a mismatch",
    explanation: "The cardinal rule of valuation: the numerator and denominator must correspond to the same set of capital providers. Net income is after interest (a payment to debt holders) and thus accrues only to equity holders. Pairing it with EV (which includes debt) creates a mismatch. Use EV with pre-interest metrics (Revenue, EBITDA, EBIT) and equity value with post-interest metrics (Net Income, EPS, Book Value)."
  },
  {
    id: "ev-13",
    section: "EV vs Equity Value",
    difficulty: "Advanced",
    type: "numeric",
    question: "A company has 100M basic shares at $50/share, 5M in-the-money options with a $30 strike price (current share price is $50), $2B in debt, $500M in cash, $200M in preferred stock, and $100M in minority interest. Using the treasury stock method for options, what is the enterprise value in millions?",
    correctAnswer: "6900",
    explanation: "Step 1 — Treasury Stock Method for options: 5M options exercised at $30 generates $150M in proceeds. Shares repurchased at current price = $150M / $50 = 3M shares. Net new shares = 5M − 3M = 2M. Diluted shares = 100M + 2M = 102M. Step 2 — Equity Value = 102M × $50 = $5,100M. Step 3 — EV = Equity Value + Debt − Cash + Preferred + Minority Interest = $5,100M + $2,000M − $500M + $200M + $100M = $6,900M."
  },
  {
    id: "ev-14",
    section: "EV vs Equity Value",
    difficulty: "Advanced",
    type: "mcq",
    question: "How should you treat preferred stock in the enterprise value bridge?",
    choices: [
      "Preferred stock is subtracted like cash because it can be redeemed",
      "Preferred stock is added because it represents a claim senior to common equity that is not captured in market capitalization",
      "Preferred stock is included in diluted share count instead of the EV bridge",
      "Preferred stock is ignored because it is neither debt nor equity"
    ],
    correctAnswer: "Preferred stock is added because it represents a claim senior to common equity that is not captured in market capitalization",
    explanation: "Preferred stock sits between debt and common equity in the capital structure. It represents a claim on the company's assets and cash flows that is senior to common equity. Since equity value (market cap) only reflects common shares, preferred stock must be added separately in the EV bridge to account for this additional claim on the business. Preferred dividends are also typically paid before common dividends."
  },
  {
    id: "ev-15",
    section: "EV vs Equity Value",
    difficulty: "Advanced",
    type: "mcq",
    question: "A company has $300M in short-term investments and $200M in long-term marketable securities. How should these be treated in the EV bridge?",
    choices: [
      "Add both to enterprise value as operating assets",
      "Subtract both from enterprise value as cash-like non-operating assets",
      "Only subtract the short-term investments; long-term securities are operating assets",
      "Ignore both as they are immaterial"
    ],
    correctAnswer: "Subtract both from enterprise value as cash-like non-operating assets",
    explanation: "Short-term investments and long-term marketable securities are non-operating, cash-like assets. They do not contribute to the company's core operating EBITDA, so they should be subtracted from EV alongside cash for consistency. An acquirer could liquidate these to offset the purchase price. Both are treated as cash equivalents in the EV bridge."
  },
  {
    id: "ev-16",
    section: "EV vs Equity Value",
    difficulty: "Advanced",
    type: "mcq",
    question: "If two companies have identical enterprise values but Company A has $2B more debt than Company B, what can you say about their equity values?",
    choices: [
      "Company A's equity value is $2B higher",
      "Company A's equity value is $2B lower",
      "Their equity values are the same",
      "Cannot determine without knowing cash balances"
    ],
    correctAnswer: "Company A's equity value is $2B lower",
    explanation: "Since EV = Equity Value + Net Debt + Preferred + Minority Interest, and both companies have the same EV, the company with more debt must have lower equity value to compensate. If Company A has $2B more debt (all else equal), its equity value is $2B lower. Think of it as a pie: if the total pie (EV) is the same, giving more to debt holders means less is left for equity holders."
  },
  {
    id: "ev-17",
    section: "EV vs Equity Value",
    difficulty: "Elite",
    type: "mcq",
    question: "A company has $500M in convertible bonds with a conversion price of $40. The current share price is $55. There are 100M basic shares outstanding. How should you handle this in the EV bridge?",
    choices: [
      "Add $500M to debt in the EV bridge and ignore the conversion feature",
      "Treat the converts as equity by adding the converted shares to diluted shares and do not add the $500M as debt in the EV bridge",
      "Add $500M as debt and also add the converted shares to diluted share count",
      "Subtract $500M from enterprise value as the bonds will be converted"
    ],
    correctAnswer: "Treat the converts as equity by adding the converted shares to diluted shares and do not add the $500M as debt in the EV bridge",
    explanation: "Since the current share price ($55) exceeds the conversion price ($40), the convertible bonds are in-the-money and will likely be converted. Under the if-converted method, you assume conversion: add the converted shares ($500M / $40 = 12.5M shares) to the diluted share count and remove the $500M from debt. This avoids double-counting — you cannot count the convertible as both debt and as additional equity shares. The equity value rises due to more diluted shares, but debt falls by $500M."
  },
  {
    id: "ev-18",
    section: "EV vs Equity Value",
    difficulty: "Elite",
    type: "mcq",
    question: "When valuing a financial institution (bank), why is enterprise value less meaningful than equity value?",
    choices: [
      "Banks do not have debt on their balance sheets",
      "Deposits and borrowings are operating liabilities integral to a bank's business model, making the debt/cash distinction in the EV bridge inapplicable",
      "Banks do not report EBITDA, so EV-based multiples cannot be calculated",
      "Regulators prohibit the use of enterprise value for banks"
    ],
    correctAnswer: "Deposits and borrowings are operating liabilities integral to a bank's business model, making the debt/cash distinction in the EV bridge inapplicable",
    explanation: "For financial institutions, debt (deposits, borrowings, repurchase agreements) is not 'financing' in the traditional sense — it is the raw material of their business. A bank borrows to lend; debt is an operating input. The traditional EV bridge, which treats debt as a non-operating financing item, breaks down. Therefore, banks are valued using equity value metrics: P/E, P/TBV (tangible book value), and dividend discount models rather than EV-based multiples."
  },
  {
    id: "ev-19",
    section: "EV vs Equity Value",
    difficulty: "Elite",
    type: "mcq",
    question: "A target company has $1B in net operating losses (NOLs) that can offset future taxable income. How should this be treated in the EV bridge?",
    choices: [
      "Add $1B to enterprise value because NOLs increase the company's value",
      "Subtract the present value of the tax savings from NOLs as a non-operating asset to bridge from EV to equity value, or reflect it in higher DCF cash flows",
      "Ignore NOLs entirely as they have no impact on valuation",
      "Reduce the WACC to account for the tax benefit of NOLs"
    ],
    correctAnswer: "Subtract the present value of the tax savings from NOLs as a non-operating asset to bridge from EV to equity value, or reflect it in higher DCF cash flows",
    explanation: "NOLs provide future tax savings (NOL balance × tax rate, discounted to present value). They can be treated in two ways: (1) as a non-operating asset subtracted in the EV bridge (similar to excess cash), or (2) reflected directly in the DCF through reduced tax payments and higher free cash flows. You must be careful not to double-count by doing both. In practice, many bankers show the NOL benefit as a separate line item in the EV-to-equity bridge."
  },
  {
    id: "ev-20",
    section: "EV vs Equity Value",
    difficulty: "Elite",
    type: "mcq",
    question: "You notice that a comparable company's EV/EBITDA multiple looks abnormally low at 3.0x compared to peers at 10.0x–12.0x. The company has significant off-balance-sheet operating leases (pre-ASC 842 financials). What is the most likely explanation?",
    choices: [
      "The company simply has a much lower growth rate than peers",
      "The company's EBITDA is inflated because it excludes lease expense (an operating cost), while the EV does not include the lease obligations, distorting the multiple downward",
      "The company is undervalued and represents a buying opportunity",
      "The company's enterprise value is understated due to a low stock price"
    ],
    correctAnswer: "The company's EBITDA is inflated because it excludes lease expense (an operating cost), while the EV does not include the lease obligations, distorting the multiple downward",
    explanation: "Under pre-ASC 842 accounting, operating leases were off-balance-sheet. If EBITDA excludes lease expense (common for companies that capitalize leases for EBITDA calculation), EBITDA is artificially high. Meanwhile, if the EV does not include the off-balance-sheet lease obligations, EV is artificially low. Both effects compress the EV/EBITDA multiple. To make an apples-to-apples comparison, you must either (1) add operating lease liabilities to EV and use EBITDA before lease expense, or (2) subtract lease expense from EBITDA (use EBITDAR minus rent) and exclude leases from EV."
  }
];
