const params = new URLSearchParams(window.location.search);
const symbol = params.get("symbol") || "";
const NUMBER_LOCALE = "ar-KW-u-nu-latn";
const NUMBER_OPTIONS = { numberingSystem: "latn" };
const APP_SETTINGS_STORAGE_KEY = "the-sfm-trader-settings";

function normalizeDigits(value) {
  return String(value ?? "")
    .replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (digit) => {
      const code = digit.charCodeAt(0);
      return String(code >= 0x06f0 ? code - 0x06f0 : code - 0x0660);
    })
    .replace(/\u066B/g, ".")
    .replace(/\u066C/g, ",")
    .replace(/\u066A/g, "%")
    .replace(/[\u061C\u200E\u200F]/g, "");
}

const NON_LATIN_NUMBER_CHARS = /[\u0660-\u0669\u06F0-\u06F9\u066A\u066B\u066C\u061C\u200E\u200F]/;
const DIGIT_NORMALIZED_ATTRIBUTES = ["placeholder", "title", "aria-label", "aria-valuetext", "alt"];
const DIGIT_NORMALIZER_SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"]);

function normalizeDigitString(value) {
  return NON_LATIN_NUMBER_CHARS.test(value) ? normalizeDigits(value) : value;
}

function normalizeDigitTextNode(node) {
  const value = node.nodeValue;
  if (value && NON_LATIN_NUMBER_CHARS.test(value)) node.nodeValue = normalizeDigits(value);
}

function normalizeDigitElement(element) {
  if (!element || DIGIT_NORMALIZER_SKIP_TAGS.has(element.tagName)) return;
  DIGIT_NORMALIZED_ATTRIBUTES.forEach((attribute) => {
    const value = element.getAttribute(attribute);
    if (value && NON_LATIN_NUMBER_CHARS.test(value)) element.setAttribute(attribute, normalizeDigits(value));
  });
  if ((element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) && element.type !== "password") {
    element.value = normalizeDigitString(element.value);
  }
}

function normalizeDigitTree(root) {
  if (!root) return;
  if (root.nodeType === Node.TEXT_NODE) {
    normalizeDigitTextNode(root);
    return;
  }
  if (!(root instanceof Element || root instanceof DocumentFragment)) return;
  if (root instanceof Element) {
    if (DIGIT_NORMALIZER_SKIP_TAGS.has(root.tagName)) return;
    normalizeDigitElement(root);
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (node instanceof Element && DIGIT_NORMALIZER_SKIP_TAGS.has(node.tagName)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  let current = walker.nextNode();
  while (current) {
    if (current.nodeType === Node.TEXT_NODE) normalizeDigitTextNode(current);
    else if (current instanceof Element) normalizeDigitElement(current);
    current = walker.nextNode();
  }
}

function normalizeDigitInputEvent(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) || target.type === "password") return;
  if (!NON_LATIN_NUMBER_CHARS.test(target.value)) return;
  const start = target.selectionStart;
  const end = target.selectionEnd;
  target.value = normalizeDigits(target.value);
  if (start !== null && end !== null) {
    try {
      target.setSelectionRange(start, end);
    } catch {
      // Date/time inputs do not expose selection ranges.
    }
  }
}

function installLatinDigitNormalizer() {
  if (!document.body) return;
  normalizeDigitTree(document.body);
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "characterData") normalizeDigitTree(mutation.target);
      else if (mutation.type === "attributes") normalizeDigitElement(mutation.target);
      else mutation.addedNodes.forEach(normalizeDigitTree);
    });
  });
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: DIGIT_NORMALIZED_ATTRIBUTES,
    characterData: true,
    childList: true,
    subtree: true
  });
  document.addEventListener("input", normalizeDigitInputEvent, true);
  document.addEventListener("change", normalizeDigitInputEvent, true);
}

