import type { CompanyCase } from "./types";

export const COMPANY_CASES: CompanyCase[] = [
  {
    id: "apple",
    name: "Apple",
    ticker: "AAPL",
    sector: "Technology",
    description:
      "Apple is the world's largest technology company by market cap, known for iPhone, Mac, iPad, and Services. The company has transitioned from a hardware-focused to a services-driven business model with recurring revenue.",
    historicalData: [
      { year: 2020, revenue: 274500, ebit: 66288, da: 11056, capex: 7309, nwc: -2000 },
      { year: 2021, revenue: 365817, ebit: 108949, da: 11284, capex: 11085, nwc: 5000 },
      { year: 2022, revenue: 394328, ebit: 119437, da: 11104, capex: 10708, nwc: 3000 },
      { year: 2023, revenue: 383285, ebit: 114301, da: 11519, capex: 10959, nwc: -1000 },
      { year: 2024, revenue: 391035, ebit: 118658, da: 11445, capex: 9959, nwc: 2000 },
    ],
    sectorAvgWacc: 9.5,
    analystConsensusGrowth: 5,
    referenceEVRange: [2800000, 3200000],
  },
  {
    id: "microsoft",
    name: "Microsoft",
    ticker: "MSFT",
    sector: "Technology",
    description:
      "Microsoft is a global technology leader in cloud computing (Azure), productivity software (Office 365), and enterprise solutions. The shift to cloud has driven consistent double-digit growth.",
    historicalData: [
      { year: 2020, revenue: 143015, ebit: 52959, da: 12796, capex: 15441, nwc: 15000 },
      { year: 2021, revenue: 168088, ebit: 69916, da: 11686, capex: 20622, nwc: 8000 },
      { year: 2022, revenue: 198270, ebit: 83383, da: 14460, capex: 23886, nwc: 10000 },
      { year: 2023, revenue: 211915, ebit: 88523, da: 13861, capex: 28107, nwc: 5000 },
      { year: 2024, revenue: 245122, ebit: 109433, da: 22287, capex: 44477, nwc: 12000 },
    ],
    sectorAvgWacc: 9.0,
    analystConsensusGrowth: 12,
    referenceEVRange: [3000000, 3500000],
  },
  {
    id: "nvidia",
    name: "NVIDIA",
    ticker: "NVDA",
    sector: "Semiconductors",
    description:
      "NVIDIA is the dominant leader in AI/GPU computing, powering data centers, gaming, and autonomous vehicles. The AI boom has driven explosive growth, with data center revenue now the majority of sales.",
    historicalData: [
      { year: 2020, revenue: 10918, ebit: 2846, da: 1098, capex: 489, nwc: 2500 },
      { year: 2021, revenue: 16675, ebit: 4532, da: 1174, capex: 976, nwc: 3000 },
      { year: 2022, revenue: 26914, ebit: 10041, da: 1544, capex: 1833, nwc: 4000 },
      { year: 2023, revenue: 26974, ebit: 4224, da: 1508, capex: 1069, nwc: -2000 },
      { year: 2024, revenue: 60922, ebit: 32972, da: 1508, capex: 1069, nwc: 8000 },
    ],
    sectorAvgWacc: 11.0,
    analystConsensusGrowth: 25,
    referenceEVRange: [2500000, 3500000],
  },
  {
    id: "tesla",
    name: "Tesla",
    ticker: "TSLA",
    sector: "Automotive / Energy",
    description:
      "Tesla is the world's leading electric vehicle manufacturer and clean energy company. Known for high growth but volatile margins, Tesla competes in automotive, energy storage, and autonomous driving.",
    historicalData: [
      { year: 2020, revenue: 31536, ebit: 1994, da: 2322, capex: 3232, nwc: 2000 },
      { year: 2021, revenue: 53823, ebit: 6523, da: 2911, capex: 6514, nwc: 4000 },
      { year: 2022, revenue: 81462, ebit: 13656, da: 3747, capex: 7158, nwc: 5000 },
      { year: 2023, revenue: 96773, ebit: 8891, da: 4667, capex: 8898, nwc: 3000 },
      { year: 2024, revenue: 97690, ebit: 7076, da: 5200, capex: 11300, nwc: 1000 },
    ],
    sectorAvgWacc: 12.0,
    analystConsensusGrowth: 15,
    referenceEVRange: [600000, 900000],
  },
  {
    id: "costco",
    name: "Costco",
    ticker: "COST",
    sector: "Retail",
    description:
      "Costco is the world's third-largest retailer, operating membership-only warehouse clubs. Known for low margins but high customer loyalty, Costco generates most profit from membership fees rather than product sales.",
    historicalData: [
      { year: 2020, revenue: 166761, ebit: 5435, da: 1645, capex: 2810, nwc: 500 },
      { year: 2021, revenue: 195929, ebit: 6708, da: 1781, capex: 3588, nwc: 1000 },
      { year: 2022, revenue: 226954, ebit: 7793, da: 1900, capex: 3891, nwc: 1500 },
      { year: 2023, revenue: 242290, ebit: 8350, da: 2077, capex: 4323, nwc: 800 },
      { year: 2024, revenue: 254453, ebit: 9285, da: 2200, capex: 4710, nwc: 1200 },
    ],
    sectorAvgWacc: 8.5,
    analystConsensusGrowth: 7,
    referenceEVRange: [350000, 450000],
  },
  {
    id: "amazon",
    name: "Amazon",
    ticker: "AMZN",
    sector: "Technology / Retail",
    description:
      "Amazon is the world's largest e-commerce and cloud computing company. AWS drives most profits; retail operates on thin margins. Prime membership and advertising are growing high-margin revenue streams.",
    historicalData: [
      { year: 2020, revenue: 386064, ebit: 22900, da: 47466, capex: 40164, nwc: -20000 },
      { year: 2021, revenue: 469822, ebit: 24920, da: 56522, capex: 55358, nwc: -15000 },
      { year: 2022, revenue: 513983, ebit: 12248, da: 67532, capex: 58789, nwc: -10000 },
      { year: 2023, revenue: 574785, ebit: 36852, da: 73755, capex: 54164, nwc: -8000 },
      { year: 2024, revenue: 638762, ebit: 52000, da: 78000, capex: 60000, nwc: -5000 },
    ],
    sectorAvgWacc: 10.0,
    analystConsensusGrowth: 12,
    referenceEVRange: [1800000, 2200000],
  },
  {
    id: "meta",
    name: "Meta",
    ticker: "META",
    sector: "Technology",
    description:
      "Meta owns Facebook, Instagram, WhatsApp, and the metaverse. Advertising drives nearly all revenue. AI investments and Reality Labs (VR/AR) are significant growth bets with uncertain payoffs.",
    historicalData: [
      { year: 2020, revenue: 85965, ebit: 32671, da: 10271, capex: 15257, nwc: 5000 },
      { year: 2021, revenue: 117929, ebit: 46752, da: 11229, capex: 19218, nwc: 8000 },
      { year: 2022, revenue: 116609, ebit: 28944, da: 11279, capex: 32000, nwc: 3000 },
      { year: 2023, revenue: 134902, ebit: 47882, da: 11279, capex: 28000, nwc: 6000 },
      { year: 2024, revenue: 153000, ebit: 62000, da: 12000, capex: 35000, nwc: 5000 },
    ],
    sectorAvgWacc: 10.5,
    analystConsensusGrowth: 15,
    referenceEVRange: [1400000, 1800000],
  },
];

