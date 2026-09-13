import { markets } from "./markets.mjs";

// Search metadata only: all symbols come from the existing supported-market registry.
const arabicAliases = {
  "AAPL": [
    "أبل",
    "آبل"
  ],
  "MSFT": [
    "مايكروسوفت",
    "ميكروسوفت"
  ],
  "NVDA": [
    "إنفيديا",
    "انفيديا",
    "نيفيديا"
  ],
  "GOOGL": [
    "جوجل",
    "غوغل",
    "ألفابت"
  ],
  "GOOG": [
    "جوجل",
    "غوغل"
  ],
  "AMZN": [
    "أمازون"
  ],
  "META": [
    "ميتا",
    "فيسبوك"
  ],
  "TSLA": [
    "تسلا"
  ],
  "AMD": [
    "ايه ام دي",
    "أيه إم دي"
  ],
  "INTC": [
    "إنتل"
  ],
  "NFLX": [
    "نتفليكس"
  ],
  "AVGO": [
    "برودكوم"
  ],
  "CRM": [
    "سيلزفورس"
  ],
  "ORCL": [
    "أوراكل"
  ],
  "COST": [
    "كوستكو"
  ],
  "LLY": [
    "إيلي ليلي",
    "ايلي ليلي"
  ],
  "UNH": [
    "يونايتد هيلث"
  ],
  "JPM": [
    "جي بي مورغان"
  ],
  "BAC": [
    "بنك أوف أمريكا"
  ],
  "PLTR": [
    "بالانتير"
  ],
  "COIN": [
    "كوين بيس"
  ],
  "NBK.KW": [
    "الوطني",
    "بنك الكويت الوطني"
  ],
  "KFH.KW": [
    "بيتك",
    "بيت التمويل الكويتي"
  ],
  "ZAIN.KW": [
    "زين"
  ],
  "BOUBYAN.KW": [
    "بوبيان"
  ],
  "GBK.KW": [
    "بنك الخليج"
  ],
  "2222.SR": [
    "أرامكو",
    "ارامكو"
  ],
  "1120.SR": [
    "الراجحي"
  ],
  "BTC-USD": [
    "بيتكوين",
    "بتكوين"
  ],
  "ETH-USD": [
    "إيثريوم",
    "ايثيريوم"
  ],
  "SOL-USD": [
    "سولانا"
  ],
  "GC=F": [
    "الذهب",
    "ذهب"
  ],
  "SI=F": [
    "الفضة",
    "فضة"
  ],
  "CL=F": [
    "النفط",
    "نفط",
    "خام غرب تكساس"
  ],
  "BZ=F": [
    "برنت"
  ],
  "NG=F": [
    "الغاز الطبيعي"
  ],
  "HG=F": [
    "النحاس"
  ]
};
const primary = new Set(["forex", "us", "crypto", "commodities", "saudi", "kuwait", "uae", "qatar", "bahrain", "oman", "europe", "asia", "indices"]);
const entries = Object.entries(markets).filter(([id]) => !["gcc", "world"].includes(id))
  .sort(([a], [b]) => Number(primary.has(b)) - Number(primary.has(a)));
const bySymbol = new Map();
for (const [marketId, market] of entries) {
  for (const item of market.symbols) {
    if (bySymbol.has(item.symbol)) continue;
    const aliases = arabicAliases[item.symbol] || [];
    bySymbol.set(item.symbol, {
      symbol: item.symbol, name: item.name, nameAr: aliases[0] || item.name,
      aliases, marketId, marketLabel: market.label,
      marketLabelEn: market.labelEn, currency: item.currency || market.currency
    });
  }
}
export const instrumentCatalog = Object.freeze([...bySymbol.values()]);
