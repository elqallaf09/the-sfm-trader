function getAssetBaseSymbol(symbol = "") {
  return String(symbol || "")
    .toUpperCase()
    .replace(/=X$/, "")
    .replace(/[-.].*$/, "")
    .replace(/=.*/, "");
}

// One local source of truth for company marks used across Home, recommendation, and trade UI.
// These are small inline SVG/text vector representations, never remote images or emoji.
const ASSET_BRAND_REGISTRY = Object.freeze({
  META: { className: "asset-logo-meta", kind: "meta", label: "Meta", companyName: "Meta Platforms" },
  GOOGL: { className: "asset-logo-google", kind: "google", label: "G", companyName: "Alphabet Inc." },
  GOOG: { className: "asset-logo-google", kind: "google", label: "G", companyName: "Alphabet Inc." },
  MSFT: { className: "asset-logo-microsoft", kind: "microsoft", label: "Microsoft", companyName: "Microsoft Corp." },
  AAPL: { className: "asset-logo-apple", kind: "apple", label: "Apple", companyName: "Apple Inc." },
  NVDA: { className: "asset-logo-nvidia", kind: "nvidia", label: "NVIDIA", companyName: "NVIDIA Corp." },
  AMZN: { className: "asset-logo-amazon", kind: "amazon", label: "Amazon", companyName: "Amazon.com Inc." },
  TSLA: { className: "asset-logo-tesla", kind: "tesla", label: "Tesla", companyName: "Tesla Inc." },
  NFLX: { className: "asset-logo-netflix", kind: "netflix", label: "Netflix", companyName: "Netflix Inc." },
  INTC: { className: "asset-logo-intel", kind: "intel", label: "Intel", companyName: "Intel Corp." },
  AMD: { className: "asset-logo-amd", kind: "amd", label: "AMD", companyName: "Advanced Micro Devices Inc." },
  ORCL: { className: "asset-logo-oracle", kind: "oracle", label: "Oracle", companyName: "Oracle Corp." },
  AVGO: { className: "asset-logo-broadcom", kind: "broadcom", label: "Broadcom", companyName: "Broadcom Inc." },
  LLY: { className: "asset-logo-lilly", kind: "lilly", label: "Lilly", companyName: "Eli Lilly and Co." },
  GOLD: { className: "asset-logo-gold", kind: "gold", label: "Au", companyName: "Gold" },
  XAUUSD: { className: "asset-logo-gold", kind: "gold", label: "Au", companyName: "Gold" },
  "GC=F": { className: "asset-logo-gold", kind: "gold", label: "Au", companyName: "Gold" }
});