const DETAIL_TEXT_TRANSLATIONS = {
  "تفاصيل السهم - the-sfm trader": "Stock details - the-sfm trader",
  "صفحة تحليل السهم": "Stock analysis page",
  "رجوع للأسواق": "Back to markets",
  "تحميل التحليل": "Loading analysis",
  "تنبيه لحظي": "Live alert",
  "يتم تجهيز التوصية.": "Preparing the recommendation.",
  "السعر الحالي": "Current price",
  "السعر المتوقع": "Expected price",
  "هدف 1": "Target 1",
  "هدف 2": "Target 2",
  "وقف الخسارة": "Stop loss",
  "الدعم": "Support",
  "المقاومة": "Resistance",
  "الحركة المتوقعة": "Expected move",
  "المدة": "Duration",
  "السكور": "Score",
  "المخاطرة": "Risk",
  "جودة التحليل": "Analysis quality",
  "صحة البيانات": "Data health",
  "معلومات عامة": "General information",
  "ما هو السهم؟": "What is this stock?",
  "الشرعية": "Sharia",
  "التوافق الشرعي": "Sharia compliance",
  "من دقيقة إلى شهر": "From 1 minute to 1 month",
  "تحليل الفريمات": "Timeframe analysis",
  "تجميع سريع يوضح هل الفريمات القصيرة والطويلة متفقة أو متضاربة.": "A quick summary showing whether short and long timeframes agree or conflict.",
  "التوقعات": "Outlook",
  "الأهداف القادمة": "Upcoming targets",
  "الأسباب": "Reasons",
  "لماذا هذه التوصية؟": "Why this recommendation?",
  "الرسم المختصر": "Mini chart",
  "حركة السعر الأخيرة": "Recent price action",
  "رسم حركة السعر": "Price movement chart",
  "اختبار خلفي": "Backtest",
  "جودة الإشارة": "Signal quality",
  "لم يتم تحديد رمز السهم.": "No stock symbol was selected.",
  "جاري تحليل السهم": "Analyzing the stock",
  "تعذر تحميل تفاصيل السهم": "Could not load stock details",
  "بيانات مخزنة لحظياً": "Live cached data",
  "تحليل جديد": "Fresh analysis",
  "لا تتوفر معلومات وصفية كافية لهذا الرمز.": "Not enough descriptive information is available for this symbol.",
  "ثقة": "confidence",
  "توافق الفريمات": "Timeframe agreement",
  "تغطية": "coverage",
  "الاختصاص": "Specialty",
  "السوق": "Market",
  "المنطقة": "Region",
  "البورصة": "Exchange",
  "العملة": "Currency",
  "حالة السوق": "Market status",
  "ملاحظة المزود": "Provider note",
  "حجم التداول النسبي": "Relative volume",
  "غير معروف": "Unknown",
  "لا يوجد تصنيف شرعي مؤكد.": "No confirmed Sharia rating is available.",
  "مطابق للشريعة": "Sharia compliant",
  "غير مطابق للشريعة": "Not Sharia compliant",
  "مختلف عليه شرعياً": "Sharia status is disputed",
  "المصدر": "Source",
  "تصنيف داخلي قابل للتحديث": "Internal rating, subject to updates",
  "آخر مراجعة": "Last review",
  "الفريمات غير مكتملة لهذا الرمز حالياً.": "Timeframes are currently incomplete for this symbol.",
  "الثقة": "Confidence",
  "الزخم": "Momentum",
  "الاتجاه": "Trend",
  "لا توجد أهداف شهرية متاحة لهذا الرمز.": "No monthly targets are available for this symbol.",
  "لا توجد أسباب كافية لهذا الرمز حالياً.": "No sufficient reasons are available for this symbol right now.",
  "معدل النجاح": "Win rate",
  "عدد العينات": "Samples",
  "أفق الاختبار": "Test horizon",
  "يوم": "days",
  "متوسط العائد": "Average return",
  "خطة التنفيذ": "Execution plan",
  "ملاحظات المخاطرة": "Risk notes",
  "اشتر الآن": "Buy now",
  "إشارة شراء قوية": "Strong buy signal",
  "الفريمات متوافقة بنسبة": "Timeframes agree by",
  "والثقة": "and confidence",
  "راقب السعر والهدف قبل التنفيذ.": "Watch price and target before execution.",
  "بيع الآن": "Sell now",
  "إشارة بيع واضحة": "Clear sell signal",
  "الاتجاه يميل للبيع بثقة": "The trend leans sell with confidence",
  "تجنب الدخول الشرائي حتى تتغير الفريمات.": "Avoid long entry until the timeframes change.",
  "انتظر": "Wait",
  "لا تتداول هذا السهم الآن": "Do not trade this stock now",
  "الإشارات غير كافية أو متضاربة. الأفضل الانتظار حتى تتوافق فريمات الدخول مع اليومي.": "Signals are insufficient or conflicting. It is better to wait until entry timeframes align with the daily.",
  "تعذر التحميل": "Loading failed",
  "قوي جداً": "Very strong",
  "قوي": "Strong",
  "متوسط": "Medium",
  "ضعيف": "Weak"
};
const DETAIL_EXTRA_TEXT_TRANSLATIONS = {
  "تحديث الصفحة الآن": "Refresh page now",
  "النفط والطاقة": "Oil and energy",
  "يحتاج تدقيق شرعي": "Requires Sharia review",
  "يحتاج مراجعة شرعية": "Requires Sharia review",
  "عقد سلعي يحتاج تحقق شرعي": "Commodity contract requires Sharia review",
  "لا يوجد تصنيف شرعي مؤكد لهذا الرمز داخل التطبيق حالياً": "No confirmed Sharia classification is available for this symbol in the app right now",
  "لا يوجد تصنيف شرعي مؤكد لهذا الرمز داخل التطبيق حالياً.": "No confirmed Sharia classification is available for this symbol in the app right now.",
  "التصنيف الداخلي قابل للتحديث": "Internal classification may be updated",
  "تصنيف داخلي قابل للتحديث": "Internal classification may be updated",
  "تصنيف محلي مبني على مراجع فحص شرعي عامة، ويحتاج تحديث دوري": "Local classification based on general Sharia screening references and requiring periodic updates",
  "مصنف داخلياً كمتوافق مع الشريعة حسب البيانات المتاحة في التطبيق.": "Internally classified as Sharia compliant based on the data available in the app.",
  "مصنف داخلياً كغير متوافق مع الشريعة، ويفضل تجنبه إذا كان شرطك الالتزام الشرعي.": "Internally classified as not Sharia compliant; it is better to avoid it if Sharia compliance is required.",
  "التصنيف الشرعي غير محسوم في بيانات التطبيق ويحتاج مراجعة جهة فحص شرعي.": "The Sharia classification is not conclusive in the app data and requires review by a Sharia screening provider.",
  "مختلف عليه": "Disputed",
  "مختلف عليه شرعياً": "Disputed Sharia status",
  "مخاطرة مرتفعة": "High risk",
  "مخاطرة عالية": "High risk",
  "مخاطرة متوسطة": "Medium risk",
  "مخاطرة منخفضة": "Low risk",
  "صاعد": "Bullish",
  "صاعدة": "Bullish",
  "هابط": "Bearish",
  "هابطة": "Bearish",
  "مختلط": "Mixed",
  "عرضي": "Sideways",
  "محايد": "Neutral",
  "ممتازة": "Excellent",
  "قوية": "Strong",
  "متوسطة": "Medium",
  "طبيعية": "Normal",
  "طبيعي": "Normal",
  "مرتفع": "High",
  "منخفض": "Low",
  "منخفضة": "Low",
  "ضعيفة": "Weak",
  "بيانات غير كافية": "Insufficient data",
  "تجنب الصفقة الآن": "Avoid this trade now",
  "فرصة شراء مشروطة": "Conditional buy opportunity",
  "ضغط بيعي واضح": "Clear selling pressure",
  "انتظار تأكيد": "Wait for confirmation",
  "اشتر": "Buy",
  "لا تتداول": "Do not trade",
  "لا توجد صفقة واضحة؛ انتظار توافق الفريمات.": "No clear trade is available; wait for timeframe agreement.",
  "لا توجد صفقة واضحة؛ انتظار توافق الفريمات": "No clear trade is available; wait for timeframe agreement",
  "الإشارة غير كافية للدخول. الأفضل انتظار توافق الفريمات السريعة مع اليومي.": "The signal is not strong enough for entry. It is better to wait for the fast timeframes to align with the daily.",
  "المخاطرة عالية مقارنة بجودة الإشارة.": "Risk is high compared with signal quality.",
  "المخاطرة عالية مقارنة بجودة الإشارة": "Risk is high compared with signal quality",
  "انتظار حتى يتوافق 15 دقيقة + الساعة + اليوم": "Wait until the 15-minute, hourly, and daily timeframes align",
  "15 دقيقة إلى 4 أسابيع": "15 minutes to 4 weeks",
  "1 يوم إلى 6 أسابيع": "1 day to 6 weeks",
  "3 إلى 10 أيام": "3 to 10 days",
  "العائد إلى المخاطرة غير مكتمل": "Risk/reward ratio is incomplete",
  "لا توجد أخبار اقتصادية مؤثرة قريبة على هذا الرمز.": "No nearby high-impact economic events are affecting this symbol.",
  "انتظار حتى يهدأ تأثير الخبر ثم إعادة قراءة الشارت": "Wait until the news impact settles, then reread the chart",
  "انتظار حتى تتحسن جودة البيانات ويتوافق اليومي مع الفريمات السريعة": "Wait until data quality improves and the daily timeframe aligns with the fast timeframes",
  "خطة الصفقة غير مكتملة لأن العائد مقابل المخاطرة غير واضح.": "The trade plan is incomplete because the risk/reward ratio is unclear.",
  "العائد مقابل المخاطرة ضعيف؛ تم إلغاء إشارة الدخول.": "The risk/reward ratio is weak, so the entry signal was cancelled.",
  "العائد مقابل المخاطرة مقبول بصعوبة، لذلك الثقة محدودة.": "The risk/reward ratio is barely acceptable, so confidence is limited.",
  "تفاوت السعر بين الفريمات مرتفع؛ تم تحويل القرار إلى انتظار حتى تتطابق البيانات.": "Price variance across timeframes is high, so the decision was changed to wait until the data aligns.",
  "جودة البيانات منخفضة؛ لا توجد ثقة كافية لإصدار شراء أو بيع الآن.": "Data quality is low; there is not enough confidence to issue a buy or sell signal now.",
  "الفريم اليومي يعاكس قرار الفريمات الأخرى؛ الأفضل انتظار تأكيد أوضح.": "The daily timeframe conflicts with the other timeframes, so it is better to wait for clearer confirmation.",
  "السعر أعلى من متوسط 20 يوم": "Price is above the 20-day average",
  "السعر أدنى من متوسط 20 يوم": "Price is below the 20-day average",
  "الاتجاه فوق متوسط 50 يوم": "Trend is above the 50-day average",
  "الاتجاه تحت متوسط 50 يوم": "Trend is below the 50-day average",
  "متوسط 20 يوم أعلى من متوسط 50 يوم": "The 20-day average is above the 50-day average",
  "متوسط 20 يوم أقل من متوسط 50 يوم": "The 20-day average is below the 50-day average",
  "MACD إيجابي": "MACD is positive",
  "MACD سلبي": "MACD is negative",
  "السعر فوق VWAP: المشترون أقوى": "Price is above VWAP: buyers are stronger",
  "السعر تحت VWAP: ضغط بيعي": "Price is below VWAP: selling pressure",
  "زخم شهر إيجابي": "One-month momentum is positive",
  "زخم شهر سلبي": "One-month momentum is negative",
  "RSI منخفض: احتمال ارتداد": "RSI is low: possible rebound",
  "RSI مرتفع: احتمال جني أرباح": "RSI is high: possible profit-taking",
  "RSI في نطاق محايد": "RSI is in a neutral range",
  "النشاط أعلى من المعتاد": "Activity is above normal",
  "حجم تداول لحظي أعلى من المتوسط": "Intraday volume is above average",
  "حجم التداول ضعيف": "Trading volume is weak",
  "التذبذب مرتفع نسبيا": "Volatility is relatively high",
  "الإشارات متقاربة ولا تعطي أفضلية واضحة": "Signals are close and do not provide a clear edge",
  "لا يوجد تضارب قوي بين الفريمات الأساسية والسريعة": "No strong conflict between core and fast timeframes",
  "فريمات الدخول تدعم القرار": "Entry timeframes support the decision",
  "تذبذب منخفض": "Low volatility",
  "تذبذب متوسط": "Medium volatility",
  "تذبذب مرتفع": "High volatility",
  "الإشارة ليست حادة": "The signal is not sharp",
  "توافق الفريمات متوسط": "Medium timeframe agreement",
  "النشاط أقل من المعتاد": "Activity is below normal",
  "RSI عند طرف قوي": "RSI is at a strong edge",
  "الفريمات السريعة": "Fast timeframes",
  "الفريمات الطويلة": "Long timeframes",
  "يوجد تضارب": "Conflict detected",
  "دقيقة": "1 minute",
  "15 دقيقة": "15 minutes",
  "30 دقيقة": "30 minutes",
  "ساعة": "1 hour",
  "يومي": "Daily",
  "أسبوعي": "Weekly",
  "شهري": "Monthly",
  "سنوي": "Yearly",
  "زوج عملات فوركس": "Forex currency pair",
  "أصل رقمي مشفر": "Crypto asset",
  "سلعة أو عقد آجل": "Commodity or futures contract",
  "مؤشر سوق": "Market index",
  "أداة مالية مدرجة": "Listed financial instrument",
  "عملة رقمية ومخزن قيمة رقمي": "Digital currency and digital store of value",
  "شبكة عقود ذكية وتطبيقات لامركزية": "Smart-contract network and decentralized applications",
  "أصل رقمي لمنظومة تداول وبلوكتشين": "Digital asset for a trading and blockchain ecosystem",
  "شبكة بلوك تشين عالية السرعة": "High-speed blockchain network",
  "مدفوعات وتحويلات رقمية": "Digital payments and transfers",
  "شبكة عقود ذكية": "Smart-contract network",
  "شبكة تطبيقات لامركزية": "Decentralized applications network",
  "أوراكل بيانات للبلوكتشين": "Blockchain data oracle",
  "شبكة ربط بين سلاسل البلوكتشين": "Interoperability network for blockchains",
  "ذهب - عقد آجل": "Gold futures",
  "فضة - عقد آجل": "Silver futures",
  "نفط خام WTI - عقد آجل": "WTI crude oil futures",
  "نفط برنت - عقد آجل": "Brent crude oil futures",
  "غاز طبيعي - عقد آجل": "Natural gas futures",
  "نحاس - عقد آجل": "Copper futures",
  "تقنية استهلاكية وأجهزة ذكية": "Consumer technology and smart devices",
  "برمجيات وحوسبة سحابية وذكاء اصطناعي": "Software, cloud computing, and AI",
  "رقائق رسومية وذكاء اصطناعي": "Graphics chips and AI",
  "معالجات ورقائق حوسبة": "Processors and computing chips",
  "إعلانات رقمية وبحث وسحابة": "Digital advertising, search, and cloud",
  "تجارة إلكترونية وحوسبة سحابية": "E-commerce and cloud computing",
  "سيارات كهربائية وطاقة": "Electric vehicles and energy",
  "شبكات اجتماعية وإعلانات رقمية": "Social networks and digital advertising",
  "مصرفية إسلامية": "Islamic banking",
  "مصرفية تقليدية": "Traditional banking",
  "اتصالات وخدمات رقمية": "Telecom and digital services",
  "أزواج عملات رئيسية. أسعار Yahoo قد تكون متأخرة حسب الزوج.": "Major currency pairs. Yahoo prices may be delayed depending on the pair.",
  "ذهب وفضة ونفط وغاز ونحاس. رموز العقود الآجلة قد تكون متأخرة حسب المزود.": "Gold, silver, oil, gas, and copper. Futures symbols may be delayed depending on the provider.",
  "أسهم أمريكية عالية السيولة من قطاعات التقنية والاستهلاك والصحة والبنوك.": "Highly liquid US stocks from technology, consumer, healthcare, and banking sectors.",
  "Alphabet / Google تعمل في البحث، الإعلانات، YouTube، Android، Google Cloud، وتقنيات الذكاء الاصطناعي.": "Alphabet / Google operates in search, advertising, YouTube, Android, Google Cloud, and AI technologies.",
  "Apple تعمل في iPhone وMac وiPad والخدمات الرقمية ومتجر التطبيقات، وتتداول في السوق الأمريكي.": "Apple operates in iPhone, Mac, iPad, digital services, and the App Store, and trades in the US market.",
  "Microsoft تعمل في أنظمة التشغيل، Azure، Office، الألعاب، وخدمات الذكاء الاصطناعي، وتتداول في السوق الأمريكي.": "Microsoft operates in operating systems, Azure, Office, gaming, and AI services, and trades in the US market.",
  "NVIDIA تقود سوق معالجات الرسوم ومسرعات الذكاء الاصطناعي ومراكز البيانات، وتتداول في السوق الأمريكي.": "NVIDIA leads graphics processors, AI accelerators, and data centers, and trades in the US market.",
  "AMD تعمل في معالجات الحواسيب والخوادم والبطاقات الرسومية ومسرعات الذكاء الاصطناعي، وتتداول في السوق الأمريكي.": "AMD operates in PC and server processors, graphics cards, and AI accelerators, and trades in the US market.",
  "الأسهم الأمريكية": "US stocks",
  "الفوركس": "Forex",
  "العملات الرقمية": "Crypto",
  "السلع": "Commodities",
  "أسواق الخليج": "Gulf markets",
  "السوق السعودي": "Saudi market",
  "بورصة الكويت": "Kuwait market",
  "السوق الإماراتي": "UAE market",
  "السوق القطري": "Qatar market",
  "السوق البحريني": "Bahrain market",
  "السوق العماني": "Oman market",
  "الأسهم الأوروبية": "European stocks",
  "الأسهم الآسيوية": "Asian stocks",
  "أسهم التقنية": "Technology stocks",
  "الأسهم الغذائية": "Food / consumer staples",
  "الأسهم الدوائية": "Pharmaceutical / healthcare",
  "أسهم البنوك": "Banking stocks",
  "أسهم الطاقة": "Energy stocks",
  "أسهم الذكاء الاصطناعي": "AI stocks",
  "أسهم أشباه الموصلات": "Semiconductor stocks",
  "قائمة مخصصة": "Custom list",
  "رمز مضاف من قائمة المراقبة، وقد يحتاج مزود بيانات يدعمه بشكل مباشر.": "A watchlist symbol that may require a provider with direct support.",
  "السوق مغلق الآن؛ راقب الإشارة عند الافتتاح ولا تدخل قبل ظهور أسعار حية.": "The market is closed now; monitor the signal at the open and do not enter before live prices appear."
};
const detailOriginalTextByNode = new WeakMap();
const DETAIL_TRANSLATABLE_ATTRS = ["placeholder", "title", "aria-label"];
const DETAIL_TEXT_TRANSLATION_ENTRIES = Object.entries({ ...DETAIL_TEXT_TRANSLATIONS, ...DETAIL_EXTRA_TEXT_TRANSLATIONS })
  .sort((a, b) => b[0].length - a[0].length);
