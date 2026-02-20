import { Question } from "@/types/question";

export const accountingQuestions: Question[] = [
  {
    id: "acc-1",
    section: "Accounting",
    difficulty: "Beginner",
    type: "mcq",
    question: "What are the three main financial statements?",
    choices: [
      "Income Statement, Balance Sheet, Cash Flow Statement",
      "Income Statement, Balance Sheet, Statement of Retained Earnings",
      "Income Statement, Cash Flow Statement, Statement of Shareholders' Equity",
      "Balance Sheet, Cash Flow Statement, Tax Return"
    ],
    correctAnswer: "Income Statement, Balance Sheet, Cash Flow Statement",
    explanation: "The three core financial statements used in finance and accounting are the Income Statement, the Balance Sheet, and the Cash Flow Statement. The Statement of Retained Earnings and Statement of Shareholders' Equity are supplementary statements."
  },
  {
    id: "acc-2",
    section: "Accounting",
    difficulty: "Beginner",
    type: "mcq",
    question: "If depreciation expense increases by $10, how does this affect the Income Statement (assuming a 40% tax rate)?",
    choices: [
      "Net Income decreases by $10",
      "Net Income decreases by $6",
      "Net Income decreases by $4",
      "Net Income increases by $6"
    ],
    correctAnswer: "Net Income decreases by $6",
    explanation: "Depreciation is a tax-deductible expense. A $10 increase in depreciation reduces pre-tax income by $10 and taxes by $4 (40% × $10), so Net Income falls by $10 × (1 − 0.40) = $6."
  },
  {
    id: "acc-3",
    section: "Accounting",
    difficulty: "Beginner",
    type: "mcq",
    question: "Where does depreciation expense appear on the Cash Flow Statement?",
    choices: [
      "Cash Flow from Investing as a cash outflow",
      "Cash Flow from Operations as an add-back to Net Income",
      "Cash Flow from Financing as a cash outflow",
      "It does not appear on the Cash Flow Statement"
    ],
    correctAnswer: "Cash Flow from Operations as an add-back to Net Income",
    explanation: "Depreciation is a non-cash expense that reduces Net Income but does not involve actual cash outflow. Under the indirect method, it is added back to Net Income in the Cash Flow from Operations section."
  },
  {
    id: "acc-4",
    section: "Accounting",
    difficulty: "Beginner",
    type: "mcq",
    question: "Which of the following best describes the Balance Sheet equation?",
    choices: [
      "Revenue − Expenses = Net Income",
      "Assets = Liabilities + Shareholders' Equity",
      "Cash Inflows − Cash Outflows = Net Cash",
      "EBITDA − CapEx = Free Cash Flow"
    ],
    correctAnswer: "Assets = Liabilities + Shareholders' Equity",
    explanation: "The fundamental Balance Sheet equation is Assets = Liabilities + Shareholders' Equity. This must always balance and represents the foundation of double-entry accounting."
  },
  {
    id: "acc-5",
    section: "Accounting",
    difficulty: "Beginner",
    type: "mcq",
    question: "A company receives $120 cash for a 12-month service contract starting today. How much revenue is recognized in the first month?",
    choices: [
      "$120",
      "$10",
      "$0",
      "$60"
    ],
    correctAnswer: "$10",
    explanation: "Under accrual accounting, revenue is recognized as it is earned. Since the service is delivered evenly over 12 months, only $10 ($120 / 12) is recognized in the first month. The remaining $110 is recorded as deferred revenue (a liability)."
  },
  {
    id: "acc-6",
    section: "Accounting",
    difficulty: "Beginner",
    type: "mcq",
    question: "What happens to the Balance Sheet when a company collects $100 of Accounts Receivable?",
    choices: [
      "Total Assets increase by $100",
      "Total Assets decrease by $100",
      "Total Assets remain unchanged",
      "Shareholders' Equity increases by $100"
    ],
    correctAnswer: "Total Assets remain unchanged",
    explanation: "Collecting Accounts Receivable converts one asset (A/R) into another asset (Cash). Cash increases by $100 and A/R decreases by $100, so total assets remain unchanged."
  },
  {
    id: "acc-7",
    section: "Accounting",
    difficulty: "Beginner",
    type: "mcq",
    question: "An increase in Accounts Receivable represents what on the Cash Flow Statement (indirect method)?",
    choices: [
      "A source of cash in Cash Flow from Operations",
      "A use of cash in Cash Flow from Operations",
      "A source of cash in Cash Flow from Investing",
      "No impact on the Cash Flow Statement"
    ],
    correctAnswer: "A use of cash in Cash Flow from Operations",
    explanation: "An increase in A/R means the company recognized revenue that it has not yet collected in cash. This overstates cash from Net Income, so it must be subtracted in the Cash Flow from Operations section."
  },
  {
    id: "acc-8",
    section: "Accounting",
    difficulty: "Beginner",
    type: "mcq",
    question: "Under FIFO inventory accounting in a period of rising prices, compared to LIFO, which of the following is true?",
    choices: [
      "COGS is higher and Net Income is lower",
      "COGS is lower and Net Income is higher",
      "COGS and Net Income are the same",
      "COGS is higher and Net Income is higher"
    ],
    correctAnswer: "COGS is lower and Net Income is higher",
    explanation: "Under FIFO, the oldest (cheaper) inventory is sold first, resulting in lower COGS and higher Net Income compared to LIFO when prices are rising. LIFO sells the newest (more expensive) inventory first."
  },
  {
    id: "acc-9",
    section: "Accounting",
    difficulty: "Beginner",
    type: "mcq",
    question: "How does issuing $50 of stock-based compensation affect the three financial statements?",
    choices: [
      "Net Income decreases by $50, no Balance Sheet impact, no Cash Flow impact",
      "Net Income decreases by $50 × (1 − tax rate), Equity changes on Balance Sheet, added back on Cash Flow Statement",
      "No impact on any statement since it is non-cash",
      "Net Income decreases by $50, Cash decreases by $50, Equity decreases by $50"
    ],
    correctAnswer: "Net Income decreases by $50 × (1 − tax rate), Equity changes on Balance Sheet, added back on Cash Flow Statement",
    explanation: "Stock-based compensation is a non-cash expense that reduces Net Income (after tax). On the Balance Sheet, Retained Earnings decreases but Additional Paid-In Capital increases. On the Cash Flow Statement, it is added back as a non-cash charge in CFO."
  },
  {
    id: "acc-10",
    section: "Accounting",
    difficulty: "Beginner",
    type: "mcq",
    question: "Which of the following is NOT included in Cash Flow from Financing?",
    choices: [
      "Issuance of debt",
      "Payment of dividends",
      "Purchase of PP&E",
      "Repurchase of common stock"
    ],
    correctAnswer: "Purchase of PP&E",
    explanation: "Purchase of PP&E is a capital expenditure and appears in Cash Flow from Investing, not Financing. CFF includes activities related to debt issuance/repayment, equity issuance/buyback, and dividend payments."
  },
  {
    id: "acc-11",
    section: "Accounting",
    difficulty: "Beginner",
    type: "mcq",
    question: "A company has Net Income of $100, Depreciation of $20, an increase in A/R of $15, and an increase in Accounts Payable of $10. What is Cash Flow from Operations?",
    choices: [
      "$115",
      "$95",
      "$105",
      "$135"
    ],
    correctAnswer: "$115",
    explanation: "CFO = Net Income + Depreciation − Increase in A/R + Increase in A/P = $100 + $20 − $15 + $10 = $115. Depreciation is added back as a non-cash charge, an increase in A/R is a use of cash, and an increase in A/P is a source of cash."
  },
  {
    id: "acc-12",
    section: "Accounting",
    difficulty: "Beginner",
    type: "numeric",
    question: "A company purchases equipment for $500,000 with a useful life of 10 years and no salvage value using straight-line depreciation. What is the annual depreciation expense in dollars?",
    correctAnswer: "50000",
    explanation: "Straight-line depreciation = (Cost − Salvage Value) / Useful Life = ($500,000 − $0) / 10 = $50,000 per year."
  },
  {
    id: "acc-13",
    section: "Accounting",
    difficulty: "Beginner",
    type: "mcq",
    question: "What is working capital?",
    choices: [
      "Total Assets minus Total Liabilities",
      "Current Assets minus Current Liabilities",
      "Cash minus Short-Term Debt",
      "Shareholders' Equity minus Long-Term Debt"
    ],
    correctAnswer: "Current Assets minus Current Liabilities",
    explanation: "Working capital is defined as Current Assets minus Current Liabilities. It measures a company's short-term liquidity and its ability to meet near-term obligations."
  },
  {
    id: "acc-14",
    section: "Accounting",
    difficulty: "Beginner",
    type: "mcq",
    question: "If a company pays $30 in cash to reduce Accounts Payable, what is the impact on working capital?",
    choices: [
      "Working capital increases by $30",
      "Working capital decreases by $30",
      "Working capital remains unchanged",
      "Working capital decreases by $60"
    ],
    correctAnswer: "Working capital remains unchanged",
    explanation: "Paying down A/P reduces Cash (a current asset) by $30 and reduces A/P (a current liability) by $30. Since both sides decrease equally, working capital (Current Assets − Current Liabilities) is unchanged."
  },
  {
    id: "acc-15",
    section: "Accounting",
    difficulty: "Beginner",
    type: "mcq",
    question: "What is goodwill?",
    choices: [
      "The difference between a company's market cap and its book value",
      "The premium paid over the fair market value of net identifiable assets in an acquisition",
      "An intangible asset representing a company's brand value on a standalone basis",
      "The cumulative retained earnings of a company over its lifetime"
    ],
    correctAnswer: "The premium paid over the fair market value of net identifiable assets in an acquisition",
    explanation: "Goodwill arises in an acquisition when the purchase price exceeds the fair market value of the target's net identifiable assets (tangible and intangible). It is recorded on the acquirer's Balance Sheet."
  },
  {
    id: "acc-16",
    section: "Accounting",
    difficulty: "Beginner",
    type: "mcq",
    question: "An accrued expense represents:",
    choices: [
      "Cash that has been paid but the expense has not yet been incurred",
      "An expense that has been incurred but not yet paid in cash",
      "Revenue that has been collected but not yet earned",
      "A prepaid asset that has been fully consumed"
    ],
    correctAnswer: "An expense that has been incurred but not yet paid in cash",
    explanation: "Accrued expenses are liabilities representing expenses that have been recognized on the Income Statement but have not yet been paid. Examples include accrued wages, interest payable, and accrued taxes."
  },
  {
    id: "acc-17",
    section: "Accounting",
    difficulty: "Beginner",
    type: "mcq",
    question: "Capital expenditures (CapEx) appear in which section of the Cash Flow Statement?",
    choices: [
      "Cash Flow from Operations",
      "Cash Flow from Investing",
      "Cash Flow from Financing",
      "They do not appear on the Cash Flow Statement"
    ],
    correctAnswer: "Cash Flow from Investing",
    explanation: "Capital expenditures represent purchases of long-term assets such as PP&E and are classified under Cash Flow from Investing activities."
  },
  {
    id: "acc-18",
    section: "Accounting",
    difficulty: "Beginner",
    type: "numeric",
    question: "A company has Revenue of $1,000, COGS of $400, SG&A of $200, and D&A of $50. What is EBITDA?",
    correctAnswer: "400",
    explanation: "EBIT = Revenue − COGS − SG&A − D&A = $1,000 − $400 − $200 − $50 = $350. EBITDA = EBIT + D&A = $350 + $50 = $400."
  },
  {
    id: "acc-19",
    section: "Accounting",
    difficulty: "Beginner",
    type: "mcq",
    question: "Which of the following increases Shareholders' Equity?",
    choices: [
      "Paying dividends",
      "Repurchasing shares",
      "Earning Net Income",
      "Issuing long-term debt"
    ],
    correctAnswer: "Earning Net Income",
    explanation: "Net Income flows into Retained Earnings, which is a component of Shareholders' Equity. Dividends and share repurchases reduce equity, and issuing debt creates a liability, not equity."
  },
  {
    id: "acc-20",
    section: "Accounting",
    difficulty: "Beginner",
    type: "mcq",
    question: "Deferred revenue is classified as a:",
    choices: [
      "Current asset",
      "Non-current asset",
      "Liability",
      "Component of Shareholders' Equity"
    ],
    correctAnswer: "Liability",
    explanation: "Deferred revenue represents cash received for goods or services not yet delivered. It is an obligation to perform in the future and is recorded as a liability on the Balance Sheet until the revenue is earned."
  },
  {
    id: "acc-21",
    section: "Accounting",
    difficulty: "Advanced",
    type: "mcq",
    question: "A company has $200 of pre-tax income and a 25% statutory tax rate but only pays $40 in cash taxes. What is the Deferred Tax Liability created this period?",
    choices: [
      "$5",
      "$10",
      "$15",
      "$20"
    ],
    correctAnswer: "$10",
    explanation: "Book tax expense = $200 × 25% = $50. Cash taxes paid = $40. The difference of $10 is recorded as a Deferred Tax Liability, representing taxes owed in the future that have been expensed on the books but not yet paid."
  },
  {
    id: "acc-22",
    section: "Accounting",
    difficulty: "Advanced",
    type: "mcq",
    question: "A company with a 40% tax rate takes a $100 write-down of inventory. What is the impact on Cash Flow from Operations?",
    choices: [
      "CFO decreases by $100",
      "CFO decreases by $60",
      "CFO increases by $40",
      "No net impact on CFO"
    ],
    correctAnswer: "No net impact on CFO",
    explanation: "The write-down reduces Net Income by $60 (after-tax: $100 × (1 − 0.40)). However, the write-down is a non-cash charge and is added back in CFO. Net Income falls by $60, but the $100 add-back and $40 tax reduction net to zero impact on CFO. More precisely: NI down $60 + add-back $100 − tax savings already reflected = net zero cash impact."
  },
  {
    id: "acc-23",
    section: "Accounting",
    difficulty: "Advanced",
    type: "mcq",
    question: "Under an operating lease (pre-ASC 842), which financial statement is most affected compared to a capital (finance) lease?",
    choices: [
      "Income Statement only — operating lease expense is higher",
      "Balance Sheet — operating leases keep the asset and liability off the Balance Sheet",
      "Cash Flow Statement only — operating leases reduce CFO more",
      "All three statements are identically affected"
    ],
    correctAnswer: "Balance Sheet — operating leases keep the asset and liability off the Balance Sheet",
    explanation: "Under legacy operating lease treatment (pre-ASC 842), leased assets and obligations are not recorded on the Balance Sheet, resulting in lower reported assets and liabilities. Capital leases capitalize the asset and record a corresponding liability."
  },
  {
    id: "acc-24",
    section: "Accounting",
    difficulty: "Advanced",
    type: "mcq",
    question: "Goodwill impairment of $50 (assume a 30% tax rate) affects the three statements how?",
    choices: [
      "Net Income down $35, Goodwill down $50, CFO up $35",
      "Net Income down $50, Goodwill down $50, no cash impact",
      "Net Income down $35, Goodwill down $50, no net cash impact from operations",
      "Net Income down $50, Goodwill down $50, CFO increases by $50"
    ],
    correctAnswer: "Net Income down $35, Goodwill down $50, no net cash impact from operations",
    explanation: "Goodwill impairment reduces pre-tax income by $50, saving $15 in taxes (30% × $50), so Net Income falls by $35. On the Balance Sheet, Goodwill decreases by $50 and Retained Earnings drops by $35. On the CFS, Net Income is down $35 but the $50 non-cash impairment is added back; the $15 difference reflects the tax impact. Net cash impact on operations is zero."
  },
  {
    id: "acc-25",
    section: "Accounting",
    difficulty: "Advanced",
    type: "numeric",
    question: "A machine costs $800,000 with a useful life of 5 years and $50,000 salvage value. Using double-declining balance depreciation, what is the depreciation expense in Year 1?",
    correctAnswer: "320000",
    explanation: "Double-declining balance rate = 2 / 5 = 40%. Year 1 depreciation = $800,000 × 40% = $320,000. Note that salvage value is not subtracted from cost in the DDB calculation until the book value approaches salvage value."
  },
  {
    id: "acc-26",
    section: "Accounting",
    difficulty: "Advanced",
    type: "mcq",
    question: "If a company's Deferred Tax Asset increases by $20 during the period, what does this imply?",
    choices: [
      "The company paid more in cash taxes than it recorded as book tax expense",
      "The company paid less in cash taxes than it recorded as book tax expense",
      "The company's effective tax rate is lower than its statutory rate",
      "The company has permanently reduced its tax liability"
    ],
    correctAnswer: "The company paid more in cash taxes than it recorded as book tax expense",
    explanation: "A Deferred Tax Asset represents future tax benefits — it increases when the company pays more in cash taxes now than what it expenses on its books. This creates a 'prepaid' tax benefit that will reverse in future periods."
  },
  {
    id: "acc-27",
    section: "Accounting",
    difficulty: "Advanced",
    type: "mcq",
    question: "A company acquires another for $500M. The target's net identifiable assets have a book value of $200M and a fair value of $350M. How much goodwill is recorded?",
    choices: [
      "$300M",
      "$150M",
      "$200M",
      "$500M"
    ],
    correctAnswer: "$150M",
    explanation: "Goodwill = Purchase Price − Fair Value of Net Identifiable Assets = $500M − $350M = $150M. The book value of the target's assets is irrelevant for goodwill calculation; what matters is the fair value of net identifiable assets."
  },
  {
    id: "acc-28",
    section: "Accounting",
    difficulty: "Advanced",
    type: "mcq",
    question: "What is the impact on the Cash Flow Statement when a company issues $100M of debt at par?",
    choices: [
      "CFO increases by $100M",
      "CFF increases by $100M, no other CFS impact",
      "CFI increases by $100M",
      "CFF increases by $100M and CFO decreases by $100M"
    ],
    correctAnswer: "CFF increases by $100M, no other CFS impact",
    explanation: "Issuing debt is a financing activity. Cash increases by $100M and the entire inflow is recorded under Cash Flow from Financing. There is no impact on CFO or CFI at the time of issuance."
  },
  {
    id: "acc-29",
    section: "Accounting",
    difficulty: "Advanced",
    type: "numeric",
    question: "A company has beginning inventory of $150, purchases of $500, and ending inventory of $200. What is Cost of Goods Sold?",
    correctAnswer: "450",
    explanation: "COGS = Beginning Inventory + Purchases − Ending Inventory = $150 + $500 − $200 = $450."
  },
  {
    id: "acc-30",
    section: "Accounting",
    difficulty: "Advanced",
    type: "mcq",
    question: "An increase in deferred revenue from one period to the next indicates:",
    choices: [
      "The company earned more revenue than it collected in cash",
      "The company collected more cash than it recognized as revenue",
      "The company's accounts receivable increased",
      "The company paid down its liabilities"
    ],
    correctAnswer: "The company collected more cash than it recognized as revenue",
    explanation: "Deferred revenue increases when a company receives cash payments before delivering goods or services. The increase means more cash was collected than revenue recognized, which is a source of cash in CFO."
  },
  {
    id: "acc-31",
    section: "Accounting",
    difficulty: "Advanced",
    type: "mcq",
    question: "A company writes off $25 of bad debt (assume a 40% tax rate). What is the net impact on Cash Flow from Operations?",
    choices: [
      "CFO decreases by $25",
      "CFO decreases by $15",
      "No net impact on CFO",
      "CFO increases by $10"
    ],
    correctAnswer: "No net impact on CFO",
    explanation: "Writing off bad debt is a non-cash expense. It reduces Net Income by $15 (after tax), but the $25 non-cash charge is added back in CFO. The $10 tax savings offsets the difference, so the net cash impact on operations is zero."
  },
  {
    id: "acc-32",
    section: "Accounting",
    difficulty: "Advanced",
    type: "mcq",
    question: "Under ASC 842, how does a finance lease differ from an operating lease on the Income Statement?",
    choices: [
      "Finance leases record a single lease expense; operating leases split into depreciation and interest",
      "Finance leases split expense into depreciation and interest; operating leases record a single straight-line lease expense",
      "Both record identical expenses on the Income Statement",
      "Finance leases record only interest expense; operating leases record only depreciation"
    ],
    correctAnswer: "Finance leases split expense into depreciation and interest; operating leases record a single straight-line lease expense",
    explanation: "Under ASC 842, finance leases record depreciation on the right-of-use asset and interest on the lease liability separately, resulting in front-loaded total expense. Operating leases record a single straight-line lease expense over the term."
  },
  {
    id: "acc-33",
    section: "Accounting",
    difficulty: "Advanced",
    type: "numeric",
    question: "A company has EBIT of $250, D&A of $80, increase in working capital of $30, CapEx of $60, and a tax rate of 25%. What is Unlevered Free Cash Flow?",
    correctAnswer: "177.5",
    explanation: "UFCF = EBIT × (1 − Tax Rate) + D&A − Increase in Working Capital − CapEx = $250 × 0.75 + $80 − $30 − $60 = $187.5 + $80 − $30 − $60 = $177.5."
  },
  {
    id: "acc-34",
    section: "Accounting",
    difficulty: "Advanced",
    type: "mcq",
    question: "If a company capitalizes a $100 expense instead of expensing it immediately (assume 5-year straight-line depreciation and a 30% tax rate), what is the Year 1 impact on Net Income compared to expensing?",
    choices: [
      "Net Income is $56 higher",
      "Net Income is $80 higher",
      "Net Income is $14 higher",
      "Net Income is the same"
    ],
    correctAnswer: "Net Income is $56 higher",
    explanation: "If expensed: Net Income impact = −$100 × (1 − 0.30) = −$70. If capitalized: Year 1 depreciation = $20, so Net Income impact = −$20 × (1 − 0.30) = −$14. Difference = $70 − $14 = $56 higher Net Income when capitalized."
  },
  {
    id: "acc-35",
    section: "Accounting",
    difficulty: "Advanced",
    type: "mcq",
    question: "A company repurchases $200M of its own shares. What is the impact across the three statements?",
    choices: [
      "No Income Statement impact, Cash and Equity both decrease by $200M, CFF decreases by $200M",
      "Net Income decreases by $200M, Cash decreases by $200M, CFO decreases by $200M",
      "No Income Statement impact, Cash decreases by $200M, CFI decreases by $200M",
      "EPS increases by $200M, Cash decreases by $200M, CFF decreases by $200M"
    ],
    correctAnswer: "No Income Statement impact, Cash and Equity both decrease by $200M, CFF decreases by $200M",
    explanation: "Share repurchases do not affect the Income Statement. On the Balance Sheet, Cash decreases by $200M and Treasury Stock (contra-equity) increases, reducing Shareholders' Equity by $200M. The cash outflow appears in Cash Flow from Financing."
  },
  {
    id: "acc-36",
    section: "Accounting",
    difficulty: "Advanced",
    type: "mcq",
    question: "What is the key difference between LIFO and FIFO on the Balance Sheet during periods of rising prices?",
    choices: [
      "LIFO results in higher inventory values on the Balance Sheet",
      "FIFO results in higher inventory values on the Balance Sheet",
      "Both methods report the same inventory values",
      "LIFO results in higher total assets than FIFO"
    ],
    correctAnswer: "FIFO results in higher inventory values on the Balance Sheet",
    explanation: "Under FIFO, the most recently purchased (higher-cost) inventory remains on the Balance Sheet, resulting in higher ending inventory values. Under LIFO, older (cheaper) inventory stays on the Balance Sheet, resulting in lower inventory values."
  },
  {
    id: "acc-37",
    section: "Accounting",
    difficulty: "Advanced",
    type: "numeric",
    question: "A company has Accounts Receivable of $80, Inventory of $120, Prepaid Expenses of $10, Accounts Payable of $60, and Accrued Liabilities of $30. What is Net Working Capital (excluding cash)?",
    correctAnswer: "120",
    explanation: "Net Working Capital (excluding cash) = (A/R + Inventory + Prepaid Expenses) − (A/P + Accrued Liabilities) = ($80 + $120 + $10) − ($60 + $30) = $210 − $90 = $120."
  },
  {
    id: "acc-38",
    section: "Accounting",
    difficulty: "Advanced",
    type: "mcq",
    question: "A company with $500 in revenue decides to prepay $60 in rent for the next 6 months. What is the immediate Balance Sheet impact?",
    choices: [
      "Total Assets decrease by $60",
      "Total Assets remain unchanged; Cash decreases and Prepaid Rent increases by $60",
      "Total Assets increase by $60 and Liabilities increase by $60",
      "Shareholders' Equity decreases by $60"
    ],
    correctAnswer: "Total Assets remain unchanged; Cash decreases and Prepaid Rent increases by $60",
    explanation: "Prepaying rent converts one current asset (Cash) into another current asset (Prepaid Rent). Total assets remain unchanged. As each month passes, Prepaid Rent is expensed, reducing assets and equity."
  },
  {
    id: "acc-39",
    section: "Accounting",
    difficulty: "Advanced",
    type: "mcq",
    question: "Why is EBITDA often used as a proxy for cash flow?",
    choices: [
      "EBITDA equals Cash Flow from Operations exactly",
      "EBITDA removes non-cash charges (D&A) and the effects of capital structure (interest) and taxes",
      "EBITDA includes all working capital adjustments",
      "EBITDA is mandated by GAAP as the official cash flow measure"
    ],
    correctAnswer: "EBITDA removes non-cash charges (D&A) and the effects of capital structure (interest) and taxes",
    explanation: "EBITDA approximates operating cash flow by excluding D&A (non-cash), interest (capital structure-dependent), and taxes (jurisdiction-dependent). However, it is not true cash flow because it ignores working capital changes, CapEx, and other items."
  },
  {
    id: "acc-40",
    section: "Accounting",
    difficulty: "Advanced",
    type: "mcq",
    question: "If PP&E on the Balance Sheet increased from $400 to $450, and depreciation expense for the period was $70, what was CapEx during the period (assuming no disposals)?",
    choices: [
      "$50",
      "$70",
      "$120",
      "$20"
    ],
    correctAnswer: "$120",
    explanation: "Ending PP&E = Beginning PP&E + CapEx − Depreciation. $450 = $400 + CapEx − $70. CapEx = $450 − $400 + $70 = $120."
  },
  {
    id: "acc-41",
    section: "Accounting",
    difficulty: "Elite",
    type: "mcq",
    question: "In purchase price allocation, why are the target's assets written up to fair value, and what is the Balance Sheet impact?",
    choices: [
      "Assets are written up to reflect the acquirer's cost basis; total assets increase and the excess over book value goes to Retained Earnings",
      "Assets are written up to fair market value; the write-up increases asset values and any excess of purchase price over fair value of net assets becomes goodwill",
      "Assets are written up to fair value; the write-up reduces goodwill and increases long-term liabilities",
      "Assets are kept at book value; only goodwill is recorded for the entire purchase price premium"
    ],
    correctAnswer: "Assets are written up to fair market value; the write-up increases asset values and any excess of purchase price over fair value of net assets becomes goodwill",
    explanation: "Under purchase accounting, the acquirer allocates the purchase price to the fair values of all identifiable tangible and intangible assets and liabilities. Any remaining excess becomes goodwill. This creates a new cost basis for the acquired assets."
  },
  {
    id: "acc-42",
    section: "Accounting",
    difficulty: "Elite",
    type: "numeric",
    question: "Company A acquires Company B for $800M. Company B has net identifiable assets with a book value of $300M. After fair value adjustments, tangible assets are written up by $100M and identifiable intangible assets of $150M are recognized. What is the goodwill recorded (in millions)?",
    correctAnswer: "250",
    explanation: "Fair Value of Net Identifiable Assets = Book Value + Write-Up of Tangible Assets + Identifiable Intangibles = $300M + $100M + $150M = $550M. Goodwill = Purchase Price − Fair Value of Net Identifiable Assets = $800M − $550M = $250M."
  },
  {
    id: "acc-43",
    section: "Accounting",
    difficulty: "Elite",
    type: "mcq",
    question: "In the context of intercompany eliminations during consolidation, what happens to intercompany revenue and expenses?",
    choices: [
      "They are reported separately as a line item on the consolidated Income Statement",
      "They are fully eliminated so consolidated statements reflect only transactions with external parties",
      "Only intercompany revenue is eliminated; intercompany expenses remain",
      "They are netted against each other and the difference is recorded as goodwill"
    ],
    correctAnswer: "They are fully eliminated so consolidated statements reflect only transactions with external parties",
    explanation: "Intercompany transactions (revenue, expenses, receivables, payables, etc.) must be fully eliminated during consolidation. The consolidated financial statements should only reflect transactions between the consolidated entity and external third parties to avoid double-counting."
  },
  {
    id: "acc-44",
    section: "Accounting",
    difficulty: "Elite",
    type: "mcq",
    question: "A subsidiary sells inventory to its parent at a $20M markup. At year-end, the parent still holds all of this inventory. During consolidation, what adjustment is required?",
    choices: [
      "Reduce consolidated revenue by $20M and reduce consolidated inventory by $20M",
      "Eliminate the intercompany sale entirely and reduce consolidated inventory by the $20M unrealized profit",
      "No adjustment is needed since the transaction already occurred",
      "Increase goodwill by $20M to reflect the intercompany profit"
    ],
    correctAnswer: "Eliminate the intercompany sale entirely and reduce consolidated inventory by the $20M unrealized profit",
    explanation: "Intercompany sales must be eliminated in consolidation. Since the inventory has not been sold to an external party, the $20M profit is unrealized. The intercompany revenue and COGS are eliminated, and inventory on the consolidated Balance Sheet is reduced by the $20M unrealized markup."
  },
  {
    id: "acc-45",
    section: "Accounting",
    difficulty: "Elite",
    type: "mcq",
    question: "A company has accelerated depreciation for tax purposes and straight-line for book purposes. In Year 1, tax depreciation is $150 and book depreciation is $100. At a 25% tax rate, what is the Deferred Tax Liability created?",
    choices: [
      "$50",
      "$37.50",
      "$12.50",
      "$25"
    ],
    correctAnswer: "$12.50",
    explanation: "The temporary difference = Tax Depreciation − Book Depreciation = $150 − $100 = $50. Since more depreciation is taken for tax purposes, taxable income is lower now, creating a future tax obligation. DTL = $50 × 25% = $12.50."
  },
  {
    id: "acc-46",
    section: "Accounting",
    difficulty: "Elite",
    type: "numeric",
    question: "An acquired company has $60M of identifiable intangible assets (customer relationships) with a 10-year useful life, assigned during purchase price allocation. Assuming straight-line amortization and a 25% tax rate, what is the annual after-tax impact on Net Income from this amortization (in millions)?",
    correctAnswer: "4.5",
    explanation: "Annual amortization = $60M / 10 = $6M. After-tax impact = $6M × (1 − 0.25) = $4.5M reduction in Net Income per year."
  },
  {
    id: "acc-47",
    section: "Accounting",
    difficulty: "Elite",
    type: "mcq",
    question: "When a company with a Deferred Tax Asset has sustained losses and the DTA is subject to a valuation allowance, what is the impact on the financial statements?",
    choices: [
      "The DTA is written off entirely and Cash Flow from Operations increases",
      "A valuation allowance reduces the net DTA on the Balance Sheet and increases tax expense on the Income Statement",
      "The DTA is reclassified to goodwill on the Balance Sheet",
      "A valuation allowance increases the DTA and decreases tax expense"
    ],
    correctAnswer: "A valuation allowance reduces the net DTA on the Balance Sheet and increases tax expense on the Income Statement",
    explanation: "When it is more likely than not that some or all of the DTA will not be realized, a valuation allowance is recorded. This reduces the net DTA on the Balance Sheet and increases income tax expense on the Income Statement, lowering Net Income. It is a non-cash charge."
  },
  {
    id: "acc-48",
    section: "Accounting",
    difficulty: "Elite",
    type: "numeric",
    question: "A company acquires a target for $1,200M, funded by 60% cash and 40% new debt. The target has $400M in assets (at fair value) and $150M in liabilities. What is the goodwill created from this acquisition (in millions)?",
    correctAnswer: "950",
    explanation: "Net Identifiable Assets at Fair Value = $400M − $150M = $250M. Goodwill = Purchase Price − Fair Value of Net Identifiable Assets = $1,200M − $250M = $950M. The funding mix does not affect the goodwill calculation."
  },
  {
    id: "acc-49",
    section: "Accounting",
    difficulty: "Elite",
    type: "mcq",
    question: "A company recognizes $30M in stock-based compensation expense in a period. The tax deduction from exercises/vesting is $45M. With a 25% tax rate, what is the excess tax benefit and where does it appear?",
    choices: [
      "$3.75M excess tax benefit; recorded in Cash Flow from Financing",
      "$3.75M excess tax benefit; recorded as a credit to APIC or through the Income Statement under ASU 2016-09",
      "$15M excess tax benefit; recorded as a reduction to operating expenses",
      "$11.25M excess tax benefit; recorded in Cash Flow from Investing"
    ],
    correctAnswer: "$3.75M excess tax benefit; recorded as a credit to APIC or through the Income Statement under ASU 2016-09",
    explanation: "Book SBC expense = $30M, so expected tax benefit = $30M × 25% = $7.5M. Actual tax deduction = $45M × 25% = $11.25M. Excess tax benefit = $11.25M − $7.5M = $3.75M. Under ASU 2016-09, this excess is recognized in the Income Statement as a discrete tax benefit rather than in APIC, though historically it went to APIC."
  },
  {
    id: "acc-50",
    section: "Accounting",
    difficulty: "Elite",
    type: "mcq",
    question: "During consolidation, a parent company has a $500M investment in a wholly-owned subsidiary on its standalone Balance Sheet. What happens to this investment account during consolidation?",
    choices: [
      "The $500M investment remains on the consolidated Balance Sheet as a long-term asset",
      "The investment is eliminated and replaced with the subsidiary's individual assets and liabilities at fair value, with any excess recorded as goodwill",
      "The investment is reclassified as goodwill on the consolidated Balance Sheet",
      "The investment is eliminated and the $500M is recorded as a reduction to consolidated Shareholders' Equity"
    ],
    correctAnswer: "The investment is eliminated and replaced with the subsidiary's individual assets and liabilities at fair value, with any excess recorded as goodwill",
    explanation: "In consolidation, the parent's investment in the subsidiary is eliminated against the subsidiary's equity. The subsidiary's individual assets and liabilities are recorded at fair value on the consolidated Balance Sheet. Any excess of the investment over the fair value of net identifiable assets is recorded as goodwill."
  }
];
