export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const KNOWLEDGE_BASE: Record<string, string> = {
  dcf: "A DCF (Discounted Cash Flow) analysis values a company based on the present value of its projected future free cash flows. Key steps: 1) Project FCF for 5-10 years, 2) Calculate terminal value (Gordon Growth or Exit Multiple), 3) Discount back using WACC, 4) Sum to get Enterprise Value. The formula for UFCF is: EBIT(1-t) + D&A - CapEx - Change in NWC.",
  wacc: "WACC = (E/V × Re) + (D/V × Rd × (1-t)). Cost of Equity (Re) is typically calculated using CAPM: Re = Rf + β(Rm - Rf). Rf is the risk-free rate (10-year Treasury), β measures systematic risk, and (Rm - Rf) is the equity risk premium. Cost of Debt (Rd) is the yield on the company's debt.",
  "enterprise value": "Enterprise Value = Equity Value + Net Debt + Preferred Stock + Minority Interest - Cash. EV represents the total value of a firm's operations. You subtract Cash because an acquirer gets the cash. You add Debt because an acquirer assumes it. EV/EBITDA is the most common EV-based multiple.",
  "equity value": "Equity Value = Share Price × Diluted Shares Outstanding. Also called Market Capitalization. In a DCF: Equity Value = Enterprise Value - Net Debt - Preferred - Minority Interest + Cash. Equity multiples include P/E, P/BV, and Price/FCF.",
  lbo: "An LBO (Leveraged Buyout) uses significant debt (60-80% of purchase price) to acquire a company. Returns are driven by: 1) Debt paydown from FCF, 2) EBITDA growth, 3) Multiple expansion. Target IRR is typically 20-25%. Good LBO candidates have: stable cash flows, low CapEx, strong market position, and potential for cost optimization.",
  "accretion dilution": "A deal is accretive if the combined EPS > acquirer's standalone EPS, and dilutive if lower. Key rule: If the acquirer's P/E > target's P/E in a stock deal, it's typically accretive. For cash deals, compare the after-tax cost of debt to the target's earnings yield (E/P). Synergies can turn a dilutive deal accretive.",
  "three statements": "The three financial statements are linked: 1) Net Income from the Income Statement flows to Retained Earnings on the Balance Sheet and is the starting point of the Cash Flow Statement. 2) Changes in Balance Sheet working capital items flow into CFO. 3) CapEx on the CFS increases PP&E on the BS. 4) Ending cash on the CFS = Cash on the BS.",
  depreciation: "Depreciation is a non-cash expense that reduces Net Income on the Income Statement. On the Cash Flow Statement, it's added back to Net Income in CFO (since no cash was spent). On the Balance Sheet, Accumulated Depreciation increases (reducing Net PP&E). The tax shield from depreciation = Depreciation × Tax Rate.",
  goodwill: "Goodwill = Purchase Price - Fair Market Value of Net Identifiable Assets. It appears on the Balance Sheet of the acquirer after an acquisition. Goodwill is tested annually for impairment (not amortized under US GAAP). An impairment charge reduces Net Income and Goodwill on the BS.",
  "m&a process": "Sell-side M&A process: 1) Engagement letter, 2) Prepare CIM, 3) Contact buyers & send teasers, 4) Distribute NDAs & CIM, 5) Receive IOIs (Indications of Interest), 6) Management presentations, 7) Receive final bids (LOIs), 8) Select winner, 9) Due diligence, 10) Negotiate definitive agreement, 11) Close.",
  "pitch book": "A pitch book typically contains: 1) Situation overview, 2) Bank credentials (relevant deal experience), 3) Industry overview, 4) Valuation analysis (comps, precedent transactions, DCF), 5) Strategic alternatives, 6) Recommended approach. It's used to win mandates from potential clients.",
  ipo: "IPO process: 1) Select underwriters (bake-off), 2) Due diligence, 3) Draft S-1 registration, 4) SEC review & comments, 5) Roadshow (management meets institutional investors), 6) Book building (gauge demand), 7) Price the offering, 8) Begin trading. The lock-up period (typically 180 days) prevents insiders from selling immediately.",
  "walk me through your resume": "Structure: 1) Start with education/background, 2) Explain each career step chronologically, 3) Show how each experience builds on the last, 4) Explain why finance/banking, 5) Why this specific firm, 6) Keep it 2-3 minutes. The key is a coherent narrative that makes banking seem like the logical next step.",
  "why banking": "Strong answers reference: 1) Interest in complex financial analysis, 2) Desire to work on transformative transactions (M&A, IPOs), 3) Fast learning environment, 4) Working with smart, driven colleagues, 5) Building a strong foundation for a career in finance. Avoid: mentioning money, prestige, or exit opportunities.",
  valuation: "The three main valuation methodologies are: 1) Comparable Companies Analysis (trading comps) - uses market multiples of similar public companies, 2) Precedent Transactions - uses multiples paid in prior M&A deals, 3) DCF - intrinsic value based on projected cash flows. Typically, Precedent > Comps > DCF in terms of valuation range.",
  "financial modeling": "A 3-statement financial model projects the Income Statement, Balance Sheet, and Cash Flow Statement. Key steps: 1) Build revenue and expense assumptions, 2) Project the IS, 3) Build the BS with working capital and debt schedule, 4) Complete the CFS, 5) Link ending cash to BS, 6) Build in circular references for interest expense.",
  ebitda: "EBITDA = Earnings Before Interest, Taxes, Depreciation & Amortization. It's a proxy for operating cash flow and used for EV/EBITDA multiples. Adjusted EBITDA adds back non-recurring items (restructuring charges, SBC, etc.). EBITDA margin = EBITDA / Revenue. It's useful because it's capital-structure-neutral.",
  "working capital": "Net Working Capital = Current Assets - Current Liabilities (excluding cash and short-term debt). Key items: AR, Inventory, Prepaid Expenses (assets) vs AP, Accrued Expenses (liabilities). An increase in NWC is a use of cash (negative on CFS). Decreasing NWC generates cash. WC is critical in FCF calculations.",
};