const DETAIL_COMMON_TERM_TRANSLATIONS = [
  ["غير مطابق", "Not compliant"],
  ["مختلف عليه", "Doubtful"],
  ["مطابق", "Compliant"],
  ["شراء", "Buy"],
  ["بيع", "Sell"],
  ["انتظار", "Wait"],
  ["اشتر الآن", "Buy now"],
  ["بيع الآن", "Sell now"],
  ["ثقة", "confidence"],
  ["تغطية", "coverage"],
  ["الفريمات", "timeframes"],
  ["الأهداف", "targets"],
  ["الهدف", "target"],
  ["السعر", "price"],
  ["السوق", "market"],
  ["التحليل", "analysis"],
  ["المخاطرة", "risk"],
  ["منخفضة", "low"],
  ["متوسطة", "medium"],
  ["عالية", "high"],
  ["قوي جداً", "very strong"],
  ["قوي", "strong"],
  ["متوسط", "medium"],
  ["ضعيف", "weak"],
  ["يوم", "days"],
  ["شهر", "month"],
  ["شهرين", "2 months"],
  ["3 شهور", "3 months"]
].sort((a, b) => b[0].length - a[0].length);
const DETAIL_ENGLISH_PHRASE_TO_ARABIC = [
  [/\bCompliant\s+للشريعة/gi, "مطابق للشريعة"],
  [/\bNot\s+compliant\s+للشريعة/gi, "غير مطابق للشريعة"],
  [/\bDoubtful\s+للشريعة/gi, "مختلف عليه شرعياً"],
  [/\blow\s+مخاطرة/gi, "مخاطرة منخفضة"],
  [/\bmedium\s+مخاطرة/gi, "مخاطرة متوسطة"],
  [/\bhigh\s+مخاطرة/gi, "مخاطرة مرتفعة"],
  [/\bMarket\s+الأمريكي/gi, "السوق الأمريكي"],
  [/\bmarket\s+الأمريكي/gi, "السوق الأمريكي"],
  [/ضغط\s*Sell\s*ي/gi, "ضغط بيعي"],
  [/زخم\s*Sell\s*ي/gi, "زخم بيعي"],
  [/اتجاه\s*Sell\s*ي/gi, "اتجاه بيعي"],
  [/ضغط\s*Buy\s*ي/gi, "ضغط شرائي"],
  [/زخم\s*Buy\s*ي/gi, "زخم شرائي"],
  [/اتجاه\s*Buy\s*ي/gi, "اتجاه شرائي"],
  [/\bSell\s*ي/gi, "بيعي"],
  [/\bBuy\s*ي/gi, "شرائي"]
];
const DETAIL_ENGLISH_TERM_TO_ARABIC = [
  ["Strong sell signal", "إشارة بيع قوية"],
  ["Strong buy signal", "إشارة شراء قوية"],
  ["Clear sell signal", "إشارة بيع واضحة"],
  ["Do not trade this stock now", "لا تتداول هذا السهم الآن"],
  ["Timeframe agreement", "توافق الفريمات"],
  ["Risk notes", "ملاحظات المخاطرة"],
  ["Provider note", "ملاحظة المزود"],
  ["Market status", "حالة السوق"],
  ["Relative volume", "حجم التداول النسبي"],
  ["Analysis quality", "جودة التحليل"],
  ["Data health", "صحة البيانات"],
  ["Execution plan", "خطة التنفيذ"],
  ["Average return", "متوسط العائد"],
  ["Test horizon", "أفق الاختبار"],
  ["Win rate", "معدل النجاح"],
  ["Very strong", "قوي جداً"],
  ["Strong Sell", "بيع قوي"],
  ["Strong Buy", "شراء قوي"],
  ["Not compliant", "غير مطابق"],
  ["Compliant", "مطابق"],
  ["Doubtful", "مختلف عليه"],
  ["Sell now", "بيع الآن"],
  ["Buy now", "اشتر الآن"],
  ["Sideways", "عرضي"],
  ["Bullish", "صاعد"],
  ["Bearish", "هابط"],
  ["Neutral", "محايد"],
  ["Americas", "الأمريكيتان"],
  ["America", "أمريكا"],
  ["Europe", "أوروبا"],
  ["Asia", "آسيا"],
  ["Gulf", "الخليج"],
  ["Global", "عالمي"],
  ["Confidence", "الثقة"],
  ["confidence", "الثقة"],
  ["coverage", "التغطية"],
  ["timeframes", "الفريمات"],
  ["timeframe", "الفريم"],
  ["targets", "الأهداف"],
  ["target", "الهدف"],
  ["price", "السعر"],
  ["Market", "السوق"],
  ["market", "السوق"],
  ["Exchange", "البورصة"],
  ["Region", "المنطقة"],
  ["Currency", "العملة"],
  ["Source", "المصدر"],
  ["Risk", "المخاطرة"],
  ["risk", "المخاطرة"],
  ["Strong", "قوي"],
  ["strong", "قوي"],
  ["Medium", "متوسط"],
  ["medium", "متوسط"],
  ["Weak", "ضعيف"],
  ["weak", "ضعيف"],
  ["High", "مرتفع"],
  ["high", "مرتفع"],
  ["Low", "منخفض"],
  ["low", "منخفض"],
  ["Buy", "شراء"],
  ["buy", "شراء"],
  ["Sell", "بيع"],
  ["sell", "بيع"],
  ["Hold", "انتظار"],
  ["hold", "انتظار"],
  ["Wait", "انتظار"],
  ["wait", "انتظار"],
  ["Trend", "الاتجاه"],
  ["trend", "الاتجاه"]
].sort((a, b) => b[0].length - a[0].length);
const DETAIL_ACTION_LABELS = {
  buy: { ar: "شراء", en: "Buy" },
  sell: { ar: "بيع", en: "Sell" },
  hold: { ar: "انتظار", en: "Wait" }
};
const DETAIL_SHARIA_LABELS = {
  compliant: { ar: "مطابق للشريعة", en: "Sharia compliant" },
  not_compliant: { ar: "غير مطابق للشريعة", en: "Not Sharia compliant" },
  doubtful: { ar: "يحتاج مراجعة شرعية", en: "Requires Sharia review" },
  unknown: { ar: "غير معروف", en: "Unknown" }
};
const DETAIL_SHARIA_DESCRIPTIONS = {
  compliant: {
    ar: "مصنف داخلياً كمتوافق مع الشريعة حسب البيانات المتاحة في التطبيق.",
    en: "Internally classified as Sharia compliant based on the data available in the app."
  },
  not_compliant: {
    ar: "مصنف داخلياً كغير متوافق مع الشريعة، ويفضل تجنبه إذا كان شرطك الالتزام الشرعي.",
    en: "Internally classified as not Sharia compliant; it is better to avoid it if Sharia compliance is required."
  },
  doubtful: {
    ar: "التصنيف الشرعي غير محسوم في بيانات التطبيق ويحتاج مراجعة جهة فحص شرعي.",
    en: "The Sharia classification is not conclusive in the app data and requires review by a Sharia screening provider."
  },
  unknown: {
    ar: "لا يوجد تصنيف شرعي مؤكد لهذا الرمز داخل التطبيق حالياً.",
    en: "No confirmed Sharia classification is available for this symbol in the app right now."
  }
};
const DETAIL_RISK_LABELS = {
  low: { ar: "مخاطرة منخفضة", en: "Low risk" },
  medium: { ar: "مخاطرة متوسطة", en: "Medium risk" },
  high: { ar: "مخاطرة عالية", en: "High risk" }
};
const DETAIL_SCORE_LABELS = {
  veryStrong: { ar: "قوي جداً", en: "Very strong" },
  strong: { ar: "قوي", en: "Strong" },
  medium: { ar: "متوسط", en: "Medium" },
  weak: { ar: "ضعيف", en: "Weak" }
};
const DETAIL_TIMEFRAME_LABELS = {
  "1m": { ar: "دقيقة", en: "1 minute" },
  "15m": { ar: "15 دقيقة", en: "15 minutes" },
  "30m": { ar: "30 دقيقة", en: "30 minutes" },
  "1h": { ar: "ساعة", en: "1 hour" },
  "1d": { ar: "يومي", en: "Daily" },
  "1wk": { ar: "أسبوعي", en: "Weekly" },
  "1mo": { ar: "شهري", en: "Monthly" },
  "1y": { ar: "سنوي", en: "Yearly" }
};
const DETAIL_REGION_TRANSLATIONS = {
  Americas: "Americas",
  America: "America",
  Europe: "Europe",
  Asia: "Asia",
  GCC: "GCC",
  FX: "FX",
  Crypto: "Crypto",
  Commodities: "Commodities",
  Technology: "Technology",
  "Consumer Staples": "Consumer staples",
  Healthcare: "Healthcare",
  Financials: "Financials",
  Energy: "Energy",
  "AI / Cloud": "AI / Cloud",
  Semiconductors: "Semiconductors",
  Global: "Global",
  Custom: "Custom"
};
const DETAIL_ARABIC_PHRASE_PATTERNS = [
  [/راقب دخول قريب من\s+([\d.,]+)\.\s+الهدف الأول\s+([\d.,]+)\s+ووقف\s+(?:الخطر|الخسارة)\s+([\d.,]+)\./g, (_, entry, target, stop) => `Watch for an entry near ${entry}. First target ${target} and stop loss ${stop}.`],
  [/الإشارة تميل للبيع\. الهدف الأول\s+([\d.,]+)\s+ووقف الخطر\s+([\d.,]+)\./g, (_, target, stop) => `The signal leans sell. First target ${target} and risk stop ${stop}.`],
  [/^(.+?)\s+زوج عملات في سوق\s+(?:الفوركس|Forex)، ويتأثر بأسعار الفائدة، السيولة، وقوة العملات بين البلدين\.$/g, (_, name) => `${name} is a forex currency pair affected by interest rates, liquidity, and the relative strength of both currencies.`],
  [/^(.+?)\s+عقد آجل أو أصل سلعي يتداول في أسواق\s+(?:السلع|Commodities)\. يحتاج متابعة وقت الجلسة، السيولة، الأخبار الاقتصادية، وإدارة مخاطرة صارمة لأن الحركة قد تكون سريعة\.$/g, (_, name) => `${name} is a futures or commodity instrument traded in commodity markets. It requires monitoring session timing, liquidity, economic news, and strict risk management because moves can be fast.`],
  [/^(.+?)\s+أصل رقمي يتداول مقابل الدولار في سوق العملات الرقمية\. يتحرك عادة بتذبذب مرتفع ويتأثر بالسيولة، اتجاه Bitcoin، شهية المخاطرة، وأخبار التنظيم والمنصات\.$/g, (_, name) => `${name} is a digital asset traded against the US dollar in the crypto market. It usually moves with high volatility and is affected by liquidity, Bitcoin direction, risk appetite, and regulation or exchange news.`],
  [/^(.+?)\s+مؤشر يقيس حركة مجموعة من الأسهم داخل سوق أو قطاع محدد\. المؤشرات لا تمثل سهماً واحداً، لذلك تحليلها يعتمد على اتجاه السوق العام، السيولة، الأخبار الاقتصادية، وحركة الشركات القيادية داخل المؤشر\.$/g, (_, name) => `${name} is an index that tracks a group of stocks inside a market or sector. Index analysis depends on broad market direction, liquidity, economic news, and leading constituents.`],
  [/^(.+?)\s+رمز مالي يتداول في السوق المرتبط به\. للحصول على وصف تفصيلي أدق، اربطه بمزود بيانات أساسي أو ملف معلومات شركات\.$/g, (_, name) => `${name} is a listed financial instrument traded in its related market. For a more detailed description, connect it to a fundamental data provider or company profile source.`],
  [/القرار النهائي\s+(شراء|بيع|انتظار)\s+بعد دمج\s+(\d+)\s+فريمات من أصل\s+(\d+)/g, (_, action, used, total) => `Final decision: ${localizeActionLabel(action)} after combining ${used} of ${total} timeframes`],
  [/الفريمات السريعة:\s*([^؛.\n]+)/g, (_, value) => `Fast timeframes: ${localizeDetailText(value)}`],
  [/الفريمات الطويلة:\s*([^؛.\n]+)/g, (_, value) => `Long timeframes: ${localizeDetailText(value)}`],
  [/الأساسية:\s*([^.\n]+)/g, (_, value) => `Core timeframes: ${localizeDetailText(value).replaceAll("،", ",")}`],
  [/فريمات الدخول السريع:\s*([^.\n]+)/g, (_, value) => `Fast entry timeframes: ${localizeDetailText(value).replaceAll("،", ",")}`],
  [/يوجد تضارب:\s*([^؛.\n]+)/g, (_, value) => `Conflict detected: ${localizeDetailText(value)}`],
  [/تضارب بين\s+(?:الفريمات السريعة|Fast timeframes)\s+\(([\u0600-\u06ffA-Za-z]+)\)\s+و(?:الفريمات\s+)?الطويلة\s+\(([\u0600-\u06ffA-Za-z]+)\)/g, (_, fast, long) => `Conflict between fast timeframes (${localizeDetailText(fast)}) and long timeframes (${localizeDetailText(long)})`],
  [/نسبة\s+(?:توافق الفريمات|Timeframe agreement)\s+(\d+)%\s+و(?:الاتجاه|Trend)\s+العام\s+([\u0600-\u06ffA-Za-z]+)/g, (_, agreement, trend) => `Timeframe agreement is ${agreement}% and the overall trend is ${localizeDetailText(trend)}`],
  [/توافق الفريمات\s+(\d+)%\s+·\s+تغطية\s+(\d+)\/(\d+)/g, (_, agreement, coverage, total) => `Timeframe agreement ${agreement}% · coverage ${coverage}/${total}`],
  [/(\d+)%\s+ثقة/g, (_, confidence) => `${confidence}% confidence`],
  [/(\d+(?:\.\d+)?)%\s+نجاح/g, (_, winRate) => `${winRate}% win rate`],
  [/العائد إلى المخاطرة\s+([\d.]+)\.\s+انتظار تأكيد فريم 15 أو 30 دقيقة قبل الدخول\./g, (_, ratio) => `Risk/reward ratio ${ratio}. Wait for confirmation on the 15- or 30-minute timeframe before entry.`],
  [/العائد إلى المخاطرة\s+([\d.]+)\.\s+فريمات الدخول تدعم القرار\./g, (_, ratio) => `Risk/reward ratio ${ratio}. Entry timeframes support the decision.`],
  [/العائد إلى المخاطرة\s+([\d.]+)/g, (_, ratio) => `Risk/reward ratio ${ratio}`],
  [/خبر عالي التأثير على\s+([A-Z]{3}):\s+(.+?)\s+\((.+?)\)\. الأفضل انتظار ما بعد الخبر\./g, (_, currency, title, time) => `High-impact event on ${currency}: ${title} (${localizeDetailText(time)}). It is better to wait until after the event.`],
  [/يوجد خبر عالي على\s+([A-Z]{3}):\s+(.+?)\s+خلال\s+(.+?)؛ تم خفض الثقة ورفع الحذر\./g, (_, currency, title, time) => `High-impact event on ${currency}: ${title} in ${localizeDetailText(time)}; confidence was reduced and caution increased.`],
  [/يوجد خبر متوسط على\s+([A-Z]{3}):\s+(.+?)\s+خلال\s+(.+?)؛ راقب التذبذب\./g, (_, currency, title, time) => `Medium-impact event on ${currency}: ${title} in ${localizeDetailText(time)}; monitor volatility.`],
  [/(\d+)\s+إلى\s+(\d+)\s+أيام/g, (_, from, to) => `${from} to ${to} days`],
  [/(\d+)\s+إلى\s+(\d+)\s+أسابيع/g, (_, from, to) => `${from} to ${to} weeks`],
  [/(\d+)\s+يوم\s+إلى\s+(\d+)\s+أسابيع/g, (_, from, to) => `${from} day to ${to} weeks`],
  [/(\d+)\s+دقيقة\s+إلى\s+(\d+)\s+أسابيع/g, (_, from, to) => `${from} minutes to ${to} weeks`],
  [/خلال\s+(\d+)\s+دقيقة/g, (_, minutes) => `within ${minutes} minutes`],
  [/خلال\s+(\d+)\s+ساعة/g, (_, hours) => `within ${hours} hours`],
  [/خلال\s+(\d+)\s+يوم/g, (_, days) => `within ${days} days`]
];