export function getCompanyById(id: string): CompanyCase | undefined {
  return COMPANY_CASES.find((c) => c.id === id);
}

export function calculateHistoricalMetrics(company: CompanyCase) {
  const data = company.historicalData;
  const n = data.length;

  const revenues = data.map((d) => d.revenue);
  const growthRates = [];
  for (let i = 1; i < n; i++) {
    growthRates.push((revenues[i] / revenues[i - 1] - 1) * 100);
  }
  const avgGrowth = growthRates.reduce((a, b) => a + b, 0) / growthRates.length;

  const ebitMargins = data.map((d) => (d.ebit / d.revenue) * 100);
  const avgEbitMargin = ebitMargins.reduce((a, b) => a + b, 0) / n;

  const daPercents = data.map((d) => (d.da / d.revenue) * 100);
  const avgDaPercent = daPercents.reduce((a, b) => a + b, 0) / n;

  const capexPercents = data.map((d) => (d.capex / d.revenue) * 100);
  const avgCapexPercent = capexPercents.reduce((a, b) => a + b, 0) / n;

  const lastYear = data[n - 1];

  return {
    avgGrowth,
    avgEbitMargin,
    avgDaPercent,
    avgCapexPercent,
    lastRevenue: lastYear.revenue,
    lastEbit: lastYear.ebit,
    growthRates,
    ebitMargins,
  };
}