const ASSET_VISUAL_RULES = [
  { symbols: ["XAUUSD", "GC=F"], contains: ["XAU"], names: ["gold"], className: "asset-logo-gold", kind: "gold", label: "Au" },
  { symbols: ["XAGUSD", "SI=F"], contains: ["XAG"], names: ["silver"], className: "asset-logo-silver", kind: "silver", label: "Ag" },
  { symbols: ["USOIL", "UKOIL", "CL=F", "BZ=F"], names: ["oil", "brent", "wti"], className: "asset-logo-oil", kind: "oil", label: "Oil" },
  { symbols: ["NATGAS", "NG=F"], names: ["natural gas", "natgas"], className: "asset-logo-energy", kind: "gas", label: "Gas" },
  { symbols: ["COPPER", "HG=F"], names: ["copper"], className: "asset-logo-copper", kind: "copper", label: "Cu" },
  { symbols: ["BTC", "BTCUSD", "BTC-USD"], contains: ["BTC"], names: ["bitcoin"], className: "asset-logo-crypto", kind: "bitcoin", label: "BTC" },
  { symbols: ["ETH", "ETHUSD", "ETH-USD"], contains: ["ETH"], names: ["ethereum"], className: "asset-logo-eth", kind: "ethereum", label: "ETH" },
  { symbols: ["BNB", "BNBUSD", "BNB-USD"], contains: ["BNB"], names: ["bnb"], className: "asset-logo-bnb", kind: "bnb", label: "BNB" },
  { symbols: ["SOL", "SOLUSD", "SOL-USD"], contains: ["SOL"], names: ["solana"], className: "asset-logo-sol", kind: "solana", label: "SOL" },
  { symbols: ["XRP", "XRPUSD", "XRP-USD"], contains: ["XRP"], names: ["xrp"], className: "asset-logo-xrp", kind: "xrp", label: "XRP" },
  { symbols: ["ADA", "ADAUSD", "ADA-USD"], contains: ["ADA"], names: ["cardano"], className: "asset-logo-ada", kind: "cardano", label: "ADA" },
  { symbols: ["AVAX", "AVAXUSD", "AVAX-USD"], contains: ["AVAX"], names: ["avalanche"], className: "asset-logo-avax", kind: "avalanche", label: "AVAX" },
  { symbols: ["AAPL", "APPLE"], names: ["apple"], className: "asset-logo-apple", kind: "apple", label: "AAPL" },
  { symbols: ["GOOGL", "GOOG"], names: ["alphabet", "google"], className: "asset-logo-google", kind: "google", label: "G" },
  { symbols: ["MSFT"], names: ["microsoft"], className: "asset-logo-microsoft", kind: "microsoft", label: "MS" },
  { symbols: ["AMZN"], names: ["amazon"], className: "asset-logo-amazon", kind: "amazon", label: "AM" },
  { symbols: ["META"], names: ["meta"], className: "asset-logo-meta", kind: "meta", label: "ME" },
  { symbols: ["TSLA"], names: ["tesla"], className: "asset-logo-tesla", kind: "tesla", label: "TS" },
  { symbols: ["NVDA"], names: ["nvidia"], className: "asset-logo-nvidia", kind: "nvidia", label: "NV" },
  { symbols: ["AMD"], names: ["amd"], className: "asset-logo-amd", kind: "amd", label: "AMD" },
  { symbols: ["INTC"], names: ["intel"], className: "asset-logo-intel", kind: "intel", label: "IN" },
  { symbols: ["NFLX"], names: ["netflix"], className: "asset-logo-netflix", kind: "netflix", label: "N" },
  { symbols: ["CRM"], names: ["salesforce"], className: "asset-logo-salesforce", kind: "text", label: "CRM" },
  { symbols: ["ORCL"], names: ["oracle"], className: "asset-logo-oracle", kind: "text", label: "OR" },
  { symbols: ["JPM"], names: ["jpmorgan", "jpmorgan chase"], className: "asset-logo-bank asset-logo-jpm", kind: "bank", label: "JPM" },
  { symbols: ["BAC"], names: ["bank of america"], className: "asset-logo-bank asset-logo-bac", kind: "bank", label: "BAC" },
  { symbols: ["WFC", "GS", "MS", "HSBC"], names: ["wells fargo", "goldman", "morgan stanley", "hsbc"], className: "asset-logo-bank", kind: "bank", label: "BK" },
  { symbols: ["LLY"], names: ["eli lilly"], className: "asset-logo-health asset-logo-lly", kind: "pharma", label: "LL" },
  { symbols: ["PFE"], names: ["pfizer"], className: "asset-logo-health asset-logo-pfe", kind: "pharma", label: "PF" },
  { symbols: ["JNJ", "MRK", "ABBV", "NVO", "UNH", "AMGN"], names: ["johnson", "merck", "abbvie", "novo", "unitedhealth", "amgen"], className: "asset-logo-health", kind: "pharma", label: "Rx" },
  { symbols: ["KO", "PEP", "MCD", "COST", "WMT", "PG", "MDLZ", "KHC", "SBUX"], names: ["coca-cola", "pepsico", "mcdonald", "costco", "walmart", "starbucks"], className: "asset-logo-food", kind: "food", label: "FD" },
  { symbols: ["XOM", "CVX", "COP", "SLB", "BP", "SHEL", "TTE"], names: ["exxon", "chevron", "conocophillips", "schlumberger", "shell"], className: "asset-logo-energy", kind: "oil", label: "EN" },
  { symbols: ["PLTR"], names: ["palantir"], className: "asset-logo-ai", kind: "text", label: "AI" },
  { symbols: ["AVGO", "TSM", "QCOM", "ASML", "MU"], names: ["broadcom", "taiwan semiconductor", "qualcomm", "asml", "micron"], className: "asset-logo-semiconductor", kind: "chip", label: "CH" },
  { symbols: ["EURUSD", "EURGBP", "EURJPY", "EURCHF", "EURCAD", "EURAUD", "EURNZD"], contains: ["EUR"], className: "asset-logo-eu", kind: "eu", label: "EU" },
  { symbols: ["GBPUSD", "USDJPY", "USDCHF", "USDCAD", "AUDUSD", "NZDUSD"], className: "asset-logo-fx", kind: "fx", label: "FX" }
];