const elements = {
  status: document.querySelector("#detail-status"),
  symbol: document.querySelector("#detail-symbol"),
  name: document.querySelector("#detail-name"),
  market: document.querySelector("#detail-market"),
  heading: document.querySelector("#detail-heading"),
  summary: document.querySelector("#detail-summary"),
  action: document.querySelector("#detail-action"),
  confidence: document.querySelector("#detail-confidence"),
  agreement: document.querySelector("#detail-agreement"),
  currentPrice: document.querySelector("#detail-current-price"),
  expectedPrice: document.querySelector("#detail-expected-price"),
  targetOne: document.querySelector("#detail-target-one"),
  targetTwo: document.querySelector("#detail-target-two"),
  stopLoss: document.querySelector("#detail-stop-loss"),
  support: document.querySelector("#detail-support"),
  resistance: document.querySelector("#detail-resistance"),
  riskReward: document.querySelector("#detail-risk-reward"),
  expectedMove: document.querySelector("#detail-expected-move"),
  duration: document.querySelector("#detail-duration"),
  score: document.querySelector("#detail-score"),
  risk: document.querySelector("#detail-risk"),
  quality: document.querySelector("#detail-quality"),
  dataHealth: document.querySelector("#detail-data-health"),
  decisionPanel: document.querySelector("#decision-panel"),
  decisionTitle: document.querySelector("#decision-title"),
  decisionMessage: document.querySelector("#decision-message"),
  decisionBadge: document.querySelector("#decision-badge"),
  generalInfo: document.querySelector("#general-info"),
  shariaBox: document.querySelector("#sharia-box"),
  timeframes: document.querySelector("#detail-timeframes"),
  outlook: document.querySelector("#outlook-detail-list"),
  reasons: document.querySelector("#detail-reasons"),
  sparkline: document.querySelector("#detail-sparkline"),
  backtest: document.querySelector("#backtest-detail"),
  back: document.querySelector(".detail-back")
};