function findBestMatch(input: string): string | null {
  const lower = input.toLowerCase();
  let bestKey: string | null = null;
  let bestScore = 0;

  for (const key of Object.keys(KNOWLEDGE_BASE)) {
    const words = key.split(/\s+/);
    let score = 0;
    for (const word of words) {
      if (lower.includes(word)) score += word.length;
    }
    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
    }
  }

  return bestScore >= 3 ? bestKey : null;
}

export function getChatResponse(input: string): string {
  const lower = input.toLowerCase().trim();

  if (!lower || lower.length < 2) {
    return "Please ask me a question about investment banking, accounting, valuation, M&A, LBOs, or any IB interview topic.";
  }

  const greetings = ["hi", "hello", "hey", "sup", "what's up"];
  if (greetings.some((g) => lower === g || lower === g + "!")) {
    return "Hello! I'm your IB interview prep assistant. Ask me about DCF, LBO, M&A, valuation, accounting, or any technical concept. I'll explain it in interview-ready language.";
  }

  if (lower.includes("help") || lower.includes("what can you")) {
    return "I can help with:\n• **Valuation** — DCF, comps, precedent transactions\n• **Accounting** — 3 statements, depreciation, working capital\n• **M&A** — Process, synergies, accretion/dilution\n• **LBO** — Mechanics, returns, debt structure\n• **EV & Equity Value** — Bridge, multiples\n• **Fit Questions** — Resume walkthrough, why banking\n\nJust ask a question and I'll give you an interview-ready answer!";
  }

  const matchKey = findBestMatch(lower);
  if (matchKey) {
    return KNOWLEDGE_BASE[matchKey];
  }

  if (lower.includes("revenue") || lower.includes("income statement")) {
    return KNOWLEDGE_BASE["three statements"];
  }
  if (lower.includes("debt") || lower.includes("leverage")) {
    return KNOWLEDGE_BASE.lbo;
  }
  if (lower.includes("multiple") || lower.includes("comp")) {
    return KNOWLEDGE_BASE.valuation;
  }
  if (lower.includes("cash flow") || lower.includes("fcf")) {
    return KNOWLEDGE_BASE.dcf;
  }
  if (lower.includes("interview") || lower.includes("resume")) {
    return KNOWLEDGE_BASE["walk me through your resume"];
  }
  if (lower.includes("acquisition") || lower.includes("merger") || lower.includes("deal")) {
    return KNOWLEDGE_BASE["m&a process"];
  }

  return "That's a great question! While I don't have a specific pre-built answer for that, here's a tip: In IB interviews, always structure your answers clearly. Start with the definition, explain the mechanics, and give a practical example. Try asking me about DCF, LBO, M&A, valuation, or accounting concepts!";
}
