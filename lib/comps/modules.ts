import type { LearningModule } from "./types";

export const COMPS_LEARNING_MODULES: LearningModule[] = [
  {
    id: "ev-ebitda",
    title: "EV/EBITDA Multiple",
    formula: "EV = EBITDA × EV/EBITDA Multiple",
    explanation:
      "EV/EBITDA is the most common trading multiple in M&A. Enterprise Value (EV) = Market Cap + Net Debt. EBITDA is used because it's capital-structure neutral and reflects operating cash profitability. Higher-growth or higher-margin companies typically trade at higher multiples.",
    example: {
      description: "Value a company using EV/EBITDA",
      inputs: [
        { label: "Target EBITDA", value: "$150M" },
        { label: "Peer EV/EBITDA", value: "10x" },
      ],
      calculation: "EV = $150M × 10 = $1,500M",
      result: "$1,500M Enterprise Value",
    },
    commonMistakes: [
      "Using equity value instead of enterprise value",
      "Mixing LTM (last twelve months) vs NTM (next twelve months) EBITDA",
      "Comparing companies with different capital structures without adjusting",
    ],
    quiz: [
      {
        question: "EV = ___ × EV/EBITDA Multiple",
        answer: "EBITDA",
        hint: "The denominator of the multiple",
      },
      {
        question: "EV = Market Cap + ___",
        answer: "Net Debt",
        hint: "Debt minus cash",
      },
      {
        question: "EV/EBITDA is capital-structure ___ (neutral/dependent)",
        answer: "neutral",
        hint: "Ignores debt vs equity mix",
      },
    ],
  },
  {
    id: "ev-revenue",
    title: "EV/Revenue Multiple",
    formula: "EV = Revenue × EV/Revenue Multiple",
    explanation:
      "EV/Revenue is used when companies are unprofitable or have inconsistent margins (e.g., early-stage SaaS). Revenue multiples are more volatile than EBITDA multiples. Use for growth companies where profitability is not yet meaningful.",
    example: {
      description: "Value a company using EV/Revenue",
      inputs: [
        { label: "Target Revenue", value: "$500M" },
        { label: "Peer EV/Revenue", value: "4x" },
      ],
      calculation: "EV = $500M × 4 = $2,000M",
      result: "$2,000M Enterprise Value",
    },
    commonMistakes: [
      "Using EV/Revenue for mature, profitable companies (use EV/EBITDA instead)",
      "Comparing companies with vastly different revenue quality (recurring vs one-time)",
      "Ignoring gross margin differences when using revenue multiples",
    ],
    quiz: [
      {
        question: "EV/Revenue is used when companies are ___ or have inconsistent margins",
        answer: "unprofitable",
        hint: "No EBITDA yet",
      },
      {
        question: "EV = Revenue × ___",
        answer: "EV/Revenue Multiple",
        hint: "The multiple",
      },
      {
        question: "Revenue multiples are more ___ than EBITDA multiples",
        answer: "volatile",
        hint: "More sensitive to growth",
      },
    ],
  },
  {
    id: "peer-selection",
    title: "Peer Selection",
    formula: "Select peers with similar business model, growth, margins, and size",
    explanation:
      "Selecting the right comparable companies is critical. Peers should have: (1) similar business model and end markets, (2) comparable growth rates and margins, (3) similar size (market cap). Avoid including outliers that skew the range. Typically use 5-15 comps.",
    example: {
      description: "Select peers for a mid-cap SaaS company",
      inputs: [
        { label: "Target", value: "Mid-cap SaaS, 20% growth" },
        { label: "Good peers", value: "Similar size, growth, margin" },
      ],
      calculation: "Exclude: large-cap (different scale), low-growth (different profile)",
      result: "5-10 comps with similar profile",
    },
    commonMistakes: [
      "Including companies with different business models (e.g., hardware vs software)",
      "Using too few comps (less than 5) or too many (dilutes the analysis)",
      "Ignoring outliers that skew the median or mean",
    ],
    quiz: [
      {
        question: "Peers should have similar size, growth, and ___",
        answer: "margins",
        hint: "Profitability",
      },
      {
        question: "Typically use ___ to 15 comps",
        answer: "5",
        hint: "Minimum number",
      },
      {
        question: "Avoid ___ that skew the range",
        answer: "outliers",
        hint: "Extreme values",
      },
    ],
  },
  {
    id: "pe-multiple",
    title: "P/E Multiple",
    formula: "Equity Value = Net Income × P/E Multiple",
    explanation:
      "P/E (Price-to-Earnings) is an equity multiple. It values the company based on earnings available to shareholders. Use when capital structures are similar. P/E is affected by leverage — higher debt can lower P/E. EV multiples are preferred when capital structures differ.",
    example: {
      description: "Value a company using P/E",
      inputs: [
        { label: "Net Income", value: "$80M" },
        { label: "Peer P/E", value: "15x" },
      ],
      calculation: "Equity Value = $80M × 15 = $1,200M",
      result: "$1,200M Equity Value",
    },
    commonMistakes: [
      "Using P/E for companies with negative earnings",
      "Ignoring one-time items that distort earnings",
      "Comparing P/E across different capital structures without adjusting",
    ],
    quiz: [
      {
        question: "P/E = Price / ___",
        answer: "Earnings",
        hint: "Net income per share",
      },
      {
        question: "P/E is an ___ multiple (equity/enterprise)",
        answer: "equity",
        hint: "Values equity, not enterprise",
      },
      {
        question: "Higher debt typically ___ P/E (lowers/raises)",
        answer: "lowers",
        hint: "Leverage effect",
      },
    ],
  },
  {
    id: "ev-ebitda-vs-revenue",
    title: "EV/EBITDA vs EV/Revenue",
    formula: "Use EV/EBITDA when profitable; EV/Revenue when growth > profitability",
    explanation:
      "EV/EBITDA is preferred for mature, profitable companies. EV/Revenue is used when companies are unprofitable or have inconsistent margins (e.g., early-stage SaaS). Revenue multiples are more volatile than EBITDA multiples. Match the multiple to the company's stage and margin profile.",
    example: {
      description: "Choose the right multiple",
      inputs: [
        { label: "Mature retailer, 8% EBITDA margin", value: "EV/EBITDA" },
        { label: "Early SaaS, -20% margin", value: "EV/Revenue" },
      ],
      calculation: "Profitable → EV/EBITDA; Unprofitable → EV/Revenue",
      result: "Match multiple to company profile",
    },
    commonMistakes: [
      "Using EV/Revenue for mature, profitable companies",
      "Using EV/EBITDA for pre-profit growth companies",
      "Ignoring gross margin when comparing revenue multiples",
    ],
    quiz: [
      {
        question: "EV/Revenue is used when companies are ___",
        answer: "unprofitable",
        hint: "No EBITDA yet",
      },
      {
        question: "EV/EBITDA is ___ structure neutral",
        answer: "capital",
        hint: "Ignores debt vs equity",
      },
      {
        question: "Revenue multiples are more ___ than EBITDA multiples",
        answer: "volatile",
        hint: "Sensitive to growth",
      },
    ],
  },
  {
    id: "ltm-vs-ntm",
    title: "LTM vs NTM",
    formula: "LTM = Last Twelve Months; NTM = Next Twelve Months",
    explanation:
      "LTM (trailing) uses historical financials — more certain but backward-looking. NTM (forward) uses estimates — reflects future expectations but less certain. In practice, NTM is often used for growth companies; LTM for mature. Always specify which you're using when presenting comps.",
    example: {
      description: "When to use LTM vs NTM",
      inputs: [
        { label: "Stable company",
          value: "LTM preferred" },
        { label: "High-growth company",
          value: "NTM preferred" },
      ],
      calculation: "LTM = actuals; NTM = consensus estimates",
      result: "Match to company and deal context",
    },
    commonMistakes: [
      "Mixing LTM and NTM multiples in the same analysis",
      "Using NTM without disclosing source of estimates",
      "Ignoring seasonality when calculating LTM",
    ],
    quiz: [
      {
        question: "LTM stands for ___ Twelve Months",
        answer: "Last",
        hint: "Historical",
      },
      {
        question: "NTM stands for ___ Twelve Months",
        answer: "Next",
        hint: "Forward-looking",
      },
      {
        question: "Growth companies often use ___ multiples",
        answer: "NTM",
        hint: "Forward-looking",
      },
    ],
  },
];