applyDetailLanguage();
installLatinDigitNormalizer();
initMarketBackground();
initDetailBackButton();
registerPwaServiceWorker();
loadDetail();

function initDetailBackButton() {
  elements.back?.addEventListener("click", (event) => {
    event.preventDefault();
    try {
      sessionStorage.setItem("the-sfm-trader-skip-intro", "1");
    } catch {}

    try {
      const referrer = document.referrer ? new URL(document.referrer) : null;
      if (referrer?.origin === window.location.origin && history.length > 1) {
        history.back();
        return;
      }
    } catch {}

    window.location.href = "/?skipIntro=1#view-markets";
  });
}

function registerPwaServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {});
  });
}

async function loadDetail() {
  if (!symbol) {
    showError(detailText("لم يتم تحديد رمز السهم.", "No stock symbol was selected."));
    return;
  }

  try {
    elements.status.textContent = detailText("جاري تحليل السهم", "Analyzing the stock");
    applyDetailLanguage();
    const response = await fetch(`/api/asset?symbol=${encodeURIComponent(symbol)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(localizeDetailText(data.error || detailText("تعذر تحميل تفاصيل السهم", "Could not load stock details")));
    }

    renderDetail(data);
    elements.status.textContent = data.cached ? detailText("بيانات مخزنة لحظياً", "Live cached data") : detailText("تحليل جديد", "Fresh analysis");
    applyDetailLanguage();
  } catch (error) {
    showError(error.message);
  }
}

function renderDetail(data) {
  const item = data.recommendation;
  const profile = data.profile || {};
  const market = data.market || {};
  const finalScore = calculateFinalScore(item);
  const decision = item.decision || buildDecision(item);

  document.title = `${item.symbol} - the-sfm trader`;
  elements.symbol.textContent = item.symbol;
  elements.name.textContent = localizeInstrumentName(item.name);
  elements.market.textContent = `${localizeMarketLabel(profile, market)} · ${localizeDetailText(profile.exchangeName || item.exchangeName || "--")}`;
  elements.heading.textContent = `${localizeInstrumentName(item.name)} (${item.symbol})`;
  elements.summary.textContent = localizeDetailText(profile.summary || detailText("لا تتوفر معلومات وصفية كافية لهذا الرمز.", "Not enough descriptive information is available for this symbol."));

  elements.action.textContent = localizeActionLabel(item.action, item.actionLabel);
  elements.action.className = `action-badge action-${item.action}`;
  elements.confidence.textContent = localizeConfidenceText(item.confidence);
  elements.agreement.textContent = localizeAgreementText(item.timeframeConsensus);

  elements.currentPrice.textContent = formatMoney(item.currentPrice, item.currency);
  elements.expectedPrice.textContent = formatMoney(item.expectedPrice, item.currency);
  elements.targetOne.textContent = formatMoney(item.target1 || item.expectedPrice, item.currency);
  elements.targetTwo.textContent = formatMoney(item.target2, item.currency);
  elements.stopLoss.textContent = item.stopLoss ? formatMoney(item.stopLoss, item.currency) : "--";
  elements.support.textContent = formatMoney(item.support, item.currency);
  elements.resistance.textContent = formatMoney(item.resistance, item.currency);
  elements.riskReward.textContent = item.riskReward ? `${formatNumber(item.riskReward, { maximumFractionDigits: 2 })}:1` : "--";
  elements.expectedMove.textContent = formatPercent(item.expectedMovePct);
  elements.duration.textContent = localizeDetailText(item.duration);
  elements.score.textContent = `${finalScore.score}% · ${localizeScoreLabel(finalScore.label)}`;
  elements.risk.textContent = localizeRiskLabel(item.risk);
  elements.quality.textContent = item.analysisQuality ? `${item.analysisQuality.score}% · ${localizeDetailText(item.analysisQuality.label)}` : "--";
  elements.dataHealth.textContent = item.dataHealth ? `${item.dataHealth.score}% · ${localizeDetailText(item.dataHealth.label || "صحة البيانات")}` : "--";

  elements.decisionPanel.className = `decision-panel decision-${decision.kind}`;
  elements.decisionTitle.textContent = localizeDetailText(decision.title);
  elements.decisionMessage.textContent = localizeDetailText(decision.message);
  elements.decisionBadge.textContent = localizeDetailText(decision.badge);
  elements.decisionBadge.className = `decision-badge decision-${decision.kind}`;

  renderGeneralInfo(profile, market, item);
  renderSharia(profile);
  renderTimeframes(item.timeframes || []);
  renderOutlook(item);
  renderReasons(item.reasons || []);
  renderBacktest(item);
  drawSparkline(elements.sparkline, item.sparkline || [], item.action);
  applyDetailLanguage();
}

function renderGeneralInfo(profile, market, item) {
  elements.generalInfo.innerHTML = `
    ${renderInfoRow(detailText("الاختصاص", "Specialty"), localizeDetailText(profile.specialty || "--"))}
    ${renderInfoRow(detailText("السوق", "Market"), localizeMarketLabel(profile, market))}
    ${renderInfoRow(detailText("المنطقة", "Region"), localizeRegion(profile.region || market.region || "--"))}
    ${renderInfoRow(detailText("البورصة", "Exchange"), localizeDetailText(profile.exchangeName || item.exchangeName || "--"))}
    ${renderInfoRow(detailText("العملة", "Currency"), profile.currency || item.currency || "--")}
    ${renderInfoRow(detailText("حالة السوق", "Market status"), localizeDetailText(item.marketState || "--"))}
    ${renderInfoRow(detailText("ملاحظة المزود", "Provider note"), localizeDetailText(item.providerDelayNote || market.note || "--"))}
    ${renderInfoRow(detailText("حجم التداول النسبي", "Relative volume"), item.relativeVolume ? `${formatNumber(item.relativeVolume, { maximumFractionDigits: 2 })}x` : "--")}
    ${renderInfoRow("VWAP", item.indicators?.vwap ? formatMoney(item.indicators.vwap, item.currency) : "--")}
  `;
}

function renderSharia(profile) {
  const statusClass = profile.shariaStatus === "compliant" ? "buy" : profile.shariaStatus === "not_compliant" ? "sell" : "hold";
  elements.shariaBox.innerHTML = `
    <div class="sharia-status-detail ${statusClass}">
      <strong>${escapeHtml(localizeShariaLabel(profile))}</strong>
      <span>${escapeHtml(localizeShariaDescription(profile))}</span>
    </div>
    <div class="info-list">
      ${renderInfoRow(detailText("المصدر", "Source"), localizeDetailText(profile.shariaSource || "تصنيف داخلي قابل للتحديث"))}
      ${renderInfoRow(detailText("آخر مراجعة", "Last review"), profile.shariaCheckedAt || "--")}
    </div>
  `;
}

function renderTimeframes(timeframes) {
  const wanted = new Set(["1m", "15m", "30m", "1h", "1d", "1wk", "1mo"]);
  const frames = timeframes.filter((frame) => wanted.has(frame.id));

  if (!frames.length) {
    elements.timeframes.innerHTML = `<div class="empty">${escapeHtml(detailText("الفريمات غير مكتملة لهذا الرمز حالياً.", "Timeframes are currently incomplete for this symbol."))}</div>`;
    return;
  }

  elements.timeframes.innerHTML = frames.map((frame) => {
    const actionClass = frame.action === "buy" ? "buy" : frame.action === "sell" ? "sell" : "hold";
    return `
      <article class="timeframe-detail ${actionClass}">
        <div>
          <span>${escapeHtml(localizeTimeframeLabel(frame))}</span>
          <strong>${escapeHtml(localizeActionLabel(frame.action, frame.actionLabel))}</strong>
        </div>
        <div>
          <span>${escapeHtml(detailText("الثقة", "Confidence"))}</span>
          <strong>${frame.confidence}%</strong>
        </div>
        <div>
          <span>RSI</span>
          <strong>${frame.rsi14}</strong>
        </div>
        <div>
          <span>${escapeHtml(detailText("الزخم", "Momentum"))}</span>
          <strong>${formatPercent(frame.momentum20)}</strong>
        </div>
        <div>
          <span>${escapeHtml(detailText("الاتجاه", "Trend"))}</span>
          <strong>${escapeHtml(localizeDetailText(frame.trend))}</strong>
        </div>
      </article>
    `;
  }).join("");
}

function renderOutlook(item) {
  const outlook = item.upsideOutlook || [];
  if (!outlook.length) {
    elements.outlook.innerHTML = `<div class="empty">${escapeHtml(detailText("لا توجد أهداف شهرية متاحة لهذا الرمز.", "No monthly targets are available for this symbol."))}</div>`;
    return;
  }

  elements.outlook.innerHTML = outlook.map((entry) => `
    <article class="outlook-detail-item">
      <span>${escapeHtml(localizeDetailText(entry.label))}</span>
      <strong>${formatMoney(entry.targetPrice, item.currency)}</strong>
      <em>${formatPercent(entry.movePct)} · ${localizeConfidenceText(entry.confidence)}</em>
    </article>
  `).join("");
}

function renderReasons(reasons) {
  elements.reasons.innerHTML = reasons.length
    ? reasons.map((reason) => `<li>${escapeHtml(localizeDetailText(reason))}</li>`).join("")
    : `<li>${escapeHtml(detailText("لا توجد أسباب كافية لهذا الرمز حالياً.", "No sufficient reasons are available for this symbol right now."))}</li>`;
}

function renderBacktest(item) {
  elements.backtest.innerHTML = `
    ${renderInfoRow(detailText("معدل النجاح", "Win rate"), item.backtest?.winRate ? `${item.backtest.winRate}%` : localizeDetailText(item.backtest?.label || "--"))}
    ${renderInfoRow(detailText("عدد العينات", "Samples"), item.backtest?.samples ?? "--")}
    ${renderInfoRow(detailText("أفق الاختبار", "Test horizon"), item.backtest?.horizonDays ? detailText(`${item.backtest.horizonDays} يوم`, `${item.backtest.horizonDays} days`) : "--")}
    ${renderInfoRow(detailText("متوسط العائد", "Average return"), Number.isFinite(item.backtest?.avgReturnPct) ? formatPercent(item.backtest.avgReturnPct) : "--")}
    ${renderInfoRow(detailText("جودة التحليل", "Analysis quality"), item.analysisQuality ? `${item.analysisQuality.score}% · ${localizeDetailText(item.analysisQuality.label)}` : "--")}
    ${renderInfoRow(detailText("خطة التنفيذ", "Execution plan"), localizeDetailText(item.tradePlan?.note || "--"))}
    ${renderInfoRow(detailText("ملاحظات المخاطرة", "Risk notes"), localizeJoinedList(item.risk?.notes, "--"))}
  `;
}

function buildDecision(item) {
  const agreement = item.timeframeConsensus?.agreementPct || 0;

  if (item.action === "buy" && item.confidence >= 70 && agreement >= 60 && item.risk?.level !== "high") {
    return {
      kind: "buy",
      badge: detailText("اشتر الآن", "Buy now"),
      title: detailText("إشارة شراء قوية", "Strong buy signal"),
      message: detailText(
        `الفريمات متوافقة بنسبة ${agreement}% والثقة ${item.confidence}%. راقب السعر والهدف قبل التنفيذ.`,
        `Timeframes agree by ${agreement}% and confidence is ${item.confidence}%. Watch price and target before execution.`
      )
    };
  }

  if (item.action === "sell" && item.confidence >= 65) {
    return {
      kind: "sell",
      badge: detailText("بيع الآن", "Sell now"),
      title: detailText("إشارة بيع واضحة", "Clear sell signal"),
      message: detailText(
        `الاتجاه يميل للبيع بثقة ${item.confidence}%. تجنب الدخول الشرائي حتى تتغير الفريمات.`,
        `The trend leans sell with ${item.confidence}% confidence. Avoid long entry until the timeframes change.`
      )
    };
  }

  return {
    kind: "hold",
    badge: detailText("انتظر", "Wait"),
    title: detailText("لا تتداول هذا السهم الآن", "Do not trade this instrument now"),
    message: detailText(
      "الإشارات غير كافية أو متضاربة. الأفضل الانتظار حتى تتوافق فريمات الدخول مع اليومي.",
      "Signals are insufficient or conflicting. It is better to wait until entry timeframes align with the daily."
    )
  };
}

function renderInfoRow(label, value) {
  return `
    <div class="info-row">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function showError(message) {
  elements.status.textContent = detailText("تعذر التحميل", "Loading failed");
  document.querySelector("#detail-content").innerHTML = `<div class="empty">${escapeHtml(localizeDetailText(message))}</div>`;
  applyDetailLanguage();
}

function calculateFinalScore(item) {
  const confidencePoints = clamp(Number(item.confidence || 0), 0, 100) * 0.35;
  const agreementPoints = clamp(Number(item.timeframeConsensus?.agreementPct || 0), 0, 100) * 0.15;
  const shariaPoints = {
    compliant: 20,
    doubtful: 8,
    unknown: 4,
    not_compliant: 0
  }[item.shariaStatus] ?? 4;
  const riskPoints = {
    low: 15,
    medium: 9,
    high: 3
  }[item.risk?.level] ?? 8;
  const winRate = Number(item.backtest?.winRate);
  const backtestPoints = Number.isFinite(winRate) ? clamp(winRate * 0.1, 0, 10) : 4;
  const movePoints = clamp(Math.abs(Number(item.expectedMovePct || 0)) * 1.2, 0, 5);
  const qualityPoints = clamp(Number(item.analysisQuality?.score || 0), 0, 100) * 0.08;
  const riskRewardPoints = clamp(Number(item.riskReward || 0), 0, 3) * 2;
  const conflictPenalty = item.timeframeConsensus?.conflict ? 6 : 0;
  const score = Math.round(clamp(confidencePoints + agreementPoints + shariaPoints + riskPoints + backtestPoints + movePoints + qualityPoints + riskRewardPoints - conflictPenalty, 0, 100));
  const label = score >= 80 ? "قوي جداً" : score >= 70 ? "قوي" : score >= 55 ? "متوسط" : "ضعيف";

  return { score, label };
}

function drawSparkline(canvas, values = [], action) {
  const context = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, rect.width, rect.height);

  const data = values.filter(Number.isFinite);
  if (data.length < 2) return;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 16;
  const width = rect.width - pad * 2;
  const height = rect.height - pad * 2;
  const lineColor = action === "sell" ? "#ff6b6b" : action === "hold" ? "#91a7ff" : "#65d98d";

  context.strokeStyle = "rgba(135, 154, 172, 0.18)";
  context.lineWidth = 1;
  for (let index = 1; index <= 3; index += 1) {
    const y = pad + (height / 4) * index;
    context.beginPath();
    context.moveTo(pad, y);
    context.lineTo(rect.width - pad, y);
    context.stroke();
  }

  context.strokeStyle = lineColor;
  context.lineWidth = 2.5;
  context.beginPath();
  data.forEach((value, index) => {
    const x = pad + (index / (data.length - 1)) * width;
    const y = pad + height - ((value - min) / range) * height;
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.stroke();
}

function getDetailSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(APP_SETTINGS_STORAGE_KEY) || "{}");
    return {
      language: normalizeDetailLocale(saved?.language)
    };
  } catch {
    return { language: "ar" };
  }
}

function normalizeDetailLocale(value) {
  const locale = String(value || "").trim().toLowerCase().slice(0, 2);
  return ["ar", "en", "fr"].includes(locale) ? locale : "ar";
}

function getDetailLanguage() {
  return normalizeDetailLocale(getDetailSettings().language);
}

function isDetailEnglishLanguage() {
  return ["en", "fr"].includes(getDetailLanguage());
}

function detailText(arabic, english) {
  return isDetailEnglishLanguage() ? english : arabic;
}

function localizeDetailText(value, fallback = "--") {
  if (value === null || value === undefined || value === "") return fallback;
  const text = String(value);
  return isDetailEnglishLanguage()
    ? translateDetailArabicToEnglish(text)
    : translateDetailEnglishToArabic(text);
}

function localizeActionLabel(actionOrLabel, fallbackLabel = "") {
  const key = String(actionOrLabel || "").trim().toLowerCase();
  const normalized = key === "شراء" || key === "buy" ? "buy" : key === "بيع" || key === "sell" ? "sell" : key === "انتظار" || key === "hold" || key === "wait" ? "hold" : "";
  const labels = normalized ? DETAIL_ACTION_LABELS[normalized] : null;
  if (labels) return detailText(labels.ar, labels.en);
  return localizeDetailText(fallbackLabel || actionOrLabel || DETAIL_ACTION_LABELS.hold.ar);
}

function localizeRiskLabel(risk) {
  const level = risk?.level || "";
  if (DETAIL_RISK_LABELS[level]) return detailText(DETAIL_RISK_LABELS[level].ar, DETAIL_RISK_LABELS[level].en);
  return localizeDetailText(risk?.label || "--");
}

function localizeScoreLabel(label) {
  const text = String(label || "");
  if (text === DETAIL_SCORE_LABELS.veryStrong.ar || /very strong/i.test(text)) return detailText(DETAIL_SCORE_LABELS.veryStrong.ar, DETAIL_SCORE_LABELS.veryStrong.en);
  if (text === DETAIL_SCORE_LABELS.strong.ar || /^strong$/i.test(text)) return detailText(DETAIL_SCORE_LABELS.strong.ar, DETAIL_SCORE_LABELS.strong.en);
  if (text === DETAIL_SCORE_LABELS.medium.ar || /^medium$/i.test(text)) return detailText(DETAIL_SCORE_LABELS.medium.ar, DETAIL_SCORE_LABELS.medium.en);
  if (text === DETAIL_SCORE_LABELS.weak.ar || /^weak$/i.test(text)) return detailText(DETAIL_SCORE_LABELS.weak.ar, DETAIL_SCORE_LABELS.weak.en);
  return localizeDetailText(text || DETAIL_SCORE_LABELS.weak.ar);
}

function localizeTimeframeLabel(frame) {
  const labels = DETAIL_TIMEFRAME_LABELS[frame?.id];
  if (labels) return detailText(labels.ar, labels.en);
  return localizeDetailText(frame?.label || "--");
}

function localizeShariaLabel(profile) {
  const status = profile?.shariaStatus || "unknown";
  if (DETAIL_SHARIA_LABELS[status]) return detailText(DETAIL_SHARIA_LABELS[status].ar, DETAIL_SHARIA_LABELS[status].en);
  return localizeDetailText(profile?.shariaLabel || DETAIL_SHARIA_LABELS.unknown.ar);
}

function localizeShariaDescription(profile) {
  const status = profile?.shariaStatus || "unknown";
  if (DETAIL_SHARIA_DESCRIPTIONS[status]) {
    return detailText(DETAIL_SHARIA_DESCRIPTIONS[status].ar, DETAIL_SHARIA_DESCRIPTIONS[status].en);
  }
  return localizeDetailText(profile?.shariaDescription || DETAIL_SHARIA_DESCRIPTIONS.unknown.ar);
}

function localizeMarketLabel(profile, market) {
  if (isDetailEnglishLanguage()) {
    return localizeDetailText(market.labelEn || profile.marketLabelEn || profile.marketLabel || market.label || "--");
  }
  return localizeDetailText(profile.marketLabel || market.label || "--");
}

function localizeRegion(value) {
  if (!value) return "--";
  const text = String(value);
  if (isDetailEnglishLanguage() && DETAIL_REGION_TRANSLATIONS[text]) return DETAIL_REGION_TRANSLATIONS[text];
  return localizeDetailText(text);
}

function localizeConfidenceText(value) {
  return detailText(`${value}% ثقة`, `${value}% confidence`);
}

function localizeAgreementText(consensus = {}) {
  const agreement = consensus.agreementPct || 0;
  const coverage = consensus.coverage || 0;
  const total = consensus.total || 0;
  return detailText(
    `توافق الفريمات ${agreement}% · تغطية ${coverage}/${total}`,
    `Timeframe agreement ${agreement}% · coverage ${coverage}/${total}`
  );
}

function localizeJoinedList(values, fallback = "--") {
  const list = (values || []).map((value) => localizeDetailText(value)).filter(Boolean);
  if (!list.length) return fallback;
  return list.join(isDetailEnglishLanguage() ? ", " : "، ");
}

function localizeInstrumentName(name) {
  return localizeDetailText(name || "--");
}

function applyDetailLanguage() {
  const language = getDetailLanguage();
  const ltr = ["en", "fr"].includes(language);
  document.documentElement.lang = language;
  document.documentElement.dir = ltr ? "ltr" : "rtl";
  document.body?.classList.toggle("language-en", ltr);
  translateDetailInterface();
}

function translateDetailInterface(root = document.body) {
  if (!root) return;

  const textWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent || shouldSkipDetailTranslation(parent)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const textNodes = [];
  while (textWalker.nextNode()) textNodes.push(textWalker.currentNode);
  textNodes.forEach(translateDetailTextNode);

  const elementsToTranslate = root.nodeType === Node.ELEMENT_NODE
    ? [root, ...root.querySelectorAll("*")]
    : Array.from(root.querySelectorAll?.("*") || []);
  elementsToTranslate.forEach(translateDetailElementAttributes);
}

function translateDetailTextNode(node) {
  const english = isDetailEnglishLanguage();
  const currentText = node.nodeValue || "";

  if (english) {
    if (detailHasArabicText(currentText)) detailOriginalTextByNode.set(node, currentText);
    const originalText = detailOriginalTextByNode.get(node) || currentText;
    node.nodeValue = detailHasArabicText(originalText)
      ? translateDetailArabicToEnglish(originalText)
      : originalText;
    return;
  }

  if (detailOriginalTextByNode.has(node)) {
    node.nodeValue = translateDetailEnglishToArabic(detailOriginalTextByNode.get(node));
    return;
  }

  node.nodeValue = translateDetailEnglishToArabic(currentText);
}

function translateDetailElementAttributes(element) {
  if (shouldSkipDetailTranslation(element)) return;

  const english = isDetailEnglishLanguage();
  for (const attr of DETAIL_TRANSLATABLE_ATTRS) {
    if (!element.hasAttribute(attr)) continue;

    const datasetKey = `original${toDetailDatasetSuffix(attr)}`;
    const currentValue = element.getAttribute(attr) || "";

    if (english) {
      if (detailHasArabicText(currentValue)) element.dataset[datasetKey] = currentValue;
      const originalValue = element.dataset[datasetKey] || currentValue;
      if (detailHasArabicText(originalValue)) {
        element.setAttribute(attr, translateDetailArabicToEnglish(originalValue));
      }
      continue;
    }

    const originalValue = element.dataset[datasetKey] || currentValue;
    element.setAttribute(attr, translateDetailEnglishToArabic(originalValue));
  }
}

function shouldSkipDetailTranslation(element) {
  return ["SCRIPT", "STYLE", "CANVAS", "SVG", "PATH"].includes(element.tagName);
}

function translateDetailArabicToEnglish(text) {
  if (!detailHasArabicText(text)) return text;

  const leading = text.match(/^\s*/)?.[0] || "";
  const trailing = text.match(/\s*$/)?.[0] || "";
  const coreText = text.trim();
  let translated = DETAIL_TEXT_TRANSLATIONS[coreText] || DETAIL_EXTRA_TEXT_TRANSLATIONS[coreText] || coreText;

  for (const [pattern, replacer] of DETAIL_ARABIC_PHRASE_PATTERNS) {
    translated = translated.replace(pattern, replacer);
  }

  if (translated === coreText) {
    for (const [arabic, english] of DETAIL_TEXT_TRANSLATION_ENTRIES) {
      if (translated.includes(arabic)) translated = replaceDetailArabicTerm(translated, arabic, english);
    }
  }

  for (const [pattern, replacer] of DETAIL_ARABIC_PHRASE_PATTERNS) {
    translated = translated.replace(pattern, replacer);
  }

  for (const [arabic, english] of DETAIL_COMMON_TERM_TRANSLATIONS) {
    if (translated.includes(arabic)) translated = replaceDetailArabicTerm(translated, arabic, english);
  }

  translated = translated
    .replace(/\s+\. /g, ". ")
    .replace(/\s+،\s+/g, ", ")
    .replace(/;\s*;/g, ";")
    .replace(/العائد إلى Risk\s+([\d.]+)\.\s+Wait\s+تأكيد فريم 15 أو 30 minutes قبل الدخول\.?/g, "Risk/reward ratio $1. Wait for confirmation on the 15- or 30-minute timeframe before entry.")
    .replace(/Wait\s+تأكيد فريم 15 أو 30 minutes قبل الدخول\.?/g, "Wait for confirmation on the 15- or 30-minute timeframe before entry.")
    .replace(/تأكيد فريم 15 أو 30 minutes قبل الدخول\.?/g, "confirmation on the 15- or 30-minute timeframe before entry.")
    .replace(/لا توجد صفقة واضحة؛\s*Wait\s+Timeframe agreement\.?/g, "No clear trade is available; wait for timeframe agreement.")
    .replace(/تضارب بين Fast timeframes \(([^)]+)\) والطويلة \(([^)]+)\)/g, (_, fast, long) => `Conflict between fast timeframes (${localizeDetailText(fast)}) and long timeframes (${localizeDetailText(long)})`)
    .replace(/\bWait\s+حتى\b/g, "Wait until")
    .replace(/\bBuy\s+ي\b/g, "buying")
    .replace(/\bSell\s+ي\b/g, "selling");

  return `${leading}${translated}${trailing}`;
}