function getAssetVisual(item = {}) {
  const visual = resolveAssetVisual(item);
  return { className: visual.className, text: visual.label };
}

function getPremiumAssetVisual(item = {}) {
  const visual = resolveAssetVisual(item);
  return {
    ...visual,
    companyName: getOfficialCompanyName(item, visual),
    html: renderAssetLogo(item, { markOnly: true })
  };
}

function resolveAssetVisual(item = {}) {
  const symbol = String(item.symbol || "").toUpperCase();
  const name = String(item.name || "").toLowerCase();
  const base = getAssetBaseSymbol(symbol);
  const registered = ASSET_BRAND_REGISTRY[symbol] || ASSET_BRAND_REGISTRY[base];
  if (registered) return registered;
  const rule = ASSET_VISUAL_RULES.find((entry) => assetRuleMatches(entry, symbol, base, name));
  if (rule) return rule;

  const gulf = resolveGulfAssetVisual(symbol);
  if (gulf) return gulf;

  if (["US30", "US100", "NAS100", "SPX", "SP500", "S&P500"].some((value) => symbol.includes(value))) {
    return { className: "asset-logo-index", kind: "index", label: "IDX" };
  }

  return { className: "asset-logo-default", kind: "text", label: (base || symbol).slice(0, 3) || "S" };
}

function getOfficialCompanyName(item = {}, visual = resolveAssetVisual(item)) {
  return visual.companyName || String(item.name || item.exchangeName || item.symbol || "");
}

function renderAssetLogo(item = {}, options = {}) {
  const visual = resolveAssetVisual(item);
  const mark = renderAssetIcon(visual.kind, visual.label);
  if (options.markOnly) return mark;

  const classes = ["asset-logo", visual.className, options.className].filter(Boolean).join(" ");
  const decorative = options.decorative !== false;
  const name = getOfficialCompanyName(item, visual);
  const attributes = decorative
    ? 'aria-hidden="true"'
    : `role="img" aria-label="${escapeHtml(`${name} logo`)}"`;
  return `<span class="${classes}" ${attributes}>${mark}</span>`;
}

function assetRuleMatches(rule, symbol, base, name) {
  const compact = symbol.replace(/[^A-Z0-9]/g, "");
  const exact = rule.symbols || [];
  if (exact.some((value) => {
    const key = String(value).toUpperCase();
    return key === symbol || key === base || key === compact;
  })) return true;

  const contains = rule.contains || [];
  if (contains.some((value) => {
    const key = String(value).toUpperCase();
    return symbol.includes(key) || compact.includes(key);
  })) return true;

  const names = rule.names || [];
  return names.some((value) => name.includes(String(value).toLowerCase()));
}

function resolveGulfAssetVisual(symbol = "") {
  const upper = String(symbol || "").toUpperCase();
  const rules = [
    { test: upper.endsWith(".KW"), className: "asset-logo-gulf asset-logo-kw", label: "KW" },
    { test: upper.startsWith("SR.") || upper.endsWith(".SR"), className: "asset-logo-gulf asset-logo-sa", label: "SA" },
    { test: upper.endsWith(".AD") || upper.endsWith(".DU") || upper.endsWith(".AE"), className: "asset-logo-gulf asset-logo-ae", label: "AE" },
    { test: upper.endsWith(".OM"), className: "asset-logo-gulf asset-logo-om", label: "OM" },
    { test: upper.endsWith(".BH"), className: "asset-logo-gulf asset-logo-bh", label: "BH" },
    { test: upper.endsWith(".QA"), className: "asset-logo-gulf asset-logo-qa", label: "QA" }
  ];
  const match = rules.find((rule) => rule.test);
  return match ? { className: match.className, kind: "text", label: match.label } : null;
}

