import { Question } from "@/types/question";

export const mnaQuestions: Question[] = [
  {
    id: "mna-1",
    section: "M&A",
    difficulty: "Beginner",
    type: "mcq",
    question: "What is the primary difference between a strategic buyer and a financial buyer?",
    choices: [
      "Strategic buyers are always larger companies",
      "Strategic buyers can realize operational synergies, while financial buyers primarily rely on financial engineering and leverage",
      "Financial buyers always pay higher premiums",
      "Strategic buyers only use cash to fund acquisitions"
    ],
    correctAnswer: "Strategic buyers can realize operational synergies, while financial buyers primarily rely on financial engineering and leverage",
    explanation: "Strategic buyers (typically corporations) acquire targets to realize operational synergies such as cost savings and revenue enhancements. Financial buyers (typically PE firms) focus on leveraging the target's cash flows with debt to generate returns through financial engineering."
  },
  {
    id: "mna-2",
    section: "M&A",
    difficulty: "Beginner",
    type: "mcq",
    question: "Which of the following is NOT a common type of synergy in an M&A transaction?",
    choices: [
      "Revenue synergies from cross-selling products",
      "Cost synergies from eliminating redundant headcount",
      "Tax synergies from utilizing NOLs",
      "Depreciation synergies from writing down asset values"
    ],
    correctAnswer: "Depreciation synergies from writing down asset values",
    explanation: "Common M&A synergies include revenue synergies (cross-selling, geographic expansion), cost synergies (headcount reduction, facility consolidation), and tax synergies (NOL utilization). Writing down asset values is not a recognized synergy category; in fact, purchase price allocation typically steps up asset values, creating higher depreciation."
  },
  {
    id: "mna-3",
    section: "M&A",
    difficulty: "Beginner",
    type: "mcq",
    question: "In an all-stock acquisition, the acquirer's shareholders face which of the following risks?",
    choices: [
      "The acquirer must take on additional debt to fund the deal",
      "Their ownership is diluted as new shares are issued to the target's shareholders",
      "The acquirer loses its tax-exempt status",
      "The target's shareholders receive a fixed cash payout"
    ],
    correctAnswer: "Their ownership is diluted as new shares are issued to the target's shareholders",
    explanation: "In an all-stock deal, the acquirer issues new shares to the target's shareholders, which dilutes existing shareholders' ownership percentage. This is one of the key trade-offs between stock and cash consideration in M&A."
  },
  {
    id: "mna-4",
    section: "M&A",
    difficulty: "Beginner",
    type: "mcq",
    question: "What is a fairness opinion in the context of M&A?",
    choices: [
      "A regulatory approval from the SEC required before closing",
      "An independent assessment by an investment bank stating whether the transaction price is fair from a financial point of view",
      "A legal document certifying the merger is compliant with antitrust laws",
      "An internal memo prepared by the target's management team"
    ],
    correctAnswer: "An independent assessment by an investment bank stating whether the transaction price is fair from a financial point of view",
    explanation: "A fairness opinion is provided by an independent investment bank to the board of directors, stating whether the proposed transaction price is fair from a financial point of view. It helps protect the board from shareholder lawsuits by demonstrating that they fulfilled their fiduciary duties."
  },
  {
    id: "mna-5",
    section: "M&A",
    difficulty: "Beginner",
    type: "mcq",
    question: "What is the primary purpose of due diligence in an M&A transaction?",
    choices: [
      "To negotiate the final purchase price",
      "To investigate and verify all material aspects of the target company before closing",
      "To prepare the proxy statement for shareholders",
      "To obtain regulatory approval for the transaction"
    ],
    correctAnswer: "To investigate and verify all material aspects of the target company before closing",
    explanation: "Due diligence is the comprehensive investigation of a target company's financial, legal, operational, and commercial aspects. It allows the buyer to identify risks, validate assumptions, and potentially renegotiate terms before the deal closes."
  },
  {
    id: "mna-6",
    section: "M&A",
    difficulty: "Beginner",
    type: "mcq",
    question: "In a hostile takeover, the acquirer bypasses the target's board of directors. Which of the following is a common hostile takeover tactic?",
    choices: [
      "Issuing a fairness opinion",
      "Launching a tender offer directly to shareholders",
      "Filing a go-shop provision",
      "Requesting a management buyout"
    ],
    correctAnswer: "Launching a tender offer directly to shareholders",
    explanation: "In a hostile takeover, the acquirer goes directly to the target's shareholders with a tender offer, bypassing the board. Other hostile tactics include proxy fights where the acquirer seeks to replace the target's board with directors who will approve the deal."
  },
  {
    id: "mna-7",
    section: "M&A",
    difficulty: "Beginner",
    type: "mcq",
    question: "Why would a target company's shareholders generally prefer cash consideration over stock consideration?",
    choices: [
      "Cash consideration always results in a higher premium",
      "Cash provides certainty of value, whereas stock consideration exposes them to the acquirer's future stock price risk",
      "Cash deals are never subject to regulatory approval",
      "Stock deals always trigger higher taxes for the target's shareholders"
    ],
    correctAnswer: "Cash provides certainty of value, whereas stock consideration exposes them to the acquirer's future stock price risk",
    explanation: "Cash consideration provides immediate and certain value to the target's shareholders. In a stock deal, the value of consideration fluctuates with the acquirer's stock price between announcement and closing, creating uncertainty. However, stock deals can offer tax deferral advantages."
  },
  {
    id: "mna-8",
    section: "M&A",
    difficulty: "Beginner",
    type: "mcq",
    question: "What is a break-up fee (termination fee) in M&A?",
    choices: [
      "A fee paid by the acquirer to the target if the acquirer walks away from the deal",
      "A penalty paid by the target to the acquirer if the target accepts a superior offer from another bidder",
      "A fee charged by the investment bank for advisory services",
      "A regulatory fine imposed for antitrust violations"
    ],
    correctAnswer: "A penalty paid by the target to the acquirer if the target accepts a superior offer from another bidder",
    explanation: "A break-up fee (typically 2-4% of deal value) is paid by the target to the acquirer if the target terminates the merger agreement, usually to accept a superior proposal. It compensates the original acquirer for time and resources spent on the deal. Reverse break-up fees protect the target if the acquirer fails to close."
  },
  {
    id: "mna-9",
    section: "M&A",
    difficulty: "Advanced",
    type: "mcq",
    question: "A company with a P/E ratio of 20x acquires a target with a P/E ratio of 12x in an all-stock deal with no synergies. What is the immediate impact on the acquirer's EPS?",
    choices: [
      "EPS decreases (dilutive) because the acquirer's P/E is higher than the target's",
      "EPS increases (accretive) because the acquirer's P/E is higher than the target's",
      "EPS remains unchanged in an all-stock deal",
      "The impact cannot be determined without knowing the revenue of both companies"
    ],
    correctAnswer: "EPS increases (accretive) because the acquirer's P/E is higher than the target's",
    explanation: "When a higher P/E acquirer buys a lower P/E target in an all-stock deal, the deal is accretive to the acquirer's EPS. The acquirer is effectively buying earnings at a cheaper multiple than its own, so the combined EPS is higher. This is the basic P/E arbitrage concept."
  },
  {
    id: "mna-10",
    section: "M&A",
    difficulty: "Advanced",
    type: "mcq",
    question: "Which of the following defensive measures allows existing shareholders to purchase additional shares at a discount, diluting the hostile acquirer's stake?",
    choices: [
      "White knight defense",
      "Poison pill (shareholder rights plan)",
      "Pac-Man defense",
      "Crown jewel defense"
    ],
    correctAnswer: "Poison pill (shareholder rights plan)",
    explanation: "A poison pill allows existing shareholders (excluding the hostile acquirer) to purchase additional shares at a significant discount once the acquirer's ownership exceeds a certain threshold (typically 10-20%). This massively dilutes the acquirer's stake, making the hostile takeover prohibitively expensive."
  },
  {
    id: "mna-11",
    section: "M&A",
    difficulty: "Advanced",
    type: "mcq",
    question: "In purchase price allocation, if the purchase price exceeds the fair market value of all identifiable net assets, the excess is recorded as:",
    choices: [
      "A one-time restructuring charge",
      "Goodwill on the acquirer's balance sheet",
      "Additional paid-in capital",
      "An intangible asset that must be amortized over 15 years"
    ],
    correctAnswer: "Goodwill on the acquirer's balance sheet",
    explanation: "Under both US GAAP and IFRS, the excess of the purchase price over the fair market value of identifiable net assets (tangible and intangible) is recorded as goodwill. Goodwill is not amortized under US GAAP but is tested annually for impairment."
  },
  {
    id: "mna-12",
    section: "M&A",
    difficulty: "Advanced",
    type: "mcq",
    question: "What is a go-shop provision in a merger agreement?",
    choices: [
      "A clause requiring the target to immediately cease all discussions with other potential buyers",
      "A window of time (typically 30-60 days) after signing during which the target can actively solicit competing bids",
      "A provision that accelerates the closing timeline",
      "A requirement for the acquirer to obtain additional financing"
    ],
    correctAnswer: "A window of time (typically 30-60 days) after signing during which the target can actively solicit competing bids",
    explanation: "A go-shop provision gives the target a specified window (usually 30-60 days post-signing) to actively solicit competing offers. This is more common in PE-led transactions and helps the target's board demonstrate it fulfilled its fiduciary duty to maximize shareholder value. Go-shop break-up fees are typically lower than standard termination fees."
  },
  {
    id: "mna-13",
    section: "M&A",
    difficulty: "Advanced",
    type: "mcq",
    question: "An acquirer is deciding between a stock purchase and an asset purchase. Which of the following is an advantage of an asset purchase for the buyer?",
    choices: [
      "The buyer automatically assumes all liabilities of the target",
      "The buyer can selectively choose which assets and liabilities to acquire and may receive a step-up in tax basis",
      "Asset purchases avoid the need for regulatory approval",
      "Asset purchases are always less expensive than stock purchases"
    ],
    correctAnswer: "The buyer can selectively choose which assets and liabilities to acquire and may receive a step-up in tax basis",
    explanation: "In an asset purchase, the buyer selects specific assets and liabilities to acquire, avoiding unwanted liabilities. The buyer also receives a step-up in the tax basis of acquired assets to fair market value, generating higher depreciation/amortization tax shields. However, asset purchases can be more complex and may require consent for contract assignments."
  },
  {
    id: "mna-14",
    section: "M&A",
    difficulty: "Advanced",
    type: "mcq",
    question: "What is the Hart-Scott-Rodino (HSR) Act's relevance to M&A transactions?",
    choices: [
      "It requires all public companies to file annual reports with the SEC",
      "It mandates pre-merger notification to the FTC and DOJ for transactions above certain size thresholds",
      "It governs the tax treatment of cross-border mergers",
      "It sets the maximum break-up fee allowed in merger agreements"
    ],
    correctAnswer: "It mandates pre-merger notification to the FTC and DOJ for transactions above certain size thresholds",
    explanation: "The HSR Act requires parties to notify the Federal Trade Commission (FTC) and Department of Justice (DOJ) before completing transactions that exceed certain size thresholds. There is a mandatory waiting period (typically 30 days) during which the agencies review the deal for antitrust concerns before the parties can close."
  },
  {
    id: "mna-15",
    section: "M&A",
    difficulty: "Advanced",
    type: "numeric",
    question: "A target company has an enterprise value of $500 million and its unaffected share price was $40. The acquirer offers $52 per share. What is the acquisition premium as a percentage (round to the nearest whole number)?",
    correctAnswer: "30",
    explanation: "The acquisition premium is calculated as (Offer Price - Unaffected Price) / Unaffected Price = ($52 - $40) / $40 = 30%. Typical acquisition premiums range from 20-40% over the unaffected share price."
  },
  {
    id: "mna-16",
    section: "M&A",
    difficulty: "Advanced",
    type: "numeric",
    question: "An acquirer pays $800M for a target with $600M in identifiable net assets at fair market value. A year later, the reporting unit's fair value has declined to $700M. What is the goodwill impairment charge (in $M)?",
    correctAnswer: "100",
    explanation: "Goodwill = $800M - $600M = $200M. Under the simplified impairment test, the carrying value of the reporting unit ($800M) exceeds its fair value ($700M) by $100M. Since this excess ($100M) is less than the total goodwill ($200M), the impairment charge is $100M."
  },
  {
    id: "mna-17",
    section: "M&A",
    difficulty: "Elite",
    type: "mcq",
    question: "In a merger where the acquirer uses a fixed exchange ratio, which party bears the risk of stock price fluctuations between signing and closing?",
    choices: [
      "Only the target's shareholders",
      "Only the acquirer's shareholders",
      "Both parties bear the risk proportionally",
      "Neither party, as the exchange ratio adjusts automatically"
    ],
    correctAnswer: "Both parties bear the risk proportionally",
    explanation: "With a fixed exchange ratio, the number of acquirer shares per target share is set at signing. If the acquirer's stock drops, the target's shareholders receive less value; if it rises, they receive more. Both parties are exposed to the acquirer's stock price movements. A fixed dollar value (floating exchange ratio) would instead fix the value for the target but expose the acquirer to share count uncertainty."
  },
  {
    id: "mna-18",
    section: "M&A",
    difficulty: "Elite",
    type: "mcq",
    question: "A PE firm is evaluating two potential add-on acquisitions for a platform company. Target A has $50M EBITDA at 8x, and Target B has $30M EBITDA at 6x. The platform trades at 12x EBITDA. Ignoring synergies and financing, which creates more value through multiple arbitrage and by how much in enterprise value?",
    choices: [
      "Target A creates $200M and Target B creates $180M — Target A by $20M",
      "Target A creates $200M and Target B creates $120M — Target A by $80M",
      "Target B creates $200M more in value than Target A",
      "Both create the same value through multiple arbitrage"
    ],
    correctAnswer: "Target A creates $200M and Target B creates $180M — Target A by $20M",
    explanation: "Multiple arbitrage value = (Platform Multiple - Acquisition Multiple) × EBITDA. Target A: (12x - 8x) × $50M = $200M value creation. Target B: (12x - 6x) × $30M = $180M value creation. Target A creates $20M more value ($200M vs $180M). Despite Target B having a wider multiple gap (6x), Target A's larger EBITDA base makes it slightly more valuable."
  },
  {
    id: "mna-19",
    section: "M&A",
    difficulty: "Elite",
    type: "numeric",
    question: "An acquirer with 100M shares outstanding at $50/share acquires a target for $2B in an all-stock deal using a fixed exchange ratio. The target has 40M shares outstanding at $40/share. What is the exchange ratio (target shares to acquirer shares, rounded to one decimal place)?",
    correctAnswer: "1.0",
    explanation: "The total consideration is $2B for 40M target shares, so the per-share price offered is $2B / 40M = $50. The exchange ratio = Offer Price Per Share / Acquirer Share Price = $50 / $50 = 1.0. Each target share is exchanged for 1.0 acquirer share, resulting in 40M new shares issued."
  },
  {
    id: "mna-20",
    section: "M&A",
    difficulty: "Elite",
    type: "numeric",
    question: "A target company generates $150M in revenue with 40% EBITDA margins. The acquirer expects to realize $30M in annual cost synergies. If the acquisition multiple is 10x pre-synergy EBITDA, what is the effective EV/EBITDA multiple on a post-synergy basis (round to one decimal place)?",
    correctAnswer: "6.7",
    explanation: "Pre-synergy EBITDA = $150M × 40% = $60M. Purchase price = 10x × $60M = $600M. Post-synergy EBITDA = $60M + $30M = $90M. Effective post-synergy multiple = $600M / $90M = 6.7x. This illustrates how synergies effectively reduce the acquisition multiple, creating value for the acquirer."
  }
];
