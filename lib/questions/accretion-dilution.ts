import { Question } from "@/types/question";

export const accretionDilutionQuestions: Question[] = [
  {
    id: "ad-1",
    section: "Accretion/Dilution",
    difficulty: "Beginner",
    type: "mcq",
    question: "A deal is considered 'accretive' to the acquirer when:",
    choices: [
      "The acquirer's revenue increases after the transaction",
      "The acquirer's pro forma EPS is higher than its standalone EPS",
      "The target's shareholders receive a premium to market price",
      "The combined entity's enterprise value exceeds the sum of both standalone values"
    ],
    correctAnswer: "The acquirer's pro forma EPS is higher than its standalone EPS",
    explanation: "A deal is accretive when the acquirer's pro forma earnings per share (EPS) increases relative to its standalone EPS. Conversely, a deal is dilutive when pro forma EPS decreases. Accretion/dilution analysis is a key consideration for public company acquirers as shareholders focus heavily on EPS impact."
  },
  {
    id: "ad-2",
    section: "Accretion/Dilution",
    difficulty: "Beginner",
    type: "mcq",
    question: "In an all-cash acquisition, the acquirer's EPS is most likely to be affected by which of the following?",
    choices: [
      "The number of new shares issued to the target's shareholders",
      "The lost interest income (or added interest expense) on cash used and the target's net income contribution",
      "The change in the acquirer's P/E multiple",
      "The target's dividend payout ratio"
    ],
    correctAnswer: "The lost interest income (or added interest expense) on cash used and the target's net income contribution",
    explanation: "In an all-cash deal, no new shares are issued, so the share count stays the same. The key EPS drivers are: (1) the target's net income added to the combined entity, and (2) the foregone interest on cash used (or additional interest expense on new debt raised to fund the deal). If the target's earnings contribution exceeds the after-tax financing cost, the deal is accretive."
  },
  {
    id: "ad-3",
    section: "Accretion/Dilution",
    difficulty: "Beginner",
    type: "mcq",
    question: "What is goodwill in the context of an acquisition?",
    choices: [
      "The market value of the target's tangible assets",
      "The excess of the purchase price over the fair market value of the target's identifiable net assets",
      "The synergies expected to be realized from the transaction",
      "The premium paid above the target's book value of equity"
    ],
    correctAnswer: "The excess of the purchase price over the fair market value of the target's identifiable net assets",
    explanation: "Goodwill represents the purchase price paid in excess of the fair market value of all identifiable net assets (both tangible and intangible). It conceptually captures the value of the target's brand, customer relationships, workforce, and other unidentifiable factors. Under US GAAP, goodwill is not amortized but is tested annually for impairment."
  },
  {
    id: "ad-4",
    section: "Accretion/Dilution",
    difficulty: "Beginner",
    type: "mcq",
    question: "Which of the following best describes purchase price allocation (PPA)?",
    choices: [
      "Dividing the purchase price among the target's shareholders based on their ownership stakes",
      "Assigning the purchase price to the target's identifiable assets, liabilities, and goodwill at fair market value",
      "Allocating the financing costs of the acquisition between debt and equity",
      "Splitting the deal value between the acquirer's and target's investment banks"
    ],
    correctAnswer: "Assigning the purchase price to the target's identifiable assets, liabilities, and goodwill at fair market value",
    explanation: "Purchase price allocation is the process of assigning the total acquisition cost to the target's identifiable tangible assets, intangible assets (patents, trademarks, customer lists), and liabilities at their fair market values. The remaining excess is recorded as goodwill. PPA affects future depreciation and amortization expenses and thus impacts pro forma EPS."
  },
  {
    id: "ad-5",
    section: "Accretion/Dilution",
    difficulty: "Beginner",
    type: "mcq",
    question: "All else being equal, which type of consideration is more likely to result in a dilutive deal for the acquirer?",
    choices: [
      "100% cash consideration",
      "100% stock consideration",
      "50/50 cash and stock mix",
      "The type of consideration has no impact on accretion/dilution"
    ],
    correctAnswer: "100% stock consideration",
    explanation: "Stock consideration is more likely to be dilutive because the acquirer issues new shares, increasing the share count in the denominator of the EPS calculation. In a cash deal, the share count remains unchanged, and the only EPS drag is the after-tax cost of financing. The larger the share dilution relative to the earnings contribution, the more likely the deal is dilutive."
  },
  {
    id: "ad-6",
    section: "Accretion/Dilution",
    difficulty: "Beginner",
    type: "mcq",
    question: "If an acquirer with a P/E of 15x buys a target with a P/E of 20x in an all-stock deal with no synergies, the deal is most likely:",
    choices: [
      "Accretive to the acquirer's EPS",
      "Dilutive to the acquirer's EPS",
      "Neutral to the acquirer's EPS",
      "Cannot be determined from the information given"
    ],
    correctAnswer: "Dilutive to the acquirer's EPS",
    explanation: "When a lower P/E acquirer buys a higher P/E target in an all-stock deal, the deal is dilutive. The acquirer is paying a higher price per dollar of earnings than its own market valuation implies. The acquirer effectively 'overpays' in terms of earnings contribution versus shares issued."
  },
  {
    id: "ad-7",
    section: "Accretion/Dilution",
    difficulty: "Beginner",
    type: "mcq",
    question: "In a pro forma income statement for an acquisition, which of the following adjustments is typically made?",
    choices: [
      "Removing the target's historical revenue to avoid double counting",
      "Adding incremental D&A from purchase price allocation write-ups and adjusting for transaction financing costs",
      "Eliminating the acquirer's standalone interest expense",
      "Converting all expenses to a cash basis"
    ],
    correctAnswer: "Adding incremental D&A from purchase price allocation write-ups and adjusting for transaction financing costs",
    explanation: "The pro forma income statement combines both companies' income and applies adjustments including: incremental depreciation and amortization from asset write-ups in purchase price allocation, new interest expense from acquisition financing, synergies (if included), and removal of one-time transaction costs. These adjustments directly impact pro forma EPS."
  },
  {
    id: "ad-8",
    section: "Accretion/Dilution",
    difficulty: "Beginner",
    type: "mcq",
    question: "Why do acquirers care about whether a deal is accretive or dilutive?",
    choices: [
      "Dilutive deals are prohibited by SEC regulations",
      "Investors and analysts focus on EPS, and dilutive deals can lead to a decline in the acquirer's stock price",
      "Accretive deals always create shareholder value while dilutive deals destroy it",
      "Tax authorities require separate reporting for dilutive transactions"
    ],
    correctAnswer: "Investors and analysts focus on EPS, and dilutive deals can lead to a decline in the acquirer's stock price",
    explanation: "Acquirers care about accretion/dilution because investors and analysts closely monitor EPS. A dilutive deal can signal that the acquirer is overpaying, potentially causing a stock price decline. However, a dilutive deal is not necessarily value-destroying if the long-term strategic rationale and synergies justify the short-term EPS impact."
  },
  {
    id: "ad-9",
    section: "Accretion/Dilution",
    difficulty: "Advanced",
    type: "mcq",
    question: "In an accretion/dilution analysis, which of the following would make a stock deal MORE accretive (or less dilutive)?",
    choices: [
      "A higher purchase premium paid to the target's shareholders",
      "Greater cost synergies that increase combined net income",
      "A higher tax rate applied to synergies",
      "More goodwill created in purchase price allocation"
    ],
    correctAnswer: "Greater cost synergies that increase combined net income",
    explanation: "Cost synergies increase the combined entity's net income without increasing the share count, directly improving pro forma EPS and making the deal more accretive. Conversely, a higher premium, more goodwill (leading to potential future impairment), or higher tax rates on synergies would reduce accretion or increase dilution."
  },
  {
    id: "ad-10",
    section: "Accretion/Dilution",
    difficulty: "Advanced",
    type: "mcq",
    question: "What is the 'break-even P/E ratio' concept in accretion/dilution analysis?",
    choices: [
      "The P/E ratio at which the acquirer's stock price equals the target's stock price",
      "The maximum P/E ratio the acquirer can pay for the target before the deal becomes dilutive in an all-stock transaction",
      "The P/E ratio at which the combined entity's value equals the sum of both standalone values",
      "The P/E ratio that makes the target's valuation equal to its book value"
    ],
    correctAnswer: "The maximum P/E ratio the acquirer can pay for the target before the deal becomes dilutive in an all-stock transaction",
    explanation: "In an all-stock deal with no synergies, the break-even P/E is equal to the acquirer's own P/E ratio. If the acquirer pays above this P/E for the target, the deal is dilutive; below it, the deal is accretive. Synergies effectively raise the break-even P/E, allowing the acquirer to pay a higher multiple and still remain accretive."
  },
  {
    id: "ad-11",
    section: "Accretion/Dilution",
    difficulty: "Advanced",
    type: "mcq",
    question: "How does the amortization of identifiable intangible assets from purchase price allocation affect accretion/dilution?",
    choices: [
      "It has no effect because amortization is a non-cash charge",
      "It reduces pro forma net income, making the deal more dilutive",
      "It increases pro forma EPS because it reduces taxable income",
      "It only affects the balance sheet, not the income statement"
    ],
    correctAnswer: "It reduces pro forma net income, making the deal more dilutive",
    explanation: "Amortization of intangible assets identified in PPA (such as customer relationships, technology, and trade names) is a real expense that reduces pre-tax income on the pro forma income statement. While it provides a tax shield, the net effect is a reduction in pro forma net income, making the deal more dilutive. This is why many analysts look at both GAAP EPS and cash EPS (adding back PPA amortization)."
  },
  {
    id: "ad-12",
    section: "Accretion/Dilution",
    difficulty: "Advanced",
    type: "mcq",
    question: "An acquirer is considering funding a $1B acquisition using 50% cash (from new debt at 5% pre-tax) and 50% stock. Compared to an all-stock deal, the mixed consideration will:",
    choices: [
      "Always be more accretive because less shares are issued",
      "Always be more dilutive because of the interest expense on debt",
      "Be more accretive if the target's earnings yield exceeds the after-tax cost of debt",
      "Have the same EPS impact regardless of the financing mix"
    ],
    correctAnswer: "Be more accretive if the target's earnings yield exceeds the after-tax cost of debt",
    explanation: "Using cash (debt) reduces the number of new shares issued, lowering the denominator in EPS. However, it adds after-tax interest expense, reducing the numerator. The mixed deal is more accretive than all-stock if the earnings yield on the cash-funded portion (target's net income contribution per dollar) exceeds the after-tax cost of debt. This is the fundamental trade-off in choosing consideration mix."
  },
  {
    id: "ad-13",
    section: "Accretion/Dilution",
    difficulty: "Advanced",
    type: "numeric",
    question: "An acquirer has 200M shares outstanding and $800M in net income (EPS = $4.00). It acquires a target with $100M in net income for $2B in an all-stock deal. The acquirer's stock price is $50. How many new shares are issued (in millions)?",
    correctAnswer: "40",
    explanation: "New shares issued = Purchase Price / Acquirer's Share Price = $2,000M / $50 = 40M shares. The new total share count would be 200M + 40M = 240M shares. Pro forma net income = $800M + $100M = $900M. Pro forma EPS = $900M / 240M = $3.75, which is dilutive compared to the standalone $4.00."
  },
  {
    id: "ad-14",
    section: "Accretion/Dilution",
    difficulty: "Advanced",
    type: "numeric",
    question: "An acquirer has an EPS of $5.00 and a P/E ratio of 20x. It acquires a target at a P/E of 16x in an all-stock deal. The target has net income of $50M and the acquirer has net income of $500M with 100M shares outstanding. What is the pro forma EPS (round to two decimal places)?",
    correctAnswer: "5.09",
    explanation: "Acquirer share price = $5.00 × 20 = $100. Target equity value at 16x P/E = $50M × 16 = $800M. New shares issued = $800M / $100 = 8M shares. Pro forma shares = 100M + 8M = 108M. Pro forma net income = $500M + $50M = $550M. Pro forma EPS = $550M / 108M = $5.09. The deal is accretive ($5.09 > $5.00) because the acquirer's P/E (20x) is higher than the target's acquisition P/E (16x)."
  },
  {
    id: "ad-15",
    section: "Accretion/Dilution",
    difficulty: "Advanced",
    type: "numeric",
    question: "An acquirer funds a $600M acquisition entirely with new debt at a 6% interest rate. The tax rate is 25%. The target contributes $50M in pre-tax income. What is the net accretion/dilution to the acquirer's net income from this deal (in $M)? Enter positive for accretion, negative for dilution.",
    correctAnswer: "10.5",
    explanation: "Target's after-tax income contribution = $50M × (1 - 0.25) = $37.5M. After-tax interest expense on acquisition debt = $600M × 6% × (1 - 0.25) = $600M × 6% × 0.75 = $27M. Net income impact = $37.5M - $27M = +$10.5M (accretive). Since this is an all-cash deal with no new shares, the full $10.5M flows through to EPS accretion."
  },
  {
    id: "ad-16",
    section: "Accretion/Dilution",
    difficulty: "Advanced",
    type: "numeric",
    question: "A target has $400M in identifiable net assets at fair value and is acquired for $650M. Of the excess, $100M is allocated to identifiable intangible assets with a 10-year useful life. What is the annual amortization of these intangibles (in $M)?",
    correctAnswer: "10",
    explanation: "The identifiable intangible assets of $100M are amortized over their 10-year useful life on a straight-line basis: $100M / 10 = $10M per year. The remaining excess of $650M - $400M - $100M = $150M is recorded as goodwill, which is not amortized under US GAAP but tested for impairment annually."
  },
  {
    id: "ad-17",
    section: "Accretion/Dilution",
    difficulty: "Elite",
    type: "mcq",
    question: "An acquirer (P/E of 18x) is buying a target at 22x P/E in an all-stock deal. The deal is initially dilutive. Which combination of adjustments would most likely make the deal accretive?",
    choices: [
      "Increase the purchase premium and extend the intangible amortization period",
      "Realize $75M in pre-tax cost synergies and switch to 60% cash / 40% stock consideration",
      "Increase goodwill and extend the earn-out period",
      "Reduce the target's revenue and increase the acquirer's share count"
    ],
    correctAnswer: "Realize $75M in pre-tax cost synergies and switch to 60% cash / 40% stock consideration",
    explanation: "Two powerful levers to improve accretion: (1) Cost synergies directly increase pro forma net income, boosting the numerator. (2) Switching from all-stock to a cash/stock mix reduces the number of new shares issued, lowering the denominator. Together, these adjustments can overcome the P/E disadvantage (acquirer at 18x paying 22x) and turn a dilutive deal accretive."
  },
  {
    id: "ad-18",
    section: "Accretion/Dilution",
    difficulty: "Elite",
    type: "numeric",
    question: "An acquirer has 150M shares, $3.00 EPS, and a $60 stock price. It buys a target with $75M net income for $1.5B (50% cash at 5% interest, 50% stock). Tax rate is 25%. Ignoring synergies and PPA adjustments, what is the pro forma EPS (round to two decimal places)?",
    correctAnswer: "3.06",
    explanation: "Acquirer net income = 150M × $3.00 = $450M. Cash portion = $750M, stock portion = $750M. New shares issued = $750M / $60 = 12.5M. After-tax interest on new debt = $750M × 5% × (1 - 0.25) = $28.125M. Pro forma net income = $450M + $75M - $28.125M = $496.875M. Pro forma shares = 150M + 12.5M = 162.5M. Pro forma EPS = $496.875M / 162.5M = $3.06. The deal is slightly accretive ($3.06 > $3.00) because the target's earnings contribution exceeds the combined dilution from new shares and after-tax interest expense."
  },
  {
    id: "ad-19",
    section: "Accretion/Dilution",
    difficulty: "Elite",
    type: "mcq",
    question: "In a stock-for-stock merger where the acquirer has a lower P/E than the target, which of the following strategies could the acquirer pursue to minimize the dilutive impact over a 2-year time horizon?",
    choices: [
      "Negotiate a collar on the exchange ratio to limit share issuance",
      "Phase in synergy realization and use contingent value rights (CVRs) to defer a portion of consideration",
      "Increase the purchase premium to win board approval faster",
      "Issue convertible preferred stock instead of common stock to delay share count dilution while realizing synergies"
    ],
    correctAnswer: "Issue convertible preferred stock instead of common stock to delay share count dilution while realizing synergies",
    explanation: "Convertible preferred stock delays the dilutive share count impact because the conversion to common shares typically occurs later. During this period, the acquirer can realize synergies that boost earnings, potentially making the eventual conversion less dilutive or even accretive. The preferred dividends are an interim cost, but they are typically lower than the full dilutive impact of immediate common share issuance. This is a sophisticated structuring technique used in dilutive deals."
  },
  {
    id: "ad-20",
    section: "Accretion/Dilution",
    difficulty: "Elite",
    type: "numeric",
    question: "An acquirer (EPS $4.00, 250M shares, P/E 22x) acquires a target at 18x P/E with $80M net income in an all-stock deal. After $40M in pre-tax annual cost synergies (25% tax rate), what is the pro forma EPS (round to two decimal places)?",
    correctAnswer: "4.17",
    explanation: "Acquirer share price = $4.00 × 22 = $88. Acquirer net income = $4.00 × 250M = $1,000M. Target equity value = $80M × 18 = $1,440M. New shares issued = $1,440M / $88 = 16.36M. After-tax synergies = $40M × (1 - 0.25) = $30M. Pro forma net income = $1,000M + $80M + $30M = $1,110M. Pro forma shares = 250M + 16.36M = 266.36M. Pro forma EPS = $1,110M / 266.36M = $4.17. The deal is accretive ($4.17 > $4.00) because the acquirer's higher P/E (22x vs 18x) combined with synergies more than offsets the share dilution."
  }
];