function renderAssetIcon(kind, label) {
  if (kind === "apple") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-apple" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M17.3 12.4c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.1-1.8-1.3-.1-2.6.8-3.3.8-.7 0-1.8-.8-2.9-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.8-.4 7 1.1 9.3.8 1.1 1.7 2.4 2.9 2.3 1.1 0 1.6-.7 2.9-.7 1.4 0 1.8.7 3 .7 1.2 0 2-1.1 2.8-2.3.9-1.3 1.2-2.5 1.2-2.6 0 0-2.4-.9-2.4-3.7Z"></path>
        <path d="M15.2 5.9c.6-.8 1.1-1.9.9-2.9-1 .1-2 .7-2.7 1.5-.6.7-1.1 1.8-.9 2.8 1 .1 2-.6 2.7-1.4Z"></path>
      </svg>
    `;
  }
  if (kind === "gold") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-gold" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M5.2 15.4h6.6l1.2 4.2H4Z"></path>
        <path d="M12.2 15.4h6.6l1.2 4.2h-9Z"></path>
        <path d="M8.7 8.1h6.6l1.2 4.2h-9Z"></path>
      </svg>
    `;
  }
  if (kind === "bitcoin") return `<span class="asset-logo-text asset-logo-text-bitcoin">&#8383;</span>`;
  if (kind === "ethereum") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-ethereum" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 3 6.8 12.1 12 15.2l5.2-3.1Z"></path>
        <path d="m6.8 13.2 5.2 7.8 5.2-7.8-5.2 3.1Z"></path>
      </svg>
    `;
  }
  if (kind === "bnb") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-bnb" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="m12 3.4 3 3-3 3-3-3Z"></path><path d="m6.4 9 3 3-3 3-3-3Z"></path>
        <path d="m17.6 9 3 3-3 3-3-3Z"></path><path d="m12 14.6 3 3-3 3-3-3Z"></path>
        <path d="m12 9.2 2.8 2.8-2.8 2.8-2.8-2.8Z"></path>
      </svg>
    `;
  }
  if (kind === "solana") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-solana" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 6.5h12l-2.2 2.4H3.8Z"></path><path d="M5.8 10.8h14.4L18 13.2H3.6Z"></path>
        <path d="M6 15.1h12l-2.2 2.4H3.8Z"></path>
      </svg>
    `;
  }
  if (kind === "xrp") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-xrp" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 6.2c2.6 2.7 4.1 4 6 4s3.4-1.3 6-4"></path>
        <path d="M6 17.8c2.6-2.7 4.1-4 6-4s3.4 1.3 6 4"></path>
      </svg>
    `;
  }
  if (kind === "cardano") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-cardano" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="2.2"></circle><circle cx="12" cy="4.8" r="1.1"></circle><circle cx="12" cy="19.2" r="1.1"></circle>
        <circle cx="4.8" cy="12" r="1.1"></circle><circle cx="19.2" cy="12" r="1.1"></circle>
        <circle cx="6.9" cy="6.9" r=".9"></circle><circle cx="17.1" cy="6.9" r=".9"></circle>
        <circle cx="6.9" cy="17.1" r=".9"></circle><circle cx="17.1" cy="17.1" r=".9"></circle>
      </svg>
    `;
  }
  if (kind === "avalanche") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-avalanche" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 4 21 20h-6.1L12 14.8 9.1 20H3Z"></path><path d="M14.5 13.3 17 9l2.5 4.3Z"></path>
      </svg>
    `;
  }
  if (kind === "nvidia") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-nvidia" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M3.8 12.2c3.6-4.4 9.7-5.4 16.4-2.1-3.9-.5-7 .1-9.2 1.9 2-.6 4.1-.3 5.8.8-3 3.4-7.8 4-11.7 1.3 1.5-1 3.1-1.6 4.8-1.8-2.1-.4-4.1-.1-6.1-.1Z"></path>
        <circle cx="12.7" cy="12.8" r="1.55"></circle>
      </svg>
    `;
  }
  if (kind === "amd") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-amd" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12.5 4H20v7.5h-3.1V7.1h-4.4Z"></path>
        <path d="M20 20h-7.5v-3.1h4.4v-4.4H20Z"></path>
        <path d="m4 16.8 6.8-6.8 3.2 3.2L7.2 20H4Z"></path>
      </svg>
    `;
  }
  if (kind === "intel") {
    return `<span class="asset-logo-wordmark asset-logo-wordmark-intel">intel</span>`;
  }
  if (kind === "netflix") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-netflix" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M7 4h4.1l5.9 16h-4.1Z"></path>
        <path d="M7 4h4v16H7Z"></path>
        <path d="M13 4h4v16h-4Z"></path>
      </svg>
    `;
  }
  if (kind === "oracle") return `<span class="asset-logo-wordmark asset-logo-wordmark-oracle">ORACLE</span>`;
  if (kind === "lilly") return `<span class="asset-logo-wordmark asset-logo-wordmark-lilly">Lilly</span>`;
  if (kind === "broadcom") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-broadcom" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M3.5 12h2.2c1.3-5.2 2.8-5.2 4.3 0s3 5.2 4.5 0 3-5.2 4.4 0h1.6"></path>
        <path d="M4.4 17.4h15.2"></path>
      </svg>
    `;
  }
  if (kind === "google") return `<span class="asset-logo-text asset-logo-text-google">G</span>`;
  if (kind === "amazon") {
    return `
      <span class="asset-logo-text">AM</span>
      <svg class="asset-logo-smile" viewBox="0 0 24 8" aria-hidden="true" focusable="false">
        <path d="M4 2.3c4.2 3.2 11.2 3.3 16 .1"></path>
        <path d="M17.5 1.8 20.2 2l-.8 2.3"></path>
      </svg>
    `;
  }
  if (kind === "fx") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-fx" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="9"></circle>
        <path d="M7 9h10M7 15h10M12 5.5c2.2 2.1 2.2 10.9 0 13M12 5.5c-2.2 2.1-2.2 10.9 0 13"></path>
      </svg>
    `;
  }
  if (kind === "eu") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-eu" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="9"></circle>
        <path d="M12 5.7v2.1M12 16.2v2.1M5.7 12h2.1M16.2 12h2.1M7.6 7.6l1.5 1.5M14.9 14.9l1.5 1.5M16.4 7.6l-1.5 1.5M9.1 14.9l-1.5 1.5"></path>
      </svg>
    `;
  }
  if (kind === "oil" || kind === "gas") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-oil" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 3.8c3.6 4.2 5.4 7.2 5.4 10a5.4 5.4 0 1 1-10.8 0c0-2.8 1.8-5.8 5.4-10Z"></path>
        <path d="M10 17.2c1.7 1.1 4 .5 4.8-1.5"></path>
      </svg>
    `;
  }
  if (kind === "index") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-index" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 17h16"></path><path d="M5 15 9 9l4 3 5-7"></path><path d="M16 5h2.8v2.8"></path>
      </svg>
    `;
  }
  if (kind === "microsoft") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-microsoft" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="2" y="2" width="9" height="9" fill="#f25022"></rect>
        <rect x="13" y="2" width="9" height="9" fill="#7fba00"></rect>
        <rect x="2" y="13" width="9" height="9" fill="#00a4ef"></rect>
        <rect x="13" y="13" width="9" height="9" fill="#ffb900"></rect>
      </svg>
    `;
  }
  if (kind === "meta") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-meta" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4.2 15.5c1.5-5.6 3.6-8.3 6.1-8.3 2.9 0 3.9 8.3 7 8.3 1.8 0 2.8-1.5 2.8-3.2 0-2.6-1.7-5.1-4.2-5.1-3.1 0-5.3 8.3-8.4 8.3-1.9 0-3.2-1.4-3.3-3.2-.1-2.8 1.7-5.1 4.2-5.1"></path>
      </svg>
    `;
  }
  if (kind === "tesla") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-tesla" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4.2 5.4c5.1-1.8 10.5-1.8 15.6 0"></path><path d="M8 7.4h8"></path>
        <path d="M12 7.4V20"></path><path d="M9.7 10.2 12 7.4l2.3 2.8"></path>
      </svg>
    `;
  }
  if (kind === "bank") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-bank" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 9.2 12 4l8 5.2Z"></path><path d="M6 10.8V18M10 10.8V18M14 10.8V18M18 10.8V18M4 20h16"></path>
      </svg>
      <span class="asset-logo-mini">${escapeHtml(label.slice(0, 3))}</span>
    `;
  }
  if (kind === "pharma") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-pharma" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 4v16M4 12h16"></path><circle cx="12" cy="12" r="8"></circle>
      </svg>
      <span class="asset-logo-mini">${escapeHtml(label.slice(0, 3))}</span>
    `;
  }
  if (kind === "food") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-food" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M7 4v7M10 4v7M8.5 11v9"></path><path d="M16 4c2 2.6 2 6.2 0 8v8"></path>
      </svg>
    `;
  }
  if (kind === "chip") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-chip" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="7" y="7" width="10" height="10" rx="2"></rect>
        <path d="M4 9h3M4 15h3M17 9h3M17 15h3M9 4v3M15 4v3M9 17v3M15 17v3"></path>
      </svg>
    `;
  }
  if (kind === "silver") return `<span class="asset-logo-text">Ag</span>`;
  if (kind === "copper") return `<span class="asset-logo-text">Cu</span>`;
  return `<span class="asset-logo-text">${escapeHtml(label)}</span>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

export { getAssetBaseSymbol, getAssetVisual, getPremiumAssetVisual, resolveAssetVisual, getOfficialCompanyName, renderAssetLogo, renderAssetIcon };