function replaceDetailArabicTerm(text, arabic, english) {
  const escaped = escapeDetailRegExp(arabic);
  const pattern = new RegExp(`(^|[^\\p{Script=Arabic}])${escaped}(?=$|[^\\p{Script=Arabic}])`, "gu");
  return String(text).replace(pattern, (_, prefix) => `${prefix}${english}`);
}

function translateDetailEnglishToArabic(text) {
  let translated = String(text ?? "");
  if (!/[A-Za-z]/.test(translated)) return translated;

  for (const [pattern, arabic] of DETAIL_ENGLISH_PHRASE_TO_ARABIC) {
    translated = translated.replace(pattern, arabic);
  }

  for (const [english, arabic] of DETAIL_ENGLISH_TERM_TO_ARABIC) {
    translated = replaceDetailLatinTerm(translated, english, arabic);
  }

  return translated
    .replace(/مخاطرة\s+مرتفع/g, "مخاطرة مرتفعة")
    .replace(/مخاطرة\s+متوسط/g, "مخاطرة متوسطة")
    .replace(/مخاطرة\s+منخفض/g, "مخاطرة منخفضة")
    .replace(/قوي جدا/g, "قوي جداً")
    .replace(/الثقة\s+الفريمات/g, "ثقة الفريمات")
    .replace(/السوق\s+status/gi, "حالة السوق")
    .replace(/analysis\s+quality/gi, "جودة التحليل");
}

