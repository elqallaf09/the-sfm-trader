export const markets = {
  forex: {
    label: "الفوركس",
    region: "FX",
    note: "أزواج رئيسية من سوق العملات. أسعار Yahoo قد تكون متأخرة حسب الزوج.",
    symbols: [
      { symbol: "EURUSD=X", name: "EUR/USD" },
      { symbol: "GBPUSD=X", name: "GBP/USD" },
      { symbol: "USDJPY=X", name: "USD/JPY" },
      { symbol: "USDCHF=X", name: "USD/CHF" },
      { symbol: "AUDUSD=X", name: "AUD/USD" },
      { symbol: "USDCAD=X", name: "USD/CAD" },
      { symbol: "NZDUSD=X", name: "NZD/USD" },
      { symbol: "EURGBP=X", name: "EUR/GBP" }
    ]
  },
  crypto: {
    label: "العملات الرقمية",
    region: "Crypto",
    note: "عملات رقمية عالية السيولة مقابل الدولار. السوق يعمل 24/7 والتذبذب أعلى من الأسهم والفوركس.",
    symbols: [
      { symbol: "BTC-USD", name: "Bitcoin", shariaStatus: "doubtful", shariaLabel: "مختلف عليه" },
      { symbol: "ETH-USD", name: "Ethereum", shariaStatus: "doubtful", shariaLabel: "مختلف عليه" },
      { symbol: "BNB-USD", name: "BNB", shariaStatus: "doubtful", shariaLabel: "مختلف عليه" },
      { symbol: "SOL-USD", name: "Solana", shariaStatus: "doubtful", shariaLabel: "مختلف عليه" },
      { symbol: "XRP-USD", name: "XRP", shariaStatus: "doubtful", shariaLabel: "مختلف عليه" },
      { symbol: "ADA-USD", name: "Cardano", shariaStatus: "doubtful", shariaLabel: "مختلف عليه" },
      { symbol: "DOGE-USD", name: "Dogecoin", shariaStatus: "doubtful", shariaLabel: "مختلف عليه" },
      { symbol: "AVAX-USD", name: "Avalanche", shariaStatus: "doubtful", shariaLabel: "مختلف عليه" },
      { symbol: "LINK-USD", name: "Chainlink", shariaStatus: "doubtful", shariaLabel: "مختلف عليه" },
      { symbol: "DOT-USD", name: "Polkadot", shariaStatus: "doubtful", shariaLabel: "مختلف عليه" }
    ]
  },
  kuwait: {
    label: "بورصة الكويت",
    region: "GCC",
    note: "قد تختلف تغطية Yahoo Finance لبعض رموز الكويت.",
    symbols: [
      { symbol: "NBK.KW", name: "بنك الكويت الوطني" },
      { symbol: "KFH.KW", name: "بيت التمويل الكويتي" },
      { symbol: "ZAIN.KW", name: "زين الكويت" },
      { symbol: "BURG.KW", name: "بنك برقان" },
      { symbol: "MABANEE.KW", name: "مباني" },
      { symbol: "BOUBYAN.KW", name: "بنك بوبيان" }
    ]
  },
  saudi: {
    label: "بورصة السعودية",
    region: "GCC",
    note: "رموز تداول السعودية تستخدم لاحقة .SR في Yahoo Finance.",
    symbols: [
      { symbol: "2222.SR", name: "أرامكو السعودية" },
      { symbol: "1120.SR", name: "مصرف الراجحي" },
      { symbol: "2010.SR", name: "سابك" },
      { symbol: "7010.SR", name: "stc" },
      { symbol: "1211.SR", name: "معادن" },
      { symbol: "1180.SR", name: "الأهلي السعودي" },
      { symbol: "1150.SR", name: "مصرف الإنماء" },
      { symbol: "2380.SR", name: "بترو رابغ" }
    ]
  },
  uae: {
    label: "الإمارات",
    region: "GCC",
    note: "رموز متاحة من سوق دبي المالي عبر Yahoo Finance.",
    symbols: [
      { symbol: "EMAAR.AE", name: "إعمار العقارية" },
      { symbol: "DEWA.AE", name: "ديوا" },
      { symbol: "DIB.AE", name: "دبي الإسلامي" },
      { symbol: "EMIRATESNBD.AE", name: "الإمارات دبي الوطني" },
      { symbol: "DFM.AE", name: "سوق دبي المالي" },
      { symbol: "EMAARDEV.AE", name: "إعمار للتطوير" },
      { symbol: "DIC.AE", name: "دبي للاستثمار" },
      { symbol: "CBD.AE", name: "بنك دبي التجاري" }
    ]
  },
  qatar: {
    label: "قطر",
    region: "GCC",
    note: "رموز قطر تستخدم غالبا لاحقة .QA إن توفرت في Yahoo.",
    symbols: [
      { symbol: "QNBK.QA", name: "QNB" },
      { symbol: "IQCD.QA", name: "صناعات قطر" },
      { symbol: "MARK.QA", name: "مصرف الريان" },
      { symbol: "QIBK.QA", name: "مصرف قطر الإسلامي" },
      { symbol: "ORDS.QA", name: "أوريدو" }
    ]
  },
  bahrain: {
    label: "البحرين",
    region: "GCC",
    note: "تغطية البحرين محدودة في Yahoo Finance.",
    symbols: [
      { symbol: "NBB.BH", name: "بنك البحرين الوطني" },
      { symbol: "BATELCO.BH", name: "بتلكو" },
      { symbol: "ALBH.BH", name: "ألبا" },
      { symbol: "SALAM.BH", name: "السلام" }
    ]
  },
  oman: {
    label: "عمان",
    region: "GCC",
    note: "سوق مسقط غير متاح غالبا في Yahoo Finance المجاني؛ اربطه بمزود بيانات رسمي للتوصيات اللحظية.",
    symbols: [
      { symbol: "BKMB.OM", name: "بنك مسقط" },
      { symbol: "OMTL.OM", name: "عمانتل" },
      { symbol: "NBOB.OM", name: "البنك الوطني العماني" },
      { symbol: "OOMS.OM", name: "Oman Oil Marketing" }
    ]
  },
  gcc: {
    label: "كل بورصات الخليج",
    region: "GCC",
    note: "سلة مختارة من أكبر الأسهم الخليجية المتاحة في المصادر المجانية.",
    symbols: [
      { symbol: "2222.SR", name: "أرامكو السعودية" },
      { symbol: "1120.SR", name: "مصرف الراجحي" },
      { symbol: "7010.SR", name: "stc" },
      { symbol: "NBK.KW", name: "بنك الكويت الوطني" },
      { symbol: "KFH.KW", name: "بيت التمويل الكويتي" },
      { symbol: "ZAIN.KW", name: "زين الكويت" },
      { symbol: "EMAAR.AE", name: "إعمار العقارية" },
      { symbol: "QNBK.QA", name: "QNB" }
    ]
  },
  us: {
    label: "السوق الأمريكي",
    region: "Americas",
    note: "أسهم أمريكية عالية السيولة.",
    symbols: [
      { symbol: "GOOGL", name: "Alphabet / Google", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "AAPL", name: "Apple", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "MSFT", name: "Microsoft", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "NVDA", name: "NVIDIA", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "AMZN", name: "Amazon", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "META", name: "Meta", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "TSLA", name: "Tesla", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "AMD", name: "AMD", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "AVGO", name: "Broadcom", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "NFLX", name: "Netflix", shariaStatus: "not_compliant" },
      { symbol: "JPM", name: "JPMorgan Chase", shariaStatus: "not_compliant" },
      { symbol: "BAC", name: "Bank of America", shariaStatus: "not_compliant" },
      { symbol: "PLTR", name: "Palantir", shariaStatus: "doubtful" },
      { symbol: "COIN", name: "Coinbase", shariaStatus: "not_compliant" },
      { symbol: "INTC", name: "Intel", shariaStatus: "doubtful" },
      { symbol: "CRM", name: "Salesforce", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "ORCL", name: "Oracle", shariaStatus: "doubtful" },
      { symbol: "COST", name: "Costco", shariaStatus: "doubtful" },
      { symbol: "LLY", name: "Eli Lilly", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "UNH", name: "UnitedHealth", shariaStatus: "not_compliant" }
    ]
  },
  ai: {
    label: "أسهم الذكاء الاصطناعي",
    region: "AI / Semiconductors / Cloud",
    note: "شركات مرتبطة بالذكاء الاصطناعي، الرقائق، مراكز البيانات، السحابة، وتحليلات البيانات.",
    symbols: [
      { symbol: "NVDA", name: "NVIDIA", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "AMD", name: "AMD", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "MSFT", name: "Microsoft", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "GOOGL", name: "Alphabet / Google", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "AMZN", name: "Amazon", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "META", name: "Meta", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "AVGO", name: "Broadcom", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "PLTR", name: "Palantir", shariaStatus: "doubtful" },
      { symbol: "TSM", name: "Taiwan Semiconductor", shariaStatus: "doubtful" },
      { symbol: "ASML.AS", name: "ASML" },
      { symbol: "MU", name: "Micron Technology", shariaStatus: "doubtful" },
      { symbol: "ORCL", name: "Oracle", shariaStatus: "doubtful" },
      { symbol: "CRM", name: "Salesforce", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" }
    ]
  },
  tech: {
    label: "أسهم التقنية",
    region: "Technology",
    note: "أسهم تقنية كبرى تشمل الأجهزة، البرمجيات، السحابة، الرقائق، والإعلانات الرقمية.",
    symbols: [
      { symbol: "AAPL", name: "Apple", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "MSFT", name: "Microsoft", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "NVDA", name: "NVIDIA", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "GOOGL", name: "Alphabet / Google", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "AMZN", name: "Amazon", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "META", name: "Meta", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "AVGO", name: "Broadcom", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "AMD", name: "AMD", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "ORCL", name: "Oracle", shariaStatus: "doubtful" },
      { symbol: "CRM", name: "Salesforce", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "ADBE", name: "Adobe", shariaStatus: "doubtful" },
      { symbol: "QCOM", name: "Qualcomm", shariaStatus: "doubtful" },
      { symbol: "INTC", name: "Intel", shariaStatus: "doubtful" }
    ]
  },
  dividends: {
    label: "أسهم توزيعات الأرباح",
    region: "Dividend Stocks",
    note: "أسهم معروفة بتوزيعات أرباح دورية. راجع تاريخ الاستحقاق والعائد قبل أي قرار.",
    symbols: [
      { symbol: "KO", name: "Coca-Cola", shariaStatus: "doubtful" },
      { symbol: "PEP", name: "PepsiCo", shariaStatus: "doubtful" },
      { symbol: "PG", name: "Procter & Gamble", shariaStatus: "doubtful" },
      { symbol: "JNJ", name: "Johnson & Johnson", shariaStatus: "doubtful" },
      { symbol: "MCD", name: "McDonald's", shariaStatus: "doubtful" },
      { symbol: "XOM", name: "Exxon Mobil", shariaStatus: "doubtful" },
      { symbol: "CVX", name: "Chevron", shariaStatus: "doubtful" },
      { symbol: "ABBV", name: "AbbVie", shariaStatus: "doubtful" },
      { symbol: "IBM", name: "IBM", shariaStatus: "doubtful" },
      { symbol: "T", name: "AT&T", shariaStatus: "doubtful" },
      { symbol: "VZ", name: "Verizon", shariaStatus: "doubtful" }
    ]
  },
  healthcare: {
    label: "أسهم الرعاية الصحية والطب",
    region: "Healthcare / Pharma / Biotech",
    note: "شركات أدوية، مستشفيات، أجهزة طبية، بيوتكنولوجيا، وخدمات صحية. التصنيف الشرعي يحتاج تحقق دوري لأن بعض الشركات لديها ديون أو أنشطة مختلطة.",
    symbols: [
      { symbol: "LLY", name: "Eli Lilly", shariaStatus: "compliant", shariaLabel: "مطابق للشريعة" },
      { symbol: "JNJ", name: "Johnson & Johnson", shariaStatus: "doubtful" },
      { symbol: "MRK", name: "Merck", shariaStatus: "doubtful" },
      { symbol: "ABBV", name: "AbbVie", shariaStatus: "doubtful" },
      { symbol: "PFE", name: "Pfizer", shariaStatus: "doubtful" },
      { symbol: "TMO", name: "Thermo Fisher Scientific", shariaStatus: "doubtful" },
      { symbol: "ISRG", name: "Intuitive Surgical", shariaStatus: "doubtful" },
      { symbol: "MDT", name: "Medtronic", shariaStatus: "doubtful" },
      { symbol: "SYK", name: "Stryker", shariaStatus: "doubtful" },
      { symbol: "BSX", name: "Boston Scientific", shariaStatus: "doubtful" },
      { symbol: "AMGN", name: "Amgen", shariaStatus: "doubtful" },
      { symbol: "GILD", name: "Gilead Sciences", shariaStatus: "doubtful" },
      { symbol: "REGN", name: "Regeneron", shariaStatus: "doubtful" },
      { symbol: "MRNA", name: "Moderna", shariaStatus: "doubtful" },
      { symbol: "UNH", name: "UnitedHealth", shariaStatus: "not_compliant" }
    ]
  },
  commodities: {
    label: "الذهب والفضة والنفط",
    region: "Commodities",
    note: "سلع رئيسية: ذهب، فضة، نفط، غاز، نحاس. رموز العقود الآجلة قد تكون متأخرة حسب المزود.",
    symbols: [
      { symbol: "GC=F", name: "Gold Futures", shariaStatus: "doubtful", shariaLabel: "عقد سلعي يحتاج تحقق شرعي" },
      { symbol: "SI=F", name: "Silver Futures", shariaStatus: "doubtful", shariaLabel: "عقد سلعي يحتاج تحقق شرعي" },
      { symbol: "CL=F", name: "WTI Crude Oil", shariaStatus: "doubtful", shariaLabel: "عقد سلعي يحتاج تحقق شرعي" },
      { symbol: "BZ=F", name: "Brent Crude Oil", shariaStatus: "doubtful", shariaLabel: "عقد سلعي يحتاج تحقق شرعي" },
      { symbol: "NG=F", name: "Natural Gas", shariaStatus: "doubtful", shariaLabel: "عقد سلعي يحتاج تحقق شرعي" },
      { symbol: "HG=F", name: "Copper Futures", shariaStatus: "doubtful", shariaLabel: "عقد سلعي يحتاج تحقق شرعي" },
      { symbol: "PL=F", name: "Platinum Futures", shariaStatus: "doubtful", shariaLabel: "عقد سلعي يحتاج تحقق شرعي" }
    ]
  },
  food: {
    label: "اسهم سلع غذائية",
    region: "Food / Agriculture",
    note: "سلع غذائية مثل القهوة والكاكاو والسكر والقمح والذرة، مع أسهم شركات الطعام والمشروبات.",
    symbols: [
      { symbol: "KC=F", name: "Coffee Futures", shariaStatus: "doubtful", shariaLabel: "عقد سلعي يحتاج تحقق شرعي" },
      { symbol: "CC=F", name: "Cocoa Futures", shariaStatus: "doubtful", shariaLabel: "عقد سلعي يحتاج تحقق شرعي" },
      { symbol: "SB=F", name: "Sugar Futures", shariaStatus: "doubtful", shariaLabel: "عقد سلعي يحتاج تحقق شرعي" },
      { symbol: "ZC=F", name: "Corn Futures", shariaStatus: "doubtful", shariaLabel: "عقد سلعي يحتاج تحقق شرعي" },
      { symbol: "ZW=F", name: "Wheat Futures", shariaStatus: "doubtful", shariaLabel: "عقد سلعي يحتاج تحقق شرعي" },
      { symbol: "SBUX", name: "Starbucks", shariaStatus: "doubtful" },
      { symbol: "HSY", name: "Hershey", shariaStatus: "doubtful" },
      { symbol: "MDLZ", name: "Mondelez", shariaStatus: "doubtful" },
      { symbol: "KO", name: "Coca-Cola", shariaStatus: "doubtful" },
      { symbol: "PEP", name: "PepsiCo", shariaStatus: "doubtful" },
      { symbol: "MCD", name: "McDonald's", shariaStatus: "doubtful" }
    ]
  },
  europe: {
    label: "هولندا، ألمانيا، فرنسا، سويسرا، بريطانيا",
    region: "Netherlands / Germany / France / Switzerland / UK",
    note: "عينة من أسهم هولندا، ألمانيا، فرنسا، سويسرا، وبريطانيا.",
    symbols: [
      { symbol: "ASML.AS", name: "ASML" },
      { symbol: "SAP.DE", name: "SAP" },
      { symbol: "SIE.DE", name: "Siemens" },
      { symbol: "MC.PA", name: "LVMH" },
      { symbol: "NESN.SW", name: "Nestle" },
      { symbol: "AZN.L", name: "AstraZeneca" }
    ]
  },
  asia: {
    label: "اليابان، هونغ كونغ، الصين، كوريا",
    region: "Japan / Hong Kong / China / South Korea",
    note: "عينة من أسهم اليابان، هونغ كونغ/الصين، وكوريا الجنوبية.",
    symbols: [
      { symbol: "7203.T", name: "Toyota" },
      { symbol: "6758.T", name: "Sony" },
      { symbol: "9984.T", name: "SoftBank" },
      { symbol: "0700.HK", name: "Tencent" },
      { symbol: "9988.HK", name: "Alibaba HK" },
      { symbol: "005930.KS", name: "Samsung Electronics" }
    ]
  },
  world: {
    label: "جميع الأسواق",
    region: "Global",
    note: "يجمع كل رموز الأسواق الموجودة في التطبيق بدون تكرار: فوركس، عملات رقمية، الخليج، أمريكا، التقنية، الذكاء الاصطناعي، التوزيعات، الطب، السلع، وأوروبا وآسيا.",
    symbols: [
      { symbol: "GOOGL", name: "Alphabet / Google" },
      { symbol: "MSFT", name: "Microsoft" },
      { symbol: "NVDA", name: "NVIDIA" },
      { symbol: "ASML.AS", name: "ASML" },
      { symbol: "SAP.DE", name: "SAP" },
      { symbol: "7203.T", name: "Toyota" },
      { symbol: "0700.HK", name: "Tencent" },
      { symbol: "NESN.SW", name: "Nestle" },
      { symbol: "2222.SR", name: "أرامكو السعودية" },
      { symbol: "KFH.KW", name: "بيت التمويل الكويتي" }
    ]
  }
};

markets.world.symbols = collectAllMarketSymbols(markets);

function collectAllMarketSymbols(sourceMarkets) {
  const seen = new Set();
  const symbols = [];

  for (const [marketId, market] of Object.entries(sourceMarkets)) {
    if (marketId === "world") continue;

    for (const asset of market.symbols) {
      const symbol = asset.symbol?.trim();
      if (!symbol || seen.has(symbol)) continue;

      seen.add(symbol);
      symbols.push({ ...asset });
    }
  }

  return symbols;
}

export function getMarketSummaries() {
  return Object.entries(markets).map(([id, market]) => ({
    id,
    label: market.label,
    region: market.region,
    note: market.note,
    count: market.symbols.length
  }));
}
