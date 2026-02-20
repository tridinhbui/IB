import { Question } from "@/types/question";

export const valuationQuestions: Question[] = [
  {
    id: "val-1",
    section: "Valuation",
    difficulty: "Beginner",
    type: "mcq",
    question: "What are the three most common valuation methodologies used in investment banking?",
    choices: [
      "DCF, comparable company analysis, precedent transactions",
      "DCF, leveraged buyout, sum-of-the-parts",
      "Comparable company analysis, asset-based valuation, Black-Scholes",
      "Precedent transactions, dividend discount model, real options"
    ],
    correctAnswer: "DCF, comparable company analysis, precedent transactions",
    explanation: "The three core valuation methodologies in IB are: (1) Discounted Cash Flow (intrinsic value), (2) Comparable Company Analysis / trading comps (relative value from public peers), and (3) Precedent Transactions (relative value from past M&A deals). These form the foundation of nearly every valuation analysis in banking."
  },
  {
    id: "val-2",
    section: "Valuation",
    difficulty: "Beginner",
    type: "mcq",
    question: "In a DCF analysis, what discount rate is used to discount unlevered free cash flows?",
    choices: [
      "Cost of equity",
      "Cost of debt",
      "Weighted average cost of capital (WACC)",
      "Risk-free rate"
    ],
    correctAnswer: "Weighted average cost of capital (WACC)",
    explanation: "Unlevered free cash flows (Free Cash Flow to Firm) are available to all capital providers — both debt and equity holders. Therefore, the appropriate discount rate is WACC, which blends the cost of equity and the after-tax cost of debt weighted by the target capital structure."
  },
  {
    id: "val-3",
    section: "Valuation",
    difficulty: "Beginner",
    type: "mcq",
    question: "Which valuation methodology typically yields the highest valuation for a company?",
    choices: [
      "Comparable company analysis",
      "Precedent transactions",
      "Discounted cash flow",
      "Liquidation valuation"
    ],
    correctAnswer: "Precedent transactions",
    explanation: "Precedent transactions typically yield the highest value because acquisition multiples include a control premium (usually 20–40%) paid by buyers to gain control of the target. Trading comps reflect minority discount valuations, and DCF values depend on assumptions but generally fall between comps and precedents."
  },
  {
    id: "val-4",
    section: "Valuation",
    difficulty: "Beginner",
    type: "mcq",
    question: "What does CAPM stand for, and what does it calculate?",
    choices: [
      "Capital Asset Pricing Model; it calculates the cost of equity",
      "Capital Allocation and Portfolio Management; it calculates portfolio returns",
      "Cash Asset Pricing Methodology; it calculates the cost of debt",
      "Capital Asset Performance Metric; it calculates WACC"
    ],
    correctAnswer: "Capital Asset Pricing Model; it calculates the cost of equity",
    explanation: "CAPM stands for Capital Asset Pricing Model. The formula is: Cost of Equity = Risk-Free Rate + Beta × Equity Risk Premium. It estimates the return equity investors require for bearing the systematic risk of a particular stock, and is the most common method for estimating cost of equity in a DCF."
  },
  {
    id: "val-5",
    section: "Valuation",
    difficulty: "Beginner",
    type: "mcq",
    question: "What is terminal value in a DCF, and why is it necessary?",
    choices: [
      "The value of the company at the end of the projection period; because we cannot project cash flows forever",
      "The liquidation value of assets at bankruptcy; because all companies eventually fail",
      "The value of debt at maturity; because debt must be repaid",
      "The initial investment value; because we need a starting point for the analysis"
    ],
    correctAnswer: "The value of the company at the end of the projection period; because we cannot project cash flows forever",
    explanation: "Terminal value captures the value of all cash flows beyond the explicit forecast period (typically 5–10 years). Since it is impractical to project cash flows indefinitely, terminal value represents the bulk of total enterprise value in most DCFs — often 60–80% or more."
  },
  {
    id: "val-6",
    section: "Valuation",
    difficulty: "Beginner",
    type: "mcq",
    question: "A company has an equity beta of 1.2, the risk-free rate is 4.0%, and the equity risk premium is 6.0%. What is the cost of equity using CAPM?",
    choices: [
      "10.0%",
      "11.2%",
      "12.4%",
      "7.2%"
    ],
    correctAnswer: "11.2%",
    explanation: "Cost of Equity = Risk-Free Rate + Beta × ERP = 4.0% + 1.2 × 6.0% = 4.0% + 7.2% = 11.2%. This represents the expected return equity investors demand for holding this stock given its systematic risk profile relative to the market."
  },
  {
    id: "val-7",
    section: "Valuation",
    difficulty: "Beginner",
    type: "mcq",
    question: "In comparable company analysis, which of the following is the most commonly used enterprise value multiple?",
    choices: [
      "EV / Revenue",
      "EV / EBITDA",
      "EV / Total Assets",
      "EV / Net Income"
    ],
    correctAnswer: "EV / EBITDA",
    explanation: "EV / EBITDA is the most widely used enterprise value multiple because EBITDA is capital-structure-neutral, removes non-cash charges (D&A), and allows apples-to-apples comparison across companies with different leverage, tax situations, and depreciation policies. EV / Net Income is not used because net income is an equity metric, not an enterprise metric."
  },
  {
    id: "val-8",
    section: "Valuation",
    difficulty: "Beginner",
    type: "mcq",
    question: "What is a football field valuation chart?",
    choices: [
      "A chart showing the historical stock price shaped like a football field",
      "A horizontal bar chart showing the valuation range from each methodology side by side",
      "A scatter plot of comparable companies by size and profitability",
      "A sensitivity analysis table for DCF terminal value assumptions"
    ],
    correctAnswer: "A horizontal bar chart showing the valuation range from each methodology side by side",
    explanation: "A football field chart is a standard IB output that displays the implied valuation range from each methodology (DCF, trading comps, precedent transactions, LBO, etc.) as horizontal bars. It allows bankers and clients to quickly visualize where different approaches overlap and identify a reasonable valuation range."
  },
  {
    id: "val-9",
    section: "Valuation",
    difficulty: "Advanced",
    type: "mcq",
    question: "What are the two most common methods for calculating terminal value in a DCF?",
    choices: [
      "Gordon Growth Model and Exit Multiple Method",
      "Liquidation Value and Replacement Cost Method",
      "Book Value Method and Residual Income Method",
      "Dividend Discount Model and Earnings Power Value"
    ],
    correctAnswer: "Gordon Growth Model and Exit Multiple Method",
    explanation: "Terminal value is calculated using either: (1) the Gordon Growth Model (perpetuity growth): TV = FCF × (1 + g) / (WACC − g), which assumes cash flows grow at a constant rate forever, or (2) the Exit Multiple Method: TV = Terminal Year EBITDA × Exit Multiple, which applies a comparable EV/EBITDA multiple to the final year's EBITDA. Bankers typically use both and cross-check the implied assumptions."
  },
  {
    id: "val-10",
    section: "Valuation",
    difficulty: "Advanced",
    type: "mcq",
    question: "A company's terminal year free cash flow is $150M, WACC is 10%, and the perpetuity growth rate is 2.5%. What is the terminal value using the Gordon Growth Model?",
    choices: [
      "$1,500M",
      "$2,000M",
      "$2,050M",
      "$1,875M"
    ],
    correctAnswer: "$2,050M",
    explanation: "TV = FCF × (1 + g) / (WACC − g) = $150M × 1.025 / (0.10 − 0.025) = $153.75M / 0.075 = $2,050M. Note that the formula grows the terminal year FCF by (1 + g) before dividing by (WACC − g). The perpetuity growth rate should typically not exceed the long-term GDP growth rate (2–3%)."
  },
  {
    id: "val-11",
    section: "Valuation",
    difficulty: "Advanced",
    type: "mcq",
    question: "Why might you choose precedent transactions over comparable company analysis for valuing an acquisition target?",
    choices: [
      "Precedent transactions are always more accurate than trading comps",
      "Precedent transactions reflect control premiums and strategic synergies paid in actual deals",
      "Precedent transactions use more up-to-date financial data",
      "Precedent transactions remove the need to calculate enterprise value"
    ],
    correctAnswer: "Precedent transactions reflect control premiums and strategic synergies paid in actual deals",
    explanation: "Precedent transactions are preferred in M&A contexts because they reflect what acquirers have actually paid for similar companies, including control premiums and synergy values. However, deal data can be stale, deal-specific circumstances vary, and financial details may be limited — so bankers use both approaches and triangulate."
  },
  {
    id: "val-12",
    section: "Valuation",
    difficulty: "Advanced",
    type: "mcq",
    question: "What is the mid-year convention in a DCF, and why is it used?",
    choices: [
      "Discounting cash flows to the middle of each year instead of year-end to reflect that cash flows are received throughout the year",
      "Using the average of the first and last projected years as the discount period",
      "Starting the projection from the middle of the current fiscal year",
      "Discounting terminal value by half a year less to increase the valuation"
    ],
    correctAnswer: "Discounting cash flows to the middle of each year instead of year-end to reflect that cash flows are received throughout the year",
    explanation: "The mid-year convention discounts Year 1 cash flows by 0.5 years, Year 2 by 1.5 years, etc., instead of 1, 2, 3. This is more realistic because companies generate cash flows continuously throughout the year, not in a lump sum at year-end. It typically increases the present value by a few percent compared to year-end discounting."
  },
  {
    id: "val-13",
    section: "Valuation",
    difficulty: "Advanced",
    type: "mcq",
    question: "A company has a cost of equity of 12%, pre-tax cost of debt of 6%, tax rate of 25%, and a debt-to-total-capitalization ratio of 40%. What is the WACC?",
    choices: [
      "9.0%",
      "9.6%",
      "8.1%",
      "10.2%"
    ],
    correctAnswer: "9.0%",
    explanation: "WACC = (E/V × Re) + (D/V × Rd × (1 − T)) = (60% × 12%) + (40% × 6% × 75%) = 7.2% + 1.8% = 9.0%. The cost of debt is tax-adjusted because interest expense is tax-deductible, creating an interest tax shield that reduces the effective cost of debt financing."
  },
  {
    id: "val-14",
    section: "Valuation",
    difficulty: "Advanced",
    type: "mcq",
    question: "What does an unlevered beta measure, and how does it differ from a levered beta?",
    choices: [
      "Unlevered beta measures business risk only, while levered beta includes both business and financial risk from debt",
      "Unlevered beta is always higher than levered beta because it includes more risk",
      "Unlevered beta measures stock price volatility, while levered beta measures cash flow volatility",
      "There is no practical difference; the terms are interchangeable"
    ],
    correctAnswer: "Unlevered beta measures business risk only, while levered beta includes both business and financial risk from debt",
    explanation: "Levered beta reflects both the inherent operating/business risk of a company and the additional financial risk from leverage. Unlevering beta (using the Hamada equation) strips out the effect of debt to isolate pure business risk. This is essential when re-levering at the target company's capital structure in a DCF analysis to estimate the appropriate cost of equity."
  },
  {
    id: "val-15",
    section: "Valuation",
    difficulty: "Advanced",
    type: "numeric",
    question: "You are performing a comparable company analysis. The median EV/EBITDA multiple of the peer set is 11.0x. The target company has LTM EBITDA of $220M. What is the implied enterprise value in millions?",
    correctAnswer: "2420",
    explanation: "Implied EV = EBITDA × Multiple = $220M × 11.0x = $2,420M. In a trading comps analysis, you apply the selected peer multiple to the target's financial metric to derive an implied valuation. The median is often preferred to the mean to reduce the impact of outliers in the peer set."
  },
  {
    id: "val-16",
    section: "Valuation",
    difficulty: "Advanced",
    type: "mcq",
    question: "Why is the perpetuity growth rate in a DCF terminal value typically capped at 2–3%?",
    choices: [
      "Because regulators require it to be below 3%",
      "Because no company can grow faster than the overall economy indefinitely",
      "Because higher growth rates would make the cost of equity negative",
      "Because EBITDA margins always converge to 2–3% in the long run"
    ],
    correctAnswer: "Because no company can grow faster than the overall economy indefinitely",
    explanation: "The perpetuity growth rate represents growth into perpetuity. If a company grew faster than nominal GDP forever, it would eventually become larger than the entire economy — which is impossible. Therefore, the terminal growth rate is capped at or below the long-term nominal GDP growth rate (typically 2–3% in developed markets). Exceeding this signals aggressive or flawed assumptions."
  },
  {
    id: "val-17",
    section: "Valuation",
    difficulty: "Elite",
    type: "mcq",
    question: "You are valuing a high-growth SaaS company with negative EBITDA. Which valuation approach is most appropriate?",
    choices: [
      "EV/EBITDA comparable company analysis using the current negative EBITDA",
      "EV/Revenue comparable company analysis combined with a DCF using projected future profitability",
      "Precedent transactions based on book value multiples",
      "Liquidation value based on tangible assets"
    ],
    correctAnswer: "EV/Revenue comparable company analysis combined with a DCF using projected future profitability",
    explanation: "When EBITDA is negative, EV/EBITDA multiples are meaningless. EV/Revenue multiples are standard for high-growth, unprofitable companies (common in SaaS). A DCF is also valuable because it captures the transition from current losses to projected future profitability. Bankers typically present both and may also use forward multiples (NTM or Year 2) once the company reaches profitability in the projections."
  },
  {
    id: "val-18",
    section: "Valuation",
    difficulty: "Elite",
    type: "mcq",
    question: "In a DCF, if you increase the terminal growth rate from 2.0% to 2.5% while holding WACC at 9.0%, what happens to the terminal value and why is this relationship important?",
    choices: [
      "Terminal value decreases because higher growth means higher reinvestment needs",
      "Terminal value increases significantly because the denominator (WACC − g) shrinks, showing high sensitivity to small changes",
      "Terminal value stays roughly the same because WACC offsets the growth rate change",
      "Terminal value doubles because the growth rate increased by 25%"
    ],
    correctAnswer: "Terminal value increases significantly because the denominator (WACC − g) shrinks, showing high sensitivity to small changes",
    explanation: "With g = 2.0%, denominator = 9.0% − 2.0% = 7.0%. With g = 2.5%, denominator = 9.0% − 2.5% = 6.5%. That is a 7.7% decrease in the denominator, causing a ~7.7% increase in terminal value. As g approaches WACC, terminal value approaches infinity. This extreme sensitivity is why bankers always run sensitivity tables on WACC and terminal growth rate, and why the perpetuity growth rate must be chosen carefully."
  },
  {
    id: "val-19",
    section: "Valuation",
    difficulty: "Elite",
    type: "mcq",
    question: "You are running a DCF on a target with significant cyclicality. The company is currently at the peak of its earnings cycle. How should you adjust your approach?",
    choices: [
      "Use peak-year earnings for terminal value since they reflect the company's full potential",
      "Normalize cash flows to mid-cycle levels for the terminal year and ensure projections capture a full cycle",
      "Only use comparable company analysis since DCFs don't work for cyclical companies",
      "Apply a higher perpetuity growth rate to compensate for future downturns"
    ],
    correctAnswer: "Normalize cash flows to mid-cycle levels for the terminal year and ensure projections capture a full cycle",
    explanation: "For cyclical companies, using peak earnings in the terminal value would overstate intrinsic value. Best practice is to normalize the terminal year cash flows to mid-cycle levels (average margins/growth across a full cycle). The projection period should ideally span a complete cycle. Additionally, using mid-cycle multiples for exit-multiple terminal value and comparable analysis avoids distortion from where the company currently sits in its cycle."
  },
  {
    id: "val-20",
    section: "Valuation",
    difficulty: "Elite",
    type: "mcq",
    question: "A banker presents a DCF where terminal value represents 90% of total enterprise value. What is the most likely issue with this analysis?",
    choices: [
      "Nothing — this is normal for companies with back-ended cash flow profiles",
      "The projection period is likely too short, WACC may be too high, or near-term cash flows are unrealistically depressed",
      "The terminal growth rate is probably set at 0%, making the terminal value too large",
      "The exit multiple is likely lower than the peer median"
    ],
    correctAnswer: "The projection period is likely too short, WACC may be too high, or near-term cash flows are unrealistically depressed",
    explanation: "While terminal value typically represents 60–80% of total DCF value, 90%+ is a red flag. It suggests that near-term projected cash flows contribute almost nothing to the valuation. Common causes include: (1) a projection period that is too short (e.g., 3 years instead of 5–10), (2) near-term cash flows that are too conservative or negative, or (3) a WACC that heavily discounts near-term flows. The banker should extend the projection period or revisit assumptions to ensure the DCF isn't overly dependent on terminal value."
  }
];