function replaceDetailLatinTerm(text, english, arabic) {
  const pattern = new RegExp(`(^|[^A-Za-z])${escapeDetailRegExp(english)}(?=$|[^A-Za-z])`, "g");
  return text.replace(pattern, (_, prefix) => `${prefix}${arabic}`);
}

function escapeDetailRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function detailHasArabicText(text) {
  return /[\u0600-\u06ff]/.test(String(text || ""));
}

function toDetailDatasetSuffix(attr) {
  return attr
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

window.addEventListener("storage", (event) => {
  if (event.key === APP_SETTINGS_STORAGE_KEY) applyDetailLanguage();
});

function initMarketBackground() {
  const canvas = document.querySelector("#market-bg");
  const context = canvas.getContext("2d");
  const rows = Array.from({ length: 8 }, (_, index) => ({
    y: 80 + index * 92,
    phase: Math.random() * 100,
    speed: 0.35 + Math.random() * 0.45,
    color: index % 3 === 0 ? "53, 194, 164" : index % 3 === 1 ? "255, 107, 107" : "90, 167, 255"
  }));

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function frame() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.strokeStyle = "rgba(135, 154, 172, 0.055)";
    for (let x = 0; x < window.innerWidth; x += 72) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, window.innerHeight);
      context.stroke();
    }

    for (const row of rows) {
      row.phase += row.speed;
      context.strokeStyle = `rgba(${row.color}, 0.2)`;
      context.beginPath();
      for (let x = -20; x <= window.innerWidth + 20; x += 18) {
        const wave = Math.sin((x + row.phase * 3) * 0.012) * 18 + Math.cos((x - row.phase) * 0.027) * 9;
        const y = (row.y + row.phase * 0.12 + wave) % (window.innerHeight + 120);
        if (x === -20) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
    }

    window.requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  resize();
  frame();
}

