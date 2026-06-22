const COMPLIANT = { shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" };
const DOUBTFUL = { shariaStatus: "doubtful", shariaLabel: "يحتاج مراجعة شرعية" };
const NOT_COMPLIANT = { shariaStatus: "not_compliant", shariaLabel: "غير مطابق للشريعة" };
const COMMODITY_NOTE = { shariaStatus: "doubtful", shariaLabel: "عقد سلعي يحتاج تحقق شرعي" };

const asset = (symbol, name, meta = {}) => ({ symbol, name, ...meta });

export const markets = {
  forex: {
    label: "الفوركس",
    labelEn: "Forex",
    region: "FX",
    currency: "PAIR",
    timezone: "Europe/London",
    note: "أزواج عملات رئيسية. أسعار Yahoo قد تكون متأخرة حسب الزوج.",
    symbols: [
      asset("EURUSD=X", "EUR/USD"),
      asset("GBPUSD=X", "GBP/USD"),
      asset("USDJPY=X", "USD/JPY"),
      asset("USDCHF=X", "USD/CHF"),
      asset("AUDUSD=X", "AUD/USD"),
      asset("NZDUSD=X", "NZD/USD"),
      asset("USDCAD=X", "USD/CAD"),
      asset("EURGBP=X", "EUR/GBP")
    ]
  },
  us: {
    label: "الأسهم الأمريكية",
    labelEn: "US stocks",
    region: "Americas",
    currency: "USD",
    timezone: "America/New_York",
    note: "أسهم أمريكية عالية السيولة من قطاعات التقنية والاستهلاك والصحة والبنوك.",
    symbols: [
      asset("AAPL", "Apple", COMPLIANT),
      asset("MSFT", "Microsoft", COMPLIANT),
      asset("NVDA", "NVIDIA", COMPLIANT),
      asset("GOOGL", "Alphabet / Google", COMPLIANT),
      asset("AMZN", "Amazon", COMPLIANT),
      asset("META", "Meta", COMPLIANT),
      asset("TSLA", "Tesla", COMPLIANT),
      asset("AMD", "AMD", COMPLIANT),
      asset("INTC", "Intel", DOUBTFUL),
      asset("NFLX", "Netflix", NOT_COMPLIANT),
      asset("AVGO", "Broadcom", COMPLIANT),
      asset("CRM", "Salesforce", COMPLIANT),
      asset("ORCL", "Oracle", DOUBTFUL),
      asset("COST", "Costco", DOUBTFUL),
      asset("LLY", "Eli Lilly", COMPLIANT),
      asset("UNH", "UnitedHealth", NOT_COMPLIANT),
      asset("JPM", "JPMorgan Chase", NOT_COMPLIANT),
      asset("BAC", "Bank of America", NOT_COMPLIANT),
      asset("PLTR", "Palantir", DOUBTFUL),
      asset("COIN", "Coinbase", NOT_COMPLIANT)
    ]
  },
  crypto: {
    label: "العملات الرقمية",
    labelEn: "Crypto",
    region: "Crypto",
    currency: "USD",
    timezone: "Etc/UTC",
    note: "عملات رقمية عالية السيولة مقابل الدولار. السوق يعمل 24/7 والتذبذب أعلى من الأسهم والفوركس.",
    symbols: [
      asset("BTC-USD", "Bitcoin", DOUBTFUL),
      asset("ETH-USD", "Ethereum", DOUBTFUL),
      asset("BNB-USD", "BNB", DOUBTFUL),
      asset("SOL-USD", "Solana", DOUBTFUL),
      asset("XRP-USD", "XRP", DOUBTFUL),
      asset("ADA-USD", "Cardano", DOUBTFUL),
      asset("AVAX-USD", "Avalanche", DOUBTFUL),
      asset("LINK-USD", "Chainlink", DOUBTFUL),
      asset("DOT-USD", "Polkadot", DOUBTFUL),
      asset("DOGE-USD", "Dogecoin", DOUBTFUL)
    ]
  },
  commodities: {
    label: "السلع",
    labelEn: "Commodities",
    region: "Commodities",
    currency: "USD",
    timezone: "America/New_York",
    note: "ذهب وفضة ونفط وغاز ونحاس. رموز العقود الآجلة قد تكون متأخرة حسب المزود.",
    symbols: [
      asset("GC=F", "XAUUSD / Gold Futures", COMMODITY_NOTE),
      asset("SI=F", "XAGUSD / Silver Futures", COMMODITY_NOTE),
      asset("CL=F", "USOIL / WTI Crude Oil", COMMODITY_NOTE),
      asset("BZ=F", "UKOIL / Brent Crude Oil", COMMODITY_NOTE),
      asset("NG=F", "NATGAS / Natural Gas", COMMODITY_NOTE),
      asset("HG=F", "COPPER / Copper Futures", COMMODITY_NOTE),
      asset("PL=F", "Platinum Futures", COMMODITY_NOTE)
    ]
  },
  gcc: {
    label: "أسواق الخليج",
    labelEn: "Gulf markets",
    region: "GCC",
    currency: "GCC",
    timezone: "Asia/Riyadh",
    note: "سلة من أسهم دول مجلس التعاون: السعودية، الكويت، الإمارات، قطر، البحرين، وعمان.",
    symbols: []
  },
  saudi: {
    label: "السوق السعودي",
    labelEn: "Saudi market",
    region: "GCC",
    currency: "SAR",
    timezone: "Asia/Riyadh",
    note: "رموز تداول السعودية تستخدم لاحقة .SR في Yahoo Finance.",
    symbols: [
      asset("2222.SR", "أرامكو السعودية"),
      asset("1120.SR", "مصرف الراجحي"),
      asset("1180.SR", "الأهلي السعودي"),
      asset("7010.SR", "stc"),
      asset("2010.SR", "سابك"),
      asset("1211.SR", "معادن"),
      asset("7203.SR", "علم"),
      asset("1150.SR", "مصرف الإنماء"),
      asset("2380.SR", "بترو رابغ")
    ]
  },
  kuwait: {
    label: "بورصة الكويت",
    labelEn: "Kuwait market",
    region: "GCC",
    currency: "KWD",
    timezone: "Asia/Kuwait",
    note: "رموز بورصة الكويت تعرض بعملة KWD. تغطية Yahoo لبعض الرموز قد تكون محدودة.",
    symbols: [
      asset("NBK.KW", "بنك الكويت الوطني"),
      asset("KFH.KW", "بيت التمويل الكويتي"),
      asset("ZAIN.KW", "زين الكويت"),
      asset("AUB.KW", "البنك الأهلي المتحد"),
      asset("GBK.KW", "بنك الخليج"),
      asset("BOUBYAN.KW", "بنك بوبيان"),
      asset("AGILITY.KW", "أجيليتي"),
      asset("BURG.KW", "بنك برقان"),
      asset("MABANEE.KW", "مباني")
    ]
  },
  uae: {
    label: "السوق الإماراتي",
    labelEn: "UAE market",
    region: "GCC",
    currency: "AED",
    timezone: "Asia/Dubai",
    note: "أسهم من سوق دبي وأبوظبي حسب الرموز المتاحة في المزود.",
    symbols: [
      asset("EMAAR.AE", "إعمار العقارية"),
      asset("DIB.AE", "دبي الإسلامي"),
      asset("FAB.AD", "بنك أبوظبي الأول"),
      asset("EAND.AD", "e&"),
      asset("ADNOCGAS.AD", "أدنوك للغاز"),
      asset("DEWA.DU", "ديوا"),
      asset("DFM.AE", "سوق دبي المالي"),
      asset("EMAARDEV.AE", "إعمار للتطوير")
    ]
  },
  qatar: {
    label: "السوق القطري",
    labelEn: "Qatar market",
    region: "GCC",
    currency: "QAR",
    timezone: "Asia/Qatar",
    note: "رموز قطر تستخدم غالبا لاحقة .QA عند توفرها في Yahoo.",
    symbols: [
      asset("QNBK.QA", "QNB"),
      asset("IQCD.QA", "صناعات قطر"),
      asset("MARK.QA", "مصرف الريان"),
      asset("QIBK.QA", "مصرف قطر الإسلامي"),
      asset("ORDS.QA", "أوريدو")
    ]
  },
  bahrain: {
    label: "السوق البحريني",
    labelEn: "Bahrain market",
    region: "GCC",
    currency: "BHD",
    timezone: "Asia/Bahrain",
    note: "تغطية البحرين محدودة في Yahoo Finance وقد تحتاج مزودا رسميا للبيانات اللحظية.",
    symbols: [
      asset("NBB.BH", "بنك البحرين الوطني"),
      asset("ALBH.BH", "ألبا"),
      asset("BEYON.BH", "بيون"),
      asset("SALAM.BH", "السلام")
    ]
  },
  oman: {
    label: "السوق العماني",
    labelEn: "Oman market",
    region: "GCC",
    currency: "OMR",
    timezone: "Asia/Muscat",
    note: "سوق مسقط غير متاح غالبا في Yahoo Finance المجاني؛ اربطه بمزود رسمي للتوصيات اللحظية.",
    symbols: [
      asset("BKMB.OM", "بنك مسقط"),
      asset("OMANTEL.OM", "عمانتل"),
      asset("NBO.OM", "البنك الوطني العماني"),
      asset("OMINVEST.OM", "أومينفست"),
      asset("OOMS.OM", "Oman Oil Marketing")
    ]
  },
  europe: {
    label: "الأسهم الأوروبية",
    labelEn: "European stocks",
    region: "Europe",
    currency: "EUR",
    timezone: "Europe/Paris",
    note: "أسهم أوروبية من هولندا وألمانيا وفرنسا وسويسرا وبريطانيا.",
    symbols: [
      asset("ASML.AS", "ASML"),
      asset("SAP.DE", "SAP"),
      asset("SHEL", "Shell"),
      asset("TTE", "TotalEnergies"),
      asset("MC.PA", "LVMH"),
      asset("SIE.DE", "Siemens"),
      asset("AIR.PA", "Airbus"),
      asset("NESN.SW", "Nestle"),
      asset("AZN.L", "AstraZeneca")
    ]
  },
  asia: {
    label: "الأسهم الآسيوية",
    labelEn: "Asian stocks",
    region: "Asia",
    currency: "USD",
    timezone: "Asia/Tokyo",
    note: "أسهم آسيوية من اليابان والصين وهونغ كونغ وكوريا وتايوان.",
    symbols: [
      asset("TSM", "Taiwan Semiconductor"),
      asset("BABA", "Alibaba"),
      asset("TCEHY", "Tencent"),
      asset("SONY", "Sony"),
      asset("TM", "Toyota"),
      asset("005930.KS", "Samsung Electronics"),
      asset("9988.HK", "Alibaba HK"),
      asset("7203.T", "Toyota Japan"),
      asset("0700.HK", "Tencent HK")
    ]
  },
  tech: {
    label: "أسهم التقنية",
    labelEn: "Technology stocks",
    region: "Technology",
    currency: "USD",
    timezone: "America/New_York",
    note: "أسهم تقنية كبرى تشمل الأجهزة والبرمجيات والسحابة والرقائق والإعلانات الرقمية.",
    symbols: [
      asset("AAPL", "Apple", COMPLIANT),
      asset("MSFT", "Microsoft", COMPLIANT),
      asset("NVDA", "NVIDIA", COMPLIANT),
      asset("GOOGL", "Alphabet / Google", COMPLIANT),
      asset("META", "Meta", COMPLIANT),
      asset("AMD", "AMD", COMPLIANT),
      asset("INTC", "Intel", DOUBTFUL),
      asset("ORCL", "Oracle", DOUBTFUL),
      asset("CRM", "Salesforce", COMPLIANT),
      asset("AVGO", "Broadcom", COMPLIANT),
      asset("TSM", "Taiwan Semiconductor", DOUBTFUL),
      asset("QCOM", "Qualcomm", DOUBTFUL),
      asset("ADBE", "Adobe", DOUBTFUL)
    ]
  },
  food: {
    label: "الأسهم الغذائية",
    labelEn: "Food / consumer staples",
    region: "Consumer Staples",
    currency: "USD",
    timezone: "America/New_York",
    note: "أسهم شركات الطعام والمشروبات والاستهلاك الأساسي مثل القهوة والكولا والتجزئة الغذائية.",
    symbols: [
      asset("KO", "Coca-Cola", DOUBTFUL),
      asset("PEP", "PepsiCo", DOUBTFUL),
      asset("MCD", "McDonald's", DOUBTFUL),
      asset("COST", "Costco", DOUBTFUL),
      asset("WMT", "Walmart", DOUBTFUL),
      asset("PG", "Procter & Gamble", DOUBTFUL),
      asset("MDLZ", "Mondelez", DOUBTFUL),
      asset("KHC", "Kraft Heinz", DOUBTFUL),
      asset("SBUX", "Starbucks", DOUBTFUL)
    ]
  },
  healthcare: {
    label: "الأسهم الدوائية",
    labelEn: "Pharmaceutical / healthcare",
    region: "Healthcare",
    currency: "USD",
    timezone: "America/New_York",
    note: "شركات أدوية ورعاية صحية وأجهزة طبية. التصنيف الشرعي يحتاج تحقق دوري لأن بعض الشركات لديها أنشطة أو ديون مختلطة.",
    symbols: [
      asset("LLY", "Eli Lilly", COMPLIANT),
      asset("JNJ", "Johnson & Johnson", DOUBTFUL),
      asset("PFE", "Pfizer", DOUBTFUL),
      asset("MRK", "Merck", DOUBTFUL),
      asset("ABBV", "AbbVie", DOUBTFUL),
      asset("NVO", "Novo Nordisk", DOUBTFUL),
      asset("UNH", "UnitedHealth", NOT_COMPLIANT),
      asset("AMGN", "Amgen", DOUBTFUL),
      asset("TMO", "Thermo Fisher Scientific", DOUBTFUL),
      asset("ISRG", "Intuitive Surgical", DOUBTFUL)
    ]
  },
  banking: {
    label: "أسهم البنوك",
    labelEn: "Banking stocks",
    region: "Financials",
    currency: "USD",
    timezone: "America/New_York",
    note: "أسهم بنوك عالمية. غالبا تحتاج فلترة شرعية صارمة بسبب طبيعة النشاط والرافعة المالية.",
    symbols: [
      asset("JPM", "JPMorgan Chase", NOT_COMPLIANT),
      asset("BAC", "Bank of America", NOT_COMPLIANT),
      asset("WFC", "Wells Fargo", NOT_COMPLIANT),
      asset("C", "Citigroup", NOT_COMPLIANT),
      asset("GS", "Goldman Sachs", NOT_COMPLIANT),
      asset("MS", "Morgan Stanley", NOT_COMPLIANT),
      asset("HSBC", "HSBC", NOT_COMPLIANT)
    ]
  },
  energy: {
    label: "أسهم الطاقة",
    labelEn: "Energy stocks",
    region: "Energy",
    currency: "USD",
    timezone: "America/New_York",
    note: "أسهم النفط والغاز والطاقة العالمية، مع حساسية عالية لأخبار المخزون والأسعار الجيوسياسية.",
    symbols: [
      asset("XOM", "Exxon Mobil", DOUBTFUL),
      asset("CVX", "Chevron", DOUBTFUL),
      asset("COP", "ConocoPhillips", DOUBTFUL),
      asset("SLB", "Schlumberger", DOUBTFUL),
      asset("BP", "BP", DOUBTFUL),
      asset("SHEL", "Shell", DOUBTFUL),
      asset("TTE", "TotalEnergies", DOUBTFUL)
    ]
  },
  ai: {
    label: "أسهم الذكاء الاصطناعي",
    labelEn: "AI stocks",
    region: "AI / Cloud",
    currency: "USD",
    timezone: "America/New_York",
    note: "شركات مرتبطة بالذكاء الاصطناعي والرقائق ومراكز البيانات والسحابة وتحليلات البيانات.",
    symbols: [
      asset("NVDA", "NVIDIA", COMPLIANT),
      asset("MSFT", "Microsoft", COMPLIANT),
      asset("GOOGL", "Alphabet / Google", COMPLIANT),
      asset("AMD", "AMD", COMPLIANT),
      asset("PLTR", "Palantir", DOUBTFUL),
      asset("META", "Meta", COMPLIANT),
      asset("AVGO", "Broadcom", COMPLIANT),
      asset("ORCL", "Oracle", DOUBTFUL),
      asset("AMZN", "Amazon", COMPLIANT),
      asset("CRM", "Salesforce", COMPLIANT)
    ]
  },
  semiconductors: {
    label: "أسهم أشباه الموصلات",
    labelEn: "Semiconductor stocks",
    region: "Semiconductors",
    currency: "USD",
    timezone: "America/New_York",
    note: "أسهم رقائق ومعالجات ومعدات تصنيع الشرائح، وهي قلب دورة الذكاء الاصطناعي والحوسبة.",
    symbols: [
      asset("NVDA", "NVIDIA", COMPLIANT),
      asset("AMD", "AMD", COMPLIANT),
      asset("INTC", "Intel", DOUBTFUL),
      asset("AVGO", "Broadcom", COMPLIANT),
      asset("TSM", "Taiwan Semiconductor", DOUBTFUL),
      asset("QCOM", "Qualcomm", DOUBTFUL),
      asset("ASML", "ASML", DOUBTFUL),
      asset("MU", "Micron Technology", DOUBTFUL)
    ]
  },
  dividends: {
    label: "أسهم توزيعات الأرباح",
    labelEn: "Dividend stocks",
    region: "Dividend Stocks",
    currency: "USD",
    timezone: "America/New_York",
    note: "أسهم معروفة بتوزيعات أرباح دورية. راجع تاريخ الاستحقاق والعائد قبل أي قرار.",
    symbols: [
      asset("KO", "Coca-Cola", DOUBTFUL),
      asset("PEP", "PepsiCo", DOUBTFUL),
      asset("PG", "Procter & Gamble", DOUBTFUL),
      asset("JNJ", "Johnson & Johnson", DOUBTFUL),
      asset("MCD", "McDonald's", DOUBTFUL),
      asset("XOM", "Exxon Mobil", DOUBTFUL),
      asset("CVX", "Chevron", DOUBTFUL),
      asset("ABBV", "AbbVie", DOUBTFUL),
      asset("IBM", "IBM", DOUBTFUL),
      asset("T", "AT&T", DOUBTFUL),
      asset("VZ", "Verizon", DOUBTFUL)
    ]
  },
  world: {
    label: "جميع الأسواق",
    labelEn: "All markets",
    region: "Global",
    currency: "MIXED",
    timezone: "Etc/UTC",
    note: "يجمع كل رموز الأسواق الموجودة في التطبيق بدون تكرار.",
    symbols: []
  }
};

markets.gcc.symbols = collectMarketSymbols(markets, ["saudi", "kuwait", "uae", "qatar", "bahrain", "oman"]);
markets.world.symbols = collectAllMarketSymbols(markets);

function collectMarketSymbols(sourceMarkets, marketIds) {
  const seen = new Set();
  const symbols = [];

  for (const marketId of marketIds) {
    const market = sourceMarkets[marketId];
    if (!market) continue;

    for (const item of market.symbols) {
      const symbol = item.symbol?.trim();
      if (!symbol || seen.has(symbol)) continue;
      seen.add(symbol);
      symbols.push({ ...item });
    }
  }

  return symbols;
}

function collectAllMarketSymbols(sourceMarkets) {
  const seen = new Set();
  const symbols = [];

  for (const [marketId, market] of Object.entries(sourceMarkets)) {
    if (marketId === "world") continue;

    for (const item of market.symbols) {
      const symbol = item.symbol?.trim();
      if (!symbol || seen.has(symbol)) continue;
      seen.add(symbol);
      symbols.push({ ...item });
    }
  }

  return symbols;
}

export function getMarketSummaries() {
  return Object.entries(markets).map(([id, market]) => ({
    id,
    label: market.label,
    labelEn: market.labelEn,
    region: market.region,
    currency: market.currency,
    timezone: market.timezone,
    note: market.note,
    count: market.symbols.length
  }));
}
