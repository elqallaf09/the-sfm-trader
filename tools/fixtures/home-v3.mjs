// Deterministic browser test data only; never imported by production code.
const recommendations = [
  ["META", "Meta Platforms", 590.24, 617.75, 89, 4.66, "buy", "شراء"],
  ["MSFT", "Microsoft Corp.", 487.65, 521.79, 86, 7.00, "buy", "شراء"],
  ["AAPL", "Apple Inc.", 303.42, 314.36, 82, 3.61, "hold", "انتظار"],
  ["GOOGL", "Alphabet Inc.", 238.40, 247.94, 80, 4.00, "buy", "شراء"],
  ["AMD", "Advanced Micro Devices Inc.", 168.90, 175.84, 78, 4.11, "buy", "شراء"],
  ["AVGO", "Broadcom Inc.", 341.80, 357.97, 76, 4.73, "buy", "شراء"],
  ["LLY", "Eli Lilly and Co.", 724.20, 750.42, 73, 3.62, "hold", "انتظار"],
  ["NVDA", "NVIDIA Corp.", 181.60, 188.86, 71, 4.00, "buy", "شراء"]
].map(([symbol, name, currentPrice, target1, confidence, expectedMovePct, action, actionLabel]) => ({
  symbol,
  name,
  currentPrice,
  target1,
  expectedPrice: target1,
  confidence,
  expectedMovePct,
  action,
  actionLabel,
  currency: "USD",
  market: "us",
  reasons: [],
  timeframes: [],
  sparkline: [],
  duration: "3-6 months",
  target2: null,
  stopLoss: null,
  riskReward: null,
  dataHealth: { score: 100, label: "verified" },
  timeframeConsensus: { conflict: false }
}));

export const fixture = {
  recommendations,
  generatedAt: "2026-09-03T12:00:00.000Z",
  cached: false,
  refreshing: false,
  dataStatus: "fresh",
  economicCalendar: {
    hotEvents: [
      { title: "US Nonfarm Payrolls", currency: "USD", impact: "high", date: "2026-09-04", time: "15:30", localTimeLabel: "15:30" },
      { title: "ECB Interest Rate Decision", currency: "EUR", impact: "high", date: "2026-09-10", time: "15:15", localTimeLabel: "15:15" }
    ],
    upcoming: []
  },
  smartAlerts: [],
  unavailable: [],
  market: { id: "us", label: "US Market", supportedSymbols: recommendations }
};