function formatMoney(value, currency) {
  if (value === null || value === undefined || value === "") return "--";
  const number = Number(value);
  if (!Number.isFinite(number)) return "--";
  const normalizedCurrency = normalizeCurrencyCode(currency);
  const digits = Math.abs(number) < 1 ? 4 : 2;
  return `${formatNumber(number, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })}${normalizedCurrency ? ` ${normalizedCurrency}` : ""}`;
}

function normalizeCurrencyCode(currency) {
  const code = String(currency || "").trim().toUpperCase();
  const currencyMap = {
    KWF: "KWD",
    KW: "KWD",
    KWD: "KWD",
    SAR: "SAR",
    SA: "SAR",
    AED: "AED",
    AE: "AED",
    QAR: "QAR",
    QA: "QAR",
    BHD: "BHD",
    BH: "BHD",
    OMR: "OMR",
    OM: "OMR",
    USD: "USD",
    EUR: "EUR",
    GBP: "GBP"
  };
  return currencyMap[code] || code;
}

function formatPercent(value) {
  const number = Number(value || 0);
  const prefix = number > 0 ? "+" : "";
  return `${prefix}${formatNumber(number, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}%`;
}

function formatNumber(value, options = {}) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "--";
  return normalizeDigits(number.toLocaleString(NUMBER_LOCALE, {
    ...NUMBER_OPTIONS,
    ...options
  }));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}
